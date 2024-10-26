import { UUID } from 'crypto';

export interface IGeolocation {
  latitude: number;
  longitude: number;
}

export interface IPostOffice {
  id: UUID;
  address: string;
  number: number;
  location: IGeolocation;
}
