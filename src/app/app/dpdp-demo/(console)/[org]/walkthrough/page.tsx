import { loadClient } from '@/modules/app/dpdp/routeData';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import type { Observation } from '@/modules/app/dpdp/types';
import { demoPath } from '@/modules/app/dpdp/routes';
import WalkthroughAgenda from '@/modules/app/dpdp/components/WalkthroughAgenda';
import { BasisTag } from '@/modules/app/dpdp/components/Tags';
import {
  Button, DemoNote, Fact, Facts, PageHeader, Panel, TableWrap, Tag, Td, Th,
} from '@/modules/app/ui/ui';


const resultTag = (r: Observation['result']) =>
  r === 'matches' ? <Tag tone="ok">Matches</Tag> : r === 'differs' ? <Tag tone="watch">Differs</Tag> : <Tag tone="info">New</Tag>;

export default async function Walkthroughs({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  const WALKTHROUGH = d.walkthrough;
  if (!WALKTHROUGH) return <ModulePending org={org} title="Consultant walkthroughs" what="A walkthrough agenda" />;
  const obs = WALKTHROUGH.observations;
  const findings = [...new Set(obs.map((o) => o.finding).filter(Boolean))];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Consultant walkthroughs"
        sub={`On a review call, ${org.name} screen-shares a system and the consultant records what they see. The client keeps control of their system; the register gets observed facts instead of declared ones.`}
      />

      <Facts>
        <Fact label="Observations" value={obs.length} note={`walkthrough ${WALKTHROUGH.id}`} />
        <Fact label="Differed from the register" value={obs.filter((o) => o.result !== 'matches').length} note="declared ≠ observed" tone="warn" />
        <Fact label="Findings raised or confirmed" value={findings.length} note={findings.join(', ')} tone="bad" />
        <Fact label="Next walkthrough" value={WALKTHROUGH.next.slice(0, 6)} note={WALKTHROUGH.next.slice(7)} />
      </Facts>

      <Panel
        title={`${WALKTHROUGH.id} — ${WALKTHROUGH.date}`}
        sub={`${WALKTHROUGH.consultant} with the ${WALKTHROUGH.attendees.join(', ')}`}
        right={<BasisTag b="observed" />}
        flush
      >
        <TableWrap minWidth="56rem">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <Th>System</Th>
                <Th>Looked at</Th>
                <Th>Register said</Th>
                <Th>Observed on screen</Th>
                <Th>Result</Th>
                <Th>Finding</Th>
              </tr>
            </thead>
            <tbody>
              {obs.map((o) => (
                <tr key={o.system + o.looked} className={o.result === 'matches' ? '' : 'bg-[var(--ds-warn-weak)]'}>
                  <Td className="font-medium">{o.system}</Td>
                  <Td className="text-[var(--ds-text-2)]">{o.looked}</Td>
                  <Td className="text-[var(--ds-text-2)]">{o.declared ?? <span className="text-[var(--ds-text-3)]">Nothing recorded</span>}</Td>
                  <Td className="font-medium">{o.observed}</Td>
                  <Td>{resultTag(o.result)}</Td>
                  <Td>{o.finding ? <Tag tone="alert">{o.finding}</Tag> : <span className="text-[var(--ds-text-3)]">—</span>}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ds-border)] p-4 sm:px-5">
          <p className="text-[12px] text-[var(--ds-text-2)]">
            {findings.length ? `Findings ${findings.join(', ')} rest` : 'Everything here rests'} on what was counted on the client&rsquo;s own screen — not reconciled from an export.
          </p>
          <Button as="link" href={demoPath(org.slug, 'gaps')}>Gap report</Button>
        </div>
      </Panel>

      {d.walkthroughAgenda.length > 0 && <WalkthroughAgenda org={org.slug} />}

      <DemoNote>
        The client drives the screen; the consultant records. Nothing leaves the client&rsquo;s system — not a file,
        not a credential — which is what makes this acceptable to a client who would never send an export. The cost is
        that an observation is only as complete as what was shown, so the agenda is generated from the register: every
        open finding and every attested fix gets looked at, not taken on trust.
      </DemoNote>
    </div>
  );
}
