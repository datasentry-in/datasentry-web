import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Provenance, Severity } from '@/modules/app/dpdp/types';

/**
 * Console design system — quiet product UI, not the brutalist marketing site.
 *
 * Surfaces are white on a near-white page, separated by 1px hairlines and a
 * barely-there shadow. Type is Inter at 13px with muted secondary text.
 * Colour is spent only where it carries meaning: red for what is overdue or
 * unlawful, amber for what needs attention, green for what is settled,
 * indigo for the single primary action on a screen. Everything else is grey,
 * so the three or four things that matter on a page are the things that
 * stand out. Tokens live in `globals.css` under `.demo-root`.
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
  return (
    <section
      className={`min-w-0 overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] shadow-[var(--ds-shadow)] ${className}`}
    >
      {title && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--ds-border)] px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold tracking-[-0.015em] text-[var(--ds-text)]">{title}</h2>
            {sub && <p className="mt-0.5 text-[12px] leading-snug text-[var(--ds-text-2)]">{sub}</p>}
          </div>
          {right}
        </header>
      )}
      <div className={flush ? '' : 'p-4 sm:p-5'}>{children}</div>
    </section>
  );
}

/** A plain inner card — the unit used inside panels for list rows. */
export function Card({
  children, className = '', tone = 'plain',
}: { children: ReactNode; className?: string; tone?: 'plain' | 'subtle' | 'danger' | 'warn' | 'ok' | 'accent' }) {
  const map = {
    plain: 'border-[var(--ds-border)] bg-[var(--ds-panel)]',
    subtle: 'border-[var(--ds-border)] bg-[var(--ds-subtle)]',
    danger: 'border-[var(--ds-danger-border)] bg-[var(--ds-danger-weak)]',
    warn: 'border-[var(--ds-warn-border)] bg-[var(--ds-warn-weak)]',
    ok: 'border-[var(--ds-ok-border)] bg-[var(--ds-ok-weak)]',
    accent: 'border-[var(--ds-accent-border)] bg-[var(--ds-accent-weak)]',
  } as const;
  return <div className={`rounded-md border p-3 ${map[tone]} ${className}`}>{children}</div>;
}

export function PageHeader({
  eyebrow, title, muted, sub, right,
}: { eyebrow?: string; title: string; muted?: string; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && <p className="ds-label mb-2 text-[var(--ds-text-3)]">{eyebrow}</p>}
        <h1 className="ds-display text-[28px] text-[var(--ds-text)] sm:text-[34px]">
          {title}
          {muted && (
            <>
              <br />
              <span className="text-[var(--ds-text-3)]">{muted}</span>
            </>
          )}
        </h1>
        {sub && <p className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-[var(--ds-text-2)]">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* ------------------------------------------------------------------ metrics */

export function Stat({
  label, value, note, tone = 'plain',
}: { label: string; value: string | number; note?: string; tone?: 'plain' | 'bad' | 'warn' | 'good' }) {
  const dot =
    tone === 'bad' ? 'bg-[var(--ds-danger)]'
      : tone === 'warn' ? 'bg-[var(--ds-warn)]'
        : tone === 'good' ? 'bg-[var(--ds-ok)]'
          : 'bg-[var(--ds-border-strong)]';
  return (
    <div className="rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] p-3.5 shadow-[var(--ds-shadow)] sm:p-4">
      <div className="flex items-start gap-1.5">
        <span className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
        <p className="text-[12px] font-medium leading-snug text-[var(--ds-text-2)]">{label}</p>
      </div>
      <p
        className={`ds-figure mt-2 leading-none tracking-[-0.02em] ${
          String(value).length > 6 ? 'text-[19px] sm:text-[21px]' : 'text-[26px] sm:text-[28px]'
        }`}
      >
        {value}
      </p>
      {note && <p className="mt-1.5 text-[11.5px] leading-snug text-[var(--ds-text-3)]">{note}</p>}
    </div>
  );
}

export function ScoreBlock({ score, trend }: { score: number; trend: string }) {
  const tone =
    score < 40 ? { fg: 'var(--ds-danger)', bg: 'var(--ds-danger-weak)', bd: 'var(--ds-danger-border)' }
      : score < 70 ? { fg: 'var(--ds-warn)', bg: 'var(--ds-warn-weak)', bd: 'var(--ds-warn-border)' }
        : { fg: 'var(--ds-ok)', bg: 'var(--ds-ok-weak)', bd: 'var(--ds-ok-border)' };
  const verdict = score < 40 ? 'Not ready' : score < 70 ? 'Partially ready' : 'Substantially ready';
  return (
    <div className="flex flex-col justify-between rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] p-4 shadow-[var(--ds-shadow)]">
      <div className="flex items-baseline gap-1.5">
        <span className="ds-figure text-[42px] leading-none tracking-[-0.04em]" style={{ color: tone.fg }}>
          {score}
        </span>
        <span className="ds-figure text-[13px] text-[var(--ds-text-3)]">/ 100</span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ds-subtle-2)]">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: tone.fg }} />
      </div>
      <p className="mt-3 text-[13px] font-semibold tracking-[-0.01em]">{verdict}</p>
      <p className="text-[11.5px] text-[var(--ds-text-3)]">Readiness score · {trend}</p>
    </div>
  );
}

/** Labelled progress row — used for module completion. */
export function Meter({ label, pct, note }: { label: string; pct: number; note?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[12.5px] font-medium text-[var(--ds-text)]">{label}</span>
        <span className="ds-figure text-[12px] text-[var(--ds-text-2)]">{pct}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ds-subtle-2)]">
        <div className="h-full rounded-full bg-[var(--ds-accent)]" style={{ width: `${pct}%` }} />
      </div>
      {note && <p className="mt-1 text-[11.5px] text-[var(--ds-text-3)]">{note}</p>}
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
      'border-transparent bg-[var(--ds-accent)] text-white hover:bg-[var(--ds-accent-hover)] shadow-[var(--ds-shadow)]',
    secondary:
      'border-[var(--ds-border-strong)] bg-[var(--ds-panel)] text-[var(--ds-text)] hover:bg-[var(--ds-subtle)] shadow-[var(--ds-shadow)]',
    ghost: 'border-transparent bg-transparent text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)]',
  } as const;
  const cls = `inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${map[variant]} ${className}`;
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
    <td className={`border-b border-[var(--ds-border)] px-3 py-2.5 align-top text-[12.5px] leading-snug ${className}`}>
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
      className="inline-flex items-center rounded border border-[var(--ds-accent-border)] bg-[var(--ds-accent-weak)] px-1.5 py-px text-[11.5px] font-medium text-[var(--ds-accent-hover)] transition-colors hover:border-[var(--ds-accent)] hover:bg-[#dcedf9]"
    >
      {provision}
    </a>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-[var(--ds-border)] bg-[var(--ds-subtle)] px-3 py-2.5 text-[12px] leading-relaxed text-[var(--ds-text-2)]">
      <span className="font-medium text-[var(--ds-text)]">Design note — </span>
      {children}
    </p>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[12.5px] font-medium text-[var(--ds-text-2)] transition-colors hover:text-[var(--ds-text)]"
    >
      {children}
    </Link>
  );
}
