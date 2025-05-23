import { useEffect, useState, useRef } from "react";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

// global cache for all components (available until page reload)
export const globalCache = new Map<string, CacheEntry<any>>();

interface UseCachedFetchOptions {
  ttl?: number;
}

export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  { ttl = 60000 }: UseCachedFetchOptions = {}
): { data: T | null; loading: boolean; error: any } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const isMounted = useRef(true); // Track if the component is loaded in DOM

  useEffect(() => {
    isMounted.current = true;

    async function loadData() {
      setLoading(true);
      const cached = globalCache.get(key);
      console.log("Cached data for key:", key, cached);
      const now = Date.now();

      if (cached && now - cached.timestamp < ttl) {
        console.log("Using cached data for key:", key);
        setData(cached.data);
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        console.log("Fetching data for key:", key);
        const result = await fetcher();
        const currentTime = Date.now();
        globalCache.set(key, { data: result, timestamp: currentTime });
        // Check if the component is still rendering before setting state
        if (isMounted.current) {
          setData(result);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
      // find all keys with ttl not valid and delete them
      for (const [key, cacheData] of globalCache.entries()) {
        if (now - cacheData.timestamp >= ttl) {
          globalCache.delete(key);
        }
      }
    }

    loadData();

    // Set up an interval to refresh the data every `ttl` milliseconds
    const interval = setInterval(loadData, ttl);

    // clean up after the component is unmounted or the key changes
    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [key, fetcher, ttl]);

  return { data, loading, error };
}
