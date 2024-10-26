import { UUID } from 'crypto';
import { IGeolocation } from './geolocation.interface';

export interface IPostOffice {
  id: UUID;
  address: string;
  location: IGeolocation;
}
