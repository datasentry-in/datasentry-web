'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PRIVACY_CENTRE } from '@/modules/app/dpdp/mock/data';
import { demoPath } from '@/modules/app/dpdp/routes';
import { RIGHTS, type RightType } from '@/modules/app/dpdp/statute';
import { formatDate, formatIst } from '@/modules/app/dpdp/time';

/**
 * The data principal's side of the DSR desk. Identity is confirmed against
 * records the client already holds — no documents unless that fails — and the
 * request lands in the DSR desk on an SLA clock. The platform is the system of
 * record; no client system is touched to take the request in.
 */

type Rel = 'current' | 'former' | 'applicant' | 'customer' | 'other';

const RELATIONSHIPS: { value: Rel; label: string }[] = [
  { value: 'current', label: 'I work here' },
  { value: 'former', label: 'I used to work here' },
  { value: 'applicant', label: 'I applied for a job' },
  { value: 'customer', label: 'I’m a customer of a company you serve' },
  { value: 'other', label: 'Something else' },
];

const IDENTITY: Record<Rel, { label: string; type: string; placeholder?: string }[]> = {
  former: [
    { label: 'Employee ID', type: 'text', placeholder: 'e.g. NB-10482' },
    { label: 'Date of birth', type: 'date' },
    { label: 'Last working day', type: 'date' },
    { label: 'Email we have on record', type: 'email', placeholder: 'you@example.com' },
  ],
  current: [
    { label: 'Employee ID', type: 'text', placeholder: 'e.g. NB-10482' },
    { label: 'Work email', type: 'email', placeholder: 'you@northstarbpo.in' },
  ],
  applicant: [
    { label: 'Email you applied with', type: 'email', placeholder: 'you@example.com' },
    { label: 'Mobile number', type: 'tel', placeholder: '+91 98xxx xxxxx' },
  ],
  customer: [
    { label: 'Full name', type: 'text' },
    { label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { label: 'Which company are you a customer of?', type: 'text' },
  ],
  other: [
    { label: 'Full name', type: 'text' },
    { label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { label: 'How would we know you?', type: 'text' },
  ],
};

const DETAILS: Record<RightType, { label: string; required: boolean }> = {
  access: { label: 'Anything specific you’d like a summary of?', required: false },
  correction: { label: 'What is wrong, and what should it say?', required: true },
  erasure: { label: 'What would you like erased? Leave blank for everything we can erase.', required: false },
  withdraw: { label: 'Which consent are you withdrawing?', required: true },
  grievance: { label: 'What is your concern?', required: true },
  nomination: { label: 'Who would you like to nominate, and how can we reach them?', required: true },
};

const STEPS = ['Request', 'About you', 'Confirm it’s you', 'Details'];

const field =
  'h-10 w-full rounded-md border border-[var(--ds-border-strong)] bg-white px-3 text-[14px] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--ds-text-3)] focus:border-[var(--ds-accent)] focus:shadow-[0_0_0_3px_var(--ds-accent-weak)]';

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={`w-full rounded-lg border px-3.5 py-3 text-left text-[14px] transition-colors ${
        on
          ? 'border-[var(--ds-accent)] bg-[var(--ds-accent-weak)] text-[var(--ds-accent-hover)]'
          : 'border-[var(--ds-border-strong)] bg-white hover:bg-[var(--ds-subtle)]'
      }`}
    >
      {children}
    </button>
  );
}

export default function RequestForm({ orgName, orgSlug, initialType }: { orgName: string; orgSlug: string; initialType: RightType | null }) {
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [type, setType] = useState<RightType | null>(initialType);
  const [rel, setRel] = useState<Rel | null>(null);
  const [identity, setIdentity] = useState<Record<string, string>>({});
  const [details, setDetails] = useState('');
  const [language, setLanguage] = useState(PRIVACY_CENTRE.languages[0]);
  const [done, setDone] = useState<{ ref: string; at: string; by: string } | null>(null);

  const right = RIGHTS.find((r) => r.type === type);
  const idFields = rel ? IDENTITY[rel] : [];
  const replyTo = Object.entries(identity).find(([k]) => /email/i.test(k))?.[1] ?? '';

  const canNext =
    (step === 0 && !!type) ||
    (step === 1 && !!rel) ||
    (step === 2 && idFields.every((f) => (identity[f.label] ?? '').trim())) ||
    (step === 3 && (!type || !DETAILS[type].required || details.trim()));

  const submit = () => {
    const now = new Date();
    setDone({ ref: 'DSR-2026-0042', at: formatIst(now), by: formatDate(new Date(now.getTime() + PRIVACY_CENTRE.responseDays * 86_400_000)) });
  };

  if (done && right) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-[var(--ds-border)] bg-white p-6 sm:p-8">
          <p className="ds-meta text-[var(--ds-ok)]">Request received</p>
          <h1 className="ds-display mt-2 text-[28px]">We&rsquo;ve got your request.</h1>
          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ['Reference', done.ref],
              ['Received', done.at],
              ['We’ll respond by', done.by],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="ds-meta text-[var(--ds-text-3)]">{k}</dt>
                <dd className="ds-figure mt-1 text-[14px]">{v}</dd>
              </div>
            ))}
          </dl>
          <ol className="mt-6 space-y-3 border-t border-[var(--ds-border)] pt-5">
            {[
              rel === 'customer'
                ? `${orgName} processes this information on behalf of the company you are a customer of. We’ll pass your request to them and tell you when we have.`
                : `We confirm it’s you against records ${orgName} already holds. We’ll only ask for a document if we can’t match you.`,
              `Your request goes to ${orgName}’s privacy team, who can see every system that may hold your information.`,
              type === 'erasure'
                ? 'Each of those systems is checked and your information erased — except where the law requires us to keep it, which we’ll explain.'
                : 'Each of those systems is checked for what you asked about.',
              `We reply${replyTo ? ` to ${replyTo}` : ''} in ${language}.`,
            ].map((s, i) => (
              <li key={s} className="flex gap-3 text-[14px] leading-relaxed">
                <span className="ds-figure flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--ds-accent-weak)] text-[11px] text-[var(--ds-accent-hover)]">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[13px] text-[var(--ds-text-2)]">
            Keep your reference. If you&rsquo;re not satisfied with our response, you can complain to the Data Protection Board of India.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href={demoPath('p', orgSlug)} className="text-[13px] font-medium text-[var(--ds-accent-hover)] hover:underline">
            ← Back to the privacy centre
          </Link>
          <Link href={demoPath(orgSlug, 'dsr')} className="ds-meta text-[var(--ds-text-3)] hover:text-[var(--ds-text)]">
            Mock: see where requests land in the DSR desk →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--ds-border)] bg-white">
      {/* Progress */}
      <ol className="flex flex-wrap gap-x-5 gap-y-2 border-b border-[var(--ds-border)] px-5 py-3.5 sm:px-8">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`ds-figure flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                i < step ? 'bg-[var(--ds-ok-weak)] text-[var(--ds-ok)]' : i === step ? 'bg-[var(--ds-accent)] text-white' : 'bg-[var(--ds-subtle-2)] text-[var(--ds-text-3)]'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </span>
            <span className={`text-[13px] ${i === step ? 'font-medium' : 'text-[var(--ds-text-2)]'}`}>{s}</span>
          </li>
        ))}
      </ol>

      <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-7">
        {step === 0 && (
          <fieldset className="space-y-2" role="radiogroup">
            <legend className="ds-display mb-3 text-[22px]">What would you like to do?</legend>
            {RIGHTS.map((r) => (
              <Choice key={r.type} on={type === r.type} onClick={() => setType(r.type)}>
                <span className="font-medium">{r.title}</span>
                <span className="mt-0.5 block text-[13px] text-[var(--ds-text-2)]">{r.note}</span>
              </Choice>
            ))}
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-2" role="radiogroup">
            <legend className="ds-display mb-1 text-[22px]">How do you know {orgName}?</legend>
            <p className="mb-3 text-[13px] text-[var(--ds-text-2)]">So we know where to look, and how to confirm it&rsquo;s you.</p>
            {RELATIONSHIPS.map((r) => (
              <Choice key={r.value} on={rel === r.value} onClick={() => { setRel(r.value); setIdentity({}); }}>
                {r.label}
              </Choice>
            ))}
            {rel === 'customer' && (
              <p className="rounded-md bg-[var(--ds-subtle)] px-3 py-2 text-[13px] leading-relaxed text-[var(--ds-text-2)]">
                {orgName} handles this information on behalf of that company. We&rsquo;ll take your request and pass it to them.
              </p>
            )}
          </fieldset>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="ds-display text-[22px]">Help us confirm it&rsquo;s you</h2>
              <p className="mt-1 text-[13px] text-[var(--ds-text-2)]">
                We check these against records {orgName} already holds. We only ask for a document if we can&rsquo;t match you.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {idFields.map((f) => (
                <label key={f.label} className="block">
                  <span className="mb-1.5 block text-[13px] font-medium">{f.label}</span>
                  <input
                    type={f.type}
                    className={field}
                    placeholder={f.placeholder}
                    value={identity[f.label] ?? ''}
                    onChange={(e) => setIdentity((s) => ({ ...s, [f.label]: e.target.value }))}
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 3 && type && (
          <div className="space-y-4">
            <h2 className="ds-display text-[22px]">{right?.title}</h2>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium">
                {DETAILS[type].label}
                {!DETAILS[type].required && <span className="font-normal text-[var(--ds-text-3)]"> (optional)</span>}
              </span>
              <textarea
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full rounded-md border border-[var(--ds-border-strong)] px-3 py-2.5 text-[14px] outline-none focus:border-[var(--ds-accent)] focus:shadow-[0_0_0_3px_var(--ds-accent-weak)]"
              />
            </label>
            <label className="block max-w-xs">
              <span className="mb-1.5 block text-[13px] font-medium">Reply to me in</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className={field}>
                {PRIVACY_CENTRE.languages.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-[var(--ds-border)] pt-5">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="text-[13px] font-medium text-[var(--ds-text-2)] hover:text-[var(--ds-text)]">
              ← Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            disabled={!canNext}
            onClick={() => (step === 3 ? submit() : setStep(step + 1))}
            className="h-10 rounded-md bg-[var(--ds-accent)] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[var(--ds-accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--ds-subtle-2)] disabled:text-[var(--ds-text-3)]"
          >
            {step === 3 ? 'Send request' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
