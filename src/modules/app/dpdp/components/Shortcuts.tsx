'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ALL_CLIENTS_KEY, NAV, WORK } from '@/modules/app/dpdp/nav';
import { demoPath } from '@/modules/app/dpdp/routes';
import Dialog from '@/modules/app/ui/Dialog';
import { SIDEBAR_COLLAPSED, togglePref } from '@/modules/app/ui/prefs';

/**
 * Two-key navigation — "g" then a letter, as in Linear and GitHub — "[" to
 * collapse the sidebar, and "?" for the list, which also shows the list keys
 * (useListKeys). Keys come from `nav.ts`. Ignored while typing in a field, and
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
        // The key after "g" belongs to the sequence, matched or not — claim it
        // so a list on the page does not also act on it ("g s" is not "s").
        e.preventDefault();
        if (k === ALL_CLIENTS_KEY) {
          router.push(demoPath());
          return;
        }
        // Inbox and Assigned to me are across clients: they work from any page.
        const work = WORK.find((m) => m.key === k);
        if (work) {
          router.push(demoPath(work.seg));
          return;
        }
        const item = NAV.flatMap((g) => g.items).find((m) => m.key === k);
        if (item && org) router.push(demoPath(org, item.seg));
        return;
      }
      if (e.key === '[') {
        e.preventDefault();
        togglePref(SIDEBAR_COLLAPSED, false);
      } else if (k === 'g') {
        e.preventDefault();
        pending.current = window.setTimeout(() => (pending.current = null), 1200);
      } else if (e.key === '?') setHelp((h) => !h);
    };
    // Capture phase: shortcuts see a key before any list does (useListKeys), so
    // a claimed key arrives there already defaultPrevented.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [org, router]);

  const rows: [string, string][] = [
    ['⌘ K', 'Search or jump to'],
    ['[', 'Collapse or expand the sidebar'],
    [`G ${ALL_CLIENTS_KEY.toUpperCase()}`, 'All clients'],
    ...WORK.map((m) => [`G ${m.key.toUpperCase()}`, m.label] as [string, string]),
    ...NAV.flatMap((g) => g.items.map((m) => [`G ${m.key.toUpperCase()}`, m.label] as [string, string])),
    ['J', 'Next row in a list'],
    ['K', 'Previous row in a list'],
    ['Enter', 'Open the row'],
    ['X', 'Select the row'],
    ['S', 'Change its status'],
    ['Esc', 'Clear the selection'],
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
              {keys.split(' ').map((k, i) => (
                <kbd key={i} className="ds-kbd">{k}</kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
