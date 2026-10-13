import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Console design system — quiet product UI, not the brutalist marketing site.
 *
 * A white canvas. Surfaces are separated by 1px hairlines, not shadows, and
 * grey is kept for hover, the active nav item, table heads and disabled
 * inputs. Type is Inter at 13px. Colour is spent only where it carries
 * meaning: red for what is overdue or unlawful, amber for what needs
 * attention, green for what is settled, blue for the single primary action on
 * a screen — so the three or four things that matter on a page are the things
 * that stand out. Tokens live in `console.css` under `.demo-root`.
 */

/* ---------------------------------------------------------------- surfaces */

export function Panel({
  title, sub, right, children, className = '', flush = false,
}: {
  title?: string; sub?: string; right?: ReactNode;
  children: ReactNode; className?: string; flush?: boolean;
}) {
  // Two kinds of section, as in a document. A flush panel holds an object you
  // work in — a table, a list of rows, the flow map — so it gets a frame with
  // its heading inside. Anything else is prose and cards under a heading: no
  // frame, the heading and white space do the separating.
  // `min-w-0` lets a section shrink below its content's min-content width, so
  // a grid column with a wide table scrolls instead of overflowing on a phone.
  if (!flush) {
    return (
      <section className={`min-w-0 ${className}`}>
        {title && (
          <header className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-[var(--ds-text)]">{title}</h2>
              {sub && <p className="mt-0.5 text-[13px] leading-snug text-[var(--ds-text-3)]">{sub}</p>}
            </div>
            {right}
          </header>
        )}
        <div>{children}</div>
      </section>
    );
  }
  return (
    <section className={`min-w-0 overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] ${className}`}>
      {title && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--ds-border)] px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ds-text)]">{title}</h2>
            {sub && <p className="mt-0.5 text-[13px] leading-snug text-[var(--ds-text-3)]">{sub}</p>}
          </div>
          {right}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}

type Tone = 'plain' | 'danger' | 'warn' | 'ok' | 'accent' | 'note';

/**
 * A neutral inner box for grouped content. Toned cards are not boxes: anything
 * that carries a meaning is marked with the accent bar (see `Callout`), never
 * with a tinted, bordered panel.
 */
export function Card({
  children, className = '', tone = 'plain',
}: { children: ReactNode; className?: string; tone?: Exclude<Tone, 'note'> }) {
  if (tone === 'plain') {
    return <div className={`rounded-md border border-[var(--ds-border)] bg-[var(--ds-panel)] p-3 ${className}`}>{children}</div>;
  }
  return <div className={`ds-bar ds-bar-${tone} ${className}`}>{children}</div>;
}

/**
 * The console's one way of flagging something: a plain hairline card with a
 * 2px accent bar inset (`.ds-bar`), a title, a line of detail and an optional
 * action. No tint — the bar's colour is the meaning.
 */
export function Callout({
  tone = 'plain', title, children, action, className = '',
}: { tone?: Tone; title?: ReactNode; children?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={`ds-bar ds-bar-${tone} flex flex-wrap items-center gap-x-6 gap-y-2 ${className}`}>
      <div className="min-w-0 flex-1 basis-60">
        {title && <p className="text-[14px] font-semibold leading-snug tracking-[-0.01em] text-[var(--ds-text)]">{title}</p>}
        {children && (
          <div className={`text-[13px] leading-relaxed text-[var(--ds-text-2)] ${title ? 'mt-0.5' : ''}`}>{children}</div>
        )}
      </div>
      {action}
    </div>
  );
}

/** A plain hairline card — the frame `NextStep` and other unflagged blocks sit in. */
export function Box({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] p-4 ${className}`}>{children}</div>;
}

/**
 * One title, one line of context. Where you are lives in the header's client
 * switcher and the sidebar, so there is no eyebrow and no second, greyed-out
 * headline.
 */
export function PageHeader({ title, sub, right }: { title: string; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="ds-display text-[26px] text-[var(--ds-text)] sm:text-[30px]">{title}</h1>
        {sub && <div className="mt-2 max-w-3xl text-[14px] leading-relaxed text-[var(--ds-text-2)]">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

/* ------------------------------------------------------------------ metrics */

/**
 * One cell of a stat strip. Stats sit edge to edge in a single bordered strip
 * (a `gap-px` grid on a border-coloured background draws the dividers), so a
 * row of numbers reads as one instrument, not four cards. Only a number that
 * is actually bad or due takes colour.
 */
export function Stat({
  label, value, note, tone = 'plain',
}: { label: string; value: string | number; note?: string; tone?: 'plain' | 'bad' | 'warn' | 'good' }) {
  // Calm by default: the number stays ink; a dot by the label says it needs a look.
  // A zero is never flagged.
  if (value === 0) tone = 'plain';
  const dot = tone === 'bad' ? 'var(--ds-danger)' : tone === 'warn' ? 'var(--ds-warn)' : tone === 'good' ? 'var(--ds-ok)' : null;
  const fg = 'text-[var(--ds-text)]';
  return (
    <div className="min-w-0 bg-[var(--ds-panel)] px-4 py-3.5">
      <p className="flex items-center gap-1.5 text-[12px] font-medium leading-snug text-[var(--ds-text-2)]">
        {dot && <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />}
        {label}
      </p>
      <p
        className={`ds-figure mt-1.5 leading-none tracking-[-0.02em] ${fg} ${
          String(value).length > 6 ? 'text-[19px] sm:text-[21px]' : 'text-[24px] sm:text-[26px]'
        }`}
      >
        <span className="ds-num-in">{value}</span>
      </p>
      {note && <p className="mt-1.5 text-[12px] leading-snug text-[var(--ds-text-3)]">{note}</p>}
    </div>
  );
}

/**
 * A module page's key figures as one line of properties under its title, the
 * way a Notion page carries its properties — so the page leads with its own
 * content, not a dashboard strip. Stat strips are for the overview and the
 * portfolio only. A figure that is bad or due gets a dot, not red text.
 */
export function Facts({ children, tight = true }: { children: ReactNode; tight?: boolean }) {
  // `tight` tucks the row under the page title, closing the section gap.
  return (
    <dl className={`flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[var(--ds-border)] pb-4 ${tight ? '-mt-5' : ''}`}>
      {children}
    </dl>
  );
}

export function Fact({
  label, value, note, tone = 'plain',
}: { label: string; value: string | number; note?: string; tone?: 'plain' | 'bad' | 'warn' | 'good' }) {
  if (value === 0) tone = 'plain'; // a zero is never flagged
  const dot = tone === 'bad' ? 'var(--ds-danger)' : tone === 'warn' ? 'var(--ds-warn)' : tone === 'good' ? 'var(--ds-ok)' : null;
  return (
    // The note is on hover: properties stay one short line.
    <div className={`flex items-baseline gap-1.5 text-[13px] ${note ? 'cursor-help' : ''}`} title={note}>
      <dt className="text-[var(--ds-text-3)]">{label}</dt>
      <dd className="flex items-center gap-1.5 font-medium text-[var(--ds-text)]">
        {dot && <span aria-hidden className="h-1.5 w-1.5 self-center rounded-full" style={{ background: dot }} />}
        <span className="tnum ds-num-in">{value}</span>
      </dd>
    </div>
  );
}



/* -------------------------------------------------------------------- chips */

export const CHIP = 'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium';


export function Tag({
  children, tone = 'plain',
}: { children: ReactNode; tone?: 'plain' | 'info' | 'watch' | 'alert' | 'ok' | 'dark' }) {
  const map = {
    plain: 'border-[var(--ds-border)] bg-[var(--ds-panel)] text-[var(--ds-text-2)]',
    info: 'border-[var(--ds-border)] bg-[var(--ds-subtle)] text-[var(--ds-text-2)]',
    dark: 'border-[var(--ds-border-strong)] bg-[var(--ds-subtle-2)] text-[var(--ds-text)]',
    watch: 'border-[var(--ds-warn-border)] bg-[var(--ds-warn-weak)] text-[var(--ds-warn)]',
    ok: 'border-[var(--ds-ok-border)] bg-[var(--ds-ok-weak)] text-[var(--ds-ok)]',
    alert: 'border-[var(--ds-danger-border)] bg-[var(--ds-danger-weak)] text-[var(--ds-danger)]',
  } as const;
  return <span className={`${CHIP} ${map[tone]}`}>{children}</span>;
}



/* ------------------------------------------------------------------ actions */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export const buttonClass = (variant: ButtonVariant = 'secondary', className = '') => {
  const map = {
    primary: 'border-transparent bg-[var(--ds-accent)] text-white hover:bg-[var(--ds-accent-hover)]',
    secondary: 'border-[var(--ds-border-strong)] bg-[var(--ds-panel)] text-[var(--ds-text)] hover:bg-[var(--ds-subtle)]',
    ghost: 'border-transparent bg-transparent text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)]',
  } as const;
  return `inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors ${map[variant]} ${className}`;
};

/**
 * A link styled as a button (`as="link"` with `href`), or a real `<button>`.
 * For an action the mock does not perform, use `MockButton`, which says so.
 */
export function Button({
  children, variant = 'secondary', href, as, className = '', onClick,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  as?: 'link';
  className?: string;
  onClick?: () => void;
}) {
  const cls = buttonClass(variant, className);
  if (as === 'link' && href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------- tables */

/**
 * Horizontal-scrolling table shell so wide registers stay usable on a phone.
 * `minWidth` keeps a column-heavy table (the RoPA register) from squeezing
 * its cells into one-word-per-line on a laptop as well.
 */
export function TableWrap({ children, minWidth }: { children: ReactNode; minWidth?: string }) {
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <div
        className={`px-4 sm:px-0 ${minWidth ? '' : 'min-w-[46rem] sm:min-w-0'}`}
        style={minWidth ? { minWidth } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

export function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={`border-b border-[var(--ds-border)] bg-[var(--ds-subtle)] px-3 py-2 text-left ds-label text-[var(--ds-text-3)] ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <td className={`border-b border-[var(--ds-border)] px-3 py-2.5 align-top text-[13px] leading-snug ${className}`}>
      {children}
    </td>
  );
}

/* -------------------------------------------------------------------- notes */

/**
 * A provision, cited quietly: grey text on a hairline underline that turns blue
 * on hover. Blue belongs to the one primary action, so a column of citations
 * must not compete with it.
 */
export function CiteLink({ provision }: { provision: string }) {
  return (
    <a
      href="https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf"
      target="_blank"
      rel="noopener noreferrer"
      title="Open the Act (MeitY)"
      className="text-[12px] text-[var(--ds-text-2)] underline decoration-[var(--ds-border-strong)] decoration-1 underline-offset-[3px] transition-colors hover:text-[var(--ds-accent-hover)] hover:decoration-[var(--ds-accent)]"
    >
      {provision}
    </a>
  );
}

export { default as DemoNote } from './DemoNote';

/** What a list shows when there is nothing in it — say why, and what next. */
export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--ds-ok)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12.3 2.7 2.7L16 9.7" />
      </svg>
      <p className="mt-3 text-[14px] font-medium text-[var(--ds-text)]">{title}</p>
      {children && <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-[var(--ds-text-3)]">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** A grey placeholder while a value the browser fills in (a clock, a count) loads. */
export function Skeleton({ className = 'h-4 w-16' }: { className?: string }) {
  return <span aria-hidden className={`ds-skeleton inline-block rounded ${className}`} />;
}

/**
 * The one thing to do next on a page, marked in DataSentry yellow. Use once
 * per page at most — it only means something if it is the only one.
 */
export function NextStep({ title, children, action }: { title: ReactNode; children?: ReactNode; action?: ReactNode }) {
  return (
    <Box>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1 basis-60">
          <p className="mb-1.5">
            <span className="rounded-sm bg-[var(--ds-brand-yellow)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--ds-brand-ink)]">Next step</span>
          </p>
          <p className="text-[14px] font-semibold leading-snug tracking-[-0.01em]">{title}</p>
          {children && <div className="mt-0.5 text-[13px] leading-relaxed text-[var(--ds-text-2)]">{children}</div>}
        </div>
        {action}
      </div>
    </Box>
  );
}

/** A field change as an audit trail records it: old value struck, new value after. */
export function Change({ field, from, to }: { field: string; from: string; to: string }) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 text-[12px]">
      <span className="text-[var(--ds-text-3)]">{field}</span>
      <span className="text-[var(--ds-text-3)] line-through decoration-[var(--ds-text-3)]">{from}</span>
      <span aria-hidden className="text-[var(--ds-text-3)]">→</span>
      <span className="font-medium text-[var(--ds-text)]">{to}</span>
    </span>
  );
}

export { default as ViewTabs } from './ViewTabs';

/** A column head that sorts its list; shows the direction when active. */
export function SortHead({
  id, label, active, dir, onSort, className = '',
}: { id: string; label: string; active: boolean; dir: 1 | -1; onSort: (id: string) => void; className?: string }) {
  return (
    <th
      aria-sort={active ? (dir === 1 ? 'ascending' : 'descending') : 'none'}
      className={`border-b border-[var(--ds-border)] bg-[var(--ds-subtle)] px-3 py-2 text-left ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(id)}
        className={`ds-label inline-flex items-center gap-1 ${active ? 'text-[var(--ds-text)]' : 'text-[var(--ds-text-3)] hover:text-[var(--ds-text-2)]'}`}
      >
        {label}
        <span aria-hidden className="text-[10px]">{active ? (dir === 1 ? '↑' : '↓') : '↕'}</span>
      </button>
    </th>
  );
}

/** A search box for filtering a list in place. */
export function FilterInput({
  value, onChange, placeholder, className = 'w-full sm:w-56',
}: { value: string; onChange: (v: string) => void; placeholder: string; className?: string }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={`h-8 rounded-md border border-[var(--ds-border)] px-2.5 text-[13px] outline-none placeholder:text-[var(--ds-text-3)] focus:border-[var(--ds-accent)] ${className}`}
    />
  );
}

/* ------------------------------------------------------------------- people */

const initialsOf = (name: string) =>
  name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

/** Initials in a neutral disc — people are grey; colour stays for meaning. */
export function Avatar({ name, size = 20 }: { name: string; size?: 20 | 24 | 28 }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--ds-subtle-2)] font-semibold text-[var(--ds-text-2)]"
      style={{ width: size, height: size, fontSize: size <= 20 ? 9 : 10 }}
    >
      {initialsOf(name)}
    </span>
  );
}

/** A person as the console shows them: avatar, name, and their role beneath. */
export function Person({ name, role, compact = false }: { name: string; role?: string; compact?: boolean }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <Avatar name={name} size={compact ? 20 : 24} />
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[13px] text-[var(--ds-text)]">{name}</span>
        {role && !compact && <span className="block truncate text-[12px] text-[var(--ds-text-3)]">{role}</span>}
      </span>
    </span>
  );
}

