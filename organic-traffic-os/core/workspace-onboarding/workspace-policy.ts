import { WorkspacePolicy, WorkspaceConfig } from './workspace-onboarding.types';
import { workspaceConfigs } from './workspace-configs';

export class WorkspacePolicyManager {
  getPolicy(workspaceId: string): WorkspacePolicy | undefined {
    return workspaceConfigs[workspaceId]?.policy;
  }

  validate(id: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const policy = this.getPolicy(id);
    if (!policy) { errors.push('Politica nao encontrada'); return { valid: false, errors }; }
    if (policy.maxPostsPerDay <= 0) errors.push('maxPostsPerDay deve ser > 0');
    if (policy.minWordsPerArticle <= 0) errors.push('minWordsPerArticle deve ser > 0');
    return { valid: errors.length === 0, errors };
  }
}
