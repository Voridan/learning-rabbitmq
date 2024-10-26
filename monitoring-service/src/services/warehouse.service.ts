import { IWarehouse } from '../interface/warehouse.interface';
import warehouseRepo, {
  WarehouseRepository,
} from '../repositories/warehouse.repository';

export class WarehouseService {
  constructor(private readonly repo: WarehouseRepository) {}

  public async addWarehouse(warehouse: IWarehouse) {
    await this.repo.addWarehouse(warehouse);
  }

  public async getAll() {
    return await this.repo.getAll();
  }
}

const warehouseService = new WarehouseService(warehouseRepo);

export default warehouseService;
