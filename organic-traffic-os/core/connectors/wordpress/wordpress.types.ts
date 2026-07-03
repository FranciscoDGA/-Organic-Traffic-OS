export interface WpAuthConfig {
  site_url: string;
  username: string;
  app_password: string;
}

export interface WpPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'private' | 'future' | 'trash';
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  meta?: Record<string, any>;
  link: string;
}

export interface WpCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WpTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WpCreatePostPayload {
  title: string;
  content?: string;
  excerpt?: string;
  slug?: string;
  status: 'draft' | 'publish' | 'pending' | 'private';
  categories?: number[];
  tags?: number[];
  featured_media?: number;
  meta?: Record<string, any>;
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

export interface WpSyncResult {
  site_url: string;
  connected: boolean;
  total_posts: number;
  total_categories: number;
  total_tags: number;
  posts: WpPost[];
  categories: WpCategory[];
  tags: WpTag[];
  errors: string[];
  logs: { timestamp: string; level: string; action: string; message: string; duration_ms?: number }[];
  timestamp: string;
}
