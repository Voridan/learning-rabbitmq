"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewProduct = void 0;
const domain_event_1 = require("../events/domain.event");
class NewProduct extends domain_event_1.DomainEvent {
    constructor(product) {
        super(product.warehouseId);
        this.product = product;
    }
}
exports.NewProduct = NewProduct;
