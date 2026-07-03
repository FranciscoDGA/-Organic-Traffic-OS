import { LearningRecord } from './auto-learning.types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateLearningRecord(record: LearningRecord): ValidationResult {
  const errors: string[] = [];
  if (!record.workspaceId) errors.push('workspaceId required');
  if (!record.description) errors.push('description required');
  if (!record.evidence) errors.push('evidence required - every learning must have evidence');
  if (record.confidence < 0 || record.confidence > 1) errors.push('confidence must be 0-1');
  if (record.confidence < 0.5) errors.push('low confidence - should be suggestion not active');
  return { valid: errors.length === 0, errors };
}
