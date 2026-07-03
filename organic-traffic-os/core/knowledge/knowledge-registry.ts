import { KnowledgeProvider } from './knowledge-provider';
export class KnowledgeRegistry {
  private items = new Map<string, KnowledgeProvider>();
  register(p: KnowledgeProvider) { this.items.set(p.id, p); }
  get(id: string) { return this.items.get(id); }
  getAll() { return Array.from(this.items.values()); }
}
