import { NewsletterAdapter } from './newsletter-adapter.interface';

export class ResendAdapter implements NewsletterAdapter {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(method: string, endpoint: string, body?: any): Promise<any> {
    const res = await fetch(`https://api.resend.com${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Resend ${res.status}: ${text.substring(0, 200)}`);
    }
    return res.json();
  }

  async testConnection(): Promise<{ success: boolean; name?: string; error?: string }> {
    try {
      await this.request('GET', '/domains');
      return { success: true, name: 'Resend' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async listAudiences(): Promise<{ id: string; name: string; count: number }[]> {
    const data = await this.request('GET', '/audiences');
    return (data.data || []).map((a: any) => ({ id: a.id, name: a.name, count: a.created_at ? 1 : 0 }));
  }

  async listCampaigns(): Promise<any[]> {
    return [];
  }

  async createCampaign(data: Record<string, any>): Promise<any> {
    return this.request('POST', '/emails', data);
  }

  async updateCampaign(id: string, data: Record<string, any>): Promise<any> {
    throw new Error('Resend does not support draft campaigns');
  }

  async getCampaign(id: string): Promise<any> {
    return this.request('GET', `/emails/${id}`);
  }
}
