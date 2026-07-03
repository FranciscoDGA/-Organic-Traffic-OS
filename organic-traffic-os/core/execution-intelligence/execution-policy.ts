import { ProviderName, ExecutionStrategy } from './execution.types';

export interface ExecutionPolicy {
  maxCostPerExecution: number;
  maxTokensPerExecution: number;
  allowedProviders: ProviderName[];
  allowedStrategies: ExecutionStrategy[];
  requireBudgetCheck: boolean;
}

const defaultPolicies: Record<string, ExecutionPolicy> = {
  passacumaru: { maxCostPerExecution: 0.5, maxTokensPerExecution: 100000, allowedProviders: ['openai', 'anthropic', 'google', 'mistral', 'openrouter'], allowedStrategies: ['fast', 'balanced', 'premium', 'low-cost', 'deep-research', 'long-context', 'multi-step'], requireBudgetCheck: true },
  garimpeibrasil: { maxCostPerExecution: 0.3, maxTokensPerExecution: 80000, allowedProviders: ['openai', 'anthropic', 'google', 'mistral', 'openrouter'], allowedStrategies: ['fast', 'balanced', 'low-cost'], requireBudgetCheck: true },
};

export function getPolicy(workspaceId: string): ExecutionPolicy {
  return defaultPolicies[workspaceId] || { maxCostPerExecution: 0.2, maxTokensPerExecution: 50000, allowedProviders: ['openai', 'anthropic', 'google'], allowedStrategies: ['balanced', 'low-cost'], requireBudgetCheck: true };
}
