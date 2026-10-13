import { ACTIVITIES, ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import {
  Card, CiteLink, DemoNote, PageHeader, Panel, ProvenanceTag, Stat, Tag, TableWrap, Td, Th,
} from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

const roleTone = (r: string) => (r === 'Exempt' ? 'ok' : r === 'Processor' ? 'info' : 'dark');

export default async function Ropa({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  const items = ACTIVITIES.reduce((n, a) => n + a.items, 0);
  const undetermined = ACTIVITIES.filter((a) => a.basis === 'Not determined').length;
  const processors = new Set(ACTIVITIES.flatMap((a) => a.processors)).size;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Record of processing activities"
        sub={`RoPA v4 · confirmed 08 Oct 2026 · ${org.name}`}
      />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-border)] lg:grid-cols-4">
        <Stat label="Activities" value={ACTIVITIES.length} note={`${org.exemptActivities} exempt`} />
        <Stat label="Data items itemised" value={items} note="Rule 3 requires item-level detail" />
        <Stat label="Processors engaged" value={processors} note="8 of 10 have a DPA" tone="warn" />
        <Stat label="Basis not determined" value={undetermined} note="blocks the evidence pack" tone="bad" />
      </div>

      <Panel
        title="Register"
        sub="Role and basis are rule-engine output; scroll sideways on a narrow screen"
        right={
          <div className="flex flex-wrap gap-1.5">
            <Tag tone="dark">Fiduciary 17</Tag>
            <Tag tone="ok">Exempt 2</Tag>
          </div>
        }
        flush
      >
        <TableWrap minWidth="64rem">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <Th className="w-16">ID</Th>
                <Th>Activity &amp; purpose</Th>
                <Th>Principals</Th>
                <Th>Role</Th>
                <Th>Lawful basis</Th>
                <Th>Retention</Th>
                <Th>Systems &amp; processors</Th>
                <Th>Provenance</Th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITIES.map((a) => {
                const flag = a.basis === 'Not determined' || a.retention === 'Not stated';
                return (
                  <tr key={a.id} className={flag ? 'bg-[var(--ds-danger-weak)]' : 'hover:bg-[var(--ds-subtle)]'}>
                    <Td className="ds-figure whitespace-nowrap text-[12px] text-[var(--ds-text-2)]">{a.id}</Td>
                    <Td>
                      <span className="font-medium">{a.name}</span>
                      <br />
                      <span className="text-[var(--ds-text-2)]">{a.purpose}</span>
                      <br />
                      <span className="text-[11px] text-[var(--ds-text-3)]">
                        {a.department} · {a.items} data items
                      </span>
                    </Td>
                    <Td className="text-[var(--ds-text-2)]">{a.principals}</Td>
                    <Td>
                      <Tag tone={roleTone(a.role)}>{a.role}</Tag>
                    </Td>
                    <Td>
                      {a.basis === 'Not determined' ? (
                        <span className="font-medium text-[var(--ds-danger)]">Not determined</span>
                      ) : a.basis === 's.17(1)(d) exempt' ? (
                        <CiteLink provision="s.17(1)(d)" />
                      ) : a.basis.startsWith('s.7(i)') ? (
                        <>
                          <CiteLink provision="s.7(i)" />
                          <br />
                          <span className="text-[11px] text-[var(--ds-text-3)]">
                            {a.basis.includes('safeguard') ? 'safeguarding' : 'employment'}
                          </span>
                        </>
                      ) : (
                        <span className="text-[var(--ds-text-2)]">{a.basis}</span>
                      )}
                    </Td>
                    <Td className={a.retention === 'Not stated' ? 'font-medium text-[var(--ds-danger)]' : 'text-[var(--ds-text-2)]'}>
                      {a.retention}
                    </Td>
                    <Td className="text-[var(--ds-text-2)]">
                      {a.systems.join(', ')}
                      {a.processors.length > 0 && (
                        <>
                          <br />
                          <span className="text-[11px] text-[var(--ds-text-3)]">P: {a.processors.join(', ')}</span>
                        </>
                      )}
                      {a.crossBorder && (
                        <>
                          <br />
                          <span className="text-[11px] font-medium text-[var(--ds-warn)]">{a.crossBorder}</span>
                        </>
                      )}
                    </Td>
                    <Td>
                      <ProvenanceTag p={a.provenance} />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrap>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="How the basis breaks down" sub="The correction most clients need to hear">
          <ul className="space-y-2">
            {[
              ['s.7(i) employment purposes', 7, 'Payroll, attendance, performance, onboarding, exit — no consent needed'],
              ['s.7(i) safeguarding', 3, 'CCTV, visitor register, IT monitoring and DLP'],
              ['Legal obligation', 3, 'PF/ESIC/PT/TDS filings, POSH records, vendor financial records'],
              ['Consent', 4, 'Candidate screening and BGV, dependant enrolment, website enquiries'],
              ['s.17(1)(d) exempt', 2, 'Offshore delivery for the US and UK clients'],
              ['Not determined', 1, 'Alumni marketing — raised as G-06'],
            ].map(([label, n, note]) => (
              <li key={String(label)}>
                <Card tone={label === 'Not determined' ? 'danger' : 'plain'} className="p-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[13px] font-medium">{label}</span>
                    <span className="ds-figure text-[15px]">{n}</span>
                  </div>
                  <p className="mt-0.5 text-[12px] leading-snug text-[var(--ds-text-2)]">{note}</p>
                </Card>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <DemoNote>
              Ten of nineteen activities run on a legitimate use, not consent. Building an employee consent engine
              would have been building the wrong product.
            </DemoNote>
          </div>
        </Panel>

        <Panel title="Processor register" sub="s.8(2) requires a written contract with every processor" flush>
          <TableWrap>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <Th>Processor</Th>
                  <Th>Activity</Th>
                  <Th>DPA</Th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Zoho Corporation', 'PA-01, PA-04, PA-19', 'Executed 12 Apr 2024'],
                  ['Keka Technologies', 'PA-03, PA-07, PA-11', 'Executed 03 Jun 2024'],
                  ['AuthBridge Research Services', 'PA-02', 'MISSING'],
                  ['Niva Bupa', 'PA-09', 'Executed 01 Apr 2026'],
                  ['Marsh India (broker)', 'PA-09', 'MISSING'],
                  ['Matrix Comsec', 'PA-06', 'Executed 20 Jan 2025'],
                  ['Intuit Mailchimp', 'PA-12', 'Standard terms accepted'],
                  ['Microsoft', 'PA-15', 'DPA via enterprise agreement'],
                  ['Forcepoint', 'PA-15', 'Executed 15 Feb 2025'],
                  ['HubSpot', 'PA-18', 'Standard terms accepted'],
                ].map(([p, act, dpa]) => (
                  <tr key={p} className={dpa === 'MISSING' ? 'bg-[var(--ds-danger-weak)]' : 'hover:bg-[var(--ds-subtle)]'}>
                    <Td className="font-medium">{p}</Td>
                    <Td className="tnum text-[var(--ds-text-2)]">{act}</Td>
                    <Td className={dpa === 'MISSING' ? 'font-medium text-[var(--ds-danger)]' : 'text-[var(--ds-text-2)]'}>
                      {dpa === 'MISSING' ? 'Missing' : dpa}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </Panel>
      </div>
    </div>
  );
}
