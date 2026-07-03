import { ExecutionPlan, MissionObjective, Workspace, Strategy, MissionPriority, MissionStatus, ResourcePlan } from './mission-planner.types';

let planCounter = 0;

export function createExecutionPlan(
  objective: MissionObjective,
  workspace: Workspace,
  strategy: Strategy,
  priority: MissionPriority,
  resources: ResourcePlan
): ExecutionPlan {
  return {
    id: `plan-${Date.now()}-${++planCounter}`,
    missionObjective: objective,
    workspace,
    strategy,
    workflowId: strategy.workflowId,
    priority,
    resources,
    estimatedDurationMinutes: strategy.estimatedDurationMinutes,
    estimatedCost: strategy.estimatedCost,
    risks: strategy.risks,
    status: 'planned',
    createdAt: new Date().toISOString(),
  };
}
