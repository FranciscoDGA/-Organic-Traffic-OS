import { BusEvent } from './communication.types';
import { getSubscribers } from './event-subscriber';
import { recordEvent, updateEventStatus } from './event-history';
import { acknowledgeEvent } from './event-publisher';

const pendingDelivery = new Map<string, { event: BusEvent; targets: string[] }>();

export function routeEvent(event: BusEvent): string[] {
  const subscribers = getSubscribers();
  const targets = subscribers
    .filter(s => s.eventTypes.includes(event.type) && (!s.workspace_id || s.workspace_id === event.workspace_id))
    .map(s => s.id);
  pendingDelivery.set(event.id, { event, targets });
  return targets;
}

export function getPendingDeliveries() { return Array.from(pendingDelivery.entries()).map(([id, d]) => ({ id, event: d.event, targets: d.targets })); }

export function completeDelivery(eventId: string) {
  const delivery = pendingDelivery.get(eventId);
  if (delivery) { acknowledgeEvent(eventId); updateEventStatus(eventId, 'completed', new Date().toISOString()); pendingDelivery.delete(eventId); }
}
