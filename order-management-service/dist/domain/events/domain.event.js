"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEvent = void 0;
class DomainEvent {
    constructor(correlationId) {
        this.correlationId = correlationId;
        this.eventType = this.constructor.name;
        this.created = Date.now();
    }
}
exports.DomainEvent = DomainEvent;
