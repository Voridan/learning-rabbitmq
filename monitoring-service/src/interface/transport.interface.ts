import { UUID } from 'crypto';
import { IGeolocation } from './geolocation.interface';

export enum TransportType {
  TRUCK,
  PLANE,
  SHIP,
}

export interface ITransport {
  id: UUID;
  type: TransportType;
  currentLocation: IGeolocation;
  capacity: number; // roughly, amount of products that it can take
}
