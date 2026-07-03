import { OrganicEvent, EventType } from './event.types';
import { eventPublisher } from './event-publisher';
import { eventStore } from './event-store';
import { subscriptionManager } from './subscription-manager';
import { eventRouter } from './event-router';

class EventBusService {
  private publisher = eventPublisher;
  private store = eventStore;
  private subscriptions = subscriptionManager;
  private router = eventRouter;

  async publish(name: string, type: EventType, payload: Record<string, unknown> = {}, options: Record<string, string> = {}): Promise<OrganicEvent> {
    return this.publisher.publish(name, type, payload, options);
  }

  subscribe(subscriberId: string, eventTypes: EventType[], handler: (event: OrganicEvent) => Promise<void>) {
    return this.subscriptions.subscribe(subscriberId, eventTypes, handler);
  }

  unsubscribe(subscriptionId: string): boolean {
    return this.subscriptions.unsubscribe(subscriptionId);
  }

  getEvent(id: string): OrganicEvent | undefined {
    return this.store.getById(id);
  }

  getAllEvents(): OrganicEvent[] {
    return this.store.getAll();
  }

  getRecentEvents(count: number): OrganicEvent[] {
    return this.store.getRecent(count);
  }

  getFailedEvents(): OrganicEvent[] {
    return this.store.getFailed();
  }

  getStats() {
    return this.store.getStats();
  }

  getSubscriptions() {
    return this.subscriptions.getAll();
  }

  async replay(eventIds: string[]): Promise<OrganicEvent[]> {
    const results: OrganicEvent[] = [];
    for (const id of eventIds) {
      const event = this.store.getById(id);
      if (event) {
        event.status = 'pending';
        event.retry_count = 0;
        await this.router.route(event);
        results.push(event);
      }
    }
    return results;
  }
}

export const eventBusService = new EventBusService();
