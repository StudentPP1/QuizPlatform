import { CacheEntry } from '@common/cache/interfaces/cache-entry.interface';
import { EvictionStrategy } from '@common/cache/interfaces/eviction-strategy.interface';

export class LFUStrategy implements EvictionStrategy {
  constructor(private maxSize: number = Infinity) {}

  evict(cache: Map<string, CacheEntry>): void {
    if (cache.size < this.maxSize) return;

    let leastUsedKey: string | null = null;
    let minFrequency = Infinity;

    for (const [key, entry] of cache.entries()) {
      const ageInSeconds = (Date.now() - entry.createdAt) / 1000;
      const frequency =
        ageInSeconds > 0 ? entry.usageCount / ageInSeconds : entry.usageCount;

      if (frequency < minFrequency) {
        minFrequency = frequency;
        leastUsedKey = key;
      }
    }

    cache.delete(leastUsedKey);
  }
}
