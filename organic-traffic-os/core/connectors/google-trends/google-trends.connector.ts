import { BaseConnector } from '../base-connector';
import { ConnectorContext } from '../connector-context';
import { ConnectorResult } from '../connector-result';
import { CoreStatus } from '../../types';
import { GtService } from './google-trends.service';
import { GtConfig } from './google-trends.types';

export class GoogleTrendsConnector implements BaseConnector {
  id = 'google-trends';
  name = 'Google Trends';
  version = '1.0.0';
  status: CoreStatus = 'idle';
  private service = new GtService();

  getService(): GtService {
    return this.service;
  }

  async connect(ctx: ConnectorContext): Promise<ConnectorResult<boolean>> {
    this.status = 'running';
    const config = ctx.params as GtConfig;
    const start = Date.now();
    const result = await this.service.connect(config);
    this.status = result.success ? 'success' : 'fail';
    return { success: result.success, data: result.data, error: result.error ? { name: 'GtError', message: result.error, code: 'GT_CONNECT', layer: 'connectors' as const, recoverable: true, stack: '' } : undefined, durationMs: Date.now() - start };
  }

  validate(payload: any): boolean {
    return !!(payload?.mode && ['mock', 'api'].includes(payload.mode));
  }

  async execute(query: any, ctx: ConnectorContext): Promise<ConnectorResult<any>> {
    this.status = 'running';
    const { action, term, terms, country } = ctx.params || {};
    const start = Date.now();
    let result: { success: boolean; data?: any; error?: string };

    switch (action) {
      case 'fetchInterestOverTime': result = await this.service.fetchInterestOverTime(term, country); break;
      case 'fetchInterestByRegion': result = await this.service.fetchInterestByRegion(term, country); break;
      case 'fetchRelatedQueries': result = await this.service.fetchRelatedQueries(term, country); break;
      case 'fetchRelatedTopics': result = await this.service.fetchRelatedTopics(term, country); break;
      case 'compareTerms': result = await this.service.compareTerms(terms, country); break;
      case 'detectSeasonality': result = await this.service.detectSeasonality(term, country); break;
      case 'sync': result = await this.service.sync(terms, country); break;
      case 'status': result = { success: true, data: this.service.getStatus() }; break;
      default: result = { success: false, error: `Ação desconhecida: ${action}` };
    }

    this.status = result.success ? 'success' : 'fail';
    return { success: result.success, data: result.data, error: result.error ? { name: 'GtError', message: result.error, code: 'GT_EXEC', layer: 'connectors' as const, recoverable: true, stack: '' } : undefined, durationMs: Date.now() - start };
  }

  normalize(rawData: any): any {
    return rawData;
  }
}
