import { FLOWS, ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import { Card, CiteLink, DemoNote, PageHeader, Panel, Stat, Tag } from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

const BOX_W = 170;
const BOX_H = 56;
const VIEW_W = 830;
const VIEW_H = 530;

// Mirrors the console tokens in globals.css — SVG cannot read them from the
// cascade reliably across the static export, so they are spelled out here.
const INK = '#0e0f11';
const FAINT = '#8b8f98';
const LINE = '#d7d8dc';
const DANGER = '#b42318';
const DANGER_BG = '#fef3f2';
const PANEL = '#ffffff';
const SUBTLE = '#f7f7f8';
const ACCENT_BG = '#e8f4fb';
const ACCENT_LINE = '#bfe0f2';

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

  const column = (nodes: Node[], fill: string, stroke: string) =>
    nodes.map((n) => (
      <g key={n.id}>
        <rect
          x={n.x}
          y={n.y}
          rx={8}
          width={BOX_W}
          height={BOX_H}
          fill={n.flag ? DANGER_BG : fill}
          stroke={n.flag ? '#fcd9d4' : stroke}
          strokeWidth="1"
        />
        <text x={n.x + 12} y={n.y + 23} fontSize="12.5" fontWeight="600" fill={n.flag ? DANGER : INK}>
          {n.label}
        </text>
        <text x={n.x + 12} y={n.y + 40} fontSize="11" fill={n.flag ? DANGER : FAINT}>
          {n.note}
        </text>
      </g>
    ));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Data flow map"
        sub={`Derived from the register — no separate authoring step. ${org.name}, RoPA v4.`}
      />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-border)] lg:grid-cols-4">
        <Stat label="Systems in scope" value={11} note="5 holding, 6 receiving" />
        <Stat label="Processors" value={FLOWS.processors.length} note="2 flagged" tone="bad" />
        <Stat label="Cross-border destinations" value={2} note="United States, United Kingdom" tone="warn" />
        <Stat label="Flagged edges" value={2} note="no DPA, no basis" tone="bad" />
      </div>

      <Panel title="Where personal data moves" sub="A dashed red edge marks a flow the register raised a finding against">
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <div className="min-w-[52rem] px-4 sm:px-0">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="h-auto w-full"
              role="img"
              fontFamily="Inter, sans-serif"
              aria-label="Data flow map from source systems through processors to destinations"
            >
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
                </marker>
                <marker id="arrowFlag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={DANGER} />
                </marker>
              </defs>

              {/* Column headings */}
              {[
                [60, 'SOURCE SYSTEMS'],
                [330, 'PROCESSORS'],
                [600, 'DESTINATION'],
              ].map(([x, label]) => (
                <text key={String(label)} x={x} y="20" fontSize="10.5" fontWeight="500" letterSpacing="0.08em" fill={FAINT}>
                  {label}
                </text>
              ))}

              {/* Edges first so boxes sit on top */}
              {FLOWS.edges.map(([from, to]) => {
                const d = edgePath(from, to);
                if (!d) return null;
                const flagged = byId.get(from)?.flag || byId.get(to)?.flag ? true : false;
                return (
                  <path
                    key={`${from}-${to}`}
                    d={d}
                    fill="none"
                    stroke={flagged ? DANGER : LINE}
                    strokeWidth={flagged ? 1.5 : 1.25}
                    strokeDasharray={flagged ? '5 4' : undefined}
                    markerEnd={flagged ? 'url(#arrowFlag)' : 'url(#arrow)'}
                  />
                );
              })}

              {column(FLOWS.sources, PANEL, LINE)}
              {column(FLOWS.processors, SUBTLE, LINE)}
              {column(FLOWS.destinations, ACCENT_BG, ACCENT_LINE)}
            </svg>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--ds-border)] pt-3">
          <Tag>Source system</Tag>
          <Tag tone="info">Processor</Tag>
          <Tag tone="dark">Destination</Tag>
          <Tag tone="alert">Finding raised (dashed)</Tag>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Flagged flows" sub="Each links back to a gap finding">
          <ul className="space-y-2">
            <li>
              <Card tone="danger">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold tracking-[-0.01em]">Zoho Recruit → AuthBridge</p>
                  <Tag tone="alert">G-02</Tag>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--ds-text-2)]">
                  Candidate identity, education, employment and criminal-record data leaves for background
                  verification with no data processing agreement in place.
                </p>
                <p className="mt-2">
                  <CiteLink provision="s.8(2)" />
                </p>
              </Card>
            </li>
            <li>
              <Card tone="danger">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold tracking-[-0.01em]">Keka HR → Mailchimp → United States</p>
                  <Tag tone="alert">G-06</Tag>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--ds-text-2)]">
                  1,340 ex-employee contact records are used for alumni marketing with no lawful basis recorded, and
                  transferred outside India in the process.
                </p>
                <p className="mt-2">
                  <CiteLink provision="s.6 read with s.4" />
                </p>
              </Card>
            </li>
          </ul>
        </Panel>

        <Panel title="Cross-border position" sub="Record destinations; do not assess them yet">
          <ul className="space-y-2">
            <li>
              <Card>
                <p className="text-[13px] font-semibold tracking-[-0.01em]">United States — 4 transfers</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--ds-text-2)]">
                  Client LMS (PA-08), Mailchimp (PA-12), Microsoft and Forcepoint (PA-15), HubSpot (PA-18).
                </p>
              </Card>
            </li>
            <li>
              <Card tone="ok">
                <p className="text-[13px] font-semibold tracking-[-0.01em]">United Kingdom — exempt</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--ds-text-2)]">
                  PA-17 client delivery. Principals are outside India under contract with a person outside India.
                </p>
              </Card>
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
