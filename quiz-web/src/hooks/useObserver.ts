import { useEffect, useRef } from "react";

export const useObserver = (
  ref: any, // ref to the DOM element to observe
  isLoading: boolean,
  callback: () => void
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!isLoading && ref.current) {
      if (observer.current) {
        // If there's already an observer, disconnect it to avoid duplicates
        observer.current.disconnect();
      }

      const cb: IntersectionObserverCallback = (entries) => {
        // Check if the observed element is our in view
        if (entries[0].isIntersecting) {
          callback();
        }
      };

      observer.current = new IntersectionObserver(cb);
      // Start observing the DOM element
      observer.current.observe(ref.current);
    }

    // Cleanup function: disconnect the observer when the component unmounts
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, callback, ref]);
};
