"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a callback that throttles calls to `fn` to at most one per animation frame
 * (approx. 60 FPS) using requestAnimationFrame. Useful for throttling rapid
 * input change handlers before committing state updates.
 */
export function useRafThrottle<T extends (...args: any[]) => void>(fn: T) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const rafRef = useRef<number | null>(null);
  const lastArgsRef = useRef<any[] | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return useCallback((...args: any[]) => {
    lastArgsRef.current = args;
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (lastArgsRef.current) {
          fnRef.current(...lastArgsRef.current);
          lastArgsRef.current = null;
        }
      });
    }
  }, []) as unknown as T;
}
