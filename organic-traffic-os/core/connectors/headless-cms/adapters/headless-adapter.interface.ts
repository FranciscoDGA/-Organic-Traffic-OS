export interface HeadlessAdapter {
  testConnection(): Promise<{ success: boolean; name?: string; error?: string }>;
  listCollections(): Promise<{ uid: string; name: string }[]>;
  listContent(collection: string, limit?: number): Promise<any[]>;
  getContentBySlug(collection: string, slug: string): Promise<any | null>;
  createContent(collection: string, data: Record<string, any>): Promise<any>;
  updateContent(collection: string, id: string, data: Record<string, any>): Promise<any>;
  publishContent(collection: string, id: string): Promise<any>;
}
