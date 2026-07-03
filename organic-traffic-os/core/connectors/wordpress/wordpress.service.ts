import { WpAuthConfig, WpSyncResult, WpPost, WpCategory, WpTag, PublicationPackage } from './wordpress.types';
import { WpClient } from './wordpress.client';
import { validateAuthConfig, validatePostPayload } from './wordpress.validator';
import { mapPackageToWpPayload, mapWpPostToPreview } from './wordpress.mapper';

export class WpService {
  private client: WpClient | null = null;
  private config: WpAuthConfig;
  private lastSyncResult: WpSyncResult | null = null;
  private connected = false;

  constructor(config: WpAuthConfig) {
    this.config = config;
  }

  async connect(): Promise<{ connected: boolean; site_name?: string }> {
    const validation = validateAuthConfig(this.config);
    if (!validation.valid) throw new Error(validation.error);

    this.client = new WpClient(this.config);
    const test = await this.client.testConnection();
    if (!test.success) throw new Error(test.error || 'Connection failed');
    this.connected = true;
    return { connected: true, site_name: test.site_name };
  }

  disconnect(): void {
    this.client = null;
    this.connected = false;
    this.lastSyncResult = null;
  }

  isConnected(): boolean {
    return this.connected && this.client !== null;
  }

  private ensureConnected(): void {
    if (!this.isConnected()) throw new Error('Not connected to WordPress');
  }

  async sync(): Promise<WpSyncResult> {
    this.ensureConnected();
    const logs: WpSyncResult['logs'] = [];
    const errors: string[] = [];
    const start = Date.now();

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'sync_start', message: `Syncing with ${this.config.site_url}` });

    const posts = await this.client!.listPosts(100);
    const categories = await this.client!.listCategories();
    const tags = await this.client!.listTags();

    const result: WpSyncResult = {
      site_url: this.config.site_url,
      connected: true,
      total_posts: posts.length,
      total_categories: categories.length,
      total_tags: tags.length,
      posts,
      categories,
      tags,
      errors,
      logs,
      timestamp: new Date().toISOString(),
    };

    this.lastSyncResult = result;
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'sync_complete', message: `Synced ${posts.length} posts, ${categories.length} categories, ${tags.length} tags`, duration_ms: Date.now() - start });
    return result;
  }

  async createDraft(pkg: PublicationPackage): Promise<{ id: number; slug: string; status: string; link: string }> {
    this.ensureConnected();
    const payload = mapPackageToWpPayload(pkg, 'draft');
    const validation = validatePostPayload(payload);
    if (!validation.valid) throw new Error(validation.error);

    const existing = await this.client!.getPostBySlug(payload.slug!);
    if (existing) throw new Error(`Slug "${payload.slug}" already exists (post #${existing.id}). Use update instead.`);

    const result = await this.client!.createPost(payload);
    return { id: result.id, slug: result.slug, status: result.status, link: result.link };
  }

  async updateDraft(postId: number, pkg: PublicationPackage): Promise<{ id: number; slug: string; status: string }> {
    this.ensureConnected();
    const payload = mapPackageToWpPayload(pkg, 'draft');
    const result = await this.client!.updatePost(postId, payload);
    return { id: result.id, slug: result.slug, status: result.status };
  }

  async publishPost(postId: number): Promise<{ id: number; status: string; link: string }> {
    this.ensureConnected();
    const result = await this.client!.updatePost(postId, { status: 'publish' });
    return { id: result.id, status: result.status, link: result.link };
  }

  async listPosts(perPage = 20): Promise<WpPost[]> {
    this.ensureConnected();
    return this.client!.listPosts(perPage);
  }

  async getPostBySlug(slug: string): Promise<WpPost | null> {
    this.ensureConnected();
    return this.client!.getPostBySlug(slug);
  }

  async listCategories(): Promise<WpCategory[]> {
    this.ensureConnected();
    return this.client!.listCategories();
  }

  async listTags(): Promise<WpTag[]> {
    this.ensureConnected();
    return this.client!.listTags();
  }

  getLastSyncResult(): WpSyncResult | null {
    return this.lastSyncResult;
  }
}
