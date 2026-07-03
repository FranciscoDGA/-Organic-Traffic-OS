import { NewsletterAuthConfig, NewsletterProvider } from './newsletter.types';
import { NewsletterAdapter } from './adapters/newsletter-adapter.interface';
import { MockNewsletterAdapter } from './adapters/mock-newsletter-adapter';
import { BrevoAdapter } from './adapters/brevo-adapter';
import { MailchimpAdapter } from './adapters/mailchimp-adapter';
import { ResendAdapter } from './adapters/resend-adapter';
import { ConvertkitAdapter } from './adapters/convertkit-adapter';

export function createAdapter(config: NewsletterAuthConfig): NewsletterAdapter {
  switch (config.provider) {
    case 'brevo':
      return new BrevoAdapter(config.api_key);
    case 'mailchimp':
      return new MailchimpAdapter(config.api_key);
    case 'resend':
      return new ResendAdapter(config.api_key);
    case 'convertkit':
      return new ConvertkitAdapter(config.api_key);
    case 'mock':
    default:
      return new MockNewsletterAdapter();
  }
}
