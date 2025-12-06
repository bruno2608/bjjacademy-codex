'use client';

import { useEffect, useState } from 'react';

const isDev = process.env.NODE_ENV === 'development';

type ThemeDebugState = {
  theme: string;
  b1: string;
  b2: string;
  bc: string;
  p: string;
};

export function ZkThemeDebug() {
  const [state, setState] = useState<ThemeDebugState>({ theme: '', b1: '', b2: '', bc: '', p: '' });

  useEffect(() => {
    if (!isDev) return;
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const computed = getComputedStyle(root);
    setState({
      theme: root.getAttribute('data-theme') ?? 'undefined',
      b1: computed.getPropertyValue('--b1').trim(),
      b2: computed.getPropertyValue('--b2').trim(),
      bc: computed.getPropertyValue('--bc').trim(),
      p: computed.getPropertyValue('--p').trim()
    });
  }, []);

  if (!isDev) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] rounded-xl border border-base-300 bg-base-200/90 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <div className="font-semibold">Tema: {state.theme || 'desconhecido'}</div>
      <div className="mt-1 space-y-0.5 text-[0.7rem] text-base-content/80">
        <div>b1: {state.b1 || '-'}</div>
        <div>b2: {state.b2 || '-'}</div>
        <div>bc: {state.bc || '-'}</div>
        <div>p: {state.p || '-'}</div>
      </div>
    </div>
  );
}
