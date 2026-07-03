import { BaseAgent } from './base-agent';
export class AgentRegistry {
  private items = new Map<string, BaseAgent>();
  register(a: BaseAgent) { this.items.set(a.id, a); }
  get(id: string) { return this.items.get(id); }
  getAll() { return Array.from(this.items.values()); }
}
