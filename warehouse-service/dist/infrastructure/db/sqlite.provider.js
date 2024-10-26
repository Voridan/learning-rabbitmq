"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseProvider = void 0;
const path_1 = __importDefault(require("path"));
const sqlite3_1 = require("sqlite3");
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
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS warehouse (
        id TEXT PRIMARY KEY,
        address TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        capacity INTEGER NOT NULL,
        load INTEGER,
        CHECK(load <= capacity)
      );`;
        this.db.run(createTableQuery, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            }
            else {
                console.log('Table is ready.');
            }
        });
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
