import { RuntimeEvent, EventType } from './runtime.types';

type EventHandler = (event: RuntimeEvent) => void;

export class EventBus {
  private handlers: Map<EventType, EventHandler[]> = new Map();
  private history: RuntimeEvent[] = [];
  private maxHistory = 200;

  on(type: EventType, handler: EventHandler): void {
    const handlers = this.handlers.get(type) || [];
    handlers.push(handler);
    this.handlers.set(type, handlers);
  }

  off(type: EventType, handler: EventHandler): void {
    const handlers = this.handlers.get(type) || [];
    this.handlers.set(type, handlers.filter(h => h !== handler));
  }

  emit(type: EventType, source: string, payload: Record<string, unknown> = {}): RuntimeEvent {
    const event: RuntimeEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      source,
      payload,
      timestamp: new Date().toISOString(),
    };

    this.history.unshift(event);
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(0, this.maxHistory);
    }

    const handlers = this.handlers.get(type) || [];
    for (const handler of handlers) {
      try {
        handler(event);
      } catch (err) {
        console.error(`[EventBus] Error in handler for ${type}:`, err);
      }
    }

    const allHandlers = this.handlers.get('*' as EventType) || [];
    for (const handler of allHandlers) {
      try {
        handler(event);
      } catch (err) {
        console.error('[EventBus] Error in wildcard handler:', err);
      }
    }

    return event;
  }

  getHistory(limit = 50): RuntimeEvent[] {
    return this.history.slice(0, limit);
  }

  clearHistory(): void {
    this.history = [];
  }

  listenerCount(type: EventType): number {
    return (this.handlers.get(type) || []).length;
  }
}

export const eventBus = new EventBus();
