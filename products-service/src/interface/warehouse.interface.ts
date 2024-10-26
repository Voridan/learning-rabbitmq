import { UUID } from 'crypto';

export interface IGeolocation {
  latitude: number;
  longitude: number;
}

export interface INewWarehouse {
  address: string;
  location: IGeolocation;
  capacity: number;
  load: number;
}

export interface IWarehouse extends INewWarehouse {
  id: UUID | '';
}
