'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EXIT_MS } from './motion';

/**
 * Open/close state for a menu that animates out: `close()` marks it closing
 * (CSS plays the exit on `data-state="closing"`), then unmounts it once the
 * exit has run. Escape closes it and focus returns to the trigger. State only
 * changes in handlers and timers, never in an effect body.
 */
export function useClosable(ms: number = EXIT_MS.quick) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const trigger = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setClosing(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, ms);
    trigger.current?.focus();
  }, [ms]);

  const show = useCallback(() => {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    window.clearTimeout(timer.current);
    setClosing(false);
    setOpen(true);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  return {
    open,
    state: closing ? ('closing' as const) : ('open' as const),
    show,
    close,
    toggle: () => (open && !closing ? close() : show()),
  };
}
