"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const order_interface_1 = require("../../interface/order.interface");
class Order {
    constructor(id, productId, name, warehouse, postOffice, status = order_interface_1.OrderStatus.IN_THE_WAREHOUSE, quantity, price) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.warehouse = warehouse;
        this.postOffice = postOffice;
        this.status = status;
        this.quantity = quantity;
        this.price = price;
    }
    changeStatus(newStatus) {
        this.status = newStatus;
    }
}
exports.Order = Order;
