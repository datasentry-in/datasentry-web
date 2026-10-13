'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ALL_CLIENTS_KEY, NAV } from '@/modules/app/dpdp/nav';
import { demoPath } from '@/modules/app/dpdp/routes';
import Dialog from '@/modules/app/ui/Dialog';

/**
 * Two-key navigation — "g" then a letter, as in Linear and GitHub — and "?"
 * for the list. Keys come from `nav.ts`. Ignored while typing in a field, and
 * page shortcuts only work inside a client.
 */

const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));

export default function Shortcuts({ org }: { org: string | null }) {
  const router = useRouter();
  const [help, setHelp] = useState(false);
  const pending = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return;
      const k = e.key.toLowerCase();
      if (pending.current !== null) {
        window.clearTimeout(pending.current);
        pending.current = null;
        if (k === ALL_CLIENTS_KEY) {
          e.preventDefault();
          router.push(demoPath());
          return;
        }
        const item = NAV.flatMap((g) => g.items).find((m) => m.key === k);
        if (item && org) {
          e.preventDefault();
          router.push(demoPath(org, item.seg));
        }
        return;
      }
      if (k === 'g') pending.current = window.setTimeout(() => (pending.current = null), 1200);
      else if (e.key === '?') setHelp((h) => !h);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [org, router]);

  const rows: [string, string][] = [
    ['⌘ K', 'Search or jump to'],
    [`G ${ALL_CLIENTS_KEY.toUpperCase()}`, 'All clients'],
    ...NAV.flatMap((g) => g.items.map((m) => [`G ${m.key.toUpperCase()}`, m.label] as [string, string])),
    ['?', 'This list'],
  ];

  return (
    <Dialog open={help} onClose={() => setHelp(false)} label="Keyboard shortcuts" width="max-w-md">
      <div className="border-b border-[var(--ds-border)] px-4 py-3">
        <p className="text-[14px] font-semibold">Keyboard shortcuts</p>
        <p className="text-[12px] text-[var(--ds-text-3)]">
          {org ? 'Press G, then a letter.' : 'Open a client to use the page shortcuts.'}
        </p>
      </div>
      <ul className="max-h-[60vh] overflow-y-auto p-2">
        {rows.map(([keys, label]) => (
          <li key={label} className="flex items-center justify-between rounded-md px-2 py-1.5 text-[13px] text-[var(--ds-text-2)]">
            {label}
            <span className="flex gap-1">
              {keys.split(' ').map((k) => (
                <kbd key={k} className="ds-kbd">{k}</kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
