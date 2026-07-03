import { PredictiveIntelligenceEngine } from './predictive-intelligence.engine';
import {
  ContentHistory, PredictionIntelligenceReport, AnalysisInput,
  PredictionItem, PredictionRecommendation, PredictionScores, Scenario
} from './predictive-intelligence.types';

export class PredictiveIntelligenceService {
  private engine = new PredictiveIntelligenceEngine();
  private lastReport: PredictionIntelligenceReport | null = null;
  private history: PredictionIntelligenceReport[] = [];

  async runAnalysis(input: AnalysisInput): Promise<PredictionIntelligenceReport> {
    const logs: PredictionIntelligenceReport['logs'] = [];
    const warnings: string[] = [];
    const start = Date.now();

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'analysis_start', message: 'Starting predictive intelligence analysis' });

    const contentHistories = this.extractContentHistories(input);
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'data_extracted', message: `Extracted ${contentHistories.length} content histories` });

    if (contentHistories.length === 0) {
      warnings.push('No historical data found. Using mock data for demonstration.');
    }

    const historiesToAnalyze = contentHistories.length > 0 ? contentHistories : this.generateMockHistories();
    const predictions = this.engine.analyzeHistoricalData(historiesToAnalyze);

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'predictions_generated', message: `Generated ${predictions.length} predictions` });

    const scenarios = this.engine.generateScenarios(predictions);
    const overall_scores = this.engine.calculateOverallScores(predictions);
    const recommendations = this.engine.generateRecommendations(predictions);

    const lowConfidence = predictions.filter(p => p.scores.confidence < 40);
    if (lowConfidence.length > 0) {
      warnings.push(`${lowConfidence.length} predictions have low confidence (< 40%). Results may be less accurate.`);
    }

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'analysis_complete', message: `Generated ${recommendations.length} recommendations, ${scenarios.length} scenarios`, duration_ms: Date.now() - start });

    const report: PredictionIntelligenceReport = {
      timestamp: new Date().toISOString(),
      total_items: historiesToAnalyze.length,
      items_analyzed: predictions.length,
      overall_scores,
      traffic_forecasts: predictions.map(p => p.traffic_forecast),
      ranking_forecasts: predictions.map(p => p.ranking_forecast),
      growth_forecasts: predictions.map(p => p.growth_forecast),
      risk_forecasts: predictions.map(p => p.risk_forecast),
      refresh_forecasts: predictions.map(p => p.refresh_forecast),
      scenarios,
      predictions,
      recommendations,
      warnings,
      logs,
    };

    this.lastReport = report;
    this.history.push(report);
    if (this.history.length > 20) this.history.shift();

    return report;
  }

  getRecommendations(): PredictionRecommendation[] {
    return this.lastReport?.recommendations || [];
  }

  getForecast(): { traffic: any; ranking: any; growth: any } | null {
    if (!this.lastReport) return null;
    return {
      traffic: this.lastReport.traffic_forecasts,
      ranking: this.lastReport.ranking_forecasts,
      growth: this.lastReport.growth_forecasts,
    };
  }

  getScenarios(): Scenario[] {
    return this.lastReport?.scenarios || [];
  }

  getScores(): PredictionScores | null {
    return this.lastReport?.overall_scores || null;
  }

  getLastReport(): PredictionIntelligenceReport | null {
    return this.lastReport;
  }

  getHistory(): { timestamp: string; total_items: number; overall_score: number; confidence: number }[] {
    return this.history.map(r => ({
      timestamp: r.timestamp,
      total_items: r.total_items,
      overall_score: r.overall_scores.overall,
      confidence: r.overall_scores.confidence,
    }));
  }

  private extractContentHistories(input: AnalysisInput): ContentHistory[] {
    const histories: ContentHistory[] = [];
    let id = 1;

    if (input.content_history && input.content_history.length > 0) {
      return input.content_history;
    }

    if (input.gsc_data) {
      for (const row of input.gsc_data) {
        const existing = histories.find(h => h.url === row.page);
        if (existing) {
          existing.data_points.push({
            date: row.date || new Date().toISOString(),
            clicks: row.clicks || 0, impressions: row.impressions || 0,
            ctr: row.ctr || 0, position: row.position || 50,
            sessions: 0, pageviews: 0, bounce_rate: 50, avg_time_on_page: 30,
          });
        } else {
          histories.push({
            id: `hist-${id++}`, url: row.page || '', title: row.query || `Content ${id}`,
            pubDate: row.date || '2026-01-01',
            data_points: [{
              date: row.date || new Date().toISOString(),
              clicks: row.clicks || 0, impressions: row.impressions || 0,
              ctr: row.ctr || 0, position: row.position || 50,
              sessions: 0, pageviews: 0, bounce_rate: 50, avg_time_on_page: 30,
            }],
            current_clicks: row.clicks || 0, current_impressions: row.impressions || 0,
            current_ctr: row.ctr || 0, current_position: row.position || 50,
            word_count: 1000, internal_links_in: 3, internal_links_out: 4,
          });
        }
      }
    }

    if (input.inventory_data) {
      for (const item of input.inventory_data) {
        if (!histories.find(h => h.url === item.url)) {
          histories.push({
            id: `hist-${id++}`, url: item.url || '', title: item.title || `Content ${id}`,
            cluster: item.cluster, pubDate: item.pubDate || '2026-01-01',
            data_points: [{
              date: new Date().toISOString(),
              clicks: item.clicks || 10, impressions: item.impressions || 500,
              ctr: item.ctr || 2, position: item.position || 20,
              sessions: item.sessions || 5, pageviews: item.pageviews || 8,
              bounce_rate: item.bounce_rate || 50, avg_time_on_page: item.avg_time_on_page || 60,
            }],
            current_clicks: item.clicks || 10, current_impressions: item.impressions || 500,
            current_ctr: item.ctr || 2, current_position: item.position || 20,
            word_count: item.word_count || 1000,
            internal_links_in: item.internal_links_in || 3,
            internal_links_out: item.internal_links_out || 4,
          });
        }
      }
    }

    return histories;
  }

  private generateMockHistories(): ContentHistory[] {
    return [
      {
        id: 'mock-1', url: '/concursos-2026', title: 'Guia Concursos 2026', cluster: 'concursos',
        pubDate: '2026-01-15', lastUpdate: '2026-05-01',
        data_points: Array.from({ length: 14 }, (_, i) => ({
          date: new Date(Date.now() - (13 - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          clicks: 120 + Math.round(Math.sin(i * 0.5) * 20 + i * 3),
          impressions: 4000 + Math.round(Math.sin(i * 0.3) * 500 + i * 50),
          ctr: 3 + Math.sin(i * 0.4) * 0.5, position: 8 - Math.sin(i * 0.2) * 2,
          sessions: 100 + i * 2, pageviews: 150 + i * 3,
          bounce_rate: 35 - i * 0.5, avg_time_on_page: 180 + i * 5,
        })),
        current_clicks: 165, current_impressions: 5200, current_ctr: 3.2, current_position: 6,
        word_count: 3500, internal_links_in: 12, internal_links_out: 8,
      },
      {
        id: 'mock-2', url: '/seo-basico', title: 'SEO Básico', cluster: 'seo',
        pubDate: '2025-06-20', lastUpdate: '2025-12-01',
        data_points: Array.from({ length: 14 }, (_, i) => ({
          date: new Date(Date.now() - (13 - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          clicks: 80 - Math.round(i * 2),
          impressions: 3000 - Math.round(i * 30),
          ctr: 2.7 - Math.sin(i * 0.3) * 0.3, position: 12 + Math.sin(i * 0.2) * 3,
          sessions: 60 - i, pageviews: 90 - i * 1.5,
          bounce_rate: 45 + i * 0.3, avg_time_on_page: 120 - i * 2,
        })),
        current_clicks: 52, current_impressions: 2580, current_ctr: 2.0, current_position: 15,
        word_count: 1500, internal_links_in: 6, internal_links_out: 7,
      },
      {
        id: 'mock-3', url: '/analytics-setup', title: 'Google Analytics Setup', cluster: 'analytics',
        pubDate: '2026-03-10', lastUpdate: '2026-06-15',
        data_points: Array.from({ length: 14 }, (_, i) => ({
          date: new Date(Date.now() - (13 - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          clicks: 50 + Math.round(i * 4),
          impressions: 2000 + Math.round(i * 100),
          ctr: 2.5 + Math.sin(i * 0.4) * 0.2, position: 15 - Math.sin(i * 0.3) * 3,
          sessions: 40 + i * 3, pageviews: 60 + i * 4,
          bounce_rate: 40 - i * 0.5, avg_time_on_page: 150 + i * 5,
        })),
        current_clicks: 106, current_impressions: 3400, current_ctr: 3.1, current_position: 9,
        word_count: 2000, internal_links_in: 7, internal_links_out: 4,
      },
      {
        id: 'mock-4', url: '/legislacao-concursos', title: 'Legislação Concursos', cluster: 'concursos',
        pubDate: '2024-08-01', lastUpdate: '2024-08-01',
        data_points: Array.from({ length: 14 }, (_, i) => ({
          date: new Date(Date.now() - (13 - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          clicks: 30 - Math.round(i * 1.5),
          impressions: 1500 - Math.round(i * 50),
          ctr: 2.0 - Math.sin(i * 0.2) * 0.2, position: 25 + Math.sin(i * 0.3) * 5,
          sessions: 20 - i, pageviews: 30 - i,
          bounce_rate: 55 + i * 0.5, avg_time_on_page: 90 - i * 3,
        })),
        current_clicks: 9, current_impressions: 800, current_ctr: 1.1, current_position: 35,
        word_count: 2200, internal_links_in: 4, internal_links_out: 5,
      },
      {
        id: 'mock-5', url: '/copywriting-seo', title: 'Copywriting para SEO', cluster: 'seo',
        pubDate: '2026-02-01', lastUpdate: '2026-04-10',
        data_points: Array.from({ length: 14 }, (_, i) => ({
          date: new Date(Date.now() - (13 - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          clicks: 20 + Math.round(i * 5),
          impressions: 800 + Math.round(i * 150),
          ctr: 2.5 + Math.sin(i * 0.5) * 0.3, position: 18 - Math.sin(i * 0.4) * 4,
          sessions: 15 + i * 4, pageviews: 25 + i * 5,
          bounce_rate: 50 - i, avg_time_on_page: 100 + i * 8,
        })),
        current_clicks: 90, current_impressions: 2900, current_ctr: 3.1, current_position: 10,
        word_count: 900, internal_links_in: 2, internal_links_out: 3,
      },
    ];
  }
}
