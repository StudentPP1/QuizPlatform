import { useEffect, useRef } from "react";

export const useObserver = (
  ref: any,
  isLoading: boolean,
  callback: () => void
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!isLoading && ref.current) {
      if (observer.current) {
        observer.current.disconnect();
      }

      const cb: IntersectionObserverCallback = (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      };

      observer.current = new IntersectionObserver(cb);
      observer.current.observe(ref.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, callback, ref]);
};
