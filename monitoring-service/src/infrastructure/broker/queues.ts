import { routingKeys } from './routing.keys';

export const newWarehouseQueue = {
  name: 'monitoring-new-warehouse',
  exchange: 'warehouses.exchange',
  key: routingKeys.warehouse,
};

export const newProductQueue = {
  name: 'monitoring-new-product',
  exchange: 'products.exchange',
  key: routingKeys.product,
};
