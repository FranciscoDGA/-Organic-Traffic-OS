import { RuntimeWorker } from './runtime.types';

export class ExecutionMonitor {
  private metrics: {
    jobsPerMinute: number;
    totalJobs: number;
    completedJobs: number;
    failedJobs: number;
    retries: number;
    deadLetters: number;
    totalExecutionMs: number;
    jobsLastMinute: number[];
  } = {
    jobsPerMinute: 0, totalJobs: 0, completedJobs: 0, failedJobs: 0,
    retries: 0, deadLetters: 0, totalExecutionMs: 0, jobsLastMinute: [],
  };

  recordJob(durationMs: number, success: boolean): void {
    this.metrics.totalJobs++;
    this.metrics.totalExecutionMs += durationMs;
    if (success) this.metrics.completedJobs++;
    else this.metrics.failedJobs++;
    this.metrics.jobsLastMinute.push(Date.now());
    this.cleanOldEntries();
  }

  recordRetry(): void { this.metrics.retries++; }
  recordDeadLetter(): void { this.metrics.deadLetters++; }

  private cleanOldEntries(): void {
    const cutoff = Date.now() - 60000;
    this.metrics.jobsLastMinute = this.metrics.jobsLastMinute.filter(t => t > cutoff);
    this.metrics.jobsPerMinute = this.metrics.jobsLastMinute.length;
  }

  getMetrics(workers: RuntimeWorker[]) {
    this.cleanOldEntries();
    return {
      jobsPerMinute: this.metrics.jobsPerMinute,
      avgExecutionMs: this.metrics.completedJobs > 0 ? Math.round(this.metrics.totalExecutionMs / this.metrics.completedJobs) : 0,
      totalQueued: 0,
      activeWorkers: workers.filter(w => w.status === 'busy').length,
      offlineWorkers: workers.filter(w => w.status === 'offline').length,
      retries: this.metrics.retries,
      failures: this.metrics.failedJobs,
      deadLetters: this.metrics.deadLetters,
    };
  }
}
