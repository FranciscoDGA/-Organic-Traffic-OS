import { Workspace } from './workspace.types';

export function validateWorkspace(workspace: Partial<Workspace>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!workspace.id) errors.push('id is required');
  if (!workspace.name) errors.push('name is required');
  if (!workspace.slug) errors.push('slug is required');
  if (!workspace.domain) errors.push('domain is required');
  if (!workspace.type) errors.push('type is required');
  if (!workspace.language) errors.push('language is required');
  if (!workspace.country) errors.push('country is required');
  if (!workspace.timezone) errors.push('timezone is required');
  if (!workspace.niche) errors.push('niche is required');
  if (!workspace.audience) errors.push('audience is required');

  if (workspace.slug && !/^[a-z0-9-]+$/.test(workspace.slug)) {
    errors.push('slug must be lowercase alphanumeric with hyphens');
  }

  if (workspace.domain && !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(workspace.domain)) {
    errors.push('domain must be a valid domain');
  }

  return { valid: errors.length === 0, errors };
}
