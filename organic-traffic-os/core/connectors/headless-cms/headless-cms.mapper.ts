import { PublicationPackage, HeadlessCreatePayload } from './headless-cms.types';
import { sanitizeSlug } from './headless-cms.validator';

export function mapPackageToHeadlessPayload(pkg: PublicationPackage, status: 'draft' | 'published' = 'draft'): HeadlessCreatePayload {
  return {
    title: pkg.title,
    content: pkg.content,
    excerpt: pkg.excerpt,
    slug: pkg.slug ? sanitizeSlug(pkg.slug) : undefined,
    status,
    tags: pkg.tags,
    categories: pkg.categories,
    metadata: pkg.metadata,
  };
}

export function mapHeadlessContentToPreview(item: any, provider: string): {
  id: string;
  title: string;
  slug: string;
  status: string;
  excerpt?: string;
  updated_at?: string;
} {
  if (provider === 'strapi') {
    return {
      id: String(item.id),
      title: item.title || item.Name || '',
      slug: item.slug || item.Slug || '',
      status: item.status || item.Status || 'draft',
      excerpt: item.excerpt || item.Excerpt,
      updated_at: item.updated_at,
    };
  }
  if (provider === 'directus') {
    return {
      id: String(item.id),
      title: item.title || item.Name || '',
      slug: item.slug || item.Slug || '',
      status: item.status || item.Status || 'draft',
      excerpt: item.excerpt || item.Excerpt,
      updated_at: item.date_updated,
    };
  }
  if (provider === 'sanity') {
    return {
      id: item._id || item.id,
      title: item.title || item.Name || '',
      slug: item.slug?.current || item.slug || '',
      status: item.status || 'draft',
      excerpt: item.excerpt,
      updated_at: item._updatedAt,
    };
  }
  return {
    id: String(item.id || ''),
    title: item.title || '',
    slug: item.slug || '',
    status: item.status || 'draft',
    excerpt: item.excerpt,
    updated_at: item.updated_at,
  };
}
