export class WorkflowRegistry {
  private items = new Map<string, any>();
  register(w: any) { this.items.set(w.id, w); }
  getAll() { return Array.from(this.items.values()); }
}
