'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CONSULTANT, lastSignIn } from '@/modules/app/dpdp/mock/data';
import { ProductLockup } from '@/modules/app/ui/Brand';
import DataMapScan from './DataMapScan';
import { DeadlineStrip } from './DeadlineCountdown';

/**
 * The console sign-in screen.
 *
 * Two halves that read as two different things: on white, the data map — a
 * working diagram of the DPDP logic the product applies, run over systems a
 * client would recognise as their own; on a cool grey surface, the form, on a
 * raised white card that says plainly which system this is.
 *
 * The consultant's email arrives pre-filled and the password comes from the
 * browser's password manager — what the real screen looks like on a machine
 * that has been used before. The dots are a placeholder; there is no
 * credential here to check, and nothing is rendered in plain text.
 *
 * No social sign-in: the buyers are corporate clients, so it is work email
 * with a password or a one-time code.
 */
export default function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState(CONSULTANT.email);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    // A beat of latency, so the transition into the console reads as a sign-in.
    setTimeout(onSignedIn, 850);
  };

  const field =
    'h-10 w-full rounded-md border border-[var(--ds-border-strong)] bg-white px-3 text-[13.5px] text-[var(--ds-text)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--ds-text-3)] focus:border-[var(--ds-accent)] focus:shadow-[0_0_0_3px_var(--ds-accent-weak)]';

  return (
    <div className="demo-root flex min-h-screen flex-col bg-white">
      <main className="grid flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(26rem,38rem)]">
        {/* The data map, on white */}
        <section className="order-2 flex min-w-0 flex-col gap-10 border-t border-[var(--ds-border)] px-5 py-8 lg:order-1 lg:border-t-0 lg:px-10 lg:py-9">
          <div className="ds-rise max-w-xl" style={{ animationDelay: '60ms' }}>
            <h2 className="ds-display text-[34px] text-[var(--ds-text)] sm:text-[44px]">
              Keep what the law allows.
              <br />
              <span className="text-[var(--ds-text-3)]">Erase the rest.</span>
            </h2>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-[var(--ds-text-2)]">
              Recruiting, HR, payroll, attendance, marketing, client delivery — every system a client runs,
              every record in it mapped to the rule that lets them keep it, or the date it has to go.
            </p>
            <div className="mt-6">
              <DeadlineStrip />
            </div>
          </div>

          <div className="ds-rise mt-auto" style={{ animationDelay: '160ms' }}>
            <DataMapScan />
          </div>
        </section>

        {/* The form, on a raised card over a grey surface */}
        <section className="order-1 flex items-center justify-center bg-[#eef1f5] px-5 py-10 lg:order-2 lg:border-l lg:border-[#e2e6ec] lg:px-12">
          <div
            className="ds-rise w-full max-w-[26rem] overflow-hidden rounded-xl border border-[#e2e6ec] bg-white shadow-[0_1px_2px_rgba(16,17,19,0.05),0_18px_44px_-14px_rgba(16,17,19,0.16)]"
            style={{ animationDelay: '80ms' }}
          >
            {/* Which system this is, and who makes it */}
            <div className="border-b border-[var(--ds-border)] px-7 py-5 sm:px-10">
              <ProductLockup size="lg" layout="row" />
              <p className="mt-3 text-[12.5px] leading-relaxed text-[var(--ds-text-2)]">
                Compliance workspace for India&rsquo;s Digital Personal Data Protection Act, 2023.
              </p>
              <p className="ds-label mt-2 flex flex-wrap items-center gap-x-2 text-[var(--ds-text-3)]">
                {['Register', 'Consent', 'Breach', 'Evidence'].map((m, i) => (
                  <span key={m} className="inline-flex items-center gap-2">
                    {i > 0 && <span className="h-1 w-1 rounded-full bg-[var(--ds-brand)]" aria-hidden />}
                    {m}
                  </span>
                ))}
              </p>
            </div>

            <div className="p-7 sm:p-10">
              <h1 className="ds-display text-[28px]">Sign in</h1>
              <p className="mt-1.5 text-[13.5px] text-[var(--ds-text-2)]">Consultant and client workspace.</p>

              <form onSubmit={submit} className="mt-7 space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-[12.5px] font-medium text-[var(--ds-text)]">
                    Work email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="username"
                    className={field}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-baseline justify-between gap-2">
                    <label htmlFor="password" className="block text-[12.5px] font-medium text-[var(--ds-text)]">
                      Password
                    </label>
                    <span className="text-[12px] text-[var(--ds-text-3)]">Forgot?</span>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      readOnly
                      defaultValue="demo-placeholder"
                      className={`${field} pr-10`}
                    />
                    <svg
                      viewBox="0 0 16 16"
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ds-text-3)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      role="img"
                      aria-label="Saved in your password manager"
                    >
                      <circle cx="5.5" cy="8" r="3" />
                      <path d="M8.5 8H14M12 8v2.2M14 8v1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={remember}
                    onClick={() => setRemember(!remember)}
                    className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] leading-none transition-colors ${
                      remember
                        ? 'border-[var(--ds-accent)] bg-[var(--ds-accent)] text-white'
                        : 'border-[var(--ds-border-strong)] bg-white text-transparent'
                    }`}
                  >
                    ✓
                  </button>
                  <span className="text-[13px] text-[var(--ds-text-2)]">Keep me signed in</span>
                </label>

                <button
                  type="submit"
                  disabled={busy}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[var(--ds-accent)] text-[13.5px] font-medium text-white transition-colors hover:bg-[var(--ds-accent-hover)] disabled:opacity-80"
                >
                  {busy && (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
                  )}
                  {busy ? 'Signing in…' : 'Sign in'}
                </button>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full text-center text-[12.5px] font-medium text-[var(--ds-accent-hover)] transition-colors hover:text-[var(--ds-accent)] disabled:opacity-80"
                >
                  Use a one-time code instead
                </button>
              </form>

              <div className="mt-8 space-y-1.5 border-t border-[var(--ds-border)] pt-4">
                <p className="ds-label text-[var(--ds-text-3)]">Last sign-in · {lastSignIn()}</p>
                <p className="ds-label text-[var(--ds-warn)]">Prototype · no credentials are checked</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--ds-border)] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 lg:px-10">
          <p className="ds-label text-[var(--ds-text-3)]">© 2026 DataSentry. All rights reserved.</p>
          <nav className="flex flex-wrap items-center gap-5">
            {[
              ['Privacy', '/privacy-policy'],
              ['Terms', '/terms-of-service'],
              ['Support', '/contact'],
              ['datasentry.in ↗', '/'],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="ds-label text-[var(--ds-text-3)] transition-colors hover:text-[var(--ds-text)]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
