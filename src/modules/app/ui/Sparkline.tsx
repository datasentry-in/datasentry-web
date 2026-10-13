/**
 * A small trend line for a headline number — where it has been, not just where
 * it is. Points are evenly spaced; the last one is marked.
 */
export default function Sparkline({
  values, width = 96, height = 24, color = 'var(--ds-accent)', label,
}: { values: number[]; width?: number; height?: number; color?: string; label: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 2;
  const pts = values.map((v, i) => [
    pad + (i * (width - pad * 2)) / (values.length - 1),
    pad + (1 - (v - min) / span) * (height - pad * 2),
  ]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={label}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r="2.25" fill={color} />
    </svg>
  );
}
