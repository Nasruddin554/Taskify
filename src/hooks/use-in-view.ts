
import { useState, useEffect, useRef, RefObject } from 'react';

/**
 * Custom hook to detect when an element is in the viewport
 * @param ref Reference to the element to observe
 * @param threshold Percentage of element visibility required to trigger (0-1)
 * @param triggerOnce Whether to stop observing after the element is visible once
 * @returns boolean indicating whether the element is in view
 */
export function useInView(
  ref: RefObject<Element>,
  threshold: number = 0.1,
  triggerOnce: boolean = false
): boolean {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Clean up previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          
          // If triggerOnce is true, stop observing after first detection
          if (triggerOnce && observerRef.current) {
            observerRef.current.disconnect();
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      });
    };

    // Create new observer
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold,
    };

    observerRef.current = new IntersectionObserver(handleIntersect, options);
    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref, threshold, triggerOnce]);

  return isInView;
}
