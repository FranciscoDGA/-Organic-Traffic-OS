import { InternalBwMetrics, BwApiRow } from './bing-webmaster.types';

export class BwMapper {
  static toInternalMetrics(apiRow: BwApiRow, type: string, syncDate?: string): InternalBwMetrics {
    return {
      id: apiRow.name || 'unknown',
      type,
      clicks: apiRow.clicks || 0,
      impressions: apiRow.impressions || 0,
      ctr: Math.round((apiRow.ctr || 0) * 10000) / 100,
      position: Math.round((apiRow.position || 0) * 100) / 100,
      date: syncDate || new Date().toISOString().split('T')[0],
    };
  }

  static toInternalMetricsBatch(rows: BwApiRow[], type: string, syncDate?: string): InternalBwMetrics[] {
    return rows.map(row => this.toInternalMetrics(row, type, syncDate));
  }

  static aggregateMetrics(items: InternalBwMetrics[]) {
    if (items.length === 0) {
      return { total_clicks: 0, total_impressions: 0, avg_ctr: 0, avg_position: 0, count: 0 };
    }
    const total_clicks = items.reduce((s, i) => s + i.clicks, 0);
    const total_impressions = items.reduce((s, i) => s + i.impressions, 0);
    const avg_ctr = total_impressions > 0 ? Math.round((total_clicks / total_impressions) * 10000) / 100 : 0;
    const avg_position = Math.round((items.reduce((s, i) => s + i.position, 0) / items.length) * 100) / 100;
    return { total_clicks, total_impressions, avg_ctr, avg_position, count: items.length };
  }
}
