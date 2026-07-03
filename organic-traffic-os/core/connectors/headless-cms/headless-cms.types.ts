export type HeadlessProvider = 'strapi' | 'directus' | 'sanity' | 'mock';

export interface HeadlessAuthConfig {
  provider: HeadlessProvider;
  api_url: string;
  api_token: string;
  project_id?: string;
}

export interface HeadlessCollection {
  uid: string;
  name: string;
  description?: string;
  schema?: Record<string, any>;
}

export interface HeadlessContent {
  id: string;
  slug: string;
  title: string;
  body?: string;
  content?: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  tags?: string[];
  categories?: string[];
  author?: string;
  published_at?: string;
  updated_at?: string;
  created_at?: string;
  metadata?: Record<string, any>;
  collection?: string;
}

export interface HeadlessCreatePayload {
  title: string;
  slug?: string;
  body?: string;
  content?: string;
  excerpt?: string;
  status: 'draft' | 'published';
  tags?: string[];
  categories?: string[];
  author?: string;
  metadata?: Record<string, any>;
  collection?: string;
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

export interface HeadlessSyncResult {
  provider: HeadlessProvider;
  connected: boolean;
  api_url: string;
  total_collections: number;
  total_content: number;
  collections: HeadlessCollection[];
  content: HeadlessContent[];
  errors: string[];
  logs: { timestamp: string; level: string; action: string; message: string; duration_ms?: number }[];
  timestamp: string;
}
