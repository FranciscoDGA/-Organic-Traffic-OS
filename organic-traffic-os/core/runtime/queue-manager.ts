import { Queue, QueueItem, QueueName } from './runtime.types';
import { eventBus } from './event-bus';

const DEFAULT_MAX_SIZE = 100;

function createEmptyQueue(name: QueueName, maxSize = DEFAULT_MAX_SIZE): Queue {
  return { name, items: [], maxSize, processing: false };
}

export class QueueManager {
  private queues: Map<QueueName, Queue> = new Map([
    ['workflows', createEmptyQueue('workflows')],
    ['agents', createEmptyQueue('agents')],
    ['publishing', createEmptyQueue('publishing', 20)],
    ['sync', createEmptyQueue('sync', 50)],
    ['updates', createEmptyQueue('updates', 50)],
    ['monitoring', createEmptyQueue('monitoring', 30)],
  ]);

  enqueue(queueName: QueueName, type: string, payload: Record<string, unknown>, priority = 5): QueueItem | null {
    const queue = this.queues.get(queueName);
    if (!queue) return null;
    if (queue.items.length >= queue.maxSize) {
      eventBus.emit('ErrorRaised', 'queue-manager', { queue: queueName, error: 'Queue full' });
      return null;
    }
    const item: QueueItem = {
      id: `q-${queueName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      payload,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      retries: 0,
    };
    queue.items.push(item);
    queue.items.sort((a, b) => a.priority - b.priority);
    eventBus.emit('QueueCreated', 'queue-manager', { queue: queueName, itemId: item.id });
    return item;
  }

  dequeue(queueName: QueueName): QueueItem | null {
    const queue = this.queues.get(queueName);
    if (!queue) return null;
    const idx = queue.items.findIndex(i => i.status === 'pending');
    if (idx === -1) return null;
    const item = queue.items[idx];
    item.status = 'processing';
    item.startedAt = new Date().toISOString();
    queue.processing = true;
    return item;
  }

  complete(queueName: QueueName, itemId: string, error?: string): void {
    const queue = this.queues.get(queueName);
    if (!queue) return;
    const item = queue.items.find(i => i.id === itemId);
    if (!item) return;
    item.status = error ? 'failed' : 'completed';
    item.completedAt = new Date().toISOString();
    if (error) item.error = error;
    queue.processing = queue.items.some(i => i.status === 'processing');
    eventBus.emit('QueueFinished', 'queue-manager', { queue: queueName, itemId, status: item.status });
  }

  cancel(queueName: QueueName, itemId: string): boolean {
    const queue = this.queues.get(queueName);
    if (!queue) return false;
    const item = queue.items.find(i => i.id === itemId);
    if (!item) return false;
    item.status = 'cancelled';
    item.completedAt = new Date().toISOString();
    return true;
  }

  getQueue(queueName: QueueName): Queue | undefined {
    return this.queues.get(queueName);
  }

  getQueues(): Record<QueueName, Queue> {
    const result: Record<string, Queue> = {};
    for (const [name, queue] of this.queues) {
      result[name as QueueName] = { ...queue, items: [...queue.items] };
    }
    return result as Record<QueueName, Queue>;
  }

  getPendingCount(queueName: QueueName): number {
    const queue = this.queues.get(queueName);
    return queue ? queue.items.filter(i => i.status === 'pending').length : 0;
  }

  getProcessingCount(queueName: QueueName): number {
    const queue = this.queues.get(queueName);
    return queue ? queue.items.filter(i => i.status === 'processing').length : 0;
  }

  getTotalItems(queueName: QueueName): number {
    const queue = this.queues.get(queueName);
    return queue ? queue.items.length : 0;
  }

  clearCompleted(queueName: QueueName): number {
    const queue = this.queues.get(queueName);
    if (!queue) return 0;
    const before = queue.items.length;
    queue.items = queue.items.filter(i => i.status !== 'completed' && i.status !== 'cancelled');
    return before - queue.items.length;
  }

  getAllQueueSizes(): Record<QueueName, number> {
    const sizes: Record<string, number> = {};
    for (const [name, queue] of this.queues) {
      sizes[name] = queue.items.length;
    }
    return sizes as Record<QueueName, number>;
  }
}

export const queueManager = new QueueManager();
