import { NewsletterAdapter } from './newsletter-adapter.interface';

export class MailchimpAdapter implements NewsletterAdapter {
  private apiKey: string;
  private dc: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.dc = apiKey.split('-').pop() || 'us1';
    this.baseUrl = `https://${this.dc}.api.mailchimp.com/3.0`;
  }

  private async request(method: string, endpoint: string, body?: any): Promise<any> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `apikey ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Mailchimp ${res.status}: ${text.substring(0, 200)}`);
    }
    return res.json();
  }

  async testConnection(): Promise<{ success: boolean; name?: string; error?: string }> {
    try {
      await this.request('GET', '/ping');
      return { success: true, name: 'Mailchimp' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async listAudiences(): Promise<{ id: string; name: string; count: number }[]> {
    const data = await this.request('GET', '/lists?count=100');
    return (data.lists || []).map((l: any) => ({ id: l.id, name: l.name, count: l.member_count || 0 }));
  }

  async listCampaigns(limit = 20): Promise<any[]> {
    const data = await this.request('GET', `/campaigns?count=${limit}`);
    return (data.campaigns || []).map((c: any) => ({ id: c.id, subject: c.settings?.subject_line, status: c.status, created_at: c.created_at }));
  }

  async createCampaign(data: Record<string, any>): Promise<any> {
    const result = await this.request('POST', '/campaigns', data);
    return { id: result.id, ...data };
  }

  async updateCampaign(id: string, data: Record<string, any>): Promise<any> {
    await this.request('PATCH', `/campaigns/${id}`, data);
    return { id, ...data };
  }

  async getCampaign(id: string): Promise<any> {
    return this.request('GET', `/campaigns/${id}`);
  }
}
