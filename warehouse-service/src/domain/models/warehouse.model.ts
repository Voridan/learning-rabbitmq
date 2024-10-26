import { randomUUID, UUID } from 'crypto';
import { IWarehouse, INewWarehouse } from '../../interface/warehouse.interface';
import domainEvents from '../events/domain.events';
import { NewWarehouse } from './new.warehouse';
import { IGeolocation } from '../../interface/geolocation.interface';

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

  public static create(fields: INewWarehouse) {
    const wh = new Warehouse(
      randomUUID(),
      fields.address,
      fields.location,
      fields.capacity,
      0
    );
    console.log({ ...wh });

    domainEvents.emit('NewWarehouse', new NewWarehouse(wh));
    return wh;
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
