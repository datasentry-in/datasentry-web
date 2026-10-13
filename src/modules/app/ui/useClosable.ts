'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Open/close state for a menu that animates out: `close()` marks it closing
 * (CSS plays the exit on `data-state="closing"`), then unmounts it once the
 * exit has run. State only changes in handlers and timers, never in an effect.
 */
export function useClosable(ms = 120) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const close = useCallback(() => {
    setClosing(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, ms);
  }, [ms]);

  const show = useCallback(() => {
    window.clearTimeout(timer.current);
    setClosing(false);
    setOpen(true);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return {
    open,
    state: closing ? ('closing' as const) : ('open' as const),
    show,
    close,
    toggle: () => (open && !closing ? close() : show()),
  };
}
