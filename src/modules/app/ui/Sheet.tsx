'use client';

import { Children, isValidElement, useId, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { EXIT_MS } from './motion';
import { useOverlay } from './useOverlay';

/**
 * A record opened beside its list — the list stays where it was. Laid out as
 * an issue view (after Jira): the record's key on a small line, its title, an
 * action row (`actions` — the status button first, then the record's own
 * actions), then the body: a `SheetDetails` box of label/value fields,
 * `SheetSection`s, and `SheetActivity` (comments and history) last.
 *
 * Slides in from the right and out again; closes on Esc, the backdrop or the
 * close button; keeps focus inside and returns it on close. Portals into
 * `.demo-root` for the same reason as `Dialog`.
 */
export default function Sheet({
  open, onClose, title, meta, actions, children, footer,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** The key line above the title: the record's ID and where it lives. */
  meta?: ReactNode;
  /** Under the title: a `StatusButton`, then the record's actions. */
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { panel, close, state } = useOverlay({ open, onClose, exitMs: EXIT_MS.base });
  const titleId = useId();

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div aria-hidden data-state={state} className="ds-scrim absolute inset-0 bg-[rgba(14,15,17,0.16)]" onClick={close} />
      <aside
        ref={panel as React.RefObject<HTMLElement>}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-state={state}
        className="ds-sheet absolute inset-y-0 right-0 flex w-full max-w-[36rem] flex-col bg-[var(--ds-panel)] shadow-[0_0_48px_rgba(14,15,17,0.14)] outline-none"
      >
        <header className="px-6 pb-4 pt-4">
          <div className="flex min-h-8 items-center justify-between gap-4">
            <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-[var(--ds-text-3)]">{meta}</div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              title="Close — Esc"
              className="-mr-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--ds-text-3)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                <path d="m4 4 8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
          <h2 id={titleId} className="mt-1 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-[var(--ds-text)]">{title}</h2>
          {actions && <div className="mt-3.5 flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
        <div className="flex-1 space-y-7 overflow-y-auto px-6 pb-10 pt-2">{children}</div>
        {footer && <footer className="flex flex-wrap items-center gap-2 border-t border-[var(--ds-border)] px-6 py-3">{footer}</footer>}
      </aside>
    </div>,
    document.querySelector('.demo-root') ?? document.body,
  );
}

/**
 * Where a record stands, as the first button in a sheet's action row — the
 * status glyph and its name, with a chevron when it can be changed here.
 */
export function StatusButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  const body = (
    <>
      <span aria-hidden className="flex">{icon}</span>
      {label}
      {onClick && (
        <svg viewBox="0 0 12 12" className="h-3 w-3 text-[var(--ds-text-3)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m3 4.5 3 3 3-3" />
        </svg>
      )}
    </>
  );
  const cls = 'inline-flex h-8 items-center gap-2 rounded-md border border-[var(--ds-border-strong)] bg-[var(--ds-panel)] px-3 text-[13px] font-medium text-[var(--ds-text)]';
  return onClick ? (
    <button type="button" onClick={onClick} aria-haspopup="menu" className={`${cls} transition-colors hover:bg-[var(--ds-subtle)]`}>
      {body}
    </button>
  ) : (
    <span className={cls}>{body}</span>
  );
}

/**
 * The record's fields in one framed box with a heading, collapsible — the
 * "Details" panel of an issue view. Fill it with `SheetField`s.
 */
export function SheetDetails({ title = 'Details', children }: { title?: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const bodyId = useId();
  return (
    <section className="rounded-lg border border-[var(--ds-border)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-[14px] font-semibold text-[var(--ds-text)] transition-colors hover:bg-[var(--ds-subtle)]"
      >
        {title}
        <svg viewBox="0 0 12 12" className={`h-3.5 w-3.5 text-[var(--ds-text-3)] transition-transform duration-150 ${open ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m3 4.5 3 3 3-3" />
        </svg>
      </button>
      {open && (
        <dl id={bodyId} className="border-t border-[var(--ds-border)] px-4 py-2.5">
          {children}
        </dl>
      )}
    </section>
  );
}

/** One label/value row in `SheetDetails`. */
export function SheetField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] items-start gap-x-4 py-[7px]">
      <dt className="pt-px text-[13px] text-[var(--ds-text-2)]">{label}</dt>
      <dd className="min-w-0 text-[13px] leading-snug text-[var(--ds-text)]">{children}</dd>
    </div>
  );
}

/** A section of a sheet's body: a heading (with an optional count and a control on the right), then its content. */
export function SheetSection({ title, count, right, children }: { title: string; count?: number; right?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <h3 className="text-[14px] font-semibold text-[var(--ds-text)]">
          {title}
          {count !== undefined && <span className="ds-figure ml-1.5 font-normal text-[var(--ds-text-3)]">{count}</span>}
        </h3>
        {right}
      </div>
      {children}
    </section>
  );
}

/** One tab of `SheetActivity`. */
export function SheetTab({ children }: { label: string; children: ReactNode }) {
  return <>{children}</>;
}

/**
 * The record's activity, last in a sheet: tabs (Comments, History…) as
 * `SheetTab` children, the first shown by default.
 */
export function SheetActivity({ children }: { children: ReactNode }) {
  const tabs = Children.toArray(children).filter(isValidElement) as React.ReactElement<{ label: string; children: ReactNode }>[];
  const [active, setActive] = useState(0);
  const current = tabs[Math.min(active, tabs.length - 1)];
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h3 className="text-[14px] font-semibold text-[var(--ds-text)]">Activity</h3>
        <div role="tablist" aria-label="Activity" className="flex items-center gap-1">
          {tabs.map((t, i) => (
            <button
              key={t.props.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`rounded-md px-2 py-0.5 text-[12px] transition-colors ${
                i === active ? 'bg-[var(--ds-subtle-2)] font-medium text-[var(--ds-text)]' : 'text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)]'
              }`}
            >
              {t.props.label}
            </button>
          ))}
        </div>
      </div>
      <div role="tabpanel">{current}</div>
    </section>
  );
}

/** Linked records inside a sheet (child issues, in Jira's terms): a framed list of one-line rows. */
export function SheetList({ children, empty }: { children: ReactNode; empty?: ReactNode }) {
  const items = Children.toArray(children);
  if (!items.length) return <p className="text-[13px] text-[var(--ds-text-3)]">{empty}</p>;
  return <ul className="divide-y divide-[var(--ds-border)] rounded-lg border border-[var(--ds-border)]">{items}</ul>;
}

/** One linked record: glyphs, ID, a one-line title and something on the right (a due date, an owner). */
export function SheetListItem({ icon, id, children, right }: { icon?: ReactNode; id?: string; children: ReactNode; right?: ReactNode }) {
  return (
    <li className="flex min-h-10 items-center gap-2.5 px-3 py-2 text-[13px]">
      {icon}
      {id && <span className="ds-id shrink-0 text-[12px] text-[var(--ds-text-3)]">{id}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {right && <span className="shrink-0 text-[12px] text-[var(--ds-text-2)]">{right}</span>}
    </li>
  );
}
