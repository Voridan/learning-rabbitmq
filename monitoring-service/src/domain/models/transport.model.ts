import { UUID } from 'crypto';
import { IGeolocation } from '../../interface/geolocation.interface';
import { ITransport, TransportType } from '../../interface/transport.interface';

export class Transport implements ITransport {
  private constructor(
    public readonly id: UUID,
    public readonly type: TransportType,
    public readonly currentLocation: IGeolocation,
    public readonly capacity: number
  ) {}

  public static map(fileds: ITransport) {
    return new Transport(
      fileds.id,
      fileds.type,
      fileds.currentLocation,
      fileds.capacity
    );
  }
}
