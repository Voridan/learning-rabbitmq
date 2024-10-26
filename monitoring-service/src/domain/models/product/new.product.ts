import { DomainEvent } from '../../events/domain.event';
import { Product } from './product.model';

export class NewProduct extends DomainEvent {
  constructor(public product: Product) {
    super(product.id);
  }
}
