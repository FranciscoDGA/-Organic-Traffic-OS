import { WpAuthConfig } from './wordpress.types';
import { validateAuthConfig } from './wordpress.validator';

export class WpClient {
  private config: WpAuthConfig;
  private baseUrl: string;
  private authHeader: string;

  constructor(config: WpAuthConfig) {
    this.config = config;
    this.baseUrl = `${config.site_url.replace(/\/+$/, '')}/wp-json/wp/v2`;
    this.authHeader = 'Basic ' + Buffer.from(`${config.username}:${config.app_password}`).toString('base64');
  }

  private async request(method: string, endpoint: string, body?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json',
        'User-Agent': 'OrganicTrafficOS/1.0 WordPress Connector',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`WP API ${res.status}: ${text.substring(0, 200)}`);
    }

    return res.json();
  }

  async testConnection(): Promise<{ success: boolean; site_name?: string; error?: string }> {
    try {
      const data = await this.request('GET', '/');
      return { success: true, site_name: data.name };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async listPosts(perPage = 20, page = 1): Promise<any[]> {
    return this.request('GET', `/posts?per_page=${perPage}&page=${page}&_fields=id,title,slug,status,date,modified,link,categories,tags`);
  }

  async getPost(postId: number): Promise<any> {
    return this.request('GET', `/posts/${postId}`);
  }

  async getPostBySlug(slug: string): Promise<any | null> {
    const posts = await this.request('GET', `/posts?slug=${slug}&per_page=1`);
    return posts.length > 0 ? posts[0] : null;
  }

  async createPost(payload: any): Promise<any> {
    return this.request('POST', '/posts', payload);
  }

  async updatePost(postId: number, payload: any): Promise<any> {
    return this.request('POST', `/posts/${postId}`, payload);
  }

  async deletePost(postId: number): Promise<any> {
    return this.request('DELETE', `/posts/${postId}?force=true`);
  }

  async listCategories(): Promise<any[]> {
    return this.request('GET', '/categories?per_page=100&_fields=id,name,slug,count');
  }

  async listTags(): Promise<any[]> {
    return this.request('GET', '/tags?per_page=100&_fields=id,name,slug,count');
  }
}
