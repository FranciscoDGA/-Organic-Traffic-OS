import { HeadlessAuthConfig, HeadlessCreatePayload } from './headless-cms.types';

export function validateApiUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch { return false; }
}

export function validateAuthConfig(config: HeadlessAuthConfig): { valid: boolean; error?: string } {
  if (!config.provider) return { valid: false, error: 'Provider is required' };
  if (!['strapi', 'directus', 'sanity', 'mock'].includes(config.provider)) return { valid: false, error: 'Invalid provider' };
  if (!config.api_url) return { valid: false, error: 'API URL is required' };
  if (!validateApiUrl(config.api_url)) return { valid: false, error: 'Invalid API URL format' };
  if (config.provider !== 'mock' && !config.api_token) return { valid: false, error: 'API token is required for non-mock providers' };
  return { valid: true };
}

export function validateCreatePayload(payload: HeadlessCreatePayload): { valid: boolean; error?: string } {
  if (!payload.title || payload.title.trim().length === 0) return { valid: false, error: 'Title is required' };
  if (!payload.slug || payload.slug.trim().length === 0) return { valid: false, error: 'Slug is required' };
  if (!payload.body && !payload.content) return { valid: false, error: 'Content is required' };
  if (!['draft', 'published'].includes(payload.status)) return { valid: false, error: 'Invalid status' };
  return { valid: true };
}

export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 200);
}
