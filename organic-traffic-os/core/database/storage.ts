export const STORAGE_BUCKETS = [
  { name: 'articles', description: 'Published articles and HTML', public: true, fileSizeLimit: 10485760, mimeTypes: ['text/html', 'text/markdown', 'application/json'] },
  { name: 'drafts', description: 'Content drafts', public: false, fileSizeLimit: 5242880, mimeTypes: ['text/markdown', 'text/plain', 'application/json'] },
  { name: 'images', description: 'Article images and assets', public: true, fileSizeLimit: 10485760, mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'] },
  { name: 'generated-images', description: 'AI-generated images', public: false, fileSizeLimit: 10485760, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  { name: 'schemas', description: 'Database schemas and migrations', public: false, fileSizeLimit: 1048576, mimeTypes: ['text/plain', 'application/json'] },
  { name: 'exports', description: 'Data exports', public: false, fileSizeLimit: 52428800, mimeTypes: ['text/csv', 'application/json', 'application/pdf'] },
  { name: 'imports', description: 'Data imports', public: false, fileSizeLimit: 52428800, mimeTypes: ['text/csv', 'application/json'] },
  { name: 'reports', description: 'Generated reports', public: false, fileSizeLimit: 52428800, mimeTypes: ['application/pdf', 'text/csv', 'application/json'] },
  { name: 'playbooks', description: 'Editorial playbooks', public: false, fileSizeLimit: 5242880, mimeTypes: ['text/markdown', 'application/json'] },
  { name: 'logs', description: 'Application logs', public: false, fileSizeLimit: 52428800, mimeTypes: ['text/plain', 'application/json'] },
  { name: 'backups', description: 'Database backups', public: false, fileSizeLimit: 104857600, mimeTypes: ['application/octet-stream', 'application/gzip'] },
  { name: 'temporary', description: 'Temporary files', public: false, fileSizeLimit: 10485760, mimeTypes: ['*'] },
  { name: 'workspace-assets', description: 'Workspace-specific assets', public: false, fileSizeLimit: 10485760, mimeTypes: ['image/*', 'text/*'] },
  { name: 'videos', description: 'Video content', public: false, fileSizeLimit: 104857600, mimeTypes: ['video/mp4', 'video/webm'] },
  { name: 'ebooks', description: 'Generated ebooks', public: false, fileSizeLimit: 52428800, mimeTypes: ['application/pdf'] },
  { name: 'datasets', description: 'Training and analysis datasets', public: false, fileSizeLimit: 104857600, mimeTypes: ['application/json', 'text/csv', 'application/octet-stream'] },
] as const;

export type StorageBucketName = typeof STORAGE_BUCKETS[number]['name'];

export interface BucketInfo {
  name: string;
  description: string;
  public: boolean;
  fileSizeLimit: number;
  mimeTypes: readonly string[];
}

export function getBuckets(): BucketInfo[] {
  return STORAGE_BUCKETS.map(b => ({ ...b }));
}

export function getBucket(name: string): BucketInfo | undefined {
  return STORAGE_BUCKETS.find(b => b.name === name);
}

export function getPublicBuckets(): BucketInfo[] {
  return STORAGE_BUCKETS.filter(b => b.public);
}

export function getPrivateBuckets(): BucketInfo[] {
  return STORAGE_BUCKETS.filter(b => !b.public);
}

export function getTotalBuckets(): number {
  return STORAGE_BUCKETS.length;
}
