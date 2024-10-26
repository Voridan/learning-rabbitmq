import warehouseRepo, {
  WarehouseRepository,
} from '../repositories/warehouse.repository';
import { IWarehouse, INewWarehouse } from './../interface/warehouse.interface';
import { Warehouse } from '../domain/models/warehouse.model';

export class WarehouseService {
  private warehouseRepository: WarehouseRepository;

  constructor(warehouseRepository: WarehouseRepository) {
    this.warehouseRepository = warehouseRepository;
  }

  public async createWarehouse(data: INewWarehouse): Promise<IWarehouse> {
    const newWarehouse = Warehouse.create({ ...data });
    await this.warehouseRepository.addWarehouse(newWarehouse);

    return newWarehouse;
  }
}

const warehouseService = new WarehouseService(warehouseRepo);

export default warehouseService;
