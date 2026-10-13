import type { ReactNode } from 'react';
import type { EvidenceBasis, Provenance, Severity } from '@/modules/app/dpdp/types';
import { CHIP } from '@/modules/app/ui/ui';

/**
 * The DPDP product's own chips: a finding's severity, where a fact came from
 * (provenance), and what it rests on (evidence basis). They speak the domain,
 * so they live here, not in the generic ui layer.
 */

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
