"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transport = void 0;
class Transport {
    constructor(id, type, currentLocation, capacity) {
        this.id = id;
        this.type = type;
        this.currentLocation = currentLocation;
        this.capacity = capacity;
    }
    static map(fileds) {
        return new Transport(fileds.id, fileds.type, fileds.currentLocation, fileds.capacity);
    }
}
exports.Transport = Transport;
