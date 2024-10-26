"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchase = void 0;
const domain_event_1 = require("../../events/domain.event");
class Purchase extends domain_event_1.DomainEvent {
    constructor(purchaseDetails) {
        super(purchaseDetails.productId);
        this.purchaseDetails = purchaseDetails;
    }
}
exports.Purchase = Purchase;
