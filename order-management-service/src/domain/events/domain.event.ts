export class DomainEvent {
  public eventType: string;
  public created: number;

  constructor(public correlationId?: string) {
    this.eventType = this.constructor.name;
    this.created = Date.now();
  }
}
