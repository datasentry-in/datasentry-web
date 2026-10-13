'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A small time-series chart: values at real dates (spaced by time, not by
 * index), month labels along the bottom, two or three labelled gridlines, the
 * first and last values printed, and every point's date and value on hover.
 * Drawn at its container's real pixel width (measured), so labels stay a
 * readable size however wide the cell is.
 */

type Point = { at: number; value: number; label: string };

const H = 116;
const PAD = { top: 16, right: 16, bottom: 22, left: 28 };
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TrendChart(props: { points: Point[]; color?: string; label: string; unit?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="w-full" style={{ height: H }}>
      {width > 0 && <Chart {...props} W={width} />}
    </div>
  );
}

function Chart({
  points, color = 'var(--ds-accent)', label, unit = '', W,
}: { points: Point[]; color?: string; label: string; unit?: string; W: number }) {
  if (points.length < 2) return null;

  const t0 = points[0].at;
  const t1 = points[points.length - 1].at;
  const lo = Math.max(0, Math.floor((Math.min(...points.map((p) => p.value)) - 4) / 10) * 10);
  const hi = Math.min(100, Math.ceil((Math.max(...points.map((p) => p.value)) + 4) / 10) * 10);
  const x = (t: number) => PAD.left + ((t - t0) / (t1 - t0 || 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - (v - lo) / (hi - lo || 1)) * (H - PAD.top - PAD.bottom);

  // Gridlines every 10.
  const grid: number[] = [];
  for (let v = lo; v <= hi; v += 10) grid.push(v);
  // Every line up to four; beyond that every other one, always keeping the top and bottom.
  const gridShown = grid.length > 4 ? grid.filter((_, i) => i % 2 === 0 || i === grid.length - 1) : grid;

  // A tick at the first of each month inside the range, plus the first point's month.
  const ticks: { at: number; text: string }[] = [];
  const first = new Date(t0);
  ticks.push({ at: t0, text: MONTH[first.getUTCMonth()] });
  const d = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 1));
  while (d.getTime() <= t1) {
    // Skip a month start too close to the first label to fit beside it.
    if (x(d.getTime()) - x(t0) > 34) ticks.push({ at: d.getTime(), text: MONTH[d.getUTCMonth()] });
    d.setUTCMonth(d.getUTCMonth() + 1);
  }

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.at).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ');
  const area = `${line} L${x(t1).toFixed(1)} ${H - PAD.bottom} L${x(t0).toFixed(1)} ${H - PAD.bottom} Z`;
  const gid = `trend-${label.replace(/\W/g, '')}`;
  const last = points[points.length - 1];

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-label={label}>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {gridShown.map((v) => (
        <g key={v}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="var(--ds-border)" strokeDasharray={v === lo ? undefined : '2 3'} />
          <text x={PAD.left - 6} y={y(v) + 3} textAnchor="end" fontSize="10.5" fill="var(--ds-text-3)" fontFamily="DM Mono, monospace">
            {v}
          </text>
        </g>
      ))}

      {ticks.map((tk) => (
        <text key={tk.at} x={x(tk.at)} y={H - 5} textAnchor={tk.at === t0 ? 'start' : 'middle'} fontSize="11" fill="var(--ds-text-3)">
          {tk.text}
        </text>
      ))}

      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p, i) => {
        const end = i === points.length - 1;
        return (
          <g key={p.at}>
            <circle cx={x(p.at)} cy={y(p.value)} r={end ? 3.5 : 2.5} fill={end ? color : 'var(--ds-panel)'} stroke={color} strokeWidth="1.5" />
            {/* A wide invisible target so the hover works on a small point. */}
            <circle cx={x(p.at)} cy={y(p.value)} r="9" fill="transparent">
              <title>{`${p.label}: ${p.value}${unit}`}</title>
            </circle>
          </g>
        );
      })}

      <text x={x(t0)} y={y(points[0].value) - 7} textAnchor="start" fontSize="11" fill="var(--ds-text-2)" fontFamily="DM Mono, monospace">
        {points[0].value}
      </text>
      <text x={x(last.at)} y={y(last.value) - 8} textAnchor="end" fontSize="11.5" fontWeight="600" fill={color} fontFamily="DM Mono, monospace">
        {last.value}
      </text>
    </svg>
  );
}
