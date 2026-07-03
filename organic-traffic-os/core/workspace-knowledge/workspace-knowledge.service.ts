import { WorkspaceKnowledgeContext } from './workspace-knowledge.types';
import { workspaceKnowledgeManager } from './workspace-knowledge-manager';

class WorkspaceKnowledgeService {
  private manager = workspaceKnowledgeManager;

  getContext(workspaceId: string): WorkspaceKnowledgeContext {
    return this.manager.loadContext(workspaceId);
  }

  getProfile(workspaceId: string) {
    const ctx = this.getContext(workspaceId);
    return ctx.profile;
  }

  getMemory(workspaceId: string) {
    const ctx = this.getContext(workspaceId);
    return ctx.memory;
  }

  getPersonas(workspaceId: string) {
    const ctx = this.getContext(workspaceId);
    return ctx.personas;
  }

  getEntities(workspaceId: string) {
    const ctx = this.getContext(workspaceId);
    return ctx.entities;
  }

  getTaxonomy(workspaceId: string) {
    const ctx = this.getContext(workspaceId);
    return ctx.taxonomy;
  }

  getEditorialStyle(workspaceId: string) {
    const ctx = this.getContext(workspaceId);
    return ctx.editorialStyle;
  }

  getObjectives(workspaceId: string) {
    const ctx = this.getContext(workspaceId);
    return ctx.objectives;
  }

  getRules(workspaceId: string) {
    const ctx = this.getContext(workspaceId);
    return ctx.rules;
  }

  reload(workspaceId: string): WorkspaceKnowledgeContext {
    return this.manager.reloadContext(workspaceId);
  }
}

export const workspaceKnowledgeService = new WorkspaceKnowledgeService();
