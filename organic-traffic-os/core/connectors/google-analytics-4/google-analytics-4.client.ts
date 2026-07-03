import { Ga4AuthConfig, Ga4Property, Ga4ApiRow, Ga4ConnectorLog } from './google-analytics-4.types';

const OAUTH_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GA4_API_BASE = 'https://analyticsadmin.googleapis.com/v1alpha';
const GA4_DATA_API = 'https://analyticsdata.googleapis.com/v1beta';

export class Ga4Client {
  private config: Ga4AuthConfig;
  private logs: Ga4ConnectorLog[] = [];

  constructor(config: Ga4AuthConfig) {
    this.config = { ...config };
  }

  getLogs(): Ga4ConnectorLog[] {
    return this.logs;
  }

  private log(level: Ga4ConnectorLog['level'], action: string, message: string, extra?: Partial<Ga4ConnectorLog>) {
    this.logs.push({ timestamp: new Date().toISOString(), level, action, message, ...extra });
  }

  getAuthorizationUrl(): string {
    const state = Math.random().toString(36).substring(2);
    const params = new URLSearchParams({
      client_id: this.config.client_id,
      redirect_uri: this.config.redirect_uri,
      response_type: 'code',
      scope: this.config.scope || 'https://www.googleapis.com/auth/analytics.readonly',
      access_type: 'offline',
      prompt: 'consent',
      state,
    });
    return `${OAUTH_AUTHORIZE_URL}?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    this.log('info', 'exchange_code', 'Trocando code por token de acesso');
    const start = Date.now();

    try {
      const res = await fetch(OAUTH_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: this.config.client_id,
          client_secret: this.config.client_secret,
          redirect_uri: this.config.redirect_uri,
          grant_type: 'authorization_code',
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        this.log('error', 'exchange_code_failed', `Falha ao trocar code: ${res.status}`, { duration_ms: Date.now() - start });
        throw new Error(`OAuth token exchange failed: ${res.status} ${err}`);
      }

      const data = await res.json();
      this.config.access_token = data.access_token;
      this.config.refresh_token = data.refresh_token;
      this.config.expires_at = Date.now() + data.expires_in * 1000;
      this.log('info', 'exchange_code_success', `Token obtido. Expira em ${data.expires_in}s`, { duration_ms: Date.now() - start });
      return data;
    } catch (e: any) {
      this.log('error', 'exchange_code_error', e.message, { duration_ms: Date.now() - start });
      throw e;
    }
  }

  async refreshTokenIfNeeded(): Promise<void> {
    if (!this.config.refresh_token) return;
    if (this.config.expires_at && Date.now() < this.config.expires_at - 60000) return;

    this.log('info', 'refresh_token', 'Token expirado ou prestes a expirar. Fazendo refresh...');
    const start = Date.now();

    try {
      const res = await fetch(OAUTH_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.config.client_id,
          client_secret: this.config.client_secret,
          refresh_token: this.config.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);

      const data = await res.json();
      this.config.access_token = data.access_token;
      this.config.expires_at = Date.now() + (data.expires_in || 3600) * 1000;
      this.log('info', 'refresh_token_success', 'Token atualizado com sucesso', { duration_ms: Date.now() - start });
    } catch (e: any) {
      this.log('error', 'refresh_token_failed', e.message, { duration_ms: Date.now() - start });
      throw e;
    }
  }

  private async ga4Fetch<T>(url: string): Promise<T> {
    await this.refreshTokenIfNeeded();
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.config.access_token}` },
    });
    if (!res.ok) throw new Error(`GA4 API error: ${res.status} ${await res.text()}`);
    return res.json();
  }

  private async ga4Post<T>(url: string, body: any): Promise<T> {
    await this.refreshTokenIfNeeded();
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`GA4 API error: ${res.status} ${await res.text()}`);
    return res.json();
  }

  async fetchProperties(): Promise<Ga4Property[]> {
    this.log('info', 'fetch_properties', 'Buscando propriedades GA4');
    const start = Date.now();
    try {
      const data = await this.ga4Fetch<{ accountSummaries?: any[] }>(`${GA4_API_BASE}/accountSummaries`);
      const properties: Ga4Property[] = [];
      for (const account of data.accountSummaries || []) {
        for (const prop of account.propertySummaries || []) {
          properties.push({
            name: prop.property || '',
            propertyId: prop.property?.split('/')?.pop() || '',
            displayName: prop.displayName || '',
            createTime: '',
            updateTime: '',
            parent: account.name || '',
            serviceLevel: prop.serviceLevel || '',
            currencyCode: '',
            timeZone: '',
          });
        }
      }
      this.log('info', 'fetch_properties_success', `${properties.length} propriedades encontradas`, { duration_ms: Date.now() - start, records: properties.length });
      return properties;
    } catch (e: any) {
      this.log('error', 'fetch_properties_failed', e.message, { duration_ms: Date.now() - start });
      throw e;
    }
  }

  async runReport(propertyId: string, dimensions: string[], metrics: string[], dateRange: { startDate: string; endDate: string }, limit = 10000): Promise<Ga4ApiRow[]> {
    this.log('info', 'run_report', `Executando relatório GA4 [${dimensions.join(',')}]`, { data: { propertyId, dateRange } });
    const start = Date.now();
    try {
      const data = await this.ga4Post<{ rows?: Ga4ApiRow[] }>(
        `${GA4_DATA_API}/properties/${propertyId}:runReport`,
        {
          dateRanges: [dateRange],
          dimensions: dimensions.map(d => ({ name: d })),
          metrics: metrics.map(m => ({ name: m })),
          limit,
        }
      );
      const rows = data.rows || [];
      this.log('info', 'run_report_success', `${rows.length} registros obtidos`, { duration_ms: Date.now() - start, records: rows.length });
      return rows;
    } catch (e: any) {
      this.log('error', 'run_report_failed', e.message, { duration_ms: Date.now() - start });
      throw e;
    }
  }

  getConfig(): Ga4AuthConfig {
    return { ...this.config };
  }
}
