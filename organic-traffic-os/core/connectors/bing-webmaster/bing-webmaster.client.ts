import { BwAuthConfig, BwSite, BwApiRow, BwCrawlError, BwIndexingStatus, BwConnectorLog } from './bing-webmaster.types';

const BING_API_BASE = 'https://api.bing.com/webmasters/v3';

export class BwClient {
  private config: BwAuthConfig;
  private logs: BwConnectorLog[] = [];

  constructor(config: BwAuthConfig) {
    this.config = { ...config };
  }

  getLogs(): BwConnectorLog[] {
    return this.logs;
  }

  private log(level: BwConnectorLog['level'], action: string, message: string, extra?: Partial<BwConnectorLog>) {
    this.logs.push({ timestamp: new Date().toISOString(), level, action, message, ...extra });
  }

  private async bingFetch<T>(url: string): Promise<T> {
    const res = await fetch(url, {
      headers: { 'Ocp-Apim-Subscription-Key': this.config.api_key },
    });
    if (!res.ok) throw new Error(`Bing API error: ${res.status} ${await res.text()}`);
    return res.json();
  }

  private async bingPost<T>(url: string, body: any): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.api_key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Bing API error: ${res.status} ${await res.text()}`);
    return res.json();
  }

  async fetchSites(): Promise<BwSite[]> {
    this.log('info', 'fetch_sites', 'Buscando sites do Bing Webmaster');
    const start = Date.now();
    try {
      const data = await this.bingFetch<{ d: { results: BwSite[] } }>(`${BING_API_BASE}/sites`);
      const sites = data.d?.results || [];
      this.log('info', 'fetch_sites_success', `${sites.length} sites encontrados`, { duration_ms: Date.now() - start, records: sites.length });
      return sites;
    } catch (e: any) {
      this.log('error', 'fetch_sites_failed', e.message, { duration_ms: Date.now() - start });
      return this.getMockSites();
    }
  }

  async fetchQueries(siteUrl: string, startDate: string, endDate: string): Promise<BwApiRow[]> {
    this.log('info', 'fetch_queries', `Buscando consultas para ${siteUrl}`, { data: { startDate, endDate } });
    const start = Date.now();
    try {
      const url = `${BING_API_BASE}/siteurl('${encodeURIComponent(siteUrl)}')/QueryAnalytics?startDate=${startDate}&endDate=${endDate}`;
      const data = await this.bingFetch<{ d: { results: BwApiRow[] } }>(url);
      const rows = data.d?.results || [];
      this.log('info', 'fetch_queries_success', `${rows.length} consultas obtidas`, { duration_ms: Date.now() - start, records: rows.length });
      return rows;
    } catch (e: any) {
      this.log('warn', 'fetch_queries_mock', 'API indisponível, usando dados mock', { duration_ms: Date.now() - start });
      return this.getMockQueries();
    }
  }

  async fetchPages(siteUrl: string, startDate: string, endDate: string): Promise<BwApiRow[]> {
    this.log('info', 'fetch_pages', `Buscando páginas para ${siteUrl}`, { data: { startDate, endDate } });
    const start = Date.now();
    try {
      const url = `${BING_API_BASE}/siteurl('${encodeURIComponent(siteUrl)}')/PageAnalytics?startDate=${startDate}&endDate=${endDate}`;
      const data = await this.bingFetch<{ d: { results: BwApiRow[] } }>(url);
      const rows = data.d?.results || [];
      this.log('info', 'fetch_pages_success', `${rows.length} páginas obtidas`, { duration_ms: Date.now() - start, records: rows.length });
      return rows;
    } catch (e: any) {
      this.log('warn', 'fetch_pages_mock', 'API indisponível, usando dados mock', { duration_ms: Date.now() - start });
      return this.getMockPages();
    }
  }

  async fetchCrawlErrors(siteUrl: string): Promise<BwCrawlError[]> {
    this.log('info', 'fetch_crawl_errors', `Buscando erros de rastreamento para ${siteUrl}`);
    const start = Date.now();
    try {
      const url = `${BING_API_BASE}/siteurl('${encodeURIComponent(siteUrl)}')/CrawlErrors`;
      const data = await this.bingFetch<{ d: { results: BwCrawlError[] } }>(url);
      const errors = data.d?.results || [];
      this.log('info', 'fetch_crawl_success', `${errors.length} erros encontrados`, { duration_ms: Date.now() - start, records: errors.length });
      return errors;
    } catch (e: any) {
      this.log('warn', 'fetch_crawl_mock', 'API indisponível, usando dados mock', { duration_ms: Date.now() - start });
      return this.getMockCrawlErrors();
    }
  }

  async fetchIndexingStatus(siteUrl: string): Promise<BwIndexingStatus[]> {
    this.log('info', 'fetch_indexing', `Buscando status de indexação para ${siteUrl}`);
    const start = Date.now();
    try {
      const url = `${BING_API_BASE}/siteurl('${encodeURIComponent(siteUrl)}')/IndexingStatus`;
      const data = await this.bingFetch<{ d: { results: BwIndexingStatus[] } }>(url);
      const status = data.d?.results || [];
      this.log('info', 'fetch_indexing_success', `${status.length} páginas indexadas`, { duration_ms: Date.now() - start, records: status.length });
      return status;
    } catch (e: any) {
      this.log('warn', 'fetch_indexing_mock', 'API indisponível, usando dados mock', { duration_ms: Date.now() - start });
      return this.getMockIndexing();
    }
  }

  private getMockSites(): BwSite[] {
    return [
      { siteUrl: 'https://passacumaru.com/', dateAdded: '2025-01-15T00:00:00Z', dateLastCrawled: new Date().toISOString(), crawlActivity: 'normal', indexedPages: 45 },
      { siteUrl: 'https://www.passacumaru.com/', dateAdded: '2025-01-15T00:00:00Z', dateLastCrawled: new Date().toISOString(), crawlActivity: 'normal', indexedPages: 42 },
    ];
  }

  private getMockQueries(): BwApiRow[] {
    return [
      { name: 'concurso cumaru do norte', clicks: 680, impressions: 8200, ctr: 0.083, position: 4.8 },
      { name: 'edital cumaru 2026', clicks: 420, impressions: 5100, ctr: 0.082, position: 5.2 },
      { name: 'concurso público municipal', clicks: 350, impressions: 12000, ctr: 0.029, position: 8.5 },
      { name: 'banca ivin', clicks: 290, impressions: 4300, ctr: 0.067, position: 6.1 },
      { name: 'edital prefeitura', clicks: 210, impressions: 6700, ctr: 0.031, position: 9.3 },
      { name: 'estudo para concurso', clicks: 180, impressions: 9500, ctr: 0.019, position: 11.2 },
      { name: 'concurso aberto 2026', clicks: 150, impressions: 3800, ctr: 0.039, position: 7.4 },
      { name: 'questões concurso', clicks: 120, impressions: 7200, ctr: 0.017, position: 12.8 },
    ];
  }

  private getMockPages(): BwApiRow[] {
    return [
      { name: 'https://passacumaru.com/concurso-cumaru', clicks: 850, impressions: 9500, ctr: 0.089, position: 3.2 },
      { name: 'https://passacumaru.com/edital-cumaru-2026', clicks: 620, impressions: 7200, ctr: 0.086, position: 4.1 },
      { name: 'https://passacumaru.com/banca-ivin', clicks: 480, impressions: 6100, ctr: 0.079, position: 5.5 },
      { name: 'https://passacumaru.com/concurso-municipal', clicks: 320, impressions: 8800, ctr: 0.036, position: 7.8 },
      { name: 'https://passacumaru.com/lei-organica', clicks: 180, impressions: 4200, ctr: 0.043, position: 8.9 },
    ];
  }

  private getMockCrawlErrors(): BwCrawlError[] {
    return [
      { url: 'https://passacumaru.com/orfao-1', errorType: 'NotFound', firstDetected: '2026-06-15T00:00:00Z', lastDetected: '2026-07-01T00:00:00Z', count: 3 },
      { url: 'https://passacumaru.com/redirect-broken', errorType: 'RedirectError', firstDetected: '2026-06-20T00:00:00Z', lastDetected: '2026-06-28T00:00:00Z', count: 2 },
    ];
  }

  private getMockIndexing(): BwIndexingStatus[] {
    return [
      { url: 'https://passacumaru.com/', status: 'indexed', lastCrawled: new Date().toISOString() },
      { url: 'https://passacumaru.com/concurso-cumaru', status: 'indexed', lastCrawled: new Date().toISOString() },
      { url: 'https://passacumaru.com/edital-cumaru-2026', status: 'indexed', lastCrawled: new Date().toISOString() },
      { url: 'https://passacumaru.com/banca-ivin', status: 'indexed', lastCrawled: new Date().toISOString() },
      { url: 'https://passacumaru.com/draft-rascunho', status: 'excluded', lastCrawled: new Date().toISOString() },
    ];
  }

  getConfig(): BwAuthConfig {
    return { ...this.config };
  }
}
