import EventEmitter from 'events';
import { Purchase } from '../../interface/purchase.interface';

type TDomainEvents = 'ProductPurchase';

export interface PlainPayload<T> {
  payload: T;
}

export interface PayloadWithAck<T> {
  payload: T;
  ack: () => void;
}

export type PayloadMap = {
  ProductPurchase: PayloadWithAck<Purchase>;
};

export class DomainEvents {
  private readonly eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public on<K extends keyof PayloadMap>(
    event: K,
    cb: (params: PayloadMap[K]) => void
  ) {
    this.eventEmitter.on(event, cb);
  }

  public emit<K extends keyof PayloadMap>(
    event: K,
    params: PayloadMap[K]
  ): void {
    this.eventEmitter.emit(event, params);
  }

  public off(event: TDomainEvents, cb: () => void) {
    this.eventEmitter.off(event, cb);
  }
}

const domainEvents = new DomainEvents();

export default domainEvents;
