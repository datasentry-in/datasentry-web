'use client';

import type { ReactNode } from 'react';
import { useClosable } from './useClosable';

/**
 * The header of a worklist page: the title, what the list is behind an info
 * button, and one line of context — so the first row starts high on the
 * screen. Document pages (the overview, notices, the Board intimation) keep
 * `PageHeader`, with its explanation in the open.
 */
export default function ListHeader({ title, meta, about, right }: { title: string; meta?: ReactNode; about?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
        <h1 className="ds-display text-[20px] text-[var(--ds-text)]">{title}</h1>
        {about && <About title={title}>{about}</About>}
        {meta && <p className="text-[13px] text-[var(--ds-text-3)]">{meta}</p>}
      </div>
      {right}
    </div>
  );
}

function About({ title, children }: { title: string; children: ReactNode }) {
  const menu = useClosable();
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={menu.toggle}
        aria-expanded={menu.open}
        aria-label={`About ${title}`}
        className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--ds-text-3)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
          <circle cx="8" cy="8" r="6.25" />
          <path d="M8 7.25v3.5" />
          <circle cx="8" cy="5.1" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      </button>
      {menu.open && (
        <>
          <div aria-hidden className="fixed inset-0 z-40" onClick={menu.close} />
          <div
            role="dialog"
            aria-label={`About ${title}`}
            data-state={menu.state}
            className="ds-pop ds-origin-tl absolute left-0 top-full z-50 mt-1.5 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] p-3.5 text-[13px] leading-relaxed text-[var(--ds-text-2)] shadow-[var(--ds-shadow-md)]"
          >
            {children}
          </div>
        </>
      )}
    </span>
  );
}
