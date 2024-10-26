"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseRepository = void 0;
const warehouse_model_1 = require("../domain/models/warehouse/warehouse.model");
const sqlite_provider_1 = __importDefault(require("../infrastructure/db/sqlite.provider"));
class WarehouseRepository {
    constructor(dbProvider) {
        this.dbProvider = dbProvider;
    }
    addWarehouse(warehouse) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    load: warehouse.load,
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
        });
    }
    getAll() {
        return new Promise((resolve, reject) => {
            this.dbProvider.db.all(`SELECT * FROM warehouse;`, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const result = rows.map((row) => warehouse_model_1.Warehouse.map(Object.assign(Object.assign({}, row), { location: {
                            latitude: row.latitude,
                            longitude: row.longitude,
                        } })).plain());
                    resolve(result);
                }
            });
        });
    }
    getWarehouseById(id) {
        const sql = `SELECT * FROM warehouse WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.dbProvider.db.get(sql, [id], (err, row) => {
                if (err) {
                    return reject(err.message);
                }
                resolve(row);
            });
        });
    }
}
exports.WarehouseRepository = WarehouseRepository;
const warehouseRepo = new WarehouseRepository(sqlite_provider_1.default);
exports.default = warehouseRepo;
