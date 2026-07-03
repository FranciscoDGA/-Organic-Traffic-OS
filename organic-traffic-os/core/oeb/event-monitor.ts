import { eventStore } from './event-store';
import { subscriptionManager } from './subscription-manager';

class EventMonitor {
  getStats() {
    return eventStore.getStats();
  }

  getRecent(count: number) {
    return eventStore.getRecent(count);
  }

  getFailed() {
    return eventStore.getFailed();
  }

  getSubscriptions() {
    return subscriptionManager.getAll();
  }

  getActiveSubscriptions() {
    return subscriptionManager.getActive();
  }

  getLatency(): number {
    const events = eventStore.getAll();
    if (events.length < 2) return 0;
    const recent = events.slice(-10);
    let total = 0;
    for (let i = 1; i < recent.length; i++) {
      total += new Date(recent[i].timestamp).getTime() - new Date(recent[i - 1].timestamp).getTime();
    }
    return total / (recent.length - 1);
  }
}

export const eventMonitor = new EventMonitor();
