import { ResourcePlan, Strategy } from './mission-planner.types';

export class ResourcePlanner {
  plan(strategy: Strategy): ResourcePlan {
    return {
      agents: [...strategy.requiredAgents],
      workers: [...strategy.requiredWorkers],
      queues: ['content', 'publishing', 'analytics'],
      estimatedTokens: this.estimateTokens(strategy),
      estimatedApiCalls: this.estimateApiCalls(strategy),
    };
  }

  private estimateTokens(strategy: Strategy): number {
    const base = strategy.requiredAgents.length * 5000;
    return base + strategy.estimatedDurationMinutes * 100;
  }

  private estimateApiCalls(strategy: Strategy): number {
    return strategy.requiredAgents.length * 3 + strategy.requiredWorkers.length * 2;
  }
}
