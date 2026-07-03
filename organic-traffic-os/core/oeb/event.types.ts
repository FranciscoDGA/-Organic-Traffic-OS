export type EventType =
  | 'MissionCreated' | 'MissionPlanned'
  | 'WorkflowCreated' | 'WorkflowStarted' | 'WorkflowFinished'
  | 'JobQueued' | 'JobStarted' | 'JobFinished'
  | 'AgentStarted' | 'AgentFinished' | 'AgentFailed'
  | 'ContentCreated' | 'ContentUpdated' | 'ContentReviewed' | 'ContentApproved' | 'ContentPublished' | 'ContentRefreshRequested'
  | 'CampaignStarted' | 'CampaignFinished'
  | 'BusinessMetricUpdated'
  | 'KnowledgeUpdated' | 'MemoryUpdated'
  | 'ConnectorFailed' | 'ConnectorRecovered'
  | 'SystemWarning' | 'SystemError';

export type EventStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'dead_letter';

export interface OrganicEvent {
  event_id: string;
  event_name: string;
  event_type: EventType;
  workspace_id?: string;
  mission_id?: string;
  workflow_id?: string;
  agent_id?: string;
  worker_id?: string;
  timestamp: string;
  payload: Record<string, unknown>;
  version: string;
  status: EventStatus;
  correlation_id?: string;
  causation_id?: string;
  retry_count: number;
  max_retries: number;
}

export interface EventSubscription {
  id: string;
  subscriberId: string;
  eventTypes: EventType[];
  handler: (event: OrganicEvent) => Promise<void>;
  active: boolean;
}

export interface EventHandler {
  (event: OrganicEvent): Promise<void>;
}
