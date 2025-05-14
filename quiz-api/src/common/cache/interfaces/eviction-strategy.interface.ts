import { CacheEntry } from '@common/cache/interfaces/cache-entry.interface';

export interface EvictionStrategy {
  evict(cache: Map<string, CacheEntry>): void;

  isStale?(entry: CacheEntry): boolean;
}
