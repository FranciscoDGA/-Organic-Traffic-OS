export type ValidationStepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
export type ValidationStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface ValidationStep {
  id: string;
  name: string;
  module: string;
  status: ValidationStepStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  agent?: string;
  worker?: string;
  tokens?: number;
  cost?: number;
  error?: string;
  retries: number;
  events: ValidationEvent[];
}

export interface ValidationEvent {
  id: string;
  type: string;
  name: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface ValidationMission {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  type: string;
  status: ValidationStatus;
  steps: ValidationStep[];
  startedAt?: string;
  completedAt?: string;
  totalDurationMs?: number;
  totalTokens: number;
  totalCost: number;
  totalEvents: number;
  totalErrors: number;
  totalRetries: number;
}

export interface ValidationReport {
  missionId: string;
  workspaceId: string;
  status: ValidationStatus;
  totalDurationMs: number;
  stepsExecuted: number;
  stepsSucceeded: number;
  stepsFailed: number;
  modulesUsed: string[];
  modulesNotUsed: string[];
  totalTokens: number;
  totalCost: number;
  totalEvents: number;
  totalErrors: number;
  totalRetries: number;
  recommendations: string[];
  pendingItems: string[];
  generatedAt: string;
}
