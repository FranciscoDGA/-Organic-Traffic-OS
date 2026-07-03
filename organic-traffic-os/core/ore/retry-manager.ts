import { RuntimeJob } from './runtime.types';

export class RetryManager {
  private maxRetries: number;
  private baseDelayMs: number;
  private maxDelayMs: number;

  constructor(maxRetries = 3, baseDelayMs = 1000, maxDelayMs = 30000) {
    this.maxRetries = maxRetries;
    this.baseDelayMs = baseDelayMs;
    this.maxDelayMs = maxDelayMs;
  }

  shouldRetry(job: RuntimeJob): boolean {
    return job.attempt < job.maxAttempts && job.status !== 'cancelled';
  }

  getRetryDelay(attempt: number): number {
    return Math.min(this.baseDelayMs * Math.pow(2, attempt), this.maxDelayMs);
  }

  prepareRetry(job: RuntimeJob): RuntimeJob {
    return {
      ...job,
      status: 'retry',
      attempt: job.attempt + 1,
      updatedAt: new Date().toISOString(),
    };
  }

  moveToDeadLetter(job: RuntimeJob): RuntimeJob {
    return {
      ...job,
      status: 'dead_letter',
      updatedAt: new Date().toISOString(),
    };
  }

  getMaxRetries(): number { return this.maxRetries; }
}
