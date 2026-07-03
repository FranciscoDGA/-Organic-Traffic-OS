import { WorkspaceScore, PortfolioRecommendation } from './portfolio.types';

let recCounter = 0;

export function generateRecommendations(scores: WorkspaceScore[]): PortfolioRecommendation[] {
  const recs: PortfolioRecommendation[] = [];

  scores.forEach(s => {
    if (s.growthScore > 70) {
      recs.push({ id: `rec-${++recCounter}`, type: 'accelerate', workspaceId: s.workspaceId, title: `Acelerar ${s.workspaceId}`, description: 'Workspace com alto crescimento', impact: 'high', confidence: 0.85 });
    }
    if (s.riskScore < 50) {
      recs.push({ id: `rec-${++recCounter}`, type: 'risk', workspaceId: s.workspaceId, title: `Revisar ${s.workspaceId}`, description: 'Workspace com risco elevado', impact: 'high', confidence: 0.8 });
    }
    if (s.overallScore > 80) {
      recs.push({ id: `rec-${++recCounter}`, type: 'invest', workspaceId: s.workspaceId, title: `Investir em ${s.workspaceId}`, description: 'Workspace com alto desempenho', impact: 'medium', confidence: 0.9 });
    }
    if (s.operationalScore < 60) {
      recs.push({ id: `rec-${++recCounter}`, type: 'review', workspaceId: s.workspaceId, title: `Revisar operacoes de ${s.workspaceId}`, description: 'Operacoes abaixo da media', impact: 'medium', confidence: 0.75 });
    }
  });

  if (scores.length > 1) {
    recs.push({ id: `rec-${++recCounter}`, type: 'expand', title: 'Expandir portfolio', description: 'Portfolio saudavel para expansao', impact: 'low', confidence: 0.7 });
  }

  return recs;
}
