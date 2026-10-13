'use client';

import type { ReactNode } from 'react';
import { PRESENTER, usePref } from './prefs';

/**
 * A note for whoever is presenting the mock — why a screen is the way it is.
 * Shown in Presenter mode (account menu); hidden for a clean client demo.
 */
export default function DemoNote({ children }: { children: ReactNode }) {
  const on = usePref(PRESENTER, true);
  if (!on) return null;
  return (
    <div className="ds-bar ds-bar-note text-[14px] leading-relaxed text-[var(--ds-text-2)]">
      <span className="font-medium text-[var(--ds-text)]">Design note — </span>
      {children}
    </div>
  );
}
