import amqplib, { Channel, Connection, Options } from 'amqplib';
import { RoutingKey } from './routing.keys';
import { newProductQueue } from './queues';
import { IProduct } from '../../interface/product.interface';
import domainEvents from '../../domain/events/domain.events';
import { NewProduct } from '../../domain/models/new.product';

type Exchange = 'warehouses.exchange';

export class RabbitMQClient {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  constructor() {}

  public async connect(url: string): Promise<void> {
    try {
      this.connection = await amqplib.connect(url);
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ...');
      await this.config();
      console.log('Configured...');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  private async config() {
    if (this.channel) {
      try {
        await this.channel.assertExchange('warehouses.exchange', 'topic');

        // consume products
        const { name, exchange, key } = newProductQueue;
        await this.channel.assertQueue(name, {
          durable: true,
        });
        await this.channel.bindQueue(name, exchange, key);
        this.channel.consume(
          name,
          (msg) => {
            if (msg) {
              const product = JSON.parse(msg.content.toString()) as IProduct;
              domainEvents.emit(
                'NewProduct',
                new NewProduct({
                  quantity: product.quantity,
                  warehouseId: product.warehouseId,
                })
              );
              this.channel!.ack(msg);
            }
          },
          { noAck: false }
        );
      } catch (err) {
        console.log(err);
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
