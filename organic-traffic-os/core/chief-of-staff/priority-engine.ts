import { PriorityTask, TaskPriority } from './chief.types';

export function prioritizeTask(task: PriorityTask): number {
  const urgencyWeight = 0.25;
  const impactWeight = 0.3;
  const riskWeight = 0.2;
  const dependencyWeight = 0.15;
  const budgetWeight = 0.1;

  const urgencyScore = task.urgency * urgencyWeight;
  const impactScore = task.impact * impactWeight;
  const riskScore = (100 - task.risk) * riskWeight;
  const depScore = task.dependencies.length === 0 ? 100 * dependencyWeight : 50 * dependencyWeight;
  const budgetScore = task.estimatedCost < 5 ? 90 * budgetWeight : task.estimatedCost < 15 ? 60 * budgetWeight : 30 * budgetWeight;

  return Math.round(urgencyScore + impactScore + riskScore + depScore + budgetScore);
}

export function sortTasksByPriority(tasks: PriorityTask[]): PriorityTask[] {
  return [...tasks].sort((a, b) => prioritizeTask(b) - prioritizeTask(a));
}
