"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const crypto_1 = require("crypto");
const new_product_1 = require("./new.product");
const domain_events_1 = __importDefault(require("../../events/domain.events"));
const purchase_1 = require("./purchase");
class Product {
    constructor(id, name, price, category, quantity, warehouseId) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.quantity = quantity;
        this.warehouseId = warehouseId;
    }
    static create(fields) {
        const product = new Product((0, crypto_1.randomUUID)(), fields.name, fields.price, fields.category, fields.quantity, fields.warehouseId);
        domain_events_1.default.emit('NewProduct', { payload: new new_product_1.NewProduct(product) });
        return product;
    }
    handlePurchase(res, warehouse) {
        domain_events_1.default.emit('ProductPurchase', {
            payload: new purchase_1.Purchase({
                productId: this.id,
                price: this.price,
                quantity: this.quantity,
                warehouse,
                name: this.name,
            }),
            res,
        });
    }
    static map(fields) {
        if (fields.id) {
            return new Product(fields.id, fields.name, fields.price, fields.category, fields.quantity, fields.warehouseId);
        }
        throw new Error('Invalid id');
    }
    plain() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            category: this.category,
            quantity: this.quantity,
            warehouseId: this.warehouseId,
        };
    }
}
exports.Product = Product;
