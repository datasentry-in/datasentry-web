import Link from 'next/link';
import type { ReactNode } from 'react';
import type { EvidenceBasis, Provenance, Severity } from '@/modules/app/dpdp/types';

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
  // `min-w-0` lets a Panel shrink below its content's min-content width.
  // Without it a grid column sizes to the widest TableWrap inside it and the
  // whole panel overflows the viewport on a phone instead of scrolling.
  // A flush panel holds rows, so its header needs a rule above the first one;
  // a padded panel's header runs straight into its content.
  return (
    <section className={`min-w-0 overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] ${className}`}>
      {title && (
        <header
          className={`flex flex-wrap items-start justify-between gap-3 px-4 sm:px-5 ${
            flush ? 'border-b border-[var(--ds-border)] py-3' : 'pt-4'
          }`}
        >
          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-[var(--ds-text)]">{title}</h2>
            {sub && <p className="mt-0.5 text-[12px] leading-snug text-[var(--ds-text-3)]">{sub}</p>}
          </div>
          {right}
        </header>
      )}
      <div className={flush ? '' : title ? 'px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5' : 'p-4 sm:p-5'}>{children}</div>
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
}: { children: ReactNode; className?: string; tone?: 'plain' | 'subtle' | Exclude<Tone, 'plain' | 'note'> }) {
  if (tone === 'plain' || tone === 'subtle') {
    return <div className={`rounded-md border border-[var(--ds-border)] bg-[var(--ds-panel)] p-3 ${className}`}>{children}</div>;
  }
  return <div className={`ds-bar ds-bar-${tone} ${className}`}>{children}</div>;
}

/**
 * The console's one way of flagging something: a 2px accent bar, a title, a
 * line of detail and an optional action. No tint — the bar's colour is the
 * meaning. `boxed` (the default for page-level alerts) sets it in a plain
 * hairline card with the bar inset; unboxed, it sits inline (design notes,
 * callouts inside a panel).
 */
export function Callout({
  tone = 'plain', title, children, action, boxed = false, className = '',
}: { tone?: Tone; title?: ReactNode; children?: ReactNode; action?: ReactNode; boxed?: boolean; className?: string }) {
  const bar = (
    <div className={`ds-bar ds-bar-${tone} flex flex-wrap items-center gap-x-6 gap-y-2 ${boxed ? '' : className}`}>
      <div className="min-w-0 flex-1 basis-60">
        {title && <p className="text-[14px] font-semibold leading-snug tracking-[-0.01em] text-[var(--ds-text)]">{title}</p>}
        {children && (
          <div className={`text-[13px] leading-relaxed text-[var(--ds-text-2)] ${title ? 'mt-0.5' : ''}`}>{children}</div>
        )}
      </div>
      {action}
    </div>
  );
  return boxed ? <Box className={className}>{bar}</Box> : bar;
}

/** The plain hairline card a boxed callout sits in. */
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
        <h1 className="ds-display text-[22px] text-[var(--ds-text)] sm:text-[24px]">{title}</h1>
        {sub && <p className="mt-1.5 max-w-3xl text-[14px] leading-relaxed text-[var(--ds-text-2)]">{sub}</p>}
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
  const fg =
    tone === 'bad' ? 'text-[var(--ds-danger)]'
      : tone === 'warn' ? 'text-[var(--ds-warn)]'
        : tone === 'good' ? 'text-[var(--ds-ok)]'
          : 'text-[var(--ds-text)]';
  return (
    <div className="min-w-0 bg-[var(--ds-panel)] px-4 py-3.5">
      <p className="text-[12px] font-medium leading-snug text-[var(--ds-text-2)]">{label}</p>
      <p
        className={`ds-figure mt-1.5 leading-none tracking-[-0.02em] ${fg} ${
          String(value).length > 6 ? 'text-[19px] sm:text-[21px]' : 'text-[24px] sm:text-[26px]'
        }`}
      >
        {value}
      </p>
      {note && <p className="mt-1.5 text-[12px] leading-snug text-[var(--ds-text-3)]">{note}</p>}
    </div>
  );
}

/** The readiness score as the first cell of a stat strip. */
export function ScoreBlock({ score, trend }: { score: number; trend: string }) {
  const fg = score < 40 ? 'var(--ds-danger)' : score < 70 ? 'var(--ds-warn)' : 'var(--ds-ok)';
  const verdict = score < 40 ? 'Not ready' : score < 70 ? 'Partially ready' : 'Substantially ready';
  return (
    <div className="min-w-0 bg-[var(--ds-panel)] px-4 py-3.5">
      <p className="text-[12px] font-medium leading-snug text-[var(--ds-text-2)]">Readiness score</p>
      <p className="mt-1.5 flex items-baseline gap-1 leading-none">
        <span className="ds-figure text-[24px] tracking-[-0.03em] sm:text-[26px]" style={{ color: fg }}>{score}</span>
        <span className="ds-figure text-[12px] text-[var(--ds-text-3)]">/ 100</span>
      </p>
      <div className="mt-2 h-1 w-full max-w-36 overflow-hidden rounded-full bg-[var(--ds-subtle-2)]">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: fg }} />
      </div>
      <p className="mt-1.5 text-[12px] leading-snug text-[var(--ds-text-3)]">{verdict} · {trend}</p>
    </div>
  );
}

/** Labelled progress row — used for module completion. */
export function Meter({ label, pct, note }: { label: string; pct: number; note?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] font-medium text-[var(--ds-text)]">{label}</span>
        <span className="ds-figure text-[12px] text-[var(--ds-text-2)]">{pct}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ds-subtle-2)]">
        <div className="h-full rounded-full bg-[var(--ds-accent)]" style={{ width: `${pct}%` }} />
      </div>
      {note && <p className="mt-1 text-[12px] text-[var(--ds-text-3)]">{note}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------- chips */

const CHIP = 'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium';

export function SeverityTag({ s }: { s: Severity }) {
  const map: Record<Severity, string> = {
    High: 'border-[var(--ds-danger-border)] bg-[var(--ds-danger-weak)] text-[var(--ds-danger)]',
    Medium: 'border-[var(--ds-warn-border)] bg-[var(--ds-warn-weak)] text-[var(--ds-warn)]',
    Low: 'border-[var(--ds-border)] bg-[var(--ds-subtle)] text-[var(--ds-text-2)]',
  };
  return (
    <span className={`${CHIP} ${map[s]}`}>
      <span
        className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
        aria-hidden
      />
      {s}
    </span>
  );
}

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

/** The provenance chip — the liability control, made visible. */
export function ProvenanceTag({ p }: { p: Provenance }) {
  const map: Record<Provenance, { label: string; cls: string }> = {
    ai_suggested: {
      label: 'AI suggested',
      cls: 'border-[var(--ds-accent-border)] bg-[var(--ds-accent-weak)] text-[var(--ds-accent-hover)]',
    },
    consultant_reviewed: {
      label: 'Consultant reviewed',
      cls: 'border-[var(--ds-warn-border)] bg-[var(--ds-warn-weak)] text-[var(--ds-warn)]',
    },
    client_confirmed: {
      label: 'Client confirmed',
      cls: 'border-[var(--ds-ok-border)] bg-[var(--ds-ok-weak)] text-[var(--ds-ok)]',
    },
  };
  const v = map[p];
  return <span className={`${CHIP} ${v.cls}`}>{v.label}</span>;
}

/**
 * What a fact rests on. With no integrations or file imports, every fact was
 * declared by the client, observed by the consultant on a screen-share, or
 * attested by the owner who did the work — never machine-verified.
 */
export function BasisTag({ b }: { b: EvidenceBasis }) {
  const map: Record<EvidenceBasis, { label: string; title: string; cls: string; glyph: ReactNode }> = {
    declared: {
      label: 'Declared',
      title: 'Stated by the client in an interview or check-in',
      cls: 'border-[var(--ds-border)] bg-[var(--ds-panel)] text-[var(--ds-text-2)]',
      glyph: <path d="M3 4.5h6M3 7h4" />,
    },
    observed: {
      label: 'Observed',
      title: 'Seen by the consultant on a screen-share walkthrough — nothing was exported',
      cls: 'border-[var(--ds-border-strong)] bg-[var(--ds-subtle-2)] text-[var(--ds-text)]',
      glyph: (
        <>
          <path d="M1 6s1.8-3.2 5-3.2S11 6 11 6 9.2 9.2 6 9.2 1 6 1 6z" />
          <circle cx="6" cy="6" r="1.4" />
        </>
      ),
    },
    attested: {
      label: 'Attested',
      title: 'Confirmed by the owner who did the work in their own system — not machine-verified',
      cls: 'border-[var(--ds-ok-border)] bg-[var(--ds-ok-weak)] text-[var(--ds-ok)]',
      glyph: <path d="M2.5 6.2l2.3 2.3L9.5 3.8" />,
    },
  };
  const v = map[b];
  return (
    <span className={`${CHIP} ${v.cls}`} title={v.title}>
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {v.glyph}
      </svg>
      {v.label}
    </span>
  );
}

/* ------------------------------------------------------------------ actions */

export function Button({
  children, variant = 'secondary', href, as = 'span', className = '',
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  as?: 'span' | 'link';
  className?: string;
}) {
  const map = {
    primary:
      'border-transparent bg-[var(--ds-accent)] text-white hover:bg-[var(--ds-accent-hover)]',
    secondary:
      'border-[var(--ds-border-strong)] bg-[var(--ds-panel)] text-[var(--ds-text)] hover:bg-[var(--ds-subtle)]',
    ghost: 'border-transparent bg-transparent text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)]',
  } as const;
  const cls = `inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors ${map[variant]} ${className}`;
  if (as === 'link' && href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return <span className={cls}>{children}</span>;
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

export function CiteLink({ provision }: { provision: string }) {
  return (
    <a
      href="https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded border border-[var(--ds-accent-border)] bg-[var(--ds-accent-weak)] px-1.5 py-px text-[12px] font-medium text-[var(--ds-accent-hover)] transition-colors hover:border-[var(--ds-accent)] hover:bg-[#dcedf9]"
    >
      {provision}
    </a>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <Callout tone="note">
      <span className="font-medium text-[var(--ds-text)]">Design note — </span>
      {children}
    </Callout>
  );
}

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

/* ------------------------------------------------------------------- people */

const initialsOf = (name: string) =>
  name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

/** Initials in a neutral disc — people are grey; colour stays for meaning. */
export function Avatar({ name, size = 20 }: { name: string; size?: 20 | 24 | 28 }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--ds-subtle-2)] font-semibold text-[var(--ds-text-2)]"
      style={{ width: size, height: size, fontSize: size <= 20 ? 9 : 10.5 }}
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

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[13px] font-medium text-[var(--ds-text-2)] transition-colors hover:text-[var(--ds-text)]"
    >
      {children}
    </Link>
  );
}
