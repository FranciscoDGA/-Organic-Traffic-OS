import { WorkspaceScore, PortfolioScore, WorkspaceMetrics } from './portfolio.types';

export function calculateWorkspaceScore(m: WorkspaceMetrics): WorkspaceScore {
  const healthScore = Math.min(100, (m.contentCount / 50) * 30 + (m.traffic / 15000) * 30 + (m.authority / 100) * 40);
  const growthScore = Math.min(100, m.growth * 4);
  const opportunityScore = Math.min(100, m.opportunities * 12);
  const riskScore = Math.max(0, 100 - m.costEstimate * 5 - (100 - m.authority));
  const authorityScore = m.authority;
  const operationalScore = Math.min(100, (m.workflowsExecuted / 150) * 50 + (m.publishingFrequency / 5) * 50);
  const executionScore = Math.min(100, (m.experiments / 5) * 40 + (m.workflowsExecuted / 150) * 60);
  const overallScore = Math.round(healthScore * 0.2 + growthScore * 0.2 + authorityScore * 0.2 + operationalScore * 0.15 + executionScore * 0.15 + opportunityScore * 0.1);

  return { workspaceId: m.workspaceId, healthScore: Math.round(healthScore), growthScore: Math.round(growthScore), opportunityScore: Math.round(opportunityScore), riskScore: Math.round(riskScore), authorityScore: Math.round(authorityScore), operationalScore: Math.round(operationalScore), executionScore: Math.round(executionScore), overallScore };
}

export function calculatePortfolioScore(scores: WorkspaceScore[]): PortfolioScore {
  if (scores.length === 0) return { overallHealth: 0, growthScore: 0, authorityScore: 0, trafficScore: 0, executionScore: 0, contentQualityScore: 0, operationalScore: 0, roiScore: 0, overallPortfolioScore: 0 };

  const avg = (fn: (s: WorkspaceScore) => number) => scores.reduce((sum, s) => sum + fn(s), 0) / scores.length;

  const overallHealth = Math.round(avg(s => s.healthScore));
  const growthScore = Math.round(avg(s => s.growthScore));
  const authorityScore = Math.round(avg(s => s.authorityScore));
  const trafficScore = Math.round(avg(s => s.healthScore * 0.6 + s.growthScore * 0.4));
  const executionScore = Math.round(avg(s => s.executionScore));
  const contentQualityScore = Math.round(avg(s => s.authorityScore * 0.5 + s.healthScore * 0.5));
  const operationalScore = Math.round(avg(s => s.operationalScore));
  const roiScore = Math.round(avg(s => s.overallScore));
  const overallPortfolioScore = Math.round(avg(s => s.overallScore));

  return { overallHealth, growthScore, authorityScore, trafficScore, executionScore, contentQualityScore, operationalScore, roiScore, overallPortfolioScore };
}
