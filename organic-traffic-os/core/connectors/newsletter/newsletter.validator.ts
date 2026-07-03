import { NewsletterAuthConfig, NewsletterPackage } from './newsletter.types';

export function validateAuthConfig(config: NewsletterAuthConfig): { valid: boolean; error?: string } {
  if (!config.provider) return { valid: false, error: 'Provider is required' };
  if (!['brevo', 'mailchimp', 'resend', 'convertkit', 'mock'].includes(config.provider)) return { valid: false, error: 'Invalid provider' };
  if (config.provider !== 'mock' && !config.api_key) return { valid: false, error: 'API key is required for non-mock providers' };
  return { valid: true };
}

export function validateCampaignPayload(payload: NewsletterPackage): { valid: boolean; error?: string } {
  if (!payload.subject || payload.subject.trim().length === 0) return { valid: false, error: 'Subject is required' };
  if (!payload.preheader || payload.preheader.trim().length === 0) return { valid: false, error: 'Preheader is required' };
  if (!payload.body_html || payload.body_html.trim().length === 0) return { valid: false, error: 'HTML body is required' };
  if (!payload.body_text || payload.body_text.trim().length === 0) return { valid: false, error: 'Text body is required' };
  if (!payload.cta || !payload.cta.label || !payload.cta.url) return { valid: false, error: 'CTA (label + url) is required' };
  return { valid: true };
}

export function sanitizeSubject(subject: string): string {
  return subject.replace(/[<>]/g, '').substring(0, 200);
}
