'use client';

import {
  BaseEdge, Background, BackgroundVariant, Controls, EdgeLabelRenderer, Handle, MarkerType, MiniMap, Position,
  ReactFlow, getSmoothStepPath, useEdgesState, useNodesState,
  type Edge, type EdgeProps, type Node, type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ELK, { type ElkNode } from 'elkjs/lib/elk.bundled.js';
import { createContext, useContext, useEffect, useState } from 'react';
import type { FlowEdge, FlowNode } from '@/modules/app/dpdp/types';
import { ViewTabs } from '@/modules/app/ui/ui';
import {
  C, FILTERS, FlowSheet, KIND_TONE, KindIcon, Legend, SAFEGUARD_TONE, ZONE_TONE, basisTone, graphFor,
  type Filter, type Selected,
} from './DataFlowMap';

/**
 * The data flow map (the `flows` page), laid out automatically — the standard
 * (see CLAUDE.md): the
 * same graph the register produces (graphFor). ELK places the systems — one
 * column per trust zone (own systems → India → outside India), each column
 * ordered to cross as few flows as possible and lined up with what it connects
 * to — and React Flow draws them. The flows are drawn here, as on the
 * hand-placed map: S-curves between columns with the label on the curve,
 * straight through a column a flow skips. Change the filter and the layout is
 * recomputed. Zoom is on the + / − buttons only; systems can be dragged.
 */

const NODE_W = 216;
const NODE_H = 60;
const LABEL_H = 30;
const ZONE_ORDER: FlowNode['zone'][] = ['internal', 'india', 'abroad'];
const ZONE_TEXT: Record<FlowNode['zone'], { title: string; sub: string }> = {
  internal: { title: 'OWN SYSTEMS', sub: 'Data Fiduciary · India' },
  india: { title: 'THIRD PARTIES — INDIA', sub: 'Processors and statutory recipients' },
  abroad: { title: 'OUTSIDE INDIA', sub: 'Cross-border transfers' },
};
const labelW = (e: FlowEdge) => Math.round(Math.max(e.label.length * 5.8, e.basis.length * 5.4) + 22);

const elk = new ELK();

type Point = { x: number; y: number };
type SystemData = { node: FlowNode; flag: string | null };
type ZoneData = { zone: FlowNode['zone']; title: string; sub: string };
type FlowData = {
  edge: FlowEdge;
  /** ELK's route (for "moved since layout" checks) and the path actually drawn. */
  points: Point[];
  path: string;
  label: Point & { w: number };
  color: string;
  crossing: Point | null;
};
type SystemNodeT = Node<SystemData, 'system'>;
type ZoneNodeT = Node<ZoneData, 'zone'>;
type BorderNodeT = Node<{ height: number }, 'border'>;
type FlowEdgeT = Edge<FlowData, 'flow'>;

/** Who is related to the system under the pointer — everything else dims. */
const Trace = createContext<{ hover: string | null; nodes: Set<string>; edges: Set<string>; select: (s: Selected) => void }>({
  hover: null, nodes: new Set(), edges: new Set(), select: () => {},
});

/* ------------------------------------------------------------------ layout */

async function layout(org: string, filter: Filter) {
  const { nodes, edges, matches, sevColor, clientShort } = graphFor(org);
  const shown = edges.filter((e) => matches(e, filter));
  const touched = new Set(shown.flatMap((e) => [e.from, e.to]));
  const visible = nodes.filter((n) => filter === 'all' || touched.has(n.id) || (filter === 'finding' && n.finding));
  const zones = ZONE_ORDER.filter((z) => visible.some((n) => n.zone === z));

  // ELK places the systems; we draw the flows. Each trust zone must be one
  // column, but nothing in the flows says so (no flow runs India → abroad), so:
  // own systems are pinned to the first column, outside-India to the last, and
  // a chain of invisible anchors — one per gap, with hidden links to every
  // system of the next zone — forces each zone into its own column. ELK then
  // orders each column to cross as few flows as possible and lines systems up
  // with what they connect to, so most flows run straight; a flow that skips
  // the India column gets a reserved slot between its systems. Labels are not
  // given to ELK (it would route every flow through a slot of its own); they
  // sit on the flow in the gap between columns, nudged apart if they meet.
  const widest = Math.max(160, ...shown.map(labelW));
  const anchors = zones.slice(1).map((z, i) => ({ id: `_anchor${i}`, next: z }));
  const graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
      'elk.edgeRouting': 'POLYLINE',
      // Each gap holds an anchor column, so half the room per spacing: the gap
      // fits the widest label and its curves.
      'elk.layered.spacing.nodeNodeBetweenLayers': String(Math.round((widest + 96) / 2)),
      'elk.spacing.nodeNode': '36',
      'elk.layered.spacing.edgeNodeBetweenLayers': '28',
      'elk.spacing.edgeNode': '28',
      'elk.padding': '[top=88,left=44,bottom=44,right=44]',
    },
    children: [
      ...visible.map((n) => ({
        id: n.id,
        width: NODE_W,
        height: NODE_H,
        layoutOptions: {
          'elk.portConstraints': 'FIXED_POS',
          ...(n.zone === 'internal' ? { 'elk.layered.layering.layerConstraint': 'FIRST' } : {}),
          ...(n.zone === 'abroad' && zones.length > 1 ? { 'elk.layered.layering.layerConstraint': 'LAST' } : {}),
        },
        // One port in, one out, at the middle of each side — where React Flow's handles sit.
        ports: [
          { id: `${n.id}:in`, x: 0, y: NODE_H / 2, width: 1, height: 1, layoutOptions: { 'elk.port.side': 'WEST' } },
          { id: `${n.id}:out`, x: NODE_W - 1, y: NODE_H / 2, width: 1, height: 1, layoutOptions: { 'elk.port.side': 'EAST' } },
        ],
      })),
      ...anchors.map((a) => ({ id: a.id, width: 1, height: 1 })),
    ],
    edges: [
      ...shown.map((e) => ({ id: e.id, sources: [`${e.from}:out`], targets: [`${e.to}:in`] })),
      ...anchors.slice(1).map((a, i) => ({ id: `_chain${i}`, sources: [anchors[i].id], targets: [a.id] })),
      ...anchors.flatMap((a) => visible.filter((n) => n.zone === a.next).map((n) => ({ id: `_pin-${n.id}`, sources: [a.id], targets: [`${n.id}:in`] }))),
    ],
  };

  const out = await elk.layout(graph);
  const placed = new Map((out.children ?? []).filter((c) => !c.id.startsWith('_')).map((c) => [c.id, { x: c.x ?? 0, y: c.y ?? 0 }]));
  const zoneOf = new Map(visible.map((n) => [n.id, n.zone]));
  const colOf = (id: string) => zones.indexOf(zoneOf.get(id)!);

  // ELK decides the order and height of every system; the column spacing is
  // ours, so every gap fits the widest label with room for its curves.
  const PAD = 44;
  const GAP = widest + 88;
  const colX = (k: number) => PAD + k * (NODE_W + GAP);
  const gapMid = (k: number) => colX(k) + NODE_W + GAP / 2;
  const pos = new Map([...placed].map(([id, p]) => [id, { x: colX(colOf(id)), y: p.y }]));
  const col = new Map(zones.map((z, k) => [z, { left: colX(k), right: colX(k) + NODE_W }]));
  // Where ELK put each column, to read its routes at that column.
  const elkColMid = zones.map((z) => {
    const n = visible.find((v) => v.zone === z)!;
    return placed.get(n.id)!.x + NODE_W / 2;
  });

  // Each flow's waypoints: out of the source; for every column it skips, a
  // straight run through the slot ELK reserved there; into the target. Its
  // label sits on the flow in the gap after the source, halfway in height
  // between the flow's two ends there.
  type Geo = { e: FlowEdge; way: Point[]; skips: { left: Point; right: Point }[]; label: Point & { w: number } };
  const routeY = (raw: Point[], x: number) => {
    for (let i = 1; i < raw.length; i++) {
      const [a, b] = [raw[i - 1], raw[i]];
      if ((a.x - x) * (b.x - x) <= 0 && a.x !== b.x) return a.y + ((x - a.x) / (b.x - a.x)) * (b.y - a.y);
    }
    return raw[raw.length - 1]?.y ?? 0;
  };
  const geos: Geo[] = (out.edges ?? []).filter((ee) => !ee.id.startsWith('_')).map((ee) => {
    const e = shown.find((x) => x.id === ee.id)!;
    const sc = ee.sections?.[0];
    const raw = sc ? [sc.startPoint, ...(sc.bendPoints ?? []), sc.endPoint].map((p) => ({ x: p.x, y: p.y })) : [];
    const [cs, ct] = [colOf(e.from), colOf(e.to)];
    const start = { x: colX(cs) + NODE_W, y: pos.get(e.from)!.y + NODE_H / 2 };
    const end = { x: colX(ct), y: pos.get(e.to)!.y + NODE_H / 2 };
    const skips = [];
    for (let k = cs + 1; k < ct; k++) {
      const y = routeY(raw, elkColMid[k]);
      skips.push({ left: { x: colX(k), y }, right: { x: colX(k) + NODE_W, y } });
    }
    const next = skips[0]?.left ?? end;
    return { e, way: [start, end], skips, label: { x: gapMid(cs), y: (start.y + next.y) / 2, w: labelW(e) } };
  });

  // Where a system sends or receives several flows, spread them along its edge
  // (10px apart, in the order of where they go or come from) so their lines
  // and arrowheads do not pile up on one point.
  const spread = (ends: { g: Geo; key: number }[], which: 0 | 1) => {
    ends.sort((a, b) => a.key - b.key).forEach(({ g }, i) => {
      g.way[which] = { ...g.way[which], y: g.way[which].y + (i - (ends.length - 1) / 2) * 10 };
    });
  };
  for (const n of visible) {
    spread(geos.filter((g) => g.e.from === n.id).map((g) => ({ g, key: g.way[1].y })), 0);
    spread(geos.filter((g) => g.e.to === n.id).map((g) => ({ g, key: g.way[0].y })), 1);
  }
  for (const g of geos) g.label.y = (g.way[0].y + (g.skips[0]?.left ?? g.way[1]).y) / 2;

  // Labels in the same gap must not touch: sort by height, push apart.
  for (let k = 0; k < zones.length; k++) {
    const inGap = geos.filter((g) => colOf(g.e.from) === k).sort((a, b) => a.label.y - b.label.y);
    for (let i = 1; i < inGap.length; i++) {
      const min = inGap[i - 1].label.y + LABEL_H + 14;
      if (inGap[i].label.y < min) inGap[i].label.y = min;
    }
  }

  // Panels: one per column, sharing a top and bottom that clear every box and label.
  const ys = [
    ...[...pos.values()].flatMap((p) => [p.y, p.y + NODE_H]),
    ...geos.flatMap((g) => [g.label.y - LABEL_H / 2, g.label.y + LABEL_H / 2]),
  ];
  const top = Math.min(...ys) - 64;
  const bottom = Math.max(...ys) + 24;
  const rfNodes: Node[] = zones.map((zone) => {
    const c = col.get(zone)!;
    return {
      id: `zone-${zone}`, type: 'zone', position: { x: c.left - 20, y: top }, zIndex: -1,
      data: { zone, title: zone === 'internal' ? `${clientShort.toUpperCase()} — ${ZONE_TEXT[zone].title}` : ZONE_TEXT[zone].title, sub: ZONE_TEXT[zone].sub },
      style: { width: c.right - c.left + 40, height: bottom - top }, selectable: false, draggable: false, focusable: false,
    } satisfies ZoneNodeT;
  });
  for (const n of visible) {
    rfNodes.push({
      id: n.id, type: 'system', position: pos.get(n.id)!,
      data: { node: n, flag: n.finding ? sevColor(n.finding) : null },
    } satisfies SystemNodeT);
  }

  // The India border runs down the middle of the gap before the outside-India column.
  const ai = zones.indexOf('abroad');
  const borderX = ai > 0 ? gapMid(ai - 1) : ai === 0 ? col.get('abroad')!.left - 40 : null;
  if (borderX !== null) {
    rfNodes.push({
      id: 'india-border', type: 'border', position: { x: borderX, y: top - 8 }, zIndex: -1,
      data: { height: bottom - top + 16 }, selectable: false, draggable: false, focusable: false,
    } satisfies BorderNodeT);
  }

  // Draw: S-curve into the label, straight through it; for each skipped column
  // an S-curve into its slot and straight through; an S-curve into the target.
  const rfEdges: Edge[] = geos.map(({ e, way, skips, label }) => {
    const color = e.finding ? sevColor(e.finding) : C.flow;
    const [start, end] = way;
    const L = { x: label.x - label.w / 2, y: label.y };
    const R = { x: label.x + label.w / 2, y: label.y };
    const stops = [start, L, R, ...skips.flatMap((sk) => [sk.left, sk.right]), end];
    let d = `M ${start.x} ${start.y}`;
    const drawn: Point[] = [start];
    for (let i = 1; i < stops.length; i++) {
      const [a, b] = [stops[i - 1], stops[i]];
      if (Math.abs(a.y - b.y) < 1) {
        d += ` L ${b.x} ${b.y}`;
        drawn.push(b);
      } else {
        const c = sCurve(a, b);
        d += ` C ${c[1].x} ${c[1].y} ${c[2].x} ${c[2].y} ${b.x} ${b.y}`;
        drawn.push(...bezierPoints(c).slice(1));
      }
    }
    let crossing: Point | null = null;
    if (borderX !== null) {
      for (let i = 1; i < drawn.length; i++) {
        const [a, b] = [drawn[i - 1], drawn[i]];
        if ((a.x - borderX) * (b.x - borderX) <= 0 && a.x !== b.x) {
          crossing = { x: borderX, y: a.y + ((borderX - a.x) / (b.x - a.x)) * (b.y - a.y) };
          break;
        }
      }
    }
    return {
      id: e.id, source: e.from, target: e.to, type: 'flow',
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
      data: { edge: e, points: [start, end], path: d, label, color, crossing },
    } satisfies FlowEdgeT;
  });

  return { nodes: rfNodes, edges: rfEdges, size: { w: colX(zones.length - 1) + NODE_W + PAD, h: bottom - top + 48 } };
}

/* ------------------------------------------------------------- the drawing */

/** A horizontal S-curve from a to b: leaves and arrives level, like the hand-placed map's flows. */
function sCurve(a: Point, b: Point): [Point, Point, Point, Point] {
  const dx = Math.max(16, (b.x - a.x) / 2);
  return [a, { x: a.x + dx, y: a.y }, { x: b.x - dx, y: b.y }, b];
}

/** Points along one cubic Bézier. */
function bezierPoints([p0, p1, p2, p3]: [Point, Point, Point, Point], n = 24): Point[] {
  const out: Point[] = [];
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const u = 1 - t;
    out.push({
      x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    });
  }
  return out;
}

function FlowEdgeView({ id, data, sourceX, sourceY, targetX, targetY, markerEnd }: EdgeProps<FlowEdgeT>) {
  const trace = useContext(Trace);
  if (!data) return null;
  const { edge, points, color, crossing } = data;
  // Dragged since the layout? Then ELK's route no longer fits; fall back to a simple step.
  // (Spread ports sit up to ~20px from the handle centre, so allow for that.)
  const moved = !points.length
    || Math.hypot(points[0].x - sourceX, points[0].y - sourceY) > 24
    || Math.hypot(points[points.length - 1].x - targetX, points[points.length - 1].y - targetY) > 24;
  const [stepPath, lx, ly] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition: Position.Right, targetPosition: Position.Left, borderRadius: 8 });
  const path = moved ? stepPath : data.path;
  const label = moved ? { x: lx, y: ly } : data.label;
  const dim = trace.hover !== null && !trace.edges.has(id);
  const lit = trace.hover !== null && !dim;
  const stroke = edge.finding ? color : lit ? C.accent : color;
  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{ stroke, strokeWidth: edge.finding ? 1.75 : 1.4, strokeDasharray: edge.finding ? '6 4' : undefined, opacity: dim ? 0.15 : 1, transition: 'opacity .15s' }}
      />
      <EdgeLabelRenderer>
        {crossing && !moved && (
          <div
            aria-hidden
            className="pointer-events-none absolute flex h-4 w-4 items-center justify-center rounded-full border bg-white"
            style={{ transform: `translate(-50%, -50%) translate(${crossing.x}px, ${crossing.y}px)`, borderColor: C.brand, opacity: dim ? 0.15 : 1 }}
          >
            <svg viewBox="-6 -6 12 12" className="h-2.5 w-2.5"><path d="M-4 0h8M0 -4c-2 2.4-2 5.6 0 8M0 -4c2 2.4 2 5.6 0 8" fill="none" stroke={C.accent} strokeWidth="1" /></svg>
          </div>
        )}
        <button
          type="button"
          onClick={() => trace.select({ type: 'edge', id })}
          className="nodrag nopan absolute rounded-md border bg-white px-2 py-[3px] text-center leading-tight"
          style={{
            transform: `translate(-50%, -50%) translate(${label.x}px, ${label.y}px)`,
            width: data.label.w,
            borderColor: edge.finding ? color : '#bfe3f6',
            pointerEvents: 'all',
            opacity: dim ? 0.15 : 1,
            transition: 'opacity .15s',
          }}
          aria-label={`${edge.label}, basis ${edge.basis}`}
        >
          <span className="block truncate text-[10.5px] font-medium" style={{ color: C.ink }}>{edge.label}</span>
          <span className="block truncate text-[9.5px] font-semibold" style={{ color: basisTone(edge.basis) }}>{edge.basis}</span>
        </button>
      </EdgeLabelRenderer>
    </>
  );
}

const HANDLE = '!h-1 !w-1 !min-h-0 !min-w-0 !border-0 !bg-transparent';

function SystemNodeView({ data }: NodeProps<SystemNodeT>) {
  const trace = useContext(Trace);
  const n = data.node;
  const dim = trace.hover !== null && !trace.nodes.has(n.id);
  const strong = n.safeguard !== 'Internal' && n.safeguard !== 'Statutory' && n.safeguard !== 'Exempt';
  return (
    <div
      className="relative flex items-center gap-2.5 rounded-lg border bg-white px-3 transition-opacity"
      style={{ width: NODE_W, height: NODE_H, borderColor: trace.hover === n.id ? C.text3 : C.line, opacity: dim ? 0.25 : 1 }}
    >
      <Handle type="target" position={Position.Left} className={HANDLE} isConnectable={false} />
      {data.flag && <span aria-hidden className="absolute left-1.5 top-2.5 bottom-2.5 w-[2.5px] rounded-full" style={{ background: data.flag }} />}
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: KIND_TONE[n.kind].bg }}>
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden><KindIcon kind={n.kind} x={0} y={0} color={KIND_TONE[n.kind].fg} /></svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-[12.5px] font-semibold" style={{ color: C.ink }}>{n.label}</span>
          <span className="rounded px-1 text-[9.5px] font-bold" style={{ background: n.region === 'IN' ? '#e7f6ee' : '#fff1dc', color: n.region === 'IN' ? C.ok : C.warn }}>{n.region}</span>
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 truncate text-[11px]">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SAFEGUARD_TONE[n.safeguard] }} />
          <span style={{ color: SAFEGUARD_TONE[n.safeguard], fontWeight: strong ? 600 : 400 }}>{n.safeguard}</span>
          <span className="truncate" style={{ color: C.text3 }}>· {n.principals}</span>
        </span>
      </span>
      <Handle type="source" position={Position.Right} className={HANDLE} isConnectable={false} />
    </div>
  );
}

function ZoneNodeView({ data }: NodeProps<ZoneNodeT>) {
  const t = ZONE_TONE[data.zone];
  return (
    <div
      className="h-full w-full rounded-xl border"
      style={{ background: t.fill, borderColor: t.stroke, borderStyle: data.zone === 'internal' ? 'solid' : 'dashed' }}
    >
      <p className="flex items-center gap-1.5 px-5 pt-4 text-[10.5px] font-bold tracking-[0.06em]" style={{ color: t.title }}>
        <span aria-hidden className="h-[11px] w-[3px] rounded-full" style={{ background: t.title }} />
        {data.title}
      </p>
      <p className="px-5 pt-0.5 text-[10.5px]" style={{ color: C.text3 }}>{data.sub}</p>
    </div>
  );
}

function BorderNodeView({ data }: NodeProps<BorderNodeT>) {
  return (
    <div className="pointer-events-none relative" style={{ height: data.height, width: 2 }}>
      <div className="absolute inset-y-0 left-0 border-l-[1.25px] border-dashed" style={{ borderColor: C.brand }} />
      <span
        className="absolute bottom-6 left-0 -translate-x-1/2 rotate-180 rounded-full border bg-white px-1.5 py-1 text-[9.5px] font-semibold [writing-mode:vertical-rl]"
        style={{ borderColor: C.brand, color: C.accent }}
      >
        INDIA BORDER
      </span>
    </div>
  );
}

const nodeTypes = { system: SystemNodeView, zone: ZoneNodeView, border: BorderNodeView };
const edgeTypes = { flow: FlowEdgeView };

/* ------------------------------------------------------------------ the page */

export default function DataFlowElk({ org }: { org: string }) {
  const { edges: FLOW_EDGES, matches } = graphFor(org);
  const [filter, setFilter] = useState<Filter>('all');
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [ready, setReady] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 1000, h: 600 });
  const [ms, setMs] = useState<number | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<Selected>(null);

  // Lay out whenever the filter changes. ELK is async, so state is set in the
  // promise callback, never in the effect body.
  useEffect(() => {
    let live = true;
    const t0 = performance.now();
    layout(org, filter)
      .then((r) => {
        if (!live) return;
        setNodes(r.nodes);
        setEdges(r.edges);
        setMs(Math.round(performance.now() - t0));
        setSize(r.size);
        setFailed(null);
        setReady(filter);
      })
      .catch((err: unknown) => {
        if (live) setFailed(err instanceof Error ? err.message : String(err));
      });
    return () => {
      live = false;
    };
  }, [org, filter, setNodes, setEdges]);

  const related = hover ? FLOW_EDGES.filter((e) => matches(e, filter) && (e.from === hover || e.to === hover)) : [];
  const trace = {
    hover,
    edges: new Set(related.map((e) => e.id)),
    nodes: new Set([...(hover ? [hover] : []), ...related.flatMap((e) => [e.from, e.to])]),
    select: setSelected,
  };
  const count = (f: Filter) => FLOW_EDGES.filter((e) => matches(e, f)).length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ds-border)] px-4 py-3 sm:px-5">
        <ViewTabs
          label="Filter flows"
          views={FILTERS}
          active={filter}
          counts={Object.fromEntries(FILTERS.map((f) => [f.id, count(f.id)]))}
          onChange={(id) => setFilter(id as Filter)}
        />
        <span className="text-[12px] text-[var(--ds-text-3)]">
          {failed ? <span className="text-[var(--ds-danger)]">Layout failed — {failed.slice(0, 120)}</span>
            : ms === null ? 'Laying out…'
              : `Laid out by ELK in ${ms} ms · ${nodes.filter((n) => n.type === 'system').length} systems, ${edges.length} flows`}
        </span>
      </div>

      {/* The canvas takes the diagram's own proportions, so there is no empty band around it. */}
      <div className="max-h-[56rem] min-h-[22rem] w-full bg-[var(--ds-panel)]" style={{ aspectRatio: `${size.w} / ${size.h}` }}>
        <Trace.Provider value={trace}>
          {ready === filter && (
            <ReactFlow
              key={filter}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodeMouseEnter={(_, n) => n.type === 'system' && setHover(n.id)}
              onNodeMouseLeave={() => setHover(null)}
              onNodeClick={(_, n) => n.type === 'system' && setSelected({ type: 'node', id: n.id })}
              onEdgeClick={(_, e) => setSelected({ type: 'edge', id: e.id })}
              nodesConnectable={false}
              elementsSelectable={false}
              fitView
              fitViewOptions={{ padding: 0.02 }}
              minZoom={0.3}
              maxZoom={1.75}
              // Zoom only with the + / − buttons: the wheel, a trackpad pinch and a
              // double-click are left to the page, so scrolling never zooms the map.
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              panOnScroll={false}
              preventScrolling={false}
              proOptions={{ hideAttribution: false }}
            >
              <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#e3e4e8" />
              <Controls showInteractive={false} position="bottom-left" />
              {/* A minimap only earns its space on a map too big to read at once. */}
              {nodes.filter((n) => n.type === 'system').length > 16 && (
              <MiniMap
                position="bottom-right"
                pannable
                zoomable
                nodeColor={(n) => (n.type === 'zone' ? ZONE_TONE[(n.data as ZoneData).zone].stroke : n.type === 'border' ? 'transparent' : '#c9ccd2')}
                nodeStrokeWidth={0}
                maskColor="rgba(246,247,249,0.7)"
              />
              )}
            </ReactFlow>
          )}
        </Trace.Provider>
      </div>

      <Legend />
      <FlowSheet org={org} selected={selected} onSelect={setSelected} />
    </>
  );
}
