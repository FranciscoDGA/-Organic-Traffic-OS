import { PortfolioReport, WorkspaceScore, PortfolioRecommendation, CapacityReport } from './portfolio.types';
import { getWorkspaceMetrics } from './portfolio-manager';
import { calculateWorkspaceScore, calculatePortfolioScore } from './portfolio-score';
import { generateRecommendations } from './portfolio-recommendation';
import { compareWorkspaces } from './portfolio-comparator';

function buildCapacity(): CapacityReport {
  const metrics = getWorkspaceMetrics();
  return {
    totalWorkspaces: metrics.length,
    totalContent: metrics.reduce((s, m) => s + m.contentCount, 0),
    totalWorkflows: metrics.reduce((s, m) => s + m.workflowsExecuted, 0),
    totalTokensUsed: metrics.reduce((s, m) => s + m.aiTokensUsed, 0),
    totalCostEstimate: parseFloat(metrics.reduce((s, m) => s + m.costEstimate, 0).toFixed(2)),
    capacityRemaining: 70,
    bottlenecks: ['Limite de tokens por workspace', 'Frequencia de publicacao limitada'],
  };
}

let report: PortfolioReport | null = null;

export function getPortfolioService() {
  return {
    getReport(): PortfolioReport {
      if (!report) this.generateReport();
      return report!;
    },

    generateReport(): PortfolioReport {
      const metrics = getWorkspaceMetrics();
      const workspaceScores = metrics.map(m => calculateWorkspaceScore(m));
      const portfolioScore = calculatePortfolioScore(workspaceScores);
      const ranking = workspaceScores.map((s, i) => ({ workspaceId: s.workspaceId, score: s.overallScore, rank: i + 1 })).sort((a, b) => b.score - a.score);
      const risks = workspaceScores.filter(s => s.riskScore < 60).map(s => `${s.workspaceId}: risco elevado`);
      const recommendations = generateRecommendations(workspaceScores).map(r => r.title);
      const capacity = buildCapacity();

      report = {
        id: `portfolio-${Date.now()}`,
        workspaceCount: metrics.length,
        portfolioScore,
        workspaceScores,
        ranking,
        risks,
        recommendations,
        capacity,
        createdAt: new Date().toISOString(),
      };
      return report;
    },

    getWorkspaces() {
      return getWorkspaceMetrics();
    },

    getRanking() {
      const r = this.getReport();
      return r.ranking;
    },

    getRecommendations() {
      const r = this.getReport();
      return generateRecommendations(r.workspaceScores);
    },

    getCapacity() {
      return buildCapacity();
    },

    compare() {
      return compareWorkspaces(getWorkspaceMetrics());
    },
  };
}
