import { UUID } from 'crypto';
import { IOrder, OrderStatus } from '../../interface/order.interface';

export class Order implements IOrder {
  constructor(
    public id: UUID,
    public productId: UUID,
    public name: string,
    public warehouse: string,
    public postOffice: UUID,
    public status: OrderStatus = OrderStatus.IN_THE_WAREHOUSE,
    public quantity: number,
    public price: number
  ) {}

  changeStatus(newStatus: OrderStatus): void {
    // Raise domain event
    this.status = newStatus;
  }
}
