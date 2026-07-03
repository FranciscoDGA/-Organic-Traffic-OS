import { TaskProfile, TaskProfileConfig } from './ai-intelligence.types';
import { taskProfiles } from './task-profiles';
import { aiProviders } from './ai-providers';

export class ModelSelector {
  select(taskProfile: TaskProfile): { providerId: string; modelId: string } {
    const profile = taskProfiles[taskProfile];
    if (!profile) return { providerId: 'openai', modelId: 'gpt-4o' };

    const primary = aiProviders.find(p => p.id === profile.preferredProviderId);
    if (primary && primary.status === 'active') {
      return { providerId: profile.preferredProviderId, modelId: profile.preferredModelId };
    }

    const fallback = aiProviders.find(p => p.id === profile.fallbackProviderId);
    if (fallback && fallback.status === 'active') {
      return { providerId: profile.fallbackProviderId, modelId: profile.fallbackModelId };
    }

    const firstActive = aiProviders.find(p => p.status === 'active');
    if (firstActive) {
      return { providerId: firstActive.id, modelId: firstActive.models[0].id };
    }

    return { providerId: 'openai', modelId: 'gpt-4o' };
  }

  getProfile(taskProfile: TaskProfile): TaskProfileConfig {
    return taskProfiles[taskProfile];
  }

  getAllProfiles(): TaskProfileConfig[] {
    return Object.values(taskProfiles);
  }
}
