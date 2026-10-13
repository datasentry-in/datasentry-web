'use client';

import { DEADLINE } from '../statute';
import { useNow } from '../useNow';

/**
 * The clock every engagement is working against: the DPDP Rules' substantive
 * obligations commence at 00:00 IST on 13 May 2027, eighteen months after the
 * Rules were notified on 13 Nov 2025.
 *
 * It reads the real clock, so it stays right on any day it is opened. The page
 * is prerendered, so `now` starts null and is filled from a timer after mount —
 * server HTML and the first client paint agree, and setState stays out of the
 * effect body (the same pattern as the breach Countdown).
 */

const COMMENCES = new Date(`${DEADLINE.date}T00:00:00+05:30`).getTime();
const NOTIFIED = new Date(`${DEADLINE.notified}T00:00:00+05:30`).getTime();
const CONSENT_MANAGER = new Date(`${DEADLINE.consentManager}T00:00:00+05:30`).getTime();
const DAY = 86_400_000;

const pad = (n: number, w = 2) => String(n).padStart(w, '0');

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86_400),
    hours: Math.floor((s % 86_400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

type Size = 'lg' | 'md';

function Segment({ value, unit, size }: { value: string; unit: string; size: Size }) {
  const digits = size === 'lg' ? 'text-[30px] sm:text-[46px]' : 'text-[26px] sm:text-[32px]';
  return (
    <div className="flex flex-col">
      <span className={`ds-figure leading-none tracking-[-0.04em] text-[var(--ds-text)] ${digits}`}>{value}</span>
      <span className="ds-label mt-2 text-[var(--ds-text-3)]">{unit}</span>
    </div>
  );
}

function Colon({ size }: { size: Size }) {
  const digits = size === 'lg' ? 'text-[24px] sm:text-[38px]' : 'text-[22px] sm:text-[26px]';
  return (
    <span aria-hidden className={`ds-figure self-start leading-[1.1] text-[var(--ds-border-strong)] ${digits}`}>
      :
    </span>
  );
}

/** Days : hours : minutes : seconds to commencement, or "In force" after it. */
function Clock({ now, size }: { now: number | null; size: Size }) {
  const left = now === null ? null : COMMENCES - now;
  const t = left === null ? null : split(left);
  if (left !== null && left <= 0) {
    return <span className="ds-figure text-[34px] leading-none tracking-[-0.04em] sm:text-[46px]">In force</span>;
  }
  return (
    // role=timer with live updates would announce every second; the label
    // carries the meaning and the digits are presentational.
    <div
      className="flex w-full items-start justify-between gap-1 sm:w-auto sm:justify-start sm:gap-5"
      role="timer"
      aria-live="off"
      aria-label={
        t ? `${t.days} days, ${t.hours} hours and ${t.minutes} minutes until 13 May 2027` : 'Countdown to 13 May 2027'
      }
    >
      <Segment size={size} value={t ? pad(t.days, 3) : '———'} unit="Days" />
      <Colon size={size} />
      <Segment size={size} value={t ? pad(t.hours) : '——'} unit="Hours" />
      <Colon size={size} />
      <Segment size={size} value={t ? pad(t.minutes) : '——'} unit="Minutes" />
      <Colon size={size} />
      <Segment size={size} value={t ? pad(t.seconds) : '——'} unit="Seconds" />
    </div>
  );
}

/** Compact form for the sign-in screen: one line of context and the clock. */
export function DeadlineStrip() {
  const now = useNow();
  const inForce = now !== null && now >= COMMENCES;
  return (
    <div className="border-l-2 border-[var(--ds-brand-yellow)] pl-4">
      <p className="ds-label text-[var(--ds-text-2)]">
        {inForce ? 'Substantive obligations in force since 13 May 2027' : 'Substantive obligations commence 13 May 2027 · 00:00 IST'}
      </p>
      <div className="mt-3">
        <Clock now={now} size="md" />
      </div>
    </div>
  );
}

export default function DeadlineCountdown() {
  const now = useNow();
  const inForce = now !== null && now >= COMMENCES;
  const runway = now === null ? 0 : Math.min(1, Math.max(0, (now - NOTIFIED) / (COMMENCES - NOTIFIED)));
  const cmDays = now === null ? null : Math.ceil((CONSENT_MANAGER - now) / DAY);

  return (
    <div className="grid gap-5 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-8">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-[12.5px] font-medium text-[var(--ds-text)]">
            {inForce ? 'DPDP substantive obligations are in force' : 'DPDP substantive obligations commence in'}
          </p>
          <p className="ds-label text-[var(--ds-text-3)]">13 May 2027 · 00:00 IST</p>
        </div>

        <div className="mt-4">
          <Clock now={now} size="lg" />
        </div>

        {/* The 18-month runway since the Rules were notified */}
        <div className="mt-5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ds-subtle-2)]">
            <div
              className="h-full rounded-full bg-[var(--ds-accent)] transition-[width] duration-700"
              style={{ width: `${(runway * 100).toFixed(2)}%` }}
            />
          </div>
          <div className="mt-1.5 flex flex-wrap justify-between gap-x-4 gap-y-0.5">
            <p className="ds-label text-[var(--ds-text-3)]">Rules notified · 13 Nov 2025</p>
            <p className="ds-label text-[var(--ds-text-2)]">
              {now === null ? '—' : `${Math.round(runway * 100)}% of the 18-month runway used`}
            </p>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-[var(--ds-text-3)]">{DEADLINE.rulesNote}</p>
        </div>
      </div>

      <div className="self-start rounded-md border border-[var(--ds-border)] px-3.5 py-3">
        <p className="ds-label text-[var(--ds-text-3)]">Next dated milestone</p>
        <p className="mt-1.5 text-[12.5px] font-medium text-[var(--ds-text)]">Rule 4 — Consent Manager framework</p>
        <p className="mt-0.5 text-[12px] text-[var(--ds-text-2)]">13 Nov 2026</p>
        <p className="mt-2 flex items-baseline gap-1.5">
          <span className="ds-figure text-[22px] leading-none tracking-[-0.03em] text-[var(--ds-warn)]">
            {cmDays === null ? '—' : cmDays > 0 ? cmDays : 0}
          </span>
          <span className="text-[12px] text-[var(--ds-text-2)]">
            {cmDays !== null && cmDays <= 0 ? 'in force' : 'days to go'}
          </span>
        </p>
      </div>
    </div>
  );
}
