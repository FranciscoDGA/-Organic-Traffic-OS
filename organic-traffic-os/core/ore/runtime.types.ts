export type JobPriority = 'urgent' | 'high' | 'normal' | 'low' | 'background';
export type JobStatus = 'pending' | 'queued' | 'running' | 'paused' | 'retry' | 'completed' | 'cancelled' | 'failed' | 'dead_letter';
export type QueueName = 'missions' | 'content' | 'publishing' | 'updates' | 'refresh' | 'business' | 'analytics' | 'playbooks' | 'emails' | 'system';
export type WorkerType = 'local' | 'distributed' | 'specialized' | 'ai' | 'publishing' | 'analytics' | 'update';
export type WorkerStatus = 'idle' | 'busy' | 'offline' | 'error';

export interface RuntimeJob {
  id: string;
  workspaceId?: string;
  missionId?: string;
  agentId?: string;
  queue: QueueName;
  priority: JobPriority;
  status: JobStatus;
  attempt: number;
  maxAttempts: number;
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  startedAt?: string;
  finishedAt?: string;
  executionTimeMs?: number;
  cost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RuntimeWorker {
  id: string;
  type: WorkerType;
  status: WorkerStatus;
  currentJobId?: string;
  lastHeartbeat: string;
  totalJobs: number;
  successJobs: number;
  failedJobs: number;
  avgExecutionMs: number;
  capabilities: string[];
}

export interface RuntimeQueue {
  name: QueueName;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  maxSize: number;
}

export interface RuntimeMetrics {
  jobsPerMinute: number;
  avgExecutionMs: number;
  totalQueued: number;
  activeWorkers: number;
  offlineWorkers: number;
  retries: number;
  failures: number;
  deadLetters: number;
}

export interface RuntimeStatus {
  running: boolean;
  uptime: number;
  queues: RuntimeQueue[];
  workers: RuntimeWorker[];
  metrics: RuntimeMetrics;
}
