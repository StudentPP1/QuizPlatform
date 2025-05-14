import { CacheEntry } from '@common/cache/interfaces/cache-entry.interface';
import { EvictionStrategy } from '@common/cache/interfaces/eviction-strategy.interface';

export class LFUStrategy implements EvictionStrategy {
  constructor(private maxSize: number = Infinity) {}

  evict(cache: Map<string, CacheEntry>): void {
    if (cache.size < this.maxSize) return;

    let leastUsedKey: string | null = null;
    let minFreq = Infinity;
    let oldest = Infinity;

    for (const [key, entry] of cache.entries()) {
      if (
        entry.frequency < minFreq ||
        (entry.frequency === minFreq && entry.createdAt < oldest)
      ) {
        minFreq = entry.frequency;
        oldest = entry.createdAt;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      cache.delete(leastUsedKey);
    }
  }
}
