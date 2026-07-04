import { DecisionExplanation } from './explainable.types';

export function validateExplanation(explanation: Partial<DecisionExplanation>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!explanation.id) errors.push('missing id');
  if (!explanation.workspace_id) errors.push('missing workspace_id');
  if (!explanation.decision) errors.push('missing decision');
  if (!explanation.justificativa) errors.push('missing justificativa');
  if (!explanation.evidence || explanation.evidence.length === 0) errors.push('requires at least 1 evidence');
  if (explanation.confidence !== undefined && (explanation.confidence < 0 || explanation.confidence > 100)) errors.push('invalid confidence');
  return { valid: errors.length === 0, errors };
}
