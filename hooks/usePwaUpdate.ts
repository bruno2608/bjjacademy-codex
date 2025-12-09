'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type UsePwaUpdateResult = {
  hasUpdate: boolean;
  updateNow: () => void;
};

/**
 * Detects when a new service worker version is waiting and exposes an action to promote it.
 * Designed to run only in the browser; guards against SSR environments.
 */
export function usePwaUpdate(): UsePwaUpdateResult {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const reloadOnControllerChange = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return undefined;
    }

    let isMounted = true;

    const registerWaiting = (reg: ServiceWorkerRegistration | null) => {
      if (!reg || !isMounted) return;
      if (reg.waiting) {
        setHasUpdate(true);
        setRegistration(reg);
      }
    };

    const wireRegistration = (reg: ServiceWorkerRegistration) => {
      registerWaiting(reg);

      const watchInstalling = (worker: ServiceWorker | null) => {
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            registerWaiting(reg);
          }
        });
      };

      reg.addEventListener('updatefound', () => watchInstalling(reg.installing));
      watchInstalling(reg.installing);
    };

    navigator.serviceWorker.ready
      .then((reg) => wireRegistration(reg))
      .catch(() => {
        // ignore registration failures in non-PWA environments
      });

    const onControllerChange = () => {
      if (reloadOnControllerChange.current) {
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      isMounted = false;
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  const updateNow = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (registration?.waiting) {
      reloadOnControllerChange.current = true;
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setHasUpdate(false);
      setRegistration(null);
    } else {
      window.location.reload();
    }
  }, [registration]);

  return { hasUpdate, updateNow };
}
