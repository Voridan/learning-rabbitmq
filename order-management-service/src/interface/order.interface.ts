import { UUID } from 'crypto';

export enum OrderStatus {
  IN_THE_WAREHOUSE = 0,
  ON_THE_WAY = 1,
  ARRIVED = 2,
}

export interface IOrder {
  id: UUID;
  productId: UUID;
  name: string;
  postOffice?: UUID;
  warehouse: string;
  status: OrderStatus;
  quantity: number;
  price: number;
}
