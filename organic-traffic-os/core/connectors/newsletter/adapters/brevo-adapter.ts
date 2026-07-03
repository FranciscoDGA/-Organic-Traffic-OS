import { NewsletterAdapter } from './newsletter-adapter.interface';

export class BrevoAdapter implements NewsletterAdapter {
  private apiKey: string;
  private baseUrl = 'https://api.brevo.com/v3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(method: string, endpoint: string, body?: any): Promise<any> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'accept': 'application/json',
        'api-key': this.apiKey,
        'content-type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Brevo ${res.status}: ${text.substring(0, 200)}`);
    }
    return res.json();
  }

  async testConnection(): Promise<{ success: boolean; name?: string; error?: string }> {
    try {
      await this.request('GET', '/accounts');
      return { success: true, name: 'Brevo' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async listAudiences(): Promise<{ id: string; name: string; count: number }[]> {
    const data = await this.request('GET', '/contacts/lists?limit=100');
    return (data.lists || []).map((l: any) => ({ id: String(l.id), name: l.name, count: l.totalSubscribers || 0 }));
  }

  async listCampaigns(limit = 20): Promise<any[]> {
    const data = await this.request('GET', `/emailCampaigns?limit=${limit}`);
    return (data.campaigns || []).map((c: any) => ({ id: String(c.id), subject: c.subject, status: c.status, created_at: c.createdAt }));
  }

  async createCampaign(data: Record<string, any>): Promise<any> {
    const result = await this.request('POST', '/emailCampaigns', data);
    return { id: String(result.id), ...data };
  }

  async updateCampaign(id: string, data: Record<string, any>): Promise<any> {
    await this.request('PUT', `/emailCampaigns/${id}`, data);
    return { id, ...data };
  }

  async getCampaign(id: string): Promise<any> {
    return this.request('GET', `/emailCampaigns/${id}`);
  }
}
