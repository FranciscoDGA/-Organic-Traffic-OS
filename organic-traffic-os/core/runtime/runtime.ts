import { RuntimeState, RuntimeConfig, RuntimeStatus, QueueName } from './runtime.types';
import { eventBus } from './event-bus';
import { moduleRegistry } from './module-registry';
import { moduleLoader } from './module-loader';
import { queueManager } from './queue-manager';
import { Scheduler } from './scheduler';
import { Heartbeat } from './heartbeat';
import { HealthMonitor } from './health-monitor';

const DEFAULT_CONFIG: RuntimeConfig = {
  maxQueueSize: 100,
  heartbeatIntervalMs: 30_000,
  healthCheckIntervalMs: 60_000,
  maxRetries: 3,
  enableScheduler: true,
  enableHealthMonitor: true,
  enableHeartbeat: true,
};

export class Runtime {
  private state: RuntimeState = 'stopped';
  private startedAt?: string;
  private config: RuntimeConfig;
  private scheduler: Scheduler;
  private heartbeat: Heartbeat;
  private healthMonitor: HealthMonitor;
  private getQueueSizes: () => Record<QueueName, number>;
  private getActiveModules: () => number;
  private getActiveTasks: () => number;

  constructor(config: Partial<RuntimeConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.getQueueSizes = () => queueManager.getAllQueueSizes();
    this.getActiveModules = () => moduleRegistry.getActive().length;
    this.getActiveTasks = () => {
      let total = 0;
      for (const name of ['workflows', 'agents', 'publishing', 'sync', 'updates', 'monitoring'] as QueueName[]) {
        total += queueManager.getProcessingCount(name);
      }
      return total;
    };
    this.heartbeat = new Heartbeat(
      this.config.heartbeatIntervalMs,
      this.getQueueSizes,
      this.getActiveModules,
      this.getActiveTasks,
    );
    this.healthMonitor = new HealthMonitor(this.config.healthCheckIntervalMs);
    this.scheduler = new Scheduler();
  }

  async start(): Promise<void> {
    if (this.state === 'running') return;
    this.state = 'starting';
    eventBus.emit('RuntimeStarted', 'runtime', {});

    try {
      await moduleLoader.loadAll();
      moduleRegistry.getAll().forEach(m => {
        if (m.status === 'loaded') moduleRegistry.updateStatus(m.id, 'active');
      });

      if (this.config.enableScheduler) this.scheduler.start();
      if (this.config.enableHeartbeat) this.heartbeat.start();
      if (this.config.enableHealthMonitor) this.healthMonitor.start();

      this.startedAt = new Date().toISOString();
      this.state = 'running';
      eventBus.emit('RuntimeStarted', 'runtime', { modules: moduleRegistry.size() });
    } catch (err) {
      this.state = 'error';
      eventBus.emit('ErrorRaised', 'runtime', { error: (err as Error).message });
    }
  }

  async stop(): Promise<void> {
    if (this.state === 'stopped') return;
    this.state = 'stopping';
    eventBus.emit('RuntimeStopped', 'runtime', {});

    this.scheduler.stop();
    this.heartbeat.stop();
    this.healthMonitor.stop();
    moduleRegistry.getAll().forEach(m => {
      moduleRegistry.updateStatus(m.id, 'unloaded');
    });

    this.state = 'stopped';
    eventBus.emit('RuntimeStopped', 'runtime', { stoppedAt: new Date().toISOString() });
  }

  getStatus(): RuntimeStatus {
    return {
      state: this.state,
      uptimeMs: this.startedAt ? Date.now() - new Date(this.startedAt).getTime() : 0,
      startedAt: this.startedAt,
      lastHeartbeat: this.heartbeat.getLatest()?.timestamp,
      modules: moduleRegistry.getAll(),
      queues: queueManager.getQueues(),
      schedules: this.scheduler.getSchedules(),
      recentEvents: eventBus.getHistory(20),
      health: this.healthMonitor.getAllScores(),
      memoryUsageMB: this.heartbeat.getLatest()?.memoryUsageMB || 0,
    };
  }

  getState(): RuntimeState {
    return this.state;
  }

  getModules() {
    return moduleRegistry.getAll();
  }

  getHealth() {
    return this.healthMonitor.getAllScores();
  }

  getEvents(limit = 50) {
    return eventBus.getHistory(limit);
  }

  getQueues() {
    return queueManager.getQueues();
  }

  getScheduler() {
    return this.scheduler;
  }

  getHeartbeat() {
    return this.heartbeat;
  }

  getHealthMonitor() {
    return this.healthMonitor;
  }

  getConfig(): RuntimeConfig {
    return { ...this.config };
  }
}
