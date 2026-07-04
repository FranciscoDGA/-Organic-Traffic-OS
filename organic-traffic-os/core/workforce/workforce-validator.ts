import { AgentProfile } from './workforce.types';

export function validateWorkforce(agents: AgentProfile[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  agents.forEach(a => { if (a.max_load <= 0) errors.push(`${a.id}: invalid max_load`); if (a.reliability < 0 || a.reliability > 100) errors.push(`${a.id}: invalid reliability`); });
  return { valid: errors.length === 0, errors };
}
