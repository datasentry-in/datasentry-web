'use client';

import { ORGS, clientData } from '@/modules/app/dpdp/mock/clients';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { DEMO_BASE, demoPath } from '@/modules/app/dpdp/routes';
import { ProductLockup } from '@/modules/app/ui/Brand';
import { ToastProvider } from '@/modules/app/ui/Toast';
import { useSettled } from '@/modules/app/ui/useSettled';
import { lateRequests } from '@/modules/app/dpdp/sla';
import { useNow } from '@/modules/app/dpdp/useNow';
import AccountMenu from './AccountMenu';
import ClientSwitcher from './ClientSwitcher';
import CommandPalette from './CommandPalette';
import Shortcuts from './Shortcuts';
import Sidebar from './Sidebar';
import { LAST_CLIENT, SIDEBAR_COLLAPSED, setPrefValue, usePref, usePrefValue } from '@/modules/app/ui/prefs';
import HeaderAlerts from './HeaderAlerts';
import SignIn from './SignIn';
import { useUnreadInbox } from '@/modules/app/dpdp/inbox';
import { myWorkAt } from '@/modules/app/dpdp/myWork';

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
const countsFor = (slug: string, now: number | null): Record<string, string> => {
  const d = clientData(slug);
  const open = d.tasks.filter((t) => t.status === 'Open' || t.status === 'Overdue').length;
  const late = lateRequests(d.dsrs, d.privacyCentre?.responseDays ?? 30, now).length;
  const c: Record<string, string> = {};
  if (open) c.tasks = String(open);
  if (d.checkIn) c['check-in'] = 'Due';
  if (late) c.dsr = `${late} late`;
  return c;
};

/**
 * Keyed by path, so each page mounts fresh. The first page of a visit eases in;
 * after that, navigation is instant (`useSettled`). Mounted only once signed
 * in, so the entrance plays on arriving in the console, not behind the sign-in.
 */
function Page({ path, children }: { path: string; children: React.ReactNode }) {
  const settled = useSettled();
  return <div key={path} className={settled ? 'ds-settled' : 'ds-page-in'}>{children}</div>;
}

export default function DemoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? DEMO_BASE;
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  // `null` on the server and during hydration; a boolean once the session is
  // readable in the browser.
  const signedIn = useSyncExternalStore(subscribe, readSession, serverSnapshot);
  const collapsed = usePref(SIDEBAR_COLLAPSED, false);
  const now = useNow(60_000);
  const unread = useUnreadInbox().length;
  const late = myWorkAt(now).filter((w) => w.status === 'overdue').length;

  const signIn = () => {
    writeSession(true);
    router.push(demoPath());
  };

  const signOut = () => writeSession(false);

  // Read the client and module from the part of the path after the base, so
  // the console works wherever DEMO_BASE puts it: [org?, seg?].
  const parts = (pathname.startsWith(DEMO_BASE) ? pathname.slice(DEMO_BASE.length) : '').split('/').filter(Boolean);
  const org = ORGS.find((o) => o.slug === parts[0]) ?? null;
  const activeSeg = parts[1] ?? '';
  // Outside a client (portfolio, Inbox, My work) the sidebar keeps the modules
  // of the last client opened, so the rail never changes shape.
  const remembered = usePrefValue(LAST_CLIENT, ORGS[0].slug);
  const modulesOrg = org?.slug ?? (ORGS.some((o) => o.slug === remembered) ? remembered : ORGS[0].slug);
  const inClient = org?.slug ?? null;
  useEffect(() => {
    if (inClient) setPrefValue(LAST_CLIENT, inClient);
  }, [inClient]);

  if (signedIn === null) return <div className="demo-root min-h-screen" />;
  if (!signedIn) return <SignIn onSignedIn={signIn} />;

  return (
    // The provider sits inside .demo-root so its toast stack gets the console's tokens and type.
    <div className="demo-root flex min-h-screen flex-col">
    <ToastProvider>
      <Shortcuts org={org?.slug ?? null} />
      {/* Top bar: product, the client you are in, then quick access and alerts. */}
      <header className="sticky top-0 z-40 h-14 border-b border-[var(--ds-border)] bg-[rgba(255,255,255,0.86)] backdrop-blur-md">
        <div className="flex h-full items-center gap-2 pr-4 lg:pr-5">
          {/* The product cell is as wide as the sidebar, so the pipe after it
              sits on the sidebar's border line. Collapsed, it keeps its natural
              width — "DPDP Console" does not fit the icon rail. */}
          <div
            className={`relative flex h-full shrink-0 items-center px-4 lg:px-5 ${!collapsed ? 'lg:w-60' : ''}`}
          >
            <ProductLockup href={demoPath()} byline={false} />
            <span className="absolute right-0 top-1/2 h-5 w-px -translate-y-1/2 bg-[var(--ds-border)]" aria-hidden />
          </div>
          <div className="min-w-[5rem] flex-1 pl-1 sm:pl-2">
            <ClientSwitcher org={org} />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <CommandPalette org={org?.slug ?? null} />
            <HeaderAlerts />
            <span className="mx-1 hidden h-5 w-px bg-[var(--ds-border)] sm:block" aria-hidden />
            <AccountMenu onSignOut={signOut} />
            <button
              type="button"
              onClick={() => setNavOpen(!navOpen)}
              aria-expanded={navOpen}
              aria-label={navOpen ? 'Close the menu' : 'Open the menu'}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)] lg:hidden"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                {navOpen ? <path key="x" className="ds-icon-in" d="m4 4 8 8M12 4l-8 8" /> : <path key="menu" className="ds-icon-in" d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex w-full flex-1 flex-col lg:flex-row">
        {/* On every page: "Your work" across clients, then the client's modules when inside one. */}
        <Sidebar
          org={org?.slug ?? null}
          modulesOrg={modulesOrg}
          activeSeg={org ? activeSeg : null}
          activeWork={org ? null : parts[0] ?? null}
          counts={{
            ...countsFor(modulesOrg, now),
            ...(unread ? { inbox: String(unread) } : {}),
            // My work is a list, not a backlog to count: only what is late is called out.
            ...(late ? { 'my-work': `${late} late` } : {}),
          }}
          open={navOpen}
          onNavigate={() => setNavOpen(false)}
        />
        <main className="mx-auto w-full min-w-0 max-w-[82rem] flex-1 px-4 py-6 lg:px-10 lg:py-7">
          <Page path={pathname}>{children}</Page>
        </main>
      </div>

      <footer className="border-t border-[var(--ds-border)] py-6">
        <div className="px-4 lg:px-5">
          {/* "Powered by" lives at the sidebar's foot, which is on every page. */}
          <p className="max-w-4xl text-[12px] leading-relaxed text-[var(--ds-text-3)]">
            DataSentry DPDP Console — interactive prototype for review; not a working product, and all data is
            illustrative. Statutory references are drawn from
            secondary commentary and require verification against the Gazette text of the DPDP Act 2023 and
            the DPDP Rules 2025 (G.S.R. 846(E)) before any generated document is relied on.
          </p>
        </div>
      </footer>
    </ToastProvider>
    </div>
  );
}
