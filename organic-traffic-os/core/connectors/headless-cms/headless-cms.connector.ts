import { HeadlessAuthConfig, PublicationPackage } from './headless-cms.types';
import { HeadlessCmsService } from './headless-cms.service';

interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  durationMs: number;
}

export class HeadlessCmsConnector {
  private service: HeadlessCmsService | null = null;
  private config: HeadlessAuthConfig;

  constructor(config: HeadlessAuthConfig) {
    this.config = config;
  }

  async execute(action: string, params?: any): Promise<ExecutionResult> {
    const start = Date.now();
    try {
      let output: any;

      switch (action) {
        case 'connect':
          this.service = new HeadlessCmsService(this.config);
          output = await this.service.connect();
          break;

        case 'disconnect':
          this.service?.disconnect();
          this.service = null;
          output = { disconnected: true };
          break;

        case 'sync':
          if (!this.service) this.service = new HeadlessCmsService(this.config);
          output = await this.service.sync();
          break;

        case 'status':
          output = {
            connected: this.service?.isConnected() ?? false,
            provider: this.config.provider,
            api_url: this.config.api_url,
            last_sync: this.service?.getLastSyncResult()?.timestamp,
          };
          break;

        case 'createDraft':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.createDraft(params.pkg as PublicationPackage, params.collection);
          break;

        case 'updateDraft':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.updateDraft(params.collection, params.id, params.pkg);
          break;

        case 'publish':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.publishContent(params.collection, params.id);
          break;

        case 'collections':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.listCollections();
          break;

        case 'content':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.listContent(params.collection);
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
