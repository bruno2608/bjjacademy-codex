'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type NavigationLoadingConfig = {
  /**
   * Delay before showing the loader to avoid flicker on instant navigations.
   */
  delayMs?: number;
  /**
   * Minimum time the loader stays visible once shown.
   */
  minVisibleMs?: number;
};

const DEFAULT_DELAY = 150;
const DEFAULT_MIN_VISIBLE = 350;

export function useNavigationLoading(config: NavigationLoadingConfig = {}) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const startTimer = useRef<number | null>(null);
  const stopTimer = useRef<number | null>(null);

  const delayMs = config.delayMs ?? DEFAULT_DELAY;
  const minVisibleMs = config.minVisibleMs ?? DEFAULT_MIN_VISIBLE;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    if (startTimer.current) window.clearTimeout(startTimer.current);
    if (stopTimer.current) window.clearTimeout(stopTimer.current);

    startTimer.current = window.setTimeout(() => setIsNavigating(true), delayMs);
    stopTimer.current = window.setTimeout(() => setIsNavigating(false), delayMs + minVisibleMs);

    return () => {
      if (startTimer.current) window.clearTimeout(startTimer.current);
      if (stopTimer.current) window.clearTimeout(stopTimer.current);
    };
  }, [pathname, delayMs, minVisibleMs]);

  return { isNavigating };
}
