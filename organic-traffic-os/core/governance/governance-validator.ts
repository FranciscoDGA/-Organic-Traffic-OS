import { Policy } from './governance.types';

export function validatePolicy(policy: Partial<Policy>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!policy.name) errors.push('missing name');
  if (!policy.scope) errors.push('missing scope');
  if (!policy.rule) errors.push('missing rule');
  if (!policy.severity) errors.push('missing severity');
  if (!policy.action) errors.push('missing action');
  if (policy.severity && !['critical', 'high', 'medium', 'low'].includes(policy.severity)) errors.push('invalid severity');
  if (policy.action && !['allow', 'deny', 'require-approval', 'require-review'].includes(policy.action)) errors.push('invalid action');
  return { valid: errors.length === 0, errors };
}
