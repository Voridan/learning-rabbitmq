"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseProvider = void 0;
const path_1 = __importDefault(require("path"));
const sqlite3_1 = __importStar(require("sqlite3"));
sqlite3_1.default.verbose();
class DatabaseProvider {
    constructor() {
        this.database = new sqlite3_1.Database(path_1.default.join(__dirname, 'db.sqlite'), (err) => {
            if (err) {
                console.error('Error opening database:', err);
            }
            else {
                console.log('Connected to SQLite database.');
                this.initializeDatabase();
            }
        });
    }
    get db() {
        return this.database;
    }
    initializeDatabase() {
        const createTableQueries = [
            `CREATE TABLE IF NOT EXISTS warehouse (
        id TEXT PRIMARY KEY,
        address TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        capacity INTEGER NOT NULL,
        load INTEGER DEFAULT 0,
        CHECK(load <= capacity)
      );`,
            `CREATE TABLE IF NOT EXISTS product (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        quantity INTEGER DEFAULT 0,
        warehouse_id TEXT,
        FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
      );`,
        ];
        createTableQueries.forEach((query, index) => this.db.run(query, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            }
            else {
                console.log('Table %s is ready.', index);
            }
        }));
    }
    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            }
            else {
                console.log('Closed the SQLite database connection.');
            }
        });
    }
}
exports.DatabaseProvider = DatabaseProvider;
const dbProvider = new DatabaseProvider();
exports.default = dbProvider;
