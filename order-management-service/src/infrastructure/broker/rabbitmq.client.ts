import amqplib, { Channel, Connection } from 'amqplib';
import { newOrderQueue } from './queues';
import { Purchase } from '../../interface/purchase.interface';
import domainEvents from '../../domain/events/domain.events';

export class RabbitMQClient {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  constructor() {}

  public async connect(url: string): Promise<void> {
    try {
      this.connection = await amqplib.connect(url);
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ...');
      await this.configOrders();
      await this.consumeNewOrders();
      console.log('Configured...');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  private async configOrders() {
    if (this.channel) {
      await this.channel.assertQueue(newOrderQueue.name, {
        durable: true,
        arguments: {
          'x-queue-type': 'quorum',
          'x-single-active-consumer': true,
        },
      });
    }
  }

  private async consumeNewOrders() {
    if (this.channel) {
      this.channel.consume(newOrderQueue.name, (msg) => {
        if (msg) {
          const payload = JSON.parse(msg.content.toString()) as Purchase;
          domainEvents.emit('ProductPurchase', {
            payload,
            ack: () => {
              console.log('acking msg %s', msg);
              this.channel?.ack(msg);
            },
          });
        }
      });
    }
  }
}

const rabbitmq = new RabbitMQClient();

export default rabbitmq;
