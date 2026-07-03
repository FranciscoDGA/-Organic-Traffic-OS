export const STORAGE_BUCKETS = [
  'articles',
  'images',
  'reports',
  'playbooks',
  'knowledge',
  'logs',
  'backups',
  'exports',
  'imports',
  'temporary',
] as const;

export type StorageBucket = typeof STORAGE_BUCKETS[number];

export interface BucketConfig {
  name: StorageBucket;
  description: string;
  public: boolean;
  fileSizeLimit: number;
  allowedMimeTypes: string[];
  createdAt: string;
}

export const BUCKET_CONFIGS: Record<StorageBucket, BucketConfig> = {
  articles: { name: 'articles', description: 'Published articles and drafts', public: true, fileSizeLimit: 10485760, allowedMimeTypes: ['text/html', 'text/markdown', 'application/json'], createdAt: new Date().toISOString() },
  images: { name: 'images', description: 'Article images and assets', public: true, fileSizeLimit: 10485760, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'], createdAt: new Date().toISOString() },
  reports: { name: 'reports', description: 'Generated reports', public: false, fileSizeLimit: 52428800, allowedMimeTypes: ['application/pdf', 'text/csv', 'application/json'], createdAt: new Date().toISOString() },
  playbooks: { name: 'playbooks', description: 'Editorial playbooks and guides', public: false, fileSizeLimit: 5242880, allowedMimeTypes: ['text/markdown', 'application/json', 'text/plain'], createdAt: new Date().toISOString() },
  knowledge: { name: 'knowledge', description: 'Knowledge base documents', public: false, fileSizeLimit: 10485760, allowedMimeTypes: ['text/markdown', 'application/json', 'text/plain', 'application/pdf'], createdAt: new Date().toISOString() },
  logs: { name: 'logs', description: 'Application and runtime logs', public: false, fileSizeLimit: 52428800, allowedMimeTypes: ['text/plain', 'application/json'], createdAt: new Date().toISOString() },
  backups: { name: 'backups', description: 'Database and system backups', public: false, fileSizeLimit: 104857600, allowedMimeTypes: ['application/octet-stream', 'application/gzip'], createdAt: new Date().toISOString() },
  exports: { name: 'exports', description: 'Data exports', public: false, fileSizeLimit: 52428800, allowedMimeTypes: ['text/csv', 'application/json', 'application/pdf'], createdAt: new Date().toISOString() },
  imports: { name: 'imports', description: 'Data imports', public: false, fileSizeLimit: 52428800, allowedMimeTypes: ['text/csv', 'application/json'], createdAt: new Date().toISOString() },
  temporary: { name: 'temporary', description: 'Temporary files', public: false, fileSizeLimit: 10485760, allowedMimeTypes: ['*'], createdAt: new Date().toISOString() },
};

export function getBucketNames(): string[] {
  return [...STORAGE_BUCKETS];
}

export function getPublicBuckets(): BucketConfig[] {
  return Object.values(BUCKET_CONFIGS).filter(b => b.public);
}

export function getPrivateBuckets(): BucketConfig[] {
  return Object.values(BUCKET_CONFIGS).filter(b => !b.public);
}
