import { MemoryRecord, MemoryQuery, MemoryQueryResult, MemoryStats } from './memory.types';
import { memoryEngine } from './memory-engine';
import { memoryRegistry } from './memory-registry';
import { queryMemory, getMemoryStats } from './memory-query';
import { buildMemoryContext, MemoryContext } from './memory-context';

class MemoryService {
  save(record: MemoryRecord): MemoryRecord {
    return memoryEngine.saveMemory(record);
  }

  getAll(workspaceId: string): MemoryRecord[] {
    return memoryEngine.loadMemory(workspaceId);
  }

  update(id: string, updates: Partial<MemoryRecord>): MemoryRecord | null {
    return memoryEngine.updateMemory(id, updates);
  }

  delete(id: string): boolean {
    return memoryEngine.deleteMemory(id);
  }

  search(workspaceId: string, query: string): MemoryRecord[] {
    return memoryEngine.searchMemory(workspaceId, query);
  }

  query(workspaceId: string, query: MemoryQuery): MemoryQueryResult {
    const memories = memoryEngine.loadMemory(workspaceId);
    return queryMemory(memories, query);
  }

  stats(workspaceId: string): MemoryStats {
    return getMemoryStats(memoryEngine.loadMemory(workspaceId));
  }

  context(workspaceId: string): MemoryContext {
    return buildMemoryContext(workspaceId, memoryEngine.loadMemory(workspaceId));
  }

  rank(workspaceId: string): MemoryRecord[] {
    return memoryEngine.rankMemory(workspaceId);
  }

  merge(workspaceId: string) {
    return memoryEngine.mergeMemory(workspaceId);
  }
}

export const memoryService = new MemoryService();
