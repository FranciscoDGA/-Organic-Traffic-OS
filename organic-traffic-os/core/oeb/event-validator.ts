import { OrganicEvent } from './event.types';

export class EventValidator {
  validate(event: Partial<OrganicEvent>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!event.event_id) errors.push('event_id obrigatorio');
    if (!event.event_name) errors.push('event_name obrigatorio');
    if (!event.event_type) errors.push('event_type obrigatorio');
    if (!event.timestamp) errors.push('timestamp obrigatorio');
    if (!event.payload) errors.push('payload obrigatorio');
    if (event.event_type && !this.isValidType(event.event_type)) errors.push(`event_type invalido: ${event.event_type}`);
    return { valid: errors.length === 0, errors };
  }

  private isValidType(type: string): boolean {
    const validTypes = [
      'MissionCreated', 'MissionPlanned', 'WorkflowCreated', 'WorkflowStarted', 'WorkflowFinished',
      'JobQueued', 'JobStarted', 'JobFinished', 'AgentStarted', 'AgentFinished', 'AgentFailed',
      'ContentCreated', 'ContentUpdated', 'ContentReviewed', 'ContentApproved', 'ContentPublished', 'ContentRefreshRequested',
      'CampaignStarted', 'CampaignFinished', 'BusinessMetricUpdated',
      'KnowledgeUpdated', 'MemoryUpdated', 'ConnectorFailed', 'ConnectorRecovered',
      'SystemWarning', 'SystemError',
    ];
    return validTypes.includes(type);
  }
}

export const eventValidator = new EventValidator();
