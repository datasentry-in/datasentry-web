import type { CSSProperties } from 'react';
import Link from 'next/link';
import { CLIENT_THEME, ORGS, PRIVACY_CENTRE, getOrg } from '@/modules/app/dpdp/mock/data';
import { demoPath } from '@/modules/app/dpdp/routes';
import { Wordmark } from '@/modules/app/ui/Brand';

/**
 * Client-facing pages — the privacy centre, the request form, the staff
 * incident report. No console chrome and no sign-in: data principals and staff
 * reach these from the client's own site. White-labelled by overriding the
 * accent tokens with the client's colour.
 */
export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

export default async function ClientPublicLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  const t = CLIENT_THEME[org.slug] ?? CLIENT_THEME.northstar;
  const theme = {
    '--ds-accent': t.accent,
    '--ds-accent-hover': t.hover,
    '--ds-accent-weak': t.weak,
    '--ds-accent-border': t.border,
  } as CSSProperties;

  return (
    <div className="demo-root flex min-h-screen flex-col bg-[var(--ds-bg)]" style={theme}>
      <header className="border-b border-[var(--ds-border)] bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-5 py-3.5">
          <Link href={demoPath('p', org.slug)} className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md text-[12px] font-bold text-white"
              style={{ background: t.accent }}
              aria-hidden
            >
              {t.initials}
            </span>
            <span className="leading-tight">
              <span className="block text-[14px] font-semibold tracking-[-0.01em]">{org.name}</span>
              <span className="block text-[12px] text-[var(--ds-text-3)]">Privacy centre · {PRIVACY_CENTRE.url}</span>
            </span>
          </Link>
          <nav aria-label="Language" className="flex flex-wrap gap-1">
            {PRIVACY_CENTRE.languages.map((l, i) => (
              <span
                key={l}
                aria-current={i === 0 ? 'true' : undefined}
                className={`rounded-full border px-2 py-0.5 text-[12px] ${
                  i === 0
                    ? 'border-[var(--ds-accent)] bg-[var(--ds-accent-weak)] font-medium text-[var(--ds-accent-hover)]'
                    : 'border-[var(--ds-border)] bg-white text-[var(--ds-text-2)]'
                }`}
              >
                {l}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:py-10">{children}</main>

      <footer className="border-t border-[var(--ds-border)] bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-4">
          <span className="flex items-center gap-1.5">
            <span className="ds-label text-[var(--ds-text-3)]">Powered by</span>
            <Wordmark className="h-[15px] w-auto" />
          </span>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="ds-label text-[var(--ds-warn)]">Prototype · all data illustrative</span>
            <Link href={demoPath(org.slug, 'intake')} className="ds-label text-[var(--ds-text-3)] hover:text-[var(--ds-text)]">
              ← Consultant view
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
