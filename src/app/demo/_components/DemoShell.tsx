'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CONSULTANT, ORGS } from '../_data/mock';

const MODULES = [
  { seg: '', label: 'Overview', code: 'M0' },
  { seg: 'discovery', label: 'Discovery', code: 'M1' },
  { seg: 'ropa', label: 'RoPA register', code: 'M1' },
  { seg: 'flows', label: 'Data flows', code: 'M1' },
  { seg: 'gaps', label: 'Gap report', code: 'M1' },
  { seg: 'consent', label: 'Notice & consent', code: 'M2' },
  { seg: 'dsr', label: 'DSR desk', code: 'M3' },
  { seg: 'breach', label: 'Breach register', code: 'M4' },
  { seg: 'evidence', label: 'Evidence pack', code: 'M5' },
];

export default function DemoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/demo';
  const [navOpen, setNavOpen] = useState(false);

  const parts = pathname.split('/').filter(Boolean); // ['demo', org?, seg?]
  const orgSlug = parts[1] ?? null;
  const org = ORGS.find((o) => o.slug === orgSlug) ?? null;
  const activeSeg = parts[2] ?? '';

  return (
    <div className="min-h-screen bg-background-light">
      {/* Mock banner — nobody should mistake this for a running product. */}
      <div className="border-b-2 border-black bg-black">
        <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-2 px-4 py-2">
          <p className="font-mono text-[10px] font-bold uppercase leading-tight text-white sm:text-xs">
            Interactive mock · not a working product · all data illustrative
          </p>
          <Link href="/" className="font-mono text-[10px] font-bold uppercase text-white underline sm:text-xs">
            Back to datasentry.in
          </Link>
        </div>
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b-[3px] border-black bg-white">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/demo" className="shrink-0 border-2 border-black">
              <span className="inline-block bg-black px-2 py-1 font-display text-sm font-bold tracking-widest text-white">
                DATA
              </span>
              <span className="inline-block bg-white px-2 py-1 font-display text-sm font-bold tracking-tight text-black">
                SENTRY
              </span>
            </Link>
            <span className="hidden border-2 border-black bg-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white sm:inline-block">
              DPDP Console
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="font-mono text-[11px] font-bold leading-tight">{CONSULTANT.name}</p>
              <p className="font-mono text-[10px] leading-tight text-neutral-600">
                {CONSULTANT.firm} · {CONSULTANT.role}
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black bg-black font-display text-sm font-bold text-white">
              DG
            </div>
            {org && (
              <button
                type="button"
                onClick={() => setNavOpen(!navOpen)}
                className="ml-1 border-2 border-black bg-white px-2 py-1 font-mono text-[10px] font-bold uppercase lg:hidden"
              >
                {navOpen ? 'Close' : 'Menu'}
              </button>
            )}
          </div>
        </div>

        {/* Client context strip */}
        {org && (
          <div className="border-t-2 border-black bg-background-dark">
            <div className="mx-auto flex max-w-[90rem] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2">
              <span className="font-display text-sm font-bold uppercase text-white">{org.name}</span>
              <span className="font-mono text-[10px] text-neutral-400">
                {org.headcount} employees · {org.locations} · {org.engagement}
              </span>
              <Link
                href="/demo"
                className="ml-auto border-2 border-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white hover:bg-white hover:text-black"
              >
                Switch client
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto flex max-w-[90rem] gap-0 px-0 lg:gap-6 lg:px-4 lg:py-6">
        {/* Module sidebar */}
        {org && (
          <nav
            className={`${navOpen ? 'block' : 'hidden'} w-full shrink-0 border-b-[3px] border-black bg-white lg:block lg:w-56 lg:border-[3px] lg:shadow-[6px_6px_0px_0px_#000]`}
          >
            <p className="border-b-2 border-black bg-black px-3 py-2 font-mono text-[10px] font-bold uppercase text-white">
              Modules
            </p>
            <ul>
              {MODULES.map((m) => {
                const href = m.seg ? `/demo/${org.slug}/${m.seg}` : `/demo/${org.slug}`;
                const active = activeSeg === m.seg;
                return (
                  <li key={m.label}>
                    <Link
                      href={href}
                      onClick={() => setNavOpen(false)}
                      className={`flex items-center justify-between gap-2 border-b border-neutral-200 px-3 py-2.5 font-mono text-[11px] font-bold uppercase transition-colors ${
                        active ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
                      }`}
                    >
                      <span>{m.label}</span>
                      <span className={`text-[9px] ${active ? 'text-neutral-300' : 'text-neutral-400'}`}>{m.code}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-0 lg:py-0">{children}</main>
      </div>

      <footer className="mt-10 border-t-[3px] border-black bg-background-dark py-6">
        <div className="mx-auto max-w-[90rem] px-4">
          <p className="font-mono text-[10px] leading-relaxed text-neutral-400">
            DataSentry DPDP Console — interactive mock for review. Statutory references are drawn from
            secondary commentary and require verification against the Gazette text of the DPDP Act 2023 and
            the DPDP Rules 2025 (G.S.R. 846(E)) before any generated document is relied on.
          </p>
        </div>
      </footer>
    </div>
  );
}
