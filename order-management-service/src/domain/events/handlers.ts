import { randomUUID } from 'crypto';
import { Purchase } from '../../interface/purchase.interface';
import ordersRepository from '../../repositories/orders.repository';
import domainEvents, { PayloadWithAck } from './domain.events';
import { OrderStatus } from '../../interface/order.interface';

domainEvents.on(
  'ProductPurchase',
  async ({ payload, ack }: PayloadWithAck<Purchase>) => {
    try {
      console.log('order details: ', JSON.stringify(payload));
      await ordersRepository.save({
        id: randomUUID(),
        status: OrderStatus.IN_THE_WAREHOUSE,
        ...payload,
      });

      if (ack) ack();
    } catch (error) {
      console.error();
    }
  }
);
