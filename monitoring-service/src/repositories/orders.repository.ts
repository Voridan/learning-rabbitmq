import dbProvider, {
  DatabaseProvider,
} from '../infrastructure/db/sqlite.provider';
import { IOrder } from '../interface/order.interface';
import { Order } from '../domain/models/order.model';

export class OrderRepository {
  constructor(private dbProvider: DatabaseProvider) {}

  public async addOrder(order: IOrder): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO orders (id, productName, quantity, price, postOfficeId)
        VALUES (?, ?, ?, ?, ?)
      `;
      const params = Object.values(order);

      this.dbProvider.db.run(query, params, (err) => {
        if (err) {
          console.error('Error inserting order:', err);
          reject(err);
        } else {
          console.log('Order %s inserted successfully.', order.productName);
          resolve();
        }
      });
    });
  }

  public getAll(): Promise<IOrder[]> {
    return new Promise((resolve, reject) => {
      this.dbProvider.db.all(`SELECT * FROM orders;`, (err, rows: IOrder[]) => {
        if (err) {
          reject(err);
        } else {
          console.log('Order rows from repository: ', rows);
          const result = rows.map((row) => Order.map(row));
          resolve(result);
        }
      });
    });
  }
}

const orderRepo = new OrderRepository(dbProvider);

export default orderRepo;
