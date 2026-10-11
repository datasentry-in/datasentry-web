import { INCIDENTS, ORGS, getOrg } from '../../_data/mock';
import Countdown from '../../_components/Countdown';
import { CiteLink, DemoNote, Panel, Stat, Tag } from '../../_components/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

const OPEN_DEADLINE_ISO = '2026-10-13T14:20:00+05:30';

export default async function Breach({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  const open = INCIDENTS.find((i) => i.status === 'Open')!;
  const closed = INCIDENTS.filter((i) => i.status !== 'Open');

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 inline-block border-2 border-black bg-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
          M4 · Breach register
        </p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
          Breach &amp; incident register
        </h1>
        <p className="mt-1 font-mono text-xs text-neutral-700">
          Rule 7 has no severity threshold — every personal data breach is reportable. {org.name}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Open incidents" value={1} note="clock running" tone="bad" />
        <Stat label="Closed this year" value={closed.length} note="both notified in time" tone="good" />
        <Stat label="Principals affected" value={open.affected} note="this incident" tone="bad" />
        <Stat label="Response SOP" value="Unsigned" note="finding G-04" tone="bad" />
      </div>

      {/* The clock is the module. */}
      <div className="border-[3px] border-black bg-black p-4 text-white shadow-[6px_6px_0px_0px_#000] sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase">
              {open.id} · time remaining to intimate the Data Protection Board
            </p>
            <Countdown deadlineIso={OPEN_DEADLINE_ISO} />
            <p className="mt-1 font-mono text-[11px]">
              Awareness {open.awareness} · deadline {open.deadline}
            </p>
          </div>
          <div className="border-2 border-white px-3 py-2">
            <p className="font-mono text-[10px] font-bold uppercase">Affected principals</p>
            <p className="font-display text-2xl font-bold">{open.affected}</p>
            <p className="font-mono text-[10px]">to be intimated without delay</p>
          </div>
        </div>
      </div>

      <Panel title={open.id} sub={open.title}>
        <div className="space-y-4">
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              ['Became aware', open.awareness],
              ['Board deadline (72 hours)', open.deadline],
              ['Data principals affected', String(open.affected)],
              ['Status', open.status],
            ].map(([k, v]) => (
              <div key={k} className="border-2 border-black bg-white p-2.5">
                <dt className="font-mono text-[10px] font-bold uppercase text-neutral-600">{k}</dt>
                <dd className="font-mono text-[11px] font-bold">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="border-2 border-black bg-white p-3">
            <p className="font-mono text-[10px] font-bold uppercase text-neutral-600">Data categories involved</p>
            <p className="mt-1 font-mono text-[11px]">{open.categories}</p>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="border-2 border-black bg-neutral-200 p-3">
              <p className="font-display text-sm font-bold uppercase">Intimation to the Board</p>
              <p className="font-mono text-[11px]">{open.boardIntimation}</p>
              <p className="mt-1 font-mono text-[10px]">
                Initial description without delay; full particulars within 72 hours of awareness.
              </p>
              <p className="mt-1 font-mono text-[11px]">
                <CiteLink provision="Rule 7(2)" />
              </p>
            </div>
            <div className="border-2 border-black bg-neutral-200 p-3">
              <p className="font-display text-sm font-bold uppercase">Intimation to data principals</p>
              <p className="font-mono text-[11px]">{open.principalNotice}</p>
              <p className="mt-1 font-mono text-[10px]">
                240 recipients · description, consequences, mitigation taken, and a contact to reach.
              </p>
              <p className="mt-1 font-mono text-[11px]">
                <CiteLink provision="Rule 7(1)" />
              </p>
            </div>
          </div>

          <div className="border-[3px] border-black bg-white p-3">
            <p className="font-mono text-[10px] font-bold uppercase text-neutral-600">
              Generated intimation to the Board — draft
            </p>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-neutral-800">
              Northstar BPO Services Pvt Ltd became aware on 10 October 2026 at 14:20 IST that the September 2026
              payroll register was sent by email to an internal distribution list that included 34 recipients
              without a need to access it. The register contained the name, employee identifier, designation,
              gross and net salary, Permanent Account Number, bank account number and Provident Fund number of
              240 employees. The message was recalled at 14:52 IST and the distribution list was corrected.
              Affected employees are being intimated. No evidence of onward disclosure has been identified.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="border-2 border-black bg-black px-3 py-1.5 font-mono text-[10px] font-bold uppercase text-white shadow-[3px_3px_0px_0px_#000]">
                Approve &amp; send to Board
              </span>
              <span className="border-2 border-black bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#000]">
                Edit draft
              </span>
              <span className="border-2 border-black bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#000]">
                Notify 240 principals
              </span>
            </div>
          </div>

          <DemoNote>
            Sources differ on whether the duty to intimate principals applies to every breach or only where harm
            is likely. The product defaults to notifying and records the reasoning when it does not — the safer
            default, given s.8(6) sits in the highest penalty tier.
          </DemoNote>
        </div>
      </Panel>

      <Panel title="Closed incidents" sub="The register itself is evidence that a mechanism exists">
        <ul className="space-y-2">
          {closed.map((i) => (
            <li key={i.id} className="border-2 border-black bg-white p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="dark">{i.id}</Tag>
                <Tag tone="ok">Closed</Tag>
                <span className="font-mono text-[10px] text-neutral-600">{i.affected} affected</span>
              </div>
              <p className="mt-1 font-display text-sm font-bold">{i.title}</p>
              <p className="font-mono text-[11px] text-neutral-700">
                Aware {i.awareness} · {i.boardIntimation}
              </p>
              <p className="font-mono text-[11px] text-neutral-700">{i.principalNotice}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Why this module is in the MVP">
        <DemoNote>
          It was not in the original three-module sketch. Rule 7 carries no severity threshold, the s.8(6) penalty
          tier reaches ₹200 crore, and essentially no SMB has a runbook. As a register, a countdown and two
          notification templates it is roughly two weeks of build — the best consequence-to-effort ratio in the
          product, and the thing most likely to be needed in anger.
        </DemoNote>
      </Panel>
    </div>
  );
}
