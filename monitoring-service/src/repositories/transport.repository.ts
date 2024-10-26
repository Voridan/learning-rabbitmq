import dbProvider, {
  DatabaseProvider,
} from '../infrastructure/db/sqlite.provider';
import { ITransport } from '../interface/transport.interface';
import { Transport } from '../domain/models/transport.model';

export class TransportRepository {
  constructor(private dbProvider: DatabaseProvider) {}

  public async addTransport(transport: ITransport): Promise<void> {
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
        } else {
          console.log('Transport %s inserted successfully.', transport.id);
          resolve();
        }
      });
    });
  }

  public getAll(): Promise<ITransport[]> {
    return new Promise((resolve, reject) => {
      this.dbProvider.db.all(
        `SELECT * FROM transport;`,
        (err, rows: ITransport[]) => {
          if (err) {
            reject(err);
          } else {
            console.log(
              'Transport rows from monitoring transport repo: ',
              rows
            );
            const result = rows.map((row) => Transport.map(row));
            resolve(result);
          }
        }
      );
    });
  }
}

const transportRepo = new TransportRepository(dbProvider);

export default transportRepo;
