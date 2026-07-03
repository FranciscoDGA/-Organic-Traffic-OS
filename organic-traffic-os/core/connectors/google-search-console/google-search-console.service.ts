import {
  GscAuthConfig, GscSite, InternalMetricsData, GscSyncResult,
  GscCacheMeta, GscStatus, GscConnectorLog, GscDimension, ConnectorResult,
} from './google-search-console.types';
import { GscValidator } from './google-search-console.validator';
import { GscClient } from './google-search-console.client';
import { GscMapper } from './google-search-console.mapper';

export class GscService {
  private validator = new GscValidator();
  private client?: GscClient;
  private config?: GscAuthConfig;
  private isConnected = false;
  private logs: GscConnectorLog[] = [];
  private syncCache: Map<string, { data: InternalMetricsData[]; meta: GscCacheMeta }> = new Map();
  private lastSync: string | null = null;
  private totalQueries = 0;
  private totalPages = 0;

  private log(level: GscConnectorLog['level'], action: string, message: string, extra?: Partial<GscConnectorLog>) {
    this.logs.push({ timestamp: new Date().toISOString(), level, action, message, ...extra });
  }

  getAuthorizationUrl(): string {
    if (!this.config) throw new Error('Config não inicializada. Chame connect() primeiro.');
    const client = new GscClient(this.config);
    return client.getAuthorizationUrl();
  }

  async handleOAuthCallback(code: string): Promise<ConnectorResult<boolean>> {
    if (!this.config) return { success: false, error: 'Config não inicializada' };
    try {
      this.client = new GscClient(this.config);
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

  async connect(config: GscAuthConfig): Promise<ConnectorResult<boolean>> {
    const val = this.validator.validateConfig(config);
    if (!val.valid) {
      this.log('error', 'connect_validation_failed', val.errors.join(', '));
      return { success: false, error: val.errors.join(', ') };
    }

    this.config = { ...config };
    this.client = new GscClient(config);
    this.isConnected = true;
    this.log('info', 'connect_success', 'Connector inicializado com sucesso');
    return { success: true, data: true };
  }

  async connectWithToken(accessToken: string, refreshToken?: string, expiresAt?: number): Promise<ConnectorResult<boolean>> {
    if (!this.config) return { success: false, error: 'Config não inicializada. Chame connect() primeiro.' };
    this.config.access_token = accessToken;
    if (refreshToken) this.config.refresh_token = refreshToken;
    if (expiresAt) this.config.expires_at = expiresAt;
    this.client = new GscClient(this.config);
    this.isConnected = true;
    this.log('info', 'connect_with_token', 'Conectado com token fornecido');
    return { success: true, data: true };
  }

  async disconnect(): Promise<ConnectorResult<boolean>> {
    this.config = undefined;
    this.client = undefined;
    this.isConnected = false;
    this.syncCache.clear();
    this.lastSync = null;
    this.totalQueries = 0;
    this.totalPages = 0;
    this.log('info', 'disconnect', 'Desconectado com sucesso');
    return { success: true, data: true };
  }

  async validateToken(): Promise<ConnectorResult<boolean>> {
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

  async listSites(): Promise<ConnectorResult<GscSite[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    try {
      const sites = await this.client.fetchSites();
      this.log('info', 'list_sites', `${sites.length} sites encontrados`);
      return { success: true, data: sites };
    } catch (e: any) {
      this.log('error', 'list_sites_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async fetchQueries(siteUrl: string, startDate: string, endDate: string): Promise<ConnectorResult<InternalMetricsData[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    const dateValidation = this.validator.validateDateRange(startDate, endDate);
    if (!dateValidation.valid) return { success: false, error: dateValidation.errors.join(', ') };

    try {
      const rows = await this.client.fetchAnalytics(siteUrl, 'query', startDate, endDate);
      const data = GscMapper.toInternalMetricsBatch(rows, 'query');
      const cacheKey = `queries:${siteUrl}:${startDate}:${endDate}`;
      const meta: GscCacheMeta = {
        last_sync: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'google-search-console',
        status: 'valid',
        record_count: data.length,
      };
      this.syncCache.set(cacheKey, { data, meta });
      this.totalQueries = data.length;
      return { success: true, data, cache_meta: meta };
    } catch (e: any) {
      this.log('error', 'fetch_queries_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async fetchPages(siteUrl: string, startDate: string, endDate: string): Promise<ConnectorResult<InternalMetricsData[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    const dateValidation = this.validator.validateDateRange(startDate, endDate);
    if (!dateValidation.valid) return { success: false, error: dateValidation.errors.join(', ') };

    try {
      const rows = await this.client.fetchAnalytics(siteUrl, 'page', startDate, endDate);
      const data = GscMapper.toInternalMetricsBatch(rows, 'page');
      const cacheKey = `pages:${siteUrl}:${startDate}:${endDate}`;
      const meta: GscCacheMeta = {
        last_sync: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'google-search-console',
        status: 'valid',
        record_count: data.length,
      };
      this.syncCache.set(cacheKey, { data, meta });
      this.totalPages = data.length;
      return { success: true, data, cache_meta: meta };
    } catch (e: any) {
      this.log('error', 'fetch_pages_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async fetchMetrics(siteUrl: string, startDate: string, endDate: string, dimension: GscDimension = 'query'): Promise<ConnectorResult<InternalMetricsData[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    const dateValidation = this.validator.validateDateRange(startDate, endDate);
    if (!dateValidation.valid) return { success: false, error: dateValidation.errors.join(', ') };

    try {
      const rows = await this.client.fetchAnalytics(siteUrl, dimension, startDate, endDate);
      const data = GscMapper.toInternalMetricsBatch(rows, dimension);
      return { success: true, data };
    } catch (e: any) {
      this.log('error', 'fetch_metrics_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async sync(siteUrl: string): Promise<ConnectorResult<GscSyncResult>> {
    const start = Date.now();
    this.log('info', 'sync_start', `Iniciando sincronização para ${siteUrl}`);

    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const queriesRes = await this.fetchQueries(siteUrl, thirtyDaysAgo, today);
    if (!queriesRes.success) {
      this.log('error', 'sync_queries_failed', queriesRes.error || 'Unknown error');
      return { success: false, error: queriesRes.error };
    }

    const pagesRes = await this.fetchPages(siteUrl, thirtyDaysAgo, today);
    if (!pagesRes.success) {
      this.log('error', 'sync_pages_failed', pagesRes.error || 'Unknown error');
      return { success: false, error: pagesRes.error };
    }

    const allData = [...(queriesRes.data || []), ...(pagesRes.data || [])];
    const agg = GscMapper.aggregateMetrics(allData);

    this.lastSync = new Date().toISOString();
    const duration = Date.now() - start;

    const result: GscSyncResult = {
      queries: queriesRes.data?.length || 0,
      pages: pagesRes.data?.length || 0,
      countries: 0,
      devices: 0,
      total_clicks: agg.total_clicks,
      total_impressions: agg.total_impressions,
      avg_ctr: agg.avg_ctr,
      avg_position: agg.avg_position,
      status: 'synced',
      synced_at: this.lastSync,
    };

    this.log('info', 'sync_complete', `Sincronização concluída: ${result.queries} queries, ${result.pages} pages`, { duration_ms: duration, records: result.queries + result.pages });

    return {
      success: true,
      data: result,
      cache_meta: {
        last_sync: this.lastSync,
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'google-search-console',
        status: 'valid',
        record_count: result.queries + result.pages,
      },
    };
  }

  getStatus(): GscStatus {
    return {
      connected: this.isConnected,
      has_valid_token: this.config ? this.validator.validateToken(this.config) : false,
      sites_count: 0,
      last_sync: this.lastSync,
      total_queries: this.totalQueries,
      total_pages: this.totalPages,
      cache_status: this.lastSync ? 'valid' : 'empty',
      errors: this.logs.filter(l => l.level === 'error').map(l => l.message),
      logs: [...this.logs],
    };
  }

  getInternalData(siteUrl: string, startDate: string, endDate: string): InternalMetricsData[] {
    const queriesKey = `queries:${siteUrl}:${startDate}:${endDate}`;
    const pagesKey = `pages:${siteUrl}:${startDate}:${endDate}`;
    const qData = this.syncCache.get(queriesKey)?.data || [];
    const pData = this.syncCache.get(pagesKey)?.data || [];
    return [...qData, ...pData];
  }
}
