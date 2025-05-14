import { CacheEntry } from '@common/cache/interfaces/cache-entry.interface';
import { EvictionStrategy } from '@common/cache/interfaces/eviction-strategy.interface';

export class TimeStrategy implements EvictionStrategy {
  constructor(public ttl: number = 100) {}

  evict(cache: Map<string, CacheEntry>): void {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (now - entry.createdAt >= this.ttl) {
        cache.delete(key);
      }
    }
  }

  isStale(entry: CacheEntry): boolean {
    const timeInSeconds = Math.floor((Date.now() - entry.createdAt) / 1000);

    return timeInSeconds >= this.ttl;
  }
}
