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
      } else {
        console.log('Table is ready.');
      }
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
