import { routingKeys } from './routing.keys';

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
