import { BaseConnector } from '../base-connector';
import { ConnectorContext } from '../connector-context';
import { ConnectorResult } from '../connector-result';
import { CoreStatus } from '../../types';
import { GscService } from './google-search-console.service';
import { GscAuthConfig } from './google-search-console.types';

export class GoogleSearchConsoleConnector implements BaseConnector {
  id = 'google-search-console';
  name = 'Google Search Console';
  version = '1.0.0';
  status: CoreStatus = 'idle';
  private service = new GscService();

  getService(): GscService {
    return this.service;
  }

  async connect(ctx: ConnectorContext): Promise<ConnectorResult<boolean>> {
    this.status = 'running';
    const config = ctx.params as GscAuthConfig;
    const start = Date.now();
    const result = await this.service.connect(config);
    this.status = result.success ? 'success' : 'fail';
    return { success: result.success, data: result.data, error: result.error ? { name: 'GscError', message: result.error, code: 'GSC_CONNECT', layer: 'connectors' as const, recoverable: true, stack: '' } : undefined, durationMs: Date.now() - start };
  }

  validate(payload: any): boolean {
    return !!(payload?.client_id && payload?.client_secret && payload?.redirect_uri);
  }

  async execute(query: any, ctx: ConnectorContext): Promise<ConnectorResult<any>> {
    this.status = 'running';
    const { action, siteUrl, startDate, endDate, dimension } = ctx.params || {};
    const start = Date.now();
    let result: { success: boolean; data?: any; error?: string };

    switch (action) {
      case 'listSites': result = await this.service.listSites(); break;
      case 'fetchQueries': result = await this.service.fetchQueries(siteUrl, startDate, endDate); break;
      case 'fetchPages': result = await this.service.fetchPages(siteUrl, startDate, endDate); break;
      case 'fetchMetrics': result = await this.service.fetchMetrics(siteUrl, startDate, endDate, dimension); break;
      case 'sync': result = await this.service.sync(siteUrl); break;
      case 'status': result = { success: true, data: this.service.getStatus() }; break;
      default: result = { success: false, error: `Ação desconhecida: ${action}` };
    }

    this.status = result.success ? 'success' : 'fail';
    return { success: result.success, data: result.data, error: result.error ? { name: 'GscError', message: result.error, code: 'GSC_EXEC', layer: 'connectors' as const, recoverable: true, stack: '' } : undefined, durationMs: Date.now() - start };
  }

  normalize(rawData: any): any {
    return rawData;
  }
}
