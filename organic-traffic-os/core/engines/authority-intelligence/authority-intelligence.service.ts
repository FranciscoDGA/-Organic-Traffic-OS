import { AuthorityIntelligenceEngine } from './authority-intelligence.engine';
import {
  AuthorityItem, Cluster, EntityAuthority, InternalLink, PillarPage,
  AuthorityIntelligenceReport, AnalysisInput, AuthorityRecommendation, AuthorityScores
} from './authority-intelligence.types';

export class AuthorityIntelligenceService {
  private engine = new AuthorityIntelligenceEngine();
  private lastReport: AuthorityIntelligenceReport | null = null;
  private history: AuthorityIntelligenceReport[] = [];

  async runAnalysis(input: AnalysisInput): Promise<AuthorityIntelligenceReport> {
    const logs: AuthorityIntelligenceReport['logs'] = [];
    const start = Date.now();

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'analysis_start', message: 'Starting authority intelligence analysis' });

    const items = this.extractItems(input);
    const links = this.extractInternalLinks(input);
    const clustersData = input.clusters_data;

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'data_extracted', message: `Extracted ${items.length} items, ${links.length} links` });

    const clusters = this.engine.buildClusters(items, clustersData);
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'clusters_built', message: `Built ${clusters.length} clusters` });

    const entityAuth = this.engine.buildEntityAuthority(items, clusters);
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'entities_built', message: `Built authority for ${entityAuth.length} entities` });

    const pillarPages = this.extractPillarPages(items);
    const pillarGaps = this.engine.detectPillarGaps(clusters, items);
    const weakClusters = this.engine.detectWeakClusters(clusters);
    const linkAnalysis = this.engine.analyzeInternalLinks(items, links);

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'gaps_detected', message: `${pillarGaps.length} pillar gaps, ${weakClusters.length} weak clusters, ${linkAnalysis.orphan_count} orphans` });

    const scores = this.engine.calculateScores(items, clusters, entityAuth, links, pillarPages);
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'scores_calculated', message: `Overall: ${scores.overall}, Topical: ${scores.topical}, Cluster: ${scores.cluster}` });

    const recommendations = this.engine.generateRecommendations(items, clusters, entityAuth, pillarGaps, weakClusters, scores);
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'recommendations_generated', message: `Generated ${recommendations.length} recommendations`, duration_ms: Date.now() - start });

    const report: AuthorityIntelligenceReport = {
      timestamp: new Date().toISOString(),
      total_items: items.length,
      total_clusters: clusters.length,
      total_entities: entityAuth.length,
      total_internal_links: links.length,
      total_pillar_pages: pillarPages.length,
      overall_scores: scores,
      items,
      clusters,
      entity_authority: entityAuth,
      internal_links: links,
      pillar_pages: pillarPages,
      pillar_gaps: pillarGaps,
      weak_clusters: weakClusters,
      recommendations,
      logs,
    };

    this.lastReport = report;
    this.history.push(report);
    if (this.history.length > 20) this.history.shift();

    return report;
  }

  getRecommendations(): AuthorityRecommendation[] {
    return this.lastReport?.recommendations || [];
  }

  getScores(): AuthorityScores | null {
    return this.lastReport?.overall_scores || null;
  }

  getLastReport(): AuthorityIntelligenceReport | null {
    return this.lastReport;
  }

  getHistory(): { timestamp: string; total_items: number; total_clusters: number; scores: AuthorityScores }[] {
    return this.history.map(r => ({
      timestamp: r.timestamp,
      total_items: r.total_items,
      total_clusters: r.total_clusters,
      scores: r.overall_scores,
    }));
  }

  private extractItems(input: AnalysisInput): AuthorityItem[] {
    const items: AuthorityItem[] = [];
    let id = 1;

    if (input.inventory_data) {
      for (const entry of input.inventory_data) {
        items.push({
          id: `inv-${id++}`, url: entry.url || '', title: entry.title || `Item ${id}`,
          type: entry.type || 'page', cluster: entry.cluster, entities: entry.entities || [],
          keywords: entry.keywords || [], internal_links_out: entry.internal_links_out || 0,
          internal_links_in: entry.internal_links_in || 0, word_count: entry.word_count || 500,
          pubDate: entry.pubDate, source: 'inventory',
        });
      }
    }

    if (input.knowledge_core) {
      for (const entry of input.knowledge_core) {
        if (!items.find(i => i.url === entry.url)) {
          items.push({
            id: `kc-${id++}`, url: entry.url || '', title: entry.title || `Knowledge ${id}`,
            type: entry.type || 'page', cluster: entry.cluster, entities: entry.entities || [],
            keywords: entry.keywords || [], internal_links_out: entry.internal_links_out || 0,
            internal_links_in: entry.internal_links_in || 0, word_count: entry.word_count || 500,
            source: 'knowledge',
          });
        }
      }
    }

    if (input.publishing_packages) {
      for (const pkg of input.publishing_packages) {
        if (!items.find(i => i.url === pkg.url)) {
          items.push({
            id: `pub-${id++}`, url: pkg.url || '', title: pkg.title || `Package ${id}`,
            type: pkg.type || 'post', cluster: pkg.cluster, entities: pkg.entities || [],
            keywords: pkg.keywords || [], internal_links_out: pkg.internal_links_out || 0,
            internal_links_in: pkg.internal_links_in || 0, word_count: pkg.word_count || 800,
            source: 'publishing',
          });
        }
      }
    }

    if (input.content_intelligence?.content_items) {
      for (const ci of input.content_intelligence.content_items) {
        if (!items.find(i => i.url === ci.url)) {
          items.push({
            id: `ci-${id++}`, url: ci.url || '', title: ci.title || `CI ${id}`,
            type: ci.type || 'page', cluster: ci.cluster, entities: ci.entities || [],
            keywords: ci.keywords || [], internal_links_out: 0,
            internal_links_in: 0, word_count: 500,
            source: 'content_intelligence',
          });
        }
      }
    }

    if (input.semantic_intelligence?.items) {
      for (const si of input.semantic_intelligence.items) {
        if (!items.find(i => i.url === si.url)) {
          items.push({
            id: `si-${id++}`, url: si.url || '', title: si.title || `SI ${id}`,
            type: si.type || 'page', cluster: si.cluster, entities: si.entities || [],
            keywords: si.keywords || [], internal_links_out: 0,
            internal_links_in: 0, word_count: si.content?.split(/\s+/).length || 500,
            source: 'semantic_intelligence',
          });
        }
      }
    }

    return items;
  }

  private extractInternalLinks(input: AnalysisInput): InternalLink[] {
    const links: InternalLink[] = [];

    if (input.internal_links) {
      for (const link of input.internal_links) {
        links.push({
          source_id: link.source_id || '',
          target_id: link.target_id || '',
          source_url: link.source_url || '',
          target_url: link.target_url || '',
          anchor: link.anchor,
        });
      }
    }

    return links;
  }

  private extractPillarPages(items: AuthorityItem[]): PillarPage[] {
    return items
      .filter(i => i.type === 'pillar')
      .map(i => ({
        id: i.id,
        url: i.url,
        title: i.title,
        cluster: i.cluster || 'uncategorized',
        word_count: i.word_count,
        internal_links_in: i.internal_links_in,
        internal_links_out: i.internal_links_out,
        coverage_score: Math.min(100, Math.round(i.word_count / 20 + i.internal_links_in * 5)),
      }));
  }
}
