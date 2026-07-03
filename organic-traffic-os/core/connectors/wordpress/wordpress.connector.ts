import { WpAuthConfig, PublicationPackage } from './wordpress.types';
import { WpService } from './wordpress.service';

interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  durationMs: number;
}

export class WpConnector {
  private service: WpService | null = null;
  private config: WpAuthConfig;

  constructor(config: WpAuthConfig) {
    this.config = config;
  }

  async execute(action: string, params?: any): Promise<ExecutionResult> {
    const start = Date.now();
    try {
      let output: any;

      switch (action) {
        case 'connect':
          this.service = new WpService(this.config);
          const conn = await this.service.connect();
          output = conn;
          break;

        case 'disconnect':
          this.service?.disconnect();
          this.service = null;
          output = { disconnected: true };
          break;

        case 'sync':
          if (!this.service) this.service = new WpService(this.config);
          output = await this.service.sync();
          break;

        case 'status':
          output = {
            connected: this.service?.isConnected() ?? false,
            site_url: this.config.site_url,
            last_sync: this.service?.getLastSyncResult()?.timestamp,
          };
          break;

        case 'createDraft':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.createDraft(params as PublicationPackage);
          break;

        case 'updateDraft':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.updateDraft(params.postId, params.pkg);
          break;

        case 'publish':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.publishPost(params.postId);
          break;

        case 'posts':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.listPosts(params?.perPage || 20);
          break;

        case 'categories':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.listCategories();
          break;

        case 'tags':
          if (!this.service) throw new Error('Not connected');
          output = await this.service.listTags();
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
