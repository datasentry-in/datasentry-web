'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { attentionAt } from '@/modules/app/dpdp/attention';
import { ORGS } from '@/modules/app/dpdp/mock/clients';
import { NAV } from '@/modules/app/dpdp/nav';
import { demoPath } from '@/modules/app/dpdp/routes';
import Dialog from '@/modules/app/ui/Dialog';
import { ICONS } from '@/modules/app/ui/Icons';

/**
 * ⌘K / Ctrl+K: jump to a client, a module or anything that needs attention,
 * from anywhere in the console. Commands are built from the same registries
 * as the sidebar (`nav.ts`) and the bell (`attention.ts`), so a new module or
 * alert shows up here without touching this file.
 */

type Command = { id: string; group: string; label: string; hint?: string; keys?: string; href: string; icon?: ReactNode; terms: string };

function buildCommands(org: string | null): Command[] {
  const current = ORGS.find((o) => o.slug === org) ?? null;
  const out: Command[] = [];

  for (const a of attentionAt(null)) {
    out.push({
      id: `att-${a.id}`, group: 'Needs attention', label: a.title, hint: a.client, href: a.href,
      icon: <span className={`h-1.5 w-1.5 rounded-full ${a.tone === 'danger' ? 'bg-[var(--ds-danger)]' : 'bg-[var(--ds-warn)]'}`} />,
      terms: `${a.title} ${a.client} ${a.meta}`,
    });
  }
  if (current) {
    for (const g of NAV) {
      for (const m of g.items) {
        out.push({
          id: `nav-${m.seg}`, group: current.name, label: m.label, keys: `G ${m.key.toUpperCase()}`, href: demoPath(current.slug, m.seg),
          icon: ICONS[m.icon], terms: `${m.label} ${m.keywords ?? ''}`,
        });
      }
    }
  }
  for (const o of ORGS) {
    out.push({
      id: `org-${o.slug}`, group: 'Clients', label: o.name, hint: o.engagement, href: demoPath(o.slug),
      icon: ICONS.overview, terms: `${o.name} ${o.sector} ${o.locations}`,
    });
  }
  out.push({ id: 'all', group: 'Clients', label: 'All clients', href: demoPath(), icon: ICONS.back, terms: 'portfolio home' });
  if (current) {
    out.push(
      { id: 'pc', group: 'Public pages', label: 'Open the privacy centre', hint: current.name, href: demoPath('p', current.slug), terms: 'request public page' },
      { id: 'ir', group: 'Public pages', label: 'Report an incident', hint: 'Staff form', href: demoPath('p', current.slug, 'report'), terms: 'breach staff form' },
    );
  }
  return out;
}

export default function CommandPalette({ org }: { org: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const list = useRef<HTMLUListElement>(null);

  const commands = useMemo(() => buildCommands(org), [org]);
  const q = query.trim().toLowerCase();
  const shown = q ? commands.filter((c) => q.split(/\s+/).every((w) => `${c.terms} ${c.group}`.toLowerCase().includes(w))) : commands;

  const show = () => {
    setQuery('');
    setActive(0);
    setOpen(true);
  };

  // The shortcut works from anywhere in the console, including inside inputs.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (!open) {
          setQuery('');
          setActive(0);
        }
        setOpen(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (c: Command | undefined) => {
    if (!c) return;
    setOpen(false);
    router.push(c.href);
  };

  const move = (to: number) => {
    const n = Math.max(0, Math.min(shown.length - 1, to));
    setActive(n);
    list.current?.querySelector(`[data-i="${n}"]`)?.scrollIntoView({ block: 'nearest' });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); go(shown[active]); }
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-label="Search and jump to — Command K"
        className="hidden h-8 items-center gap-2 rounded-md border border-[var(--ds-border)] px-2.5 text-[13px] text-[var(--ds-text-3)] transition-colors hover:border-[var(--ds-border-strong)] hover:text-[var(--ds-text-2)] sm:flex xl:w-44 2xl:w-56"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3 3" />
        </svg>
        <span className="hidden flex-1 truncate whitespace-nowrap text-left xl:inline">Search or jump to…</span>
        <kbd className="ds-figure hidden rounded border border-[var(--ds-border)] px-1 text-[11px] leading-[16px] text-[var(--ds-text-3)] xl:inline">⌘K</kbd>
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} label="Command palette">
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Jump to a client, module or alert…"
              role="combobox"
              aria-expanded="true"
              aria-controls="ds-cmd-list"
              aria-activedescendant={shown[active] ? `ds-cmd-${shown[active].id}` : undefined}
              className="w-full border-b border-[var(--ds-border)] px-4 py-3.5 text-[14px] outline-none placeholder:text-[var(--ds-text-3)]"
            />
            <ul id="ds-cmd-list" ref={list} role="listbox" className="max-h-[52vh] overflow-y-auto p-1.5">
              {shown.length === 0 && <li className="px-3 py-6 text-center text-[13px] text-[var(--ds-text-3)]">Nothing matches “{query}”.</li>}
              {shown.map((c, i) => {
                const heading = i === 0 || shown[i - 1].group !== c.group ? c.group : null;
                return (
                  <li key={c.id} role="presentation">
                    {heading && <p className="ds-meta px-2.5 pb-1 pt-2.5 text-[var(--ds-text-3)]">{heading}</p>}
                    <div
                      id={`ds-cmd-${c.id}`}
                      data-i={i}
                      role="option"
                      aria-selected={i === active}
                      onMouseMove={() => i !== active && setActive(i)}
                      onClick={() => go(c)}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] ${
                        i === active ? 'bg-[var(--ds-subtle-2)] text-[var(--ds-text)]' : 'text-[var(--ds-text-2)]'
                      }`}
                    >
                      <span className="flex w-4 shrink-0 items-center justify-center text-[var(--ds-text-3)]">{c.icon}</span>
                      <span className="min-w-0 flex-1 truncate">{c.label}</span>
                      {c.hint && <span className="hidden max-w-[45%] truncate text-[12px] text-[var(--ds-text-3)] sm:block">{c.hint}</span>}
                      {c.keys && (
                        <span className="hidden gap-1 sm:flex">
                          {c.keys.split(' ').map((k, i) => <kbd key={i} className="ds-kbd">{k}</kbd>)}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="flex gap-4 border-t border-[var(--ds-border)] px-4 py-2 text-[11px] text-[var(--ds-text-3)]">
              <span>↑↓ to move</span>
              <span>↵ to open</span>
              <span>esc to close</span>
              <span className="ml-auto">? for shortcuts</span>
            </p>
      </Dialog>
    </>
  );
}
