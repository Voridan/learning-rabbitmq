import path from 'path';
import sqlite3, { Database } from 'sqlite3';

sqlite3.verbose();

export class DatabaseProvider {
  private database: Database;
  constructor() {
    this.database = new Database(path.join(__dirname, 'db.sqlite'), (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
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

    createTableQueries.forEach((query, index) =>
      this.db.run(query, (err) => {
        if (err) {
          console.error('Error creating table:', err);
        } else {
          console.log('Table %s is ready.', index);
        }
      })
    );
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Closed the SQLite database connection.');
      }
    });
  }
}

const dbProvider = new DatabaseProvider();

export default dbProvider;
