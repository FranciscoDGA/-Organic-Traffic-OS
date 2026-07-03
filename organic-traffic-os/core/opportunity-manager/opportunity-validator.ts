import { Opportunity, MissionProposal } from './opportunity.types';

export function validateOpportunity(opp: Partial<Opportunity>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!opp.workspaceId) errors.push('workspaceId required');
  if (!opp.title) errors.push('title required');
  if (!opp.type) errors.push('type required');
  return { valid: errors.length === 0, errors };
}

export function validateProposal(prop: MissionProposal): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!prop.workspaceId) errors.push('workspaceId required');
  if (!prop.name) errors.push('name required');
  if (!prop.objective) errors.push('objective required');
  return { valid: errors.length === 0, errors };
}
