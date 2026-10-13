import type { ReactNode } from 'react';

/** A vertical history — newest first — used for audit trails and document versions. */
export default function Timeline({
  items, empty,
}: { items: { key: string; title: ReactNode; body?: ReactNode; meta: string }[]; empty: string }) {
  if (items.length === 0) return <p className="text-[13px] text-[var(--ds-text-3)]">{empty}</p>;
  return (
    <ol className="space-y-3 border-l border-[var(--ds-border)] pl-4">
      {items.map((it) => (
        <li key={it.key} className="relative">
          <span aria-hidden className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-[var(--ds-border-strong)] bg-[var(--ds-panel)]" />
          <div className="text-[13px]">{it.title}</div>
          {it.body}
          <p className="text-[11px] text-[var(--ds-text-3)]">{it.meta}</p>
        </li>
      ))}
    </ol>
  );
}
