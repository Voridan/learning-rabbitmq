import amqplib, { Channel, Connection } from 'amqplib';
import { newProductQueue, newWarehouseQueue } from './queues';
import domainEvents from '../../domain/events/domain.events';
import { NewWarehouse } from '../../domain/models/warehouse/new.warehouse';
import { Warehouse } from '../../domain/models/warehouse/warehouse.model';
import { IWarehouse } from '../../interface/warehouse.interface';
import { IProduct } from '../../interface/product.interface';
import { NewProduct } from '../../domain/models/product/new.product';
import { Product } from '../../domain/models/product/product.model';

export class RabbitMQClient {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private warehouseChannel: Channel | null = null;
  private productChannel: Channel | null = null;
  private ordersChannel: Channel | null = null;
  private transportChannel: Channel | null = null;
  private postChannel: Channel | null = null;

  constructor() {}

  public async connect(url: string): Promise<void> {
    try {
      this.connection = await amqplib.connect(url);
      this.warehouseChannel = await this.connection.createChannel();
      this.productChannel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ...');
      await this.config();
      console.log('Configured...');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  private async config() {
    try {
      await Promise.all([this.consumeWarehouses(), this.consumeProducts()]);
    } catch (error) {
      console.log('From Rabbitmq Client...  ', error);
    }
  }

  private async consumeWarehouses() {
    if (this.warehouseChannel) {
      const { name, exchange, key } = newWarehouseQueue;
      await this.warehouseChannel.assertQueue(name, {
        durable: true,
      });

      await this.warehouseChannel.bindQueue(name, exchange, key),
        await this.warehouseChannel.consume(
          name,
          (msg) => {
            if (msg) {
              console.log(
                'Consumed new warehouse: %s',
                msg?.content.toString()
              );
              const payload = JSON.parse(msg.content.toString()) as IWarehouse;
              domainEvents.emit('NewWarehouse', {
                payload: new NewWarehouse(Warehouse.map(payload)),
                ack: () => this.warehouseChannel?.ack(msg),
              });
            }
          },
          {
            noAck: false,
          }
        );
    }
  }

  private async consumeProducts() {
    if (this.productChannel) {
      const { name, exchange, key } = newProductQueue;
      await this.productChannel.assertQueue(name, { durable: true });
      await this.productChannel.bindQueue(name, exchange, key);
      this.productChannel.consume(
        name,
        (msg) => {
          if (msg) {
            console.log('Consumed new product: %s', msg?.content.toString());
            const payload = JSON.parse(msg.content.toString()) as IProduct;
            domainEvents.emit('NewProduct', {
              payload: new NewProduct(Product.map(payload)),
              ack: () => this.productChannel?.ack(msg),
            });
          }
        },
        { noAck: false }
      );
    }
  }

  public async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.warehouseChannel?.close();
      await this.postChannel?.close();
      await this.productChannel?.close();
      await this.ordersChannel?.close();
      await this.transportChannel?.close();
      console.log('RabbitMQ connection closed');
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
      throw error;
    }
  }
}

const rabbitmq = new RabbitMQClient();

export default rabbitmq;
