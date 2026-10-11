import { ORGS, QUESTIONNAIRE as Q, getOrg } from '@/modules/app/dpdp/mock/data';
import DiscoveryInterview from '@/modules/app/dpdp/components/DiscoveryInterview';
import {
  Button, Card, CiteLink, DemoNote, PageHeader, Panel, ProvenanceTag, Stat, Tag,
} from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

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
  const { org: slug } = await params;
  const org = getOrg(slug);
  const pct = Math.round((Q.answered / Q.total) * 100);

  // Meridian is in discovery, phase 1 — so its interview is empty and live.
  // Northstar's is mid-flight and shown as a worked example.
  if (org.engagement.startsWith('Discovery')) {
    return (
      <div className="space-y-5">
        <PageHeader
          eyebrow="M1 · Discovery"
          title="Guided discovery interview"
          sub={`Nothing answered yet · ${org.name} · the question set adapts to what you tell it`}
        />
        <DiscoveryInterview org={org} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="M1 · Discovery"
        title="Guided discovery interview"
        sub="Adaptive question set. No system integration — the interview plus uploaded exports produce the register."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Questions answered" value={`${Q.answered}/${Q.total}`} note={`${pct}% complete`} tone="warn" />
        <Stat label="Current section" value={`${Q.section} of ${Q.sections}`} note={Q.sectionName} />
        <Stat label="Activities derived" value={19} note="2 proposed by the model, 17 from the ITES pack" />
        <Stat label="Evidence files" value={4} note="ATS, Drive, Workspace, HRMS" tone="good" />
      </div>

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
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-medium ${
                      done
                        ? 'bg-[var(--ds-ok-weak)] text-[var(--ds-ok)]'
                        : current
                          ? 'bg-[var(--ds-accent)] text-white'
                          : 'bg-[var(--ds-subtle-2)] text-[var(--ds-text-3)]'
                    }`}
                  >
                    {done ? '✓' : n}
                  </span>
                  <span className={`truncate text-[12.5px] ${current ? 'font-medium' : ''}`}>{s}</span>
                </span>
                <span className="shrink-0 text-[11.5px] text-[var(--ds-text-3)]">
                  {done ? 'Complete' : current ? 'In progress' : 'Not started'}
                </span>
              </li>
            );
          })}
        </ol>
      </Panel>

      <Panel title={`Section ${Q.section} — ${Q.sectionName}`} sub={`Question ${Q.answered + 1} of ${Q.total}`}>
        <div className="space-y-4">
          <Card tone="subtle" className="p-4">
            <p className="text-[14.5px] font-semibold leading-snug tracking-[-0.01em]">{Q.question}</p>
            <p className="mt-2 border-l-2 border-[var(--ds-border-strong)] pl-3 text-[12.5px] leading-relaxed text-[var(--ds-text-2)]">
              <span className="font-medium text-[var(--ds-text)]">Why this is asked — </span>
              {Q.why}
            </p>
          </Card>

          <Card tone="accent">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <ProvenanceTag p="ai_suggested" />
              <span className="text-[11.5px] text-[var(--ds-text-2)]">
                Drafted from sections 1–3 · awaiting consultant review
              </span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-[var(--ds-text)]">{Q.suggestion}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="primary">Accept</Button>
              <Button>Edit</Button>
              <Button variant="ghost">Ask the client</Button>
            </div>
          </Card>

          <div>
            <p className="mb-2 ds-label text-[var(--ds-text-3)]">
              Follow-up questions generated from this answer
            </p>
            <ul className="space-y-1.5">
              {Q.followUps.map((f) => (
                <li
                  key={f}
                  className="rounded-md border border-[var(--ds-border)] bg-[var(--ds-panel)] px-3 py-2 text-[12.5px] text-[var(--ds-text-2)]"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Fields this answer populates" sub="Every field carries its provenance">
          <ul className="space-y-2">
            {Q.derived.map((d) => (
              <li key={d.field}>
                <Card className="p-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[12.5px] font-medium">{d.field}</span>
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
            <p className="text-[12.5px] leading-relaxed text-[var(--ds-text-2)]">
              The model proposes activities and normalises free-text answers. Role, lawful basis and every gap
              finding are produced by a deterministic versioned rule set over the structured register, each citing
              a provision.
            </p>
            <Card>
              <p className="ds-label text-[var(--ds-text-3)]">
                Rule fired on this section
              </p>
              <p className="mt-1 text-[12.5px] font-medium">
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
            <Card tone="danger">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="ds-label text-[var(--ds-danger)]">
                  Rule fired · raised a finding
                </p>
                <Tag tone="alert">G-06</Tag>
              </div>
              <p className="mt-1 text-[12.5px] font-medium">
                R-24 — Alumni marketing to ex-employees has no determined basis
              </p>
            </Card>
            <p className="text-[11.5px] text-[var(--ds-text-3)]">
              Rule set v1.4 · {org.activities} activities evaluated · 14 findings raised
            </p>
          </div>
        </Panel>
      </div>

      <Panel title="Uploaded evidence" sub="Closes the gap between what the client declares and what is actually true" flush>
        <ul>
          {[
            ['ATS candidate export', 'Zoho Recruit · 6,431 rows · 09 Oct 2026', '4,812 records past the declared 180-day purpose', 'bad'],
            ['Drive sharing report', 'Google Workspace · 09 Oct 2026', 'HR/Payroll/FY26 shared with anyone holding the link', 'bad'],
            ['Workspace user list', 'Google Workspace · 09 Oct 2026', '23 enabled accounts for departed employees', 'bad'],
            ['HRMS employee roster', 'Keka HR · 240 rows · 08 Oct 2026', 'Reconciled — headcount matches', 'good'],
          ].map(([name, src, finding, tone]) => (
            <li
              key={name}
              className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 border-b border-[var(--ds-border)] px-4 py-3 last:border-b-0 sm:px-5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-medium">{name}</p>
                <p className="text-[11.5px] text-[var(--ds-text-3)]">{src}</p>
                <p className="mt-0.5 text-[12.5px] text-[var(--ds-text-2)]">{finding}</p>
              </div>
              <Tag tone={tone === 'bad' ? 'alert' : 'ok'}>{tone === 'bad' ? 'Finding raised' : 'Clean'}</Tag>
            </li>
          ))}
        </ul>
        <div className="border-t border-[var(--ds-border)] p-4 sm:p-5">
          <DemoNote>
            These are one-click exports the client can already produce, so no integration is needed in v1. The
            same reconciliation engine accepts live connectors later without rework.
          </DemoNote>
        </div>
      </Panel>
    </div>
  );
}
