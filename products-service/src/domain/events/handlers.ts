import { NewProduct } from '../models/product/new.product';
import domainEvents, {
  PayloadWithAck,
  PayloadWithResponse,
  PlainPayload,
} from './domain.events';
import rabbitmq from '../../infrastructure/broker/rabbitmq.client';
import { Options } from 'amqplib';
import { NewWarehouse } from '../models/warehouse/new.warehouse';
import warehouseRepo from '../../repositories/warehouse.repository';
import { Purchase } from '../models/product/purchase';

domainEvents.on('NewProduct', ({ payload }: PlainPayload<NewProduct>) => {
  const msgOpts: Options.Publish = {
    type: payload.eventType,
    contentType: 'application/json',
    deliveryMode: 2, // persist
    timestamp: payload.created,
    correlationId: payload.correlationId,
  };
  rabbitmq.publish(
    'products.exchange',
    'product',
    Buffer.from(JSON.stringify(payload.product.plain())),
    msgOpts
  );
});

domainEvents.on(
  'NewWarehouse',
  async ({ payload, ack }: PayloadWithAck<NewWarehouse>) => {
    await warehouseRepo.addWarehouse(payload.warehouse);
    if (ack) ack();
  }
);

domainEvents.on(
  'ProductPurchase',
  async ({ payload, res }: PayloadWithResponse<Purchase>) => {
    const msgOpts: Options.Publish = {
      correlationId: payload.correlationId,
      deliveryMode: 2,
      timestamp: payload.created,
      type: payload.eventType,
      contentType: 'application/json',
    };

    const maxRetries = 5;
    const retryDelayMs = 1000;

    const publishWithRetry = (retries = 0) => {
      rabbitmq.confirmedPublish(
        'new-order.exchange',
        'order.created',
        Buffer.from(JSON.stringify(payload.purchaseDetails)),
        msgOpts,
        (err) => {
          if (err && retries < maxRetries) {
            console.log(`Publish failed, retrying... Attempt ${retries + 1}`);
            setTimeout(() => {
              publishWithRetry(retries + 1);
            }, retryDelayMs * Math.pow(2, retries));
          } else if (err) {
            console.log('Failed to publish after maximum retries.');
            res.write(`data: ${JSON.stringify({ routed: false })}\n\n`);
            res.end();
          } else {
            console.log('Message published successfully.');
            res.write(`data: ${JSON.stringify({ routed: true })}\n\n`);
            res.end();
          }
        }
      );
    };

    publishWithRetry();
  }
);
