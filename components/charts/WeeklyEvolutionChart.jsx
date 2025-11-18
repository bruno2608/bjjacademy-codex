'use client';

import { useMemo } from 'react';

export default function WeeklyEvolutionChart({ data }) {
  const { points, maxY } = useMemo(() => {
    if (!data?.length) return { points: [], maxY: 0 };
    const max = Math.max(...data.map((d) => d.confirmed + d.pending + (d.absent || 0)), 1);
    const mapped = data.map((item, idx) => ({
      x: (idx / Math.max(data.length - 1, 1)) * 100,
      confirmed: item.confirmed || 0,
      pending: item.pending || 0,
      absent: item.absent || 0,
      label: item.label
    }));
    return { points: mapped, maxY: max };
  }, [data]);

  if (!points.length) {
    return <div className="flex h-full items-center justify-center text-sm opacity-70">Sem dados suficientes.</div>;
  }

  const buildPath = (selector) => {
    return points
      .map((p, idx) => {
        const yVal = selector(p);
        const y = 90 - (yVal / Math.max(maxY, 1)) * 80;
        const x = p.x;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');
  };

  const confirmedPath = buildPath((p) => p.confirmed);
  const pendingPath = buildPath((p) => p.confirmed + p.pending * 0.7);

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="confirmedGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="pendingGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="100" height="100" fill="url(#gridGradient)" />
      <g className="opacity-50" stroke="#1f2937" strokeWidth="0.4">
        {[...Array(5)].map((_, idx) => {
          const y = 10 + idx * 18;
          return <line key={y} x1="0" y1={y} x2="100" y2={y} />;
        })}
      </g>

      <path d={`${pendingPath} V 100 H 0 Z`} fill="url(#pendingGradient)" className="opacity-70" />
      <path d={`${confirmedPath} V 100 H 0 Z`} fill="url(#confirmedGradient)" className="opacity-80" />

      <path d={pendingPath} stroke="#fbbf24" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={confirmedPath} stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />

      {points.map((p) => {
        const y = 90 - (p.confirmed / Math.max(maxY, 1)) * 80;
        const yPending = 90 - ((p.confirmed + p.pending * 0.7) / Math.max(maxY, 1)) * 80;
        return (
          <g key={p.label}>
            <circle cx={p.x} cy={y} r="1.3" fill="#38bdf8" />
            <circle cx={p.x} cy={yPending} r="1.2" fill="#fbbf24" />
          </g>
        );
      })}
    </svg>
  );
}
