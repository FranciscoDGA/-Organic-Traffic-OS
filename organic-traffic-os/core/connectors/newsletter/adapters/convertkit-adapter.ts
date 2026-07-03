import { NewsletterAdapter } from './newsletter-adapter.interface';

export class ConvertkitAdapter implements NewsletterAdapter {
  private apiKey: string;
  private apiSecret: string;

  constructor(apiKey: string, apiSecret?: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret || '';
  }

  private async request(method: string, endpoint: string, body?: any): Promise<any> {
    const res = await fetch(`https://api.convertkit.com/v3${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify({ ...body, api_key: this.apiKey }) : undefined,
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`ConvertKit ${res.status}: ${text.substring(0, 200)}`);
    }
    return res.json();
  }

  async testConnection(): Promise<{ success: boolean; name?: string; error?: string }> {
    try {
      await this.request('GET', '/account');
      return { success: true, name: 'ConvertKit' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async listAudiences(): Promise<{ id: string; name: string; count: number }[]> {
    const data = await this.request('GET', '/forms');
    return (data.forms || []).map((f: any) => ({ id: String(f.id), name: f.name, count: f.subscribers || 0 }));
  }

  async listCampaigns(limit = 20): Promise<any[]> {
    const data = await this.request('GET', `/broadcasts?limit=${limit}`);
    return (data.broadcasts || []).map((b: any) => ({ id: String(b.id), subject: b.subject, status: b.status, created_at: b.created_at }));
  }

  async createCampaign(data: Record<string, any>): Promise<any> {
    const result = await this.request('POST', '/broadcasts', data);
    return { id: String(result.broadcast?.id), ...data };
  }

  async updateCampaign(id: string, data: Record<string, any>): Promise<any> {
    await this.request('PUT', `/broadcasts/${id}`, data);
    return { id, ...data };
  }

  async getCampaign(id: string): Promise<any> {
    return this.request('GET', `/broadcasts/${id}`);
  }
}
