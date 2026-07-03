import { CEODashboardData, WorkspaceSummary, Alert, CEOAction, CostOverview, ExecutionOverview, CEOSummary } from './ceo-dashboard.types';
import { getPortfolioService } from '../portfolio-intelligence/portfolio-index';

function buildWorkspaces(): WorkspaceSummary[] {
  const metrics = [
    { id: 'passacumaru', name: 'PassaCumaru', health: 82, growth: 60, risk: 40, authority: 72, operational: 80, execution: 64, content: 45, traffic: 12500, cost: 12.5, tokens: 250000, workflows: 120, opportunities: 8, experiments: 3 },
    { id: 'garimpeibrasil', name: 'Garimpei Brasil', health: 74, growth: 88, risk: 35, authority: 58, operational: 70, execution: 52, content: 22, traffic: 6800, cost: 7.2, tokens: 140000, workflows: 65, opportunities: 5, experiments: 1 },
  ];

  return metrics.map(m => ({
    workspaceId: m.id,
    name: m.name,
    healthScore: m.health,
    growthScore: m.growth,
    riskScore: m.risk,
    authorityScore: m.authority,
    operationalScore: m.operational,
    executionScore: m.execution,
    overallScore: Math.round(m.health * 0.2 + m.growth * 0.2 + m.authority * 0.2 + m.operational * 0.15 + m.execution * 0.15 + m.risk * 0.1),
    contentCount: m.content,
    traffic: m.traffic,
    cost: m.cost,
    tokensUsed: m.tokens,
    workflowsExecuted: m.workflows,
    opportunities: m.opportunities,
    experiments: m.experiments,
    status: m.health >= 80 ? 'healthy' as const : m.health >= 60 ? 'warning' as const : 'critical' as const,
  }));
}

function buildAlerts(workspaces: WorkspaceSummary[]): Alert[] {
  const alerts: Alert[] = [];
  workspaces.forEach(w => {
    if (w.riskScore > 50) alerts.push({ id: `alert-${w.workspaceId}-risk`, level: 'warning', title: `Risco elevado em ${w.name}`, description: `Risk Score: ${w.riskScore}`, workspaceId: w.workspaceId, origin: 'Portfolio Intelligence', timestamp: new Date().toISOString() });
    if (w.healthScore < 75) alerts.push({ id: `alert-${w.workspaceId}-health`, level: 'info', title: `Saude abaixo do ideal: ${w.name}`, description: `Health Score: ${w.healthScore}`, workspaceId: w.workspaceId, origin: 'Portfolio Intelligence', timestamp: new Date().toISOString() });
    if (w.executionScore < 50) alerts.push({ id: `alert-${w.workspaceId}-exec`, level: 'warning', title: `Execucao baixa: ${w.name}`, description: `Execution Score: ${w.executionScore}`, workspaceId: w.workspaceId, origin: 'Execution Intelligence', timestamp: new Date().toISOString() });
  });
  if (alerts.filter(a => a.level === 'critical').length === 0) {
    alerts.push({ id: 'alert-none', level: 'info', title: 'Nenhum alerta critico', description: 'Todos os workspaces operacionais', origin: 'CEO Dashboard', timestamp: new Date().toISOString() });
  }
  return alerts;
}

function buildActions(workspaces: WorkspaceSummary[]): CEOAction[] {
  const actions: CEOAction[] = [];
  workspaces.forEach(w => {
    if (w.growthScore > 70) actions.push({ id: `act-${w.workspaceId}-accel`, type: 'accelerate', title: `Acelerar ${w.name}`, description: 'Alto crescimento detectado', workspaceId: w.workspaceId, impact: 'high', confidence: 0.85, origin: 'Growth Engine' });
    if (w.riskScore > 40) actions.push({ id: `act-${w.workspaceId}-review`, type: 'review', title: `Revisar ${w.name}`, description: 'Risco acima do ideal', workspaceId: w.workspaceId, impact: 'medium', confidence: 0.8, origin: 'Portfolio Intelligence' });
    if (w.overallScore > 75) actions.push({ id: `act-${w.workspaceId}-invest`, type: 'invest', title: `Investir em ${w.name}`, description: 'Alto desempenho geral', workspaceId: w.workspaceId, impact: 'high', confidence: 0.9, origin: 'CEO Analysis' });
  });
  return actions;
}

function buildCosts(workspaces: WorkspaceSummary[]): CostOverview {
  const totalCost = workspaces.reduce((s, w) => s + w.cost, 0);
  const totalTokens = workspaces.reduce((s, w) => s + w.tokensUsed, 0);
  return {
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalTokens,
    avgCostPerWorkspace: parseFloat((totalCost / workspaces.length).toFixed(2)),
    workspaces: workspaces.map(w => ({ workspaceId: w.workspaceId, cost: w.cost, tokens: w.tokensUsed })),
  };
}

function buildExecution(workspaces: WorkspaceSummary[]): ExecutionOverview {
  return {
    totalWorkflows: workspaces.reduce((s, w) => s + w.workflowsExecuted, 0),
    activeJobs: 5,
    pendingActions: 3,
    experimentsRunning: workspaces.reduce((s, w) => s + w.experiments, 0),
    contentInProduction: workspaces.reduce((s, w) => s + w.contentCount, 0),
    contentAtRisk: workspaces.filter(w => w.status === 'warning').length + workspaces.filter(w => w.status === 'critical').length,
  };
}

function buildSummary(workspaces: WorkspaceSummary[], actions: CEOAction[], costs: CostOverview): CEOSummary {
  const sorted = [...workspaces].sort((a, b) => b.overallScore - a.overallScore);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const topAction = actions.sort((a, b) => (b.impact === 'high' ? 1 : 0) - (a.impact === 'high' ? 1 : 0))[0];

  return {
    situation: `Portfolio com ${workspaces.length} workspaces. Score medio: ${Math.round(workspaces.reduce((s, w) => s + w.overallScore, 0) / workspaces.length)}`,
    bestWorkspace: best ? `${best.name} (Score: ${best.overallScore})` : 'Nenhum',
    highestRiskWorkspace: worst ? `${worst.name} (Risk: ${worst.riskScore})` : 'Nenhum',
    mostUrgentAction: topAction ? topAction.title : 'Nenhuma acao urgente',
    biggestOpportunity: workspaces.reduce((max, w) => w.opportunities > (max?.opportunities || 0) ? w : max, workspaces[0])?.name || 'Nenhuma',
    estimatedCost: `$${costs.totalCost}/mes`,
    mainRecommendation: `Acelerar ${best?.name || 'workspace principal'} e revisar ${worst?.name || 'workspaces com risco'}`,
  };
}

export function getCEODashboardData(): CEODashboardData {
  const workspaces = buildWorkspaces();
  const alerts = buildAlerts(workspaces);
  const actions = buildActions(workspaces);
  const costs = buildCosts(workspaces);
  const execution = buildExecution(workspaces);
  const summary = buildSummary(workspaces, actions, costs);

  return {
    totalWorkspaces: workspaces.length,
    activeWorkspaces: workspaces.filter(w => w.status !== 'critical').length,
    healthScore: Math.round(workspaces.reduce((s, w) => s + w.healthScore, 0) / workspaces.length),
    growthScore: Math.round(workspaces.reduce((s, w) => s + w.growthScore, 0) / workspaces.length),
    riskScore: Math.round(workspaces.reduce((s, w) => s + w.riskScore, 0) / workspaces.length),
    workspaceRanking: workspaces.sort((a, b) => b.overallScore - a.overallScore),
    alerts,
    prioritizedActions: actions,
    costOverview: costs,
    executionOverview: execution,
    summary,
  };
}
