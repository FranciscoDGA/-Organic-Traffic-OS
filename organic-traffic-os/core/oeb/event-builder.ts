import { OrganicEvent, EventType, EventStatus } from './event.types';

let eventCounter = 0;

export function createEvent(
  name: string,
  type: EventType,
  payload: Record<string, unknown> = {},
  options: { workspace_id?: string; mission_id?: string; workflow_id?: string; agent_id?: string; worker_id?: string; correlation_id?: string; causation_id?: string } = {}
): OrganicEvent {
  return {
    event_id: `evt-${Date.now()}-${++eventCounter}`,
    event_name: name,
    event_type: type,
    workspace_id: options.workspace_id,
    mission_id: options.mission_id,
    workflow_id: options.workflow_id,
    agent_id: options.agent_id,
    worker_id: options.worker_id,
    timestamp: new Date().toISOString(),
    payload,
    version: '1.0.0',
    status: 'pending',
    correlation_id: options.correlation_id,
    causation_id: options.causation_id,
    retry_count: 0,
    max_retries: 3,
  };
}
