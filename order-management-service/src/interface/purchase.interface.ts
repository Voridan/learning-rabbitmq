import { UUID } from 'crypto';

export interface Purchase {
  productId: UUID;
  price: number;
  quantity: number;
  name: string;
  warehouse: string;
}
