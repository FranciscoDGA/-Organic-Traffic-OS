import { OrganicEvent, EventType } from './event.types';
import { createEvent } from './event-builder';
import { eventRouter } from './event-router';
import { eventStore } from './event-store';

class EventPublisher {
  async publish(name: string, type: EventType, payload: Record<string, unknown> = {}, options: { workspace_id?: string; mission_id?: string; workflow_id?: string; agent_id?: string; worker_id?: string; correlation_id?: string; causation_id?: string } = {}): Promise<OrganicEvent> {
    const event = createEvent(name, type, payload, options);
    await eventRouter.route(event);
    return event;
  }

  async publishMany(events: Array<{ name: string; type: EventType; payload?: Record<string, unknown>; options?: Record<string, string> }>): Promise<OrganicEvent[]> {
    const results: OrganicEvent[] = [];
    for (const e of events) {
      const event = await this.publish(e.name, e.type, e.payload || {}, e.options || {});
      results.push(event);
    }
    return results;
  }
}

export const eventPublisher = new EventPublisher();
