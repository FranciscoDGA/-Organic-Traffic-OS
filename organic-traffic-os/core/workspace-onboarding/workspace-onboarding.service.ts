import { WorkspaceConfig, WorkspaceStatus, PublishMode } from './workspace-onboarding.types';
import { workspaceConfigs } from './workspace-configs';
import { WorkspaceProfile } from './workspace-profile';
import { WorkspacePolicyManager } from './workspace-policy';
import { WorkspacePublisherConfig } from './workspace-publisher-config';
import { WorkspaceKPIConfig } from './workspace-kpi-config';
import { WorkspaceValidator } from './workspace-validator';

class WorkspaceOnboardingService {
  private profile = new WorkspaceProfile();
  private policy = new WorkspacePolicyManager();
  private publisher = new WorkspacePublisherConfig();
  private kpi = new WorkspaceKPIConfig();
  private validator = new WorkspaceValidator();

  getAll(): WorkspaceConfig[] {
    return Object.values(workspaceConfigs);
  }

  getById(id: string): WorkspaceConfig | undefined {
    return workspaceConfigs[id];
  }

  getConfig(id: string): WorkspaceConfig | undefined {
    return workspaceConfigs[id];
  }

  activate(id: string): boolean {
    const config = workspaceConfigs[id];
    if (!config) return false;
    const validation = this.validator.validate(id);
    if (!validation.valid) return false;
    config.identity.status = 'active';
    config.identity.updated_at = new Date().toISOString();
    return true;
  }

  deactivate(id: string): boolean {
    const config = workspaceConfigs[id];
    if (!config) return false;
    config.identity.status = 'inactive';
    config.identity.updated_at = new Date().toISOString();
    return true;
  }

  setPublishMode(id: string, mode: PublishMode): boolean {
    const config = workspaceConfigs[id];
    if (!config) return false;
    config.identity.publishMode = mode;
    config.identity.updated_at = new Date().toISOString();
    return true;
  }

  testPublisher(id: string) {
    return this.publisher.testConnection(id);
  }

  validateWorkspace(id: string) {
    return this.validator.validate(id);
  }

  validateAll() {
    return this.validator.validateAll();
  }
}

export const workspaceOnboardingService = new WorkspaceOnboardingService();
