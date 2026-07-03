import { RssSitemapService } from '../../../../../../organic-traffic-os/core/connectors/rss-sitemap/rss-sitemap.service';

let serviceInstance: RssSitemapService | null = null;

export function getRssSitemapService(domain?: string): RssSitemapService {
  if (!serviceInstance && domain) {
    serviceInstance = new RssSitemapService({ domain });
  }
  if (!serviceInstance) {
    serviceInstance = new RssSitemapService({ domain: 'example.com' });
  }
  return serviceInstance;
}

export function resetRssSitemapService(): void {
  serviceInstance = null;
}
