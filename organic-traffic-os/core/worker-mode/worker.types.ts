export type WorkerState = 'idle' | 'waiting' | 'running' | 'paused' | 'retrying' | 'completed' | 'failed' | 'cancelled' | 'offline';

export interface WorkerSession {
  id: string;
  agent_id: string;
  agent_name: string;
  workspace_id: string;
  mission_id?: string;
  workflow_id?: string;
  task_id?: string;
  state: WorkerState;
  tokens_used: number;
  provider: string;
  started_at: string;
  last_heartbeat: string;
  finished_at?: string;
  duration_ms?: number;
  result?: string;
  error?: string;
  logs: string[];
  retry_count: number;
}

export interface HeartbeatData {
  worker_id: string;
  state: WorkerState;
  progress: number;
  tokens_used: number;
  elapsed_ms: number;
  last_activity: string;
}
