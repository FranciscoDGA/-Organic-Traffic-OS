import { NewsletterAuthConfig, NewsletterAudience, NewsletterCampaign, NewsletterSyncResult, NewsletterPackage } from './newsletter.types';
import { NewsletterAdapter } from './adapters/newsletter-adapter.interface';
import { createAdapter } from './newsletter.client';
import { validateAuthConfig, validateCampaignPayload } from './newsletter.validator';
import { mapPublicationToNewsletterPackage } from './newsletter.mapper';

export class NewsletterService {
  private adapter: NewsletterAdapter | null = null;
  private config: NewsletterAuthConfig;
  private lastSyncResult: NewsletterSyncResult | null = null;
  private connected = false;

  constructor(config: NewsletterAuthConfig) {
    this.config = config;
  }

  async connect(): Promise<{ connected: boolean; provider: string; name?: string }> {
    const validation = validateAuthConfig(this.config);
    if (!validation.valid) throw new Error(validation.error);

    this.adapter = createAdapter(this.config);
    const test = await this.adapter.testConnection();
    if (!test.success) throw new Error(test.error || 'Connection failed');
    this.connected = true;
    return { connected: true, provider: this.config.provider, name: test.name };
  }

  disconnect(): void {
    this.adapter = null;
    this.connected = false;
    this.lastSyncResult = null;
  }

  isConnected(): boolean {
    return this.connected && this.adapter !== null;
  }

  private ensureConnected(): void {
    if (!this.isConnected()) throw new Error('Not connected to Newsletter provider');
  }

  async sync(): Promise<NewsletterSyncResult> {
    this.ensureConnected();
    const logs: NewsletterSyncResult['logs'] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    const start = Date.now();

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'sync_start', message: `Syncing with ${this.config.provider}` });

    const audiences = await this.adapter!.listAudiences();
    const campaigns = await this.adapter!.listCampaigns(100);

    const result: NewsletterSyncResult = {
      provider: this.config.provider,
      connected: true,
      total_audiences: audiences.length,
      total_campaigns: campaigns.length,
      audiences,
      campaigns,
      errors,
      warnings,
      logs,
      timestamp: new Date().toISOString(),
    };

    this.lastSyncResult = result;
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'sync_complete', message: `Synced ${audiences.length} audiences, ${campaigns.length} campaigns`, duration_ms: Date.now() - start });
    return result;
  }

  async listAudiences(): Promise<NewsletterAudience[]> {
    this.ensureConnected();
    return this.adapter!.listAudiences();
  }

  async listCampaigns(): Promise<NewsletterCampaign[]> {
    this.ensureConnected();
    return this.adapter!.listCampaigns(50);
  }

  async createDraftCampaign(nl: NewsletterPackage): Promise<{ id: string; subject: string; status: string }> {
    this.ensureConnected();
    const validation = validateCampaignPayload(nl);
    if (!validation.valid) throw new Error(validation.error);

    const result = await this.adapter!.createCampaign({
      subject: nl.subject,
      preheader: nl.preheader,
      title: nl.title,
      intro: nl.intro,
      body_html: nl.body_html,
      body_text: nl.body_text,
      cta: nl.cta,
      audience: nl.audience,
    });
    return { id: String(result.id), subject: nl.subject, status: 'draft' };
  }

  async updateDraftCampaign(id: string, nl: NewsletterPackage): Promise<{ id: string; subject: string; status: string }> {
    this.ensureConnected();
    const result = await this.adapter!.updateCampaign(id, {
      subject: nl.subject,
      preheader: nl.preheader,
      body_html: nl.body_html,
      body_text: nl.body_text,
      cta: nl.cta,
    });
    return { id, subject: nl.subject, status: 'draft' };
  }

  getLastSyncResult(): NewsletterSyncResult | null {
    return this.lastSyncResult;
  }
}
