import { UUID } from 'crypto';

export interface IOrder {
  id: UUID;
  productName: string;
  quantity: number;
  price: number;
  postOfficeId: UUID;
}
