import { ProviderConfig, ModelConfig, ExecutionStrategy } from './execution.types';

const strategyPreferences: Record<ExecutionStrategy, { qualityMin: number; costTierMax: 'low' | 'medium' | 'high' }> = {
  'fast': { qualityMin: 70, costTierMax: 'low' },
  'balanced': { qualityMin: 80, costTierMax: 'medium' },
  'premium': { qualityMin: 90, costTierMax: 'high' },
  'low-cost': { qualityMin: 70, costTierMax: 'low' },
  'deep-research': { qualityMin: 90, costTierMax: 'high' },
  'long-context': { qualityMin: 85, costTierMax: 'medium' },
  'multi-step': { qualityMin: 85, costTierMax: 'medium' },
};

const costOrder = { low: 0, medium: 1, high: 2 };

export function selectModel(providers: ProviderConfig[], strategy: ExecutionStrategy, contextTokens: number = 0): { provider: ProviderConfig; model: ModelConfig; reason: string } {
  const prefs = strategyPreferences[strategy];
  const candidates: { provider: ProviderConfig; model: ModelConfig; score: number }[] = [];

  for (const provider of providers) {
    for (const model of provider.models) {
      if (model.quality < prefs.qualityMin) continue;
      if (costOrder[model.costTier] > costOrder[prefs.costTierMax]) continue;
      if (contextTokens > 0 && model.maxTokens < contextTokens) continue;

      const score = model.quality * 0.5 + (100 - costOrder[model.costTier] * 30) * 0.3 + model.speed * 0.2;
      candidates.push({ provider, model, score });
    }
  }

  if (candidates.length === 0) {
    const fallback = providers[0];
    return { provider: fallback, model: fallback.models[0], reason: 'No ideal match, using default' };
  }

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  return { provider: best.provider, model: best.model, reason: `Best score ${best.score.toFixed(1)} for strategy ${strategy}` };
}
