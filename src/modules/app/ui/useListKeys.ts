'use client';

import { useEffect, type RefObject } from 'react';

const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));

/**
 * The keyboard for a worklist, as in Linear:
 *
 *   j / k      next / previous row (↓ / ↑ once you are in the list)
 *   Enter      open it — focus sits on the row's own link or button
 *   x          select it, for a bulk action
 *   s          change its status
 *   Escape     clear the selection
 *
 * Keys a shortcut sequence has already claimed ("g" then a letter) arrive
 * `defaultPrevented` and are ignored, as is anything typed into a field or
 * pressed while a dialog, sheet or menu is open. With several lists on a page,
 * j starts in the first; after that, keys go to the list that has focus.
 * Rows carry `data-row-id` (WorkRow does this).
 */
export function useListKeys(
  list: RefObject<HTMLElement | null>,
  { onSelect, onStatus, onClear, hasSelection = false }: {
    onSelect?: (id: string) => void;
    onStatus?: (id: string, row: HTMLElement) => void;
    onClear?: () => void;
    hasSelection?: boolean;
  } = {},
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = list.current;
      if (!el || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return;
      if (document.querySelector('[aria-modal="true"], [role="menu"]')) return;

      const links = [...el.querySelectorAll<HTMLElement>('.ds-row-link')];
      if (!links.length) return;
      const focused = document.activeElement;
      const inside = focused instanceof HTMLElement && el.contains(focused);
      if (!inside && document.querySelector('[data-worklist]') !== el) return;

      const at = inside ? links.findIndex((l) => l.closest('li')?.contains(focused)) : -1;
      const row = (i: number) => links[i]?.closest<HTMLElement>('[data-row-id]') ?? null;
      const move = (to: number) => {
        e.preventDefault();
        const next = links[Math.max(0, Math.min(links.length - 1, to))];
        next.focus();
        next.scrollIntoView({ block: 'nearest' });
      };

      switch (e.key) {
        case 'j': move(at + 1); break;
        case 'k': move(at <= 0 ? 0 : at - 1); break;
        case 'ArrowDown': if (inside) move(at + 1); break;
        case 'ArrowUp': if (inside) move(at - 1); break;
        case 'x': {
          const r = row(at);
          if (inside && r && onSelect) {
            e.preventDefault();
            onSelect(r.dataset.rowId!);
          }
          break;
        }
        case 's': {
          const r = row(at);
          if (inside && r && onStatus) {
            e.preventDefault();
            onStatus(r.dataset.rowId!, r);
          }
          break;
        }
        case 'Escape':
          if (hasSelection && onClear) {
            e.preventDefault();
            onClear();
          }
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [list, onSelect, onStatus, onClear, hasSelection]);
}
