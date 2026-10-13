'use client';

import Link from 'next/link';
import { useState } from 'react';
import { demoPath } from '@/modules/app/dpdp/routes';
import { addHours, formatIst, fromIstInput, toIstInput } from '@/modules/app/dpdp/time';

/**
 * How a breach reaches the register without a SIEM or a connector: a member of
 * staff reports it. The 72-hour clock runs from when they became aware, not
 * from when the form was filed, so that time is asked for first and the
 * deadline shown straight away. Rule 7 has no severity threshold, so the form
 * invites "not sure" everywhere and draws no conclusion itself.
 */

const KINDS = ['Names and contact details', 'ID numbers (PAN, Aadhaar)', 'Bank or salary details', 'Health or insurance', 'CVs and candidate data', 'Our clients’ customers’ data', 'Not sure'];
const WHOSE = ['Employees', 'Former employees', 'Job applicants', 'Our clients’ customers', 'Not sure'];
const STATE = ['Contained — it has stopped', 'Still happening', 'Not sure'];

function Chips({ options, value, onChange, multi }: { options: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(multi ? (on ? value.filter((x) => x !== o) : [...value, o]) : [o])}
            className={`rounded-md border px-2.5 py-1.5 text-[13px] transition-colors ${
              on
                ? 'border-[var(--ds-accent)] bg-[var(--ds-accent-weak)] font-medium text-[var(--ds-accent-hover)]'
                : 'border-[var(--ds-border-strong)] bg-white text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)]'
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export default function IncidentReport({ orgName, orgSlug }: { orgName: string; orgSlug: string }) {
  const [what, setWhat] = useState('');
  const [aware, setAware] = useState('');
  const [kinds, setKinds] = useState<string[]>([]);
  const [whose, setWhose] = useState<string[]>([]);
  const [count, setCount] = useState('');
  const [state, setState] = useState<string[]>([]);
  const [reporter, setReporter] = useState('');
  const [filed, setFiled] = useState<{ at: string; aware: string; deadline: string } | null>(null);

  const awareAt = aware ? fromIstInput(aware) : null;
  const deadline = awareAt ? formatIst(addHours(awareAt, 72)) : null;
  const ready = what.trim() && aware && reporter.trim();

  const field =
    'w-full rounded-md border border-[var(--ds-border-strong)] bg-white px-3 text-[14px] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--ds-text-3)] focus:border-[var(--ds-accent)] focus:shadow-[0_0_0_3px_var(--ds-accent-weak)]';

  if (filed) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-[var(--ds-border)] bg-white p-6 sm:p-8">
          <p className="ds-meta text-[var(--ds-ok)]">Reported</p>
          <h1 className="ds-display mt-2 text-[28px]">Thank you — this is now with the right people.</h1>
          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ['Reference', 'INC-2026-004'],
              ['Clock started from', filed.aware],
              ['Board intimation due', filed.deadline],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="ds-meta text-[var(--ds-text-3)]">{k}</dt>
                <dd className="ds-figure mt-1 text-[14px]">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 border-t border-[var(--ds-border)] pt-5 text-[14px] leading-relaxed">
            {orgName}&rsquo;s security lead and its DataSentry consultant have been told. You don&rsquo;t need to do anything
            else unless they contact you. Please don&rsquo;t delete anything related to what happened.
          </p>
          <p className="mt-2 text-[12px] text-[var(--ds-text-3)]">Filed {filed.at}.</p>
        </div>
        <Link href={demoPath(orgSlug, 'breach')} className="ds-meta text-[var(--ds-text-3)] hover:text-[var(--ds-text)]">
          Mock: see the clock in the breach register →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="space-y-6 rounded-xl border border-[var(--ds-border)] bg-white px-5 py-6 sm:px-8 sm:py-7">
        <div>
          <h1 className="ds-display text-[26px]">Report a data incident</h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--ds-text-2)]">
            Something sent to the wrong person, a lost laptop, a file shared too widely — report it even if you&rsquo;re not
            sure it counts. Answer what you can.
          </p>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium">What happened?</span>
          <textarea rows={3} value={what} onChange={(e) => setWhat(e.target.value)} className={`${field} py-2.5`}
            placeholder="e.g. The September payroll file was emailed to the all-staff list instead of HR." />
        </label>

        <div>
          <span className="mb-1.5 block text-[13px] font-medium">When did you first realise something was wrong?</span>
          <div className="flex flex-wrap items-center gap-2">
            <input type="datetime-local" value={aware} onChange={(e) => setAware(e.target.value)} className={`${field} h-10 max-w-[15rem]`} />
            <button type="button" onClick={() => setAware(toIstInput(new Date()))}
              className="h-10 rounded-md border border-[var(--ds-border-strong)] bg-white px-3 text-[13px] font-medium hover:bg-[var(--ds-subtle)]">
              Just now
            </button>
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-[13px] font-medium">What kind of information might be involved?</span>
          <Chips options={KINDS} value={kinds} onChange={setKinds} multi />
        </div>

        <div>
          <span className="mb-1.5 block text-[13px] font-medium">Whose information?</span>
          <Chips options={WHOSE} value={whose} onChange={setWhose} multi />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Roughly how many people?</span>
            <input inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value)} placeholder="Leave blank if unsure" className={`${field} ds-figure h-10`} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Your name and team</span>
            <input value={reporter} onChange={(e) => setReporter(e.target.value)} placeholder="e.g. Sonal Mehta, Finance" className={`${field} h-10`} />
          </label>
        </div>

        <div>
          <span className="mb-1.5 block text-[13px] font-medium">Is it still happening?</span>
          <Chips options={STATE} value={state} onChange={setState} />
        </div>

        <div className="flex items-center justify-end border-t border-[var(--ds-border)] pt-5">
          <button
            type="button"
            disabled={!ready}
            onClick={() => setFiled({ at: formatIst(new Date()), aware: formatIst(fromIstInput(aware)), deadline: deadline ?? '' })}
            className="h-10 rounded-md bg-[var(--ds-accent)] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[var(--ds-accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--ds-subtle-2)] disabled:text-[var(--ds-text-3)]"
          >
            Report incident
          </button>
        </div>
      </div>

      {/* The clock, as soon as there is an awareness time */}
      <aside className="h-fit rounded-xl border border-[var(--ds-border)] bg-white p-4 lg:sticky lg:top-6">
        <p className="ds-meta text-[var(--ds-text-3)]">72-hour clock</p>
        {deadline ? (
          <>
            <p className="mt-2 text-[13px] text-[var(--ds-text-2)]">Board intimation due by</p>
            <p className="ds-figure mt-1 text-[15px] text-[var(--ds-danger)]">{deadline}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-[var(--ds-text-3)]">
              Counted from when you became aware, not from when you file this.
            </p>
          </>
        ) : (
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--ds-text-2)]">
            Starts from when you first realised. Enter that time to see the deadline.
          </p>
        )}
        <p className="mt-4 border-t border-[var(--ds-border)] pt-3 text-[12px] leading-relaxed text-[var(--ds-text-3)]">
          No login needed. Your report goes straight to the security lead and the DataSentry consultant.
        </p>
      </aside>
    </div>
  );
}
