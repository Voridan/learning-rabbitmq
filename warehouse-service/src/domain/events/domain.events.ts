import EventEmitter from 'events';
import { DomainEvent } from './domain.event';

type TDomainEvents = 'NewWarehouse' | 'NewProduct';

export class DomainEvents {
  private readonly eventEmitter: EventEmitter;
  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public on<T extends DomainEvent>(
    event: TDomainEvents,
    cb: (payload: T) => void
  ) {
    this.eventEmitter.on(event, cb);
  }

  public emit<T extends DomainEvent>(event: TDomainEvents, payload: T) {
    this.eventEmitter.emit(event, payload);
  }

  public off(event: TDomainEvents, cb: () => void) {
    this.eventEmitter.off(event, cb);
  }
}

const domainEvents = new DomainEvents();

export default domainEvents;
