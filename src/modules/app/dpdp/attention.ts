import { CHECK_IN, INCIDENTS, ORGS, TASKS } from '@/modules/app/dpdp/mock/data';
import { demoPath } from '@/modules/app/dpdp/routes';
import { parseDisplayDate } from '@/modules/app/dpdp/time';

/**
 * What needs a consultant's attention, derived from the register, the clocks
 * and the tasks — nothing here watches a client system. The header bell, the
 * overview's attention list and the command palette all read this. A live app
 * keeps the derivation and swaps the mock imports for its data layer.
 */

export type Attention = {
  id: string;
  org: string;
  tone: 'danger' | 'warn';
  title: string;
  client: string;
  /** One line of context; time-dependent text only once `now` is known. */
  meta: string;
  href: string;
  /** The owner who has to act, when there is one. */
  owner?: string;
  /** When several owners share the item, how many. */
  owners?: number;
  /** A display date ("15 Oct 2026") the item is due by, for relative time. */
  due?: string;
};

// In the mock, the worked example (Northstar) carries the incident, tasks and
// check-in; DSRs past SLA come from each org's own headline figures.
const NORTHSTAR = ORGS[0];

/** "4h 05m left", "2d 3h left" or "overdue 1h 40m" for an hour-level clock. */
export function clockLeft(ms: number) {
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3_600_000);
  const m = Math.floor((abs % 3_600_000) / 60_000);
  const span = h >= 48 ? `${Math.floor(h / 24)}d ${h % 24}h` : `${h}h ${String(m).padStart(2, '0')}m`;
  return ms <= 0 ? `overdue ${span}` : `${span} left`;
}

/** The open incident whose Board-intimation clock is running, if any. */
export const runningBreach = () => INCIDENTS.find((x) => x.status === 'Open' && x.deadlineIso) ?? null;

export function attentionAt(now: number | null): Attention[] {
  const out: Attention[] = [];
  for (const i of INCIDENTS.filter((x) => x.status === 'Open' && x.deadlineIso)) {
    const ms = new Date(i.deadlineIso!).getTime() - (now ?? 0);
    out.push({
      id: i.id, org: NORTHSTAR.slug, tone: 'danger', title: `${i.id} — Board intimation not sent`, client: NORTHSTAR.name,
      meta: now === null ? '72-hour clock running' : `72-hour clock · ${clockLeft(ms)}`, href: demoPath(NORTHSTAR.slug, 'breach'),
      owner: 'CISO',
    });
  }
  for (const o of ORGS.filter((x) => x.dsrBreaching > 0)) {
    out.push({
      id: `dsr-${o.slug}`, org: o.slug, tone: 'danger', title: `${o.dsrBreaching} DSRs past SLA`, client: o.name,
      meta: 'Requests waiting longer than the committed response time', href: demoPath(o.slug, 'dsr'),
    });
  }
  for (const t of TASKS.filter((x) => x.status === 'Overdue')) {
    out.push({
      id: t.id, org: NORTHSTAR.slug, tone: 'danger', title: `${t.id} overdue — ${t.system}`, client: NORTHSTAR.name,
      meta: t.action, href: demoPath(NORTHSTAR.slug, 'tasks'), owner: t.owner, due: t.due,
    });
  }
  const open = TASKS.filter((x) => x.status === 'Open');
  if (open.length) {
    out.push({
      id: 'tasks-open', org: NORTHSTAR.slug, tone: 'warn', title: `${open.length} tasks awaiting attestation`, client: NORTHSTAR.name,
      meta: 'Owners to do the work in their systems and attest it', href: demoPath(NORTHSTAR.slug, 'tasks'),
      owners: new Set(open.map((t) => t.owner)).size,
      due: [...open].sort((a, b) => (parseDisplayDate(a.due)?.getTime() ?? 0) - (parseDisplayDate(b.due)?.getTime() ?? 0))[0].due,
    });
  }
  out.push({
    id: 'check-in', org: NORTHSTAR.slug, tone: 'warn', title: `${CHECK_IN.label} due`, client: NORTHSTAR.name,
    meta: `Sent to the ${CHECK_IN.sentTo} on ${CHECK_IN.sentOn}`, href: demoPath(NORTHSTAR.slug, 'check-in'),
    owner: CHECK_IN.sentTo, due: CHECK_IN.due,
  });
  return out;
}
