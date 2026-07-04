export { getCommunicationService } from './communication.service';
export { validateEvent } from './event-validator';
export { publishEvent, acknowledgeEvent, retryEvent, getRetryQueue } from './event-publisher';
export { addSubscriber, removeSubscriber, getSubscribers, getSubscribersByComponent } from './event-subscriber';
export { routeEvent, getPendingDeliveries, completeDelivery } from './event-router';
export { registerComponent, unregisterComponent, getRegistry, getRegisteredForType } from './event-registry';
export { recordEvent, updateEventStatus, getHistory, getDeadLetters, addToDeadLetter } from './event-history';
export type { BusEvent, Subscriber, EventHistoryEntry, DeadLetterEntry, EventType, EventPriority, EventStatus } from './communication.types';
