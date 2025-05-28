import { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_PAGINATION_FROM,
  DEFAULT_PAGINATION_SIZE,
} from "../constants/constants";

type FetchFunction<T> = (from: number, to: number, id?: any) => Promise<T[]>;

type UsePaginatedDataProps<T> = {
  fetchFunction: FetchFunction<T>;
  observerTarget: any;
  id?: any;
  dependencies?: any[]; // [tab], [searchText], [userId]
  useObserverHook: (
    target: Element | null,
    isLoading: boolean,
    onIntersect: () => void
  ) => void;
  initFrom?: number;
  initSize?: number;
};

export function usePaginatedData<T>({
  fetchFunction,
  observerTarget,
  id = null,
  dependencies = [],
  useObserverHook,
  initFrom = DEFAULT_PAGINATION_FROM,
  initSize = DEFAULT_PAGINATION_SIZE,
}: UsePaginatedDataProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [from, setFrom] = useState(initFrom);
  const [to, setTo] = useState(initSize);
  const [isLoading, setLoading] = useState(false);

  const fetchItems = useCallback(() => {
    if (isLoading) return;
    setLoading(true);
    fetchFunction(from, to, id)
      .then((data) => {
        setItems((prev) => [...prev, ...data]);
        setFrom((prev) => prev + initSize);
        setTo((prev) => prev + initSize);
      })
      .finally(() => setLoading(false));
  }, [from, to, id, fetchFunction, isLoading, initSize]);

  const resetPagination = useCallback(() => {
    setItems([]);
    setFrom(1);
    setTo(initSize);
  }, [initSize]);

  // Reset pagination when dependencies change
  useEffect(() => {
    resetPagination();
  }, [...dependencies]);

  useEffect(() => {
    if (items.length === 0) {
      fetchItems();
    }
  }, [items.length, fetchItems]);

  useObserverHook(observerTarget, isLoading, fetchItems);

  return {
    items,
    isLoading,
    resetPagination,
  };
}
