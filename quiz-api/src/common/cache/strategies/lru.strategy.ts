import { CacheEntry } from '@common/cache/interfaces/cache-entry.interface';
import { EvictionStrategy } from '@common/cache/interfaces/eviction-strategy.interface';

export class LRUStrategy implements EvictionStrategy {
  constructor(private maxSize: number = Infinity) {}

  evict(cache: Map<string, CacheEntry>): void {
    if (cache.size < this.maxSize) return;

    let leastRecentlyUsedKey: string | null = null;
    let oldestAccess = Infinity;

    for (const [key, entry] of cache.entries()) {
      if (entry.lastAccessed < oldestAccess) {
        oldestAccess = entry.lastAccessed;
        leastRecentlyUsedKey = key;
      }
    }

    cache.delete(leastRecentlyUsedKey);
  }
}
