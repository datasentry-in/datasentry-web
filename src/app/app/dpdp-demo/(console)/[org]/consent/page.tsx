import { loadClient } from '@/modules/app/dpdp/routeData';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import {
  Card, CiteLink, DemoNote, Fact, Facts, PageHeader, Panel, TableWrap, Tag, Td, Th,
} from '@/modules/app/ui/ui';


const ITEMISED = [
  ['Full name', 'Identify you as an applicant and address you in correspondence'],
  ['Mobile number', 'Schedule interviews and send interview outcomes'],
  ['Email address', 'Send the application acknowledgement, interview invitations and the outcome'],
  ['Date of birth', 'Confirm you meet the minimum age for the role'],
  ['Current and preferred location', 'Match you to openings at our centres'],
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

/** A read-only checkbox glyph for the notice preview. */
function Check({ on = true }: { on?: boolean }) {
  return (
    <span
      className={`inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded border text-[11px] leading-none ${
        on
          ? 'border-[var(--ds-accent)] bg-[var(--ds-accent)] text-white'
          : 'border-[var(--ds-border-strong)] bg-[var(--ds-panel)] text-transparent'
      }`}
      aria-hidden
    >
      ✓
    </span>
  );
}

export default async function Consent({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  if (!d.consent) return <ModulePending org={org} title="Notice & consent" what="The notice and the consent ledger" />;
  const C = d.consent.summary;
  // The talent-pool period, as the register states it for candidate data.
  const talentPool = (d.activities.find((a) => a.principals.includes('Candidate'))?.retention ?? '180 days').replace(/ from application$/, '');
  const noticeGap = d.gaps.find((g) => g.provision.startsWith('Rule 3'));
  const CONSENT_LEDGER = d.consent.ledger;
  const legitimate = d.basisBreakdown.filter((b) => b.label.startsWith('s.7(i)')).reduce((n, b) => n + b.count, 0);
  const languages = d.privacyCentre?.languages.join(', ') ?? C.languages.join(', ');
  // Each withdrawal or expired clock, with the systems its tasks touch — from the client's own tasks.
  const withdrawalWork = [...new Set(d.tasks.filter((t) => t.source.kind === 'Consent withdrawal' || t.source.kind === 'Retention expiry').map((t) => t.source.ref))].map((ref) => {
    const ts = d.tasks.filter((t) => t.source.ref === ref);
    const pending = ts.filter((t) => t.status === 'Open' || t.status === 'Overdue').length;
    return [
      ts[0].source.label,
      ts[0].source.kind,
      ts.map((t) => t.system).join(', '),
      pending ? `${pending} of ${ts.length} task${ts.length === 1 ? '' : 's'} open · owner ${ts[0].owner}` : 'All tasks attested',
    ];
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notice & consent"
        sub="Narrow by design — candidates, and the handful of employee purposes that need consent rather than the employment exemption (s.7(i))."
      />

      <Facts>
        <Fact label="Active candidate consents" value={C.activeCandidate.toLocaleString('en-IN')} note={C.noticeVersion} tone="good" />
        <Fact label="Withdrawn" value={C.withdrawn} note="each raised an erasure task" tone="warn" />
        <Fact label="Retention clock expired" value={C.expiredClock} note={`talent pool past ${talentPool}`} tone="bad" />
        <Fact label="Erasure tasks pending" value={C.pendingErasureTasks} note="withdrawal and expiry combined" tone="bad" />
      </Facts>

      <Panel title="Why the employee side is small" sub="The correction that reshapes this module">
        <div className="grid gap-3 lg:grid-cols-2">
          <Card tone="ok">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-semibold tracking-[-0.01em]">No consent needed — {legitimate} activities</p>
              <CiteLink provision="s.7(i)" />
            </div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--ds-text-2)]">
              Payroll, attendance, performance, onboarding, exit, statutory filings, CCTV, visitor register, IT
              monitoring and DLP all run on a legitimate use. Asking for consent here would be misleading, and
              withdrawal would be meaningless because the processing would continue regardless.
            </p>
          </Card>
          <Card>
            <p className="text-[13px] font-semibold tracking-[-0.01em]">Consent genuinely needed</p>
            <ul className="mt-1.5 space-y-1 text-[13px] text-[var(--ds-text-2)]">
              {d.consent.employeeConsentPurposes.map((l) => (
                <li key={l} className="flex gap-2">
                  <span className="text-[var(--ds-text-3)]">·</span>
                  {l}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[13px] font-medium">
              {C.employeeExceptions} employee exception consents on record
            </p>
          </Card>
        </div>
      </Panel>

      <Panel
        title="Candidate consent page"
        sub="What an applicant sees — each item listed with its purpose, as the notice rules require (Rule 3)"
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
        {/* Preview of the applicant-facing notice */}
        <div className="overflow-hidden rounded-lg border border-[var(--ds-border)]">
          <div className="border-b border-[var(--ds-border)] px-4 py-3">
            <p className="ds-meta text-[var(--ds-text-3)]">{org.name}</p>
            <p className="mt-0.5 text-[15px] font-semibold tracking-[-0.01em]">Notice to applicants</p>
            <p className="mt-0.5 text-[12px] text-[var(--ds-text-3)]">
              Notice {C.noticeVersion} · available in {languages}
            </p>
          </div>

          <div className="p-4">
            <p className="max-w-3xl text-[14px] leading-relaxed text-[var(--ds-text-2)]">
              We are {org.name}. We will use the information below only for the purposes
              listed beside it. You may withdraw your consent at any time, ask us for a summary of what we hold,
              ask us to correct or erase it, or complain to the Data Protection Board of India.
            </p>

            <div className="mt-3 overflow-hidden rounded-md border border-[var(--ds-border)]">
              <TableWrap>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <Th className="w-1/3">What we collect</Th>
                      <Th>Why we need it</Th>
                      <Th className="w-20">Consent</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {ITEMISED.map(([item, why]) => (
                      <tr key={item} className="last:[&>td]:border-b-0">
                        <Td className="font-medium">{item}</Td>
                        <Td className="text-[var(--ds-text-2)]">{why}</Td>
                        <Td>
                          <Check />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            </div>

            <div className="mt-4 space-y-2 border-t border-[var(--ds-border)] pt-3">
              <p className="ds-meta text-[var(--ds-text-3)]">
                Separate choices
              </p>
              {[
                [`Keep my details for other openings for ${talentPool}`, true],
                ['Share my profile with a named client for project staffing', false],
                ['Carry out background verification through our verification partner if I am offered a role', true],
              ].map(([label, on]) => (
                <label key={String(label)} className="flex items-start gap-2">
                  <span className="mt-px">
                    <Check on={Boolean(on)} />
                  </span>
                  <span className="text-[13px] text-[var(--ds-text-2)]">{label}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 border-t border-[var(--ds-border)] pt-3">
              {['Withdraw consent', 'Exercise your rights', 'Complain to the Board'].map((l) => (
                <span key={l} className="text-[13px] font-medium text-[var(--ds-accent-hover)] underline underline-offset-2">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <DemoNote>
            {noticeGap
              ? `The current live form collects these same items behind one “I agree to the Privacy Policy” checkbox — that is finding ${noticeGap.id}. `
              : ''}
            Rule 3 is read strictly: a category label such as &ldquo;contact details&rdquo; is not an item.
          </DemoNote>
        </div>
      </Panel>

      <Panel title="Consent ledger" sub="Append-only and hash-chained — this is the evidence in a Board enquiry" flush>
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
                <tr key={r.ts + r.principal} className="hover:bg-[var(--ds-subtle)]">
                  <Td className="ds-figure whitespace-nowrap text-[12px] text-[var(--ds-text-3)]">{r.ts}</Td>
                  <Td className="font-medium">{r.principal}</Td>
                  <Td className="text-[var(--ds-text-2)]">{r.type}</Td>
                  <Td className="text-[var(--ds-text-2)]">{r.purposes}</Td>
                  <Td className="text-[var(--ds-text-2)]">{r.notice}</Td>
                  <Td className="text-[var(--ds-text-2)]">{r.lang}</Td>
                  <Td>
                    <Tag tone={r.action === 'Granted' ? 'ok' : r.action === 'Withdrawn' ? 'alert' : 'watch'}>
                      {r.action}
                    </Tag>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Panel>

      <Panel title="Withdrawal does something" sub="Data is erased once consent is withdrawn or the purpose is served (s.8(7))">
        <ul className="space-y-2">
          {withdrawalWork.length === 0 && (
            <li className="text-[14px] text-[var(--ds-text-3)]">No withdrawals or expired clocks waiting on work.</li>
          )}
          {withdrawalWork.map(([who, trigger, systems, task]) => (
            <li key={String(who)}>
              <Card>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[13px] font-semibold tracking-[-0.01em]">{who}</p>
                  <p className="text-[12px] text-[var(--ds-text-3)]">{trigger}</p>
                </div>
                <p className="mt-1.5 text-[13px] text-[var(--ds-text-2)]">
                  <span className="font-medium text-[var(--ds-text)]">Affected systems — </span>
                  {systems}
                </p>
                <p className="mt-1 text-[13px] font-medium text-[var(--ds-warn)]">{task}</p>
              </Card>
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
