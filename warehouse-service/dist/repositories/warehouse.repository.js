"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseRepository = void 0;
const sqlite_provider_1 = __importDefault(require("../infrastructure/db/sqlite.provider"));
class WarehouseRepository {
    constructor(dbProvider) {
        this.dbProvider = dbProvider;
    }
    addWarehouse(warehouse) {
        return new Promise((resolve, reject) => {
            const query = `
        INSERT INTO warehouse (id, address, latitude, longitude, capacity, load)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
            const { latitude, longitude } = warehouse.location;
            const params = Object.values({
                id: warehouse.id,
                address: warehouse.address,
                latitude,
                longitude,
                capacity: warehouse.capacity,
                load: 0,
            });
            this.dbProvider.db.run(query, params, (err) => {
                if (err) {
                    console.error('Error inserting warehouse:', err);
                    reject(err);
                }
                else {
                    console.log('Warehouse %s inserted successfully.', warehouse.address);
                    resolve();
                }
            });
        });
    }
    updateLoad(id, loadIncrement) {
        return new Promise((resolve, reject) => {
            const query = `
        UPDATE warehouse
        SET load = load + ?
        WHERE id = ? and (load + ?) <= capacity;
      `;
            this.dbProvider.db.run(query, [loadIncrement, id, loadIncrement], function (err) {
                if (err) {
                    return reject(new Error('service has fallen due to capacity-load conflict'));
                }
                resolve(this.changes);
            });
        });
    }
}
exports.WarehouseRepository = WarehouseRepository;
const warehouseRepo = new WarehouseRepository(sqlite_provider_1.default);
exports.default = warehouseRepo;
