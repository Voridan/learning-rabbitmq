import path from 'path';
import { Database } from 'sqlite3';

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
        load INTEGER DEFAULT 0
      );`,
      `CREATE TABLE IF NOT EXISTS post_office (
        id TEXT PRIMARY KEY,
        address TEXT NOT NULL,
        latitude REAL,
        longitude REAL
      );`,
      `CREATE TABLE IF NOT EXISTS "order" (
        id TEXT PRIMARY KEY,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        post_office_id TEXT,
        FOREIGN KEY (post_office_id) REFERENCES post_office(id)
      );`,
      `CREATE TABLE IF NOT EXISTS product (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        quantity INTEGER,
        warehouse_id TEXT,
        FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
      );`,
      `CREATE TABLE IF NOT EXISTS transport (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL CHECK (type IN (0, 1, 2)),
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        capacity INTEGER NOT NULL
      );`,
    ];

    this.db.serialize(() => {
      createTableQueries.forEach((query, index) => {
        this.db.run(query, (err) => {
          if (err) {
            console.error('Error creating table:', err);
          } else {
            console.log('Table %s is ready.', index);
          }
        });
      });
    });
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
