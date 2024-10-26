import { UUID } from 'crypto';
import { IWarehouse } from '../../../interface/warehouse.interface';
import { IGeolocation } from '../../../interface/geolocation.interface';

export class Warehouse implements IWarehouse {
  private constructor(
    public readonly id: UUID,
    public readonly address: string,
    public readonly location: IGeolocation,
    public readonly capacity: number,
    public readonly load: number
  ) {}

  public static map(fileds: IWarehouse) {
    return new Warehouse(
      fileds.id,
      fileds.address,
      fileds.location,
      fileds.capacity,
      fileds.load
    );
  }
}
