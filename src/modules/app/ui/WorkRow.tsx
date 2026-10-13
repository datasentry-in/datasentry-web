import Link from 'next/link';
import type { ReactNode } from 'react';
import { Avatar } from './ui';

/**
 * One shape for a piece of work — a finding, a task, a request, an item that
 * needs attention — so every worklist reads the same once learnt:
 *
 *   priority · ID · status · title ……… labels · actions · due · owner
 *
 * Status and severity are small glyphs, not coloured pills; colour appears only
 * where it means something (red overdue, amber waiting on someone, green done).
 * Titles stay on one line and truncate; the full record opens beside the list.
 */

export type WorkStatus = 'todo' | 'progress' | 'waiting' | 'done' | 'overdue' | 'kept';
export type WorkPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

const STATUS_LABEL: Record<WorkStatus, string> = {
  todo: 'To do',
  progress: 'In progress',
  waiting: 'Waiting on someone else',
  done: 'Done',
  overdue: 'Overdue',
  kept: 'Kept on a statutory ground',
};

/** Where a piece of work stands: a ring that fills as it moves, red when late. */
export function StatusIcon({ status, label = STATUS_LABEL[status] }: { status: WorkStatus; label?: string }) {
  return (
    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 shrink-0" role="img" aria-label={label}>
      <title>{label}</title>
      {status === 'todo' && <circle cx="7" cy="7" r="5.25" fill="none" stroke="var(--ds-text-3)" strokeWidth="1.5" />}
      {status === 'progress' && (
        <>
          <circle cx="7" cy="7" r="5.25" fill="none" stroke="var(--ds-text-2)" strokeWidth="1.5" />
          <path d="M7 3.5a3.5 3.5 0 0 1 0 7z" fill="var(--ds-text-2)" />
        </>
      )}
      {status === 'waiting' && (
        <circle cx="7" cy="7" r="5.25" fill="none" stroke="var(--ds-warn)" strokeWidth="1.5" strokeDasharray="2.2 1.9" />
      )}
      {status === 'done' && (
        <>
          <circle cx="7" cy="7" r="6" fill="var(--ds-ok)" />
          <path d="m4.4 7.2 1.8 1.8 3.5-3.7" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {status === 'overdue' && (
        <>
          <circle cx="7" cy="7" r="6" fill="var(--ds-danger)" />
          <path d="M7 4v3.3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="7" cy="9.9" r="0.85" fill="#fff" />
        </>
      )}
      {status === 'kept' && (
        <>
          <circle cx="7" cy="7" r="6" fill="var(--ds-text-3)" />
          <path d="M4.5 7h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

const PRIORITY_LABEL: Record<WorkPriority, string> = {
  urgent: 'Urgent', high: 'High severity', medium: 'Medium severity', low: 'Low severity', none: 'No priority',
};
const BARS: Record<WorkPriority, number> = { urgent: 3, high: 3, medium: 2, low: 1, none: 0 };

/** Severity as signal bars — three for high (red: it is the one that is unlawful), two, one. */
export function PriorityIcon({ level, label = PRIORITY_LABEL[level] }: { level: WorkPriority; label?: string }) {
  if (level === 'urgent') {
    return (
      <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 shrink-0" role="img" aria-label={label}>
        <title>{label}</title>
        <rect x="1" y="1" width="12" height="12" rx="3" fill="var(--ds-danger)" />
        <path d="M7 3.8v3.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="7" cy="10" r="0.9" fill="#fff" />
      </svg>
    );
  }
  if (level === 'none') {
    return (
      <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 shrink-0" role="img" aria-label={label}>
        <title>{label}</title>
        {[2.5, 7, 11.5].map((x) => <circle key={x} cx={x} cy="7" r="1" fill="var(--ds-text-3)" />)}
      </svg>
    );
  }
  const on = level === 'high' ? 'var(--ds-danger)' : 'var(--ds-text-2)';
  return (
    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 shrink-0" role="img" aria-label={label}>
      <title>{label}</title>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={1.5 + i * 4} y={9 - i * 3} width="3" height={3 + i * 3} rx="0.75" fill={i < BARS[level] ? on : 'var(--ds-border-strong)'} />
      ))}
    </svg>
  );
}

/** An owner as a grey avatar; name and role on hover. */
export function OwnerAvatar({ name, role }: { name: string; role?: string }) {
  const tip = role ? `${name} · ${role}` : name;
  return (
    <span role="img" aria-label={tip} data-tip={tip} className="ds-tip shrink-0">
      <Avatar name={name} size={20} />
    </span>
  );
}

// The title keeps its full width and only truncates when the row runs out;
// the labels after it take what is left (and go first when space is short).
const MAIN = 'ds-row-link min-w-0 truncate text-left text-[13px] font-medium text-[var(--ds-text)] outline-none';

export function WorkRow({
  priority, id, status, title, href, onOpen, meta, actions, due, owner, current = false,
  rowId = id, selected, onSelect, onContextMenu, muted = false,
}: {
  priority?: ReactNode;
  id?: string;
  status?: ReactNode;
  title: string;
  /** Where the row goes — or `onOpen` to open it beside the list. With both, `onOpen` runs as the link is followed. */
  href?: string;
  onOpen?: () => void;
  /** Already seen (a read inbox item): the title drops to regular weight and grey. */
  muted?: boolean;
  /** Labels after the title: a citation, the system, the activity. Shown when the list is wide enough. */
  meta?: ReactNode;
  /** Float in over the end of the labels on hover (always on touch); left out on narrow lists, where the opened record carries them. */
  actions?: ReactNode;
  /** Usually a `When`. Pass `null` to keep the column empty. */
  due?: ReactNode;
  /** `null` keeps the avatar's space, for rows nobody owns. */
  owner?: { name: string; role?: string } | null;
  /** The record open beside the list. */
  current?: boolean;
  /** What the keyboard (useListKeys) and menus call this row; defaults to `id`. */
  rowId?: string;
  /** Selection for bulk actions: a checkbox in the row's gutter, shown on hover or once anything is selected. */
  selected?: boolean;
  onSelect?: () => void;
  /** Right-click: the row's menu (ui/Menu). */
  onContextMenu?: (e: React.MouseEvent<HTMLLIElement>) => void;
}) {
  const grow = meta ? 'flex-1 @3xl:flex-initial' : 'flex-1';
  return (
    <li
      aria-current={current || undefined}
      data-row-id={rowId}
      data-selected={selected || undefined}
      onContextMenu={onContextMenu}
      className="ds-row ds-work-row flex min-h-11 items-center gap-3 border-b border-[var(--ds-border)] px-4 py-1.5 transition-colors last:border-b-0 sm:px-5"
    >
      {onSelect && (
        <button
          type="button"
          role="checkbox"
          aria-checked={!!selected}
          aria-label={`Select ${title}`}
          tabIndex={-1}
          onClick={onSelect}
          className="ds-row-check absolute left-0.5 top-1/2 z-[1] flex h-3.5 w-3.5 -translate-y-1/2 items-center justify-center border border-[var(--ds-border-strong)] bg-[var(--ds-panel)] sm:left-1"
        >
          {selected && (
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m2.5 6.2 2.2 2.2 4.8-5" />
            </svg>
          )}
        </button>
      )}
      {priority}
      {id && <span className="ds-id hidden w-[var(--ds-id-w,3rem)] shrink-0 truncate text-[12px] text-[var(--ds-text-3)] @md:block">{id}</span>}
      {status}
      {/* On a narrow list the due date moves under the title, so the title keeps the row's width. */}
      <span className={`flex min-w-0 flex-col ${grow}`}>
        {href ? (
          <Link href={href} onClick={onOpen} title={title} className={`${MAIN} ${muted ? 'ds-row-muted' : ''}`}>{title}</Link>
        ) : (
          <button type="button" onClick={onOpen} title={title} className={`${MAIN} ${muted ? 'ds-row-muted' : ''}`}>{title}</button>
        )}
        {due !== undefined && due !== null && <span className="truncate text-[12px] text-[var(--ds-text-2)] @md:hidden">{due}</span>}
      </span>
      {meta && <span className="hidden min-w-[6rem] flex-1 truncate text-[12px] text-[var(--ds-text-3)] @3xl:block">{meta}</span>}
      {/* A zero-width anchor at the start of the due column: actions grow leftwards from it, over the labels. */}
      {actions && (
        <span className="relative hidden w-0 shrink-0 self-stretch @md:block">
          <span className="ds-row-actions ds-row-float inset-y-0 right-0 flex items-center gap-1.5">{actions}</span>
        </span>
      )}
      {due !== undefined && <span className="hidden w-[6.75rem] shrink-0 truncate text-right text-[12px] text-[var(--ds-text-2)] @md:block">{due}</span>}
      {owner !== undefined && (owner ? <OwnerAvatar {...owner} /> : <span className="w-5 shrink-0" aria-hidden />)}
    </li>
  );
}

/**
 * A worklist: rows, or groups of rows. It is a size container, so rows lay out
 * by the list's own width: below 28rem a row is two lines (title, then due) with no
 * ID or actions; IDs, actions and the due column appear from 28rem, labels from 48rem.
 * `idWidth` lines the IDs up (e.g. "6.75rem" for DSR-2026-0014). Pass `ref` to
 * `useListKeys` for the keyboard; `selecting` keeps every row's checkbox shown.
 */
export function WorkList({
  children, idWidth, ref, selecting = false,
}: { children: ReactNode; idWidth?: string; ref?: React.Ref<HTMLUListElement>; selecting?: boolean }) {
  return (
    <ul
      ref={ref}
      data-worklist=""
      data-selecting={selecting || undefined}
      className="@container"
      style={idWidth ? ({ ['--ds-id-w' as string]: idWidth }) : undefined}
    >
      {children}
    </ul>
  );
}

/** A group inside a worklist: a grey header with a count, then its rows. */
export function WorkGroup({ title, count, right, children }: { title: ReactNode; count: number; right?: ReactNode; children: ReactNode }) {
  return (
    <li className="border-b border-[var(--ds-border)] last:border-b-0">
      <div className="flex h-9 items-center gap-2 border-b border-[var(--ds-border)] bg-[var(--ds-subtle)] px-4 sm:px-5">
        <span className="min-w-0 truncate text-[12px] font-medium text-[var(--ds-text)]">{title}</span>
        <span className="ds-figure text-[12px] text-[var(--ds-text-3)]">{count}</span>
        {right && <span className="ml-auto shrink-0">{right}</span>}
      </div>
      <ul>{children}</ul>
    </li>
  );
}
