import { TaskProfile } from './ai-intelligence.types';
import { aiProviders } from './ai-providers';
import { ModelSelector } from './model-selector';
import { FallbackManager } from './fallback-manager';
import { costTracker } from './cost-tracker';
import { healthChecker } from './health-checker';
import { responseCache } from './response-cache';

class AILService {
  private modelSelector = new ModelSelector();
  private fallbackManager = new FallbackManager();
  private costTracker = costTracker;
  private healthChecker = healthChecker;
  private responseCache = responseCache;

  async execute(taskProfile: TaskProfile, prompt: string, options: { workspaceId?: string; agentId?: string; missionId?: string; workflowId?: string; useCache?: boolean } = {}): Promise<{ providerId: string; modelId: string; response: string; cached: boolean }> {
    const cacheKey = `${taskProfile}:${prompt.slice(0, 100)}`;
    if (options.useCache) {
      const cached = this.responseCache.get(cacheKey);
      if (cached) return { providerId: '', modelId: '', response: cached as string, cached: true };
    }

    const selection = this.modelSelector.select(taskProfile);
    let provider = aiProviders.find(p => p.id === selection.providerId);
    if (!provider || provider.status !== 'active') {
      const fallback = this.fallbackManager.getNextAvailable(selection.providerId);
      if (fallback) {
        this.fallbackManager.logFallback(selection.providerId, fallback.id, 'Provider indisponivel');
        provider = fallback;
      }
    }

    const response = `Resposta simulada do ${provider?.name || 'OpenAI'} com modelo ${selection.modelId} para tarefa ${taskProfile}`;
    this.costTracker.record({ workspaceId: options.workspaceId, agentId: options.agentId, missionId: options.missionId, workflowId: options.workflowId, providerId: selection.providerId, modelId: selection.modelId, inputTokens: prompt.length / 4, outputTokens: response.length / 4 });
    if (options.useCache) this.responseCache.set(cacheKey, response);

    return { providerId: selection.providerId, modelId: selection.modelId, response, cached: false };
  }

  getProviders() { return aiProviders; }
  getProvider(id: string) { return aiProviders.find(p => p.id === id); }
  getModels(providerId?: string) { return providerId ? aiProviders.find(p => p.id === providerId)?.models || [] : aiProviders.flatMap(p => p.models.map(m => ({ ...m, providerId: p.id }))); }
  getTaskProfiles() { return this.modelSelector.getAllProfiles(); }
  getHealth() { return this.healthChecker.checkAll(); }
  getCosts() { return this.costTracker.getStats(); }
}

export const ailService = new AILService();
