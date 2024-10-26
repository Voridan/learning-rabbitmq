import { IProduct } from '../../interface/product.interface';
import { DomainEvent } from '../events/domain.event';

interface INewProduct extends Pick<IProduct, 'quantity' | 'warehouseId'> {}

export class NewProduct extends DomainEvent {
  constructor(public product: INewProduct) {
    super(product.warehouseId);
  }
}
