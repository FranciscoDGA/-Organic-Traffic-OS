import { CacheEntry } from './ai-intelligence.types';

class ResponseCache {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL = 3600000;

  set(key: string, response: unknown, ttlMs: number = this.defaultTTL): void {
    this.cache.set(key, { key, response, expiresAt: new Date(Date.now() + ttlMs).toISOString() });
  }

  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (new Date(entry.expiresAt) < new Date()) { this.cache.delete(key); return null; }
    return entry.response;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const responseCache = new ResponseCache();
