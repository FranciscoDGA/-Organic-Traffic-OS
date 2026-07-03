import { ContentIntelligenceEngine } from './content-intelligence.engine';
import { ContentItem, ContentMetrics, ContentIntelligenceReport, AnalysisInput, ContentRecommendation, ContentScores } from './content-intelligence.types';

export class ContentIntelligenceService {
  private engine = new ContentIntelligenceEngine();
  private lastReport: ContentIntelligenceReport | null = null;

  async runAnalysis(input: AnalysisInput): Promise<ContentIntelligenceReport> {
    const logs: ContentIntelligenceReport['logs'] = [];
    const start = Date.now();

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'analysis_start', message: 'Starting content intelligence analysis' });

    const items = this.extractItems(input);
    const metrics = this.extractMetrics(input);

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'data_extracted', message: `Extracted ${items.length} items, ${metrics.length} metrics` });

    const analyzed = this.engine.analyzeContent(items, metrics);
    const overall_scores = this.engine.calculateOverallScores(analyzed);
    const recommendations = this.engine.detectOpportunities(analyzed);
    const critical_content = this.engine.detectCriticalContent(analyzed);
    const promising_content = this.engine.detectPromisingContent(analyzed);

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'analysis_complete', message: `Generated ${recommendations.length} recommendations, ${critical_content.length} critical, ${promising_content.length} promising`, duration_ms: Date.now() - start });

    const report: ContentIntelligenceReport = {
      timestamp: new Date().toISOString(),
      total_content: items.length,
      total_analyzed: analyzed.length,
      overall_scores,
      content_items: items,
      content_with_scores: analyzed,
      recommendations,
      critical_content,
      promising_content,
      logs,
    };

    this.lastReport = report;
    return report;
  }

  getRecommendations(): ContentRecommendation[] {
    return this.lastReport?.recommendations || [];
  }

  getScores(): ContentScores | null {
    return this.lastReport?.overall_scores || null;
  }

  getLastReport(): ContentIntelligenceReport | null {
    return this.lastReport;
  }

  private extractItems(input: AnalysisInput): ContentItem[] {
    const items: ContentItem[] = [];
    let id = 1;

    if (input.gsc_data) {
      for (const row of input.gsc_data) {
        items.push({ id: `gsc-${id++}`, url: row.page || '', title: row.query || `Page ${id}`, type: 'page', source: 'gsc' });
      }
    }

    if (input.ga4_data) {
      for (const row of input.ga4_data) {
        if (!items.find(i => i.url === row.page)) {
          items.push({ id: `ga4-${id++}`, url: row.page || '', title: row.title || `Page ${id}`, type: 'page', source: 'ga4' });
        }
      }
    }

    if (input.bing_data) {
      for (const row of input.bing_data) {
        if (!items.find(i => i.url === row.page)) {
          items.push({ id: `bing-${id++}`, url: row.page || '', title: row.query || `Page ${id}`, type: 'page', source: 'bing' });
        }
      }
    }

    if (input.rss_data) {
      for (const item of input.rss_data) {
        if (!items.find(i => i.url === item.url)) {
          items.push({ id: `rss-${id++}`, url: item.url || '', title: item.title || `Item ${id}`, type: item.type || 'post', source: 'rss', pubDate: item.pubDate, updatedDate: item.updatedDate });
        }
      }
    }

    if (input.inventory_data) {
      for (const item of input.inventory_data) {
        if (!items.find(i => i.url === item.url)) {
          items.push({ id: `inv-${id++}`, url: item.url || '', title: item.title || `Item ${id}`, type: item.type || 'page', source: 'inventory' });
        }
      }
    }

    return items;
  }

  private extractMetrics(input: AnalysisInput): ContentMetrics[] {
    const metrics: ContentMetrics[] = [];
    let id = 1;

    if (input.gsc_data) {
      for (const row of input.gsc_data) {
        metrics.push({
          content_id: `gsc-${id++}`,
          clicks: row.clicks || 0,
          impressions: row.impressions || 0,
          ctr: row.ctr || 0,
          position: row.position || 50,
          sessions: 0, pageviews: 0, bounce_rate: 50, avg_time_on_page: 30,
        });
      }
    }

    if (input.ga4_data) {
      let ga4Id = 1;
      for (const row of input.ga4_data) {
        const existing = metrics.find(m => m.content_id === `gsc-${ga4Id}`);
        if (existing) {
          existing.sessions = row.sessions || 0;
          existing.pageviews = row.pageviews || 0;
          existing.bounce_rate = row.bounce_rate || 50;
          existing.avg_time_on_page = row.avg_time_on_page || 30;
        } else {
          metrics.push({
            content_id: `ga4-${ga4Id}`,
            clicks: 0, impressions: 0, ctr: 0, position: 50,
            sessions: row.sessions || 0, pageviews: row.pageviews || 0,
            bounce_rate: row.bounce_rate || 50, avg_time_on_page: row.avg_time_on_page || 30,
          });
        }
        ga4Id++;
      }
    }

    return metrics;
  }
}
