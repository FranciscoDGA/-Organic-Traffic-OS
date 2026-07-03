import { HeartbeatData, QueueName } from './runtime.types';
import { eventBus } from './event-bus';

export class Heartbeat {
  private intervalMs: number;
  private timer: ReturnType<typeof setInterval> | null = null;
  private history: HeartbeatData[] = [];
  private maxHistory = 100;
  private startTime: number = Date.now();
  private getQueueSizes: () => Record<QueueName, number>;
  private getActiveModules: () => number;
  private getActiveTasks: () => number;

  constructor(
    intervalMs: number,
    getQueueSizes: () => Record<QueueName, number>,
    getActiveModules: () => number,
    getActiveTasks: () => number,
  ) {
    this.intervalMs = intervalMs;
    this.getQueueSizes = getQueueSizes;
    this.getActiveModules = getActiveModules;
    this.getActiveTasks = getActiveTasks;
  }

  start(): void {
    if (this.timer) return;
    this.tick();
    this.timer = setInterval(() => this.tick(), this.intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  tick(): HeartbeatData {
    const data: HeartbeatData = {
      timestamp: new Date().toISOString(),
      uptimeMs: Date.now() - this.startTime,
      memoryUsageMB: this.getMemoryUsage(),
      activeModules: this.getActiveModules(),
      activeTasks: this.getActiveTasks(),
      queueSizes: this.getQueueSizes(),
    };
    this.history.unshift(data);
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(0, this.maxHistory);
    }
    eventBus.emit('Heartbeat', 'heartbeat', {
      uptimeMs: data.uptimeMs,
      memoryMB: data.memoryUsageMB,
      activeModules: data.activeModules,
      activeTasks: data.activeTasks,
    });
    return data;
  }

  getLatest(): HeartbeatData | null {
    return this.history[0] || null;
  }

  getHistory(limit = 10): HeartbeatData[] {
    return this.history.slice(0, limit);
  }

  isRunning(): boolean {
    return this.timer !== null;
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    }
    return 0;
  }
}
