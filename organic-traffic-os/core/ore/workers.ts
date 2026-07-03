import { RuntimeWorker, RuntimeJob, WorkerType, WorkerStatus } from './runtime.types';

let workerIdCounter = 0;

export class Worker {
  id: string;
  type: WorkerType;
  status: WorkerStatus = 'idle';
  currentJobId?: string;
  lastHeartbeat: string = new Date().toISOString();
  totalJobs = 0;
  successJobs = 0;
  failedJobs = 0;
  totalExecutionMs = 0;
  capabilities: string[];
  private heartbeatTimer?: ReturnType<typeof setInterval>;

  constructor(type: WorkerType, capabilities: string[] = []) {
    this.id = `worker-${type}-${++workerIdCounter}`;
    this.type = type;
    this.capabilities = capabilities;
  }

  async execute(job: RuntimeJob): Promise<Record<string, unknown>> {
    this.status = 'busy';
    this.currentJobId = job.id;
    this.lastHeartbeat = new Date().toISOString();
    const start = Date.now();

    try {
      await new Promise(r => setTimeout(r, 100 + Math.random() * 500));
      const result = { success: true, workerId: this.id, jobId: job.id };
      this.successJobs++;
      return result;
    } catch (err) {
      this.failedJobs++;
      throw err;
    } finally {
      this.totalJobs++;
      this.totalExecutionMs += Date.now() - start;
      this.status = 'idle';
      this.currentJobId = undefined;
      this.lastHeartbeat = new Date().toISOString();
    }
  }

  startHeartbeat(intervalMs = 30000): void {
    this.heartbeatTimer = setInterval(() => {
      this.lastHeartbeat = new Date().toISOString();
    }, intervalMs);
  }

  stopHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
  }

  isAlive(timeoutMs = 60000): boolean {
    return Date.now() - new Date(this.lastHeartbeat).getTime() < timeoutMs;
  }

  getInfo(): RuntimeWorker {
    return {
      id: this.id, type: this.type, status: this.status,
      currentJobId: this.currentJobId, lastHeartbeat: this.lastHeartbeat,
      totalJobs: this.totalJobs, successJobs: this.successJobs,
      failedJobs: this.failedJobs,
      avgExecutionMs: this.totalJobs > 0 ? Math.round(this.totalExecutionMs / this.totalJobs) : 0,
      capabilities: this.capabilities,
    };
  }
}

export class WorkerManager {
  private workers: Map<string, Worker> = new Map();

  createWorker(type: WorkerType, capabilities: string[] = []): Worker {
    const worker = new Worker(type, capabilities);
    worker.startHeartbeat();
    this.workers.set(worker.id, worker);
    return worker;
  }

  getWorker(id: string): Worker | undefined { return this.workers.get(id); }
  getAllWorkers(): Worker[] { return Array.from(this.workers.values()); }
  getIdleWorkers(): Worker[] { return this.getAllWorkers().filter(w => w.status === 'idle'); }
  getBusyWorkers(): Worker[] { return this.getAllWorkers().filter(w => w.status === 'busy'); }
  getOfflineWorkers(): Worker[] { return this.getAllWorkers().filter(w => !w.isAlive()); }

  getWorkerForJob(job: RuntimeJob): Worker | undefined {
    const idle = this.getIdleWorkers();
    return idle.find(w => w.capabilities.length === 0 || w.capabilities.includes(job.queue)) || idle[0];
  }

  getInfo(): RuntimeWorker[] { return this.getAllWorkers().map(w => w.getInfo()); }

  initialize(count = 5): void {
    const types: WorkerType[] = ['local', 'ai', 'publishing', 'analytics', 'update'];
    for (let i = 0; i < count; i++) {
      this.createWorker(types[i % types.length]);
    }
  }
}
