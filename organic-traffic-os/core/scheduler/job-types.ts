export type JobType =
  | 'connector_sync'
  | 'workflow_run'
  | 'agent_run'
  | 'monitoring_run'
  | 'report_generation'
  | 'content_refresh'
  | 'publishing_prepare';

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused' | 'cancelled' | 'scheduled';

export type ScheduleType = 'cron' | 'interval' | 'once' | 'manual';

export interface JobSchedule {
  type: ScheduleType;
  expression?: string;
  intervalMs?: number;
  timezone: string;
}

export interface JobDefinition {
  id: string;
  name: string;
  type: JobType;
  status: JobStatus;
  schedule: JobSchedule;
  target: {
    connectorId?: string;
    engineId?: string;
    agentId?: string;
    workflowId?: string;
  };
  payload: Record<string, unknown>;
  retries: number;
  maxRetries: number;
  timeoutMs: number;
  lastRun?: string;
  nextRun?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobExecution {
  id: string;
  jobId: string;
  jobName: string;
  jobType: JobType;
  status: 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout';
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  result?: Record<string, unknown>;
  error?: string;
  retryAttempt: number;
}

export interface JobValidationError {
  field: string;
  message: string;
}

export interface SchedulerStatus {
  totalJobs: number;
  activeJobs: number;
  pausedJobs: number;
  failedJobs: number;
  runningJobs: number;
  nextJob?: JobDefinition;
  lastExecution?: JobExecution;
  uptimeMs: number;
}
