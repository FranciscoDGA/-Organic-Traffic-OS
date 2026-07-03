import { DailyPlan } from './chief.types';

export function validateDailyPlan(plan: DailyPlan): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!plan.workspaceId) errors.push('workspaceId required');
  if (!plan.date) errors.push('date required');
  if (plan.estimatedCost > 20) errors.push('cost exceeds daily budget');
  if (plan.priorityTasks.length === 0) errors.push('at least 1 task required');
  return { valid: errors.length === 0, errors };
}
