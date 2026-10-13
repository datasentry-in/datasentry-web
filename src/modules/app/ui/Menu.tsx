'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * A menu opened at a point — a row's right-click menu, or a row's status menu
 * from the keyboard ("s"). Arrow keys move, Enter picks, Escape or a click
 * outside closes, and focus goes back where it was. Portals into `.demo-root`
 * (the header's backdrop blur would trap `position: fixed`).
 */

export type MenuItem =
  | { label: string; onSelect: () => void; icon?: ReactNode; hint?: string; checked?: boolean; disabled?: boolean }
  | { heading: string }
  | 'separator';

type Open = { x: number; y: number; items: MenuItem[]; label: string; back: HTMLElement | null };

export function useMenu() {
  const [open, setOpen] = useState<Open | null>(null);
  const close = () => {
    open?.back?.focus();
    setOpen(null);
  };
  return {
    /** Open at a viewport point, e.g. a contextmenu event's clientX / clientY. */
    openAt: (x: number, y: number, items: MenuItem[], label = 'Actions') =>
      setOpen({ x, y, items, label, back: document.activeElement instanceof HTMLElement ? document.activeElement : null }),
    /** Open under an element, e.g. a row's status column. */
    openBelow: (el: HTMLElement, items: MenuItem[], label = 'Actions') => {
      const r = el.getBoundingClientRect();
      setOpen({ x: r.left + 12, y: r.bottom - 4, items, label, back: document.activeElement instanceof HTMLElement ? document.activeElement : null });
    },
    close,
    element: open && <MenuAt {...open} onClose={close} />,
  };
}

function MenuAt({ x, y, items, label, onClose }: Open & { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  // Keep the menu on screen (measured before paint, moved directly — no
  // re-render), then put focus on its first item.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.left = `${Math.max(8, Math.min(x, window.innerWidth - el.offsetWidth - 8))}px`;
    el.style.top = `${y + el.offsetHeight > window.innerHeight - 8 ? Math.max(8, y - el.offsetHeight) : y}px`;
    el.querySelector<HTMLElement>('[role^="menuitem"]:not([disabled])')?.focus();
  }, [x, y]);

  const onKey = (e: React.KeyboardEvent) => {
    const all = [...(ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled]), [role="menuitemradio"]:not([disabled])') ?? [])];
    const i = all.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      all[(i + (e.key === 'ArrowDown' ? 1 : all.length - 1)) % all.length]?.focus();
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[65]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }}>
      <div
        ref={ref}
        role="menu"
        aria-label={label}
        onKeyDown={onKey}
        onClick={(e) => e.stopPropagation()}
        style={{ left: x, top: y }}
        className="ds-pop ds-origin-tl fixed min-w-[13rem] max-w-[18rem] rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] p-1 shadow-[var(--ds-shadow-md)]"
      >
        {items.map((it, i) =>
          it === 'separator' ? (
            <div key={i} className="my-1 h-px bg-[var(--ds-border)]" />
          ) : 'heading' in it ? (
            <p key={i} className="px-2.5 pb-1 pt-1.5 text-[11px] font-medium text-[var(--ds-text-3)]">{it.heading}</p>
          ) : (
            <button
              key={i}
              type="button"
              role={it.checked === undefined ? 'menuitem' : 'menuitemradio'}
              aria-checked={it.checked}
              disabled={it.disabled}
              onClick={() => {
                onClose();
                it.onSelect();
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] text-[var(--ds-text-2)] outline-none transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)] focus-visible:bg-[var(--ds-subtle)] focus-visible:text-[var(--ds-text)] disabled:opacity-40"
            >
              {it.icon && <span aria-hidden className="flex w-3.5 shrink-0 justify-center">{it.icon}</span>}
              <span className="min-w-0 flex-1 truncate">{it.label}</span>
              {it.checked && (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[var(--ds-text-2)]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
              )}
              {it.hint && <kbd className="ds-kbd">{it.hint}</kbd>}
            </button>
          ),
        )}
      </div>
    </div>,
    document.querySelector('.demo-root') ?? document.body,
  );
}
