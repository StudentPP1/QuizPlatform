import { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_PAGINATION_FROM,
  DEFAULT_PAGINATION_SIZE,
} from "../constants/constants";

type FetchFunction<T> = (from: number, to: number, id?: any) => Promise<T[]>;

type UsePaginatedDataProps<T> = {
  fetchFunction: FetchFunction<T>;
  observerTarget: any;
  data?: any;
  dependencies?: any[]; // [tab], [searchText], [userId]
  useObserverHook: (
    target: Element | null,
    isLoading: boolean,
    onIntersect: () => void
  ) => void;
  initFrom?: number;
  size?: number;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export function usePaginatedData<T>({
  fetchFunction,
  observerTarget,
  data = null,
  dependencies = [],
  useObserverHook,
  initFrom = DEFAULT_PAGINATION_FROM,
  size = DEFAULT_PAGINATION_SIZE,
  setItems,
  isLoading,
  setLoading,
}: UsePaginatedDataProps<T>) {
  const [from, setFrom] = useState(initFrom);

  const fetchData = async (from: number, to: number, addMode: boolean) => {
    setLoading(true);
    await fetchFunction(from, to, data)
      .then((data) => {
        setItems(addMode ? (prev) => [...prev, ...data] : data);
        setFrom(to + 1);
      })
      .finally(() => setLoading(false));
  };

  const fetchItems = useCallback(() => {
    if (isLoading) return;
    fetchData(from, from + size, true);
  }, [from, data, fetchFunction, isLoading, size]);

  const resetPagination = useCallback(() => {
    setItems([]);
    setFrom(initFrom);
  }, [size]);

  // Reset data when dependencies change
  useEffect(() => {
    fetchData(initFrom, initFrom + size, false);
  }, [...dependencies]);

  useObserverHook(observerTarget, isLoading, fetchItems);

  return {
    resetPagination,
  };
}
