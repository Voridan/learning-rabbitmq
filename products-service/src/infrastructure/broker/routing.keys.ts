export const routingKeys = {
  warehouse: 'warehouse',
  product: 'product',
  order: 'order.created',
} as const;

export type RoutingKey = (typeof routingKeys)[keyof typeof routingKeys];
