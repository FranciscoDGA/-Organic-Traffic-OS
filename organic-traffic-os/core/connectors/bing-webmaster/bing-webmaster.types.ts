export interface BwAuthConfig {
  api_key: string;
  site_url?: string;
}

export interface BwSite {
  siteUrl: string;
  dateAdded: string;
  dateLastCrawled: string;
  crawlActivity: string;
  indexedPages: number;
}

export type BwDimension = 'query' | 'page' | 'country' | 'device';

export interface BwApiRow {
  name: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface InternalBwMetrics {
  id: string;
  type: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  date: string;
  country?: string;
  device?: string;
}

export interface BwCrawlError {
  url: string;
  errorType: string;
  firstDetected: string;
  lastDetected: string;
  count: number;
}

export interface BwIndexingStatus {
  url: string;
  status: 'indexed' | 'excluded' | 'error';
  lastCrawled: string;
}

export interface BwSyncResult {
  queries: number;
  pages: number;
  crawl_errors: number;
  indexed_pages: number;
  total_clicks: number;
  total_impressions: number;
  avg_ctr: number;
  avg_position: number;
  status: 'synced' | 'partial' | 'failed';
  synced_at: string;
}

export interface BwCacheMeta {
  last_sync: string;
  expires_at: string;
  source: string;
  status: 'valid' | 'stale' | 'empty';
  record_count: number;
}

export interface BwConnectorLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  action: string;
  message: string;
  duration_ms?: number;
  records?: number;
  data?: Record<string, unknown>;
}

export interface BwStatus {
  connected: boolean;
  has_valid_key: boolean;
  sites_count: number;
  last_sync: string | null;
  total_queries: number;
  total_pages: number;
  cache_status: 'valid' | 'stale' | 'empty';
  errors: string[];
  logs: BwConnectorLog[];
}

export interface BwConnectorResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  cache_meta?: BwCacheMeta;
  logs?: BwConnectorLog[];
}
