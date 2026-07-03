import { HeadlessAdapter } from './headless-adapter.interface';

export class StrapiAdapter implements HeadlessAdapter {
  private baseUrl: string;
  private token: string;

  constructor(apiUrl: string, token: string) {
    this.baseUrl = apiUrl.replace(/\/+$/, '') + '/api';
    this.token = token;
  }

  private async request(method: string, endpoint: string, body?: any): Promise<any> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Strapi ${res.status}: ${text.substring(0, 200)}`);
    }
    return res.json();
  }

  async testConnection(): Promise<{ success: boolean; name?: string; error?: string }> {
    try {
      const data = await this.request('GET', '/content-type-builder/content-types');
      return { success: true, name: 'Strapi' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async listCollections(): Promise<{ uid: string; name: string }[]> {
    const data = await this.request('GET', '/content-type-builder/content-types');
    return (data.data || [])
      .filter((ct: any) => ct.schema?.kind === 'collectionType' && !ct.uid.startsWith('admin::'))
      .map((ct: any) => ({ uid: ct.uid, name: ct.info?.displayName || ct.uid }));
  }

  async listContent(collection: string, limit = 20): Promise<any[]> {
    const data = await this.request('GET', `/${collection}?pagination[pageSize]=${limit}`);
    return (data.data || []).map((item: any) => ({ id: item.id, ...item.attributes }));
  }

  async getContentBySlug(collection: string, slug: string): Promise<any | null> {
    const data = await this.request('GET', `/${collection}?filters[slug][$eq]=${slug}`);
    const items = data.data || [];
    return items.length > 0 ? { id: items[0].id, ...items[0].attributes } : null;
  }

  async createContent(collection: string, data: Record<string, any>): Promise<any> {
    const result = await this.request('POST', `/${collection}`, { data });
    return { id: result.data?.id, ...result.data?.attributes };
  }

  async updateContent(collection: string, id: string, data: Record<string, any>): Promise<any> {
    const result = await this.request('PUT', `/${collection}/${id}`, { data });
    return { id: result.data?.id, ...result.data?.attributes };
  }

  async publishContent(collection: string, id: string): Promise<any> {
    return this.updateContent(collection, id, { status: 'published' });
  }
}
