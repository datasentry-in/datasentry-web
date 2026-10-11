import { ORGS, QUESTIONNAIRE as Q, getOrg } from '../../_data/mock';
import { CiteLink, DemoNote, Panel, ProvenanceTag, Stat, Tag } from '../../_components/ui';

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

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 inline-block border-2 border-black bg-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
          M1 · Discovery
        </p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
          Guided discovery interview
        </h1>
        <p className="mt-1 font-mono text-xs text-neutral-700">
          Adaptive question set. No system integration — the interview plus uploaded exports produce the register.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Questions answered" value={`${Q.answered}/${Q.total}`} note={`${pct}% complete`} tone="warn" />
        <Stat label="Current section" value={`${Q.section} of ${Q.sections}`} note={Q.sectionName} />
        <Stat label="Activities derived" value={19} note="2 proposed by the model, 17 from the ITES pack" />
        <Stat label="Evidence files" value={4} note="ATS, Drive, Workspace, HRMS" tone="good" />
      </div>

      <Panel title="Interview progress">
        <ol className="space-y-1.5">
          {SECTIONS.map((s, i) => {
            const n = i + 1;
            const done = n < Q.section;
            const current = n === Q.section;
            return (
              <li
                key={s}
                className={`flex items-center justify-between gap-2 border-2 border-black px-3 py-2 ${
                  current ? 'bg-neutral-200' : done ? 'bg-white' : 'bg-neutral-100'
                }`}
              >
                <span className="font-mono text-[11px] font-bold uppercase">
                  {n}. {s}
                </span>
                <span className="font-mono text-[10px] font-bold uppercase">
                  {done ? 'Complete' : current ? 'In progress' : 'Not started'}
                </span>
              </li>
            );
          })}
        </ol>
      </Panel>

      <Panel title={`Section ${Q.section} — ${Q.sectionName}`} sub={`Question ${Q.answered + 1} of ${Q.total}`}>
        <div className="space-y-4">
          <div className="border-[3px] border-black bg-background-dark p-4">
            <p className="font-display text-base font-bold text-white sm:text-lg">{Q.question}</p>
            <p className="mt-2 border-l-4 border-white pl-3 font-mono text-[11px] leading-relaxed text-neutral-300">
              <span className="font-bold uppercase text-white">Why this is asked · </span>
              {Q.why}
            </p>
          </div>

          <div className="border-2 border-black bg-neutral-100 p-3">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <ProvenanceTag p="ai_suggested" />
              <span className="font-mono text-[10px] uppercase text-neutral-600">
                Drafted from sections 1–3 · awaiting consultant review
              </span>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-neutral-900">{Q.suggestion}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="border-2 border-black bg-black px-3 py-1.5 font-mono text-[10px] font-bold uppercase text-white shadow-[3px_3px_0px_0px_#000]">
                Accept
              </span>
              <span className="border-2 border-black bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#000]">
                Edit
              </span>
              <span className="border-2 border-black bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#000]">
                Ask the client
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 font-mono text-[10px] font-bold uppercase text-neutral-700">
              Follow-up questions generated from this answer
            </p>
            <ul className="space-y-1.5">
              {Q.followUps.map((f) => (
                <li key={f} className="border-2 border-black bg-white px-3 py-2 font-mono text-[11px]">
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
              <li key={d.field} className="border-2 border-black bg-white p-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase">{d.field}</span>
                  <ProvenanceTag p={d.provenance} />
                </div>
                <p className="font-mono text-[11px] text-neutral-700">{d.value}</p>
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
          <div className="space-y-2">
            <p className="font-mono text-[11px] leading-relaxed text-neutral-800">
              The model proposes activities and normalises free-text answers. Role, lawful basis and every gap
              finding are produced by a deterministic versioned rule set over the structured register, each citing
              a provision.
            </p>
            <div className="border-2 border-black bg-white p-3">
              <p className="font-mono text-[10px] font-bold uppercase text-neutral-600">Rule fired on this section</p>
              <p className="mt-1 font-mono text-[11px] font-bold">
                R-17 — Ex-employee processing must carry a basis other than s.7(i)
              </p>
              <p className="font-mono text-[11px] text-neutral-700">
                Commentary is divided on whether the employment legitimate use survives the end of the employment
                relationship, so post-exit retention must rest on a statutory ground or consent.
              </p>
              <p className="mt-1">
                <CiteLink provision="s.7(i) read with s.8(7)" />
              </p>
            </div>
            <div className="border-2 border-black bg-black p-3 text-white">
              <p className="font-mono text-[10px] font-bold uppercase">Rule fired · raised a finding</p>
              <p className="mt-1 font-mono text-[11px] font-bold">
                R-24 — Alumni marketing to ex-employees has no determined basis → G-06
              </p>
            </div>
            <p className="font-mono text-[10px] text-neutral-600">
              Rule set v1.4 · {org.activities} activities evaluated · 14 findings raised
            </p>
          </div>
        </Panel>
      </div>

      <Panel title="Uploaded evidence" sub="Closes the gap between what the client declares and what is actually true">
        <ul className="space-y-2">
          {[
            ['ATS candidate export', 'Zoho Recruit · 6,431 rows · 09 Oct 2026', '4,812 records past the declared 180-day purpose', 'bad'],
            ['Drive sharing report', 'Google Workspace · 09 Oct 2026', 'HR/Payroll/FY26 shared with anyone holding the link', 'bad'],
            ['Workspace user list', 'Google Workspace · 09 Oct 2026', '23 enabled accounts for departed employees', 'bad'],
            ['HRMS employee roster', 'Keka HR · 240 rows · 08 Oct 2026', 'Reconciled — headcount matches', 'good'],
          ].map(([name, src, finding, tone]) => (
            <li key={name} className="border-2 border-black bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-sm font-bold uppercase">{name}</span>
                <Tag tone={tone === 'bad' ? 'alert' : 'ok'}>{tone === 'bad' ? 'Finding raised' : 'Clean'}</Tag>
              </div>
              <p className="font-mono text-[10px] text-neutral-600">{src}</p>
              <p className="font-mono text-[11px] text-neutral-800">{finding}</p>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <DemoNote>
            These are one-click exports the client can already produce, so no integration is needed in v1. The
            same reconciliation engine accepts live connectors later without rework.
          </DemoNote>
        </div>
      </Panel>
    </div>
  );
}
