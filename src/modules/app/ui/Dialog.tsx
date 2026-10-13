'use client';

import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { EXIT_MS } from './motion';
import { useOverlay } from './useOverlay';

/**
 * A modal layer for the console: dimmed backdrop, Esc and backdrop-click to
 * close, focus kept inside and returned on close, and a panel that pops in and
 * out. It portals into `.demo-root`, not into the caller — a sticky header's
 * backdrop blur would otherwise trap `position: fixed`, and outside
 * `.demo-root` the --ds-* tokens don't exist.
 */
export default function Dialog({
  open, onClose, label, children, width = 'max-w-xl',
}: { open: boolean; onClose: () => void; label: string; children: ReactNode; width?: string }) {
  const { panel, close, state } = useOverlay({ open, onClose, exitMs: EXIT_MS.quick });

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      {/* A div, not a button: the marketing reset strips button backgrounds. */}
      <div aria-hidden data-state={state} className="ds-scrim absolute inset-0 bg-[rgba(14,15,17,0.24)]" onClick={close} />
      <div
        ref={panel as React.RefObject<HTMLDivElement>}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        data-state={state}
        className={`ds-pop relative w-full ${width} overflow-hidden rounded-xl border border-[var(--ds-border)] bg-[var(--ds-panel)] shadow-[0_16px_48px_rgba(14,15,17,0.16)] outline-none`}
      >
        {children}
      </div>
    </div>,
    document.querySelector('.demo-root') ?? document.body,
  );
}
