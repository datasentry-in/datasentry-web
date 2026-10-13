import type { Activity, ClientData, FlowEdge, FlowNode, Gap, Party, Region } from './types';

/**
 * The data flow map, generated from the register — never authored. Systems and
 * recipients (`parties`) become boxes, the RoPA's transfers become flows, and:
 *
 *  - a box's trust zone follows from where it is hosted and what it is;
 *  - a flow's lawful basis is its RoPA activity's, read live;
 *  - findings on flows come from rules evaluated here (no DPA, no lawful basis),
 *    reusing the gap report's finding when it already records the same thing.
 *
 * Register edits (`RegisterEdits`, kept per session by registerEdits.ts) are
 * applied first, so changing a basis, a hosting country or a contract in the
 * RoPA changes the map. A live app keeps this function and swaps the edits for
 * its data layer.
 */

export type RegisterEdits = {
  activities: Record<string, Partial<Pick<Activity, 'basis' | 'retention' | 'provenance'>>>;
  parties: Record<string, Partial<Pick<Party, 'region' | 'safeguard'>>>;
};
export const NO_EDITS: RegisterEdits = { activities: {}, parties: {} };

export const REGIONS: Region[] = ['IN', 'SG', 'US', 'UK', 'IE', 'DE'];
export const REGION_NAME: Record<Region, string> = {
  IN: 'India', SG: 'Singapore', US: 'United States', UK: 'United Kingdom', IE: 'Ireland', DE: 'Germany',
};
export const CONTRACTS: Party['safeguard'][] = ['DPA in place', 'Terms only', 'No DPA'];

/** A party's trust zone: anything hosted outside India is a cross-border recipient. */
export const zoneFor = (p: Pick<Party, 'kind' | 'region'>): FlowNode['zone'] =>
  p.region !== 'IN' ? 'abroad' : p.kind === 'system' ? 'internal' : 'india';

/** The register with this session's edits applied. */
export function applyEdits(d: Pick<ClientData, 'activities' | 'parties'>, edits: RegisterEdits = NO_EDITS) {
  return {
    activities: d.activities.map((a) => (edits.activities[a.id] ? { ...a, ...edits.activities[a.id] } : a)),
    parties: d.parties.map((p) => (edits.parties[p.id] ? { ...p, ...edits.parties[p.id] } : p)),
  };
}

/** The rules a flow is checked against, in order; the first that fires flags it. */
const RULES: {
  fires: (a: Activity, to: Party) => boolean;
  severity: Gap['severity'];
  provision: string;
  /** A gap-report finding that already records this, if any. */
  same: (g: Gap) => boolean;
  title: (a: Activity, to: Party) => string;
  detail: (a: Activity, to: Party) => string;
}[] = [
  {
    fires: (_a, to) => to.safeguard === 'No DPA',
    severity: 'High',
    provision: 's.8(2)',
    same: (g) => g.provision.includes('s.8(2)'),
    title: (_a, to) => `${to.label} receives personal data without a data processing agreement`,
    detail: (a, to) => `${a.id} sends personal data to ${to.label}, and the register records no data processing agreement with it.`,
  },
  {
    fires: (a) => a.basis === 'Not determined',
    severity: 'Medium',
    provision: 's.6 read with s.4',
    same: (g) => /s\.[46]\b/.test(g.provision),
    title: (a, to) => `No lawful basis on record for ${a.name.toLowerCase()} data sent to ${to.label}`,
    detail: (a) => `${a.id}'s lawful basis is recorded as Not determined, so nothing it sends has a basis on record.`,
  },
];

export function flowGraph(d: Pick<ClientData, 'activities' | 'parties' | 'transfers' | 'gaps'>, edits: RegisterEdits = NO_EDITS) {
  const { activities, parties } = applyEdits(d, edits);
  const activity = new Map(activities.map((a) => [a.id, a]));
  const party = new Map(parties.map((p) => [p.id, p]));
  const raised: Gap[] = [];

  const edges: FlowEdge[] = d.transfers.map((t) => {
    const a = activity.get(t.activity)!;
    const to = party.get(t.to)!;
    let finding = t.finding;
    const rule = RULES.find((r) => r.fires(a, to));
    if (rule) {
      const known = d.gaps.find((g) => g.activity.startsWith(a.id) && rule.same(g));
      if (known) finding = known.id;
      else {
        const id = `New · ${a.id}`;
        if (!raised.some((g) => g.id === id)) {
          raised.push({
            id, severity: rule.severity, status: 'Open', title: rule.title(a, to), detail: rule.detail(a, to),
            provision: rule.provision, activity: `${a.id} ${a.name}`, owner: 'Legal & Compliance', due: '—', evidence: null,
          });
        }
        finding = id;
      }
    }
    return {
      id: t.id, from: t.from, to: t.to, activity: `${a.id} ${a.name}`, label: t.label,
      categories: t.categories, principals: t.principals, basis: a.basis, finding,
    };
  });

  // A recipient carries the finding on what it receives; a party's own recorded finding comes first.
  const nodes: FlowNode[] = parties.map((p) => ({
    ...p,
    zone: zoneFor(p),
    finding: p.finding ?? edges.find((e) => e.to === p.id && e.finding)?.finding,
  }));

  return { nodes, edges, gaps: [...d.gaps, ...raised] };
}

/** How many register edits are in play — for "showing N edits" and a reset. */
export const editCount = (e: RegisterEdits) => Object.keys(e.activities).length + Object.keys(e.parties).length;
