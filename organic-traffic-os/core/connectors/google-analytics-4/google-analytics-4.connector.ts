import { BaseConnector } from '../base-connector';
import { ConnectorContext } from '../connector-context';
import { ConnectorResult } from '../connector-result';
import { CoreStatus } from '../../types';
import { Ga4Service } from './google-analytics-4.service';
import { Ga4AuthConfig } from './google-analytics-4.types';

export class GoogleAnalytics4Connector implements BaseConnector {
  id = 'google-analytics-4';
  name = 'Google Analytics 4';
  version = '1.0.0';
  status: CoreStatus = 'idle';
  private service = new Ga4Service();

  getService(): Ga4Service {
    return this.service;
  }

  async connect(ctx: ConnectorContext): Promise<ConnectorResult<boolean>> {
    this.status = 'running';
    const config = ctx.params as Ga4AuthConfig;
    const start = Date.now();
    const result = await this.service.connect(config);
    this.status = result.success ? 'success' : 'fail';
    return { success: result.success, data: result.data, error: result.error ? { name: 'Ga4Error', message: result.error, code: 'GA4_CONNECT', layer: 'connectors' as const, recoverable: true, stack: '' } : undefined, durationMs: Date.now() - start };
  }

  validate(payload: any): boolean {
    return !!(payload?.client_id && payload?.client_secret && payload?.redirect_uri);
  }

  async execute(query: any, ctx: ConnectorContext): Promise<ConnectorResult<any>> {
    this.status = 'running';
    const { action, propertyId, startDate, endDate } = ctx.params || {};
    const start = Date.now();
    let result: { success: boolean; data?: any; error?: string };

    switch (action) {
      case 'listProperties': result = await this.service.listProperties(); break;
      case 'fetchPages': result = await this.service.fetchPages(propertyId, startDate, endDate); break;
      case 'fetchTrafficSources': result = await this.service.fetchTrafficSources(propertyId, startDate, endDate); break;
      case 'fetchEngagementMetrics': result = await this.service.fetchEngagementMetrics(propertyId, startDate, endDate); break;
      case 'fetchEvents': result = await this.service.fetchEvents(propertyId, startDate, endDate); break;
      case 'fetchConversions': result = await this.service.fetchConversions(propertyId, startDate, endDate); break;
      case 'sync': result = await this.service.sync(propertyId); break;
      case 'status': result = { success: true, data: this.service.getStatus() }; break;
      default: result = { success: false, error: `Ação desconhecida: ${action}` };
    }

    this.status = result.success ? 'success' : 'fail';
    return { success: result.success, data: result.data, error: result.error ? { name: 'Ga4Error', message: result.error, code: 'GA4_EXEC', layer: 'connectors' as const, recoverable: true, stack: '' } : undefined, durationMs: Date.now() - start };
  }

  normalize(rawData: any): any {
    return rawData;
  }
}
