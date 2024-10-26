import { UUID } from 'crypto';
import { IPostOffice } from '../../interface/postoffice.interface';
import { IGeolocation } from '../../interface/geolocation.interface';

export class PostOffice implements IPostOffice {
  private constructor(
    public readonly id: UUID,
    public readonly address: string,
    public readonly location: IGeolocation
  ) {}

  public static map(fileds: IPostOffice) {
    return new PostOffice(fileds.id, fileds.address, fileds.location);
  }
}
