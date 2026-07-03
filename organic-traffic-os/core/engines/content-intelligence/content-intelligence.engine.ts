import { ContentItem, ContentMetrics, ContentScores, ContentRecommendation, AnalysisInput } from './content-intelligence.types';
import { calculateHealthScore, calculateOpportunityScore, calculateRiskScore, calculateFreshnessScore, calculateAuthorityScore, calculatePotentialScore, calculateGrowthScore } from './content-intelligence.validator';

export class ContentIntelligenceEngine {
  analyzeContent(items: ContentItem[], metrics: ContentMetrics[]): { item: ContentItem; metrics: ContentMetrics; scores: ContentScores }[] {
    return items.map(item => {
      const itemMetrics = metrics.find(m => m.content_id === item.id) || this.defaultMetrics(item.id);
      const ageDays = item.pubDate ? (Date.now() - new Date(item.pubDate).getTime()) / (1000 * 60 * 60 * 24) : 365;
      const scores = this.calculateScores(itemMetrics, ageDays);
      return { item, metrics: itemMetrics, scores };
    });
  }

  calculateScores(metrics: ContentMetrics, ageDays: number): ContentScores {
    return {
      health: calculateHealthScore(metrics, ageDays),
      opportunity: calculateOpportunityScore(metrics),
      risk: calculateRiskScore(metrics, ageDays),
      freshness: calculateFreshnessScore(metrics.content_id ? undefined : undefined),
      authority: calculateAuthorityScore(metrics),
      potential: calculatePotentialScore(metrics),
      growth: calculateGrowthScore(metrics),
    };
  }

  detectOpportunities(items: { item: ContentItem; metrics: ContentMetrics; scores: ContentScores }[]): ContentRecommendation[] {
    const recs: ContentRecommendation[] = [];
    let id = 1;

    for (const { item, metrics, scores } of items) {
      const ageDays = item.pubDate ? (Date.now() - new Date(item.pubDate).getTime()) / (1000 * 60 * 60 * 24) : 365;

      if (metrics.impressions > 1000 && metrics.ctr < 2 && metrics.position > 5) {
        recs.push({
          id: `rec-${id++}`, type: 'optimize', priority: 'high',
          content_id: item.id, title: `Otimizar CTR: ${item.title}`,
          description: `${metrics.impressions} impressões mas CTR de ${metrics.ctr}%. Otimizar title e meta description.`,
          impact: 'Alto', effort: 'Baixo', scores: { opportunity: scores.opportunity },
        });
      }

      if (metrics.position > 5 && metrics.position <= 20 && metrics.impressions > 500) {
        recs.push({
          id: `rec-${id++}`, type: 'optimize', priority: 'medium',
          content_id: item.id, title: `Melhorar posição: ${item.title}`,
          description: `Posição ${metrics.position} — otimizações podem levar à primeira página.`,
          impact: 'Médio', effort: 'Médio', scores: { potential: scores.potential },
        });
      }

      if (metrics.clicks > 20 && metrics.position > 10 && ageDays > 180) {
        recs.push({
          id: `rec-${id++}`, type: 'update', priority: 'high',
          content_id: item.id, title: `Atualizar conteúdo: ${item.title}`,
          description: `Conteúdo com ${Math.floor(ageDays)} dias e tráfego caindo. Atualizar dados e informações.`,
          impact: 'Alto', effort: 'Médio', scores: { risk: scores.risk },
        });
      }

      if (metrics.bounce_rate > 70 && metrics.position > 20) {
        recs.push({
          id: `rec-${id++}`, type: 'fix', priority: 'critical',
          content_id: item.id, title: `Corrigir bounce alto: ${item.title}`,
          description: `Bounce rate de ${metrics.bounce_rate}% com posição ${metrics.position}. Revisar conteúdo e UX.`,
          impact: 'Crítico', effort: 'Alto', scores: { health: scores.health, risk: scores.risk },
        });
      }

      if (metrics.impressions > 2000 && metrics.clicks < 5) {
        recs.push({
          id: `rec-${id++}`, type: 'create', priority: 'high',
          title: `Criar conteúdo sobre: ${item.title}`,
          description: `${metrics.impressions} impressões detectadas mas conteúdo insuficiente.`,
          impact: 'Alto', effort: 'Alto', scores: { opportunity: scores.opportunity },
        });
      }
    }

    return recs.sort((a, b) => {
      const pOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    });
  }

  detectCriticalContent(analyzed: { item: ContentItem; scores: ContentScores }[]): { item: ContentItem; scores: ContentScores; reason: string }[] {
    return analyzed
      .filter(a => a.scores.health < 30 || a.scores.risk > 70)
      .map(a => ({
        item: a.item,
        scores: a.scores,
        reason: a.scores.health < 30 ? 'Health score baixo' : 'Risco alto de perda',
      }));
  }

  detectPromisingContent(analyzed: { item: ContentItem; scores: ContentScores }[]): { item: ContentItem; scores: ContentScores; reason: string }[] {
    return analyzed
      .filter(a => a.scores.opportunity > 60 || a.scores.potential > 70)
      .map(a => ({
        item: a.item,
        scores: a.scores,
        reason: a.scores.opportunity > 60 ? 'Alta oportunidade' : 'Alto potencial de tráfego',
      }));
  }

  calculateOverallScores(analyzed: { scores: ContentScores }[]): ContentScores {
    if (analyzed.length === 0) {
      return { health: 0, opportunity: 0, risk: 0, freshness: 0, authority: 0, potential: 0, growth: 0 };
    }

    const avg = (key: keyof ContentScores) =>
      Math.round(analyzed.reduce((sum, a) => sum + a.scores[key], 0) / analyzed.length);

    return {
      health: avg('health'),
      opportunity: avg('opportunity'),
      risk: avg('risk'),
      freshness: avg('freshness'),
      authority: avg('authority'),
      potential: avg('potential'),
      growth: avg('growth'),
    };
  }

  private defaultMetrics(content_id: string): ContentMetrics {
    return { content_id, clicks: 0, impressions: 0, ctr: 0, position: 50, sessions: 0, pageviews: 0, bounce_rate: 50, avg_time_on_page: 30 };
  }
}
