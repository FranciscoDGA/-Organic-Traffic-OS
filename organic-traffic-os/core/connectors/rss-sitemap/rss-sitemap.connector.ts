import { RssSyncResult, RssAuthConfig } from './rss-sitemap.types';
import { RssSitemapService } from './rss-sitemap.service';
import { validateAuthConfig } from './rss-sitemap.validator';

interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  durationMs: number;
}

interface CoreError {
  code: string;
  message: string;
  details?: any;
}

export class RssSitemapConnector {
  private service: RssSitemapService | null = null;
  private config: RssAuthConfig;

  constructor(config: RssAuthConfig) {
    this.config = config;
  }

  async execute(action: string, params?: any): Promise<ExecutionResult> {
    const start = Date.now();
    try {
      let output: any;

      switch (action) {
        case 'connect':
          this.service = new RssSitemapService(this.config);
          const conn = await this.service.connect();
          output = { connected: conn.connected, feeds: conn.feeds };
          break;

        case 'disconnect':
          this.service?.disconnect();
          this.service = null;
          output = { disconnected: true };
          break;

        case 'sync':
          if (!this.service) this.service = new RssSitemapService(this.config);
          output = await this.service.sync();
          break;

        case 'status':
          output = this.service?.getLastSyncResult() || { connected: false, domain: this.config.domain };
          break;

        case 'urls':
          output = this.service?.getUrls() || [];
          break;

        default:
          throw new Error(`Unknown action: ${action}`);
      }

      return { success: true, output, durationMs: Date.now() - start };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
        durationMs: Date.now() - start,
      };
    }
  }
}
