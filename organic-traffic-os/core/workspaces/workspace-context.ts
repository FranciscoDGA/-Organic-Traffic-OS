import { Workspace, WorkspaceContext } from './workspace.types';
import { getWorkspaceById } from './workspace-registry';

export function createWorkspaceContext(workspaceId: string): WorkspaceContext {
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) {
    throw new Error(`Workspace not found: ${workspaceId}`);
  }
  return {
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    workspaceSlug: workspace.slug,
    domain: workspace.domain,
    niche: workspace.niche,
    language: workspace.language,
    country: workspace.country,
    timezone: workspace.timezone,
  };
}

export function requireWorkspaceContext(workspaceId: string | undefined): WorkspaceContext {
  if (!workspaceId) {
    throw new Error('workspace_id is required. All operations must have a workspace context.');
  }
  return createWorkspaceContext(workspaceId);
}
