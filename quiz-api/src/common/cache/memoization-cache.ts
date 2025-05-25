import { HttpException, HttpStatus } from '@nestjs/common';

import { CacheEntry } from '@common/cache/interfaces/cache-entry.interface';
import { EvictionStrategy } from '@common/cache/interfaces/eviction-strategy.interface';

export class MemoizationCache {
  private cache = new Map<string, CacheEntry>();

  constructor(private strategy: EvictionStrategy) {}

  getOrCompute(key: string, computeFn: () => any): any {
    const entry = this.cache.get(key);

    if (entry) {
      if (this.strategy.isStale?.(entry)) {
        this.remove(key);
      } else {
        entry.frequency += 1;
        entry.lastAccessed = Date.now();
        return entry.value;
      }
    }

    try {
      const value = computeFn();

      if (!value || (Array.isArray(value) && !value?.length)) {
        return value;
      }

      this.set(key, value);
      return value;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async getOrComputeAsync(
    key: string,
    computeFn: () => Promise<any>,
  ): Promise<any> {
    const entry = this.cache.get(key);

    if (entry) {
      if (this.strategy.isStale?.(entry)) {
        this.remove(key);
      } else {
        entry.frequency += 1;
        entry.lastAccessed = Date.now();
        return entry.value;
      }
    }

    try {
      const value = await computeFn();

      if (!value || (Array.isArray(value) && !value?.length)) {
        return value;
      }

      this.set(key, value);
      return value;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  remove(key: string): void {
    this.cache.delete(key);
  }

  set(key: string, value: unknown): void {
    this.strategy.evict(this.cache);

    this.cache.set(key, {
      value,
      frequency: 1,
      lastAccessed: Date.now(),
      createdAt: Date.now(),
    });
  }
}
