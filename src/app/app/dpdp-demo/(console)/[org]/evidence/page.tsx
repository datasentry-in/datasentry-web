import { loadClient } from '@/modules/app/dpdp/routeData';
import type { EvidenceItem } from '@/modules/app/dpdp/types';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';

/** A short, stable stand-in for an entry's chain hash. */
const hashOf = (s: string) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const hex = h.toString(16).padStart(8, '0');
  return `${hex.slice(0, 4)}…${hex.slice(4)}`;
};
import {
  Card, DemoNote, Fact, Facts, PageHeader, Panel, TableWrap, Tag, Td, Th,
} from '@/modules/app/ui/ui';
import MockButton from '@/modules/app/ui/MockButton';


const tone = (s: EvidenceItem['status']) =>
  s === 'Generated' ? 'ok' : s === 'Review pending' ? 'watch' : s === 'Incomplete' ? 'alert' : 'plain';

export default async function Evidence({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  if (!d.registerBuilt) return <ModulePending org={org} title="Evidence & audit pack" what="The evidence pack" />;
  const EVIDENCE_PACK = d.evidence;
  const generated = EVIDENCE_PACK.filter((e) => e.status === 'Generated').length;
  const languages = d.privacyCentre?.languages ?? d.consent?.summary.languages ?? [];
  const legitimate = d.activities.filter((a) => a.basis.startsWith('s.7(i)')).length;
  const consentBased = d.activities.filter((a) => a.basis === 'Consent').length;
  const exempt = d.activities.filter((a) => a.role === 'Exempt').length;
  const grievance = d.privacyCentre?.grievanceOfficer ?? null;
  // What stops a complete pack: every artefact not yet generated, with the finding its note names.
  const blockers = EVIDENCE_PACK.filter((e) => e.status !== 'Generated').map((e) => ({ ...e, finding: e.detail.match(/G-\d+/)?.[0] }));
  const blocked = EVIDENCE_PACK.filter((e) => e.status !== 'Generated').length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Evidence & audit pack"
        sub={`The compliance file a board or a Board of India query actually asks for · ${org.name}`}
      />

      <Facts>
        <Fact label="Artefacts generated" value={`${generated}/${EVIDENCE_PACK.length}`} note="the confirmed register is the source" tone={generated < EVIDENCE_PACK.length ? 'warn' : 'good'} />
        <Fact label="Blocked or pending" value={blocked} note="each traces to a finding" tone="bad" />
        <Fact label="Languages" value={languages.length} note={languages.join(', ')} tone="good" />
        <Fact label="Register as source" value={org.lastReview} note="hash-stamped on generation" />
      </Facts>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold tracking-[-0.01em]">Export the compliance file</p>
          <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-[var(--ds-text-2)]">
            Single PDF plus a ZIP of every artefact. Each document carries its generation timestamp, the source
            RoPA version and the reviewer who signed it off.
          </p>
        </div>
        <MockButton variant="primary" what="Generate the pack" className="px-4 py-2 text-[13px]">
          Generate the pack
        </MockButton>
      </div>

      <Panel title="Artefacts" sub="Generated from the client's own register — not boilerplate" flush>
        <TableWrap>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <Th>Artefact</Th>
                <Th>Detail</Th>
                <Th>Status</Th>
                <Th>Generated</Th>
              </tr>
            </thead>
            <tbody>
              {EVIDENCE_PACK.map((e) => (
                <tr
                  key={e.name}
                  className={e.status === 'Generated' ? 'hover:bg-[var(--ds-subtle)]' : 'bg-[var(--ds-warn-weak)]'}
                >
                  <Td className="font-medium">{e.name}</Td>
                  <Td className="text-[var(--ds-text-2)]">{e.detail}</Td>
                  <Td>
                    <Tag tone={tone(e.status)}>{e.status}</Tag>
                  </Td>
                  <Td className="tnum text-[var(--ds-text-2)]">{e.ts}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Panel>

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel title="Policy generator" sub="Assembled from reviewed clause libraries, filled with client specifics" flush>
          <ul>
            {[
              ['Employee privacy notice', `Lists the ${legitimate} activities running on s.7(i) and the ${consentBased} needing consent`],
              ['Candidate privacy notice', 'Rule 3 itemised — each data item with its purpose, and a withdrawal link'],
              ['Retention & erasure policy', `Keyed to all ${d.activities.length} activities plus the statutory retention matrix`],
              ['DSR standard operating procedure', 'Intake, identity verification, SLA, lawful part-refusal'],
              ['Breach response SOP', '72-hour clock, escalation ladder, both notification templates'],
              ['Processor DPA template', 's.8(2) clauses — purpose limitation, security, sub-processing, erasure'],
              ['Grievance & contact designation note', grievance ? `s.13 — names ${grievance} as the contact person` : 's.13 — blocked until a contact person is named'],
              ['s.17(1)(d) applicability memo', `Per-engagement reasoning for the ${exempt} exempt activit${exempt === 1 ? 'y' : 'ies'}`],
            ].map(([doc, note]) => (
              <li key={String(doc)} className="border-b border-[var(--ds-border)] px-4 py-2.5 last:border-b-0 sm:px-5">
                <p className="text-[13px] font-medium">{doc}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-[var(--ds-text-2)]">{note}</p>
              </li>
            ))}
          </ul>
          <div className="border-t border-[var(--ds-border)] p-4 sm:p-5">
            <DemoNote>
              The model assembles and fills; it does not draft novel legal language. Clause libraries are reviewed
              once, then reused across every client — which is what makes generated policies safe to issue under
              DataSentry&rsquo;s name.
            </DemoNote>
          </div>
        </Panel>

        <Panel title="What is blocking a complete pack" sub="Evidence completeness is itself a readiness signal">
          <ul className="space-y-2">
            {blockers.length === 0 && <li className="text-[14px] text-[var(--ds-text-3)]">Nothing — every artefact is generated.</li>}
            {blockers.map(({ name: doc, detail: why, finding: gap }) => (
              <li key={String(doc)}>
                <Card tone="danger" className="p-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[13px] font-medium">{doc}</span>
                    {gap ? <Tag tone="alert">{gap}</Tag> : <Tag tone="watch">Pending</Tag>}
                  </div>
                  <p className="mt-0.5 text-[12px] text-[var(--ds-text-2)]">{why}</p>
                </Card>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <DemoNote>
              {blockers.length} of the {EVIDENCE_PACK.length} artefacts {blockers.length === 1 ? 'is' : 'are'} blocked on client
              action rather than on the platform. Making that visible is what moves a remediation plan along between
              review calls.
            </DemoNote>
          </div>
        </Panel>
      </div>

      <Panel title="Audit trail" sub="Append-only and hash-chained — the product's core evidentiary claim" flush>
        <TableWrap>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <Th>Timestamp</Th>
                <Th>Actor</Th>
                <Th>Action</Th>
                <Th>Hash</Th>
              </tr>
            </thead>
            <tbody>
              {d.audit.map((e) => [e.at, e.who, `${e.ref} — ${e.what}`, hashOf(e.at + e.what)]).map(([ts, who, what, hash]) => (
                <tr key={String(ts)} className="hover:bg-[var(--ds-subtle)]">
                  <Td className="ds-figure whitespace-nowrap text-[12px] text-[var(--ds-text-3)]">{ts}</Td>
                  <Td className="font-medium">{who}</Td>
                  <Td className="text-[var(--ds-text-2)]">{what}</Td>
                  <Td className="ds-id text-[12px] text-[var(--ds-text-3)]">{hash}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Panel>
    </div>
  );
}
