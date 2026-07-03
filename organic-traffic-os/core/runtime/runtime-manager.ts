import { Runtime } from './runtime';
import { RuntimeService, getRuntimeService } from './runtime.service';

let managerInstance: RuntimeManager | null = null;

export class RuntimeManager {
  private service: RuntimeService;
  private autoRestart = false;
  private restartAttempts = 0;
  private maxRestartAttempts = 3;

  constructor() {
    this.service = getRuntimeService();
  }

  async start(): Promise<void> {
    await this.service.start();
    this.restartAttempts = 0;
  }

  async stop(): Promise<void> {
    await this.service.stop();
  }

  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }

  getService(): RuntimeService {
    return this.service;
  }

  setAutoRestart(enabled: boolean): void {
    this.autoRestart = enabled;
  }

  isAutoRestartEnabled(): boolean {
    return this.autoRestart;
  }

  async attemptAutoRestart(): Promise<boolean> {
    if (!this.autoRestart || this.restartAttempts >= this.maxRestartAttempts) return false;
    this.restartAttempts++;
    try {
      await this.start();
      return true;
    } catch {
      return false;
    }
  }

  getRestartAttempts(): number {
    return this.restartAttempts;
  }

  getStatus() {
    return this.service.getStatus();
  }
}

export function getRuntimeManager(): RuntimeManager {
  if (!managerInstance) {
    managerInstance = new RuntimeManager();
  }
  return managerInstance;
}
