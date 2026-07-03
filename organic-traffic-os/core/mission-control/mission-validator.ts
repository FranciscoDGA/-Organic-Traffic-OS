import { Mission } from './mission.types';

export function validateMission(mission: Partial<Mission>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!mission.workspaceId) errors.push('workspaceId required');
  if (!mission.name) errors.push('name required');
  if (!mission.objective) errors.push('objective required');
  if (!mission.strategy) errors.push('strategy required');
  if (!mission.type) errors.push('type required');
  return { valid: errors.length === 0, errors };
}
