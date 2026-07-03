import { GrowthAction } from './growth.types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateGrowthAction(action: GrowthAction): ValidationResult {
  const errors: string[] = [];
  if (!action.workspaceId) errors.push('workspaceId required');
  if (!action.title) errors.push('title required');
  if (!action.description) errors.push('description required');
  if (action.expectedImpact < 0 || action.expectedImpact > 100) errors.push('expectedImpact must be 0-100');
  if (action.confidence < 0 || action.confidence > 1) errors.push('confidence must be 0-1');
  return { valid: errors.length === 0, errors };
}
