import { ExecutionPlan, MissionObjective, Workspace, MissionPriority, MissionStatus } from './mission-planner.types';
import { StrategySelector } from './strategy-selector';
import { WorkflowSelector } from './workflow-selector';
import { ResourcePlanner } from './resource-planner';
import { PriorityEngine } from './priority-engine';
import { createExecutionPlan } from './execution-plan';

class MissionPlannerService {
  private strategySelector = new StrategySelector();
  private workflowSelector = new WorkflowSelector();
  private resourcePlanner = new ResourcePlanner();
  private priorityEngine = new PriorityEngine();
  private plans: Map<string, ExecutionPlan> = new Map();

  createPlan(objective: MissionObjective, workspace: Workspace): ExecutionPlan | undefined {
    if (!objective.id || !objective.description) return undefined;
    if (!workspace.id || !workspace.name) return undefined;

    const strategy = this.strategySelector.select(objective, workspace);
    const workflowId = this.workflowSelector.select(strategy);
    if (!workflowId) return undefined;

    const resources = this.resourcePlanner.plan(strategy);
    const priority = this.priorityEngine.evaluate(objective, workspace);
    const plan = createExecutionPlan(objective, workspace, strategy, priority, resources);

    this.plans.set(plan.id, plan);
    return plan;
  }

  replan(planId: string, newObjective?: MissionObjective, newWorkspace?: Workspace): ExecutionPlan | undefined {
    const existing = this.plans.get(planId);
    if (!existing) return undefined;

    const objective = newObjective || existing.missionObjective;
    const workspace = newWorkspace || existing.workspace;

    const strategy = this.strategySelector.select(objective, workspace);
    const workflowId = this.workflowSelector.select(strategy);
    if (!workflowId) return undefined;

    const resources = this.resourcePlanner.plan(strategy);
    const priority = this.priorityEngine.evaluate(objective, workspace);
    const plan = createExecutionPlan(objective, workspace, strategy, priority, resources);

    this.plans.set(plan.id, plan);
    this.plans.delete(planId);
    return plan;
  }

  getPlan(planId: string): ExecutionPlan | undefined {
    return this.plans.get(planId);
  }

  getAllPlans(): ExecutionPlan[] {
    return Array.from(this.plans.values());
  }

  updateStatus(planId: string, status: MissionStatus): boolean {
    const plan = this.plans.get(planId);
    if (!plan) return false;
    plan.status = status;
    if (status === 'in_progress') plan.startedAt = new Date().toISOString();
    if (status === 'completed' || status === 'failed') plan.completedAt = new Date().toISOString();
    return true;
  }

  getStrategies() {
    return this.strategySelector.getAll();
  }
}

export const missionPlannerService = new MissionPlannerService();
