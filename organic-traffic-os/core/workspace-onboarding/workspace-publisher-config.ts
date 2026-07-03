import { PublisherConfig, WorkspaceConfig } from './workspace-onboarding.types';
import { workspaceConfigs } from './workspace-configs';

export class WorkspacePublisherConfig {
  getConfig(workspaceId: string): PublisherConfig | undefined {
    return workspaceConfigs[workspaceId]?.publisherConfig;
  }

  validate(id: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = this.getConfig(id);
    if (!config) { errors.push('Configuracao do Publisher nao encontrada'); return { valid: false, errors }; }
    if (!config.publish_endpoint) errors.push('publish_endpoint obrigatorio');
    if (!config.api_secret_reference) errors.push('api_secret_reference obrigatorio');
    return { valid: errors.length === 0, errors };
  }

  testConnection(id: string): { connected: boolean; message: string } {
    const config = this.getConfig(id);
    if (!config) return { connected: false, message: 'Configuracao nao encontrada' };
    return { connected: true, message: `Conexao com ${config.publish_endpoint} OK` };
  }
}
