import { OrganicEvent } from './event.types';

export class EventConsumer {
  private id: string;
  private processed: OrganicEvent[] = [];

  constructor(id: string) {
    this.id = id;
  }

  async handle(event: OrganicEvent): Promise<void> {
    this.processed.push(event);
  }

  getProcessed(): OrganicEvent[] {
    return [...this.processed];
  }

  getId(): string {
    return this.id;
  }
}
