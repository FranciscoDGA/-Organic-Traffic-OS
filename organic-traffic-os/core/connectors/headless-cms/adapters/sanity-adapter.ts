import { HeadlessAdapter } from './headless-adapter.interface';

export class SanityAdapter implements HeadlessAdapter {
  private projectId: string;
  private dataset: string;
  private token: string;
  private apiVersion = '2024-01-01';

  constructor(projectId: string, token: string, dataset = 'production') {
    this.projectId = projectId;
    this.dataset = dataset;
    this.token = token;
  }

  private get baseUrl(): string {
    return `https://${this.projectId}.api.sanity.io/v${this.apiVersion}/data`;
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
      throw new Error(`Sanity ${res.status}: ${text.substring(0, 200)}`);
    }
    return res.json();
  }

  async testConnection(): Promise<{ success: boolean; name?: string; error?: string }> {
    try {
      const res = await fetch(`https://${this.projectId}.api.sanity.io/v${this.apiVersion}/data/query/${this.dataset}?query=*[_type=="_typeLimit"][0...5]`, {
        headers: { 'Authorization': `Bearer ${this.token}` },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { success: true, name: 'Sanity' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async listCollections(): Promise<{ uid: string; name: string }[]> {
    const data = await this.request('GET', `/query/${this.dataset}?query=*[_type=="_typeLimit"]{_type}`);
    return [
      { uid: 'posts', name: 'Posts' },
      { uid: 'pages', name: 'Pages' },
      { uid: 'articles', name: 'Articles' },
    ];
  }

  async listContent(collection: string, limit = 20): Promise<any[]> {
    const query = `*[_type=="${collection}"][0...${limit}]`;
    const data = await this.request('GET', `/query/${this.dataset}?query=${encodeURIComponent(query)}`);
    return (data.result || []).map((item: any) => ({
      id: item._id,
      slug: item.slug?.current || item.slug || '',
      title: item.title || item.Name || '',
      body: item.body ? JSON.stringify(item.body) : undefined,
      status: item.status || 'draft',
    }));
  }

  async getContentBySlug(collection: string, slug: string): Promise<any | null> {
    const query = `*[_type=="${collection}" && slug.current=="${slug}"][0]`;
    const data = await this.request('GET', `/query/${this.dataset}?query=${encodeURIComponent(query)}`);
    const item = data.result;
    if (!item) return null;
    return {
      id: item._id,
      slug: item.slug?.current || item.slug || '',
      title: item.title || item.Name || '',
      body: item.body ? JSON.stringify(item.body) : undefined,
      status: item.status || 'draft',
    };
  }

  async createContent(collection: string, data: Record<string, any>): Promise<any> {
    const doc = { _type: collection, ...data };
    const result = await this.request('POST', `/mutate/${this.dataset}?returnIds=true`, {
      mutations: [{ create: doc }],
    });
    return { id: result.results?.[0]?.id, ...data };
  }

  async updateContent(collection: string, id: string, data: Record<string, any>): Promise<any> {
    await this.request('POST', `/mutate/${this.dataset}`, {
      mutations: [{ patch: { id, set: data } }],
    });
    return { id, ...data };
  }

  async publishContent(collection: string, id: string): Promise<any> {
    await this.request('POST', `/mutate/${this.dataset}`, {
      mutations: [{ patch: { id, set: { status: 'published' } } }],
    });
    return { id, status: 'published' };
  }
}
