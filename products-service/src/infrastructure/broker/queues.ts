import { routingKeys } from './routing.keys';

export const newWarehouseQueue = {
  name: 'products-new-warehouse',
  exchange: 'warehouses.exchange',
  key: routingKeys.warehouse,
} as const;

export const newOrderQueue = {
  name: 'new-order',
  exchange: 'new-order.exchange',
  key: routingKeys.order,
} as const;

export const unroutedOrderQueue = {
  name: 'unrouted-order',
  exchange: 'new-order.ae',
  key: '',
} as const;
