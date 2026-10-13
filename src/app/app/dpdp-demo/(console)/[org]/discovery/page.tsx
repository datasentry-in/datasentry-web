import { loadClient } from '@/modules/app/dpdp/routeData';
import { demoPath } from '@/modules/app/dpdp/routes';
import DiscoveryInterview from '@/modules/app/dpdp/components/DiscoveryInterview';
import { BasisTag, ProvenanceTag } from '@/modules/app/dpdp/components/Tags';
import {
  Button, Card, CiteLink, DemoNote, Fact, Facts, PageHeader, Panel, Tag,
} from '@/modules/app/ui/ui';
import MockButton from '@/modules/app/ui/MockButton';


const SECTIONS = [
  'Company & scope',
  'Recruitment & candidates',
  'Employment lifecycle',
  'Exit & post-employment',
  'Client delivery & offshore work',
  'Premises, IT & monitoring',
  'Vendors & marketing',
];

export default async function Discovery({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  const data = d;
  const Q = data.questionnaire;
  const WALKTHROUGH = data.walkthrough;

  // Meridian is in discovery, phase 1 — so its interview is empty and live.
  // Northstar's is mid-flight and shown as a worked example.
  if (!Q) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Guided discovery interview"
          sub={`Nothing answered yet · ${org.name} · the question set adapts to what you tell it`}
        />
        <DiscoveryInterview org={org} />
      </div>
    );
  }

  const pct = Math.round((Q.answered / Q.total) * 100);
  const proposed = data.activities.filter((a) => a.provenance === 'ai_suggested').length;
  // A finding the rules raised from this client's answers, and the largest one a walkthrough confirmed.
  const raised = data.gaps.find((g) => g.basis === 'declared') ?? data.gaps[0];
  const observedTop = data.gaps.find((g) => g.basis === 'observed' && g.severity === 'High');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Guided discovery interview"
        sub="Adaptive question set. No integrations and no file imports — the interview, consultant walkthroughs and owner attestations build the register."
      />

      <Facts>
        <Fact label="Questions answered" value={`${Q.answered}/${Q.total}`} note={`${pct}% complete`} tone={pct < 100 ? 'warn' : 'good'} />
        <Fact label="Current section" value={`${Q.section} of ${Q.sections}`} note={Q.sectionName} />
        <Fact label="Activities derived" value={data.activities.length} note={`${proposed} proposed by the model, the rest from the ITES pack`} />
        {WALKTHROUGH && <Fact label="Walkthrough observations" value={WALKTHROUGH.observations.length} note={`${WALKTHROUGH.observations.filter((o) => o.result !== 'matches').length} differed from what was declared`} tone="warn" />}
      </Facts>

      <Panel title="Interview progress" sub={`${pct}% of the question set answered`} flush>
        <ol>
          {SECTIONS.map((s, i) => {
            const n = i + 1;
            const done = n < Q.section;
            const current = n === Q.section;
            return (
              <li
                key={s}
                className={`flex items-center justify-between gap-3 border-b border-[var(--ds-border)] px-4 py-2.5 last:border-b-0 sm:px-5 ${
                  current ? 'bg-[var(--ds-accent-weak)]' : ''
                }`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${
                      done
                        ? 'bg-[var(--ds-ok-weak)] text-[var(--ds-ok)]'
                        : current
                          ? 'bg-[var(--ds-accent)] text-white'
                          : 'bg-[var(--ds-subtle-2)] text-[var(--ds-text-3)]'
                    }`}
                  >
                    {done ? '✓' : n}
                  </span>
                  <span className={`truncate text-[13px] ${current ? 'font-medium' : ''}`}>{s}</span>
                </span>
                <span className="shrink-0 text-[12px] text-[var(--ds-text-3)]">
                  {done ? 'Complete' : current ? 'In progress' : 'Not started'}
                </span>
              </li>
            );
          })}
        </ol>
      </Panel>

      <Panel title={`Section ${Q.section} — ${Q.sectionName}`} sub={`Question ${Q.answered + 1} of ${Q.total}`}>
        <div className="space-y-4">
          <Card tone="plain" className="p-4">
            <p className="text-[15px] font-semibold leading-snug tracking-[-0.01em]">{Q.question}</p>
            <p className="mt-2 border-l-2 border-[var(--ds-border-strong)] pl-3 text-[14px] leading-relaxed text-[var(--ds-text-2)]">
              <span className="font-medium text-[var(--ds-text)]">Why this is asked — </span>
              {Q.why}
            </p>
          </Card>

          <Card tone="accent">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <ProvenanceTag p="ai_suggested" />
              <span className="text-[12px] text-[var(--ds-text-2)]">
                Drafted from sections 1–3 · awaiting consultant review
              </span>
            </div>
            <p className="text-[14px] leading-relaxed text-[var(--ds-text)]">{Q.suggestion}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <MockButton variant="primary" what="Accept the suggestion">Accept</MockButton>
              <MockButton what="Edit the suggestion">Edit</MockButton>
              <MockButton variant="ghost" what="Ask the client">Ask the client</MockButton>
            </div>
          </Card>

          <div>
            <p className="mb-2 ds-meta text-[var(--ds-text-3)]">
              Follow-up questions generated from this answer
            </p>
            <ul className="space-y-1.5">
              {Q.followUps.map((f) => (
                <li
                  key={f}
                  className="rounded-md border border-[var(--ds-border)] bg-[var(--ds-panel)] px-3 py-2 text-[13px] text-[var(--ds-text-2)]"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel title="Fields this answer populates" sub="Every field carries its provenance">
          <ul className="space-y-2">
            {Q.derived.map((d) => (
              <li key={d.field}>
                <Card className="p-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[13px] font-medium">{d.field}</span>
                    <ProvenanceTag p={d.provenance} />
                  </div>
                  <p className="mt-0.5 text-[12px] leading-snug text-[var(--ds-text-2)]">{d.value}</p>
                </Card>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <DemoNote>
              Nothing reaches an evidence export while it still reads AI suggested. The chip is the audit trail and
              the professional-liability control — it is why the generated pack is defensible.
            </DemoNote>
          </div>
        </Panel>

        <Panel title="Rule engine" sub="Conclusions are computed, not generated">
          <div className="space-y-3">
            <p className="text-[14px] leading-relaxed text-[var(--ds-text-2)]">
              The model proposes activities and normalises free-text answers. Role, lawful basis and every gap
              finding are produced by a deterministic versioned rule set over the structured register, each citing
              a provision.
            </p>
            <Card>
              <p className="ds-meta text-[var(--ds-text-3)]">
                Rule fired on this section
              </p>
              <p className="mt-1 text-[13px] font-medium">
                R-17 — Ex-employee processing must carry a basis other than s.7(i)
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--ds-text-2)]">
                Commentary is divided on whether the employment legitimate use survives the end of the employment
                relationship, so post-exit retention must rest on a statutory ground or consent.
              </p>
              <p className="mt-2">
                <CiteLink provision="s.7(i) read with s.8(7)" />
              </p>
            </Card>
            {raised && (
              <Card tone="danger">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="ds-meta text-[var(--ds-danger)]">Rule fired · raised a finding</p>
                  <Tag tone="alert">{raised.id}</Tag>
                </div>
                <p className="mt-1 text-[13px] font-medium">{raised.title}</p>
              </Card>
            )}
            <p className="text-[12px] text-[var(--ds-text-3)]">
              Rule set v1.4 · {org.activities} activities evaluated · {data.gaps.length} findings raised
            </p>
          </div>
        </Panel>
      </div>

      {WALKTHROUGH && (
      <Panel
        title="Declared, then observed"
        sub={`What the interview said, against what the client showed on the ${WALKTHROUGH.date.split(',')[0]} walkthrough`}
        right={<Button as="link" href={demoPath(org.slug, 'walkthrough')}>All walkthroughs</Button>}
        flush
      >
        <ul>
          {WALKTHROUGH.observations.map((o) => (
            <li
              key={o.system + o.looked}
              className="grid gap-x-6 gap-y-1 border-b border-[var(--ds-border)] px-4 py-3 last:border-b-0 sm:px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_10rem] lg:items-center"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-medium">{o.system}</p>
                <p className="text-[12px] text-[var(--ds-text-3)]">{o.looked}</p>
              </div>
              <p className="text-[13px] text-[var(--ds-text-2)]">
                <span className="ds-meta mr-1.5 text-[var(--ds-text-3)]">Declared</span>
                {o.declared ?? '—'}
              </p>
              <p className="text-[13px]">
                <span className="ds-meta mr-1.5 text-[var(--ds-text-3)]">Observed</span>
                {o.observed}
              </p>
              <span className="flex items-center gap-1.5 lg:justify-end">
                <BasisTag b="observed" />
                {o.finding ? <Tag tone="alert">{o.finding}</Tag> : <Tag tone="ok">Matches</Tag>}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-[var(--ds-border)] p-4 sm:p-5">
          <DemoNote>
            Nothing here was exported. The client screen-shared each system on a review call and the consultant recorded
            what they saw — a client who would never send a candidate dump to a third party will show it on screen.
            {observedTop && ` The biggest finding in the report — ${observedTop.title.toLowerCase()} — came from exactly that.`}
          </DemoNote>
        </div>
      </Panel>
      )}
    </div>
  );
}
