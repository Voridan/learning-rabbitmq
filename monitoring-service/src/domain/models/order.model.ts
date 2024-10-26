import { UUID } from 'crypto';
import { IOrder } from '../../interface/order.interface';

export class Order implements IOrder {
  constructor(
    public id: UUID,
    public productName: string,
    public quantity: number,
    public price: number,
    public postOfficeId: UUID
  ) {}

  public static map(fields: IOrder) {
    return new Order(
      fields.id,
      fields.productName,
      fields.quantity,
      fields.price,
      fields.postOfficeId
    );
  }
}
