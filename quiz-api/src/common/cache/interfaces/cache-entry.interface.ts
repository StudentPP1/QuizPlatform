export interface CacheEntry {
  value: any;
  usageCount: number;
  lastAccessed: number;
  createdAt: number;
}
