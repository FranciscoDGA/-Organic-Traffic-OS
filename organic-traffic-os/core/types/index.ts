export type CoreLayer = 'connectors' | 'knowledge' | 'engines' | 'agents' | 'workflows';
export type CoreStatus = 'idle' | 'running' | 'success' | 'fail' | 'error';

export interface CoreEvent {
  id: string;
  type: string;
  layer: CoreLayer;
  timestamp: string;
  payload: any;
}

export interface CoreError extends Error {
  code: string;
  layer: CoreLayer;
  recoverable: boolean;
}

export interface CoreLog {
  level: 'info' | 'warn' | 'error' | 'debug';
  layer: CoreLayer;
  message: string;
  meta?: any;
  timestamp: string;
}

export interface ExecutionContext {
  executionId: string;
  startedAt: string;
  params: any;
}

export interface ExecutionResult<T = any> {
  success: boolean;
  data?: T;
  error?: CoreError;
  durationMs: number;
}

export interface ConnectorDefinition { id: string; name: string; version: string; status: CoreStatus; }
export interface KnowledgeDefinition { id: string; name: string; version: string; }
export interface EngineDefinition { id: string; name: string; version: string; }
export interface AgentDefinition { id: string; name: string; version: string; }
export interface WorkflowDefinition { id: string; name: string; version: string; steps: string[]; }
