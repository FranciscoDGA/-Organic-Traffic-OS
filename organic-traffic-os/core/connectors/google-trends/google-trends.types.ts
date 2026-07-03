export interface GtConfig {
  enabled: boolean;
  mode: 'mock' | 'api';
  country?: string;
  language?: string;
}

export interface GtTimePoint {
  date: string;
  value: number;
}

export interface GtInterestOverTime {
  term: string;
  timelineData: GtTimePoint[];
  average: number;
  peak: number;
  trend: 'rising' | 'stable' | 'declining';
}

export interface GtRegionData {
  region: string;
  value: number;
  geoCode?: string;
}

export interface GtInterestByRegion {
  term: string;
  regions: GtRegionData[];
}

export interface GtRelatedQuery {
  query: string;
  value: number;
  type: 'rising' | 'top';
}

export interface GtRelatedTopic {
  topic: string;
  value: number;
  type: 'rising' | 'top';
  mid?: string;
}

export interface GtRelatedQueries {
  term: string;
  rising: GtRelatedQuery[];
  top: GtRelatedQuery[];
}

export interface GtRelatedTopics {
  term: string;
  rising: GtRelatedTopic[];
  top: GtRelatedTopic[];
}

export interface GtComparisonResult {
  terms: string[];
  timelineData: { date: string; values: number[] }[];
  average: number[];
  peak: number[];
  winner: string;
}

export interface GtSeasonality {
  term: string;
  pattern: { month: string; avgValue: number }[];
  peakMonth: string;
  lowMonth: string;
  seasonalStrength: number;
}

export interface GtInternalData {
  id: string;
  term: string;
  type: 'interest_over_time' | 'interest_by_region' | 'related_queries' | 'related_topics' | 'comparison' | 'seasonality';
  value: number;
  metadata: Record<string, unknown>;
  date: string;
  country: string;
}

export interface GtSyncResult {
  terms_analyzed: number;
  interest_records: number;
  region_records: number;
  related_queries_records: number;
  related_topics_records: number;
  comparisons: number;
  status: 'synced' | 'partial' | 'failed';
  synced_at: string;
}

export interface GtCacheMeta {
  last_sync: string;
  expires_at: string;
  source: string;
  status: 'valid' | 'stale' | 'empty';
  record_count: number;
}

export interface GtConnectorLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  action: string;
  message: string;
  duration_ms?: number;
  records?: number;
  data?: Record<string, unknown>;
}

export interface GtStatus {
  connected: boolean;
  mode: 'mock' | 'api';
  terms_monitored: number;
  last_sync: string | null;
  total_interest_records: number;
  total_related_records: number;
  cache_status: 'valid' | 'stale' | 'empty';
  errors: string[];
  logs: GtConnectorLog[];
}

export interface GtConnectorResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  cache_meta?: GtCacheMeta;
  logs?: GtConnectorLog[];
}
