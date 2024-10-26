"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unroutedOrderQueue = exports.newOrderQueue = exports.newWarehouseQueue = void 0;
const routing_keys_1 = require("./routing.keys");
exports.newWarehouseQueue = {
    name: 'products-new-warehouse',
    exchange: 'warehouses.exchange',
    key: routing_keys_1.routingKeys.warehouse,
};
exports.newOrderQueue = {
    name: 'new-order',
    exchange: 'new-order.exchange',
    key: routing_keys_1.routingKeys.order,
};
exports.unroutedOrderQueue = {
    name: 'unrouted-order',
    exchange: 'new-order.ae',
    key: '',
};
