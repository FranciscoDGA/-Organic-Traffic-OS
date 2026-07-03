import { OrganicEvent, EventType } from './event.types';
import { eventStore } from './event-store';
import { subscriptionManager } from './subscription-manager';

class EventRouter {
  async route(event: OrganicEvent): Promise<void> {
    eventStore.store(event);
    event.status = 'processing';
    eventStore.updateStatus(event.event_id, 'processing');

    const subscribers = subscriptionManager.getSubscribers(event.event_type);
    if (subscribers.length === 0) {
      event.status = 'completed';
      eventStore.updateStatus(event.event_id, 'completed');
      return;
    }

    for (const sub of subscribers) {
      try {
        await sub.handler(event);
      } catch {
        event.retry_count++;
        if (event.retry_count >= event.max_retries) {
          event.status = 'dead_letter';
          eventStore.updateStatus(event.event_id, 'dead_letter');
        } else {
          event.status = 'failed';
          eventStore.updateStatus(event.event_id, 'failed');
        }
      }
    }

    if (event.status === 'processing') {
      event.status = 'completed';
      eventStore.updateStatus(event.event_id, 'completed');
    }
  }
}

export const eventRouter = new EventRouter();
