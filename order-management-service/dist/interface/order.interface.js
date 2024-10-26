"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["IN_THE_WAREHOUSE"] = 0] = "IN_THE_WAREHOUSE";
    OrderStatus[OrderStatus["ON_THE_WAY"] = 1] = "ON_THE_WAY";
    OrderStatus[OrderStatus["ARRIVED"] = 2] = "ARRIVED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
