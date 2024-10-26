import dbProvider, {
  DatabaseProvider,
} from '../infrastructure/db/sqlite.provider'; // Adjust the path as needed
import { IOrder, OrderStatus } from '../interface/order.interface'; // Assuming you have Order and OrderStatus defined elsewhere
import { Order } from '../domain/model/order.model';

export class OrderRepository {
  private dbProvider: DatabaseProvider;

  constructor(dbProvider: DatabaseProvider) {
    this.dbProvider = dbProvider;
  }

  public async save(order: IOrder): Promise<void> {
    const query = `
      INSERT INTO "order" (id, product_id, name, postOffice, warehouse, status, quantity, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    console.log('saving', JSON.stringify(order));

    return new Promise<void>((resolve, reject) => {
      this.dbProvider.db.run(
        query,
        [
          order.id,
          order.productId,
          order.name,
          order.postOffice,
          order.warehouse,
          order.status,
          order.quantity,
          order.price,
        ],
        (err) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  public async updateStatus(id: string, status: OrderStatus): Promise<void> {
    const query = `
      UPDATE orders
      SET status = ?
      WHERE id = ?
    `;

    return new Promise<void>((resolve, reject) => {
      this.dbProvider.db.run(query, [status, id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async findById(id: string): Promise<Order | null> {
    const query = `
      SELECT * FROM orders
      WHERE id = ?
    `;

    return new Promise<Order | null>((resolve, reject) => {
      this.dbProvider.db.get(query, [id], (err, row: Order) => {
        if (err) {
          reject(err);
        } else if (row) {
          const order = new Order(
            row.id,
            row.productId,
            row.name,
            row.warehouse,
            row.postOffice,
            row.status,
            row.quantity,
            row.price
          );
          resolve(order);
        } else {
          resolve(null);
        }
      });
    });
  }
}

export default new OrderRepository(dbProvider);
