import { loadClient } from '@/modules/app/dpdp/routeData';
import Link from 'next/link';
import { MODULES } from '@/modules/app/dpdp/nav';
import { demoPath } from '@/modules/app/dpdp/routes';
import { parseDisplayDate } from '@/modules/app/dpdp/time';
import AttentionList from '@/modules/app/dpdp/components/AttentionList';
import { RequestsStat } from '@/modules/app/dpdp/components/RequestsLive';
import When from '@/modules/app/dpdp/components/When';
import { ICONS } from '@/modules/app/ui/Icons';
import ScoreBlock from '@/modules/app/dpdp/components/ScoreBlock';
import {
  Button, Change, CiteLink, DemoNote, NextStep, Person, PageHeader, Panel, Stat,
} from '@/modules/app/ui/ui';


/**
 * The client's home: the one next step, the score, one worklist (what needs
 * attention, then high-severity findings), where each module stands, and what
 * changed. Everything comes from the client's own data.
 */
export default async function Overview({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  const openIncident = d.incidents.find((i) => i.status === 'Open' && i.deadlineIso);
  const left = d.evidence.filter((e) => e.status !== 'Generated' && e.status !== 'Not started');

  return (
    <div className="space-y-8">
      <PageHeader title="Readiness overview" sub={`${org.engagement} · last reviewed ${org.lastReview}`} />

      {/* One next step per client: the most urgent thing, named as an action. */}
      {openIncident ? (
        <NextStep
          title={`Send the Board intimation for ${openIncident.id}`}
          action={<Button as="link" variant="primary" href={demoPath(org.slug, 'breach', 'intimation')}>Open the Board intimation</Button>}
        >
          {openIncident.affected} data principals affected · Rule 7 deadline{' '}
          <span className="font-medium text-[var(--ds-danger)]">{openIncident.deadline}</span>
        </NextStep>
      ) : !d.registerBuilt ? (
        <NextStep
          title="Run the discovery interview with the HR head"
          action={<Button as="link" variant="primary" href={demoPath(org.slug, 'discovery')}>Start the interview</Button>}
        >
          Nothing is on the register yet. Six seed questions decide what the engine asks next — about 40 minutes.
        </NextStep>
      ) : left.length ? (
        <NextStep
          title={`Close out the evidence pack — ${left.length} artefact${left.length === 1 ? '' : 's'} left`}
          action={<Button as="link" variant="primary" href={demoPath(org.slug, 'evidence')}>Finish the evidence pack</Button>}
        >
          {left.map((e) => `${e.name} (${e.status.toLowerCase()})`).join(' · ')}
        </NextStep>
      ) : null}

      <AttentionList org={org.slug} exclude={openIncident ? [openIncident.id] : []} />

      {/* Status, in one place: the score and its trend, the headline figures,
          then each module's progress — a card per module, each a way in. */}
      <section className="space-y-3">
        <div>
          <h2 className="text-[17px] font-semibold tracking-[-0.015em]">Where things stand</h2>
          <p className="mt-0.5 text-[13px] text-[var(--ds-text-3)]">The readiness score at each review, the headline figures, and each module&rsquo;s progress</p>
        </div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-border)] lg:grid-cols-6">
        <div className="col-span-2 grid lg:col-span-3">
          <ScoreBlock
            score={org.score}
            trend={org.trend}
            history={d.scoreHistory.map((h) => ({ at: parseDisplayDate(h.on)!.getTime(), value: h.score, label: h.on }))}
          />
        </div>
        <Stat label="Processing activities" value={d.registerBuilt ? org.activities : '—'} note={d.registerBuilt ? `${org.exemptActivities} exempt s.17(1)(d)` : 'after discovery'} />
        <Stat label="High gaps" value={d.registerBuilt ? org.openGaps.high : '—'} note={d.registerBuilt ? `${org.openGaps.medium} medium, ${org.openGaps.low} low` : 'after discovery'} tone={org.openGaps.high ? 'bad' : 'plain'} />
        <RequestsStat org={org.slug} />
      </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {d.progress.map((p) => {
            const nav = MODULES.find((m) => m.seg === p.seg);
            return (
              <Link
                key={p.module}
                href={demoPath(org.slug, p.seg)}
                className="group rounded-lg border border-[var(--ds-border)] p-3.5 transition-colors hover:border-[var(--ds-border-strong)] hover:bg-[var(--ds-subtle)]"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[var(--ds-text-3)] group-hover:text-[var(--ds-accent)]">{nav && ICONS[nav.icon]}</span>
                  <span className="ds-figure text-[13px] text-[var(--ds-text-2)]">{p.pct}%</span>
                </span>
                <span className="mt-2.5 block text-[13px] font-semibold leading-snug">{p.module}</span>
                <span className="mt-2 block h-1 overflow-hidden rounded-full bg-[var(--ds-subtle-2)]">
                  <span className="block h-full rounded-full bg-[var(--ds-accent)]" style={{ width: `${p.pct}%` }} />
                </span>
                <span className="mt-2 block text-[12px] leading-snug text-[var(--ds-text-3)]">{p.note}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel title="Role determination" sub="Decided per activity, never per department">
          {d.roles ? (
            <>
              <ul className="-mt-1 divide-y divide-[var(--ds-border)]">
                <li className="py-3">
                  <p className="flex items-baseline justify-between gap-3 text-[13px] font-semibold tracking-[-0.01em]">
                    Data Fiduciary <span className="ds-figure text-[13px] font-normal text-[var(--ds-text-2)]">{d.roles.fiduciary.count} activities</span>
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[var(--ds-text-2)]">{d.roles.fiduciary.text}</p>
                </li>
                <li className="py-3">
                  <p className="flex items-baseline justify-between gap-3 text-[13px] font-semibold tracking-[-0.01em]">
                    <span className="flex items-center gap-2">Exempt <CiteLink provision="s.17(1)(d)" /></span>
                    <span className="ds-figure text-[13px] font-normal text-[var(--ds-ok)]">{d.roles.exempt.count} activities</span>
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[var(--ds-text-2)]">{d.roles.exempt.text}</p>
                </li>
              </ul>
              <div className="mt-3">
                <DemoNote>
                  This is the panel that changes the sales conversation: it tells the client which processing they can
                  stop worrying about. Security safeguards and processor contracts still survive the exemption.
                </DemoNote>
              </div>
            </>
          ) : (
            <p className="text-[14px] leading-relaxed text-[var(--ds-text-2)]">
              Decided once the discovery interview has built the register — for each activity, whether{' '}
              {org.name} is the Data Fiduciary, a processor for a client, or exempt.
            </p>
          )}
        </Panel>

        <Panel title="Recent activity" sub="From the append-only audit log — each change shows the old and the new value" flush>
          <ul>
            {d.audit.slice(0, 6).map((e) => (
              <li
                key={e.at + e.what}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[var(--ds-border)] px-4 py-2.5 last:border-b-0 sm:px-5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px]">
                    <span className="ds-id mr-1.5 text-[11px] text-[var(--ds-text-3)]">{e.ref}</span>
                    {e.what}
                  </span>
                  {e.change && <Change {...e.change} />}
                </span>
                <Person name={e.who} compact />
                <When date={e.at} kind="event" className="w-20 shrink-0 text-right text-[12px] text-[var(--ds-text-3)]" />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
