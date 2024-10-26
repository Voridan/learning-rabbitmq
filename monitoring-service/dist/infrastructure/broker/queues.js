"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newProductQueue = exports.newWarehouseQueue = void 0;
const routing_keys_1 = require("./routing.keys");
exports.newWarehouseQueue = {
    name: 'monitoring-new-warehouse',
    exchange: 'warehouses.exchange',
    key: routing_keys_1.routingKeys.warehouse,
};
exports.newProductQueue = {
    name: 'monitoring-new-product',
    exchange: 'products.exchange',
    key: routing_keys_1.routingKeys.product,
};
