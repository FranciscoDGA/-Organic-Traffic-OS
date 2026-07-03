import { ExecutionRequest, ExecutionPlan, ExecutionStrategy, ProviderName } from './execution.types';
import { getAvailableProviders } from './provider-selector';
import { selectModel } from './model-selector';
import { estimateTokens, estimateCost, estimateTimeMs } from './token-estimator';
import { getPolicy } from './execution-policy';
import { validateExecutionPlan } from './execution-validator';

let counter = 0;

const workspaceBudgets: Record<string, number> = { passacumaru: 50, garimpeibrasil: 30 };
const workspaceSpent: Record<string, number> = { passacumaru: 0, garimpeibrasil: 0 };

export function createExecutionPlan(request: ExecutionRequest): { plan: ExecutionPlan; warnings: string[] } {
  const warnings: string[] = [];
  const policy = getPolicy(request.workspaceId);
  const strategy = request.strategy || 'balanced';
  const contextTokens = request.contextTokens || 4000;

  if (!policy.allowedStrategies.includes(strategy)) {
    warnings.push(`Strategy ${strategy} not allowed, using balanced`);
  }

  const providers = getAvailableProviders().filter(p => policy.allowedProviders.includes(p.name));
  const { provider, model, reason } = selectModel(providers, strategy, contextTokens);

  const { inputTokens, outputTokens } = estimateTokens(contextTokens, strategy);
  const cost = estimateCost(inputTokens, outputTokens, provider.costPerInputToken, provider.costPerOutputToken);
  const duration = estimateTimeMs(inputTokens, outputTokens, strategy);

  const maxCost = request.budget || policy.maxCostPerExecution;
  const spent = workspaceSpent[request.workspaceId] || 0;
  const budget = workspaceBudgets[request.workspaceId] || 10;

  if (spent + cost > budget) {
    warnings.push(`Budget limit reached. Spent: $${spent.toFixed(4)}, Cost: $${cost.toFixed(4)}, Budget: $${budget}`);
  }

  let fallbackProvider: ProviderName | undefined;
  let fallbackModel: string | undefined;
  const altProviders = providers.filter(p => p.name !== provider.name);
  if (altProviders.length > 0) {
    const alt = selectModel(altProviders, strategy, contextTokens);
    fallbackProvider = alt.provider.name;
    fallbackModel = alt.model.name;
  }

  const plan: ExecutionPlan = {
    id: `exec-${request.workspaceId}-${++counter}`,
    workspaceId: request.workspaceId,
    provider: provider.name,
    model: model.name,
    strategy,
    estimatedInputTokens: inputTokens,
    estimatedOutputTokens: outputTokens,
    estimatedCost: cost,
    maxCost,
    estimatedTimeMs: duration,
    fallbackProvider,
    fallbackModel,
    reason,
    createdAt: new Date().toISOString(),
  };

  const validation = validateExecutionPlan(plan);
  if (!validation.valid) warnings.push(...validation.errors);

  return { plan, warnings };
}
