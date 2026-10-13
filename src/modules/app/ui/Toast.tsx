'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

/**
 * Brief confirmations after an action ("Reminder sent to Ritu Sharma"). One
 * provider at the console root; any component calls `useToast()`. Announced
 * politely to screen readers and dismissed after a few seconds.
 */

type Toast = { id: number; title: string; detail?: string; leaving?: boolean };
type Notify = (title: string, detail?: string) => void;

const ToastContext = createContext<Notify>(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(0);

  const notify = useCallback<Notify>((title, detail) => {
    const id = ++next.current;
    setToasts((t) => [...t.slice(-2), { id, title, detail }]);
    // Mark it leaving so the exit plays, then remove it.
    setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x))), 4300);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            data-state={t.leaving ? 'closing' : 'open'}
            className="ds-toast pointer-events-auto flex gap-2.5 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] px-3.5 py-3 shadow-[var(--ds-shadow-md)]"
          >
            <svg viewBox="0 0 20 20" className="mt-px h-4 w-4 shrink-0" aria-hidden>
              <circle cx="10" cy="10" r="9" fill="var(--ds-ok-weak)" />
              <path className="ds-check-draw" d="M6 10.4l2.6 2.6L14 7.6" fill="none" stroke="var(--ds-ok)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[var(--ds-text)]">{t.title}</p>
              {t.detail && <p className="mt-0.5 text-[12px] leading-snug text-[var(--ds-text-3)]">{t.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
