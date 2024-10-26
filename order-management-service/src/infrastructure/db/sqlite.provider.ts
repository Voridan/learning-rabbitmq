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
      `CREATE TABLE IF NOT EXISTS "order" (
        id TEXT PRIMARY KEY,
        product_id TEXT,
        name TEXT NOT NULL,
        postOffice TEXT,
        warehouse TEXT NOT NULL,
        status INTEGER NOT NULL CHECK (status IN (0, 1, 2)),
        quantity INTEGER NOT NULL CHECK (quantity >= 0), 
        price REAL NOT NULL CHECK (price >= 0)
      );`,
      `CREATE TABLE IF NOT EXISTS post_office (
        id TEXT PRIMARY KEY,
        address TEXT NOT NULL,
        number TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
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
