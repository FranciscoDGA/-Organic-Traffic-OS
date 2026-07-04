export type EventStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'dead-letter' | 'retrying';
export type EventPriority = 'critical' | 'high' | 'normal' | 'low';
export type EventType = 'MissionCreated' | 'MissionUpdated' | 'WorkflowStarted' | 'WorkflowFinished' | 'AgentStarted' | 'AgentFinished' | 'EngineCompleted' | 'ConnectorSynced' | 'ContextBuilt' | 'MemoryUpdated' | 'OpportunityDetected' | 'AlertGenerated' | 'ExperimentFinished' | 'LearningCreated' | 'GrowthPlanUpdated';

export interface BusEvent {
  id: string;
  workspace_id: string;
  source: string;
  target?: string;
  type: EventType;
  payload: Record<string, unknown>;
  priority: EventPriority;
  status: EventStatus;
  correlation_id: string;
  created_at: string;
  processed_at?: string;
  retry_count?: number;
  error?: string;
}

export interface Subscriber {
  id: string;
  name: string;
  component: string;
  eventTypes: EventType[];
  callback?: string;
  workspace_id?: string;
}

export interface EventHistoryEntry {
  eventId: string;
  type: EventType;
  source: string;
  target?: string;
  status: EventStatus;
  timestamp: string;
  correlation_id: string;
}

export interface DeadLetterEntry {
  event: BusEvent;
  reason: string;
  timestamp: string;
  retryCount: number;
}
