import { OrganicEvent, EventSubscription, EventHandler, EventType } from './event.types';

class SubscriptionManager {
  private subscriptions: EventSubscription[] = [];
  private subCounter = 0;

  subscribe(subscriberId: string, eventTypes: EventType[], handler: EventHandler): EventSubscription {
    const sub: EventSubscription = {
      id: `sub-${Date.now()}-${++this.subCounter}`,
      subscriberId,
      eventTypes,
      handler,
      active: true,
    };
    this.subscriptions.push(sub);
    return sub;
  }

  unsubscribe(subscriptionId: string): boolean {
    const sub = this.subscriptions.find(s => s.id === subscriptionId);
    if (!sub) return false;
    sub.active = false;
    return true;
  }

  getSubscribers(eventType: EventType): EventSubscription[] {
    return this.subscriptions.filter(s => s.active && s.eventTypes.includes(eventType));
  }

  getAll(): EventSubscription[] {
    return this.subscriptions.map(s => ({ ...s, handler: undefined as unknown as EventHandler }));
  }

  getActive(): EventSubscription[] {
    return this.subscriptions.filter(s => s.active).map(s => ({ ...s, handler: undefined as unknown as EventHandler }));
  }
}

export const subscriptionManager = new SubscriptionManager();
