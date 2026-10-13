'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea,select,[tabindex]:not([tabindex="-1"])';

/**
 * What a modal layer (Dialog, Sheet) needs to behave: focus moves in when it
 * opens, Tab stays inside, Escape closes it — unless an inner control already
 * handled the key (it calls preventDefault) — and focus returns to whatever
 * opened it. Closing plays the exit (`state: 'closing'`) before telling the
 * parent, and no timer outlives the component.
 */
export function useOverlay({ open, onClose, exitMs }: { open: boolean; onClose: () => void; exitMs: number }) {
  const panel = useRef<HTMLElement>(null);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  // The latest onClose, without making `close` change on every parent render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const close = useCallback(() => {
    setLeaving(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setLeaving(false);
      onCloseRef.current();
    }, exitMs);
  }, [exitMs]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const el = panel.current;
    const focusables = () => (el ? [...el.querySelectorAll<HTMLElement>(FOCUSABLE)] : []);
    // Respect an autoFocus inside; otherwise focus the first control, or the panel.
    if (el && !el.contains(document.activeElement)) (focusables()[0] ?? el).focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Tab') {
        const f = focusables();
        if (!f.length) return;
        const [first, last] = [f[0], f[f.length - 1]];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [open, close]);

  return { panel, close, state: leaving ? ('closing' as const) : ('open' as const) };
}
