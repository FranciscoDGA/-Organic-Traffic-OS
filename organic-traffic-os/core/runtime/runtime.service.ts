import { Runtime } from './runtime';
import { RuntimeStatus, RuntimeConfig } from './runtime.types';

let runtimeInstance: Runtime | null = null;

export function getRuntime(): Runtime {
  if (!runtimeInstance) {
    runtimeInstance = new Runtime();
  }
  return runtimeInstance;
}

export class RuntimeService {
  private runtime: Runtime;

  constructor() {
    this.runtime = getRuntime();
  }

  async start(): Promise<RuntimeStatus> {
    await this.runtime.start();
    return this.runtime.getStatus();
  }

  async stop(): Promise<RuntimeStatus> {
    await this.runtime.stop();
    return this.runtime.getStatus();
  }

  getStatus(): RuntimeStatus {
    return this.runtime.getStatus();
  }

  getModules() {
    return this.runtime.getModules();
  }

  getHealth() {
    return this.runtime.getHealth();
  }

  getEvents(limit = 50) {
    return this.runtime.getEvents(limit);
  }

  getQueues() {
    return this.runtime.getQueues();
  }

  getScheduler() {
    return this.runtime.getScheduler();
  }

  getHeartbeat() {
    return this.runtime.getHeartbeat();
  }

  getHealthMonitor() {
    return this.runtime.getHealthMonitor();
  }

  getQueueProcessor() {
    return this.runtime.getQueueProcessor();
  }

  isRunning(): boolean {
    return this.runtime.getState() === 'running';
  }
}

let serviceInstance: RuntimeService | null = null;

export function getRuntimeService(): RuntimeService {
  if (!serviceInstance) {
    serviceInstance = new RuntimeService();
  }
  return serviceInstance;
}
