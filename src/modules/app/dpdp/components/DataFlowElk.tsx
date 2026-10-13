'use client';

import {
  BaseEdge, Background, BackgroundVariant, Controls, EdgeLabelRenderer, Handle, MarkerType, MiniMap, Position,
  ReactFlow, getSmoothStepPath, useEdgesState, useNodesState,
  type Edge, type EdgeProps, type Node, type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ELK, { type ElkExtendedEdge, type ElkNode } from 'elkjs/lib/elk.bundled.js';
import { createContext, useContext, useEffect, useState } from 'react';
import type { FlowEdge, FlowNode } from '@/modules/app/dpdp/types';
import { ViewTabs } from '@/modules/app/ui/ui';
import {
  C, FILTERS, FlowSheet, KIND_TONE, KindIcon, Legend, SAFEGUARD_TONE, ZONE_TONE, basisTone, graphFor,
  type Filter, type Selected,
} from './DataFlowMap';

/**
 * EXPERIMENT — the data flow map laid out automatically: the same graph the
 * register produces (graphFor), positioned by ELK's layered algorithm and drawn
 * with React Flow. Nothing is hand-placed: the trust zones are nested groups
 * pinned left to right (own systems → India → outside India), flows are routed
 * orthogonally around the boxes, and every flow label is a sized object ELK
 * keeps clear of them. Change the filter and the layout is recomputed for the
 * flows in view. Systems can be dragged; their flows then reroute simply.
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
  points: Point[];
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

  // Trust zones are nested groups, pinned left to right by partition. Two
  // passes: the first finds the order within each zone that crosses fewest
  // flows; the second stacks each zone from the top in that order and keeps it
  // (interactive placement), so the columns line up while ELK still routes the
  // flows and places their labels clear of the boxes.
  const GAP = 24;
  const build = (stack?: Map<string, number>): ElkNode => ({
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      'elk.partitioning.activate': 'true',
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.edgeLabels.placement': 'CENTER',
      'elk.layered.spacing.nodeNodeBetweenLayers': '56',
      'elk.layered.spacing.edgeNodeBetweenLayers': '20',
      'elk.layered.spacing.edgeEdgeBetweenLayers': '12',
      'elk.spacing.nodeNode': String(GAP),
      'elk.spacing.edgeNode': '18',
      'elk.spacing.edgeEdge': '10',
      'elk.spacing.edgeLabel': '4',
      'elk.padding': '[top=24,left=24,bottom=24,right=24]',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      // Pass two keeps pass one's order (children are given in it) and the stacked positions.
      ...(stack
        ? {
          'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
          'elk.layered.crossingMinimization.forceNodeModelOrder': 'true',
          'elk.layered.nodePlacement.strategy': 'INTERACTIVE',
        }
        : { 'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX' }),
    },
    children: zones.map((z, i) => ({
      id: `zone-${z}`,
      ...(stack ? { x: i * 400, y: 0 } : {}),
      layoutOptions: {
        'elk.partitioning.partition': String(i),
        'elk.padding': '[top=64,left=20,bottom=20,right=20]',
      },
      children: visible.filter((n) => n.zone === z)
        .sort((a, b) => (stack ? (stack.get(a.id) ?? 0) - (stack.get(b.id) ?? 0) : 0))
        .map((n) => ({
        id: n.id,
        width: NODE_W,
        height: NODE_H,
        ...(stack ? { x: 20, y: stack.get(n.id) ?? 0 } : {}),
        layoutOptions: { 'elk.portConstraints': 'FIXED_POS' },
        // One port in, one out, at the middle of each side — where React Flow's handles sit.
        ports: [
          { id: `${n.id}:in`, x: 0, y: NODE_H / 2, width: 1, height: 1, layoutOptions: { 'elk.port.side': 'WEST' } },
          { id: `${n.id}:out`, x: NODE_W - 1, y: NODE_H / 2, width: 1, height: 1, layoutOptions: { 'elk.port.side': 'EAST' } },
        ],
      })),
    })),
    edges: shown.map((e) => ({
      id: e.id,
      sources: [`${e.from}:out`],
      targets: [`${e.to}:in`],
      labels: [{ id: `${e.id}:label`, text: e.label, width: labelW(e), height: LABEL_H }],
    })),
  });

  const first = await elk.layout(build());
  const stack = new Map<string, number>();
  for (const z of first.children ?? []) {
    [...(z.children ?? [])].sort((a, b) => (a.y ?? 0) - (b.y ?? 0)).forEach((c, i) => stack.set(c.id, 64 + i * (NODE_H + GAP)));
  }
  const out = await elk.layout(build(stack));

  // Absolute positions: zones sit in the root, systems in their zone. Panels share one top and height.
  const abs = new Map<string, Point>();
  const top = Math.min(...(out.children ?? []).map((z) => z.y ?? 0));
  const bottom = Math.max(...(out.children ?? []).map((z) => (z.y ?? 0) + (z.height ?? 0)));
  const rfNodes: Node[] = [];
  for (const z of out.children ?? []) {
    abs.set(z.id, { x: z.x ?? 0, y: z.y ?? 0 });
    const zone = z.id.replace('zone-', '') as FlowNode['zone'];
    rfNodes.push({
      id: z.id, type: 'zone', position: { x: z.x ?? 0, y: top }, zIndex: -1,
      data: { zone, title: zone === 'internal' ? `${clientShort.toUpperCase()} — ${ZONE_TEXT[zone].title}` : ZONE_TEXT[zone].title, sub: ZONE_TEXT[zone].sub },
      style: { width: z.width, height: bottom - top }, selectable: false, draggable: false, focusable: false,
    } satisfies ZoneNodeT);
  }
  for (const z of out.children ?? []) {
    for (const c of z.children ?? []) {
      const n = visible.find((v) => v.id === c.id)!;
      const p = { x: (z.x ?? 0) + (c.x ?? 0), y: (z.y ?? 0) + (c.y ?? 0) };
      abs.set(c.id, p);
      rfNodes.push({
        id: c.id, type: 'system', position: p,
        data: { node: n, flag: n.finding ? sevColor(n.finding) : null },
      } satisfies SystemNodeT);
    }
  }

  // The India border runs down the middle of the gap before the outside-India panel.
  const abroad = out.children?.find((z) => z.id === 'zone-abroad');
  const beforeAbroad = (out.children ?? []).filter((z) => z.id !== 'zone-abroad').map((z) => (z.x ?? 0) + (z.width ?? 0));
  const borderX = abroad
    ? (beforeAbroad.length ? Math.round((Math.max(...beforeAbroad) + (abroad.x ?? 0)) / 2) : (abroad.x ?? 0) - 28)
    : null;
  if (borderX !== null) {
    rfNodes.push({
      id: 'india-border', type: 'border', position: { x: borderX, y: top - 8 }, zIndex: -1,
      data: { height: bottom - top + 16 }, selectable: false, draggable: false, focusable: false,
    } satisfies BorderNodeT);
  }

  const rfEdges: Edge[] = (out.edges ?? []).map((ee: ElkExtendedEdge) => {
    const e = shown.find((x) => x.id === ee.id)!;
    // Edge coordinates are relative to the edge's container (the root here, but be safe).
    const container = (ee as ElkExtendedEdge & { container?: string }).container;
    const off = container && container !== 'root' ? abs.get(container) ?? { x: 0, y: 0 } : { x: 0, y: 0 };
    const s = ee.sections?.[0];
    const points = s ? [s.startPoint, ...(s.bendPoints ?? []), s.endPoint].map((p) => ({ x: p.x + off.x, y: p.y + off.y })) : [];
    const l = ee.labels?.[0];
    const label = { x: (l?.x ?? 0) + off.x + labelW(e) / 2, y: (l?.y ?? 0) + off.y + LABEL_H / 2, w: labelW(e) };
    const color = e.finding ? sevColor(e.finding) : C.flow;
    let crossing: Point | null = null;
    if (borderX !== null) {
      for (let i = 1; i < points.length; i++) {
        const [a, b] = [points[i - 1], points[i]];
        if ((a.x - borderX) * (b.x - borderX) < 0 && Math.abs(a.y - b.y) < 0.5) crossing = { x: borderX + 1, y: a.y };
      }
    }
    return {
      id: e.id, source: e.from, target: e.to, type: 'flow',
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
      data: { edge: e, points, label, color, crossing },
    } satisfies FlowEdgeT;
  });

  return { nodes: rfNodes, edges: rfEdges };
}

/* ------------------------------------------------------------- the drawing */

function rounded(points: Point[], r = 8) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [p, c, n] = [points[i - 1], points[i], points[i + 1]];
    const d1 = Math.min(r, Math.hypot(c.x - p.x, c.y - p.y) / 2);
    const d2 = Math.min(r, Math.hypot(n.x - c.x, n.y - c.y) / 2);
    const a = { x: c.x - Math.sign(c.x - p.x) * d1, y: c.y - Math.sign(c.y - p.y) * d1 };
    const b = { x: c.x + Math.sign(n.x - c.x) * d2, y: c.y + Math.sign(n.y - c.y) * d2 };
    d += ` L ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`;
  }
  const last = points[points.length - 1];
  return `${d} L ${last.x} ${last.y}`;
}

function FlowEdgeView({ id, data, sourceX, sourceY, targetX, targetY, markerEnd }: EdgeProps<FlowEdgeT>) {
  const trace = useContext(Trace);
  if (!data) return null;
  const { edge, points, color, crossing } = data;
  // Dragged since the layout? Then ELK's route no longer fits; fall back to a simple step.
  const moved = !points.length
    || Math.hypot(points[0].x - sourceX, points[0].y - sourceY) > 4
    || Math.hypot(points[points.length - 1].x - targetX, points[points.length - 1].y - targetY) > 4;
  const [stepPath, lx, ly] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition: Position.Right, targetPosition: Position.Left, borderRadius: 8 });
  const path = moved ? stepPath : rounded(points);
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
              : `Laid out by ELK in ${ms} ms (two passes) · ${nodes.filter((n) => n.type === 'system').length} systems, ${edges.length} flows`}
        </span>
      </div>

      <div className="h-[44rem] bg-[var(--ds-panel)]">
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
              fitViewOptions={{ padding: 0.06 }}
              minZoom={0.3}
              maxZoom={1.75}
              proOptions={{ hideAttribution: false }}
            >
              <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#e3e4e8" />
              <Controls showInteractive={false} position="bottom-left" />
              <MiniMap
                position="bottom-right"
                pannable
                zoomable
                nodeColor={(n) => (n.type === 'zone' ? ZONE_TONE[(n.data as ZoneData).zone].stroke : n.type === 'border' ? 'transparent' : '#c9ccd2')}
                nodeStrokeWidth={0}
                maskColor="rgba(246,247,249,0.7)"
              />
            </ReactFlow>
          )}
        </Trace.Provider>
      </div>

      <Legend />
      <FlowSheet org={org} selected={selected} onSelect={setSelected} />
    </>
  );
}
