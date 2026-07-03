import {
  OpportunityItem, SignalData, IntelligenceData, OpportunityScores, OpportunityRecommendation
} from './opportunity-intelligence.types';
import {
  calculateOpportunityScore, calculateTrafficPotentialScore, calculateDifficultyScore,
  calculateMonetizationScore, calculateFreshnessScore, calculateAuthorityFitScore,
  calculateContentGapScore, calculateStrategicPriorityScore
} from './opportunity-intelligence.validator';

export class OpportunityIntelligenceEngine {
  mergeSignals(signalData: SignalData, intelligenceData: IntelligenceData): OpportunityItem[] {
    const opportunities: OpportunityItem[] = [];
    let id = 1;

    const gscData = signalData.gsc_data || [];
    for (const row of gscData) {
      if (row.position > 5 && row.position <= 20 && row.impressions > 500) {
        const tp = calculateTrafficPotentialScore({ gsc_clicks: row.clicks, gsc_impressions: row.impressions, gsc_position: row.position });
        const diff = calculateDifficultyScore({ serp_competition: 50 });
        const fresh = calculateFreshnessScore();
        const authFit = calculateAuthorityFitScore({ topical_authority: intelligenceData.authority_intelligence?.overall_scores?.topical || 50 });
        const gap = calculateContentGapScore({ has_content: true });
        const strat = calculateStrategicPriorityScore({ business_alignment: 60 });
        const mono = calculateMonetizationScore({ commercial_intent: false, keyword_type: 'informational' });

        const item: OpportunityItem = {
          id: `opp-${id++}`, title: `Otimizar: ${row.query || row.page}`, type: 'new_content',
          description: `Posição ${row.position} com ${row.impressions} impressões — otimizar para subir`,
          topic: row.query || 'Geral', keywords: [row.query], entities: [],
          source_signals: ['gsc'], reason: 'Quick win — posição 5-20 com volume',
          traffic_potential: tp, difficulty: diff, monetization: mono, freshness: fresh,
          authority_fit: authFit, content_gap: gap, strategic_priority: strat,
          opportunity_score: 0, effort: 'baixo', impact: 'medio',
          estimated_time_hours: 4, related_items: [],
        };
        item.opportunity_score = calculateOpportunityScore(item);
        opportunities.push(item);
      }
    }

    const trendsData = signalData.trends_data || [];
    for (const trend of trendsData) {
      if (trend.interest > 60) {
        const tp = calculateTrafficPotentialScore({ trends_interest: trend.interest, keyword_volume: trend.volume || 500 });
        const diff = calculateDifficultyScore({ serp_competition: 40 });
        const fresh = calculateFreshnessScore();
        const gap = calculateContentGapScore({ has_content: false });
        const strat = calculateStrategicPriorityScore({ business_alignment: 70, seasonal_relevance: trend.interest });
        const mono = calculateMonetizationScore({ commercial_intent: false, keyword_type: 'informational' });
        const authFit = calculateAuthorityFitScore({ topical_authority: 40 });

        const item: OpportunityItem = {
          id: `opp-${id++}`, title: `Criar conteúdo: ${trend.keyword}`, type: 'new_content',
          description: `Tendência em alta (${trend.interest}/100) — criar conteúdo antes dos concorrentes`,
          topic: trend.keyword, keywords: [trend.keyword], entities: [],
          source_signals: ['trends'], reason: 'Tópico em tendência sem cobertura',
          traffic_potential: tp, difficulty: diff, monetization: mono, freshness: fresh,
          authority_fit: authFit, content_gap: gap, strategic_priority: strat,
          opportunity_score: 0, effort: 'medio', impact: 'alto',
          estimated_time_hours: 8, related_items: [],
        };
        item.opportunity_score = calculateOpportunityScore(item);
        opportunities.push(item);
      }
    }

    const keywordsData = signalData.keywords_data || [];
    for (const kw of keywordsData) {
      if (kw.competition < 40 && kw.volume > 300) {
        const tp = calculateTrafficPotentialScore({ keyword_volume: kw.volume, serp_competition: kw.competition });
        const diff = calculateDifficultyScore({ serp_competition: kw.competition });
        const fresh = calculateFreshnessScore();
        const gap = calculateContentGapScore({ has_content: false, keyword_count: 1 });
        const strat = calculateStrategicPriorityScore({ business_alignment: 50 });
        const mono = calculateMonetizationScore({ commercial_intent: kw.commercial_intent, keyword_type: kw.type || 'informational' });
        const authFit = calculateAuthorityFitScore({ topical_authority: 45 });

        const item: OpportunityItem = {
          id: `opp-${id++}`, title: `Keyword opportunity: ${kw.keyword}`, type: 'new_content',
          description: `Volume ${kw.volume}, competição ${kw.competition}% — boa oportunidade`,
          topic: kw.keyword, keywords: [kw.keyword], entities: [],
          source_signals: ['keywords'], reason: 'Keyword com baixa competição e bom volume',
          traffic_potential: tp, difficulty: diff, monetization: mono, freshness: fresh,
          authority_fit: authFit, content_gap: gap, strategic_priority: strat,
          opportunity_score: 0, effort: kw.type === 'transactional' ? 'alto' : 'medio',
          impact: kw.commercial_intent ? 'alto' : 'medio',
          estimated_time_hours: kw.type === 'transactional' ? 12 : 6, related_items: [],
        };
        item.opportunity_score = calculateOpportunityScore(item);
        opportunities.push(item);
      }
    }

    const ciData = intelligenceData.content_intelligence;
    if (ciData?.critical_content) {
      for (const critical of ciData.critical_content) {
        const item: OpportunityItem = {
          id: `opp-${id++}`, title: `Atualizar: ${critical.item?.title || 'Conteúdo'}`, type: 'update',
          description: `Health score ${critical.scores?.health || 0} — precisa de atualização urgente`,
          topic: critical.item?.title || 'Geral', keywords: [],
          entities: [], source_signals: ['content_intelligence'],
          reason: critical.reason || 'Conteúdo crítico detectado',
          traffic_potential: 40, difficulty: 30, monetization: 30,
          freshness: calculateFreshnessScore(critical.item?.pubDate),
          authority_fit: 50, content_gap: 20, strategic_priority: 60,
          opportunity_score: 0, effort: 'medio', impact: 'alto',
          estimated_time_hours: 6, related_items: [critical.item?.id].filter(Boolean),
        };
        item.opportunity_score = calculateOpportunityScore(item);
        opportunities.push(item);
      }
    }

    const semanticData = intelligenceData.semantic_intelligence;
    if (semanticData?.questions) {
      const unanswered = semanticData.questions.filter((q: any) => q.answer_coverage < 40);
      if (unanswered.length > 0) {
        const item: OpportunityItem = {
          id: `opp-${id++}`, title: `FAQ: ${unanswered.length} perguntas sem resposta`, type: 'faq',
          description: `${unanswered.length} perguntas do público sem resposta adequada`,
          topic: unanswered.slice(0, 3).map((q: any) => q.topic).join(', ') || 'Geral',
          keywords: unanswered.slice(0, 5).map((q: any) => q.question.split(' ').slice(0, 3).join(' ')),
          entities: [], source_signals: ['semantic_intelligence'],
          reason: 'Perguntas do público sem resposta',
          traffic_potential: 60, difficulty: 25, monetization: 30, freshness: 80,
          authority_fit: 55, content_gap: 70, strategic_priority: 65,
          opportunity_score: 0, effort: 'baixo', impact: 'alto',
          estimated_time_hours: 4, related_items: [],
        };
        item.opportunity_score = calculateOpportunityScore(item);
        opportunities.push(item);
      }
    }

    const authData = intelligenceData.authority_intelligence;
    if (authData?.pillar_gaps) {
      for (const gap of authData.pillar_gaps) {
        const item: OpportunityItem = {
          id: `opp-${id++}`, title: `Criar pilar: ${gap.cluster}`, type: 'pillar_page',
          description: gap.reason,
          topic: gap.cluster, keywords: gap.recommended_keywords || [],
          entities: [], source_signals: ['authority_intelligence'],
          reason: gap.reason,
          traffic_potential: 70, difficulty: 60, monetization: 40, freshness: 75,
          authority_fit: 80, content_gap: 60, strategic_priority: 85,
          opportunity_score: 0, effort: 'alto', impact: 'critico',
          estimated_time_hours: 16, related_items: [],
        };
        item.opportunity_score = calculateOpportunityScore(item);
        opportunities.push(item);
      }
    }

    if (authData?.weak_clusters) {
      for (const weak of authData.weak_clusters) {
        if (weak.score < 40) {
          const item: OpportunityItem = {
            id: `opp-${id++}`, title: `Expandir cluster: ${weak.cluster}`, type: 'cluster_expansion',
            description: `Score ${weak.score}/100 — ${weak.reason}`,
            topic: weak.cluster, keywords: [], entities: [],
            source_signals: ['authority_intelligence'],
            reason: weak.reason,
            traffic_potential: 50, difficulty: 40, monetization: 30, freshness: 60,
            authority_fit: 65, content_gap: 45, strategic_priority: 70,
            opportunity_score: 0, effort: 'medio', impact: 'alto',
            estimated_time_hours: 8, related_items: [],
          };
          item.opportunity_score = calculateOpportunityScore(item);
          opportunities.push(item);
        }
      }
    }

    return opportunities;
  }

  rankOpportunities(opportunities: OpportunityItem[]): OpportunityItem[] {
    return [...opportunities].sort((a, b) => b.opportunity_score - a.opportunity_score);
  }

  detectQuickWins(opportunities: OpportunityItem[]): OpportunityItem[] {
    return opportunities.filter(o =>
      o.difficulty < 40 && o.traffic_potential > 50 && o.effort === 'baixo'
    ).sort((a, b) => b.opportunity_score - a.opportunity_score);
  }

  detectStrategicOpportunities(opportunities: OpportunityItem[]): OpportunityItem[] {
    return opportunities.filter(o =>
      o.strategic_priority > 60 || o.type === 'pillar_page'
    ).sort((a, b) => b.strategic_priority - a.strategic_priority);
  }

  detectRefreshOpportunities(opportunities: OpportunityItem[]): OpportunityItem[] {
    return opportunities.filter(o =>
      o.type === 'update' || o.freshness < 40
    ).sort((a, b) => a.freshness - b.freshness);
  }

  detectClusterOpportunities(opportunities: OpportunityItem[]): OpportunityItem[] {
    return opportunities.filter(o =>
      o.type === 'cluster_expansion' || o.type === 'pillar_page'
    ).sort((a, b) => b.authority_fit - a.authority_fit);
  }

  detectConversionOpportunities(opportunities: OpportunityItem[]): OpportunityItem[] {
    return opportunities.filter(o =>
      o.monetization > 50 || o.type === 'landing' || o.type === 'cta_improvement'
    ).sort((a, b) => b.monetization - a.monetization);
  }

  calculateOverallScores(opportunities: OpportunityItem[]): OpportunityScores {
    if (opportunities.length === 0) {
      return { opportunity: 0, traffic_potential: 0, difficulty: 0, monetization: 0, freshness: 0, authority_fit: 0, content_gap: 0, strategic_priority: 0 };
    }

    const avg = (key: keyof OpportunityItem) =>
      Math.round(opportunities.reduce((sum, o) => sum + (o[key] as number), 0) / opportunities.length);

    return {
      opportunity: avg('opportunity_score'),
      traffic_potential: avg('traffic_potential'),
      difficulty: avg('difficulty'),
      monetization: avg('monetization'),
      freshness: avg('freshness'),
      authority_fit: avg('authority_fit'),
      content_gap: avg('content_gap'),
      strategic_priority: avg('strategic_priority'),
    };
  }

  generateRecommendations(opportunities: OpportunityItem[]): OpportunityRecommendation[] {
    const recs: OpportunityRecommendation[] = [];
    let recId = 1;

    const quickWins = this.detectQuickWins(opportunities);
    for (const qw of quickWins.slice(0, 3)) {
      recs.push({
        id: `rec-${recId++}`, type: qw.type, priority: 'high',
        title: `Quick Win: ${qw.title}`, description: qw.description,
        reason: qw.reason, topic: qw.topic,
        impact: qw.impact, effort: qw.effort,
        scores: { opportunity: qw.opportunity_score, traffic_potential: qw.traffic_potential },
      });
    }

    const pillarOpps = opportunities.filter(o => o.type === 'pillar_page');
    for (const p of pillarOpps.slice(0, 2)) {
      recs.push({
        id: `rec-${recId++}`, type: p.type, priority: 'critical',
        title: `Pilar: ${p.title}`, description: p.description,
        reason: p.reason, topic: p.topic,
        impact: p.impact, effort: p.effort,
        scores: { opportunity: p.opportunity_score, strategic_priority: p.strategic_priority },
      });
    }

    const conversionOpps = this.detectConversionOpportunities(opportunities);
    for (const c of conversionOpps.slice(0, 2)) {
      recs.push({
        id: `rec-${recId++}`, type: c.type, priority: 'medium',
        title: `Conversão: ${c.title}`, description: c.description,
        reason: c.reason, topic: c.topic,
        impact: c.impact, effort: c.effort,
        scores: { opportunity: c.opportunity_score, monetization: c.monetization },
      });
    }

    return recs.sort((a, b) => {
      const pOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    });
  }
}
