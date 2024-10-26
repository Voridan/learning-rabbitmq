import { UUID } from 'crypto';

export interface IProduct {
  id: UUID;
  name: string;
  price: number;
  category: string;
  quantity: number;
  warehouseId: UUID;
}
