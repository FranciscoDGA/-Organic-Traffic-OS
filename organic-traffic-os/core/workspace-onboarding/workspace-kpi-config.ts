import { WorkspaceKPI, WorkspaceConfig } from './workspace-onboarding.types';
import { workspaceConfigs } from './workspace-configs';

export class WorkspaceKPIConfig {
  getKPIs(workspaceId: string): WorkspaceKPI[] {
    return workspaceConfigs[workspaceId]?.kpis || [];
  }

  validate(id: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const kpis = this.getKPIs(id);
    if (!kpis.length) { errors.push('KPIs nao configurados'); return { valid: false, errors }; }
    for (const kpi of kpis) {
      if (!kpi.name) errors.push('KPI sem nome');
      if (kpi.target < 0) errors.push(`KPI "${kpi.name}" com target negativo`);
    }
    return { valid: errors.length === 0, errors };
  }
}
