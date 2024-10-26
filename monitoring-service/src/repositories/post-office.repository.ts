import dbProvider, {
  DatabaseProvider,
} from '../infrastructure/db/sqlite.provider';
import { IPostOffice } from '../interface/postoffice.interface';
import { PostOffice } from '../domain/models/post-office.model';

export class PostOfficeRepository {
  constructor(private dbProvider: DatabaseProvider) {}

  public async addPostOffice(postOffice: IPostOffice): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO postoffices (id, address, latitude, longitude)
        VALUES (?, ?, ?, ?)
      `;
      const params = Object.values(postOffice);

      this.dbProvider.db.run(query, params, (err) => {
        if (err) {
          console.error('Error inserting post office:', err);
          reject(err);
        } else {
          console.log(
            'Post office %s inserted successfully.',
            postOffice.address
          );
          resolve();
        }
      });
    });
  }

  public getAll(): Promise<IPostOffice[]> {
    return new Promise((resolve, reject) => {
      this.dbProvider.db.all(
        `SELECT * FROM postoffices;`,
        (err, rows: IPostOffice[]) => {
          if (err) {
            reject(err);
          } else {
            console.log('Post office rows from repository: ', rows);
            const result = rows.map((row) => PostOffice.map(row));
            resolve(result);
          }
        }
      );
    });
  }
}

const postOfficeRepo = new PostOfficeRepository(dbProvider);

export default postOfficeRepo;
