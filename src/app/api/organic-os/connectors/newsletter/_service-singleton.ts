import { NewsletterService } from '../../../../../../organic-traffic-os/core/connectors/newsletter/newsletter.service';

let serviceInstance: NewsletterService | null = null;

export function getNewsletterService(config?: { provider: any; api_key: string }): NewsletterService {
  if (!serviceInstance && config) {
    serviceInstance = new NewsletterService(config);
  }
  if (!serviceInstance) {
    serviceInstance = new NewsletterService({ provider: 'mock', api_key: '' });
  }
  return serviceInstance;
}

export function resetNewsletterService(): void {
  serviceInstance = null;
}
