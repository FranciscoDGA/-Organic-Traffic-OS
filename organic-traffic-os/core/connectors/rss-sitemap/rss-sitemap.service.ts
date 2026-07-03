import { RssAuthConfig, RssFeedItem, SitemapUrl, SitemapIndex, InternalRssUrl, RssSyncResult, RssFeedFormat } from './rss-sitemap.types';
import { RssSitemapClient } from './rss-sitemap.client';
import { detectFeedFormat, mapFeedItemToInternal, mapSitemapUrlToInternal, normalizeUrls } from './rss-sitemap.mapper';
import { validateAuthConfig } from './rss-sitemap.validator';

function parseSimpleXml(content: string, tagName: string): string[] {
  const regex = new RegExp(`<${tagName}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?</${tagName}>`, 'gs');
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
}

function parseRssItems(content: string): RssFeedItem[] {
  const items: RssFeedItem[] = [];
  const itemBlocks = content.split('<item>').slice(1);
  for (const block of itemBlocks) {
    const end = block.indexOf('</item>');
    const xml = end > -1 ? block.substring(0, end) : block;
    items.push({
      title: parseSimpleXml(xml, 'title')[0] || '',
      link: parseSimpleXml(xml, 'link')[0] || '',
      description: parseSimpleXml(xml, 'description')[0],
      pubDate: parseSimpleXml(xml, 'pubDate')[0],
      categories: parseSimpleXml(xml, 'category'),
      author: parseSimpleXml(xml, 'author')[0] || parseSimpleXml(xml, 'dc:creator')[0],
      guid: parseSimpleXml(xml, 'guid')[0],
    });
  }
  return items;
}

function parseAtomItems(content: string): RssFeedItem[] {
  const items: RssFeedItem[] = [];
  const entryBlocks = content.split('<entry>').slice(1);
  for (const block of entryBlocks) {
    const end = block.indexOf('</entry>');
    const xml = end > -1 ? block.substring(0, end) : block;
    const linkMatch = xml.match(/<link[^>]+href="([^"]+)"/);
    items.push({
      title: parseSimpleXml(xml, 'title')[0] || '',
      link: linkMatch?.[1] || '',
      description: parseSimpleXml(xml, 'summary')[0] || parseSimpleXml(xml, 'content')[0],
      pubDate: parseSimpleXml(xml, 'published')[0],
      updatedDate: parseSimpleXml(xml, 'updated')[0],
      categories: parseSimpleXml(xml, 'category').map(c => {
        const termMatch = c.match(/term="([^"]+)"/);
        return termMatch ? termMatch[1] : c;
      }),
      author: parseSimpleXml(xml, 'name')[0],
    });
  }
  return items;
}

function parseSitemapUrls(content: string): SitemapUrl[] {
  const urls: SitemapUrl[] = [];
  const urlBlocks = content.split('<url>').slice(1);
  for (const block of urlBlocks) {
    const end = block.indexOf('</url>');
    const xml = end > -1 ? block.substring(0, end) : block;
    const priorityStr = parseSimpleXml(xml, 'priority')[0];
    urls.push({
      loc: parseSimpleXml(xml, 'loc')[0] || '',
      lastmod: parseSimpleXml(xml, 'lastmod')[0],
      changefreq: parseSimpleXml(xml, 'changefreq')[0],
      priority: priorityStr ? parseFloat(priorityStr) : undefined,
    });
  }
  return urls;
}

function parseSitemapIndex(content: string): SitemapIndex {
  const sitemaps: { loc: string; lastmod?: string }[] = [];
  const sitemapBlocks = content.split('<sitemap>').slice(1);
  for (const block of sitemapBlocks) {
    const end = block.indexOf('</sitemap>');
    const xml = end > -1 ? block.substring(0, end) : block;
    sitemaps.push({
      loc: parseSimpleXml(xml, 'loc')[0] || '',
      lastmod: parseSimpleXml(xml, 'lastmod')[0],
    });
  }
  return { sitemaps };
}

export class RssSitemapService {
  private client: RssSitemapClient;
  private config: RssAuthConfig;
  private lastSyncResult: RssSyncResult | null = null;

  constructor(config: RssAuthConfig) {
    this.config = config;
    this.client = new RssSitemapClient(config);
  }

  async connect(): Promise<{ connected: boolean; feeds: string[] }> {
    const validation = validateAuthConfig(this.config);
    if (!validation.valid) throw new Error(validation.error);

    const feeds = await this.client.discoverFeeds(this.config.domain);
    return { connected: feeds.length > 0, feeds };
  }

  disconnect(): void {
    this.client.clearCache();
    this.lastSyncResult = null;
  }

  async sync(): Promise<RssSyncResult> {
    const logs: RssSyncResult['logs'] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    const allItems: InternalRssUrl[] = [];
    let feedFormat: RssFeedFormat = 'unknown';
    let feedUrl: string | undefined;
    const sitemapsFound: string[] = [];
    let robotsFound = false;

    const start = Date.now();
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'sync_start', message: `Starting sync for ${this.config.domain}` });

    try {
      // Discover feeds
      const feeds = await this.client.discoverFeeds(this.config.domain);
      logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'discover', message: `Discovered ${feeds.length} feed(s)/sitemap(s)`, duration_ms: Date.now() - start });

      for (const feedUrlCandidate of feeds) {
        try {
          const content = await this.client.fetchFeed(feedUrlCandidate);
          const format = detectFeedFormat(content);

          if (format === 'rss' || format === 'atom') {
            feedFormat = format;
            feedUrl = feedUrlCandidate;
            const items = format === 'rss' ? parseRssItems(content) : parseAtomItems(content);
            allItems.push(...items.map(item => mapFeedItemToInternal(item, format)));
            logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'parse_feed', message: `Parsed ${items.length} items from ${format.toUpperCase()} feed`, duration_ms: Date.now() - start });
          } else if (feedUrlCandidate.includes('sitemap')) {
            sitemapsFound.push(feedUrlCandidate);
            if (feedUrlCandidate.includes('sitemap_index')) {
              const index = parseSitemapIndex(content);
              for (const sub of index.sitemaps) {
                try {
                  const subContent = await this.client.fetchSitemap(sub.loc);
                  const urls = parseSitemapUrls(subContent);
                  allItems.push(...urls.map(u => mapSitemapUrlToInternal(u)));
                  sitemapsFound.push(sub.loc);
                } catch (err: any) { warnings.push(`Sub-sitemap ${sub.loc}: ${err.message}`); }
              }
            } else {
              const urls = parseSitemapUrls(content);
              allItems.push(...urls.map(u => mapSitemapUrlToInternal(u)));
            }
          }
        } catch (err: any) { warnings.push(`Feed ${feedUrlCandidate}: ${err.message}`); }
      }

      // Try robots.txt
      try {
        const robots = await this.client.fetchRobots(this.config.domain);
        robotsFound = robots.length > 0;
        const sitemapLines = robots.match(/Sitemap:\s*(.+)/gi);
        if (sitemapLines) {
          for (const line of sitemapLines) {
            const url = line.replace(/Sitemap:\s*/i, '').trim();
            if (!sitemapsFound.includes(url)) {
              try {
                const content = await this.client.fetchSitemap(url);
                const urls = parseSitemapUrls(content);
                allItems.push(...urls.map(u => mapSitemapUrlToInternal(u)));
                sitemapsFound.push(url);
              } catch { /* skip */ }
            }
          }
        }
      } catch { /* robots not available */ }

      const normalized = normalizeUrls(allItems);
      const result: RssSyncResult = {
        domain: this.config.domain,
        feedFormat,
        feedUrl,
        sitemapsFound,
        robotsFound,
        totalUrls: normalized.length,
        posts: normalized.filter(u => u.type === 'post').length,
        pages: normalized.filter(u => u.type === 'page').length,
        categories: normalized.filter(u => u.type === 'category').length,
        tags: normalized.filter(u => u.type === 'tag').length,
        urls: normalized,
        errors,
        warnings,
        logs,
        timestamp: new Date().toISOString(),
      };

      this.lastSyncResult = result;
      logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'sync_complete', message: `Sync completed: ${normalized.length} URLs`, duration_ms: Date.now() - start });
      return result;
    } catch (err: any) {
      errors.push(err.message);
      logs.push({ timestamp: new Date().toISOString(), level: 'error', action: 'sync_error', message: err.message });
      throw err;
    }
  }

  getLastSyncResult(): RssSyncResult | null {
    return this.lastSyncResult;
  }

  getUrls(): InternalRssUrl[] {
    return this.lastSyncResult?.urls || [];
  }
}
