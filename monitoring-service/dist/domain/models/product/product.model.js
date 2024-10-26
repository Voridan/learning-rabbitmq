"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(id, name, price, category, quantity, warehouseId) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.quantity = quantity;
        this.warehouseId = warehouseId;
    }
    static map(fields) {
        return new Product(fields.id, fields.name, fields.price, fields.category, fields.quantity, fields.warehouseId);
    }
}
exports.Product = Product;
