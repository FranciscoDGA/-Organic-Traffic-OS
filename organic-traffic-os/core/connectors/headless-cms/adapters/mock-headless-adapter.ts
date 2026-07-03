import { HeadlessAdapter } from './headless-adapter.interface';

export class MockHeadlessAdapter implements HeadlessAdapter {
  private connected = false;
  private collections = [
    { uid: 'articles', name: 'Artigos' },
    { uid: 'pages', name: 'Páginas' },
    { uid: 'posts', name: 'Posts' },
  ];
  private content: any[] = [
    { id: '1', title: 'Guia de Concursos Públicos', slug: 'guia-concursos', status: 'published', excerpt: 'Como passar em concursos', updated_at: '2026-06-15' },
    { id: '2', title: 'Estratégias de Estudo', slug: 'estrategias-estudo', status: 'draft', excerpt: 'Técnicas comprovadas', updated_at: '2026-06-20' },
    { id: '3', title: 'Legislação Essencial', slug: 'legislacao-essential', status: 'published', excerpt: 'Leis mais cobradas', updated_at: '2026-06-25' },
  ];

  async testConnection(): Promise<{ success: boolean; name?: string; error?: string }> {
    this.connected = true;
    return { success: true, name: 'Mock Headless CMS' };
  }

  async listCollections(): Promise<{ uid: string; name: string }[]> {
    return this.collections;
  }

  async listContent(collection: string, limit = 20): Promise<any[]> {
    return this.content.slice(0, limit);
  }

  async getContentBySlug(collection: string, slug: string): Promise<any | null> {
    return this.content.find(c => c.slug === slug) || null;
  }

  async createContent(collection: string, data: Record<string, any>): Promise<any> {
    const newItem = { id: String(this.content.length + 1), ...data, created_at: new Date().toISOString() };
    this.content.push(newItem);
    return newItem;
  }

  async updateContent(collection: string, id: string, data: Record<string, any>): Promise<any> {
    const idx = this.content.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Content not found');
    this.content[idx] = { ...this.content[idx], ...data, updated_at: new Date().toISOString() };
    return this.content[idx];
  }

  async publishContent(collection: string, id: string): Promise<any> {
    const idx = this.content.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Content not found');
    this.content[idx].status = 'published';
    this.content[idx].published_at = new Date().toISOString();
    return this.content[idx];
  }
}
