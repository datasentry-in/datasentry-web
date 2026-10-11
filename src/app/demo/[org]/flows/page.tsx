import { FLOWS, ORGS, getOrg } from '../../_data/mock';
import { CiteLink, DemoNote, Panel, Stat, Tag } from '../../_components/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

const BOX_W = 170;
const BOX_H = 56;
const VIEW_W = 830;
const VIEW_H = 530;

type Node = { id: string; label: string; note: string; x: number; y: number; flag?: boolean };

export default async function Flows({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);

  const all: Node[] = [...FLOWS.sources, ...FLOWS.processors, ...FLOWS.destinations];
  const byId = new Map(all.map((n) => [n.id, n]));

  const edgePath = (fromId: string, toId: string) => {
    const a = byId.get(fromId);
    const b = byId.get(toId);
    if (!a || !b) return null;
    const x1 = a.x + BOX_W;
    const y1 = a.y + BOX_H / 2;
    const x2 = b.x;
    const y2 = b.y + BOX_H / 2;
    const mid = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
  };

  const column = (nodes: Node[], fill: string, text: string) =>
    nodes.map((n) => (
      <g key={n.id}>
        <rect x={n.x + 4} y={n.y + 4} width={BOX_W} height={BOX_H} fill="#000" />
        <rect
          x={n.x}
          y={n.y}
          width={BOX_W}
          height={BOX_H}
          fill={n.flag ? '#000000' : fill}
          stroke="#000"
          strokeWidth="3"
        />
        <text
          x={n.x + 10}
          y={n.y + 23}
          fontFamily="'DM Mono', monospace"
          fontSize="13"
          fontWeight="700"
          fill={n.flag ? '#fff' : text}
        >
          {n.label}
        </text>
        <text
          x={n.x + 10}
          y={n.y + 41}
          fontFamily="'DM Mono', monospace"
          fontSize="10.5"
          fill={n.flag ? '#fff' : text === '#fff' ? '#d4d4d4' : '#525252'}
        >
          {n.note}
        </text>
      </g>
    ));

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 inline-block border-2 border-black bg-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
          M1 · Register
        </p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">Data flow map</h1>
        <p className="mt-1 font-mono text-xs text-neutral-700">
          Derived from the register — no separate authoring step. {org.name}, RoPA v4.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Systems in scope" value={11} note="5 holding, 6 receiving" />
        <Stat label="Processors" value={FLOWS.processors.length} note="2 flagged" tone="bad" />
        <Stat label="Cross-border destinations" value={2} note="United States, United Kingdom" tone="warn" />
        <Stat label="Flagged edges" value={2} note="no DPA, no basis" tone="bad" />
      </div>

      <Panel title="Where personal data moves" sub="A dashed black edge marks a flow the register raised a finding against">
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <div className="min-w-[52rem] px-4 sm:px-0">
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-auto w-full" role="img"
              aria-label="Data flow map from source systems through processors to destinations">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#000" />
                </marker>
                <marker id="arrowFlag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#000000" />
                </marker>
              </defs>

              {/* Column headings */}
              <text x="60" y="22" fontFamily="'Space Grotesk', sans-serif" fontSize="12" fontWeight="700" fill="#525252">
                SOURCE SYSTEMS
              </text>
              <text x="330" y="22" fontFamily="'Space Grotesk', sans-serif" fontSize="12" fontWeight="700" fill="#525252">
                PROCESSORS
              </text>
              <text x="600" y="22" fontFamily="'Space Grotesk', sans-serif" fontSize="12" fontWeight="700" fill="#525252">
                DESTINATION
              </text>

              {/* Edges first so boxes sit on top */}
              {FLOWS.edges.map(([from, to]) => {
                const d = edgePath(from, to);
                if (!d) return null;
                const flagged =
                  byId.get(from)?.flag || byId.get(to)?.flag ? true : false;
                return (
                  <path
                    key={`${from}-${to}`}
                    d={d}
                    fill="none"
                    stroke={flagged ? '#000000' : '#a3a3a3'}
                    strokeWidth={flagged ? 3 : 1.75}
                    strokeDasharray={flagged ? '7 4' : undefined}
                    markerEnd={flagged ? 'url(#arrowFlag)' : 'url(#arrow)'}
                  />
                );
              })}

              {column(FLOWS.sources, '#fff', '#000')}
              {column(FLOWS.processors, '#e5e5e5', '#000')}
              {column(FLOWS.destinations, '#404040', '#fff')}
            </svg>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Tag>Source system</Tag>
          <Tag tone="info">Processor</Tag>
          <Tag tone="ok">Destination</Tag>
          <Tag tone="alert">Finding raised (dashed)</Tag>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Flagged flows" sub="Each links back to a gap finding">
          <ul className="space-y-2">
            <li className="border-2 border-black bg-neutral-100 p-3">
              <p className="font-display text-sm font-bold uppercase">Zoho Recruit → AuthBridge</p>
              <p className="font-mono text-[11px] text-neutral-800">
                Candidate identity, education, employment and criminal-record data leaves for background
                verification with no data processing agreement in place.
              </p>
              <p className="mt-1 font-mono text-[11px]">
                <CiteLink provision="s.8(2)" /> · finding G-02
              </p>
            </li>
            <li className="border-2 border-black bg-neutral-100 p-3">
              <p className="font-display text-sm font-bold uppercase">Keka HR → Mailchimp → United States</p>
              <p className="font-mono text-[11px] text-neutral-800">
                1,340 ex-employee contact records are used for alumni marketing with no lawful basis recorded, and
                transferred outside India in the process.
              </p>
              <p className="mt-1 font-mono text-[11px]">
                <CiteLink provision="s.6 read with s.4" /> · finding G-06
              </p>
            </li>
          </ul>
        </Panel>

        <Panel title="Cross-border position" sub="Record destinations; do not assess them yet">
          <ul className="space-y-2">
            <li className="border-2 border-black bg-white p-3">
              <p className="font-display text-sm font-bold uppercase">United States — 4 transfers</p>
              <p className="font-mono text-[11px] text-neutral-700">
                Client LMS (PA-08), Mailchimp (PA-12), Microsoft and Forcepoint (PA-15), HubSpot (PA-18).
              </p>
            </li>
            <li className="border-2 border-black bg-neutral-700 p-3 text-white">
              <p className="font-display text-sm font-bold uppercase">United Kingdom — exempt</p>
              <p className="font-mono text-[11px]">
                PA-17 client delivery. Principals are outside India under contract with a person outside India.
              </p>
            </li>
            <li>
              <DemoNote>
                The product records destinations and stops there. The s.16 restricted-country list has not been
                notified, so any transfer-permissibility verdict would be invented. That restraint is deliberate
                and worth saying out loud to clients.
              </DemoNote>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
