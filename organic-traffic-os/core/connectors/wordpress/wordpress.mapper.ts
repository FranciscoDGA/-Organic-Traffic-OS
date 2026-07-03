import { PublicationPackage, WpCreatePostPayload, WpPost } from './wordpress.types';
import { sanitizeSlug } from './wordpress.validator';

export function mapPackageToWpPayload(pkg: PublicationPackage, status: 'draft' | 'publish' | 'pending' | 'private' = 'draft'): WpCreatePostPayload {
  return {
    title: pkg.title,
    content: pkg.content,
    excerpt: pkg.excerpt,
    slug: pkg.slug ? sanitizeSlug(pkg.slug) : undefined,
    status,
    meta: pkg.metadata,
  };
}

export function mapWpPostToPreview(post: WpPost): {
  id: number;
  title: string;
  slug: string;
  status: string;
  date: string;
  excerpt: string;
  link: string;
  categories: number[];
  tags: number[];
} {
  return {
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    status: post.status,
    date: post.date,
    excerpt: post.excerpt.rendered?.replace(/<[^>]*>/g, '').substring(0, 200),
    link: post.link,
    categories: post.categories,
    tags: post.tags,
  };
}
