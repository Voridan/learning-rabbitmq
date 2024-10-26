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
exports.ProductRepository = void 0;
const AppError_1 = require("../errors/AppError");
const sqlite_provider_1 = __importDefault(require("../infrastructure/db/sqlite.provider"));
const product_model_1 = require("../domain/models/product/product.model");
class ProductRepository {
    constructor(dbProvider) {
        this.dbProvider = dbProvider;
    }
    addProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const insertProductQuery = `
        INSERT INTO product (id, name, price, category, quantity, warehouse_id)
        VALUES (?, ?, ?, ?, ?, ?);
        `;
                const updateWarehouseQuery = `
        UPDATE warehouse
        SET load = load + ?
        WHERE id = ? AND (load + ?) <= capacity;
        `;
                const db = this.dbProvider.db;
                try {
                    db.serialize(() => {
                        db.run('BEGIN TRANSACTION');
                        db.run(updateWarehouseQuery, [product.quantity, product.warehouseId, product.quantity], function (err) {
                            if (err) {
                                db.run('ROLLBACK');
                                return reject(err);
                            }
                            if (this.changes === 0) {
                                db.run('ROLLBACK');
                                return reject(new AppError_1.AppError(422, 'Warehouse is full'));
                            }
                            db.run(insertProductQuery, Object.values(product), function (err) {
                                if (err) {
                                    db.run('ROLLBACK');
                                    return reject(err);
                                }
                                db.run('COMMIT', (err) => {
                                    if (err) {
                                        db.run('ROLLBACK');
                                        reject(err);
                                    }
                                    else {
                                        resolve();
                                    }
                                });
                            });
                        });
                    });
                }
                catch (err) {
                    db.run('ROLLBACK');
                }
            });
        });
    }
    updateQuantity(productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = `
          UPDATE product 
          SET quantity = quantity - ?
          WHERE id = ?;
        `;
                this.dbProvider.db.run(query, [quantity, productId], function (err) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(this.changes !== 0);
                });
            });
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = `SELECT * FROM product WHERE id = ?;`;
                this.dbProvider.db.get(query, [id], (err, row) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(product_model_1.Product.map(Object.assign(Object.assign({}, row), { warehouseId: row.warehouse_id })));
                });
            });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = `SELECT * FROM product;`;
                this.dbProvider.db.all(query, (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }
    getByCategory(category) {
        return new Promise((resolve, reject) => {
            this.dbProvider.db.all(`SELECT * FROM product WHERE category = ?`, [category], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
}
exports.ProductRepository = ProductRepository;
const productsRepo = new ProductRepository(sqlite_provider_1.default);
exports.default = productsRepo;
