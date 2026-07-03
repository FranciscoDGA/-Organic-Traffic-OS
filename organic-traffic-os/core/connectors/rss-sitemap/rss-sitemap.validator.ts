import { RssAuthConfig } from './rss-sitemap.types';

export function validateDomain(domain: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
}

export function validateFeedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch { return false; }
}

export function validateAuthConfig(config: RssAuthConfig): { valid: boolean; error?: string } {
  if (!config.domain) return { valid: false, error: 'Domain is required' };
  if (!validateDomain(config.domain)) return { valid: false, error: 'Invalid domain format' };
  if (config.feed_url && !validateFeedUrl(config.feed_url)) return { valid: false, error: 'Invalid feed URL' };
  return { valid: true };
}

export function sanitizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = '';
    return u.toString();
  } catch { return url; }
}

export function isSitemapUrl(url: string): boolean {
  return /sitemap.*\.xml$/i.test(url) || /sitemap.*\.xml\.gz$/i.test(url);
}

export function isFeedUrl(url: string): boolean {
  return /feed\/?$/i.test(url) || /rss\/?$/i.test(url) || /atom\/?$/i.test(url) || /\.xml$/i.test(url);
}
