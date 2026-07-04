import { RiskAssessment, RiskLevel } from './governance.types';

const riskThresholds = { operational: 60, editorial: 50, financial: 40, seo: 55, publishing: 65, data: 70, cross_workspace: 80 };

export function calculateRisk(params: { actionType: string; workspaceId: string; targetWorkspaceId?: string; hasApproval?: boolean; costEstimate?: number; tokenEstimate?: number }): RiskAssessment {
  const baseRisk: RiskAssessment = { operational: 20, editorial: 15, financial: 10, seo: 15, publishing: 20, data: 10, cross_workspace: 0, overall: 0 };

  if (params.actionType.includes('publish')) { baseRisk.publishing += 40; baseRisk.editorial += 25; }
  if (params.actionType.includes('newsletter')) { baseRisk.publishing += 50; baseRisk.editorial += 30; }
  if (params.actionType.includes('delete')) { baseRisk.operational += 50; baseRisk.editorial += 40; }
  if (params.actionType.includes('strategy')) { baseRisk.operational += 35; baseRisk.editorial += 20; }
  if (params.actionType.includes('mission') && params.actionType.includes('large')) { baseRisk.operational += 30; }
  if (params.targetWorkspaceId && params.targetWorkspaceId !== params.workspaceId) { baseRisk.cross_workspace += 60; }
  if (params.costEstimate && params.costEstimate > 100) { baseRisk.financial += 40; }
  if (params.tokenEstimate && params.tokenEstimate > 50000) { baseRisk.financial += 25; }

  baseRisk.overall = Math.round((baseRisk.operational + baseRisk.editorial + baseRisk.financial + baseRisk.seo + baseRisk.publishing + baseRisk.data + baseRisk.cross_workspace) / 7);
  return baseRisk;
}

export function getRiskLevel(score: number): RiskLevel { return score >= 70 ? 'critical' : score >= 50 ? 'high' : score >= 30 ? 'medium' : score >= 10 ? 'low' : 'none'; }
export function getRiskThresholds() { return riskThresholds; }
