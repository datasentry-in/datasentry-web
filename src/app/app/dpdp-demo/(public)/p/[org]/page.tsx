import type { Metadata } from 'next';
import Link from 'next/link';
import { CONSENT_SUMMARY, PRIVACY_CENTRE, getOrg } from '@/modules/app/dpdp/mock/data';
import { demoPath } from '@/modules/app/dpdp/routes';
import { RIGHTS } from '@/modules/app/dpdp/statute';
import { DemoNote } from '@/modules/app/ui/ui';

export async function generateMetadata({ params }: { params: Promise<{ org: string }> }): Promise<Metadata> {
  const { org } = await params;
  return { title: `Privacy centre — ${getOrg(org).name}` };
}

export default async function PrivacyCentre({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="ds-display text-[26px] sm:text-[30px]">Your information at {org.name}</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--ds-text-2)]">
          Whether you work here, worked here, applied for a role, or are a customer of a client we serve, you can see what
          we hold, ask us to change or erase it, withdraw consent, or raise a concern. We respond within{' '}
          {PRIVACY_CENTRE.responseDays} days.
        </p>
      </div>

      <section aria-label="What would you like to do?">
        <div className="grid gap-3 sm:grid-cols-2">
          {RIGHTS.map((r) => (
            <Link
              key={r.type}
              href={`${demoPath('p', org.slug, 'request')}?type=${r.type}`}
              className="group flex flex-col rounded-lg border border-[var(--ds-border)] bg-white p-4 transition-colors hover:border-[var(--ds-accent-border)] hover:bg-[var(--ds-accent-weak)]"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[14px] font-semibold tracking-[-0.01em] group-hover:text-[var(--ds-accent-hover)]">{r.title}</span>
                <span className="ds-figure text-[11px] text-[var(--ds-text-3)]">{r.right}</span>
              </span>
              <span className="mt-1 text-[13px] leading-snug text-[var(--ds-text-2)]">{r.note}</span>
              <span className="mt-3 text-[13px] font-medium text-[var(--ds-accent-hover)]">Start →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--ds-border)] bg-white p-4">
          <p className="ds-meta text-[var(--ds-text-3)]">Our notices</p>
          <ul className="mt-2 space-y-2 text-[13px]">
            <li className="flex items-baseline justify-between gap-3">
              <span>Notice to job applicants</span>
              <span className="ds-figure text-[12px] text-[var(--ds-text-3)]">{CONSENT_SUMMARY.noticeVersion}</span>
            </li>
            <li className="flex items-baseline justify-between gap-3">
              <span>Notice to employees</span>
              <span className="ds-figure text-[12px] text-[var(--ds-text-3)]">v2</span>
            </li>
          </ul>
          <p className="mt-2 text-[12px] text-[var(--ds-text-3)]">In {PRIVACY_CENTRE.languages.join(', ')}.</p>
        </div>
        <div className="rounded-lg border border-[var(--ds-border)] bg-white p-4">
          <p className="ds-meta text-[var(--ds-text-3)]">Contact</p>
          <p className="mt-2 text-[13px]">{PRIVACY_CENTRE.contactEmail}</p>
          <p className="mt-2 text-[12px] leading-relaxed text-[var(--ds-text-2)]">
            If you are not satisfied with our response, you can complain to the Data Protection Board of India.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-[var(--ds-border-strong)] bg-white px-4 py-3.5">
        <p className="text-[13px]">
          <span className="font-medium">Work at {org.name}?</span>{' '}
          <span className="text-[var(--ds-text-2)]">Report a suspected data incident — even if you&rsquo;re not sure.</span>
        </p>
        <Link href={demoPath('p', org.slug, 'report')} className="text-[13px] font-medium text-[var(--ds-accent-hover)] hover:underline">
          Report an incident →
        </Link>
      </div>

      <DemoNote>
        Hosted by the platform under the client&rsquo;s name and colours — this is the s.13 grievance mechanism and the
        rights route in one place, with no client system involved. A grievance officer&rsquo;s name appears under Contact
        once one is designated; at {org.name} that is still finding G-09.
      </DemoNote>
    </div>
  );
}
