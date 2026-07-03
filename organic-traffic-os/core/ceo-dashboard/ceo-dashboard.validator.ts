import { CEODashboardData } from './ceo-dashboard.types';

export function validateCEODashboard(data: CEODashboardData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (data.totalWorkspaces < 1) errors.push('no workspaces');
  if (data.healthScore < 0 || data.healthScore > 100) errors.push('invalid health score');
  return { valid: errors.length === 0, errors };
}
