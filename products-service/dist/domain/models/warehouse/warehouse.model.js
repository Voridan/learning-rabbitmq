"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Warehouse = void 0;
class Warehouse {
    constructor(_id, _address, _location, _capacity, _load) {
        this._id = _id;
        this._address = _address;
        this._location = _location;
        this._capacity = _capacity;
        this._load = _load;
    }
    get id() {
        return this._id;
    }
    get address() {
        return this._address;
    }
    get location() {
        return this._location;
    }
    get capacity() {
        return this._capacity;
    }
    get load() {
        return this._load;
    }
    static map(fields) {
        if (fields.id) {
            const wh = new Warehouse(fields.id, fields.address, fields.location, fields.capacity, fields.load);
            return wh;
        }
        throw new Error('Invalid id');
    }
    plain() {
        return {
            id: this._id,
            address: this._address,
            location: this._location,
            capacity: this._capacity,
            load: this._load,
        };
    }
}
exports.Warehouse = Warehouse;
