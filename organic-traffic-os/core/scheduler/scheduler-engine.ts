import { JobManager } from './job-manager';
import { jobRegistry } from './job-registry';
import { jobRunner } from './job-runner';
import { jobHistory } from './job-history';
import { JobDefinition } from './job-types';

let engineInstance: SchedulerEngine | null = null;

export class SchedulerEngine {
  private manager: JobManager;
  private interval: ReturnType<typeof setInterval> | null = null;
  private checkIntervalMs = 10_000;
  private running = false;
  private startTime = Date.now();

  constructor() {
    this.manager = new JobManager();
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.interval = setInterval(() => this.tick(), this.checkIntervalMs);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.running = false;
  }

  isRunning(): boolean {
    return this.running;
  }

  getUptimeMs(): number {
    return Date.now() - this.startTime;
  }

  private tick(): void {
    const now = Date.now();
    const jobs = jobRegistry.getActive();
    for (const job of jobs) {
      if (job.nextRun) {
        const nextTime = new Date(job.nextRun).getTime();
        if (nextTime <= now) {
          this.executeJob(job);
        }
      }
    }
  }

  private async executeJob(job: JobDefinition): Promise<void> {
    jobRegistry.updateStatus(job.id, 'running');
    const execution = await jobRunner.execute(job);
    const nextRun = this.manager.calculateNextRun(job);
    jobRegistry.update(job.id, {
      status: execution.status === 'completed' ? 'scheduled' : 'failed',
      lastRun: execution.startedAt,
      nextRun: nextRun || undefined,
      lastError: execution.error,
    });
  }

  getManager(): JobManager {
    return this.manager;
  }
}

export function getSchedulerEngine(): SchedulerEngine {
  if (!engineInstance) {
    engineInstance = new SchedulerEngine();
  }
  return engineInstance;
}
