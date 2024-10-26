import dbProvider, {
  DatabaseProvider,
} from '../infrastructure/db/sqlite.provider';
import { IProduct } from '../interface/product.interface';

export class ProductRepository {
  constructor(private dbProvider: DatabaseProvider) {}

  public async addProduct(product: IProduct): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO product (id, name, price, category, quantity, warehouse_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const params = Object.values(product);

      this.dbProvider.db.run(query, params, (err) => {
        if (err) {
          console.error('Error inserting product:', err);
          reject(err);
        } else {
          console.log('Product %s inserted successfully.', product.name);
          resolve();
        }
      });
    });
  }

  public getAll(): Promise<IProduct[]> {
    return new Promise((resolve, reject) => {
      this.dbProvider.db.all(
        `SELECT * FROM product;`,
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

const productRepo = new ProductRepository(dbProvider);

export default productRepo;
