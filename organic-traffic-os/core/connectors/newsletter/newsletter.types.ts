export type NewsletterProvider = 'brevo' | 'mailchimp' | 'resend' | 'convertkit' | 'mock';

export interface NewsletterAuthConfig {
  provider: NewsletterProvider;
  api_key: string;
  api_url?: string;
}

export interface NewsletterAudience {
  id: string;
  name: string;
  count: number;
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  preheader?: string;
  status: 'draft' | 'scheduled' | 'sent';
  audience?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterPackage {
  subject: string;
  preheader: string;
  title: string;
  intro?: string;
  body_html: string;
  body_text: string;
  cta?: { label: string; url: string };
  links?: string[];
  source_content_id?: string;
  audience?: string;
  status: 'draft' | 'scheduled' | 'sent';
}

export interface PublicationPackage {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  categories?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface NewsletterSyncResult {
  provider: NewsletterProvider;
  connected: boolean;
  total_audiences: number;
  total_campaigns: number;
  audiences: NewsletterAudience[];
  campaigns: NewsletterCampaign[];
  errors: string[];
  warnings: string[];
  logs: { timestamp: string; level: string; action: string; message: string; duration_ms?: number }[];
  timestamp: string;
}
