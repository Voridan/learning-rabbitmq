"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newProductQueue = void 0;
const routing_keys_1 = require("./routing.keys");
exports.newProductQueue = {
    name: 'warehouse-new-product',
    exchange: 'products.exchange',
    key: routing_keys_1.routingKeys.product,
};
