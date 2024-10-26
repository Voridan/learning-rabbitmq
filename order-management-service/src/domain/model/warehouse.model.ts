import { IWarehouse } from '../../interface/warehouse.interface';
import { UUID } from 'crypto';

export class Warehouse implements IWarehouse {
  constructor(public readonly id: UUID, public readonly address: string) {}
}
