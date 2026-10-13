'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { NAV } from '@/modules/app/dpdp/nav';
import { demoPath } from '@/modules/app/dpdp/routes';
import { BrandLink } from '@/modules/app/ui/Brand';
import { ICONS } from '@/modules/app/ui/Icons';
import { readCollapsed, serverCollapsed, subscribeSidebar, toggleSidebar } from './sidebarState';

/**
 * A client's modules, flush to the left edge and full height below the header.
 * Collapses to an icon rail (`[` or the button at the top); labels then show
 * as tooltips and counts shrink to a dot. "Powered by DataSentry" sits at the
 * foot when expanded. On phones it is a drawer opened from the header, always
 * expanded.
 */

type Props = {
  org: string;
  activeSeg: string;
  counts: Record<string, string>;
  /** Phone drawer state, owned by the shell's menu button. */
  open: boolean;
  onNavigate: () => void;
};

export default function Sidebar({ org, activeSeg, counts, open, onNavigate }: Props) {
  // Collapsing is a desktop affordance; the phone drawer always shows labels.
  const collapsed = useSyncExternalStore(subscribeSidebar, readCollapsed, serverCollapsed);
  const rail = collapsed ? 'lg:w-14 lg:px-2' : 'lg:w-60 lg:px-3';
  const hideOnRail = collapsed ? 'lg:hidden' : '';

  return (
    <nav
      aria-label="Client modules"
      className={`${open ? 'flex' : 'hidden'} shrink-0 flex-col border-b border-[var(--ds-border)] bg-[var(--ds-panel)] px-3 lg:sticky lg:top-14 lg:flex lg:h-[calc(100vh-3.5rem)] lg:border-b-0 lg:border-r lg:transition-[width] lg:duration-200 lg:ease-out motion-reduce:transition-none ${rail}`}
    >
      <div className="flex-1 overflow-y-auto py-4 lg:pt-3">
        {NAV.map((group, gi) => (
          <div key={group.title} className={gi > 0 ? 'mt-5' : ''}>
            {/* The first heading carries the collapse control (desktop only). */}
            <div className={`flex items-center pb-1.5 ${collapsed ? 'lg:justify-center' : 'justify-between'}`}>
              <p className={`px-2 text-[12px] font-medium text-[var(--ds-text-3)] ${hideOnRail}`}>{group.title}</p>
              {gi === 0 && (
                <button
                  type="button"
                  onClick={toggleSidebar}
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
              {group.items.map((m) => {
                const active = activeSeg === m.seg;
                const count = counts[m.seg];
                return (
                  <li key={m.label}>
                    <Link
                      href={demoPath(org, m.seg)}
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
