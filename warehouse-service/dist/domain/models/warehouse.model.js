"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Warehouse = void 0;
const crypto_1 = require("crypto");
const domain_events_1 = __importDefault(require("../events/domain.events"));
const new_warehouse_1 = require("./new.warehouse");
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
    static create(fields) {
        const wh = new Warehouse((0, crypto_1.randomUUID)(), fields.address, fields.location, fields.capacity, 0);
        console.log(Object.assign({}, wh));
        domain_events_1.default.emit('NewWarehouse', new new_warehouse_1.NewWarehouse(wh));
        return wh;
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
