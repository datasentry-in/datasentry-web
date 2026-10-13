'use client';

import { useId } from 'react';
import { useClosable } from './useClosable';

export type DisplayOption = { id: string; label: string };

const SELECT =
  'h-7 min-w-0 flex-1 rounded-md border border-[var(--ds-border)] bg-[var(--ds-panel)] px-2 text-[12px] text-[var(--ds-text)] outline-none focus:border-[var(--ds-accent)]';

/**
 * How a worklist is laid out — its order and, where it has them, its groups —
 * behind one "Display" button, so the list itself carries no column heads.
 */
export default function DisplayMenu({
  orders, order, dir, onOrder, onFlip, groups, group, onGroup,
}: {
  orders: DisplayOption[];
  order: string;
  dir: 1 | -1;
  onOrder: (id: string) => void;
  onFlip: () => void;
  groups?: DisplayOption[];
  group?: string;
  onGroup?: (id: string) => void;
}) {
  const menu = useClosable();
  const ids = { group: useId(), order: useId() };
  return (
    <div className="relative">
      <button
        type="button"
        onClick={menu.toggle}
        aria-expanded={menu.open}
        aria-haspopup="dialog"
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--ds-border)] px-2.5 text-[13px] text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <path d="M2.5 4.5h6M11.5 4.5h2M2.5 11.5h2M7.5 11.5h6" />
          <circle cx="10" cy="4.5" r="1.5" />
          <circle cx="6" cy="11.5" r="1.5" />
        </svg>
        Display
      </button>
      {menu.open && (
        <>
          <div aria-hidden className="fixed inset-0 z-40" onClick={menu.close} />
          <div
            role="dialog"
            aria-label="Display options"
            data-state={menu.state}
            className="ds-pop ds-origin-tr absolute right-0 z-50 mt-1.5 w-72 space-y-2.5 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] p-3 shadow-[var(--ds-shadow-md)]"
          >
            {groups && onGroup && (
              <div className="flex items-center gap-3">
                <label htmlFor={ids.group} className="w-20 shrink-0 text-[12px] text-[var(--ds-text-2)]">Grouping</label>
                <select id={ids.group} value={group} onChange={(e) => onGroup(e.target.value)} className={SELECT}>
                  {groups.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
                </select>
              </div>
            )}
            <div className="flex items-center gap-3">
              <label htmlFor={ids.order} className="w-20 shrink-0 text-[12px] text-[var(--ds-text-2)]">Ordering</label>
              <select id={ids.order} value={order} onChange={(e) => onOrder(e.target.value)} className={SELECT}>
                {orders.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
              <button
                type="button"
                onClick={onFlip}
                aria-label={dir === 1 ? 'Ascending — reverse the order' : 'Descending — reverse the order'}
                title={dir === 1 ? 'Ascending' : 'Descending'}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--ds-border)] text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={dir === 1 ? 'M5 3v10M2.5 10.5 5 13l2.5-2.5M9 4h4.5M9 8h3M9 12h1.5' : 'M5 13V3M2.5 5.5 5 3l2.5 2.5M9 4h1.5M9 8h3M9 12h4.5'} />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
