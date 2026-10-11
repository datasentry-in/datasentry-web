import { EVIDENCE_PACK, ORGS, getOrg } from '../../_data/mock';
import { DemoNote, Panel, Stat, Tag, TableWrap, Td, Th } from '../../_components/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

const tone = (s: string) =>
  s === 'Generated' ? 'ok' : s === 'Review pending' ? 'watch' : s === 'Incomplete' ? 'alert' : 'plain';

export default async function Evidence({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  const generated = EVIDENCE_PACK.filter((e) => e.status === 'Generated').length;
  const blocked = EVIDENCE_PACK.filter((e) => e.status !== 'Generated').length;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 inline-block border-2 border-black bg-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
          M5 · Evidence
        </p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
          Evidence &amp; audit pack
        </h1>
        <p className="mt-1 font-mono text-xs text-neutral-700">
          The compliance file a board or a Board of India query actually asks for · {org.name}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Artefacts generated" value={`${generated}/${EVIDENCE_PACK.length}`} note="RoPA v4 as source" tone="warn" />
        <Stat label="Blocked or pending" value={blocked} note="each traces to a finding" tone="bad" />
        <Stat label="Languages" value={4} note="EN, HI, MR, KN" tone="good" />
        <Stat label="Pack version" value="v4" note="hash-stamped 08 Oct 2026" />
      </div>

      <div className="border-[3px] border-black bg-background-dark p-4 shadow-[6px_6px_0px_0px_#000] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg font-bold uppercase text-white sm:text-xl">
              Export the compliance file
            </p>
            <p className="font-mono text-[11px] text-neutral-400">
              Single PDF plus a ZIP of every artefact. Each document carries its generation timestamp, the source
              RoPA version and the reviewer who signed it off.
            </p>
          </div>
          <span className="border-2 border-white bg-white px-4 py-2 font-mono text-[11px] font-bold uppercase text-black shadow-[4px_4px_0px_0px_#737373]">
            Generate pack v5
          </span>
        </div>
      </div>

      <Panel title="Artefacts" sub="Generated from the client's own register — not boilerplate">
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
                <tr key={e.name} className={e.status === 'Generated' ? 'bg-white' : 'bg-neutral-100'}>
                  <Td className="font-bold">{e.name}</Td>
                  <Td className="text-neutral-700">{e.detail}</Td>
                  <Td>
                    <Tag tone={tone(e.status)}>{e.status}</Tag>
                  </Td>
                  <Td>{e.ts}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Policy generator" sub="Assembled from reviewed clause libraries, filled with client specifics">
          <ul className="space-y-2">
            {[
              ['Employee privacy notice', 'Lists the 10 activities running on s.7(i) and the 5 needing consent'],
              ['Candidate privacy notice', 'Rule 3 itemised — 14 data items, purpose per item, withdrawal link'],
              ['Retention & erasure policy', 'Keyed to all 19 activities plus the statutory retention matrix'],
              ['DSR standard operating procedure', 'Intake, identity verification, SLA, lawful part-refusal'],
              ['Breach response SOP', '72-hour clock, escalation ladder, both notification templates'],
              ['Processor DPA template', 's.8(2) clauses — purpose limitation, security, sub-processing, erasure'],
              ['Grievance & contact designation note', 's.13 — blocked until a contact person is named'],
              ['s.17(1)(d) applicability memo', 'Per-engagement reasoning for the two exempt activities'],
            ].map(([doc, note]) => (
              <li key={String(doc)} className="border-2 border-black bg-white p-2.5">
                <p className="font-mono text-[11px] font-bold uppercase">{doc}</p>
                <p className="font-mono text-[10px] text-neutral-600">{note}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <DemoNote>
              The model assembles and fills; it does not draft novel legal language. Clause libraries are reviewed
              once, then reused across every client — which is what makes generated policies safe to issue under
              DataSentry&rsquo;s name.
            </DemoNote>
          </div>
        </Panel>

        <Panel title="What is blocking a complete pack" sub="Evidence completeness is itself a readiness signal">
          <ul className="space-y-2">
            {[
              ['Breach response SOP', 'Awaiting CISO sign-off', 'G-04'],
              ['Processor / DPA register', 'AuthBridge and Marsh India have no executed DPA', 'G-02'],
              ['Grievance & DPO designation note', 'No contact person named by the client', 'G-09'],
              ['s.17(1)(d) applicability memo', 'MSA clauses not yet extracted and linked', 'G-11'],
            ].map(([doc, why, gap]) => (
              <li key={String(doc)} className="border-2 border-black bg-neutral-100 p-2.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase">{doc}</span>
                  <Tag tone="alert">{gap}</Tag>
                </div>
                <p className="font-mono text-[10px] text-neutral-700">{why}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <DemoNote>
              Four of the thirteen artefacts are blocked on client action rather than on the platform. Making that
              visible is what moves a remediation plan along between review calls.
            </DemoNote>
          </div>
        </Panel>
      </div>

      <Panel title="Audit trail" sub="Append-only and hash-chained — the product's core evidentiary claim">
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
              {[
                ['10 Oct 2026, 14:22:08', 'CISO, Northstar', 'Incident INC-2026-003 created', '8f3c…a104'],
                ['09 Oct 2026, 18:05:44', 'Dharita Gada', 'Evidence file reconciled — 3 findings raised', '2b7e…c9f1'],
                ['08 Oct 2026, 16:40:12', 'HR Operations Manager', 'RoPA v4 confirmed — 19 activities', 'd041…7b22'],
                ['08 Oct 2026, 15:55:01', 'Dharita Gada', 'PA-12 basis set to Not determined', '5a9d…1e68'],
                ['08 Oct 2026, 11:02:37', 'System', 'Gap report generated — rule set v1.4', 'c7f0…4d3a'],
                ['01 Oct 2026, 09:14:55', 'Dharita Gada', 'Notice v3 published — EN, HI, MR, KN', '9e22…b70c'],
              ].map(([ts, who, what, hash]) => (
                <tr key={String(ts)} className="bg-white">
                  <Td className="whitespace-nowrap text-neutral-600">{ts}</Td>
                  <Td className="font-bold">{who}</Td>
                  <Td>{what}</Td>
                  <Td className="text-neutral-500">{hash}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Panel>
    </div>
  );
}
