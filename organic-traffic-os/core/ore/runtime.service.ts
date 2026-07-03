import { RuntimeJob, RuntimeStatus, QueueName, JobPriority, JobStatus } from './runtime.types';
import { QueueManager } from './queue-manager';
import { WorkerManager } from './workers';
import { RetryManager } from './retry-manager';
import { ExecutionMonitor } from './execution-monitor';
import { WorkflowEngine } from './workflow-engine';

let runtimeInstance: RuntimeService | null = null;

export class RuntimeService {
  private queueManager = new QueueManager();
  private workerManager = new WorkerManager();
  private retryManager = new RetryManager();
  private monitor = new ExecutionMonitor();
  private workflowEngine = new WorkflowEngine();
  private running = false;
  private startTime = Date.now();
  private tickTimer?: ReturnType<typeof setInterval>;
  private jobHistory: RuntimeJob[] = [];

  constructor() { this.workerManager.initialize(5); }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.tickTimer = setInterval(() => this.tick(), 2000);
  }

  stop(): void {
    this.running = false;
    if (this.tickTimer) clearInterval(this.tickTimer);
  }

  isRunning(): boolean { return this.running; }

  submitJob(job: Omit<RuntimeJob, 'id' | 'status' | 'attempt' | 'createdAt' | 'updatedAt'>): RuntimeJob {
    const full: RuntimeJob = {
      ...job, id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: 'queued', attempt: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    this.queueManager.enqueue(full);
    return full;
  }

  cancelJob(jobId: string): boolean {
    for (const q of ['missions', 'content', 'publishing', 'updates', 'refresh', 'business', 'analytics', 'playbooks', 'emails', 'system'] as QueueName[]) {
      const queue = this.queueManager.getQueue(q);
      if (queue) {
        const job = queue.items.find(j => j.id === jobId);
        if (job) { job.status = 'cancelled'; return true; }
      }
    }
    return false;
  }

  pauseJob(jobId: string): boolean {
    for (const q of ['missions', 'content', 'publishing', 'updates', 'refresh', 'business', 'analytics', 'playbooks', 'emails', 'system'] as QueueName[]) {
      const queue = this.queueManager.getQueue(q);
      if (queue) {
        const job = queue.items.find(j => j.id === jobId);
        if (job && (job.status === 'queued' || job.status === 'running')) { job.status = 'paused'; return true; }
      }
    }
    return false;
  }

  resumeJob(jobId: string): boolean {
    for (const q of ['missions', 'content', 'publishing', 'updates', 'refresh', 'business', 'analytics', 'playbooks', 'emails', 'system'] as QueueName[]) {
      const queue = this.queueManager.getQueue(q);
      if (queue) {
        const job = queue.items.find(j => j.id === jobId);
        if (job && job.status === 'paused') { job.status = 'queued'; return true; }
      }
    }
    return false;
  }

  retryJob(jobId: string): boolean {
    for (const q of ['missions', 'content', 'publishing', 'updates', 'refresh', 'business', 'analytics', 'playbooks', 'emails', 'system'] as QueueName[]) {
      const queue = this.queueManager.getQueue(q);
      if (queue) {
        const job = queue.items.find(j => j.id === jobId);
        if (job && (job.status === 'failed' || job.status === 'dead_letter')) {
          const retried = this.retryManager.prepareRetry(job);
          Object.assign(job, retried);
          this.monitor.recordRetry();
          return true;
        }
      }
    }
    return false;
  }

  private tick(): void {
    const worker = this.workerManager.getIdleWorkers()[0];
    if (!worker) return;
    const job = this.queueManager.dequeueAny();
    if (!job) return;
    job.status = 'running';
    job.startedAt = new Date().toISOString();
    job.attempt++;
    this.executeJob(worker, job);
  }

  private async executeJob(worker: any, job: RuntimeJob): Promise<void> {
    try {
      const result = await worker.execute(job);
      job.status = 'completed';
      job.result = result;
      job.finishedAt = new Date().toISOString();
      job.executionTimeMs = new Date(job.finishedAt).getTime() - new Date(job.startedAt!).getTime();
      this.monitor.recordJob(job.executionTimeMs, true);
    } catch (err) {
      job.error = (err as Error).message;
      if (this.retryManager.shouldRetry(job)) {
        Object.assign(job, this.retryManager.prepareRetry(job));
        this.queueManager.enqueue(job);
        this.monitor.recordRetry();
      } else {
        Object.assign(job, this.retryManager.moveToDeadLetter(job));
        this.monitor.recordDeadLetter();
        this.monitor.recordJob(0, false);
      }
    } finally {
      job.updatedAt = new Date().toISOString();
      this.jobHistory.unshift({ ...job });
      if (this.jobHistory.length > 200) this.jobHistory.length = 200;
    }
  }

  getStatus(): RuntimeStatus {
    return {
      running: this.running, uptime: Date.now() - this.startTime,
      queues: this.queueManager.getAllStatus(),
      workers: this.workerManager.getInfo(),
      metrics: this.monitor.getMetrics(this.workerManager.getInfo()),
    };
  }

  getJobs(): RuntimeJob[] {
    const jobs: RuntimeJob[] = [];
    for (const q of ['missions', 'content', 'publishing', 'updates', 'refresh', 'business', 'analytics', 'playbooks', 'emails', 'system'] as QueueName[]) {
      const queue = this.queueManager.getQueue(q);
      if (queue) jobs.push(...queue.items);
    }
    return jobs;
  }

  getJobHistory(): RuntimeJob[] { return [...this.jobHistory]; }
  getWorkers() { return this.workerManager.getInfo(); }
  getWorkflows() { return this.workflowEngine.getWorkflows(); }
  getQueues() { return this.queueManager.getAllStatus(); }
}

export function getRuntimeService(): RuntimeService {
  if (!runtimeInstance) runtimeInstance = new RuntimeService();
  return runtimeInstance;
}
