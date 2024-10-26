import domainEvents from './domain.events';
import rabbitmq from '../../infrastructure/broker/rabbitmq.client';
import { NewWarehouse } from '../models/new.warehouse';
import { Options } from 'amqplib';
import { NewProduct } from '../models/new.product';
import warehouseRepo from '../../repositories/warehouse.repository';

domainEvents.on('NewWarehouse', (payload: NewWarehouse) => {
  const msgOpts: Options.Publish = {
    type: payload.eventType,
    contentType: 'application/json',
    deliveryMode: 2, // persist
    timestamp: payload.created,
    correlationId: payload.correlationId,
  };
  rabbitmq.publish(
    'warehouses.exchange',
    'warehouse',
    Buffer.from(JSON.stringify(payload.warehouse.plain())),
    msgOpts
  );
});

domainEvents.on('NewProduct', async (payload: NewProduct) => {
  const { warehouseId, quantity } = payload.product;
  await warehouseRepo.updateLoad(warehouseId, quantity);
});
