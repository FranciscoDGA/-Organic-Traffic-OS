import { MemoryRecord } from './memory.types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateMemoryRecord(record: MemoryRecord): ValidationResult {
  const errors: string[] = [];
  if (!record.workspaceId) errors.push('workspaceId required');
  if (!record.title) errors.push('title required');
  if (record.confidence < 0 || record.confidence > 1) errors.push('confidence must be 0-1');
  return { valid: errors.length === 0, errors };
}
