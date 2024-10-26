import { UUID } from 'crypto';
import { DomainEvent } from '../../events/domain.event';

export interface PurchaseDetails {
  productId: UUID;
  price: number;
  quantity: number;
  name: string;
  warehouse: string;
}

export class Purchase extends DomainEvent {
  constructor(public readonly purchaseDetails: PurchaseDetails) {
    super(purchaseDetails.productId);
  }
}
