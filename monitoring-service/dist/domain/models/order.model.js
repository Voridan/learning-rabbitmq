"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor(id, productName, quantity, price, postOfficeId) {
        this.id = id;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
        this.postOfficeId = postOfficeId;
    }
    static map(fields) {
        return new Order(fields.id, fields.productName, fields.quantity, fields.price, fields.postOfficeId);
    }
}
exports.Order = Order;
