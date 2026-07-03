import { PublicationPackage, NewsletterPackage } from './newsletter.types';

export function mapPublicationToNewsletterPackage(pub: PublicationPackage): NewsletterPackage {
  const plainText = pub.content.replace(/<[^>]*>/g, '').substring(0, 500);
  const intro = pub.excerpt || plainText.substring(0, 200);

  return {
    subject: pub.title,
    preheader: intro.substring(0, 100),
    title: pub.title,
    intro,
    body_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a2e;">${pub.title}</h1>
        ${intro ? `<p style="color: #64748b; font-size: 14px;">${intro}</p>` : ''}
        <div style="color: #333; font-size: 16px; line-height: 1.6;">${pub.content}</div>
      </div>`,
    body_text: `${pub.title}\n\n${intro}\n\n${plainText}`,
    cta: { label: 'Ler mais', url: `https://example.com/${pub.slug}` },
    links: [],
    source_content_id: pub.slug,
    status: 'draft',
  };
}

export function mapNewsletterToPreview(nl: NewsletterPackage): {
  subject: string;
  preheader: string;
  title: string;
  status: string;
  has_cta: boolean;
  html_length: number;
  text_length: number;
} {
  return {
    subject: nl.subject,
    preheader: nl.preheader,
    title: nl.title,
    status: nl.status,
    has_cta: !!nl.cta,
    html_length: nl.body_html?.length || 0,
    text_length: nl.body_text?.length || 0,
  };
}
