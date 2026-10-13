import { loadClient } from '@/modules/app/dpdp/routeData';
import Countdown from '@/modules/app/dpdp/components/Countdown';
import { demoPath } from '@/modules/app/dpdp/routes';
import {
  Button, Card, CiteLink, DemoNote, EmptyState, Fact, Facts, PageHeader, Panel, Tag,
} from '@/modules/app/ui/ui';
import PresenterOnly from '@/modules/app/ui/PresenterOnly';
import MockButton from '@/modules/app/ui/MockButton';


export default async function Breach({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  const INCIDENTS = d.incidents;
  const open = INCIDENTS.find((i) => i.status === 'Open');
  const sop = d.evidence.find((e) => e.name === 'Breach response SOP');
  const closed = INCIDENTS.filter((i) => i.status !== 'Open');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Breach & incident register"
        sub={`Rule 7 has no severity threshold — every personal data breach is reportable. Staff report through a link with no login; the clock runs from when they became aware. ${org.name}`}
        right={<Button as="link" href={demoPath('p', org.slug, 'report')}>Staff report form</Button>}
      />

      <Facts>
        <Fact label="Open incidents" value={open ? 1 : 0} note={open ? 'clock running' : 'none open'} tone={open ? 'bad' : 'plain'} />
        <Fact label="Closed this year" value={closed.length} note="each notified in time" tone={closed.length ? 'good' : 'plain'} />
        {open && <Fact label="Principals affected" value={open.affected} note="this incident" tone="bad" />}
        <Fact label="Response SOP" value={sop?.status === 'Generated' ? 'Signed off' : sop?.status === 'Not started' ? 'Not started' : 'Unsigned'} note={sop?.detail} tone={sop?.status === 'Generated' ? 'good' : 'bad'} />
      </Facts>

      {open ? (<>
      {/* The clock is the module. */}
      <div className="ds-bar ds-bar-danger flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="text-[12px] font-medium text-[var(--ds-danger)]">
            {open.id} · time remaining to intimate the Data Protection Board
          </p>
          <div className="mt-1.5">
            <Countdown deadlineIso={open.deadlineIso ?? ''} />
          </div>
          <p className="ds-figure mt-1.5 text-[12px] text-[var(--ds-text-2)]">
            Awareness {open.awareness} · deadline {open.deadline}
          </p>
          {/* The clock's own action — the page's next step lives on the overview. */}
          <div className="mt-3">
            <Button as="link" variant="primary" href={demoPath(org.slug, 'breach', 'intimation')}>Open the Board intimation</Button>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="ds-meta text-[var(--ds-text-3)]">
            Affected principals
          </p>
          <p className="ds-figure mt-1 text-[26px] leading-none tracking-[-0.03em]">{open.affected}</p>
          <p className="mt-1 text-[12px] text-[var(--ds-text-2)]">to be intimated without delay</p>
        </div>
      </div>

      <Panel title={open.id} sub={open.title}>
        <div className="space-y-4">
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Became aware', open.awareness],
              ['Board deadline (72 hours)', open.deadline],
              ['Data principals affected', String(open.affected)],
              ['Status', open.status],
            ].map(([k, v]) => (
              <div key={k} className="rounded-md border border-[var(--ds-border)] p-2.5">
                <dt className="ds-meta text-[var(--ds-text-3)]">{k}</dt>
                <dd className="mt-0.5 text-[13px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <Card>
            <p className="ds-meta text-[var(--ds-text-3)]">
              Data categories involved
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-[var(--ds-text-2)]">{open.categories}</p>
          </Card>

          <div className="grid gap-3 lg:grid-cols-2">
            <Card tone="warn">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] font-semibold tracking-[-0.01em]">Intimation to the Board</p>
                <CiteLink provision="Rule 7(2)" />
              </div>
              <p className="mt-1 text-[13px] text-[var(--ds-text-2)]">{open.boardIntimation}</p>
              <p className="mt-1 text-[12px] text-[var(--ds-text-3)]">
                Initial description without delay; full particulars within 72 hours of awareness.
              </p>
            </Card>
            <Card tone="warn">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] font-semibold tracking-[-0.01em]">Intimation to data principals</p>
                <CiteLink provision="Rule 7(1)" />
              </div>
              <p className="mt-1 text-[13px] text-[var(--ds-text-2)]">{open.principalNotice}</p>
              <p className="mt-1 text-[12px] text-[var(--ds-text-3)]">
                240 recipients · description, consequences, mitigation taken, and a contact to reach.
              </p>
            </Card>
          </div>

          <div id="board-intimation" className="scroll-mt-20" />
          <Card>
            <p className="ds-meta text-[var(--ds-text-3)]">
              Generated intimation to the Board — draft
            </p>
            <p className="mt-1.5 max-w-3xl text-[14px] leading-relaxed text-[var(--ds-text-2)]">
              Northstar BPO Services Pvt Ltd became aware on 10 October 2026 at 14:20 IST that the September 2026
              payroll register was sent by email to an internal distribution list that included 34 recipients
              without a need to access it. The register contained the name, employee identifier, designation,
              gross and net salary, Permanent Account Number, bank account number and Provident Fund number of
              240 employees. The message was recalled at 14:52 IST and the distribution list was corrected.
              Affected employees are being intimated. No evidence of onward disclosure has been identified.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button as="link" href={demoPath(org.slug, 'breach', 'intimation')}>Open as a document to edit and sign off</Button>
              <MockButton variant="ghost" what="Notify the affected principals">Notify {open.affected} principals</MockButton>
            </div>
          </Card>

          <DemoNote>
            Sources differ on whether the duty to intimate principals applies to every breach or only where harm
            is likely. The product defaults to notifying and records the reasoning when it does not — the safer
            default, given s.8(6) sits in the highest penalty tier.
          </DemoNote>
        </div>
      </Panel>
      </>) : (
        <EmptyState title="No incident open">
          When a member of staff reports a suspected breach through the staff form, the 72-hour clock starts from when
          they became aware, and the Board intimation is drafted from the record.
        </EmptyState>
      )}

      <Panel title="Closed incidents" sub="The register itself is evidence that a mechanism exists" flush>
        {closed.length === 0 && <p className="px-4 py-4 text-[13px] text-[var(--ds-text-3)] sm:px-5">No incidents recorded yet.</p>}
        <ul>
          {closed.map((i) => (
            <li key={i.id} className="border-b border-[var(--ds-border)] px-4 py-3 last:border-b-0 sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] font-medium">{i.title}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag>{i.affected} affected</Tag>
                  <Tag tone="ok">Closed</Tag>
                </div>
              </div>
              <p className="ds-id mt-0.5 text-[11px] text-[var(--ds-text-3)]">{i.id}</p>
              <p className="mt-1 text-[13px] text-[var(--ds-text-2)]">
                Aware {i.awareness} · {i.boardIntimation}
              </p>
              <p className="text-[13px] text-[var(--ds-text-2)]">{i.principalNotice}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <PresenterOnly>
      <Panel title="Why this module is in the MVP">
        <DemoNote>
          It was not in the original three-module sketch. Rule 7 carries no severity threshold, the s.8(6) penalty
          tier reaches ₹200 crore, and essentially no SMB has a runbook. As a register, a countdown and two
          notification templates it is roughly two weeks of build — the best consequence-to-effort ratio in the
          product, and the thing most likely to be needed in anger.
        </DemoNote>
      </Panel>
      </PresenterOnly>
    </div>
  );
}
