import { InternalMetricsData, GscApiRow, GscDimension } from './google-search-console.types';

export class GscMapper {
  static toInternalMetrics(apiRow: GscApiRow, dimension: GscDimension, syncDate?: string): InternalMetricsData {
    const key = apiRow.keys?.[0] || 'unknown';
    const date = syncDate || new Date().toISOString();
    return {
      id: key,
      type: dimension,
      clicks: apiRow.clicks || 0,
      impressions: apiRow.impressions || 0,
      ctr: Math.round((apiRow.ctr || 0) * 10000) / 100,
      position: Math.round((apiRow.position || 0) * 100) / 100,
      date,
    };
  }

  static toInternalMetricsBatch(rows: GscApiRow[], dimension: GscDimension, syncDate?: string): InternalMetricsData[] {
    return rows.map(row => this.toInternalMetrics(row, dimension, syncDate));
  }

  static aggregateMetrics(items: InternalMetricsData[]) {
    if (items.length === 0) {
      return { total_clicks: 0, total_impressions: 0, avg_ctr: 0, avg_position: 0, count: 0 };
    }
    const total_clicks = items.reduce((s, i) => s + i.clicks, 0);
    const total_impressions = items.reduce((s, i) => s + i.impressions, 0);
    const avg_ctr = total_impressions > 0 ? Math.round((total_clicks / total_impressions) * 10000) / 100 : 0;
    const avg_position = Math.round((items.reduce((s, i) => s + i.position, 0) / items.length) * 100) / 100;
    return { total_clicks, total_impressions, avg_ctr, avg_position, count: items.length };
  }

  static toPerformanceMetrics(queryData: InternalMetricsData[], pageData: InternalMetricsData[]) {
    const agg = this.aggregateMetrics([...queryData, ...pageData]);
    return {
      visualizacoes: agg.total_impressions,
      cliques: agg.total_clicks,
      ctr: agg.avg_ctr,
      impressoes: agg.total_impressions,
      posicao_media: agg.avg_position,
      tempo_medio: 0,
      conversoes: 0,
      downloads: 0,
      leads: 0,
      compartilhamentos: 0,
      ultima_atualizacao: new Date().toISOString(),
      origem: 'google_search_console',
    };
  }
}
