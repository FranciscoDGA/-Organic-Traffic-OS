import { ExecutionPlan } from './execution.types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateExecutionPlan(plan: ExecutionPlan): ValidationResult {
  const errors: string[] = [];
  if (!plan.workspaceId) errors.push('workspaceId required');
  if (plan.estimatedCost > plan.maxCost) errors.push('estimatedCost exceeds maxCost');
  if (plan.estimatedInputTokens + plan.estimatedOutputTokens > 200000) errors.push('total tokens exceeds 200000');
  return { valid: errors.length === 0, errors };
}
