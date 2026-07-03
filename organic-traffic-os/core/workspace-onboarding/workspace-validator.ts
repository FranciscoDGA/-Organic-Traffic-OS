import { WorkspaceConfig, WorkspaceIdentity } from './workspace-onboarding.types';
import { workspaceConfigs } from './workspace-configs';

export class WorkspaceValidator {
  validate(id: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = workspaceConfigs[id];
    if (!config) { errors.push('Workspace nao encontrado'); return { valid: false, errors }; }
    if (!config.identity.domain) errors.push('Dominio obrigatorio');
    if (!config.identity.niche) errors.push('Nicho obrigatorio');
    if (!config.identity.name) errors.push('Nome obrigatorio');
    if (!config.editorialProfile) errors.push('Perfil editorial obrigatorio');
    if (!config.policy) errors.push('Politica obrigatoria');
    if (!config.publisherConfig) errors.push('Configuracao do Publisher obrigatoria');
    if (!config.kpis.length) errors.push('KPIs obrigatorios');
    return { valid: errors.length === 0, errors };
  }

  validateAll(): Record<string, { valid: boolean; errors: string[] }> {
    const results: Record<string, { valid: boolean; errors: string[] }> = {};
    for (const id of Object.keys(workspaceConfigs)) {
      results[id] = this.validate(id);
    }
    return results;
  }
}
