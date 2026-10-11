import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Provenance, Severity } from '../_data/mock';

/**
 * Neutral design system for the console: black, grey and white only.
 * Severity and emphasis are carried by fill intensity — darker means more
 * serious — never by hue, so nothing depends on colour vision.
 */

export function Panel({
  title, sub, right, children, className = '',
}: { title?: string; sub?: string; right?: ReactNode; children: ReactNode; className?: string }) {
  // `min-w-0` lets a Panel shrink below its content's min-content width.
  // Without it a grid column sizes to the widest TableWrap inside it and the
  // whole panel overflows the viewport on a phone instead of scrolling.
  const base = 'min-w-0 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000]';
  return (
    <section className={`${base} ${className}`}>
      {title && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b-[3px] border-black px-4 py-3 sm:px-5">
          <div>
            <h2 className="font-display text-base font-bold uppercase tracking-tight sm:text-lg">{title}</h2>
            {sub && <p className="font-mono text-[11px] text-neutral-600 sm:text-xs">{sub}</p>}
          </div>
          {right}
        </header>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function Stat({
  label, value, note, tone = 'plain',
}: { label: string; value: string | number; note?: string; tone?: 'plain' | 'bad' | 'warn' | 'good' }) {
  // Intensity ramp: the more attention it needs, the darker the rule.
  const bar =
    tone === 'bad' ? 'bg-black' : tone === 'warn' ? 'bg-neutral-500' : tone === 'good' ? 'bg-neutral-300' : 'bg-neutral-800';
  return (
    <div className="border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_#000]">
      <div className={`h-2 ${bar}`} />
      <div className="p-3 sm:p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-wide text-neutral-600 sm:text-[11px]">{label}</p>
        <p className="font-display text-2xl font-bold sm:text-3xl">{value}</p>
        {note && <p className="font-mono text-[10px] text-neutral-600 sm:text-[11px]">{note}</p>}
      </div>
    </div>
  );
}

export function SeverityTag({ s }: { s: Severity }) {
  const map: Record<Severity, string> = {
    High: 'bg-black text-white',
    Medium: 'bg-neutral-400 text-black',
    Low: 'bg-white text-black',
  };
  return (
    <span className={`inline-block border-2 border-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${map[s]}`}>
      {s}
    </span>
  );
}

export function Tag({
  children, tone = 'plain',
}: { children: ReactNode; tone?: 'plain' | 'info' | 'watch' | 'alert' | 'ok' | 'dark' }) {
  // Named by meaning, not by colour — the palette is greyscale and the fill
  // intensity is what carries the signal.
  const map = {
    plain: 'bg-white text-black',
    info: 'bg-neutral-200 text-black',
    watch: 'bg-neutral-400 text-black',
    ok: 'bg-neutral-600 text-white',
    dark: 'bg-neutral-800 text-white',
    alert: 'bg-black text-white',
  } as const;
  return (
    <span className={`inline-block border-2 border-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${map[tone]}`}>
      {children}
    </span>
  );
}

/** The provenance chip — the liability control, made visible. */
export function ProvenanceTag({ p }: { p: Provenance }) {
  // Lighter means less scrutiny has been applied; black means signed off.
  const map: Record<Provenance, { label: string; cls: string }> = {
    ai_suggested: { label: 'AI suggested', cls: 'bg-white text-black' },
    consultant_reviewed: { label: 'Consultant reviewed', cls: 'bg-neutral-400 text-black' },
    client_confirmed: { label: 'Client confirmed', cls: 'bg-black text-white' },
  };
  const v = map[p];
  return (
    <span className={`inline-block whitespace-nowrap border-2 border-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${v.cls}`}>
      {v.label}
    </span>
  );
}

export function ScoreBlock({ score, trend }: { score: number; trend: string }) {
  const tone = score < 40 ? 'bg-black text-white' : score < 70 ? 'bg-neutral-500 text-white' : 'bg-neutral-200 text-black';
  const verdict = score < 40 ? 'Not ready' : score < 70 ? 'Partially ready' : 'Substantially ready';
  return (
    <div className="border-[3px] border-black shadow-[6px_6px_0px_0px_#000]">
      <div className={`flex items-baseline gap-2 px-4 py-3 ${tone}`}>
        <span className="font-display text-4xl font-bold leading-none sm:text-5xl">{score}</span>
        <span className="font-mono text-xs font-bold">/ 100</span>
      </div>
      <div className="bg-white px-4 py-2">
        <p className="font-display text-sm font-bold uppercase">{verdict}</p>
        <p className="font-mono text-[11px] text-neutral-600">Readiness score · {trend}</p>
      </div>
    </div>
  );
}

/** Horizontal-scrolling table shell so wide registers stay usable on a phone. */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <div className="min-w-[46rem] px-4 sm:min-w-0 sm:px-0">{children}</div>
    </div>
  );
}

export function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <th className={`border-b-[3px] border-black bg-black px-2 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wide text-white ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`border-b border-neutral-300 px-2 py-2 align-top font-mono text-[11px] sm:text-xs ${className}`}>{children}</td>;
}

export function CiteLink({ provision }: { provision: string }) {
  return (
    <a
      href="https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="border-b-2 border-black font-mono text-[11px] font-bold text-black hover:bg-black hover:text-white"
    >
      {provision}
    </a>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-4 border-black bg-neutral-100 px-3 py-2 font-mono text-[11px] leading-relaxed text-neutral-800">
      <span className="font-bold uppercase">Design note · </span>
      {children}
    </p>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-mono text-[11px] font-bold uppercase underline hover:bg-black hover:text-white">
      {children}
    </Link>
  );
}
