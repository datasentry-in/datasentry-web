import { loadClient } from '@/modules/app/dpdp/routeData';
import { DsrHeader } from '@/modules/app/dpdp/components/RequestsLive';
import ListHeader from '@/modules/app/ui/ListHeader';
import RequestList from '@/modules/app/dpdp/components/RequestList';
import { demoPath } from '@/modules/app/dpdp/routes';
import {
  Button, Card, CiteLink, DemoNote, Panel, TableWrap, Tag, Td, Th,
} from '@/modules/app/ui/ui';
import MockButton from '@/modules/app/ui/MockButton';


export default async function Dsr({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  const slug = org.slug;
  const data = d;
  const DSRS = data.dsrs;
  const TASKS = data.tasks;
  const closed = DSRS.filter((d) => d.status === 'Closed');
  const grievance = data.privacyCentre?.grievanceOfficer ?? null;
  // The request worked through in detail on this page, when the client has one.
  const focus = data.dsrFocus ? DSRS.find((d) => d.id === data.dsrFocus) : undefined;

  return (
    <div className="space-y-8">
      <ListHeader
        title="Data principal requests"
        meta="Access, correction, erasure, grievance and nomination"
        about={
          <>
            Every request to {org.name} lands here, whichever way it arrived — the privacy centre or the published
            email address. The response window runs from receipt and the platform keeps the clock; the owners do
            the work in their own systems and attest it on a task.
          </>
        }
      />

      <DsrHeader org={slug} />

      <Panel title="Open requests" sub="The response window runs from receipt; escalation fires at 7 days remaining. Open one for its tasks and history." flush>
        <RequestList org={slug} />
      </Panel>

      {/* The hard case — this is the screen that sells the product to a consultant. */}
      {focus && (<>
      <div id="dsr-focus" className="scroll-mt-20" />
      <Panel
        title={`${focus.id} — erasure request from an ex-employee`}
        sub={`${focus.principal} · ${focus.relationship} · received ${focus.received}`}
      >
        <div className="space-y-4">
          <Card tone="plain">
            <p className="max-w-3xl text-[13px] italic leading-relaxed text-[var(--ds-text)]">
              &ldquo;I left Northstar in March 2024. I want all my personal data deleted from your systems
              including my salary records and the complaint file. Please confirm when this is done.&rdquo;
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--ds-text-2)]">
              <Tag tone="ok">Identity verified</Tag>
              08 Oct 2026 — employee ID, date of birth and last working day matched the HRMS exit roster
            </p>
          </Card>

          <div>
            <p className="mb-2 text-[13px] font-semibold tracking-[-0.01em]">
              Statutory retention conflicts — this request cannot be fully honoured
            </p>
            <div className="overflow-hidden rounded-md border border-[var(--ds-border)]">
              <TableWrap>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <Th>Record</Th>
                      <Th>Retention ground</Th>
                      <Th>Retain until</Th>
                      <Th>Outcome</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {focus.conflicts?.map((c) => (
                      <tr key={c.record} className="bg-[var(--ds-danger-weak)]">
                        <Td className="font-medium">{c.record}</Td>
                        <Td className="text-[var(--ds-text-2)]">{c.statute}</Td>
                        <Td className="tnum font-medium">{c.until}</Td>
                        <Td>
                          <Tag tone="alert">Refuse</Tag>
                        </Td>
                      </tr>
                    ))}
                    {[
                      ['Personnel file — appraisals, training records', 'No statutory ground beyond the retention policy', 'Erasable now', 'Erase'],
                      ['Alumni mailing list entry', 'No lawful basis recorded (G-06)', 'Erasable now', 'Erase'],
                      ['Recruitment record from original application', 'Purpose served on hire', 'Erasable now', 'Erase'],
                      ['Photograph used in a 2023 marketing post', 'Consent, withdrawable', 'Erasable now', 'Erase'],
                    ].map(([rec, ground, until, out]) => (
                      <tr key={rec} className="hover:bg-[var(--ds-subtle)]">
                        <Td className="font-medium">{rec}</Td>
                        <Td className="text-[var(--ds-text-2)]">{ground}</Td>
                        <Td className="text-[var(--ds-text-2)]">{until}</Td>
                        <Td>
                          <Tag tone="ok">{out}</Tag>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            </div>
          </div>

          <Card tone="plain">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="ds-meta text-[var(--ds-text-3)]">Fulfilment</p>
                <p className="mt-1 text-[14px] leading-relaxed text-[var(--ds-text-2)]">
                  {(() => {
                    const t = TASKS.filter((x) => x.source.ref === focus.id);
                    const n = (s: string) => t.filter((x) => x.status === s).length;
                    return `${t.length} tasks — one per system the register lists for this person: ${n('Attested')} attested, ${n('Open')} open, ${n('Retained')} kept on a statutory ground. The owners do the erasure in their own systems; the response goes out once every task is attested.`;
                  })()}
                </p>
              </div>
              <Button as="link" href={demoPath(org.slug, 'tasks')}>Tasks & attestations</Button>
            </div>
          </Card>

          <Card>
            <p className="ds-meta text-[var(--ds-text-3)]">
              Generated response — draft
            </p>
            <p className="mt-1.5 max-w-3xl text-[14px] leading-relaxed text-[var(--ds-text-2)]">
              We have erased your personnel file, your recruitment record, your alumni mailing entry and the
              photograph you asked about. We are unable to erase four categories of record because we are
              required by law to keep them: your Provident Fund member records under the Employees&rsquo;
              Provident Funds and Miscellaneous Provisions Act 1952; your Form 16 and TDS records until 31 March
              2031 under the Income Tax Act 1961; the Internal Committee record until 14 June 2027 under the POSH
              Act 2013; and the FY24 payroll register until 31 March 2032 under the Maharashtra Shops and
              Establishments Act. We will erase each of these when its retention period ends. You may complain to
              the Data Protection Board of India if you disagree with this decision.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <MockButton variant="primary" what="Approve and send the response">Approve &amp; send</MockButton>
              <MockButton what="Edit the draft">Edit draft</MockButton>
              <MockButton variant="ghost" what="Refer to counsel">Refer to counsel</MockButton>
            </div>
          </Card>

          <DemoNote>
            This is the hardest content in the product and the strongest moat — no global privacy tool encodes
            Indian employment-statute retention. It is also the piece to ship last, in R2, because every row in
            that matrix needs legal review before a refusal goes out under a client&rsquo;s name. In R1 the
            consultant composes this response by hand and the platform tracks and evidences it.
          </DemoNote>
        </div>
      </Panel>
      </>)}

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel title="Closed requests" sub="The log is the evidence of a working mechanism" flush>
          {closed.length === 0 && (
            <p className="px-4 py-8 text-center text-[13px] leading-relaxed text-[var(--ds-text-3)] sm:px-5">
              None closed yet. Each request answered here lands in this log with its outcome — the evidence that the
              desk works.
            </p>
          )}
          <ul>
            {closed.map((d) => (
              <li key={d.id} className="border-b border-[var(--ds-border)] px-4 py-3 last:border-b-0 sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-medium">{d.principal}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Tag>{d.type}</Tag>
                    <Tag tone="ok">Closed</Tag>
                  </div>
                </div>
                <p className="ds-id mt-0.5 text-[11px] text-[var(--ds-text-3)]">{d.id}</p>
                <p className="mt-1 text-[13px] leading-snug text-[var(--ds-text-2)]">{d.outcome}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Rights the desk must serve" sub="Four statutory rights plus the grievance route">
          <ul className="space-y-2">
            {[
              ['Access and summary', 's.11', 'What is held, who it has been shared with'],
              ['Correction, completion, updating and erasure', 's.12', 'Erasure subject to statutory retention'],
              ['Grievance redressal', 's.13', grievance ? `Mandatory mechanism — ${grievance} is the named contact` : 'Mandatory mechanism — currently missing at this client'],
              ['Nomination', 's.14', 'Nominee exercises rights on death or incapacity'],
            ].map(([right, prov, note]) => (
              <li key={String(right)}>
                <Card tone={prov === 's.13' && !grievance ? 'danger' : 'plain'} className="p-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[13px] font-medium">{right}</span>
                    <CiteLink provision={String(prov)} />
                  </div>
                  <p className="mt-0.5 text-[12px] text-[var(--ds-text-2)]">{note}</p>
                </Card>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <DemoNote>
              There is no portability right and no general right to object under the DPDP Act, so the desk is
              narrower than a GDPR DSAR tool. Building the GDPR set would add screens nobody in India can use.
            </DemoNote>
          </div>
        </Panel>
      </div>
    </div>
  );
}
