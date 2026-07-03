import { RssAuthConfig } from './rss-sitemap.types';
import { validateDomain, validateFeedUrl } from './rss-sitemap.validator';

export class RssSitemapClient {
  private config: RssAuthConfig;
  private cache = new Map<string, { data: string; expiry: number }>();
  private cacheTTL = 15 * 60 * 1000;

  constructor(config: RssAuthConfig) {
    this.config = config;
  }

  private async cachedFetch(url: string): Promise<string> {
    const cached = this.cache.get(url);
    if (cached && cached.expiry > Date.now()) return cached.data;

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'OrganicTrafficOS/1.0 RSS-Sitemap Connector' },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      this.cache.set(url, { data: text, expiry: Date.now() + this.cacheTTL });
      return text;
    } catch (err: any) {
      throw new Error(`Failed to fetch ${url}: ${err.message}`);
    }
  }

  async fetchFeed(url: string): Promise<string> {
    if (!validateFeedUrl(url)) throw new Error('Invalid feed URL');
    return this.cachedFetch(url);
  }

  async fetchSitemap(url: string): Promise<string> {
    if (!validateDomain(url)) throw new Error('Invalid sitemap URL');
    return this.cachedFetch(url);
  }

  async fetchRobots(domain: string): Promise<string> {
    const url = `https://${domain}/robots.txt`;
    return this.cachedFetch(url);
  }

  async discoverFeeds(domain: string): Promise<string[]> {
    const feeds: string[] = [];
    const commonPaths = ['/feed/', '/rss/', '/atom/', '/feed', '/rss', '/atom', '/sitemap.xml', '/sitemap_index.xml'];

    for (const path of commonPaths) {
      try {
        const url = `https://${domain}${path}`;
        await this.cachedFetch(url);
        feeds.push(url);
      } catch { /* not found, skip */ }
    }

    try {
      const robots = await this.fetchRobots(domain);
      const sitemapMatch = robots.match(/Sitemap:\s*(.+)/gi);
      if (sitemapMatch) {
        for (const match of sitemapMatch) {
          const sitemapUrl = match.replace(/Sitemap:\s*/i, '').trim();
          if (!feeds.includes(sitemapUrl)) feeds.push(sitemapUrl);
        }
      }
    } catch { /* robots not available */ }

    return feeds;
  }

  clearCache(): void {
    this.cache.clear();
  }
}
