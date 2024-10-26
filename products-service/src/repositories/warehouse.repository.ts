import { UUID } from 'crypto';
import { Warehouse } from '../domain/models/warehouse/warehouse.model';
import dbProvider, {
  DatabaseProvider,
} from '../infrastructure/db/sqlite.provider';
import { IWarehouse } from '../interface/warehouse.interface';

interface RawWarehouse {
  id: UUID;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  load: number;
}

export class WarehouseRepository {
  constructor(private dbProvider: DatabaseProvider) {}

  public async addWarehouse(warehouse: IWarehouse): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO warehouse (id, address, latitude, longitude, capacity, load)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const { latitude, longitude } = warehouse.location;
      const params = Object.values({
        id: warehouse.id,
        address: warehouse.address,
        latitude,
        longitude,
        capacity: warehouse.capacity,
        load: warehouse.load,
      });

      this.dbProvider.db.run(query, params, (err) => {
        if (err) {
          console.error('Error inserting warehouse:', err);
          reject(err);
        } else {
          console.log('Warehouse %s inserted successfully.', warehouse.address);
          resolve();
        }
      });
    });
  }

  public getAll(): Promise<IWarehouse[]> {
    return new Promise((resolve, reject) => {
      this.dbProvider.db.all(
        `SELECT * FROM warehouse;`,
        (err, rows: RawWarehouse[]) => {
          if (err) {
            reject(err);
          } else {
            const result = rows.map((row) =>
              Warehouse.map({
                ...row,
                location: {
                  latitude: row.latitude,
                  longitude: row.longitude,
                },
              }).plain()
            );
            resolve(result);
          }
        }
      );
    });
  }

  getWarehouseById(id: UUID) {
    const sql = `SELECT * FROM warehouse WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.dbProvider.db.get(sql, [id], (err, row) => {
        if (err) {
          return reject(err.message);
        }
        resolve(row);
      });
    });
  }
}

const warehouseRepo = new WarehouseRepository(dbProvider);

export default warehouseRepo;
