'use client';

import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * What to do with the rows selected in a worklist (x, or the row checkbox):
 * a bar that floats at the foot of the screen while anything is selected.
 * Escape or Clear empties the selection.
 */
export default function BulkBar({ count, onClear, children }: { count: number; onClear: () => void; children: ReactNode }) {
  if (count === 0) return null;
  return createPortal(
    <div
      role="toolbar"
      aria-label={`${count} selected`}
      className="ds-pop fixed inset-x-0 bottom-5 z-[55] mx-auto flex w-fit max-w-[calc(100vw-2rem)] flex-wrap items-center gap-2 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] py-1.5 pl-3.5 pr-1.5 shadow-[var(--ds-shadow-md)]"
    >
      <span className="ds-figure text-[13px] font-medium text-[var(--ds-text)]">{count} selected</span>
      <span aria-hidden className="mx-1 h-4 w-px bg-[var(--ds-border)]" />
      {children}
      <button
        type="button"
        onClick={onClear}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-[var(--ds-text-3)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
      >
        Clear <kbd className="ds-kbd">Esc</kbd>
      </button>
    </div>,
    document.querySelector('.demo-root') ?? document.body,
  );
}

/** A button in the bulk bar. */
export function BulkAction({ onClick, children }: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-[var(--ds-border-strong)] bg-[var(--ds-panel)] px-2.5 py-1 text-[12px] font-medium text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
    >
      {children}
    </button>
  );
}
