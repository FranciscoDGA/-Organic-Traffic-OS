import { ConnectorConfig } from './connector-types';

export class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount = 0;
  private lastFailureTime = 0;
  private successCount = 0;

  constructor(
    private failureThreshold: number = 5,
    private recoveryTimeoutMs: number = 60000,
    private halfOpenMaxAttempts: number = 3,
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeoutMs) {
        this.state = 'half-open';
        this.successCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === 'half-open') {
      this.successCount++;
      if (this.successCount >= this.halfOpenMaxAttempts) {
        this.state = 'closed';
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open';
    }
  }

  getState(): string { return this.state; }
  getFailureCount(): number { return this.failureCount; }
  reset(): void { this.state = 'closed'; this.failureCount = 0; this.successCount = 0; }
}

export class RetryHandler {
  constructor(
    private maxRetries: number = 3,
    private backoffMs: number = 1000,
    private maxBackoffMs: number = 30000,
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err as Error;
        if (attempt < this.maxRetries) {
          const delay = Math.min(this.backoffMs * Math.pow(2, attempt), this.maxBackoffMs);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
    throw lastError;
  }
}

export class RateLimiter {
  private requests: number[] = [];
  constructor(private maxRequests: number, private windowMs: number = 60000) {}

  async acquire(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    if (this.requests.length >= this.maxRequests) {
      const waitTime = this.windowMs - (now - this.requests[0]);
      await new Promise(r => setTimeout(r, waitTime));
    }
    this.requests.push(Date.now());
  }

  getRemaining(): number {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }
}
