import { ExecutionPlan, ExecutionLog, ExecutionRequest } from './execution.types';
import { createExecutionPlan } from './execution-planner';

const plans: Map<string, ExecutionPlan[]> = new Map();
const logs: ExecutionLog[] = [];

export function getExecutionService() {
  return {
    createPlan(request: ExecutionRequest) {
      const { plan, warnings } = createExecutionPlan(request);
      const list = plans.get(request.workspaceId) || [];
      list.push(plan);
      plans.set(request.workspaceId, list);
      return { plan, warnings };
    },

    simulate(request: ExecutionRequest) {
      const strategies = ['fast', 'balanced', 'premium', 'low-cost', 'deep-research'] as const;
      return strategies.map(s => {
        const { plan, warnings } = createExecutionPlan({ ...request, strategy: s });
        return { strategy: s, plan, warnings };
      });
    },

    getPlans(workspaceId: string): ExecutionPlan[] {
      return plans.get(workspaceId) || [];
    },

    getPlan(id: string): ExecutionPlan | undefined {
      for (const list of plans.values()) {
        const found = list.find(p => p.id === id);
        if (found) return found;
      }
      return undefined;
    },

    getLogs(workspaceId: string): ExecutionLog[] {
      return logs.filter(l => l.workspaceId === workspaceId);
    },

    getAllLogs(): ExecutionLog[] {
      return logs;
    },

    addLog(log: ExecutionLog) {
      logs.push(log);
    },
  };
}
