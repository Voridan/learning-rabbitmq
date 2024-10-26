import { UUID, randomUUID } from 'crypto';
import { NewProduct } from './new.product';
import { INewProduct, IProduct } from '../../../interface/product.interface';
import domainEvents from '../../events/domain.events';
import { Purchase } from './purchase';
import { Response } from 'express';

export class Product implements IProduct {
  private constructor(
    public readonly id: UUID | '',
    public readonly name: string,
    public readonly price: number,
    public readonly category: string,
    public quantity: number,
    public readonly warehouseId: UUID
  ) {}

  public static create(fields: INewProduct): Product {
    const product = new Product(
      randomUUID(),
      fields.name,
      fields.price,
      fields.category,
      fields.quantity,
      fields.warehouseId
    );

    domainEvents.emit('NewProduct', { payload: new NewProduct(product) });
    return product;
  }

  public handlePurchase(res: Response, warehouse: string) {
    domainEvents.emit('ProductPurchase', {
      payload: new Purchase({
        productId: this.id as UUID,
        price: this.price,
        quantity: this.quantity,
        warehouse,
        name: this.name,
      }),
      res,
    });
  }

  public static map(fields: IProduct): Product {
    if (fields.id) {
      return new Product(
        fields.id,
        fields.name,
        fields.price,
        fields.category,
        fields.quantity,
        fields.warehouseId
      );
    }
    throw new Error('Invalid id');
  }

  public plain(): IProduct {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      category: this.category,
      quantity: this.quantity,
      warehouseId: this.warehouseId,
    };
  }
}
