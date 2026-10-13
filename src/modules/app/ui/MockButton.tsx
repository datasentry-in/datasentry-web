'use client';

import type { ReactNode } from 'react';
import { useToast } from './Toast';
import { buttonClass, type ButtonVariant } from './ui';

/**
 * A button for an action the mock shows but does not perform. It is a real,
 * focusable button, and clicking it says so — nothing looks clickable and
 * silently does nothing.
 */
export default function MockButton({
  children, variant = 'secondary', what, className = '',
}: { children: ReactNode; variant?: ButtonVariant; what: string; className?: string }) {
  const toast = useToast();
  return (
    <button type="button" onClick={() => toast(`${what} — not wired in this mock`, 'The live app performs this; here it only shows where it sits.')} className={buttonClass(variant, className)}>
      {children}
    </button>
  );
}
