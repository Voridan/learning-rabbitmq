import { UUID } from 'crypto';

export interface INewProduct {
  name: string;
  price: number;
  category: string;
  quantity: number;
  warehouseId: UUID;
}

export interface IProduct extends INewProduct {
  id: UUID | '';
}
