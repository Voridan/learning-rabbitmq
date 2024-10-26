export const routingKeys = {
  warehouse: 'warehouse',
  product: 'product',
} as const;

export type RoutingKey = (typeof routingKeys)[keyof typeof routingKeys];
