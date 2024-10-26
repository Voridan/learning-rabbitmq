"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Warehouse = void 0;
class Warehouse {
    constructor(id, address, location, capacity, load) {
        this.id = id;
        this.address = address;
        this.location = location;
        this.capacity = capacity;
        this.load = load;
    }
    static map(fileds) {
        return new Warehouse(fileds.id, fileds.address, fileds.location, fileds.capacity, fileds.load);
    }
}
exports.Warehouse = Warehouse;
