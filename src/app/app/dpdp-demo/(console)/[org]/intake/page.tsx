import Link from 'next/link';
import {
  CHECK_IN, CONSENT_SUMMARY, DSRS, ORGS, PRIVACY_CENTRE, QUESTIONNAIRE, TASKS, WALKTHROUGH, getOrg,
} from '@/modules/app/dpdp/mock/data';
import type { EvidenceBasis } from '@/modules/app/dpdp/types';
import { demoPath } from '@/modules/app/dpdp/routes';
import {
  BasisTag, DemoNote, Fact, Facts, PageHeader, Panel, Tag,
} from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

type Channel = {
  name: string;
  does: string;
  detail: string;
  activity: string;
  basis?: EvidenceBasis;
  href: string;
  cta: string;
  external?: boolean;
};

function ChannelRow({ c }: { c: Channel }) {
  const link = (
    <span className="text-[13px] font-medium text-[var(--ds-accent-hover)] group-hover:underline">
      {c.cta} {c.external ? '↗' : '→'}
    </span>
  );
  return (
    <li className="border-b border-[var(--ds-border)] last:border-b-0">
      <Link
        href={c.href}
        target={c.external ? '_blank' : undefined}
        className="group grid gap-x-6 gap-y-1.5 px-4 py-3.5 transition-colors hover:bg-[var(--ds-subtle)] sm:px-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_10rem] lg:items-center"
      >
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[13px] font-semibold tracking-[-0.01em]">
            {c.name}
            {c.basis && <BasisTag b={c.basis} />}
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-[var(--ds-text-2)]">{c.does}</p>
        </div>
        <div className="min-w-0">
          <p className="ds-figure truncate text-[12px] text-[var(--ds-text-2)]">{c.detail}</p>
          <p className="mt-0.5 text-[12px] text-[var(--ds-text-3)]">{c.activity}</p>
        </div>
        <div className="lg:text-right">{link}</div>
      </Link>
    </li>
  );
}

export default async function Intake({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);

  const byChannel = (c: 'Privacy centre' | 'Email') => DSRS.filter((d) => d.channel === c).length;
  const open = TASKS.filter((t) => t.status === 'Open').length;
  const overdue = TASKS.filter((t) => t.status === 'Overdue').length;
  const attested = TASKS.filter((t) => t.status === 'Attested').length;
  const differs = WALKTHROUGH.observations.filter((o) => o.result !== 'matches').length;

  const created: Channel[] = [
    {
      name: 'Privacy centre',
      does: 'Data principals make requests, raise grievances and withdraw consent on a page branded for the client.',
      detail: PRIVACY_CENTRE.url,
      activity: `${byChannel('Privacy centre')} requests this quarter`,
      href: demoPath('p', org.slug),
      cta: 'Open the public page',
      external: true,
    },
    {
      name: 'Request inbox',
      does: 'Requests that arrive by email are forwarded here, timestamped and put on the same SLA clock.',
      detail: PRIVACY_CENTRE.inbox,
      activity: `${byChannel('Email')} request this quarter`,
      href: demoPath(org.slug, 'dsr'),
      cta: 'DSR desk',
    },
    {
      name: 'Consent capture',
      does: 'A hosted consent page, embedded on the careers site with one line. The consent ledger lives here.',
      detail: PRIVACY_CENTRE.consentSnippet,
      activity: `${CONSENT_SUMMARY.activeCandidate.toLocaleString('en-IN')} active candidate consents`,
      href: demoPath(org.slug, 'consent'),
      cta: 'Consent ledger',
    },
    {
      name: 'Incident report',
      does: 'Any member of staff reports a suspected breach. The 72-hour clock starts from when they became aware.',
      detail: 'Staff link · no login needed',
      activity: 'Last report 10 Oct 2026 — INC-2026-003',
      href: demoPath('p', org.slug, 'report'),
      cta: 'Open the form',
      external: true,
    },
  ];

  const register: Channel[] = [
    {
      name: 'Discovery interview',
      does: 'The adaptive questionnaire. Counts and dates are read off the client’s own screens, never exported.',
      detail: `${QUESTIONNAIRE.answered} of ${QUESTIONNAIRE.total} answered`,
      activity: `Section ${QUESTIONNAIRE.section} of ${QUESTIONNAIRE.sections} — ${QUESTIONNAIRE.sectionName}`,
      basis: 'declared',
      href: demoPath(org.slug, 'discovery'),
      cta: 'Interview',
    },
    {
      name: 'Consultant walkthroughs',
      does: 'On a review call the client screen-shares a system; the consultant records what they saw.',
      detail: `Last ${WALKTHROUGH.date.split(',')[0]} · next ${WALKTHROUGH.next}`,
      activity: `${WALKTHROUGH.observations.length} observations, ${differs} differed from the register`,
      basis: 'observed',
      href: demoPath(org.slug, 'walkthrough'),
      cta: 'Walkthroughs',
    },
    {
      name: 'Quarterly check-in',
      does: 'Six questions a quarter. Answers are compared with the register and anything new is flagged.',
      detail: `Due ${CHECK_IN.due} · sent to ${CHECK_IN.sentTo}`,
      activity: `Last on ${CHECK_IN.last.on} — ${CHECK_IN.last.changes} changes flagged`,
      basis: 'declared',
      href: demoPath(org.slug, 'check-in'),
      cta: 'Check-in',
    },
  ];

  const attestedWork: Channel[] = [
    {
      name: 'Fulfilment tasks',
      does: 'Erasures, withdrawals and expiries become a task per system. The owner does the work and attests it.',
      detail: `${TASKS.length} tasks generated from the register`,
      activity: `${open} open · ${overdue} overdue · ${attested} attested`,
      basis: 'attested',
      href: demoPath(org.slug, 'tasks'),
      cta: 'Tasks',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Intake channels"
        sub={`How information reaches ${org.name}'s register. The platform holds records about processing, and the records it is the system of record for — never copies of the client's systems.`}
      />

      <Facts>
        <Fact label="Channels live" value={created.length + register.length + attestedWork.length} note="none touch a client system" tone="good" />
        <Fact label="Requests this quarter" value={byChannel('Privacy centre') + byChannel('Email')} note={`${byChannel('Privacy centre')} privacy centre, ${byChannel('Email')} email`} />
        <Fact label="Tasks awaiting attestation" value={open + overdue} note={`${overdue} overdue`} tone={overdue ? 'bad' : 'warn'} />
        <Fact label="Check-in" value="Due" note={`${CHECK_IN.label} · ${CHECK_IN.due}`} tone="warn" />
      </Facts>

      <Panel
        title="Created here"
        sub="The platform is the system of record — no client system is involved"
        right={<Tag tone="ok">System of record</Tag>}
        flush
      >
        <ul>
          {created.map((c) => (
            <ChannelRow key={c.name} c={c} />
          ))}
        </ul>
      </Panel>

      <Panel title="Declared and observed" sub="What builds and maintains the register" flush>
        <ul>
          {register.map((c) => (
            <ChannelRow key={c.name} c={c} />
          ))}
        </ul>
      </Panel>

      <Panel title="Attested" sub="Work done in the client's own systems, confirmed by the person who did it" flush>
        <ul>
          {attestedWork.map((c) => (
            <ChannelRow key={c.name} c={c} />
          ))}
        </ul>
      </Panel>

      <Panel title="What never comes in" sub="Deliberately out of MVP — opt-in per client in Phase 2">
        <div className="flex flex-wrap gap-1.5">
          {['System connectors', 'File exports or dumps', 'Credentials to client systems', 'Copies of personal data from client systems'].map((x) => (
            <span
              key={x}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ds-border)] bg-[var(--ds-subtle)] px-2.5 py-1 text-[12px] text-[var(--ds-text-2)] line-through decoration-[var(--ds-text-3)]"
            >
              {x}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <DemoNote>
            Client stacks vary too much to build connectors for, and clients will not send internal exports to a
            third party. Every fact on the register is therefore declared, observed or attested — each with who and
            when — and the evidence pack says which. The trade-off is that nothing here is machine-verified; the
            consultant&rsquo;s review is the control.
          </DemoNote>
        </div>
      </Panel>
    </div>
  );
}
