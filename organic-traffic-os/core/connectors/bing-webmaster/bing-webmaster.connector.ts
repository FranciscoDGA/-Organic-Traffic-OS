import { BaseConnector } from '../base-connector';
import { ConnectorContext } from '../connector-context';
import { ConnectorResult } from '../connector-result';
import { CoreStatus } from '../../types';
import { BwService } from './bing-webmaster.service';
import { BwAuthConfig } from './bing-webmaster.types';

export class BingWebmasterConnector implements BaseConnector {
  id = 'bing-webmaster';
  name = 'Bing Webmaster Tools';
  version = '1.0.0';
  status: CoreStatus = 'idle';
  private service = new BwService();

  getService(): BwService {
    return this.service;
  }

  async connect(ctx: ConnectorContext): Promise<ConnectorResult<boolean>> {
    this.status = 'running';
    const config = ctx.params as BwAuthConfig;
    const start = Date.now();
    const result = await this.service.connect(config);
    this.status = result.success ? 'success' : 'fail';
    return { success: result.success, data: result.data, error: result.error ? { name: 'BwError', message: result.error, code: 'BW_CONNECT', layer: 'connectors' as const, recoverable: true, stack: '' } : undefined, durationMs: Date.now() - start };
  }

  validate(payload: any): boolean {
    return !!(payload?.api_key);
  }

  async execute(query: any, ctx: ConnectorContext): Promise<ConnectorResult<any>> {
    this.status = 'running';
    const { action, siteUrl, startDate, endDate } = ctx.params || {};
    const start = Date.now();
    let result: { success: boolean; data?: any; error?: string };

    switch (action) {
      case 'listSites': result = await this.service.listSites(); break;
      case 'fetchQueries': result = await this.service.fetchQueries(siteUrl, startDate, endDate); break;
      case 'fetchPages': result = await this.service.fetchPages(siteUrl, startDate, endDate); break;
      case 'fetchCrawlErrors': result = await this.service.fetchCrawlErrors(siteUrl); break;
      case 'fetchIndexingStatus': result = await this.service.fetchIndexingStatus(siteUrl); break;
      case 'sync': result = await this.service.sync(siteUrl); break;
      case 'status': result = { success: true, data: this.service.getStatus() }; break;
      default: result = { success: false, error: `Ação desconhecida: ${action}` };
    }

    this.status = result.success ? 'success' : 'fail';
    return { success: result.success, data: result.data, error: result.error ? { name: 'BwError', message: result.error, code: 'BW_EXEC', layer: 'connectors' as const, recoverable: true, stack: '' } : undefined, durationMs: Date.now() - start };
  }

  normalize(rawData: any): any {
    return rawData;
  }
}
