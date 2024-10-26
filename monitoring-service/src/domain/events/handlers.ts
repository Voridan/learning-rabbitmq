import domainEvents, { PayloadWithAck } from './domain.events';
import { NewWarehouse } from '../models/warehouse/new.warehouse';
import { NewProduct } from '../models/product/new.product';
import productRepo from '../../repositories/product.repository';
import warehouseRepo from '../../repositories/warehouse.repository';

domainEvents.on(
  'NewWarehouse',
  async ({ payload, ack }: PayloadWithAck<NewWarehouse>) => {
    console.log('Persisting newly consumed warehouse: ', payload.correlationId);
    await warehouseRepo.addWarehouse(payload.warehouse);
    if (ack) {
      ack();
    }
  }
);

domainEvents.on(
  'NewProduct',
  async ({ payload, ack }: PayloadWithAck<NewProduct>) => {
    console.log('Persisting newly consumed product: ', payload.correlationId);
    await productRepo.addProduct(payload.product);
    if (ack) {
      ack();
    }
  }
);
