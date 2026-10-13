'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

/**
 * Brief confirmations after an action ("Reminder sent to Ritu Sharma"). One
 * provider at the console root; any component calls `useToast()`. Announced
 * politely to screen readers and dismissed after a few seconds.
 */

type Toast = { id: number; title: string; detail?: string };
type Notify = (title: string, detail?: string) => void;

const ToastContext = createContext<Notify>(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(0);

  const notify = useCallback<Notify>((title, detail) => {
    const id = ++next.current;
    setToasts((t) => [...t.slice(-2), { id, title, detail }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="ds-pop pointer-events-auto rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] px-3.5 py-3 shadow-[var(--ds-shadow-md)]">
            <div className="ds-bar ds-bar-ok">
              <p className="text-[13px] font-medium text-[var(--ds-text)]">{t.title}</p>
              {t.detail && <p className="mt-0.5 text-[12px] leading-snug text-[var(--ds-text-3)]">{t.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
