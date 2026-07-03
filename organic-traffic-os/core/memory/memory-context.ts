import { MemoryRecord } from './memory.types';

export interface MemoryContext {
  workspaceId: string;
  recentMemories: MemoryRecord[];
  topLearnings: MemoryRecord[];
  errors: MemoryRecord[];
  patterns: MemoryRecord[];
}

export function buildMemoryContext(workspaceId: string, memories: MemoryRecord[]): MemoryContext {
  const recent = [...memories].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
  const topLearnings = memories.filter(m => m.category === 'insight').sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  const errors = memories.filter(m => m.category === 'error');
  const patterns = memories.filter(m => m.category === 'pattern');
  return { workspaceId, recentMemories: recent, topLearnings, errors, patterns };
}
