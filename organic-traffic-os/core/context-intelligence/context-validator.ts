import { ContextPackage } from './context.types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateContextPackage(pkg: ContextPackage): ValidationResult {
  const errors: string[] = [];
  if (!pkg.workspaceId) errors.push('workspaceId required');
  if (!pkg.objective) errors.push('objective required');
  if (pkg.estimatedTokens > 16000) errors.push('estimatedTokens exceeds 16000');
  return { valid: errors.length === 0, errors };
}
