import { GscAuthConfig, GscSite, GscApiRow, GscOAuthState, GscConnectorLog } from './google-search-console.types';

const OAUTH_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GSC_API_BASE = 'https://www.googleapis.com/webmasters/v3';
const GSC_API_ANALYTICS = 'https://searchconsole.googleapis.com/webmasters/v3';

export class GscClient {
  private config: GscAuthConfig;
  private logs: GscConnectorLog[] = [];

  constructor(config: GscAuthConfig) {
    this.config = { ...config };
  }

  getLogs(): GscConnectorLog[] {
    return this.logs;
  }

  private log(level: GscConnectorLog['level'], action: string, message: string, extra?: Partial<GscConnectorLog>) {
    this.logs.push({ timestamp: new Date().toISOString(), level, action, message, ...extra });
  }

  getAuthorizationUrl(): string {
    const state = Math.random().toString(36).substring(2);
    const params = new URLSearchParams({
      client_id: this.config.client_id,
      redirect_uri: this.config.redirect_uri,
      response_type: 'code',
      scope: this.config.scope || 'https://www.googleapis.com/auth/webmasters.readonly',
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

  private async gscFetch<T>(url: string): Promise<T> {
    await this.refreshTokenIfNeeded();
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.config.access_token}` },
    });
    if (!res.ok) throw new Error(`GSC API error: ${res.status} ${await res.text()}`);
    return res.json();
  }

  private async gscPost<T>(url: string, body: any): Promise<T> {
    await this.refreshTokenIfNeeded();
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`GSC API error: ${res.status} ${await res.text()}`);
    return res.json();
  }

  async fetchSites(): Promise<GscSite[]> {
    this.log('info', 'fetch_sites', 'Buscando sites do Google Search Console');
    const start = Date.now();
    try {
      const data = await this.gscFetch<{ siteEntry?: { siteUrl: string; permissionLevel: string }[] }>(`${GSC_API_BASE}/sites`);
      const sites = (data.siteEntry || []).map(s => ({ siteUrl: s.siteUrl, permissionLevel: s.permissionLevel }));
      this.log('info', 'fetch_sites_success', `${sites.length} sites encontrados`, { duration_ms: Date.now() - start, records: sites.length });
      return sites;
    } catch (e: any) {
      this.log('error', 'fetch_sites_failed', e.message, { duration_ms: Date.now() - start });
      throw e;
    }
  }

  async fetchAnalytics(siteUrl: string, dimension: string, startDate: string, endDate: string, rowLimit = 1000): Promise<GscApiRow[]> {
    this.log('info', 'fetch_analytics', `Buscando dados [${dimension}] para ${siteUrl}`, { data: { startDate, endDate, rowLimit } });
    const start = Date.now();
    try {
      const encoded = encodeURIComponent(siteUrl);
      const data = await this.gscPost<{ rows?: GscApiRow[] }>(
        `${GSC_API_ANALYTICS}/sites/${encoded}/searchAnalytics/query`,
        {
          startDate,
          endDate,
          dimensions: [dimension],
          rowLimit,
          startRow: 0,
        }
      );
      const rows = data.rows || [];
      this.log('info', 'fetch_analytics_success', `${rows.length} registros obtidos [${dimension}]`, { duration_ms: Date.now() - start, records: rows.length });
      return rows;
    } catch (e: any) {
      this.log('error', 'fetch_analytics_failed', e.message, { duration_ms: Date.now() - start });
      throw e;
    }
  }

  getConfig(): GscAuthConfig {
    return { ...this.config };
  }
}
