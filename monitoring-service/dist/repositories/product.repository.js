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
const sqlite_provider_1 = __importDefault(require("../infrastructure/db/sqlite.provider"));
class ProductRepository {
    constructor(dbProvider) {
        this.dbProvider = dbProvider;
    }
    addProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = `
        INSERT INTO product (id, name, price, category, quantity, warehouse_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
                const params = Object.values(product);
                this.dbProvider.db.run(query, params, (err) => {
                    if (err) {
                        console.error('Error inserting product:', err);
                        reject(err);
                    }
                    else {
                        console.log('Product %s inserted successfully.', product.name);
                        resolve();
                    }
                });
            });
        });
    }
    getAll() {
        return new Promise((resolve, reject) => {
            this.dbProvider.db.all(`SELECT * FROM product;`, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
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
const productRepo = new ProductRepository(sqlite_provider_1.default);
exports.default = productRepo;
