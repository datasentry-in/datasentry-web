'use client';

import { useState, type ReactNode } from 'react';
import { clientData, getOrg, personFor } from '@/modules/app/dpdp/mock/clients';
import { CONTRACTS, NO_EDITS, REGIONS, REGION_NAME, flowGraph, type RegisterEdits } from '@/modules/app/dpdp/flowGraph';
import { editParty } from '@/modules/app/dpdp/registerEdits';
import type { FlowEdge, FlowNode, Gap, Region } from '@/modules/app/dpdp/types';
import Sheet, {
  SheetActivity, SheetDetails, SheetField, SheetList, SheetListItem, SheetSection, SheetTab,
} from '@/modules/app/ui/Sheet';
import { SeverityTag } from '@/modules/app/dpdp/components/Tags';
import {
  CiteLink, Person, Tag, ViewTabs,
} from '@/modules/app/ui/ui';
import Discussion from './Discussion';
import RemindButton from './RemindButton';
import When from './When';

/**
 * HIDDEN (shown only at `flows/hand-placed`): the earlier hand-placed map —
 * superseded by the auto-laid-out DataFlowElk. Its colours, icons, legend,
 * graphFor and FlowSheet are shared with DataFlowElk and stay when the
 * drawing is removed.
 *
 * The data-flow map as a privacy reviewer reads one: three trust boundaries
 * (the client's own systems, third parties in India, outside India) with the
 * India border drawn; every system typed, located and shown with the contract
 * that governs it; every flow labelled with what moves and on what basis; and
 * flows the register raised a finding against drawn dashed in the finding's
 * colour. Filter by finding, cross-border or whose data; hover a system to trace
 * its flows; click a system or a flow for the record behind it.
 */

// SVG reads no CSS variables reliably across the static export, so the
// console tokens are spelled out (console.css is the source of truth).
export const C = {
  ink: '#0e0f11', text2: '#4b4f57', text3: '#757983', line: '#d7d8dc', border: '#ebebed', zone: '#fbfbfc',
  panel: '#ffffff', danger: '#b42318', warn: '#b54708', ok: '#067647', brand: '#009FE3', accent: '#0077b0',
  /** An ordinary flow: DataSentry blue, softened so findings still stand out. */
  flow: '#7cc6ec',
};

/**
 * Colour by meaning. Zones: the client's own estate in brand blue, Indian third
 * parties in violet, outside India in amber (a transfer to watch). Kinds get a
 * tinted icon badge; lawful bases get a colour each, red when not determined.
 */
export const ZONE_TONE: Record<FlowNode['zone'], { fill: string; stroke: string; title: string }> = {
  internal: { fill: '#f3faff', stroke: '#bfe3f6', title: '#0077b0' },
  india: { fill: '#f6f5fd', stroke: '#d9d5f3', title: '#5b4bc4' },
  abroad: { fill: '#fffaf1', stroke: '#f3d9a6', title: '#b54708' },
};
export const KIND_TONE: Record<FlowNode['kind'], { bg: string; fg: string }> = {
  system: { bg: '#e3f3fc', fg: '#0077b0' },
  processor: { bg: '#eeebfb', fg: '#5b4bc4' },
  statutory: { bg: '#eceff3', fg: '#475467' },
  client: { bg: '#e2f4f1', fg: '#0f766e' },
};
export const basisTone = (b: string) =>
  b === 'Not determined' ? C.danger
    : b === 'Consent' ? '#5b4bc4'
      : b === 'Legal obligation' ? '#475467'
        : b.startsWith('s.7(i)') ? '#0f766e'
          : b.includes('exempt') ? C.ok
            : C.text3;

const W = 1000;
const H = 600;
const NODE_W = 208;
const NODE_H = 60;
const BORDER_X = 702;
const COL: Record<FlowNode['zone'], number> = { internal: 36, india: 420, abroad: 756 };
const ZONES: { zone: FlowNode['zone']; x: number; w: number; title: string; sub: string; dashed: boolean }[] = [
  { zone: 'internal', x: 16, w: 248, title: 'OWN SYSTEMS', sub: 'Data Fiduciary · India', dashed: false },
  { zone: 'india', x: 400, w: 248, title: 'THIRD PARTIES — INDIA', sub: 'Processors and statutory recipients', dashed: true },
  { zone: 'abroad', x: 736, w: 248, title: 'OUTSIDE INDIA', sub: 'Cross-border transfers', dashed: true },
];
// Rows chosen so no flow label sits on a box.
const Y: Record<string, number> = {
  ats: 72, hrms: 160, payroll: 248, biometric: 336, endpoints: 424, vdi: 512,
  authbridge: 48, insurer: 196, epfo: 300,
  mailchimp: 70, forcepoint: 424, ukclient: 512,
};


export const SAFEGUARD_TONE: Record<FlowNode['safeguard'], string> = {
  Internal: C.accent, 'DPA in place': C.ok, 'No DPA': C.danger, 'Terms only': C.warn, Statutory: '#475467', Exempt: '#0f766e',
};

export type Filter = 'all' | 'finding' | 'border' | FlowEdge['principals'];
export const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All flows' },
  { id: 'finding', label: 'With a finding' },
  { id: 'border', label: 'Cross-border' },
  { id: 'Candidates', label: 'Candidates' },
  { id: 'Employees', label: 'Employees' },
  { id: 'Ex-employees', label: 'Ex-employees' },
  { id: 'Client end-users', label: 'Client end-users' },
];

/* ------------------------------------------------------------------ geometry */

/**
 * One client's graph and the helpers that draw it. Built per client, so the
 * map shows that client's systems, flows and findings — never another's.
 */
export function graphFor(org: string, edits: RegisterEdits = NO_EDITS) {
  const d = clientData(org);
  // Generated from the register (with this session's edits), never authored.
  const { nodes, edges, gaps } = flowGraph(d, edits);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const gap = (id?: string): Gap | undefined => (id ? gaps.find((g) => g.id === id) : undefined);
  const sevColor = (id?: string) => (gap(id)?.severity === 'High' ? C.danger : gap(id) ? C.warn : C.line);
  const crossBorder = (e: FlowEdge) => byId.get(e.to)?.zone === 'abroad';
  const matches = (e: FlowEdge, f: Filter) =>
    f === 'all' ? true : f === 'finding' ? !!e.finding : f === 'border' ? crossBorder(e) : e.principals === f;
  const pos = (id: string) => {
    const n = byId.get(id)!;
    return { x: COL[n.zone], y: Y[id] ?? 0 };
  };
  function curve(e: FlowEdge) {
    const a = pos(e.from);
    const b = pos(e.to);
    const p0 = { x: a.x + NODE_W, y: a.y + NODE_H / 2 };
    const p3 = { x: b.x, y: b.y + NODE_H / 2 };
    const mid = (p0.x + p3.x) / 2;
    const p1 = { x: mid, y: p0.y };
    const p2 = { x: mid, y: p3.y };
    const at = (t: number) => {
      const u = 1 - t;
      return {
        x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
        y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
      };
    };
    // Where the flow crosses the India border, if it does.
    let crossing: { x: number; y: number } | null = null;
    if (p0.x < BORDER_X && p3.x > BORDER_X) {
      let lo = 0;
      let hi = 1;
      for (let i = 0; i < 24; i++) {
        const m = (lo + hi) / 2;
        if (at(m).x < BORDER_X) lo = m;
        else hi = m;
      }
      crossing = at((lo + hi) / 2);
    }
    return { d: `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`, mid: at(0.5), crossing };
  }
  const clientShort = getOrg(org).name.split(' ')[0];
  return { nodes, edges, owners: d.owners, clientShort, byId, gap, sevColor, crossBorder, matches, pos, curve };
}

/* --------------------------------------------------------------------- icons */

export function KindIcon({ kind, x, y, color }: { kind: FlowNode['kind']; x: number; y: number; color: string }) {
  const p = { fill: 'none', stroke: color, strokeWidth: 1.3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <g transform={`translate(${x} ${y})`}>
      {kind === 'system' && (<><rect x="1.5" y="2" width="13" height="5" rx="1" {...p} /><rect x="1.5" y="9" width="13" height="5" rx="1" {...p} /><path d="M4 4.5h.01M4 11.5h.01" {...p} /></>)}
      {kind === 'processor' && <path d="M4.5 12.5h7a3 3 0 0 0 .4-6 4 4 0 0 0-7.7 1A2.5 2.5 0 0 0 4.5 12.5z" {...p} />}
      {kind === 'statutory' && <path d="M2 6.5 8 3l6 3.5M3.5 7v5M6.5 7v5M9.5 7v5M12.5 7v5M2 13.5h12" {...p} />}
      {kind === 'client' && (<><rect x="2" y="5" width="12" height="8.5" rx="1.5" {...p} /><path d="M6 5V3.5h4V5M2 9h12" {...p} /></>)}
    </g>
  );
}

/* ----------------------------------------------------------------- the map */

export type Selected = { type: 'node'; id: string } | { type: 'edge'; id: string } | null;

export default function DataFlowMap({ org }: { org: string }) {
  const { nodes: FLOW_NODES, edges: FLOW_EDGES, clientShort, byId, gap, sevColor, matches, pos, curve } = graphFor(org);
  const [filter, setFilter] = useState<Filter>('all');
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<Selected>(null);

  const edgeOn = (e: FlowEdge) => matches(e, filter) && (!hover || e.from === hover || e.to === hover);
  const nodeOn = (n: FlowNode) => {
    const active = FLOW_EDGES.filter(edgeOn);
    if (hover) return n.id === hover || active.some((e) => e.from === n.id || e.to === n.id);
    if (filter === 'all') return true;
    if (filter === 'finding' && n.finding) return true;
    return active.some((e) => e.from === n.id || e.to === n.id);
  };
  const count = (f: Filter) => FLOW_EDGES.filter((e) => matches(e, f)).length;
  const press = (s: Selected) => (ev: React.KeyboardEvent) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      setSelected(s);
    }
  };

  return (
    <>
      <div className="border-b border-[var(--ds-border)] px-4 py-3 sm:px-5">
        <ViewTabs
          label="Filter flows"
          views={FILTERS}
          active={filter}
          counts={Object.fromEntries(FILTERS.map((f) => [f.id, count(f.id)]))}
          onChange={(id) => setFilter(id as Filter)}
        />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[60rem] px-4 py-4 sm:px-5">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" fontFamily="Inter, sans-serif" aria-label="Data flow map across three trust boundaries">
            <defs>
              {[['arrow', C.flow], ['arrowHigh', C.danger], ['arrowMed', C.warn], ['arrowOn', C.accent]].map(([id, fill]) => (
                <marker key={id} id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10z" fill={fill} />
                </marker>
              ))}
            </defs>

            {/* Trust boundaries */}
            {ZONES.map((z) => (
              <g key={z.zone}>
                <rect x={z.x} y={8} width={z.w} height={H - 16} rx={10} fill={ZONE_TONE[z.zone].fill} stroke={ZONE_TONE[z.zone].stroke} strokeDasharray={z.dashed ? '4 4' : undefined} />
                <rect x={z.x + 20} y={21} width={3} height={11} rx={1.5} fill={ZONE_TONE[z.zone].title} />
                <text x={z.x + 28} y={30} fontSize="10.5" fontWeight="700" letterSpacing="0.06em" fill={ZONE_TONE[z.zone].title}>{z.zone === 'internal' ? `${clientShort.toUpperCase()} — ${z.title}` : z.title}</text>
                <text x={z.x + 20} y={45} fontSize="10.5" fill={C.text3}>{z.sub}</text>
              </g>
            ))}

            {/* The India border */}
            <line x1={BORDER_X} x2={BORDER_X} y1={8} y2={H - 8} stroke={C.brand} strokeWidth="1.25" strokeDasharray="6 5" />
            <g transform={`translate(${BORDER_X} ${H - 20}) rotate(-90)`}>
              <rect x={0} y={-9} width={88} height={18} rx={9} fill={C.panel} stroke={C.brand} />
              <text x={44} y={3.5} textAnchor="middle" fontSize="10" fontWeight="600" fill={C.accent}>INDIA BORDER</text>
            </g>

            {/* Flows */}
            {FLOW_EDGES.map((e) => {
              const { d } = curve(e);
              const on = edgeOn(e);
              const color = e.finding ? sevColor(e.finding) : on && hover ? C.accent : C.flow;
              const marker = e.finding ? (gap(e.finding)?.severity === 'High' ? 'arrowHigh' : 'arrowMed') : on && hover ? 'arrowOn' : 'arrow';
              return (
                <path
                  key={e.id}
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={e.finding ? 1.75 : 1.4}
                  strokeDasharray={e.finding ? '6 4' : undefined}
                  markerEnd={`url(#${marker})`}
                  opacity={on ? 1 : 0.15}
                  style={{ transition: 'opacity .15s' }}
                />
              );
            })}

            {/* Systems and parties */}
            {FLOW_NODES.map((n) => {
              const { x, y } = pos(n.id);
              const flag = n.finding ? sevColor(n.finding) : null;
              const on = nodeOn(n);
              return (
                <g
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${n.label}, ${n.region}, ${n.safeguard}`}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(n.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => setSelected({ type: 'node', id: n.id })}
                  onKeyDown={press({ type: 'node', id: n.id })}
                  opacity={on ? 1 : 0.25}
                  style={{ cursor: 'pointer', transition: 'opacity .15s', outline: 'none' }}
                >
                  <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={8} fill={C.panel} stroke={hover === n.id ? C.text3 : C.line} />
                  {flag && <rect x={x + 6} y={y + 10} width={2.5} height={NODE_H - 20} rx={1.25} fill={flag} />}
                  <rect x={x + 14} y={y + 16} width={28} height={28} rx={7} fill={KIND_TONE[n.kind].bg} />
                  <KindIcon kind={n.kind} x={x + 20} y={y + 22} color={KIND_TONE[n.kind].fg} />
                  <text x={x + 52} y={y + 26} fontSize="12.5" fontWeight="600" fill={C.ink}>{n.label}</text>
                  <rect x={x + NODE_W - 34} y={y + 11} width={24} height={16} rx={4} fill={n.region === 'IN' ? '#e7f6ee' : '#fff1dc'} />
                  <text x={x + NODE_W - 22} y={y + 22.5} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={n.region === 'IN' ? C.ok : C.warn}>{n.region}</text>
                  <circle cx={x + 55} cy={y + 41} r={3} fill={SAFEGUARD_TONE[n.safeguard]} />
                  <text x={x + 62} y={y + 44.5} fontSize="11">
                    <tspan fill={SAFEGUARD_TONE[n.safeguard]} fontWeight={n.safeguard === 'Internal' || n.safeguard === 'Statutory' || n.safeguard === 'Exempt' ? 400 : 600}>{n.safeguard}</tspan>
                    <tspan fill={C.text3}> · {n.principals.length > 15 ? `${n.principals.slice(0, 14)}…` : n.principals}</tspan>
                  </text>
                </g>
              );
            })}

            {/* Flow labels and border crossings, above the boxes */}
            {FLOW_EDGES.map((e) => {
              const { mid, crossing } = curve(e);
              const on = edgeOn(e);
              const label = e.label;
              const w = Math.max(label.length * 5.6, e.basis.length * 5.2) + 18;
              const tone = e.finding ? sevColor(e.finding) : '#bfe3f6';
              return (
                <g
                  key={e.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${byId.get(e.from)?.label} to ${byId.get(e.to)?.label}: ${label}, basis ${e.basis}`}
                  onClick={() => setSelected({ type: 'edge', id: e.id })}
                  onKeyDown={press({ type: 'edge', id: e.id })}
                  opacity={on ? 1 : 0.15}
                  style={{ cursor: 'pointer', transition: 'opacity .15s', outline: 'none' }}
                >
                  {crossing && (
                    <g transform={`translate(${crossing.x} ${crossing.y})`}>
                      <circle r="7" fill={C.panel} stroke={C.brand} strokeWidth="1.25" />
                      <path d="M-4 0h8M0 -4c-2 2.4-2 5.6 0 8M0 -4c2 2.4 2 5.6 0 8" fill="none" stroke={C.accent} strokeWidth="0.9" />
                    </g>
                  )}
                  <rect x={mid.x - w / 2} y={mid.y - 15} width={w} height={30} rx={6} fill={C.panel} stroke={tone} />
                  <text x={mid.x} y={mid.y - 2} textAnchor="middle" fontSize="10.5" fontWeight="500" fill={C.ink}>{label}</text>
                  <text x={mid.x} y={mid.y + 10} textAnchor="middle" fontSize="9.5" fontWeight={600} fill={basisTone(e.basis)}>
                    {e.basis}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <Legend />

      <FlowSheet org={org} selected={selected} onSelect={setSelected} />
    </>
  );
}

/* --------------------------------------------------------------- the legend */

export function Legend() {
  const item = (glyph: ReactNode, text: string) => (
    <span key={text} className="flex items-center gap-1.5">
      <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden>{glyph}</svg>
      {text}
    </span>
  );
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--ds-border)] px-4 py-3 text-[12px] text-[var(--ds-text-2)] sm:px-5">
      {(['system', 'processor', 'statutory', 'client'] as const).map((k) =>
        item(<KindIcon kind={k} x={3} y={0} color={KIND_TONE[k].fg} />, { system: 'Own system', processor: 'Processor', statutory: 'Statutory recipient', client: 'Client (exempt delivery)' }[k]),
      )}
      {item(<path d="M1 8h20" stroke={C.flow} strokeWidth="1.75" />, 'Flow')}
      {item(<path d="M1 8h20" stroke={C.danger} strokeWidth="1.75" strokeDasharray="5 3" />, 'Finding — high')}
      {item(<path d="M1 8h20" stroke={C.warn} strokeWidth="1.75" strokeDasharray="5 3" />, 'Finding — medium')}
      {item(<g transform="translate(11 8)"><circle r="6" fill="#fff" stroke={C.brand} /><path d="M-3.5 0h7" stroke={C.accent} strokeWidth="0.9" /></g>, 'Crosses the India border')}
      <span className="flex flex-wrap items-center gap-1.5">
        Basis:
        {['Consent', 'Legal obligation', 's.7(i) legitimate use', 'Exempt', 'Not determined'].map((b, i) => (
          <span key={b} className="font-medium" style={{ color: basisTone(b === 'Exempt' ? 'exempt' : b) }}>
            {b}{i < 4 ? <span className="font-normal text-[var(--ds-text-3)]"> ·</span> : null}
          </span>
        ))}
      </span>
      <span className="flex items-center gap-1.5">
        Safeguard:
        <span className="font-medium text-[var(--ds-ok)]">DPA in place</span> ·
        <span className="font-medium text-[var(--ds-warn)]">Terms only</span> ·
        <span className="font-medium text-[var(--ds-danger)]">No DPA</span>
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- the sheet */

function FindingBlock({ org, id, edits }: { org: string; id: string; edits: RegisterEdits }) {
  const { gap, owners: OWNERS } = graphFor(org, edits);
  const g = gap(id);
  if (!g) return null;
  const person = personFor(OWNERS, g.owner).name;
  return (
    <SheetSection title="Finding">
      <div className="ds-bar" style={{ ['--bar' as string]: g.severity === 'High' ? C.danger : C.warn }}>
        <p className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium">
          <span className="ds-id text-[12px] text-[var(--ds-text-3)]">{g.id}</span> {g.title} <SeverityTag s={g.severity} />
        </p>
        <p className="mt-1 text-[12px] text-[var(--ds-text-2)]">{g.detail}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <CiteLink provision={g.provision} />
          <Person name={person} compact />
          <When date={g.due} className="text-[12px] text-[var(--ds-text-3)]" />
          <RemindButton person={person} what={`${g.id} — ${g.title}`} />
        </div>
      </div>
    </SheetSection>
  );
}

/** Label/value fields for a `SheetDetails` box. */
function Rows({ rows }: { rows: [string, ReactNode][] }) {
  return <>{rows.map(([k, v]) => <SheetField key={k} label={k}>{v}</SheetField>)}</>;
}

const safeguardText = (s: FlowNode['safeguard']) => <span className="font-medium" style={{ color: SAFEGUARD_TONE[s] }}>{s}</span>;
const where = (n: FlowNode) => REGION_NAME[n.region];
const SELECT = 'h-7 rounded-md border border-[var(--ds-border)] bg-[var(--ds-panel)] px-2 text-[13px] outline-none focus:border-[var(--ds-accent)]';

/**
 * The record behind a flow or a system. With `editable`, a recipient's hosting
 * country and contract can be changed here — a register edit (registerEdits),
 * so the map re-lays itself out and its rules re-run.
 */
export function FlowSheet({
  org, selected, onSelect, edits = NO_EDITS, editable = false,
}: { org: string; selected: Selected; onSelect: (s: Selected) => void; edits?: RegisterEdits; editable?: boolean }) {
  const { edges: FLOW_EDGES, clientShort, byId, crossBorder } = graphFor(org, edits);
  const edge = selected?.type === 'edge' ? FLOW_EDGES.find((e) => e.id === selected.id) : undefined;
  const node = selected?.type === 'node' ? byId.get(selected.id) : undefined;
  const close = () => onSelect(null);

  if (edge) {
    const a = byId.get(edge.from)!;
    const b = byId.get(edge.to)!;
    return (
      <Sheet
        open
        onClose={close}
        meta={<><span className="ds-id">{edge.activity.split(' ')[0]}</span><span aria-hidden>·</span><span>{clientShort}</span><span aria-hidden>·</span><span>Data flow</span></>}
        title={`${a.label} → ${b.label}`}
        actions={<>{crossBorder(edge) ? <Tag tone="info">Cross-border · {where(b)}</Tag> : <Tag>Stays in India</Tag>}<Tag>{b.safeguard}</Tag></>}
      >
        <SheetDetails title="What moves">
          <Rows
            rows={[
              ['Activity', edge.activity],
              ['Whose data', edge.principals],
              ['Data categories', <ul key="c" className="space-y-0.5">{edge.categories.map((c) => <li key={c}>{c}</li>)}</ul>],
              ['Lawful basis', <span key="b" className={edge.basis === 'Not determined' ? 'font-medium text-[var(--ds-danger)]' : ''}>{edge.basis}</span>],
            ]}
          />
        </SheetDetails>
        <SheetDetails title="Where it goes">
          <Rows
            rows={[
              ['Recipient', `${b.label} — ${b.kind === 'statutory' ? 'statutory recipient' : b.kind}`],
              ['Held in', where(b)],
              ['Safeguard', safeguardText(b.safeguard)],
              ['Transfer', crossBorder(edge) ? (b.safeguard === 'Exempt' ? 'Outside India — exempt under s.17(1)(d)' : 'Outside India — recorded; s.16 list not yet notified') : 'Stays in India'],
            ]}
          />
        </SheetDetails>
        {edge.finding && <FindingBlock org={org} id={edge.finding} edits={edits} />}
        <SheetActivity>
          <SheetTab label="Comments"><Discussion org={org} refId={edge.finding ?? edge.activity.split(' ')[0]} /></SheetTab>
        </SheetActivity>
      </Sheet>
    );
  }

  if (node) {
    const out = FLOW_EDGES.filter((e) => e.from === node.id);
    const inn = FLOW_EDGES.filter((e) => e.to === node.id);
    const list = (es: FlowEdge[], dir: 'to' | 'from') =>
      es.map((e) => {
        const other = byId.get(dir === 'to' ? e.to : e.from)!;
        return (
          <SheetListItem key={e.id} icon={<span aria-hidden className="w-3.5 text-center text-[var(--ds-text-3)]">{dir === 'to' ? '→' : '←'}</span>}>
            <button type="button" onClick={() => onSelect({ type: 'edge', id: e.id })} className="text-left hover:text-[var(--ds-accent-hover)] hover:underline">
              {other.label} <span className="text-[var(--ds-text-3)]">· {e.label}</span>
            </button>
          </SheetListItem>
        );
      });
    return (
      <Sheet
        open
        onClose={close}
        meta={<><span>{clientShort}</span><span aria-hidden>·</span><span>Data flow map</span></>}
        title={node.label}
        actions={<><Tag>{node.kind === 'statutory' ? 'Statutory recipient' : node.kind === 'system' ? 'Own system' : node.kind === 'client' ? 'Client' : 'Processor'}</Tag><Tag tone={node.region === 'IN' ? 'plain' : 'info'}>{where(node)}</Tag></>}
      >
        <SheetDetails>
          <Rows
            rows={[
              ['Trust boundary', { internal: `${clientShort} — own systems`, india: 'Third party — India', abroad: 'Outside India' }[node.zone]],
              ['Hosted in', editable ? (
                <select
                  key="h"
                  aria-label={`Where ${node.label} holds the data`}
                  value={node.region}
                  onChange={(e) => editParty(org, node.id, { region: e.target.value as Region })}
                  className={SELECT}
                >
                  {REGIONS.map((r) => <option key={r} value={r}>{REGION_NAME[r]}</option>)}
                </select>
              ) : where(node)],
              ['Safeguard', editable && node.kind === 'processor' ? (
                <select
                  key="c"
                  aria-label={`${node.label}'s contract`}
                  value={node.safeguard}
                  onChange={(e) => editParty(org, node.id, { safeguard: e.target.value as FlowNode['safeguard'] })}
                  className={SELECT}
                >
                  {CONTRACTS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : safeguardText(node.safeguard)],
              ['Whose data', node.principals],
              ...(node.note ? [['Note', node.note] as [string, ReactNode]] : []),
            ]}
          />
        </SheetDetails>
        <SheetSection title="Flows" count={out.length + inn.length}>
          <SheetList empty="No flows out — the data stays in this system.">{list(inn, 'from')}{list(out, 'to')}</SheetList>
        </SheetSection>
        {node.finding && <FindingBlock org={org} id={node.finding} edits={edits} />}
      </Sheet>
    );
  }
  return null;
}
