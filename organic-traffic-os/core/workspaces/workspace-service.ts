import { Workspace, WorkspaceContext } from './workspace.types';
import { workspaceRegistry, getWorkspaceById, getActiveWorkspaces, getAllWorkspaces } from './workspace-registry';
import { createWorkspaceContext, requireWorkspaceContext } from './workspace-context';
import { validateWorkspace } from './workspace-validator';

class WorkspaceService {
  getAll(): Workspace[] {
    return getAllWorkspaces();
  }

  getById(id: string): Workspace | undefined {
    return getWorkspaceById(id);
  }

  getActive(): Workspace[] {
    return getActiveWorkspaces();
  }

  getContext(workspaceId: string): WorkspaceContext {
    return requireWorkspaceContext(workspaceId);
  }

  create(workspace: Partial<Workspace>): { success: boolean; workspace?: Workspace; errors?: string[] } {
    const validation = validateWorkspace(workspace);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const exists = workspaceRegistry.find(w => w.id === workspace.id || w.slug === workspace.slug);
    if (exists) {
      return { success: false, errors: ['Workspace with this id or slug already exists'] };
    }

    const newWorkspace: Workspace = {
      id: workspace.id!,
      name: workspace.name!,
      slug: workspace.slug!,
      domain: workspace.domain!,
      type: workspace.type || 'blog',
      status: 'setup',
      language: workspace.language || 'pt-BR',
      country: workspace.country || 'BR',
      timezone: workspace.timezone || 'America/Sao_Paulo',
      niche: workspace.niche || '',
      audience: workspace.audience || '',
      monetization: workspace.monetization || [],
      config: workspace.config || {
        knowledgeCore: true,
        inventory: true,
        connectors: [],
        engines: [],
        agents: [],
        workflows: [],
        scheduler: false,
        publishing: { autoPublish: false, requireApproval: true, platforms: [], schedule: '0 9 * * *' },
      },
      healthScore: 0,
      lastActivity: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    workspaceRegistry.push(newWorkspace);
    return { success: true, workspace: newWorkspace };
  }

  update(id: string, updates: Partial<Workspace>): { success: boolean; workspace?: Workspace; errors?: string[] } {
    const index = workspaceRegistry.findIndex(w => w.id === id);
    if (index === -1) {
      return { success: false, errors: ['Workspace not found'] };
    }

    const updated = { ...workspaceRegistry[index], ...updates, updatedAt: new Date().toISOString() };
    workspaceRegistry[index] = updated;
    return { success: true, workspace: updated };
  }

  getStatus(id: string): { exists: boolean; status?: string; healthScore?: number } {
    const workspace = getWorkspaceById(id);
    if (!workspace) return { exists: false };
    return { exists: true, status: workspace.status, healthScore: workspace.healthScore };
  }
}

export const workspaceService = new WorkspaceService();
