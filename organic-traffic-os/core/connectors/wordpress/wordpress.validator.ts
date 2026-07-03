import { WpAuthConfig, WpCreatePostPayload } from './wordpress.types';

export function validateSiteUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch { return false; }
}

export function validateAuthConfig(config: WpAuthConfig): { valid: boolean; error?: string } {
  if (!config.site_url) return { valid: false, error: 'Site URL is required' };
  if (!validateSiteUrl(config.site_url)) return { valid: false, error: 'Invalid site URL format' };
  if (!config.username) return { valid: false, error: 'Username is required' };
  if (!config.app_password) return { valid: false, error: 'Application password is required' };
  return { valid: true };
}

export function validatePostPayload(payload: WpCreatePostPayload): { valid: boolean; error?: string } {
  if (!payload.title || payload.title.trim().length === 0) return { valid: false, error: 'Title is required' };
  if (!payload.content || payload.content.trim().length === 0) return { valid: false, error: 'Content is required' };
  if (!payload.slug || payload.slug.trim().length === 0) return { valid: false, error: 'Slug is required' };
  if (!['draft', 'publish', 'pending', 'private'].includes(payload.status)) return { valid: false, error: 'Invalid status' };
  return { valid: true };
}

export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 200);
}
