import { UUID } from 'crypto';
import {
  IWarehouse,
  IGeolocation,
} from '../../../interface/warehouse.interface';

export class Warehouse implements IWarehouse {
  private constructor(
    private _id: UUID,
    private _address: string,
    private _location: IGeolocation,
    private _capacity: number,
    private _load: number
  ) {}

  get id() {
    return this._id;
  }

  get address() {
    return this._address;
  }

  get location() {
    return this._location;
  }

  get capacity() {
    return this._capacity;
  }

  get load() {
    return this._load;
  }

  public static map(fields: IWarehouse): Warehouse {
    if (fields.id) {
      const wh = new Warehouse(
        fields.id,
        fields.address,
        fields.location,
        fields.capacity,
        fields.load
      );
      return wh;
    }

    throw new Error('Invalid id');
  }

  public plain() {
    return {
      id: this._id,
      address: this._address,
      location: this._location,
      capacity: this._capacity,
      load: this._load,
    };
  }
}
