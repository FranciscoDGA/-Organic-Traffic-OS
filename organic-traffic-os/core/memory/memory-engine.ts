import { MemoryRecord, MemoryType, MemoryCategory } from './memory.types';

class MemoryEngine {
  private memories: Map<string, MemoryRecord[]> = new Map();

  saveMemory(record: MemoryRecord): MemoryRecord {
    const list = this.memories.get(record.workspaceId) || [];
    list.push(record);
    this.memories.set(record.workspaceId, list);
    return record;
  }

  loadMemory(workspaceId: string): MemoryRecord[] {
    return this.memories.get(workspaceId) || [];
  }

  updateMemory(id: string, updates: Partial<MemoryRecord>): MemoryRecord | null {
    for (const list of this.memories.values()) {
      const idx = list.findIndex(m => m.id === id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
        return list[idx];
      }
    }
    return null;
  }

  archiveMemory(id: string): boolean {
    for (const [ws, list] of this.memories.entries()) {
      const idx = list.findIndex(m => m.id === id);
      if (idx >= 0) {
        list.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  deleteMemory(id: string): boolean {
    return this.archiveMemory(id);
  }

  searchMemory(workspaceId: string, query: string): MemoryRecord[] {
    const list = this.memories.get(workspaceId) || [];
    const q = query.toLowerCase();
    return list.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.learning.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q)));
  }

  rankMemory(workspaceId: string): MemoryRecord[] {
    const list = this.memories.get(workspaceId) || [];
    return [...list].sort((a, b) => b.confidence - a.confidence);
  }

  mergeMemory(workspaceId: string): { merged: number; records: MemoryRecord[] } {
    const list = this.memories.get(workspaceId) || [];
    const seen = new Map<string, MemoryRecord>();
    list.forEach(m => {
      const key = `${m.type}-${m.title}`;
      const existing = seen.get(key);
      if (existing && existing.confidence < m.confidence) {
        seen.set(key, m);
      } else if (!existing) {
        seen.set(key, m);
      }
    });
    const records = Array.from(seen.values());
    this.memories.set(workspaceId, records);
    return { merged: list.length - records.length, records };
  }
}

export const memoryEngine = new MemoryEngine();
