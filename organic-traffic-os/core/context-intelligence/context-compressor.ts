import { ContextSource } from './context.types';

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function compressSources(sources: ContextSource[], maxTokens: number): { compressed: ContextSource[]; discarded: number } {
  let totalTokens = 0;
  const compressed: ContextSource[] = [];
  let discarded = 0;

  for (const source of sources) {
    const tokens = estimateTokens(source.data);
    if (totalTokens + tokens <= maxTokens) {
      compressed.push(source);
      totalTokens += tokens;
    } else {
      discarded++;
    }
  }

  return { compressed, discarded };
}

export function removeDuplicates(sources: ContextSource[]): ContextSource[] {
  const seen = new Set<string>();
  return sources.filter(s => {
    const key = s.data.slice(0, 100);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
