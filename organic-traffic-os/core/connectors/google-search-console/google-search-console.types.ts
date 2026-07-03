export interface GscAuthConfig {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  scope?: string;
}

export interface GscOAuthState {
  code?: string;
  state: string;
  redirect_uri: string;
}

export interface GscSite {
  siteUrl: string;
  permissionLevel: string;
}

export type GscDimension = 'query' | 'page' | 'country' | 'device' | 'date';

export interface GscApiRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface InternalMetricsData {
  id: string;
  type: GscDimension;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  date: string;
  country?: string;
  device?: string;
}

export interface GscSyncResult {
  queries: number;
  pages: number;
  countries: number;
  devices: number;
  total_clicks: number;
  total_impressions: number;
  avg_ctr: number;
  avg_position: number;
  status: 'synced' | 'partial' | 'failed';
  synced_at: string;
}

export interface GscCacheMeta {
  last_sync: string;
  expires_at: string;
  source: string;
  status: 'valid' | 'stale' | 'empty';
  record_count: number;
}

export interface GscConnectorLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  action: string;
  message: string;
  duration_ms?: number;
  records?: number;
  data?: Record<string, unknown>;
}

export interface GscStatus {
  connected: boolean;
  has_valid_token: boolean;
  account_email?: string;
  sites_count: number;
  last_sync: string | null;
  total_queries: number;
  total_pages: number;
  cache_status: 'valid' | 'stale' | 'empty';
  errors: string[];
  logs: GscConnectorLog[];
}

export interface ConnectorResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  cache_meta?: GscCacheMeta;
  logs?: GscConnectorLog[];
}
