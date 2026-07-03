import { RuntimeJob, RuntimeQueue, QueueName, JobPriority } from './runtime.types';

const PRIORITY_ORDER: Record<JobPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3, background: 4 };

class Queue {
  items: RuntimeJob[] = [];
  constructor(public name: QueueName, public maxSize = 1000) {}

  enqueue(job: RuntimeJob): boolean {
    if (this.items.length >= this.maxSize) return false;
    this.items.push(job);
    this.items.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    return true;
  }

  dequeue(): RuntimeJob | undefined {
    const idx = this.items.findIndex(j => j.status === 'queued');
    if (idx === -1) return undefined;
    const job = this.items[idx];
    this.items.splice(idx, 1);
    return job;
  }

  getPending(): RuntimeJob[] { return this.items.filter(j => j.status === 'queued'); }
  getProcessing(): RuntimeJob[] { return this.items.filter(j => j.status === 'running'); }
  remove(jobId: string): boolean {
    const idx = this.items.findIndex(j => j.id === jobId);
    if (idx === -1) return false;
    this.items.splice(idx, 1);
    return true;
  }

  getStatus(): RuntimeQueue {
    return {
      name: this.name,
      pending: this.getPending().length,
      processing: this.getProcessing().length,
      completed: this.items.filter(j => j.status === 'completed').length,
      failed: this.items.filter(j => j.status === 'failed').length,
      maxSize: this.maxSize,
    };
  }
}

export class QueueManager {
  private queues: Map<QueueName, Queue> = new Map();

  constructor() {
    const names: QueueName[] = ['missions', 'content', 'publishing', 'updates', 'refresh', 'business', 'analytics', 'playbooks', 'emails', 'system'];
    for (const name of names) this.queues.set(name, new Queue(name));
  }

  enqueue(job: RuntimeJob): boolean {
    const queue = this.queues.get(job.queue);
    return queue ? queue.enqueue(job) : false;
  }

  dequeue(queueName: QueueName): RuntimeJob | undefined {
    return this.queues.get(queueName)?.dequeue();
  }

  dequeueAny(): RuntimeJob | undefined {
    const order: QueueName[] = ['urgent' as any, 'missions', 'system', 'content', 'publishing', 'updates', 'refresh', 'business', 'analytics', 'playbooks', 'emails'];
    for (const name of order) {
      const job = this.dequeue(name);
      if (job) return job;
    }
    for (const queue of this.queues.values()) {
      const job = queue.dequeue();
      if (job) return job;
    }
    return undefined;
  }

  getQueue(name: QueueName): Queue | undefined { return this.queues.get(name); }
  getAllStatus(): RuntimeQueue[] { return Array.from(this.queues.values()).map(q => q.getStatus()); }
  getTotalPending(): number { return Array.from(this.queues.values()).reduce((sum, q) => sum + q.getPending().length, 0); }
  getTotalProcessing(): number { return Array.from(this.queues.values()).reduce((sum, q) => sum + q.getProcessing().length, 0); }
}
