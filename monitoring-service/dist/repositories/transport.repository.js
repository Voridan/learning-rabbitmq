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
exports.TransportRepository = void 0;
const sqlite_provider_1 = __importDefault(require("../infrastructure/db/sqlite.provider"));
const transport_model_1 = require("../domain/models/transport.model");
class TransportRepository {
    constructor(dbProvider) {
        this.dbProvider = dbProvider;
    }
    addTransport(transport) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = `
        INSERT INTO transport (id, type, latitude, longitude, capacity)
        VALUES (?, ?, ?, ?, ?)
      `;
                const params = Object.values(transport);
                this.dbProvider.db.run(query, params, (err) => {
                    if (err) {
                        console.error('Error inserting transport:', err);
                        reject(err);
                    }
                    else {
                        console.log('Transport %s inserted successfully.', transport.id);
                        resolve();
                    }
                });
            });
        });
    }
    getAll() {
        return new Promise((resolve, reject) => {
            this.dbProvider.db.all(`SELECT * FROM transport;`, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log('Transport rows from monitoring transport repo: ', rows);
                    const result = rows.map((row) => transport_model_1.Transport.map(row));
                    resolve(result);
                }
            });
        });
    }
}
exports.TransportRepository = TransportRepository;
const transportRepo = new TransportRepository(sqlite_provider_1.default);
exports.default = transportRepo;
