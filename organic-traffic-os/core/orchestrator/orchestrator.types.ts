export interface WorkflowStep {
  id: string;
  name: string;
  type: 'connector' | 'engine' | 'agent' | 'custom';
  target: string;
  depends_on: string[];
  timeout_ms: number;
  retry_policy: { max_retries: number; delay_ms: number };
  config?: Record<string, any>;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  version: string;
  description: string;
  steps: WorkflowStep[];
  timeout_ms: number;
  retry_policy: { max_retries: number; delay_ms: number };
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'paused' | 'disabled';
}

export interface ExecutionContext {
  blog_id: string;
  channel: string;
  user_id: string;
  content_id?: string;
  workflow_id: string;
  config: Record<string, any>;
  ai_provider?: string;
  language: string;
  timestamp: string;
  version: string;
}

export interface StepExecution {
  step_id: string;
  step_name: string;
  type: WorkflowStep['type'];
  target: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | 'timeout';
  started_at?: string;
  completed_at?: string;
  duration_ms?: number;
  result?: any;
  error?: string;
  retries: number;
  ai_tokens_used: number;
  connector_calls: number;
}

export interface ExecutionLog {
  execution_id: string;
  workflow_id: string;
  workflow_name: string;
  context: ExecutionContext;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout';
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  steps: StepExecution[];
  total_ai_tokens: number;
  total_connector_calls: number;
  total_engine_calls: number;
  total_agent_calls: number;
  warnings: string[];
  errors: string[];
}

export interface ExecutionResult {
  success: boolean;
  execution_id: string;
  workflow_id: string;
  status: ExecutionLog['status'];
  duration_ms: number;
  steps_completed: number;
  steps_failed: number;
  steps_total: number;
  result?: any;
  error?: string;
}

export interface OrchestratorStatus {
  is_running: boolean;
  current_execution?: ExecutionLog;
  queued_executions: number;
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  average_duration_ms: number;
}

export interface OrchestratorReport {
  timestamp: string;
  status: OrchestratorStatus;
  recent_executions: ExecutionLog[];
  workflows_registered: number;
  logs: { timestamp: string; level: string; action: string; message: string; duration_ms?: number }[];
}
