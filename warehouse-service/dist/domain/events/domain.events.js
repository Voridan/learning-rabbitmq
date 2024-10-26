"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEvents = void 0;
const events_1 = __importDefault(require("events"));
class DomainEvents {
    constructor() {
        this.eventEmitter = new events_1.default();
    }
    on(event, cb) {
        this.eventEmitter.on(event, cb);
    }
    emit(event, payload) {
        this.eventEmitter.emit(event, payload);
    }
    off(event, cb) {
        this.eventEmitter.off(event, cb);
    }
}
exports.DomainEvents = DomainEvents;
const domainEvents = new DomainEvents();
exports.default = domainEvents;
