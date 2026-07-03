import { BaseEngine } from './base-engine';
export class EngineRegistry {
  private items = new Map<string, BaseEngine>();
  register(e: BaseEngine) { this.items.set(e.id, e); }
  get(id: string) { return this.items.get(id); }
  getAll() { return Array.from(this.items.values()); }
}
