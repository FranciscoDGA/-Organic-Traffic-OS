import { BusEvent } from './communication.types';

export function validateEvent(event: Partial<BusEvent>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!event.id) errors.push('missing id');
  if (!event.workspace_id) errors.push('missing workspace_id');
  if (!event.source) errors.push('missing source');
  if (!event.type) errors.push('missing type');
  if (!event.correlation_id) errors.push('missing correlation_id');
  if (!event.created_at) errors.push('missing created_at');
  if (event.priority && !['critical', 'high', 'normal', 'low'].includes(event.priority)) errors.push('invalid priority');
  return { valid: errors.length === 0, errors };
}
