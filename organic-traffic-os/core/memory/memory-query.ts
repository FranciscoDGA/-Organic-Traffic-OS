import { MemoryRecord, MemoryQuery, MemoryQueryResult, MemoryStats, MemoryType, MemoryCategory } from './memory.types';

export function queryMemory(memories: MemoryRecord[], query: MemoryQuery): MemoryQueryResult {
  let results = [...memories];

  if (query.type) results = results.filter(m => m.type === query.type);
  if (query.category) results = results.filter(m => m.category === query.category);
  if (query.tags && query.tags.length > 0) {
    results = results.filter(m => query.tags!.some(t => m.tags.includes(t)));
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    results = results.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.learning.toLowerCase().includes(q));
  }

  const total = results.length;
  const offset = query.offset || 0;
  const limit = query.limit || 50;
  results = results.slice(offset, offset + limit);

  return { records: results, total };
}

export function getMemoryStats(memories: MemoryRecord[]): MemoryStats {
  const byType = {} as Record<MemoryType, number>;
  const byCategory = {} as Record<MemoryCategory, number>;
  let confidenceSum = 0;

  memories.forEach(m => {
    byType[m.type] = (byType[m.type] || 0) + 1;
    byCategory[m.category] = (byCategory[m.category] || 0) + 1;
    confidenceSum += m.confidence;
  });

  return {
    totalRecords: memories.length,
    byType,
    byCategory,
    avgConfidence: memories.length > 0 ? confidenceSum / memories.length : 0,
  };
}
