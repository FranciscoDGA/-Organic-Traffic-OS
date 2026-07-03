export interface AdapterContext {
  blog_id: string;
  env: 'mock' | 'manual' | 'pipeline';
}

export interface AdapterResult {
  success: boolean;
  timestamp: string;
  url?: string;
  error?: string;
}
