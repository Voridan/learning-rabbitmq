import { UUID } from 'crypto';
import { IGeolocation } from './geolocation.interface';

export interface IWarehouse {
  id: UUID;
  address: string;
  location: IGeolocation;
  capacity: number;
  load: number;
}
