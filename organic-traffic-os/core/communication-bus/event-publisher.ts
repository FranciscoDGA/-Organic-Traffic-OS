import { BusEvent, EventPriority } from './communication.types';
import { recordEvent, updateEventStatus, addToDeadLetter } from './event-history';

const retryQueue: BusEvent[] = [];
const MAX_RETRIES = 3;

export function publishEvent(event: BusEvent) {
  event.status = 'pending';
  event.created_at = event.created_at || new Date().toISOString();
  recordEvent(event);
}

export function acknowledgeEvent(eventId: string) {
  updateEventStatus(eventId, 'completed', new Date().toISOString());
}

export function retryEvent(event: BusEvent): boolean {
  const count = (event.retry_count || 0) + 1;
  event.retry_count = count;
  if (count > MAX_RETRIES) { addToDeadLetter(event, `Exceeded max retries (${MAX_RETRIES})`); updateEventStatus(event.id, 'dead-letter'); return false; }
  updateEventStatus(event.id, 'retrying');
  retryQueue.push(event);
  return true;
}

export function getRetryQueue() { return retryQueue; }
