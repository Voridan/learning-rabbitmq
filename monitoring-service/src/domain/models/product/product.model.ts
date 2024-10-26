import { UUID } from 'crypto';
import { IProduct } from '../../../interface/product.interface';

export class Product implements IProduct {
  constructor(
    public id: UUID,
    public name: string,
    public price: number,
    public category: string,
    public quantity: number,
    public warehouseId: UUID
  ) {}

  public static map(fields: IProduct) {
    return new Product(
      fields.id,
      fields.name,
      fields.price,
      fields.category,
      fields.quantity,
      fields.warehouseId
    );
  }
}
