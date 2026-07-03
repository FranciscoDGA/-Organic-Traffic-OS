import { HeadlessAuthConfig, HeadlessCollection, HeadlessContent, HeadlessSyncResult, HeadlessCreatePayload, PublicationPackage } from './headless-cms.types';
import { HeadlessAdapter } from './adapters/headless-adapter.interface';
import { createAdapter } from './headless-cms.client';
import { validateAuthConfig, validateCreatePayload } from './headless-cms.validator';
import { mapPackageToHeadlessPayload, mapHeadlessContentToPreview } from './headless-cms.mapper';

export class HeadlessCmsService {
  private adapter: HeadlessAdapter | null = null;
  private config: HeadlessAuthConfig;
  private lastSyncResult: HeadlessSyncResult | null = null;
  private connected = false;

  constructor(config: HeadlessAuthConfig) {
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
    if (!this.isConnected()) throw new Error('Not connected to Headless CMS');
  }

  async sync(): Promise<HeadlessSyncResult> {
    this.ensureConnected();
    const logs: HeadlessSyncResult['logs'] = [];
    const errors: string[] = [];
    const start = Date.now();

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'sync_start', message: `Syncing with ${this.config.provider}` });

    const collections = await this.adapter!.listCollections();
    const allContent: HeadlessContent[] = [];

    for (const col of collections) {
      try {
        const items = await this.adapter!.listContent(col.uid, 50);
        allContent.push(...items.map(item => {
          const preview = mapHeadlessContentToPreview(item, this.config.provider);
          return { ...preview, collection: col.uid } as HeadlessContent;
        }));
      } catch (err: any) {
        errors.push(`Collection ${col.uid}: ${err.message}`);
      }
    }

    const result: HeadlessSyncResult = {
      provider: this.config.provider,
      connected: true,
      api_url: this.config.api_url,
      total_collections: collections.length,
      total_content: allContent.length,
      collections,
      content: allContent,
      errors,
      logs,
      timestamp: new Date().toISOString(),
    };

    this.lastSyncResult = result;
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'sync_complete', message: `Synced ${allContent.length} items from ${collections.length} collections`, duration_ms: Date.now() - start });
    return result;
  }

  async listCollections(): Promise<HeadlessCollection[]> {
    this.ensureConnected();
    return this.adapter!.listCollections();
  }

  async listContent(collection: string): Promise<HeadlessContent[]> {
    this.ensureConnected();
    const items = await this.adapter!.listContent(collection);
    return items.map(item => mapHeadlessContentToPreview(item, this.config.provider) as HeadlessContent);
  }

  async getContentBySlug(collection: string, slug: string): Promise<HeadlessContent | null> {
    this.ensureConnected();
    const item = await this.adapter!.getContentBySlug(collection, slug);
    return item ? mapHeadlessContentToPreview(item, this.config.provider) as HeadlessContent : null;
  }

  async createDraft(pkg: PublicationPackage, collection = 'posts'): Promise<{ id: string; slug: string; status: string }> {
    this.ensureConnected();
    const payload = mapPackageToHeadlessPayload(pkg, 'draft');
    const validation = validateCreatePayload(payload);
    if (!validation.valid) throw new Error(validation.error);

    const existing = await this.adapter!.getContentBySlug(collection, payload.slug!);
    if (existing) throw new Error(`Slug "${payload.slug}" already exists (id: ${existing.id}). Use update instead.`);

    const result = await this.adapter!.createContent(collection, payload);
    return { id: String(result.id || result._id), slug: payload.slug!, status: 'draft' };
  }

  async updateDraft(collection: string, id: string, pkg: PublicationPackage): Promise<{ id: string; slug: string; status: string }> {
    this.ensureConnected();
    const payload = mapPackageToHeadlessPayload(pkg, 'draft');
    const result = await this.adapter!.updateContent(collection, id, payload);
    return { id: String(result.id || result._id), slug: payload.slug!, status: 'draft' };
  }

  async publishContent(collection: string, id: string): Promise<{ id: string; status: string }> {
    this.ensureConnected();
    const result = await this.adapter!.publishContent(collection, id);
    return { id: String(result.id || id), status: 'published' };
  }

  getLastSyncResult(): HeadlessSyncResult | null {
    return this.lastSyncResult;
  }
}
