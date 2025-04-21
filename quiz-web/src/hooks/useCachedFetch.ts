import { useEffect, useState, useRef } from "react";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const globalCache = new Map<string, CacheEntry<any>>();

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
      const now = Date.now();

      if (cached && now - cached.timestamp < ttl) {
        setData(cached.data);
        setLoading(false);
      } else {
        try {
          const result = await fetcher();
          if (isMounted.current) { // Check if the component is still rendering before setting state
            globalCache.set(key, { data: result, timestamp: now });
            setData(result);
          }
        } catch (err) {
          if (isMounted.current) setError(err);
        } finally {
          if (isMounted.current) setLoading(false);
        }
      }
    }

    loadData();

    const interval = setInterval(loadData, ttl);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [key, fetcher, ttl]);

  return { data, loading, error };
}
