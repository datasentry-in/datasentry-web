'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { CONSULTANT, ORGS, TASKS, lastSignIn } from '@/modules/app/dpdp/mock/data';
import { DEMO_BASE, demoPath } from '@/modules/app/dpdp/routes';
import { ProductLockup } from '@/modules/app/ui/Brand';
import { ICONS } from '@/modules/app/ui/Icons';
import { NAV, navLabel } from '@/modules/app/dpdp/nav';
import { ToastProvider } from '@/modules/app/ui/Toast';
import CommandPalette from './CommandPalette';
import Shortcuts from './Shortcuts';
import HeaderAlerts from './HeaderAlerts';
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

/** Badges beside a nav item: what needs attention there. */
const openTasks = TASKS.filter((t) => t.status === 'Open' || t.status === 'Overdue').length;
const COUNTS: Record<string, string> = { tasks: String(openTasks), 'check-in': 'Due' };

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
    <ToastProvider>
    <div className="demo-root flex min-h-screen flex-col">
      <Shortcuts org={org?.slug ?? null} />
      {/* Mock banner — nobody should mistake this for a running product. */}
      <div className="border-b border-[var(--ds-border)]">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-1.5 lg:px-5">
          <p className="flex items-center gap-2 text-[12px] text-[var(--ds-text-3)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--ds-brand-yellow)] ring-1 ring-[#e5d400]" aria-hidden />
            Prototype — not a working product. All data is illustrative.
          </p>
          <Link
            href="/"
            className="text-[12px] font-medium text-[var(--ds-text-2)] transition-colors hover:text-[var(--ds-text)]"
          >
            Back to datasentry.in →
          </Link>
        </div>
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--ds-border)] bg-[rgba(255,255,255,0.86)] backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-2.5 lg:px-5">
          <div className="flex shrink-0 items-center gap-2 lg:w-[13.5rem]">
            <ProductLockup href={demoPath()} />
          </div>

          {/* Main menu. Where you are within a client lives in the body's breadcrumb. */}
          <nav aria-label="Main" className="ml-0.5 flex items-center gap-1 border-l border-[var(--ds-border)] pl-2 sm:ml-2 sm:pl-3 lg:ml-0 lg:border-l-0 lg:pl-0">
            <Link
              href={demoPath()}
              aria-current={!org ? 'page' : undefined}
              className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                !org
                  ? 'bg-[var(--ds-subtle-2)] text-[var(--ds-text)]'
                  : 'text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]'
              }`}
            >
              All clients
            </Link>
          </nav>

          {/* Quick access and what needs attention */}
          <div className="ml-auto flex items-center gap-2">
            <CommandPalette org={org?.slug ?? null} />
            <HeaderAlerts />
            <span className="mx-1 hidden h-5 w-px bg-[var(--ds-border)] sm:block" aria-hidden />
            <div className="hidden text-right lg:block">
              <p className="text-[13px] font-medium leading-tight">{CONSULTANT.name}</p>
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
                      <p className="text-[13px] font-medium">{CONSULTANT.name}</p>
                      <p className="truncate text-[12px] text-[var(--ds-text-2)]">{CONSULTANT.email}</p>
                      <p className="mt-1 inline-flex rounded border border-[var(--ds-border)] bg-[var(--ds-subtle)] px-1.5 py-px text-[11px] font-medium text-[var(--ds-text-2)]">
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
                      className="w-full rounded-md px-2.5 py-1.5 text-left text-[13px] text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
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
                aria-label={navOpen ? 'Close modules menu' : 'Open modules menu'}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)] lg:hidden"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                  {navOpen ? <path d="m4 4 8 8M12 4l-8 8" /> : <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />}
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex w-full flex-1 flex-col lg:flex-row">
        {/* Module sidebar — flush to the left edge, full height below the header. */}
        {org && (
          <nav
            aria-label="Client modules"
            className={`${navOpen ? 'block' : 'hidden'} shrink-0 border-b border-[var(--ds-border)] bg-[var(--ds-panel)] px-3 py-4 lg:sticky lg:top-[57px] lg:block lg:h-[calc(100vh-57px)] lg:w-60 lg:overflow-y-auto lg:border-b-0 lg:border-r`}
          >
            <div className="px-2 pb-4">
              <p className="truncate text-[13px] font-semibold tracking-[-0.01em]" title={org.name}>{org.name}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-[var(--ds-text-3)]">
                {org.headcount} employees · {org.locations}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-[var(--ds-text-2)]">{org.engagement}</p>
            </div>

            {NAV.map((group, gi) => (
              <div key={group.title} className={gi > 0 ? 'mt-5' : ''}>
                <p className="px-2 pb-1.5 text-[12px] font-medium text-[var(--ds-text-3)]">{group.title}</p>
                <ul className="space-y-px">
                  {group.items.map((m) => {
                    const href = demoPath(org.slug, m.seg);
                    const active = activeSeg === m.seg;
                    const count = COUNTS[m.seg];
                    return (
                      <li key={m.label}>
                        <Link
                          href={href}
                          onClick={() => setNavOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          title={`${m.label} — G then ${m.key.toUpperCase()}`}
                          className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors ${
                            active
                              ? 'bg-[var(--ds-subtle-2)] font-medium text-[var(--ds-text)]'
                              : 'text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]'
                          }`}
                        >
                          <span className={active ? 'text-[var(--ds-accent)]' : 'text-[var(--ds-text-3)]'}>{ICONS[m.icon]}</span>
                          <span className="min-w-0 flex-1 truncate">{m.label}</span>
                          {count && (
                            <span className={`ds-figure text-[11px] ${count === 'Due' ? 'text-[var(--ds-warn)]' : 'text-[var(--ds-text-3)]'}`}>
                              {count}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <Link
              href={demoPath()}
              onClick={() => setNavOpen(false)}
              className="mt-5 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
            >
              <span className="text-[var(--ds-text-3)]">{ICONS.back}</span>
              Switch client
            </Link>
          </nav>
        )}

        <main className="mx-auto w-full min-w-0 max-w-[82rem] flex-1 px-4 py-6 lg:px-10 lg:py-7">
          {org && (
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px]">
                <li>
                  <Link href={demoPath()} className="text-[var(--ds-text-2)] transition-colors hover:text-[var(--ds-text)]">
                    All clients
                  </Link>
                </li>
                <li aria-hidden className="text-[var(--ds-text-3)]">/</li>
                <li className="min-w-0">
                  {activeSeg ? (
                    <Link href={demoPath(org.slug)} className="truncate text-[var(--ds-text-2)] transition-colors hover:text-[var(--ds-text)]">
                      {org.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="truncate font-medium text-[var(--ds-text)]">{org.name}</span>
                  )}
                </li>
                {activeSeg && (
                  <>
                    <li aria-hidden className="text-[var(--ds-text-3)]">/</li>
                    <li aria-current="page" className="font-medium text-[var(--ds-text)]">
                      {navLabel(activeSeg)}
                    </li>
                  </>
                )}
              </ol>
            </nav>
          )}
          {children}
        </main>
      </div>

      <footer className="border-t border-[var(--ds-border)] py-6">
        <div className="px-4 lg:px-5">
          <p className="max-w-4xl text-[12px] leading-relaxed text-[var(--ds-text-3)]">
            DataSentry DPDP Console — interactive mock for review. Statutory references are drawn from
            secondary commentary and require verification against the Gazette text of the DPDP Act 2023 and
            the DPDP Rules 2025 (G.S.R. 846(E)) before any generated document is relied on.
          </p>
        </div>
      </footer>
    </div>
    </ToastProvider>
  );
}
