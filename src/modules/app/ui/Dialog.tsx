'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * A modal layer for the console: dimmed backdrop, Esc and backdrop-click to
 * close, and a panel that pops in. It portals into `.demo-root`, not into the
 * caller — a sticky header's backdrop blur would otherwise trap
 * `position: fixed`, and outside `.demo-root` the --ds-* tokens don't exist.
 */
export default function Dialog({
  open, onClose, label, children, width = 'max-w-xl',
}: { open: boolean; onClose: () => void; label: string; children: ReactNode; width?: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      {/* A div, not a button: the marketing reset strips button backgrounds. */}
      <div aria-hidden className="absolute inset-0 bg-[rgba(14,15,17,0.24)]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`ds-pop relative w-full ${width} overflow-hidden rounded-xl border border-[var(--ds-border)] bg-[var(--ds-panel)] shadow-[0_16px_48px_rgba(14,15,17,0.16)]`}
      >
        {children}
      </div>
    </div>,
    document.querySelector('.demo-root') ?? document.body,
  );
}
