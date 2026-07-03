import {
  ContentHistory, HistoricalDataPoint, TrafficForecast, RankingForecast,
  GrowthForecast, RiskForecast, RefreshForecast, Scenario, PredictionScores,
  PredictionItem, PredictionRecommendation
} from './predictive-intelligence.types';
import {
  calculateTrend, predictTraffic, predictPosition, predictGrowthRate,
  calculateRefreshProbability, calculateContentLongevity, calculateConfidence,
  calculateStrategicValue
} from './predictive-intelligence.validator';

export class PredictiveIntelligenceEngine {
  analyzeHistoricalData(histories: ContentHistory[]): PredictionItem[] {
    return histories.map(history => {
      const clicks = history.data_points.map(d => d.clicks);
      const positions = history.data_points.map(d => d.position);
      const impressions = history.data_points.map(d => d.impressions);

      const trafficTrend = calculateTrend(clicks);
      const positionTrend = calculateTrend(positions);
      const impressionTrend = calculateTrend(impressions);

      const growthRate = predictGrowthRate(clicks);
      const refreshProb = calculateRefreshProbability(history);
      const longevity = calculateContentLongevity(history);
      const confidence = calculateConfidence(history.data_points.length);

      const riskProb = this.calculateRiskProbability(history, trafficTrend, positionTrend);

      const trafficForecast = this.predictTraffic(history, trafficTrend, confidence);
      const rankingForecast = this.predictRanking(history, positionTrend, confidence);
      const growthForecast = this.predictGrowth(history, growthRate, confidence);
      const riskForecast = this.predictRisk(history, trafficTrend, positionTrend, riskProb, confidence);
      const refreshForecast = this.predictRefresh(history, refreshProb, confidence);

      const scores = this.calculateScores(history, growthRate, riskProb, refreshProb, confidence);

      return {
        content_id: history.id,
        title: history.title,
        cluster: history.cluster,
        traffic_forecast: trafficForecast,
        ranking_forecast: rankingForecast,
        growth_forecast: growthForecast,
        risk_forecast: riskForecast,
        refresh_forecast: refreshForecast,
        scores,
      };
    });
  }

  calculateTrendData(dataPoints: number[]): { slope: number; direction: 'up' | 'down' | 'stable'; strength: number } {
    return calculateTrend(dataPoints);
  }

  predictTraffic(history: ContentHistory, trend: { slope: number; direction: string; strength: number }, confidence: number): TrafficForecast {
    const current = history.current_clicks;
    const predicted30 = predictTraffic(current, trend, 30);
    const predicted90 = predictTraffic(current, trend, 90);
    const predicted180 = predictTraffic(current, trend, 180);
    const growthRate = current > 0 ? Math.round(((predicted30 - current) / current) * 100) : 0;

    return {
      content_id: history.id,
      current_traffic: current,
      predicted_30d: predicted30,
      predicted_90d: predicted90,
      predicted_180d: predicted180,
      growth_rate: growthRate,
      confidence,
    };
  }

  predictRanking(history: ContentHistory, trend: { slope: number; direction: string; strength: number }, confidence: number): RankingForecast {
    const current = history.current_position;
    const predicted30 = predictPosition(current, trend, 30);
    const predicted90 = predictPosition(current, trend, 90);
    const improvementProb = trend.direction === 'up' ? Math.min(90, 50 + trend.strength) : trend.direction === 'stable' ? 40 : 20;
    const declineProb = trend.direction === 'down' ? Math.min(90, 50 + trend.strength) : 15;

    return {
      content_id: history.id,
      current_position: current,
      predicted_position_30d: predicted30,
      predicted_position_90d: predicted90,
      improvement_probability: improvementProb,
      decline_probability: declineProb,
      confidence,
    };
  }

  predictGrowth(history: ContentHistory, growthRate: number, confidence: number): GrowthForecast {
    const currentGrowth = growthRate;
    const predictedGrowth = growthRate > 0 ? Math.round(growthRate * 1.1) : Math.round(growthRate * 0.9);
    const acceleration = predictedGrowth - currentGrowth;
    const potential = predictedGrowth > 15 ? 'high' : predictedGrowth > 5 ? 'medium' : 'low';

    return {
      content_id: history.id,
      current_growth_rate: currentGrowth,
      predicted_growth_rate: predictedGrowth,
      acceleration,
      potential,
      confidence,
    };
  }

  predictRisk(history: ContentHistory, trafficTrend: any, positionTrend: any, riskProb: number, confidence: number): RiskForecast {
    let riskType: RiskForecast['risk_type'] = 'decay';
    let severity: RiskForecast['severity'] = 'low';

    if (trafficTrend.direction === 'down' && trafficTrend.strength > 50) {
      riskType = 'decay';
      severity = riskProb > 70 ? 'high' : riskProb > 40 ? 'medium' : 'low';
    } else if (positionTrend.direction === 'up' && positionTrend.strength > 40) {
      riskType = 'competition';
      severity = 'medium';
    } else if (riskProb > 60) {
      riskType = 'algorithm';
      severity = 'medium';
    }

    const ageDays = (Date.now() - new Date(history.lastUpdate || history.pubDate).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > 365) {
      riskType = 'obsolescence';
      severity = 'high';
    }

    return {
      content_id: history.id,
      risk_type: riskType,
      probability: riskProb,
      severity,
      timeframe: riskProb > 70 ? '30d' : riskProb > 40 ? '90d' : '180d',
      mitigation: this.getMitigation(riskType),
      confidence,
    };
  }

  predictRefresh(history: ContentHistory, refreshProb: number, confidence: number): RefreshForecast {
    const lastUpdate = history.lastUpdate || history.pubDate;
    const ageDays = (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60 * 24);
    const recommendedDate = new Date(Date.now() + (1 - refreshProb / 100) * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      content_id: history.id,
      refresh_needed: refreshProb > 50,
      probability: refreshProb,
      recommended_date: recommendedDate,
      reason: ageDays > 180 ? 'Conteúdo desatualizado' : refreshProb > 50 ? 'Tendência de declínio' : 'Manutenção preventiva',
      impact_if_refreshed: Math.round(refreshProb * 0.6),
      confidence,
    };
  }

  generateScenarios(predictions: PredictionItem[]): Scenario[] {
    const totalCurrent = predictions.reduce((sum, p) => sum + p.traffic_forecast.current_traffic, 0);

    return [
      {
        name: 'conservative',
        description: 'Cenário pessimista com crescimento reduzido e riscos elevados',
        assumptions: ['Crescimento 30% menor que o previsto', 'Posições estáveis ou levemente piores', 'Sem novas oportunidades exploradas'],
        indicators: [
          { metric: 'Tráfego Total (30d)', value: Math.round(totalCurrent * 0.7) },
          { metric: 'Tráfego Total (90d)', value: Math.round(totalCurrent * 0.7 * 1.1) },
          { metric: 'Melhoria de Posição', value: Math.round(predictions.reduce((s, p) => s + (p.ranking_forecast.current_position - p.ranking_forecast.predicted_position_30d), 0) * 0.5 * 10) / 10 },
        ],
        risks: ['Perda de posições para concorrentes', 'Atualizações de algoritmo negativas', 'Sazonalidade desfavorável'],
        opportunities: ['Manter posições atuais', 'Melhorar conteúdo existente'],
        confidence: Math.max(20, Math.round(predictions.reduce((s, p) => s + p.scores.confidence, 0) / predictions.length) - 10),
        traffic_multiplier: 0.7,
        ranking_improvement: 0.5,
      },
      {
        name: 'probable',
        description: 'Cenário mais provável baseado nas tendências atuais',
        assumptions: ['Tendências atuais se mantêm', 'Sem grandes mudanças de algoritmo', 'Execução consistente das recomendações'],
        indicators: [
          { metric: 'Tráfego Total (30d)', value: totalCurrent },
          { metric: 'Tráfego Total (90d)', value: Math.round(totalCurrent * 1.15) },
          { metric: 'Melhoria de Posição', value: Math.round(predictions.reduce((s, p) => s + (p.ranking_forecast.current_position - p.ranking_forecast.predicted_position_30d), 0) * 10) / 10 },
        ],
        risks: ['Flutuações normais de algoritmo', 'Concorrência crescente'],
        opportunities: ['Crescimento orgânico consistente', 'Expansão de clusters'],
        confidence: Math.round(predictions.reduce((s, p) => s + p.scores.confidence, 0) / predictions.length),
        traffic_multiplier: 1.0,
        ranking_improvement: 1.0,
      },
      {
        name: 'optimistic',
        description: 'Cenário otimista com alto crescimento e oportunidades exploradas',
        assumptions: ['Crescimento 40% maior que o previsto', 'Posições melhoram significativamente', 'Novas oportunidades são exploradas'],
        indicators: [
          { metric: 'Tráfego Total (30d)', value: Math.round(totalCurrent * 1.4) },
          { metric: 'Tráfego Total (90d)', value: Math.round(totalCurrent * 1.4 * 1.3) },
          { metric: 'Melhoria de Posição', value: Math.round(predictions.reduce((s, p) => s + (p.ranking_forecast.current_position - p.ranking_forecast.predicted_position_30d), 0) * 1.5 * 10) / 10 },
        ],
        risks: ['Expectativas altas podem não ser atingidas'],
        opportunities: ['Alto crescimento orgânico', 'Dominância de clusters', 'Novos mercados'],
        confidence: Math.max(15, Math.round(predictions.reduce((s, p) => s + p.scores.confidence, 0) / predictions.length) - 15),
        traffic_multiplier: 1.4,
        ranking_improvement: 1.5,
      },
    ];
  }

  calculateOverallScores(predictions: PredictionItem[]): PredictionScores {
    if (predictions.length === 0) {
      return { confidence: 0, growth_potential: 0, content_longevity: 0, refresh_probability: 0, traffic_forecast: 0, strategic_value: 0, overall: 0 };
    }

    const avg = (key: keyof PredictionScores) =>
      Math.round(predictions.reduce((sum, p) => sum + p.scores[key], 0) / predictions.length);

    const confidence = avg('confidence');
    const growth_potential = avg('growth_potential');
    const content_longevity = avg('content_longevity');
    const refresh_probability = avg('refresh_probability');
    const traffic_forecast = avg('traffic_forecast');
    const strategic_value = avg('strategic_value');

    const overall = Math.round(
      confidence * 0.2 + growth_potential * 0.2 + content_longevity * 0.15 +
      (100 - refresh_probability) * 0.1 + traffic_forecast * 0.15 + strategic_value * 0.2
    );

    return { confidence, growth_potential, content_longevity, refresh_probability, traffic_forecast, strategic_value, overall };
  }

  generateRecommendations(predictions: PredictionItem[]): PredictionRecommendation[] {
    const recs: PredictionRecommendation[] = [];
    let recId = 1;

    const urgentRefresh = predictions.filter(p => p.refresh_forecast.refresh_needed && p.refresh_forecast.probability > 70);
    for (const p of urgentRefresh.slice(0, 3)) {
      recs.push({
        id: `rec-${recId++}`, type: 'refresh', priority: 'critical',
        title: `Atualizar urgente: ${p.title}`,
        description: `${p.refresh_forecast.probability}% de probabilidade de necessitar atualização`,
        content_id: p.content_id, cluster: p.cluster,
        reason: p.refresh_forecast.reason,
        impact: 'Crítico', effort: 'Médio', timeframe: '30 dias',
        confidence: p.scores.confidence,
      });
    }

    const highGrowth = predictions.filter(p => p.growth_forecast.potential === 'high');
    for (const p of highGrowth.slice(0, 3)) {
      recs.push({
        id: `rec-${recId++}`, type: 'invest', priority: 'high',
        title: `Investir em: ${p.title}`,
        description: `Potencial de crescimento alto — aceleração de ${p.growth_forecast.acceleration}%`,
        content_id: p.content_id, cluster: p.cluster,
        reason: 'Conteúdo com alto potencial de crescimento',
        impact: 'Alto', effort: 'Médio', timeframe: '60 dias',
        confidence: p.scores.confidence,
      });
    }

    const highRisk = predictions.filter(p => p.risk_forecast.severity === 'high');
    for (const p of highRisk.slice(0, 3)) {
      recs.push({
        id: `rec-${recId++}`, type: 'protect', priority: 'critical',
        title: `Proteger: ${p.title}`,
        description: `Risco ${p.risk_forecast.risk_type} com ${p.risk_forecast.probability}% de probabilidade`,
        content_id: p.content_id, cluster: p.cluster,
        reason: p.risk_forecast.mitigation,
        impact: 'Crítico', effort: 'Alto', timeframe: '30 dias',
        confidence: p.scores.confidence,
      });
    }

    const declining = predictions.filter(p => p.traffic_forecast.growth_rate < -10);
    for (const p of declining.slice(0, 2)) {
      recs.push({
        id: `rec-${recId++}`, type: 'consolidate', priority: 'medium',
        title: `Consolidar: ${p.title}`,
        description: `Tráfego previsto cair ${Math.abs(p.traffic_forecast.growth_rate)}% em 30 dias`,
        content_id: p.content_id, cluster: p.cluster,
        reason: 'Conteúdo em declínio — consolidar ou expandir',
        impact: 'Médio', effort: 'Médio', timeframe: '60 dias',
        confidence: p.scores.confidence,
      });
    }

    return recs.sort((a, b) => {
      const pOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    });
  }

  private calculateRiskProbability(history: ContentHistory, trafficTrend: any, positionTrend: any): number {
    let risk = 20;

    if (trafficTrend.direction === 'down') risk += trafficTrend.strength * 0.4;
    if (positionTrend.direction === 'up') risk += positionTrend.strength * 0.3;

    const ageDays = (Date.now() - new Date(history.lastUpdate || history.pubDate).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > 365) risk += 25;
    else if (ageDays > 180) risk += 15;

    if (history.current_clicks < 10) risk += 10;
    if (history.current_position > 30) risk += 10;

    return Math.min(100, Math.round(risk));
  }

  private getMitigation(riskType: string): string {
    const mitigations: Record<string, string> = {
      decay: 'Atualizar dados, adicionar novas informações e otimizar SEO',
      obsolescence: 'Reescrever ou redirecionar para conteúdo atualizado',
      competition: 'Melhorar qualidade, adicionar dados únicos e fortalecer autoridade',
      algorithm: 'Melhorar experiência do usuário, velocidade e qualidade do conteúdo',
      seasonal: 'Preparar conteúdo antecipadamente para a temporada',
    };
    return mitigations[riskType] || 'Monitorar e avaliar ação preventiva';
  }

  private calculateScores(history: ContentHistory, growthRate: number, riskProb: number, refreshProb: number, confidence: number): PredictionScores {
    const growth_potential = Math.max(0, Math.min(100, 50 + growthRate));
    const content_longevity = calculateContentLongevity(history);
    const traffic_forecast = Math.max(0, Math.min(100, confidence + (growthRate > 0 ? 10 : -10)));
    const strategic_value = calculateStrategicValue(history, growthRate, riskProb);

    const overall = Math.round(
      confidence * 0.2 + growth_potential * 0.2 + content_longevity * 0.15 +
      (100 - refreshProb) * 0.1 + traffic_forecast * 0.15 + strategic_value * 0.2
    );

    return { confidence, growth_potential, content_longevity, refresh_probability: refreshProb, traffic_forecast, strategic_value, overall };
  }
}
