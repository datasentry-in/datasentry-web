'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * A record opened beside its list — the list stays where it was. Slides in
 * from the right, closes on Esc, the backdrop or the close button. Portals into
 * `.demo-root` for the same reason as `Dialog`.
 */
export default function Sheet({
  open, onClose, title, meta, children, footer,
}: { open: boolean; onClose: () => void; title: ReactNode; meta?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div aria-hidden className="absolute inset-0 bg-[rgba(14,15,17,0.16)]" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        className="ds-sheet absolute inset-y-0 right-0 flex w-full max-w-[34rem] flex-col border-l border-[var(--ds-border)] bg-[var(--ds-panel)] shadow-[0_0_48px_rgba(14,15,17,0.14)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--ds-border)] px-5 py-4">
          <div className="min-w-0">
            {meta && <div className="mb-1 flex flex-wrap items-center gap-1.5">{meta}</div>}
            <h2 className="text-[16px] font-semibold leading-snug tracking-[-0.015em]">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
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
