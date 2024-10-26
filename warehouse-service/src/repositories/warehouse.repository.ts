import { UUID } from 'crypto';
import dbProvider, {
  DatabaseProvider,
} from '../infrastructure/db/sqlite.provider';
import { IWarehouse } from './../interface/warehouse.interface';

export class WarehouseRepository {
  constructor(private dbProvider: DatabaseProvider) {}

  public addWarehouse(warehouse: IWarehouse): Promise<void> {
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
        load: 0,
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

  public updateLoad(id: UUID, loadIncrement: number) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE warehouse
        SET load = load + ?
        WHERE id = ? and (load + ?) <= capacity;
      `;

      this.dbProvider.db.run(
        query,
        [loadIncrement, id, loadIncrement],
        function (err) {
          if (err) {
            return reject(
              new Error('service has fallen due to capacity-load conflict')
            );
          }
          resolve(this.changes);
        }
      );
    });
  }
}

const warehouseRepo = new WarehouseRepository(dbProvider);

export default warehouseRepo;
