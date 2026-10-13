'use client';

import { useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { EXIT_MS } from './motion';
import { useOverlay } from './useOverlay';

/**
 * A record opened beside its list — the list stays where it was. Slides in
 * from the right and out again; closes on Esc, the backdrop or the close
 * button; keeps focus inside and returns it on close. Portals into
 * `.demo-root` for the same reason as `Dialog`.
 */
export default function Sheet({
  open, onClose, title, meta, children, footer,
}: { open: boolean; onClose: () => void; title: ReactNode; meta?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  const { panel, close, state } = useOverlay({ open, onClose, exitMs: EXIT_MS.base });
  const titleId = useId();

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div aria-hidden data-state={state} className="ds-scrim absolute inset-0 bg-[rgba(14,15,17,0.16)]" onClick={close} />
      <aside
        ref={panel as React.RefObject<HTMLElement>}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-state={state}
        className="ds-sheet absolute inset-y-0 right-0 flex w-full max-w-[34rem] flex-col border-l border-[var(--ds-border)] bg-[var(--ds-panel)] shadow-[0_0_48px_rgba(14,15,17,0.14)] outline-none"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--ds-border)] px-5 py-4">
          <div className="min-w-0">
            {meta && <div className="mb-1 flex flex-wrap items-center gap-1.5">{meta}</div>}
            <h2 id={titleId} className="text-[15px] font-semibold leading-snug tracking-[-0.015em]">{title}</h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--ds-text-3)] hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </button>
        </header>
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <footer className="flex flex-wrap items-center gap-2 border-t border-[var(--ds-border)] px-5 py-3">{footer}</footer>}
      </aside>
    </div>,
    document.querySelector('.demo-root') ?? document.body,
  );
}

/** A labelled block inside a sheet. */
export function SheetSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="ds-meta mb-2 text-[var(--ds-text-3)]">{title}</h3>
      {children}
    </section>
  );
}
