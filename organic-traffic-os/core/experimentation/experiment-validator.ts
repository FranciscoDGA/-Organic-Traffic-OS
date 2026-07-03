import { Experiment } from './experimentation.types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateExperiment(exp: Experiment): ValidationResult {
  const errors: string[] = [];
  if (!exp.workspaceId) errors.push('workspaceId required');
  if (!exp.name) errors.push('name required');
  if (!exp.hypothesis) errors.push('hypothesis required - every experiment needs a clear hypothesis');
  if (exp.variants.length < 2) errors.push('at least 2 variants required');
  return { valid: errors.length === 0, errors };
}
