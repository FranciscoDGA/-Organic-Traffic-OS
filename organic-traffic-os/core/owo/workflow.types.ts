export type StepType = 'agent' | 'worker' | 'approval' | 'wait' | 'event' | 'publish' | 'condition' | 'parallel';
export type StepStatus = 'pending' | 'ready' | 'running' | 'completed' | 'failed' | 'skipped' | 'waiting' | 'cancelled';
export type ConditionType = 'if' | 'else' | 'wait' | 'approval' | 'retry' | 'timeout' | 'failover';
export type WorkflowStatus = 'draft' | 'validating' | 'ready' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  agentType?: string;
  queue?: string;
  dependsOn: string[];
  conditions: WorkflowCondition[];
  timeout?: number;
  retryOnFail: boolean;
  optional: boolean;
}

export interface WorkflowCondition {
  type: ConditionType;
  field?: string;
  operator?: string;
  value?: unknown;
  timeoutMs?: number;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  status: WorkflowStatus;
  version: string;
  createdAt: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workspaceId?: string;
  missionId?: string;
  status: WorkflowStatus;
  currentSteps: string[];
  completedSteps: string[];
  failedSteps: string[];
  startedAt: string;
  completedAt?: string;
  stepResults: Record<string, unknown>;
}

export interface DAGNode {
  id: string;
  step: WorkflowStep;
  indegree: number;
  outdegree: number;
}

export interface DAGEdge {
  from: string;
  to: string;
}
