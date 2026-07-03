import {
  Ga4AuthConfig, Ga4Property, InternalGa4Metrics, Ga4SyncResult,
  Ga4CacheMeta, Ga4Status, Ga4ConnectorLog, Ga4ConnectorResult,
} from './google-analytics-4.types';
import { Ga4Validator } from './google-analytics-4.validator';
import { Ga4Client } from './google-analytics-4.client';
import { Ga4Mapper } from './google-analytics-4.mapper';

export class Ga4Service {
  private validator = new Ga4Validator();
  private client?: Ga4Client;
  private config?: Ga4AuthConfig;
  private isConnected = false;
  private logs: Ga4ConnectorLog[] = [];
  private syncCache: Map<string, { data: InternalGa4Metrics[]; meta: Ga4CacheMeta }> = new Map();
  private lastSync: string | null = null;
  private totalSessions = 0;
  private totalUsers = 0;
  private totalViews = 0;

  private log(level: Ga4ConnectorLog['level'], action: string, message: string, extra?: Partial<Ga4ConnectorLog>) {
    this.logs.push({ timestamp: new Date().toISOString(), level, action, message, ...extra });
  }

  getAuthorizationUrl(): string {
    if (!this.config) throw new Error('Config não inicializada. Chame connect() primeiro.');
    const client = new Ga4Client(this.config);
    return client.getAuthorizationUrl();
  }

  async handleOAuthCallback(code: string): Promise<Ga4ConnectorResult<boolean>> {
    if (!this.config) return { success: false, error: 'Config não inicializada' };
    try {
      this.client = new Ga4Client(this.config);
      const tokenData = await this.client.exchangeCode(code);
      this.config.access_token = tokenData.access_token;
      this.config.refresh_token = tokenData.refresh_token;
      this.config.expires_at = Date.now() + tokenData.expires_in * 1000;
      this.isConnected = true;
      this.log('info', 'oauth_callback_success', 'Autenticação OAuth concluída com sucesso');
      return { success: true, data: true };
    } catch (e: any) {
      this.log('error', 'oauth_callback_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async connect(config: Ga4AuthConfig): Promise<Ga4ConnectorResult<boolean>> {
    const val = this.validator.validateConfig(config);
    if (!val.valid) {
      this.log('error', 'connect_validation_failed', val.errors.join(', '));
      return { success: false, error: val.errors.join(', ') };
    }

    this.config = { ...config };
    this.client = new Ga4Client(config);
    this.isConnected = true;
    this.log('info', 'connect_success', 'Connector GA4 inicializado com sucesso');
    return { success: true, data: true };
  }

  async connectWithToken(accessToken: string, refreshToken?: string, expiresAt?: number): Promise<Ga4ConnectorResult<boolean>> {
    if (!this.config) return { success: false, error: 'Config não inicializada' };
    this.config.access_token = accessToken;
    if (refreshToken) this.config.refresh_token = refreshToken;
    if (expiresAt) this.config.expires_at = expiresAt;
    this.client = new Ga4Client(this.config);
    this.isConnected = true;
    this.log('info', 'connect_with_token', 'Conectado com token fornecido');
    return { success: true, data: true };
  }

  async disconnect(): Promise<Ga4ConnectorResult<boolean>> {
    this.config = undefined;
    this.client = undefined;
    this.isConnected = false;
    this.syncCache.clear();
    this.lastSync = null;
    this.totalSessions = 0;
    this.totalUsers = 0;
    this.totalViews = 0;
    this.log('info', 'disconnect', 'Desconectado com sucesso');
    return { success: true, data: true };
  }

  async validateToken(): Promise<Ga4ConnectorResult<boolean>> {
    if (!this.isConnected || !this.client || !this.config) {
      return { success: false, error: 'Não conectado' };
    }
    try {
      await this.client.refreshTokenIfNeeded();
      const valid = this.validator.validateToken(this.config);
      this.log('info', 'validate_token', valid ? 'Token válido' : 'Token inválido');
      return { success: true, data: valid };
    } catch (e: any) {
      this.log('error', 'validate_token_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async listProperties(): Promise<Ga4ConnectorResult<Ga4Property[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    try {
      const properties = await this.client.fetchProperties();
      this.log('info', 'list_properties', `${properties.length} propriedades encontradas`);
      return { success: true, data: properties };
    } catch (e: any) {
      this.log('error', 'list_properties_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async fetchPages(propertyId: string, startDate: string, endDate: string): Promise<Ga4ConnectorResult<InternalGa4Metrics[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    const dateValidation = this.validator.validateDateRange(startDate, endDate);
    if (!dateValidation.valid) return { success: false, error: dateValidation.errors.join(', ') };

    try {
      const rows = await this.client.runReport(propertyId, ['pagePath'], ['activeUsers', 'sessions', 'totalUsers', 'screenPageViews', 'averageSessionDuration', 'engagementRate', 'eventsPerSession', 'conversions'], { startDate, endDate });
      const data = Ga4Mapper.toInternalMetricsBatch(rows, 'pagePath');
      const cacheKey = `pages:${propertyId}:${startDate}:${endDate}`;
      const meta: Ga4CacheMeta = {
        last_sync: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'google-analytics-4',
        status: 'valid',
        record_count: data.length,
      };
      this.syncCache.set(cacheKey, { data, meta });
      return { success: true, data, cache_meta: meta };
    } catch (e: any) {
      this.log('error', 'fetch_pages_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async fetchTrafficSources(propertyId: string, startDate: string, endDate: string): Promise<Ga4ConnectorResult<InternalGa4Metrics[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    const dateValidation = this.validator.validateDateRange(startDate, endDate);
    if (!dateValidation.valid) return { success: false, error: dateValidation.errors.join(', ') };

    try {
      const rows = await this.client.runReport(propertyId, ['sessionSource', 'sessionMedium'], ['activeUsers', 'sessions', 'totalUsers', 'screenPageViews', 'averageSessionDuration', 'engagementRate', 'eventsPerSession', 'conversions'], { startDate, endDate });
      const data = Ga4Mapper.toInternalMetricsBatch(rows, 'sessionSource');
      const cacheKey = `traffic:${propertyId}:${startDate}:${endDate}`;
      const meta: Ga4CacheMeta = {
        last_sync: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'google-analytics-4',
        status: 'valid',
        record_count: data.length,
      };
      this.syncCache.set(cacheKey, { data, meta });
      return { success: true, data, cache_meta: meta };
    } catch (e: any) {
      this.log('error', 'fetch_traffic_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async fetchEngagementMetrics(propertyId: string, startDate: string, endDate: string): Promise<Ga4ConnectorResult<InternalGa4Metrics[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    const dateValidation = this.validator.validateDateRange(startDate, endDate);
    if (!dateValidation.valid) return { success: false, error: dateValidation.errors.join(', ') };

    try {
      const rows = await this.client.runReport(propertyId, ['date'], ['activeUsers', 'sessions', 'totalUsers', 'screenPageViews', 'averageSessionDuration', 'engagementRate', 'eventsPerSession', 'conversions'], { startDate, endDate });
      const data = Ga4Mapper.toInternalMetricsBatch(rows, 'date');
      return { success: true, data };
    } catch (e: any) {
      this.log('error', 'fetch_engagement_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async fetchEvents(propertyId: string, startDate: string, endDate: string): Promise<Ga4ConnectorResult<InternalGa4Metrics[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    const dateValidation = this.validator.validateDateRange(startDate, endDate);
    if (!dateValidation.valid) return { success: false, error: dateValidation.errors.join(', ') };

    try {
      const rows = await this.client.runReport(propertyId, ['eventName'], ['activeUsers', 'sessions', 'totalUsers', 'screenPageViews', 'averageSessionDuration', 'engagementRate', 'eventsPerSession', 'conversions'], { startDate, endDate });
      const data = Ga4Mapper.toInternalMetricsBatch(rows, 'eventName');
      return { success: true, data };
    } catch (e: any) {
      this.log('error', 'fetch_events_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async fetchConversions(propertyId: string, startDate: string, endDate: string): Promise<Ga4ConnectorResult<InternalGa4Metrics[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    const dateValidation = this.validator.validateDateRange(startDate, endDate);
    if (!dateValidation.valid) return { success: false, error: dateValidation.errors.join(', ') };

    try {
      const rows = await this.client.runReport(propertyId, ['eventName'], ['activeUsers', 'sessions', 'totalUsers', 'screenPageViews', 'averageSessionDuration', 'engagementRate', 'eventsPerSession', 'conversions'], { startDate, endDate });
      const data = Ga4Mapper.toInternalMetricsBatch(rows, 'eventName');
      return { success: true, data };
    } catch (e: any) {
      this.log('error', 'fetch_conversions_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async sync(propertyId: string): Promise<Ga4ConnectorResult<Ga4SyncResult>> {
    const start = Date.now();
    this.log('info', 'sync_start', `Iniciando sincronização GA4 para propriedade ${propertyId}`);

    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dateRange = { startDate: thirtyDaysAgo, endDate: today };

    const pagesRes = await this.fetchPages(propertyId, thirtyDaysAgo, today);
    if (!pagesRes.success) return { success: false, error: pagesRes.error };

    const trafficRes = await this.fetchTrafficSources(propertyId, thirtyDaysAgo, today);
    if (!trafficRes.success) return { success: false, error: trafficRes.error };

    const eventsRes = await this.fetchEvents(propertyId, thirtyDaysAgo, today);
    if (!eventsRes.success) return { success: false, error: eventsRes.error };

    const allData = [...(pagesRes.data || []), ...(trafficRes.data || [])];
    const agg = Ga4Mapper.aggregateMetrics(allData);

    this.lastSync = new Date().toISOString();
    this.totalSessions = agg.total_sessions;
    this.totalUsers = agg.total_users;
    this.totalViews = agg.total_views;
    const duration = Date.now() - start;

    const result: Ga4SyncResult = {
      pages: pagesRes.data?.length || 0,
      traffic_sources: trafficRes.data?.length || 0,
      events: eventsRes.data?.length || 0,
      conversions: allData.reduce((s, i) => s + i.conversions, 0),
      total_sessions: agg.total_sessions,
      total_users: agg.total_users,
      total_views: agg.total_views,
      avg_engagement_rate: agg.avg_engagement_rate,
      avg_session_duration: agg.avg_session_duration,
      status: 'synced',
      synced_at: this.lastSync,
    };

    this.log('info', 'sync_complete', `Sincronização concluída: ${result.pages} páginas, ${result.traffic_sources} fontes`, { duration_ms: duration, records: result.pages + result.traffic_sources + result.events });

    return {
      success: true,
      data: result,
      cache_meta: {
        last_sync: this.lastSync,
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'google-analytics-4',
        status: 'valid',
        record_count: result.pages + result.traffic_sources + result.events,
      },
    };
  }

  getStatus(): Ga4Status {
    return {
      connected: this.isConnected,
      has_valid_token: this.config ? this.validator.validateToken(this.config) : false,
      property_id: this.config?.property_id || null,
      properties_count: 0,
      last_sync: this.lastSync,
      total_sessions: this.totalSessions,
      total_users: this.totalUsers,
      total_views: this.totalViews,
      cache_status: this.lastSync ? 'valid' : 'empty',
      errors: this.logs.filter(l => l.level === 'error').map(l => l.message),
      logs: [...this.logs],
    };
  }

  getInternalData(propertyId: string, startDate: string, endDate: string): InternalGa4Metrics[] {
    const pagesKey = `pages:${propertyId}:${startDate}:${endDate}`;
    const trafficKey = `traffic:${propertyId}:${startDate}:${endDate}`;
    const pData = this.syncCache.get(pagesKey)?.data || [];
    const tData = this.syncCache.get(trafficKey)?.data || [];
    return [...pData, ...tData];
  }
}
