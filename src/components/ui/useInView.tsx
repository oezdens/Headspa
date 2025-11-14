"use client";

import { useEffect, useState, useCallback } from "react";

export default function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const [node, setNode] = useState<T | null>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  const ref = useCallback((el: T | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;
    
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBeenVisible) {
            setHasBeenVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px", ...options }
    );
    
    obs.observe(node);
    return () => obs.disconnect();
  }, [node, hasBeenVisible, options]);

  return { ref, inView: hasBeenVisible } as const;
}
