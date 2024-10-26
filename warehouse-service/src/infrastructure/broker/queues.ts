import { routingKeys } from './routing.keys';

export const newProductQueue = {
  name: 'warehouse-new-product',
  exchange: 'products.exchange',
  key: routingKeys.product,
} as const;
