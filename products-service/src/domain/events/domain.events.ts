import EventEmitter from 'events';
import { Response } from 'express';
import { NewProduct } from '../models/product/new.product';
import { NewWarehouse } from '../models/warehouse/new.warehouse';
import { Purchase } from '../models/product/purchase';

type TDomainEvents = 'NewProduct' | 'NewWarehouse' | 'ProductPurchase';

export interface PlainPayload<T> {
  payload: T;
}

export interface PayloadWithAck<T> {
  payload: T;
  ack: () => void;
}

export interface PayloadWithResponse<T> {
  payload: T;
  res: Response;
}

export type PayloadMap = {
  NewProduct: PlainPayload<NewProduct>;
  NewWarehouse: PayloadWithAck<NewWarehouse>;
  ProductPurchase: PayloadWithResponse<Purchase>;
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
