import {
  BwAuthConfig, BwSite, InternalBwMetrics, BwCrawlError, BwIndexingStatus,
  BwSyncResult, BwCacheMeta, BwStatus, BwConnectorLog, BwConnectorResult,
} from './bing-webmaster.types';
import { BwValidator } from './bing-webmaster.validator';
import { BwClient } from './bing-webmaster.client';
import { BwMapper } from './bing-webmaster.mapper';

export class BwService {
  private validator = new BwValidator();
  private client?: BwClient;
  private config?: BwAuthConfig;
  private isConnected = false;
  private logs: BwConnectorLog[] = [];
  private syncCache: Map<string, { data: InternalBwMetrics[]; meta: BwCacheMeta }> = new Map();
  private lastSync: string | null = null;
  private totalQueries = 0;
  private totalPages = 0;

  private log(level: BwConnectorLog['level'], action: string, message: string, extra?: Partial<BwConnectorLog>) {
    this.logs.push({ timestamp: new Date().toISOString(), level, action, message, ...extra });
  }

  async connect(config: BwAuthConfig): Promise<BwConnectorResult<boolean>> {
    const val = this.validator.validateConfig(config);
    if (!val.valid) {
      this.log('error', 'connect_validation_failed', val.errors.join(', '));
      return { success: false, error: val.errors.join(', ') };
    }
    this.config = { ...config };
    this.client = new BwClient(config);
    this.isConnected = true;
    this.log('info', 'connect_success', 'Connector Bing Webmaster inicializado');
    return { success: true, data: true };
  }

  async disconnect(): Promise<BwConnectorResult<boolean>> {
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

  async validateCredentials(): Promise<BwConnectorResult<boolean>> {
    if (!this.isConnected || !this.client || !this.config) {
      return { success: false, error: 'Não conectado' };
    }
    const valid = this.validator.validateApiKey(this.config);
    this.log('info', 'validate_credentials', valid ? 'Credenciais válidas' : 'Credenciais inválidas');
    return { success: true, data: valid };
  }

  async listSites(): Promise<BwConnectorResult<BwSite[]>> {
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

  async fetchQueries(siteUrl: string, startDate: string, endDate: string): Promise<BwConnectorResult<InternalBwMetrics[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    const dateValidation = this.validator.validateDateRange(startDate, endDate);
    if (!dateValidation.valid) return { success: false, error: dateValidation.errors.join(', ') };

    try {
      const rows = await this.client.fetchQueries(siteUrl, startDate, endDate);
      const data = BwMapper.toInternalMetricsBatch(rows, 'query');
      const cacheKey = `queries:${siteUrl}:${startDate}:${endDate}`;
      const meta: BwCacheMeta = {
        last_sync: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'bing-webmaster',
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

  async fetchPages(siteUrl: string, startDate: string, endDate: string): Promise<BwConnectorResult<InternalBwMetrics[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    const dateValidation = this.validator.validateDateRange(startDate, endDate);
    if (!dateValidation.valid) return { success: false, error: dateValidation.errors.join(', ') };

    try {
      const rows = await this.client.fetchPages(siteUrl, startDate, endDate);
      const data = BwMapper.toInternalMetricsBatch(rows, 'page');
      const cacheKey = `pages:${siteUrl}:${startDate}:${endDate}`;
      const meta: BwCacheMeta = {
        last_sync: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'bing-webmaster',
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

  async fetchSearchMetrics(siteUrl: string, startDate: string, endDate: string): Promise<BwConnectorResult<InternalBwMetrics[]>> {
    return this.fetchQueries(siteUrl, startDate, endDate);
  }

  async fetchCrawlErrors(siteUrl: string): Promise<BwConnectorResult<BwCrawlError[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    try {
      const errors = await this.client.fetchCrawlErrors(siteUrl);
      this.log('info', 'fetch_crawl_errors', `${errors.length} erros encontrados`);
      return { success: true, data: errors };
    } catch (e: any) {
      this.log('error', 'fetch_crawl_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async fetchIndexingStatus(siteUrl: string): Promise<BwConnectorResult<BwIndexingStatus[]>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    try {
      const status = await this.client.fetchIndexingStatus(siteUrl);
      this.log('info', 'fetch_indexing', `${status.length} páginas encontradas`);
      return { success: true, data: status };
    } catch (e: any) {
      this.log('error', 'fetch_indexing_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async sync(siteUrl: string): Promise<BwConnectorResult<BwSyncResult>> {
    const start = Date.now();
    this.log('info', 'sync_start', `Iniciando sincronização para ${siteUrl}`);

    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const queriesRes = await this.fetchQueries(siteUrl, thirtyDaysAgo, today);
    if (!queriesRes.success) return { success: false, error: queriesRes.error };

    const pagesRes = await this.fetchPages(siteUrl, thirtyDaysAgo, today);
    if (!pagesRes.success) return { success: false, error: pagesRes.error };

    const crawlErrors = await this.fetchCrawlErrors(siteUrl);
    const indexing = await this.fetchIndexingStatus(siteUrl);

    const allData = [...(queriesRes.data || []), ...(pagesRes.data || [])];
    const agg = BwMapper.aggregateMetrics(allData);
    const indexedCount = (indexing.data || []).filter(i => i.status === 'indexed').length;

    this.lastSync = new Date().toISOString();
    const duration = Date.now() - start;

    const result: BwSyncResult = {
      queries: queriesRes.data?.length || 0,
      pages: pagesRes.data?.length || 0,
      crawl_errors: crawlErrors.data?.length || 0,
      indexed_pages: indexedCount,
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
        source: 'bing-webmaster',
        status: 'valid',
        record_count: result.queries + result.pages,
      },
    };
  }

  getStatus(): BwStatus {
    return {
      connected: this.isConnected,
      has_valid_key: this.config ? this.validator.validateApiKey(this.config) : false,
      sites_count: 0,
      last_sync: this.lastSync,
      total_queries: this.totalQueries,
      total_pages: this.totalPages,
      cache_status: this.lastSync ? 'valid' : 'empty',
      errors: this.logs.filter(l => l.level === 'error').map(l => l.message),
      logs: [...this.logs],
    };
  }
}
