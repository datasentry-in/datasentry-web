'use client';

import type { ReactNode } from 'react';
import { PRESENTER, usePref } from './prefs';

/** A section that exists only to carry design notes — hidden with Presenter mode off. */
export default function PresenterOnly({ children }: { children: ReactNode }) {
  return usePref(PRESENTER, true) ? <>{children}</> : null;
}
