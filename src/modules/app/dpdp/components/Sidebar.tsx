'use client';

import Link from 'next/link';
import { ORGS } from '@/modules/app/dpdp/mock/clients';
import { NAV, WORK, type NavItem } from '@/modules/app/dpdp/nav';
import { demoPath } from '@/modules/app/dpdp/routes';
import { BrandLink } from '@/modules/app/ui/Brand';
import { ICONS } from '@/modules/app/ui/Icons';
import { SIDEBAR_COLLAPSED, togglePref, usePref } from '@/modules/app/ui/prefs';

/**
 * The left rail, on every console page and always the same shape: "Your work"
 * (Inbox, My work — across clients) at the top, then a client's modules and
 * intake pages exactly as the statute names them — the client in view, or,
 * outside one, the last client opened, named in the heading. Collapses to an icon rail (`[` or the
 * button at the top); labels then show as tooltips and counts shrink to a dot.
 * "Powered by DataSentry" sits at the foot when expanded. On phones it is a
 * drawer opened from the header, always expanded.
 */

type Props = {
  /** The client in view, or null outside one (portfolio, Inbox, My work). */
  org: string | null;
  /** Whose modules to list: the client in view, else the last one opened. */
  modulesOrg: string;
  /** The module page in view ('' is the overview), when inside a client. */
  activeSeg: string | null;
  /** The work page in view ('inbox', 'my-work'), when outside a client. */
  activeWork: string | null;
  counts: Record<string, string>;
  /** Phone drawer state, owned by the shell's menu button. */
  open: boolean;
  onNavigate: () => void;
};

export default function Sidebar({ org, modulesOrg, activeSeg, activeWork, counts, open, onNavigate }: Props) {
  // Collapsing is a desktop affordance; the phone drawer always shows labels.
  const collapsed = usePref(SIDEBAR_COLLAPSED, false);
  const rail = collapsed ? 'lg:w-14 lg:px-2' : 'lg:w-60 lg:px-3';
  const hideOnRail = collapsed ? 'lg:hidden' : '';
  // Outside a client, say whose modules these are.
  const whose = org ? null : ORGS.find((o) => o.slug === modulesOrg)?.name ?? null;

  return (
    <nav
      aria-label="Console"
      className={`${open ? 'flex' : 'hidden'} shrink-0 flex-col border-b border-[var(--ds-border)] bg-[var(--ds-panel)] px-3 lg:sticky lg:top-14 lg:flex lg:h-[calc(100vh-3.5rem)] lg:border-b-0 lg:border-r lg:transition-[width] lg:duration-200 lg:ease-out motion-reduce:transition-none ${rail}`}
    >
      <div className="flex-1 overflow-y-auto py-4 lg:pt-3">
        {[{ title: 'Your work', items: WORK, root: true }, ...NAV.map((g) => ({ ...g, root: false }))].map((group, gi) => (
          <div key={group.title} className={gi > 0 ? 'mt-5' : ''}>
            {/* The first heading carries the collapse control (desktop only). */}
            <div className={`flex items-center pb-1.5 ${collapsed ? 'lg:justify-center' : 'justify-between'}`}>
              <p className={`min-w-0 truncate px-2 text-[12px] font-medium text-[var(--ds-text-3)] ${hideOnRail}`} title={gi === 1 && whose ? `${group.title} — ${whose}` : undefined}>
                {group.title}
                {gi === 1 && whose && <span className="font-normal"> · {whose}</span>}
              </p>
              {gi === 0 && (
                <button
                  type="button"
                  onClick={() => togglePref(SIDEBAR_COLLAPSED, false)}
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  title={`${collapsed ? 'Expand' : 'Collapse'} sidebar — [`}
                  className="hidden h-7 w-7 items-center justify-center rounded-md text-[var(--ds-text-3)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)] lg:flex"
                >
                  {ICONS.sidebar}
                </button>
              )}
            </div>
            {collapsed && gi > 0 && <div className="mx-2 mb-3 hidden h-px bg-[var(--ds-border)] lg:block" aria-hidden />}
            <ul className="space-y-px">
              {group.items.map((m: NavItem) => {
                // Work pages sit at the console root; module pages under the client.
                const active = group.root ? activeWork === m.seg : activeSeg === m.seg;
                const count = counts[m.seg];
                return (
                  <li key={m.label}>
                    <Link
                      href={group.root ? demoPath(m.seg) : demoPath(modulesOrg, m.seg)}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      aria-label={collapsed ? m.label : undefined}
                      title={`${m.label} — G then ${m.key.toUpperCase()}`}
                      className={`relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors ${
                        collapsed ? 'lg:justify-center' : ''
                      } ${
                        active
                          ? 'bg-[var(--ds-subtle-2)] font-medium text-[var(--ds-text)]'
                          : 'text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]'
                      }`}
                    >
                      <span className={active ? 'text-[var(--ds-accent)]' : 'text-[var(--ds-text-3)]'}>{ICONS[m.icon]}</span>
                      <span className={`min-w-0 flex-1 truncate ${hideOnRail}`}>{m.label}</span>
                      {count && (
                        <>
                          <span className={`ds-figure text-[11px] ${count === 'Due' ? 'text-[var(--ds-warn)]' : count.endsWith('late') ? 'text-[var(--ds-danger)]' : 'text-[var(--ds-text-3)]'} ${hideOnRail}`}>
                            {count}
                          </span>
                          {collapsed && (
                            <span
                              aria-hidden
                              className={`absolute right-1.5 top-1.5 hidden h-1.5 w-1.5 rounded-full lg:block ${
                                count === 'Due' ? 'bg-[var(--ds-warn)]' : count.endsWith('late') ? 'bg-[var(--ds-danger)]' : 'bg-[var(--ds-text-3)]'
                              }`}
                            />
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Foot: who powers it. The rail is too narrow for the wordmark. */}
      <div className={`flex items-center gap-1.5 border-t border-[var(--ds-border)] px-2 py-3 ${collapsed ? 'lg:hidden' : ''}`}>
        <span className="text-[11px] font-medium text-[var(--ds-text-3)]">Powered by</span>
        <BrandLink />
      </div>
    </nav>
  );
}
