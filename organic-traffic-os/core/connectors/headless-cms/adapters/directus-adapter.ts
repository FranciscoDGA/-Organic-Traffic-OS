import { HeadlessAdapter } from './headless-adapter.interface';

export class DirectusAdapter implements HeadlessAdapter {
  private baseUrl: string;
  private token: string;

  constructor(apiUrl: string, token: string) {
    this.baseUrl = apiUrl.replace(/\/+$/, '') + '/items';
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
      throw new Error(`Directus ${res.status}: ${text.substring(0, 200)}`);
    }
    return res.json();
  }

  async testConnection(): Promise<{ success: boolean; name?: string; error?: string }> {
    try {
      const res = await fetch(this.baseUrl.replace('/items', '/server/info'), {
        headers: { 'Authorization': `Bearer ${this.token}` },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { success: true, name: 'Directus' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async listCollections(): Promise<{ uid: string; name: string }[]> {
    const res = await fetch(this.baseUrl.replace('/items', '/collections'), {
      headers: { 'Authorization': `Bearer ${this.token}` },
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json();
    return (data.data || [])
      .filter((c: any) => !c.collection?.startsWith('directus_'))
      .map((c: any) => ({ uid: c.collection, name: c.meta?.name || c.collection }));
  }

  async listContent(collection: string, limit = 20): Promise<any[]> {
    const data = await this.request('GET', `/${collection}?limit=${limit}`);
    return data.data || [];
  }

  async getContentBySlug(collection: string, slug: string): Promise<any | null> {
    const data = await this.request('GET', `/${collection}?filter[slug][_eq]=${slug}&limit=1`);
    const items = data.data || [];
    return items.length > 0 ? items[0] : null;
  }

  async createContent(collection: string, data: Record<string, any>): Promise<any> {
    const result = await this.request('POST', `/${collection}`, data);
    return result.data;
  }

  async updateContent(collection: string, id: string, data: Record<string, any>): Promise<any> {
    const result = await this.request('PATCH', `/${collection}/${id}`, data);
    return result.data;
  }

  async publishContent(collection: string, id: string): Promise<any> {
    return this.updateContent(collection, id, { status: 'published' });
  }
}
