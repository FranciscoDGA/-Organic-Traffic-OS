import { RssFeedItem, SitemapUrl, SitemapIndex, InternalRssUrl, RssFeedFormat } from './rss-sitemap.types';

function classifyUrl(url: string): 'post' | 'page' | 'category' | 'tag' | 'other' {
  if (/\/category\//.test(url)) return 'category';
  if (/\/tag\//.test(url)) return 'tag';
  if (/\/\d{4}\/\d{2}\//.test(url) || /\/post\//.test(url)) return 'post';
  if (/\/page\//.test(url)) return 'page';
  return 'page';
}

export function mapFeedItemToInternal(item: RssFeedItem, format: RssFeedFormat): InternalRssUrl {
  return {
    url: item.link,
    type: classifyUrl(item.link),
    title: item.title,
    description: item.description,
    pubDate: item.pubDate,
    updatedDate: item.updatedDate,
    categories: item.categories || [],
    author: item.author,
    source: format === 'atom' ? 'atom' : 'rss',
  };
}

export function mapSitemapUrlToInternal(item: SitemapUrl): InternalRssUrl {
  return {
    url: item.loc,
    type: classifyUrl(item.loc),
    pubDate: item.lastmod,
    updatedDate: item.lastmod,
    priority: item.priority,
    changefreq: item.changefreq,
    source: 'sitemap',
  };
}

export function mapSitemapIndexToUrls(index: SitemapIndex): string[] {
  return index.sitemaps.map(s => s.loc);
}

export function detectFeedFormat(content: string): RssFeedFormat {
  if (content.includes('<rss') || content.includes('<channel>')) return 'rss';
  if (content.includes('<feed') || content.includes('xmlns="http://www.w3.org/2005/Atom"')) return 'atom';
  return 'unknown';
}

export function normalizeUrls(items: InternalRssUrl[]): InternalRssUrl[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const normalized = item.url.replace(/\/+$/, '').toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}
