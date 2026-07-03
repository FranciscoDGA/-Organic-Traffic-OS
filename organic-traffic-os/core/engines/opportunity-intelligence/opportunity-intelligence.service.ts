import { OpportunityIntelligenceEngine } from './opportunity-intelligence.engine';
import {
  OpportunityItem, SignalData, IntelligenceData, OpportunityIntelligenceReport,
  AnalysisInput, OpportunityRecommendation, OpportunityScores
} from './opportunity-intelligence.types';

export class OpportunityIntelligenceService {
  private engine = new OpportunityIntelligenceEngine();
  private lastReport: OpportunityIntelligenceReport | null = null;
  private history: OpportunityIntelligenceReport[] = [];

  async runAnalysis(input: AnalysisInput): Promise<OpportunityIntelligenceReport> {
    const logs: OpportunityIntelligenceReport['logs'] = [];
    const start = Date.now();

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'analysis_start', message: 'Starting opportunity intelligence analysis' });

    const signalData = this.extractSignalData(input);
    const intelligenceData = this.extractIntelligenceData(input);

    const signalsUsed: string[] = [];
    if (signalData.gsc_data?.length) signalsUsed.push('gsc');
    if (signalData.ga4_data?.length) signalsUsed.push('ga4');
    if (signalData.bing_data?.length) signalsUsed.push('bing');
    if (signalData.trends_data?.length) signalsUsed.push('trends');
    if (signalData.keywords_data?.length) signalsUsed.push('keywords');
    if (signalData.serp_data?.length) signalsUsed.push('serp');
    if (signalData.inventory_data?.length) signalsUsed.push('inventory');
    if (signalData.competitors_data?.length) signalsUsed.push('competitors');
    if (intelligenceData.content_intelligence) signalsUsed.push('content_intelligence');
    if (intelligenceData.semantic_intelligence) signalsUsed.push('semantic_intelligence');
    if (intelligenceData.authority_intelligence) signalsUsed.push('authority_intelligence');

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'signals_merged', message: `${signalsUsed.length} signals analyzed: ${signalsUsed.join(', ')}` });

    const allOpportunities = this.engine.mergeSignals(signalData, intelligenceData);
    const ranked = this.engine.rankOpportunities(allOpportunities);

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'opportunities_ranked', message: `Found ${allOpportunities.length} opportunities` });

    const quickWins = this.engine.detectQuickWins(ranked);
    const strategic = this.engine.detectStrategicOpportunities(ranked);
    const refresh = this.engine.detectRefreshOpportunities(ranked);
    const cluster = this.engine.detectClusterOpportunities(ranked);
    const conversion = this.engine.detectConversionOpportunities(ranked);

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'categories_built', message: `Quick wins: ${quickWins.length}, Strategic: ${strategic.length}, Refresh: ${refresh.length}, Cluster: ${cluster.length}, Conversion: ${conversion.length}` });

    const overall_scores = this.engine.calculateOverallScores(ranked);
    const recommendations = this.engine.generateRecommendations(ranked);

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'analysis_complete', message: `Generated ${recommendations.length} recommendations`, duration_ms: Date.now() - start });

    const report: OpportunityIntelligenceReport = {
      timestamp: new Date().toISOString(),
      total_opportunities: allOpportunities.length,
      quick_wins: quickWins,
      strategic_opportunities: strategic,
      refresh_opportunities: refresh,
      cluster_opportunities: cluster,
      conversion_opportunities: conversion,
      all_opportunities: allOpportunities,
      ranked_opportunities: ranked,
      overall_scores,
      signals_analyzed: signalsUsed,
      recommendations,
      logs,
    };

    this.lastReport = report;
    this.history.push(report);
    if (this.history.length > 20) this.history.shift();

    return report;
  }

  getRecommendations(): OpportunityRecommendation[] {
    return this.lastReport?.recommendations || [];
  }

  getQuickWins(): OpportunityItem[] {
    return this.lastReport?.quick_wins || [];
  }

  getScores(): OpportunityScores | null {
    return this.lastReport?.overall_scores || null;
  }

  getLastReport(): OpportunityIntelligenceReport | null {
    return this.lastReport;
  }

  getHistory(): { timestamp: string; total_opportunities: number; quick_wins_count: number; scores: OpportunityScores }[] {
    return this.history.map(r => ({
      timestamp: r.timestamp,
      total_opportunities: r.total_opportunities,
      quick_wins_count: r.quick_wins.length,
      scores: r.overall_scores,
    }));
  }

  private extractSignalData(input: AnalysisInput): SignalData {
    if (input.direct_input) {
      return {
        gsc_data: input.direct_input.gsc_data,
        ga4_data: input.direct_input.ga4_data,
        bing_data: input.direct_input.bing_data,
        trends_data: input.direct_input.trends_data,
        keywords_data: input.direct_input.keywords_data,
        serp_data: input.direct_input.serp_data,
        inventory_data: input.direct_input.inventory_data,
        performance_data: input.direct_input.performance_data,
        competitors_data: input.direct_input.competitors_data,
      };
    }

    return input.signal_data || {};
  }

  private extractIntelligenceData(input: AnalysisInput): IntelligenceData {
    if (input.direct_input) {
      return {
        content_intelligence: input.direct_input.content_intelligence,
        semantic_intelligence: input.direct_input.semantic_intelligence,
        authority_intelligence: input.direct_input.authority_intelligence,
      };
    }

    return input.intelligence_data || {};
  }
}
