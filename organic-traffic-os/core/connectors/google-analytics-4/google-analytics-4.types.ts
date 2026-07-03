export interface Ga4AuthConfig {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  scope?: string;
  property_id?: string;
}

export interface Ga4Property {
  name: string;
  propertyId: string;
  displayName: string;
  createTime: string;
  updateTime: string;
  parent: string;
  serviceLevel: string;
  currencyCode: string;
  timeZone: string;
}

export type Ga4Dimension = 'pagePath' | 'sessionSource' | 'sessionMedium' | 'deviceCategory' | 'country' | 'city' | 'date' | 'eventName';

export interface Ga4ApiRow {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

export interface InternalGa4Metrics {
  id: string;
  type: Ga4Dimension;
  activeUsers: number;
  sessions: number;
  totalUsers: number;
  screenPageViews: number;
  averageSessionDuration: number;
  engagementRate: number;
  eventsPerSession: number;
  conversions: number;
  date: string;
  source?: string;
  medium?: string;
  device?: string;
  country?: string;
}

export interface Ga4SyncResult {
  pages: number;
  traffic_sources: number;
  events: number;
  conversions: number;
  total_sessions: number;
  total_users: number;
  total_views: number;
  avg_engagement_rate: number;
  avg_session_duration: number;
  status: 'synced' | 'partial' | 'failed';
  synced_at: string;
}

export interface Ga4CacheMeta {
  last_sync: string;
  expires_at: string;
  source: string;
  status: 'valid' | 'stale' | 'empty';
  record_count: number;
}

export interface Ga4ConnectorLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  action: string;
  message: string;
  duration_ms?: number;
  records?: number;
  data?: Record<string, unknown>;
}

export interface Ga4Status {
  connected: boolean;
  has_valid_token: boolean;
  property_id: string | null;
  properties_count: number;
  last_sync: string | null;
  total_sessions: number;
  total_users: number;
  total_views: number;
  cache_status: 'valid' | 'stale' | 'empty';
  errors: string[];
  logs: Ga4ConnectorLog[];
}

export interface Ga4ConnectorResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  cache_meta?: Ga4CacheMeta;
  logs?: Ga4ConnectorLog[];
}
