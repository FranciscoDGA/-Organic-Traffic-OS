import { BusEvent, EventHistoryEntry, EventStatus } from './communication.types';

const history: EventHistoryEntry[] = [];
const deadLetters: { event: BusEvent; reason: string; timestamp: string; retryCount: number }[] = [];

export function recordEvent(event: BusEvent) {
  history.push({ eventId: event.id, type: event.type, source: event.source, target: event.target, status: event.status, timestamp: event.created_at, correlation_id: event.correlation_id });
}

export function updateEventStatus(eventId: string, status: EventStatus, processed_at?: string) {
  const entry = history.find(h => h.eventId === eventId);
  if (entry) { entry.status = status; }
}

export function getHistory(limit = 50): EventHistoryEntry[] { return history.slice(-limit); }
export function getDeadLetters() { return deadLetters; }
export function addToDeadLetter(event: BusEvent, reason: string) {
  deadLetters.push({ event, reason, timestamp: new Date().toISOString(), retryCount: event.retry_count || 0 });
}
