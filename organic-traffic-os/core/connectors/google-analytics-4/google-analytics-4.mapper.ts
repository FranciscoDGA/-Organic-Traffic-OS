import { InternalGa4Metrics, Ga4ApiRow, Ga4Dimension } from './google-analytics-4.types';

export class Ga4Mapper {
  static toInternalMetrics(apiRow: Ga4ApiRow, dimension: Ga4Dimension, syncDate?: string): InternalGa4Metrics {
    const dims = apiRow.dimensionValues || [];
    const metrics = apiRow.metricValues || [];
    const getVal = (idx: number) => parseFloat(metrics[idx]?.value || '0');
    const getDim = (idx: number) => dims[idx]?.value || '';

    return {
      id: getDim(0) || 'unknown',
      type: dimension,
      activeUsers: Math.round(getVal(0)),
      sessions: Math.round(getVal(1)),
      totalUsers: Math.round(getVal(2)),
      screenPageViews: Math.round(getVal(3)),
      averageSessionDuration: Math.round(getVal(4) * 100) / 100,
      engagementRate: Math.round(getVal(5) * 10000) / 100,
      eventsPerSession: Math.round(getVal(6) * 100) / 100,
      conversions: Math.round(getVal(7)),
      date: syncDate || new Date().toISOString().split('T')[0],
      source: dimension === 'sessionSource' ? getDim(0) : undefined,
      medium: dimension === 'sessionMedium' ? getDim(0) : undefined,
      device: dimension === 'deviceCategory' ? getDim(0) : undefined,
      country: dimension === 'country' ? getDim(0) : undefined,
    };
  }

  static toInternalMetricsBatch(rows: Ga4ApiRow[], dimension: Ga4Dimension, syncDate?: string): InternalGa4Metrics[] {
    return rows.map(row => this.toInternalMetrics(row, dimension, syncDate));
  }

  static aggregateMetrics(items: InternalGa4Metrics[]) {
    if (items.length === 0) {
      return { total_sessions: 0, total_users: 0, total_views: 0, avg_engagement_rate: 0, avg_session_duration: 0, total_conversions: 0, count: 0 };
    }
    const total_sessions = items.reduce((s, i) => s + i.sessions, 0);
    const total_users = items.reduce((s, i) => s + i.totalUsers, 0);
    const total_views = items.reduce((s, i) => s + i.screenPageViews, 0);
    const total_conversions = items.reduce((s, i) => s + i.conversions, 0);
    const avg_engagement_rate = Math.round((items.reduce((s, i) => s + i.engagementRate, 0) / items.length) * 100) / 100;
    const avg_session_duration = Math.round((items.reduce((s, i) => s + i.averageSessionDuration, 0) / items.length) * 100) / 100;
    return { total_sessions, total_users, total_views, avg_engagement_rate, avg_session_duration, total_conversions, count: items.length };
  }
}
