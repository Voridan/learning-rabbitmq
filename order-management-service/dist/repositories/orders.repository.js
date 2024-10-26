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
exports.OrderRepository = void 0;
const sqlite_provider_1 = __importDefault(require("../infrastructure/db/sqlite.provider"));
const order_model_1 = require("../domain/model/order.model");
class OrderRepository {
    constructor(dbProvider) {
        this.dbProvider = dbProvider;
    }
    save(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      INSERT INTO "order" (id, product_id, name, postOffice, warehouse, status, quantity, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
            console.log('saving', JSON.stringify(order));
            return new Promise((resolve, reject) => {
                this.dbProvider.db.run(query, [
                    order.id,
                    order.productId,
                    order.name,
                    order.postOffice,
                    order.warehouse,
                    order.status,
                    order.quantity,
                    order.price,
                ], (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      UPDATE orders
      SET status = ?
      WHERE id = ?
    `;
            return new Promise((resolve, reject) => {
                this.dbProvider.db.run(query, [status, id], (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT * FROM orders
      WHERE id = ?
    `;
            return new Promise((resolve, reject) => {
                this.dbProvider.db.get(query, [id], (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    else if (row) {
                        const order = new order_model_1.Order(row.id, row.productId, row.name, row.warehouse, row.postOffice, row.status, row.quantity, row.price);
                        resolve(order);
                    }
                    else {
                        resolve(null);
                    }
                });
            });
        });
    }
}
exports.OrderRepository = OrderRepository;
exports.default = new OrderRepository(sqlite_provider_1.default);
