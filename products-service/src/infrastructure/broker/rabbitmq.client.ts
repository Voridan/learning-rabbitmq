import amqplib, { Channel, ConfirmChannel, Connection, Options } from 'amqplib';
import { RoutingKey } from './routing.keys';
import { newOrderQueue, newWarehouseQueue, unroutedOrderQueue } from './queues';
import domainEvents from '../../domain/events/domain.events';
import { IWarehouse } from '../../interface/warehouse.interface';
import { Warehouse } from '../../domain/models/warehouse/warehouse.model';
import { NewWarehouse } from '../../domain/models/warehouse/new.warehouse';

type Exchange =
  | 'warehouses.exchange'
  | 'products.exchange'
  | 'new-order.exchange';

export class RabbitMQClient {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private confirmChannel: ConfirmChannel | null = null;

  constructor() {}

  public async connect(url: string): Promise<void> {
    try {
      this.connection = await amqplib.connect(url);
      this.channel = await this.connection.createChannel();
      this.confirmChannel = await this.connection.createConfirmChannel();
      console.log('Connected to RabbitMQ...');
      await this.config();
      await this.configOrders();
      await this.consumeWarehouses();
      console.log('Configured...');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  private async config() {
    if (this.channel) {
      try {
        // assert exchang for products
        await this.channel.assertExchange('products.exchange', 'topic');
      } catch (error) {
        console.log('From Rabbitmq Client...  ', error);
      }
    }
  }

  private async configOrders() {
    if (this.confirmChannel) {
      await this.confirmChannel.assertExchange(
        unroutedOrderQueue.exchange,
        'direct',
        {
          durable: true,
        }
      );
      await this.confirmChannel.assertExchange(
        newOrderQueue.exchange,
        'direct',
        {
          durable: true,
          alternateExchange: unroutedOrderQueue.exchange,
        }
      );
      await this.confirmChannel.assertQueue(unroutedOrderQueue.name, {
        durable: true,
        arguments: {
          'x-queue-type': 'quorum',
          'x-single-active-consumer': true,
        },
      });
      await this.confirmChannel.assertQueue(newOrderQueue.name, {
        durable: true,
        arguments: {
          'x-queue-type': 'quorum',
          'x-single-active-consumer': true,
        },
      });
      await this.confirmChannel.bindQueue(
        newOrderQueue.name,
        newOrderQueue.exchange,
        newOrderQueue.key
      );
      await this.confirmChannel.bindQueue(
        unroutedOrderQueue.name,
        unroutedOrderQueue.exchange,
        unroutedOrderQueue.key
      );
    }
  }

  private async consumeWarehouses() {
    if (this.channel) {
      try {
        await this.channel.assertQueue(newWarehouseQueue.name, {
          durable: true,
        });
        await this.channel.bindQueue(
          newWarehouseQueue.name,
          newWarehouseQueue.exchange,
          newWarehouseQueue.key
        );
        await this.channel.consume(
          newWarehouseQueue.name,
          (msg) => {
            if (msg) {
              const payload = JSON.parse(msg.content.toString()) as IWarehouse;
              domainEvents.emit('NewWarehouse', {
                payload: new NewWarehouse(Warehouse.map(payload)),
                ack: () => {
                  console.log('acking msg %s', msg);
                  this.channel?.ack(msg);
                },
              });
            }
          },
          {
            noAck: false,
          }
        );
      } catch (error) {
        console.log('Error on warehouse consuption.', (error as Error).message);
      }
    }
  }

  public publish(
    exchange: Exchange,
    routingKey: RoutingKey,
    payload: Buffer,
    options: Options.Publish
  ) {
    return this.channel?.publish(exchange, routingKey, payload, options);
  }

  public confirmedPublish(
    exchange: Exchange,
    routingKey: RoutingKey,
    payload: Buffer,
    options: Options.Publish,
    confirmationCallback: (err: any) => void
  ) {
    return this.confirmChannel?.publish(
      exchange,
      routingKey,
      payload,
      options,
      confirmationCallback
    );
  }

  public async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('RabbitMQ connection closed');
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
      throw error;
    }
  }
}

const rabbitmq = new RabbitMQClient();

export default rabbitmq;
