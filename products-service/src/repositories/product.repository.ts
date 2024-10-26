import { UUID } from 'crypto';
import { AppError } from '../errors/AppError';
import dbProvider, {
  DatabaseProvider,
} from '../infrastructure/db/sqlite.provider';
import { IProduct } from '../interface/product.interface';
import { Product } from '../domain/models/product/product.model';

export class ProductRepository {
  constructor(private dbProvider: DatabaseProvider) {}

  public async addProduct(product: IProduct): Promise<void> {
    return new Promise((resolve, reject) => {
      const insertProductQuery = `
        INSERT INTO product (id, name, price, category, quantity, warehouse_id)
        VALUES (?, ?, ?, ?, ?, ?);
        `;

      const updateWarehouseQuery = `
        UPDATE warehouse
        SET load = load + ?
        WHERE id = ? AND (load + ?) <= capacity;
        `;

      const db = this.dbProvider.db;
      try {
        db.serialize(() => {
          db.run('BEGIN TRANSACTION');
          db.run(
            updateWarehouseQuery,
            [product.quantity, product.warehouseId, product.quantity],
            function (err) {
              if (err) {
                db.run('ROLLBACK');
                return reject(err);
              }

              if (this.changes === 0) {
                db.run('ROLLBACK');
                return reject(new AppError(422, 'Warehouse is full'));
              }

              db.run(
                insertProductQuery,
                Object.values(product),
                function (err) {
                  if (err) {
                    db.run('ROLLBACK');
                    return reject(err);
                  }
                  db.run('COMMIT', (err) => {
                    if (err) {
                      db.run('ROLLBACK');
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                }
              );
            }
          );
        });
      } catch (err) {
        db.run('ROLLBACK');
      }
    });
  }

  public async updateQuantity(
    productId: string,
    quantity: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = `
          UPDATE product 
          SET quantity = quantity - ?
          WHERE id = ?;
        `;

      this.dbProvider.db.run(query, [quantity, productId], function (err) {
        if (err) {
          return reject(err);
        }
        return resolve(this.changes !== 0);
      });
    });
  }

  public async get(id: UUID): Promise<Product> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM product WHERE id = ?;`;
      this.dbProvider.db.get(
        query,
        [id],
        (err, row: { warehouse_id: UUID } & IProduct) => {
          if (err) {
            return reject(err);
          }
          resolve(Product.map({ ...row, warehouseId: row.warehouse_id }));
        }
      );
    });
  }

  public async getAll(): Promise<IProduct[]> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM product;`;
      this.dbProvider.db.all(query, (err, rows: IProduct[]) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getByCategory(category: string): Promise<IProduct[]> {
    return new Promise((resolve, reject) => {
      this.dbProvider.db.all(
        `SELECT * FROM product WHERE category = ?`,
        [category],
        (err, rows: IProduct[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}

const productsRepo = new ProductRepository(dbProvider);

export default productsRepo;
