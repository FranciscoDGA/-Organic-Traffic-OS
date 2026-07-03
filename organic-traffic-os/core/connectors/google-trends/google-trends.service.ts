import {
  GtConfig, GtInterestOverTime, GtInterestByRegion, GtRelatedQueries,
  GtRelatedTopics, GtSyncResult, GtCacheMeta, GtStatus, GtConnectorLog,
  GtConnectorResult, GtInternalData, GtSeasonality,
} from './google-trends.types';
import { GtValidator } from './google-trends.validator';
import { GtClient } from './google-trends.client';
import { GtMapper } from './google-trends.mapper';

export class GtService {
  private validator = new GtValidator();
  private client?: GtClient;
  private config?: GtConfig;
  private isConnected = false;
  private logs: GtConnectorLog[] = [];
  private syncCache: Map<string, { data: GtInternalData[]; meta: GtCacheMeta }> = new Map();
  private lastSync: string | null = null;
  private termsMonitored = 0;
  private totalInterestRecords = 0;
  private totalRelatedRecords = 0;

  private log(level: GtConnectorLog['level'], action: string, message: string, extra?: Partial<GtConnectorLog>) {
    this.logs.push({ timestamp: new Date().toISOString(), level, action, message, ...extra });
  }

  async connect(config: GtConfig): Promise<GtConnectorResult<boolean>> {
    const val = this.validator.validateConfig(config);
    if (!val.valid) {
      this.log('error', 'connect_validation_failed', val.errors.join(', '));
      return { success: false, error: val.errors.join(', ') };
    }
    this.config = { ...config };
    this.client = new GtClient(config);
    this.isConnected = true;
    this.log('info', 'connect_success', `Conectado em modo ${config.mode}`);
    return { success: true, data: true };
  }

  async disconnect(): Promise<GtConnectorResult<boolean>> {
    this.config = undefined;
    this.client = undefined;
    this.isConnected = false;
    this.syncCache.clear();
    this.lastSync = null;
    this.termsMonitored = 0;
    this.totalInterestRecords = 0;
    this.totalRelatedRecords = 0;
    this.log('info', 'disconnect', 'Desconectado com sucesso');
    return { success: true, data: true };
  }

  async fetchInterestOverTime(term: string, country = 'BR'): Promise<GtConnectorResult<GtInterestOverTime>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    const termVal = this.validator.validateTerm(term);
    if (!termVal.valid) return { success: false, error: termVal.errors.join(', ') };

    try {
      const result = await this.client.fetchInterestOverTime(term, country);
      const internal = GtMapper.toInternalInterestOverTime(result, country);
      const cacheKey = `iot:${term}:${country}`;
      const meta: GtCacheMeta = {
        last_sync: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'google-trends',
        status: 'valid',
        record_count: internal.length,
      };
      this.syncCache.set(cacheKey, { data: internal, meta });
      return { success: true, data: result, cache_meta: meta };
    } catch (e: any) {
      this.log('error', 'fetch_interest_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async fetchInterestByRegion(term: string, country = 'BR'): Promise<GtConnectorResult<GtInterestByRegion>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    try {
      const result = await this.client.fetchInterestByRegion(term, country);
      const internal = GtMapper.toInternalInterestByRegion(result, country);
      const cacheKey = `ibr:${term}:${country}`;
      const meta: GtCacheMeta = {
        last_sync: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'google-trends',
        status: 'valid',
        record_count: internal.length,
      };
      this.syncCache.set(cacheKey, { data: internal, meta });
      return { success: true, data: result, cache_meta: meta };
    } catch (e: any) {
      this.log('error', 'fetch_region_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async fetchRelatedQueries(term: string, country = 'BR'): Promise<GtConnectorResult<GtRelatedQueries>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    try {
      const result = await this.client.fetchRelatedQueries(term);
      const internal = GtMapper.toInternalRelatedQueries(result, country);
      const cacheKey = `rq:${term}:${country}`;
      const meta: GtCacheMeta = {
        last_sync: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'google-trends',
        status: 'valid',
        record_count: internal.length,
      };
      this.syncCache.set(cacheKey, { data: internal, meta });
      return { success: true, data: result, cache_meta: meta };
    } catch (e: any) {
      this.log('error', 'fetch_queries_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async fetchRelatedTopics(term: string, country = 'BR'): Promise<GtConnectorResult<GtRelatedTopics>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    try {
      const result = await this.client.fetchRelatedTopics(term);
      const internal = GtMapper.toInternalRelatedTopics(result, country);
      const cacheKey = `rt:${term}:${country}`;
      const meta: GtCacheMeta = {
        last_sync: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'google-trends',
        status: 'valid',
        record_count: internal.length,
      };
      this.syncCache.set(cacheKey, { data: internal, meta });
      return { success: true, data: result, cache_meta: meta };
    } catch (e: any) {
      this.log('error', 'fetch_topics_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async compareTerms(terms: string[], country = 'BR') {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    const termsVal = this.validator.validateTerms(terms);
    if (!termsVal.valid) return { success: false, error: termsVal.errors.join(', ') };

    try {
      const result = await this.client.compareTerms(terms, country);
      return { success: true, data: result };
    } catch (e: any) {
      this.log('error', 'compare_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async detectSeasonality(term: string, country = 'BR'): Promise<GtConnectorResult<GtSeasonality>> {
    if (!this.isConnected || !this.client) return { success: false, error: 'Não conectado' };
    try {
      const pattern = await this.client.detectSeasonality(term);
      const peakMonth = pattern.reduce((best, m) => m.avgValue > best.avgValue ? m : best, pattern[0]);
      const lowMonth = pattern.reduce((low, m) => m.avgValue < low.avgValue ? m : low, pattern[0]);
      const avgAll = pattern.reduce((s, m) => s + m.avgValue, 0) / pattern.length;
      const variance = pattern.reduce((s, m) => s + Math.pow(m.avgValue - avgAll, 2), 0) / pattern.length;
      const seasonalStrength = Math.min(100, Math.round(Math.sqrt(variance) * 2));
      const result: GtSeasonality = {
        term,
        pattern,
        peakMonth: peakMonth.month,
        lowMonth: lowMonth.month,
        seasonalStrength,
      };
      return { success: true, data: result };
    } catch (e: any) {
      this.log('error', 'seasonality_failed', e.message);
      return { success: false, error: e.message };
    }
  }

  async sync(terms: string[], country = 'BR'): Promise<GtConnectorResult<GtSyncResult>> {
    const start = Date.now();
    this.log('info', 'sync_start', `Sincronizando ${terms.length} termos (${country})`);

    let interestRecords = 0;
    let regionRecords = 0;
    let relatedQueriesRecords = 0;
    let relatedTopicsRecords = 0;

    for (const term of terms) {
      const iot = await this.fetchInterestOverTime(term, country);
      if (iot.success && iot.data) interestRecords += iot.data.timelineData.length;

      const ibr = await this.fetchInterestByRegion(term, country);
      if (ibr.success && ibr.data) regionRecords += ibr.data.regions.length;

      const rq = await this.fetchRelatedQueries(term, country);
      if (rq.success && rq.data) relatedQueriesRecords += rq.data.rising.length + rq.data.top.length;

      const rt = await this.fetchRelatedTopics(term, country);
      if (rt.success && rt.data) relatedTopicsRecords += rt.data.rising.length + rt.data.top.length;
    }

    this.lastSync = new Date().toISOString();
    this.termsMonitored = terms.length;
    this.totalInterestRecords = interestRecords;
    this.totalRelatedRecords = relatedQueriesRecords + relatedTopicsRecords;
    const duration = Date.now() - start;

    const result: GtSyncResult = {
      terms_analyzed: terms.length,
      interest_records: interestRecords,
      region_records: regionRecords,
      related_queries_records: relatedQueriesRecords,
      related_topics_records: relatedTopicsRecords,
      comparisons: 0,
      status: 'synced',
      synced_at: this.lastSync,
    };

    this.log('info', 'sync_complete', `Sincronização concluída: ${terms.length} termos`, { duration_ms: duration, records: interestRecords + regionRecords + relatedQueriesRecords + relatedTopicsRecords });

    return {
      success: true,
      data: result,
      cache_meta: {
        last_sync: this.lastSync,
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        source: 'google-trends',
        status: 'valid',
        record_count: interestRecords + regionRecords + relatedQueriesRecords + relatedTopicsRecords,
      },
    };
  }

  validateRequest(term: string): { valid: boolean; errors: string[] } {
    return this.validator.validateTerm(term);
  }

  getStatus(): GtStatus {
    return {
      connected: this.isConnected,
      mode: this.config?.mode || 'mock',
      terms_monitored: this.termsMonitored,
      last_sync: this.lastSync,
      total_interest_records: this.totalInterestRecords,
      total_related_records: this.totalRelatedRecords,
      cache_status: this.lastSync ? 'valid' : 'empty',
      errors: this.logs.filter(l => l.level === 'error').map(l => l.message),
      logs: [...this.logs],
    };
  }
}
