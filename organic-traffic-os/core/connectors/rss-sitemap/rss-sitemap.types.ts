export interface RssAuthConfig {
  domain: string;
  feed_url?: string;
}

export interface RssFeedItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  updatedDate?: string;
  categories?: string[];
  author?: string;
  guid?: string;
  content?: string;
}

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
  images?: string[];
}

export interface SitemapIndex {
  sitemaps: { loc: string; lastmod?: string }[];
}

export type RssFeedFormat = 'rss' | 'atom' | 'unknown';

export interface InternalRssUrl {
  url: string;
  type: 'post' | 'page' | 'category' | 'tag' | 'other';
  title?: string;
  description?: string;
  pubDate?: string;
  updatedDate?: string;
  categories?: string[];
  author?: string;
  priority?: number;
  changefreq?: string;
  source: 'rss' | 'atom' | 'sitemap' | 'robots';
}

export interface RssSyncResult {
  domain: string;
  feedFormat: RssFeedFormat;
  feedUrl?: string;
  sitemapsFound: string[];
  robotsFound: boolean;
  totalUrls: number;
  posts: number;
  pages: number;
  categories: number;
  tags: number;
  urls: InternalRssUrl[];
  errors: string[];
  warnings: string[];
  logs: { timestamp: string; level: string; action: string; message: string; duration_ms?: number }[];
  timestamp: string;
}
