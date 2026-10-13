import { clientData } from '@/modules/app/dpdp/mock/clients';
import { ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import RopaRegister from '@/modules/app/dpdp/components/RopaRegister';
import {
  Card, DemoNote, Fact, Facts, PageHeader, Panel, TableWrap, Tag, Td, Th,
} from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

export default async function Ropa({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  const d = clientData(slug);
  if (!d.registerBuilt) {
    return (
      <div className="space-y-8">
        <PageHeader title="Record of processing activities" sub={org.name} />
        <ModulePending org={org.slug} what="The record of processing activities" />
      </div>
    );
  }
  const ACTIVITIES = d.activities;
  const items = ACTIVITIES.reduce((n, a) => n + a.items, 0);
  const legitimate = d.basisBreakdown.filter((b) => b.label.startsWith('s.7(i)') || b.label === 'Legal obligation').reduce((n, b) => n + b.count, 0);
  const withDpa = d.processors.filter((p) => p.dpa !== 'MISSING' && !p.dpa.startsWith('Standard')).length;
  const undetermined = ACTIVITIES.filter((a) => a.basis === 'Not determined').length;
  const processors = new Set(ACTIVITIES.flatMap((a) => a.processors)).size;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Record of processing activities"
        sub={`Register confirmed ${org.lastReview} · ${org.name}`}
      />

      <Facts>
        <Fact label="Activities" value={ACTIVITIES.length} note={`${org.exemptActivities} exempt`} />
        <Fact label="Data items itemised" value={items} note="each item listed, as notices must (Rule 3)" />
        <Fact label="Processors engaged" value={processors} note={`${withDpa} of ${d.processors.length} have a DPA`} tone={withDpa < d.processors.length ? 'warn' : 'plain'} />
        <Fact label="Basis not determined" value={undetermined} note="blocks the evidence pack" tone={undetermined ? 'bad' : 'plain'} />
      </Facts>

      <Panel
        title="Register"
        sub="Click a lawful basis or retention to change it · open an activity for its findings and history"
        right={
          <div className="flex flex-wrap gap-1.5">
            <Tag tone="dark">Fiduciary {ACTIVITIES.filter((a) => a.role === 'Fiduciary').length}</Tag>
            <Tag tone="ok">Exempt {ACTIVITIES.filter((a) => a.role === 'Exempt').length}</Tag>
          </div>
        }
        flush
      >
        <RopaRegister org={org.slug} />
      </Panel>

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel title="How the basis breaks down" sub="The correction most clients need to hear">
          <ul className="space-y-2">
            {d.basisBreakdown.map(({ label, count: n, note }) => (
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
              {legitimate} of {ACTIVITIES.length} activities run on a legitimate use or a legal obligation, not
              consent. Building an employee consent engine would have been building the wrong product.
            </DemoNote>
          </div>
        </Panel>

        <Panel title="Processor register" sub="Every vendor handling this data needs a written contract (s.8(2))" flush>
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
                {d.processors.map(({ name: p, activities: act, dpa }) => (
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
