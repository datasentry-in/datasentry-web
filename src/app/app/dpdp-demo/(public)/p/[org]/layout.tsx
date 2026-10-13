import type { CSSProperties } from 'react';
import Link from 'next/link';
import { publicCentre } from '@/modules/app/dpdp/mock/clients';
import { CLIENT_THEME, ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import { demoPath } from '@/modules/app/dpdp/routes';
import { BrandLink } from '@/modules/app/ui/Brand';
import ClientMark from '@/modules/app/dpdp/components/ClientMark';

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
  const PRIVACY_CENTRE = publicCentre(org.slug);
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
            <ClientMark slug={org.slug} size={32} />
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
            <span className="text-[12px] font-medium text-[var(--ds-text-3)]">Powered by</span>
            <BrandLink />
          </span>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-2 text-[12px] text-[var(--ds-text-3)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ds-brand-yellow)] ring-1 ring-[#e5d400]" aria-hidden />
              Prototype — all data is illustrative.
            </span>
            <Link href={demoPath(org.slug, 'intake')} className="text-[12px] font-medium text-[var(--ds-text-2)] hover:text-[var(--ds-text)]">
              ← Consultant view
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
