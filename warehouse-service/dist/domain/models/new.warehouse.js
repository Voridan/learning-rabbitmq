"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewWarehouse = void 0;
const domain_event_1 = require("../events/domain.event");
class NewWarehouse extends domain_event_1.DomainEvent {
    constructor(warehouse) {
        super(warehouse.id);
        this.warehouse = warehouse;
    }
}
exports.NewWarehouse = NewWarehouse;
