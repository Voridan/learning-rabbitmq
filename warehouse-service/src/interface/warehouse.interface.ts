import { UUID } from 'crypto';
import { IGeolocation } from './geolocation.interface';

export interface INewWarehouse {
  address: string;
  location: IGeolocation;
  capacity: number;
}

export interface IWarehouse extends INewWarehouse {
  id: UUID | '';
  load: number;
}
