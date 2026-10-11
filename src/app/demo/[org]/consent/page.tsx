import { CONSENT_LEDGER, CONSENT_SUMMARY as C, ORGS, getOrg } from '../../_data/mock';
import { CiteLink, DemoNote, Panel, Stat, Tag, TableWrap, Td, Th } from '../../_components/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

const ITEMISED = [
  ['Full name', 'Identify you as an applicant and address you in correspondence'],
  ['Mobile number', 'Schedule interviews and send interview outcomes'],
  ['Email address', 'Send the application acknowledgement, interview invitations and the outcome'],
  ['Date of birth', 'Confirm you meet the minimum age for the role'],
  ['Current and preferred location', 'Match you to openings at our Pune and Bengaluru centres'],
  ['Curriculum vitae', 'Assess your experience against the role requirements'],
  ['Current and expected salary', 'Determine whether the role is within your expectation'],
  ['Notice period', 'Plan the joining date if an offer is made'],
  ['Highest qualification and institution', 'Verify eligibility and, if you are offered a role, verify your education'],
  ['Previous employer names and dates', 'Assess relevant experience and, if offered a role, verify employment'],
  ['Government ID number (PAN or Aadhaar)', 'Carry out background verification if you are offered a role'],
  ['Photograph', 'Issue an interview visitor pass at our premises'],
  ['Reference contact details', 'Contact referees you have named, only after an offer is made'],
  ['Disability or accommodation needs (optional)', 'Make reasonable adjustments to the interview process'],
];

export default async function Consent({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 inline-block border-2 border-black bg-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
          M2 · Notice &amp; consent
        </p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">Notice &amp; consent</h1>
        <p className="mt-1 font-mono text-xs text-neutral-700">
          Narrow by design — candidates, and the handful of employee purposes that fall outside s.7(i).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Active candidate consents" value={C.activeCandidate.toLocaleString('en-IN')} note={C.noticeVersion} tone="good" />
        <Stat label="Withdrawn" value={C.withdrawn} note="each raised an erasure task" tone="warn" />
        <Stat label="Retention clock expired" value={C.expiredClock} note="talent pool past 180 days" tone="bad" />
        <Stat label="Erasure tasks pending" value={C.pendingErasureTasks} note="withdrawal and expiry combined" tone="bad" />
      </div>

      <Panel
        title="Why the employee side is small"
        sub="The correction that reshapes this module"
      >
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="border-2 border-black bg-white p-3">
            <p className="font-display text-sm font-bold uppercase">No consent needed — 10 activities</p>
            <p className="mt-1 font-mono text-[11px] text-neutral-700">
              Payroll, attendance, performance, onboarding, exit, statutory filings, CCTV, visitor register, IT
              monitoring and DLP all run on a legitimate use. Asking for consent here would be misleading, and
              withdrawal would be meaningless because the processing would continue regardless.
            </p>
            <p className="mt-1 font-mono text-[11px]">
              <CiteLink provision="s.7(i)" />
            </p>
          </div>
          <div className="border-2 border-black bg-neutral-200 p-3">
            <p className="font-display text-sm font-bold uppercase">Consent genuinely needed</p>
            <ul className="mt-1 space-y-1 font-mono text-[11px]">
              <li>· Candidate screening and background verification</li>
              <li>· Dependant enrolment in the group policy, including 61 minors</li>
              <li>· Employee photographs used in marketing</li>
              <li>· Optional wellness programme participation</li>
              <li>· Alumni communications after exit</li>
            </ul>
            <p className="mt-1 font-mono text-[11px] font-bold">
              {C.employeeExceptions} employee exception consents on record
            </p>
          </div>
        </div>
      </Panel>

      <Panel
        title="Candidate consent page"
        sub="What an applicant sees — Rule 3 requires an itemised description with a purpose per item"
        right={
          <div className="flex flex-wrap gap-1.5">
            {C.languages.map((l) => (
              <Tag key={l} tone={l === 'English' ? 'dark' : 'plain'}>
                {l}
              </Tag>
            ))}
          </div>
        }
      >
        <div className="border-[3px] border-black bg-white">
          <div className="border-b-[3px] border-black bg-background-dark px-4 py-3">
            <p className="font-mono text-[10px] font-bold uppercase text-white">Northstar BPO Services Pvt Ltd</p>
            <p className="font-display text-base font-bold uppercase text-white">Notice to applicants</p>
            <p className="font-mono text-[10px] text-neutral-400">
              Notice v3 · published 01 Oct 2026 · available in English, हिन्दी, मराठी, ಕನ್ನಡ
            </p>
          </div>

          <div className="p-4">
            <p className="font-mono text-[11px] leading-relaxed text-neutral-800">
              We are Northstar BPO Services Pvt Ltd. We will use the information below only for the purposes
              listed beside it. You may withdraw your consent at any time, ask us for a summary of what we hold,
              ask us to correct or erase it, or complain to the Data Protection Board of India.
            </p>

            <TableWrap>
              <table className="mt-3 w-full border-collapse">
                <thead>
                  <tr>
                    <Th className="w-1/3">What we collect</Th>
                    <Th>Why we need it</Th>
                    <Th className="w-20">Consent</Th>
                  </tr>
                </thead>
                <tbody>
                  {ITEMISED.map(([item, why]) => (
                    <tr key={item}>
                      <Td className="font-bold">{item}</Td>
                      <Td className="text-neutral-700">{why}</Td>
                      <Td>
                        <span className="inline-block h-4 w-4 border-2 border-black bg-black" aria-hidden />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>

            <div className="mt-4 space-y-2 border-t-[3px] border-black pt-3">
              <p className="font-mono text-[10px] font-bold uppercase text-neutral-700">Separate choices</p>
              {[
                ['Keep my details for other openings for 180 days', true],
                ['Share my profile with a named client for project staffing', false],
                ['Carry out background verification through AuthBridge if I am offered a role', true],
              ].map(([label, on]) => (
                <label key={String(label)} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 inline-block h-4 w-4 shrink-0 border-2 border-black ${on ? 'bg-black' : 'bg-white'}`}
                    aria-hidden
                  />
                  <span className="font-mono text-[11px]">{label}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 border-t-[3px] border-black pt-3 font-mono text-[10px] font-bold uppercase">
              <span className="border-b-2 border-black text-black">Withdraw consent</span>
              <span className="border-b-2 border-black text-black">Exercise your rights</span>
              <span className="border-b-2 border-black text-black">Complain to the Board</span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <DemoNote>
            The current live form collects these same fourteen items behind one &ldquo;I agree to the Privacy
            Policy&rdquo; checkbox — that is finding G-03. Rule 3 is read strictly: a category label such as
            &ldquo;contact details&rdquo; is not an item.
          </DemoNote>
        </div>
      </Panel>

      <Panel title="Consent ledger" sub="Append-only and hash-chained — this is the evidence in a Board enquiry">
        <TableWrap>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <Th>Timestamp</Th>
                <Th>Data principal</Th>
                <Th>Type</Th>
                <Th>Purposes</Th>
                <Th>Notice</Th>
                <Th>Language</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {CONSENT_LEDGER.map((r) => (
                <tr key={r.ts + r.principal} className="bg-white">
                  <Td className="whitespace-nowrap text-neutral-600">{r.ts}</Td>
                  <Td className="font-bold">{r.principal}</Td>
                  <Td>{r.type}</Td>
                  <Td>{r.purposes}</Td>
                  <Td>{r.notice}</Td>
                  <Td>{r.lang}</Td>
                  <Td>
                    <Tag
                      tone={r.action === 'Granted' ? 'ok' : r.action === 'Withdrawn' ? 'alert' : 'watch'}
                    >
                      {r.action}
                    </Tag>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Panel>

      <Panel title="Withdrawal does something" sub="s.8(7) requires erasure once consent is withdrawn or the purpose is served">
        <ul className="space-y-2">
          {[
            ['Deepa Krishnan', 'Consent withdrawn 09 Oct 2026, 17:55', 'Zoho Recruit record, AuthBridge BGV file, Drive CV copy', 'Assigned to Head of Talent Acquisition · due 16 Oct 2026'],
            ['212 candidates', 'Talent-pool clock expired', 'Zoho Recruit records', 'Bulk purge task · awaiting approval'],
          ].map(([who, trigger, systems, task]) => (
            <li key={String(who)} className="border-2 border-black bg-white p-3">
              <p className="font-display text-sm font-bold uppercase">{who}</p>
              <p className="font-mono text-[11px] text-neutral-700">{trigger}</p>
              <p className="font-mono text-[11px]">
                <span className="font-bold uppercase">Affected systems · </span>
                {systems}
              </p>
              <p className="font-mono text-[11px] text-black">{task}</p>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <DemoNote>
            Most tools stop at recording the withdrawal. The affected-systems list is pulled from the register, so
            a withdrawal produces an actionable task with an owner rather than a flag nobody acts on. {org.name} has{' '}
            {C.pendingErasureTasks} such tasks open.
          </DemoNote>
        </div>
      </Panel>
    </div>
  );
}
