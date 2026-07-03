import { MemoryRecord } from './memory.types';
import { memoryEngine } from './memory-engine';
import { buildPassaCumaruMemories, buildGarimpeiBrasilMemories } from './memory-data';

class MemoryRegistry {
  constructor() {
    buildPassaCumaruMemories().forEach(m => memoryEngine.saveMemory(m));
    buildGarimpeiBrasilMemories().forEach(m => memoryEngine.saveMemory(m));
  }

  getAll(workspaceId: string): MemoryRecord[] {
    return memoryEngine.loadMemory(workspaceId);
  }

  getAllWorkspaces(): MemoryRecord[][] {
    return [memoryEngine.loadMemory('passacumaru'), memoryEngine.loadMemory('garimpeibrasil')];
  }
}

export const memoryRegistry = new MemoryRegistry();
