import { NewsletterAuthConfig, NewsletterPackage } from './newsletter.types';
import { NewsletterService } from './newsletter.service';

interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  durationMs: number;
}

export class NewsletterConnector {
  private service: NewsletterService | null = null;
  private config: NewsletterAuthConfig;

  constructor(config: NewsletterAuthConfig) {
    this.config = config;
  }

  async execute(action: string, params?: any): Promise<ExecutionResult> {
    const start = Date.now();
    try {
      let output: any;

      switch (action) {
        case 'connect':
          this.service = new NewsletterService(this.config);
          output = await this.service.connect();
          break;

        case 'disconnect':
          this.service?.disconnect();
          this.service = null;
          output = { disconnected: true };
          break;

        case 'sync':
          if (!this.service) this.service = new NewsletterService(this.config);
          output = await this.service.sync();
          break;

        case 'status':
          output = {
            connected: this.service?.isConnected() ?? false,
            provider: this.config.provider,
            last_sync: this.service?.getLastSyncResult()?.timestamp,
          };
          break;

        case 'createDraft':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.createDraftCampaign(params as NewsletterPackage);
          break;

        case 'updateDraft':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.updateDraftCampaign(params.id, params.nl);
          break;

        case 'audiences':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.listAudiences();
          break;

        case 'campaigns':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.listCampaigns();
          break;

        default:
          throw new Error(`Unknown action: ${action}`);
      }

      return { success: true, output, durationMs: Date.now() - start };
    } catch (err: any) {
      return { success: false, error: err.message, durationMs: Date.now() - start };
    }
  }
}
