import { DomainEvent } from '../../events/domain.event';
import { Warehouse } from './warehouse.model';

export class NewWarehouse extends DomainEvent {
  constructor(public warehouse: Warehouse) {
    super(warehouse.id);
  }
}
