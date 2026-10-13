'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ORGS } from '@/modules/app/dpdp/mock/data';
import { demoPath } from '@/modules/app/dpdp/routes';
import type { Org } from '@/modules/app/dpdp/types';
import ClientMark from './ClientMark';

/**
 * The header's context: which client you are in, and the way to any other.
 * Replaces the sidebar's client block, its "Switch client" link and the
 * breadcrumb that used to sit above each page. Outside a client it reads "All clients".
 */

const phase = (o: Org) => o.engagement.split('— ')[1] ?? o.engagement;

const scoreTone = (s: number) => (s < 40 ? 'var(--ds-danger)' : s < 70 ? 'var(--ds-warn)' : 'var(--ds-ok)');

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-[var(--ds-text-3)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m4.5 6.5 3.5 3.5 3.5-3.5" />
    </svg>
  );
}

export default function ClientSwitcher({ org }: { org: Org | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex min-w-0 max-w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[var(--ds-subtle)]"
      >
        {org && <ClientMark slug={org.slug} />}
        <span className="min-w-[2.5rem] truncate text-[13px] font-medium text-[var(--ds-text)]">{org ? org.name : 'All clients'}</span>
        {org && <span className="hidden shrink-0 text-[12px] text-[var(--ds-text-3)] xl:inline">· {phase(org)}</span>}
        <Chevron />
      </button>

      {open && (
        <>
          <div aria-hidden className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div role="menu" className="ds-pop fixed inset-x-4 top-14 z-50 sm:absolute sm:inset-x-auto sm:left-0 sm:top-auto sm:mt-1.5 sm:w-[20rem] overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] shadow-[var(--ds-shadow-md)]">
            {org && (
              <div className="border-b border-[var(--ds-border)] px-3.5 py-3">
                <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[-0.01em]">
                  <ClientMark slug={org.slug} size={24} />
                  {org.name}
                </p>
                <p className="mt-0.5 text-[12px] text-[var(--ds-text-3)]">{org.sector}</p>
                <p className="text-[12px] text-[var(--ds-text-3)]">
                  {org.headcount} employees · {org.locations}
                </p>
                <p className="mt-1.5 text-[12px] text-[var(--ds-text-2)]">{org.engagement}</p>
              </div>
            )}
            <p className="ds-meta px-3.5 pb-1 pt-2.5 text-[var(--ds-text-3)]">{org ? 'Switch to' : 'Clients'}</p>
            <ul className="px-1.5 pb-1.5">
              {ORGS.filter((o) => o.slug !== org?.slug).map((o) => (
                <li key={o.slug}>
                  <Link
                    href={demoPath(o.slug)}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-[var(--ds-subtle)]"
                  >
                    <ClientMark slug={o.slug} size={24} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-[var(--ds-text)]">{o.name}</span>
                      <span className="block truncate text-[12px] text-[var(--ds-text-3)]">{phase(o)}</span>
                    </span>
                    <span className="ds-figure text-[13px]" style={{ color: scoreTone(o.score) }} title="Readiness score">{o.score}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={demoPath()}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block border-t border-[var(--ds-border)] px-3.5 py-2.5 text-[13px] font-medium text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
            >
              All clients
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
