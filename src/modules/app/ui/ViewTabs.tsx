'use client';

import { useLayoutEffect, useRef } from 'react';

/**
 * Tabs for saved views over a list, each with its count. The highlight is one
 * pill that slides to the active tab (measured after layout, moved with a
 * transform — no state, no re-render).
 */
export default function ViewTabs({
  views, active, counts, onChange, label = 'Views',
}: {
  views: { id: string; label: string }[];
  active: string;
  counts: Record<string, number>;
  onChange: (id: string) => void;
  label?: string;
}) {
  const list = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = list.current?.querySelector<HTMLElement>(`[data-tab="${CSS.escape(active)}"]`);
    const p = pill.current;
    if (!el || !p) return;
    p.style.width = `${el.offsetWidth}px`;
    p.style.height = `${el.offsetHeight}px`;
    p.style.transform = `translate(${el.offsetLeft}px, ${el.offsetTop}px)`;
    p.style.opacity = '1';
  }, [active, counts]);

  return (
    <div ref={list} role="tablist" aria-label={label} className="relative flex flex-wrap gap-1">
      <span ref={pill} aria-hidden className="ds-tab-pill pointer-events-none absolute left-0 top-0 rounded-md bg-[var(--ds-subtle-2)] opacity-0" />
      {views.map((v) => (
        <button
          key={v.id}
          type="button"
          role="tab"
          data-tab={v.id}
          aria-selected={active === v.id}
          onClick={() => onChange(v.id)}
          className={`relative flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] transition-colors ${
            active === v.id ? 'font-medium text-[var(--ds-text)]' : 'text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)]'
          }`}
        >
          {v.label}
          <span className="ds-figure text-[11px] text-[var(--ds-text-3)]">{counts[v.id] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
