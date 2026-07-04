import { BusEvent, EventType, EventPriority, EventStatus, Subscriber, EventHistoryEntry, DeadLetterEntry } from './communication.types';
import { validateEvent } from './event-validator';
import { publishEvent, acknowledgeEvent, retryEvent, getRetryQueue } from './event-publisher';
import { addSubscriber, removeSubscriber, getSubscribers, getSubscribersByComponent } from './event-subscriber';
import { routeEvent, getPendingDeliveries, completeDelivery } from './event-router';
import { registerComponent, unregisterComponent, getRegistry, getRegisteredForType } from './event-registry';
import { recordEvent, updateEventStatus, getHistory, getDeadLetters, addToDeadLetter } from './event-history';

let eventCounter = 0;
function generateId(): string { return `evt-${Date.now()}-${++eventCounter}`; }

export function getCommunicationService() {
  return {
    publish(eventData: { workspace_id: string; source: string; target?: string; type: EventType; payload: Record<string, unknown>; priority?: EventPriority }): BusEvent {
      const event: BusEvent = {
        id: generateId(),
        workspace_id: eventData.workspace_id,
        source: eventData.source,
        target: eventData.target,
        type: eventData.type,
        payload: eventData.payload,
        priority: eventData.priority || 'normal',
        status: 'pending',
        correlation_id: `corr-${Date.now()}-${++eventCounter}`,
        created_at: new Date().toISOString(),
      };
      publishEvent(event);
      routeEvent(event);
      return event;
    },
    subscribe(subscriber: Subscriber) { addSubscriber(subscriber); },
    unsubscribe(id: string) { removeSubscriber(id); },
    retry(event: BusEvent): boolean { return retryEvent(event); },
    deadLetter(event: BusEvent, reason: string) { addToDeadLetter(event, reason); updateEventStatus(event.id, 'dead-letter'); },
    acknowledge(eventId: string) { acknowledgeEvent(eventId); },
    replay(eventId: string) {
      const history = getHistory(1000);
      const entry = history.find(h => h.eventId === eventId);
      if (entry) { return { ...entry, status: 'pending' as EventStatus }; }
      return null;
    },
    register(id: string, eventTypes: EventType[], component: string) { registerComponent(id, eventTypes, component); },
    unregister(id: string) { unregisterComponent(id); },
    getHistory(limit?: number) { return getHistory(limit); },
    getDeadLetters() { return getDeadLetters(); },
    getSubscribers() { return getSubscribers(); },
    getSubscribersByComponent(component: string) { return getSubscribersByComponent(component); },
    getPendingDeliveries() { return getPendingDeliveries(); },
    getRetryQueue() { return getRetryQueue(); },
    getRegistry() { return getRegistry(); },
    deliver(eventId: string) { completeDelivery(eventId); },
  };
}
