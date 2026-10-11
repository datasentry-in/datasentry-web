'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { CONSULTANT, ORGS, lastSignIn } from '@/modules/app/dpdp/mock/data';
import { DEMO_BASE, demoPath } from '@/modules/app/dpdp/routes';
import { ProductLockup } from '@/modules/app/ui/Brand';
import SignIn from './SignIn';

/**
 * The demo starts at sign-in once per browser session, so a walkthrough opens
 * the way the product does. The flag lives in sessionStorage: a new tab replays
 * the sign-in, and nothing persists beyond the session.
 */
const SESSION_KEY = 'ds-console-signed-in';

let listeners: (() => void)[] = [];
const subscribe = (l: () => void) => {
  listeners = [...listeners, l];
  return () => {
    listeners = listeners.filter((x) => x !== l);
  };
};
const emit = () => listeners.forEach((l) => l());
const readSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return true; // storage blocked — do not trap the viewer at the sign-in screen
  }
};
const writeSession = (on: boolean) => {
  try {
    if (on) sessionStorage.setItem(SESSION_KEY, '1');
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
  emit();
};
/** The prerendered HTML cannot know the session, so it renders neither screen. */
const serverSnapshot = () => null;

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
  const pathname = usePathname() ?? DEMO_BASE;
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // `null` on the server and during hydration; a boolean once the session is
  // readable in the browser.
  const signedIn = useSyncExternalStore(subscribe, readSession, serverSnapshot);

  const signIn = () => {
    writeSession(true);
    router.push(demoPath());
  };

  const signOut = () => {
    setMenuOpen(false);
    writeSession(false);
  };

  if (signedIn === null) return <div className="demo-root min-h-screen" />;
  if (!signedIn) return <SignIn onSignedIn={signIn} />;

  // Read the client and module from the part of the path after the base, so
  // the console works wherever DEMO_BASE puts it: [org?, seg?].
  const parts = (pathname.startsWith(DEMO_BASE) ? pathname.slice(DEMO_BASE.length) : '').split('/').filter(Boolean);
  const orgSlug = parts[0] ?? null;
  const org = ORGS.find((o) => o.slug === orgSlug) ?? null;
  const activeSeg = parts[1] ?? '';

  return (
    <div className="demo-root flex min-h-screen flex-col">
      {/* Mock banner — nobody should mistake this for a running product. */}
      <div className="border-b border-[var(--ds-border)] bg-[var(--ds-subtle)]">
        <div className="mx-auto flex max-w-[96rem] flex-wrap items-center justify-between gap-2 px-4 py-1.5 lg:px-6">
          <p className="ds-label text-[var(--ds-warn)]">
            Prototype · not a working product · all data illustrative
          </p>
          <Link
            href="/"
            className="text-[11.5px] font-medium text-[var(--ds-text-2)] transition-colors hover:text-[var(--ds-text)]"
          >
            Back to datasentry.in →
          </Link>
        </div>
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--ds-border)] bg-[rgba(255,255,255,0.86)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[96rem] items-center gap-3 px-4 py-2.5 lg:px-6">
          <Link href={demoPath()} className="flex shrink-0 items-center gap-2">
            <ProductLockup />
          </Link>

          {/* Breadcrumb — where in the portfolio you are */}
          {org && (
            <div className="hidden min-w-0 items-center gap-2 sm:flex">
              <span className="text-[var(--ds-text-3)]">/</span>
              <span className="truncate text-[13px] font-medium">{org.name}</span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Link
              href={demoPath()}
              className="hidden rounded-md px-2 py-1 text-[12.5px] font-medium text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)] sm:inline-flex"
            >
              All clients
            </Link>
            <div className="hidden text-right lg:block">
              <p className="text-[12.5px] font-medium leading-tight">{CONSULTANT.name}</p>
              <p className="text-[11px] leading-tight text-[var(--ds-text-3)]">
                {CONSULTANT.firm} · {CONSULTANT.role}
              </p>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-label="Account menu"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ds-accent)] text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                {CONSULTANT.initials}
              </button>
              {menuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close account menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-60 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] p-1 shadow-[var(--ds-shadow-md)]">
                    <div className="px-2.5 py-2">
                      <p className="text-[12.5px] font-medium">{CONSULTANT.name}</p>
                      <p className="truncate text-[11.5px] text-[var(--ds-text-2)]">{CONSULTANT.email}</p>
                      <p className="mt-1 inline-flex rounded border border-[var(--ds-border)] bg-[var(--ds-subtle)] px-1.5 py-px text-[10.5px] font-medium text-[var(--ds-text-2)]">
                        {CONSULTANT.role}
                      </p>
                    </div>
                    <div className="my-1 h-px bg-[var(--ds-border)]" />
                    <p className="px-2.5 py-1 text-[11px] text-[var(--ds-text-3)]">
                      Last sign-in {lastSignIn()}
                    </p>
                    <button
                      type="button"
                      onClick={signOut}
                      className="w-full rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
            {org && (
              <button
                type="button"
                onClick={() => setNavOpen(!navOpen)}
                aria-expanded={navOpen}
                className="ml-0.5 rounded-md border border-[var(--ds-border-strong)] px-2 py-1 text-[12px] font-medium text-[var(--ds-text-2)] lg:hidden"
              >
                {navOpen ? 'Close' : 'Modules'}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[96rem] flex-1 flex-col lg:flex-row lg:gap-7 lg:px-6 lg:py-7">
        {/* Module sidebar */}
        {org && (
          <nav
            className={`${navOpen ? 'block' : 'hidden'} shrink-0 border-b border-[var(--ds-border)] bg-[var(--ds-panel)] px-3 py-3 lg:sticky lg:top-[57px] lg:block lg:h-fit lg:w-56 lg:rounded-lg lg:border lg:shadow-[var(--ds-shadow)]`}
          >
            <div className="px-2 pb-2">
              <p className="truncate text-[12.5px] font-semibold tracking-[-0.01em]">{org.name}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-[var(--ds-text-3)]">
                {org.headcount} employees · {org.locations}
              </p>
              <p className="mt-1.5 inline-flex rounded border border-[var(--ds-border)] bg-[var(--ds-subtle)] px-1.5 py-px text-[10.5px] font-medium text-[var(--ds-text-2)]">
                {org.engagement}
              </p>
            </div>

            <div className="my-2 h-px bg-[var(--ds-border)]" />

            <p className="px-2 pb-1 ds-label text-[var(--ds-text-3)]">
              Modules
            </p>
            <ul className="space-y-px">
              {MODULES.map((m) => {
                const href = demoPath(org.slug, m.seg);
                const active = activeSeg === m.seg;
                return (
                  <li key={m.label}>
                    <Link
                      href={href}
                      onClick={() => setNavOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[12.5px] transition-colors ${
                        active
                          ? 'bg-[var(--ds-accent-weak)] font-medium text-[var(--ds-accent-hover)]'
                          : 'text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]'
                      }`}
                    >
                      <span className="truncate">{m.label}</span>
                      <span className={`ds-figure text-[10.5px] ${active ? 'text-[var(--ds-accent)]' : 'text-[var(--ds-text-3)]'}`}>
                        {m.code}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="my-2 h-px bg-[var(--ds-border)]" />
            <Link
              href={demoPath()}
              onClick={() => setNavOpen(false)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12.5px] text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
            >
              ← Switch client
            </Link>
          </nav>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-0 lg:py-0">{children}</main>
      </div>

      <footer className="mt-10 border-t border-[var(--ds-border)] bg-[var(--ds-subtle)] py-6">
        <div className="mx-auto max-w-[96rem] px-4 lg:px-6">
          <p className="max-w-4xl text-[11.5px] leading-relaxed text-[var(--ds-text-3)]">
            DataSentry DPDP Console — interactive mock for review. Statutory references are drawn from
            secondary commentary and require verification against the Gazette text of the DPDP Act 2023 and
            the DPDP Rules 2025 (G.S.R. 846(E)) before any generated document is relied on.
          </p>
        </div>
      </footer>
    </div>
  );
}
