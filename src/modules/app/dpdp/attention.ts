import { ORGS, clientData } from '@/modules/app/dpdp/mock/clients';
import { demoPath } from '@/modules/app/dpdp/routes';
import { lateRequests } from '@/modules/app/dpdp/sla';
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

/** "4h 05m left", "2d 3h left" or "overdue 1h 40m" for an hour-level clock. */
export function clockLeft(ms: number) {
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3_600_000);
  const m = Math.floor((abs % 3_600_000) / 60_000);
  const span = h >= 48 ? `${Math.floor(h / 24)}d ${h % 24}h` : `${h}h ${String(m).padStart(2, '0')}m`;
  return ms <= 0 ? `overdue ${span}` : `${span} left`;
}

const time = (d?: string) => (d ? parseDisplayDate(d)?.getTime() ?? 0 : 0);

/** One client's items: running clocks, late requests, overdue and open tasks, a due check-in. */
function forClient(slug: string, now: number | null): Attention[] {
  const o = ORGS.find((x) => x.slug === slug)!;
  const d = clientData(slug);
  const out: Attention[] = [];
  for (const i of d.incidents.filter((x) => x.status === 'Open' && x.deadlineIso)) {
    const ms = new Date(i.deadlineIso!).getTime() - (now ?? 0);
    out.push({
      id: i.id, org: slug, tone: 'danger', title: `${i.id} — Board intimation not sent`, client: o.name,
      meta: now === null ? '72-hour clock running' : `72-hour clock · ${clockLeft(ms)}`, href: demoPath(slug, 'breach'),
      owner: 'CISO',
    });
  }
  const late = lateRequests(d.dsrs, d.privacyCentre?.responseDays ?? 30, now).map((w) => w.dsr);
  if (late.length) {
    out.push({
      id: `dsr-${slug}`, org: slug, tone: 'danger', title: `${late.length} request${late.length === 1 ? '' : 's'} past the response window`, client: o.name,
      meta: late.map((x) => `${x.id} ${x.type.toLowerCase()}`).join(', '), href: demoPath(slug, 'dsr'),
    });
  }
  for (const t of d.tasks.filter((x) => x.status === 'Overdue')) {
    out.push({
      id: t.id, org: slug, tone: 'danger', title: `${t.id} overdue — ${t.system}`, client: o.name,
      meta: t.action, href: demoPath(slug, 'tasks'), owner: t.owner, due: t.due,
    });
  }
  const open = d.tasks.filter((x) => x.status === 'Open');
  if (open.length) {
    out.push({
      id: `tasks-${slug}`, org: slug, tone: 'warn', title: `${open.length} task${open.length === 1 ? '' : 's'} awaiting attestation`, client: o.name,
      meta: 'Owners to do the work in their systems and attest it', href: demoPath(slug, 'tasks'),
      owners: new Set(open.map((t) => t.owner)).size,
      due: [...open].sort((a, b) => time(a.due) - time(b.due))[0].due,
    });
  }
  if (d.checkIn) {
    out.push({
      id: `check-in-${slug}`, org: slug, tone: 'warn', title: `${d.checkIn.label} due`, client: o.name,
      meta: `Sent to the ${d.checkIn.sentTo} on ${d.checkIn.sentOn}`, href: demoPath(slug, 'check-in'),
      owner: d.checkIn.sentTo, due: d.checkIn.due,
    });
  }
  return out;
}

/** Everything that needs attention across every client — the header bell and the palette. */
export function attentionAt(now: number | null): Attention[] {
  return ORGS.flatMap((o) => forClient(o.slug, now));
}

/**
 * One client's worklist for the overview: what needs attention, then its
 * high-severity findings — one list, ordered by what is due first.
 */
export function workFor(slug: string, now: number | null): Attention[] {
  const o = ORGS.find((x) => x.slug === slug)!;
  const findings: Attention[] = clientData(slug).gaps
    .filter((g) => g.severity === 'High')
    .map((g) => ({
      id: g.id, org: slug, tone: 'warn', title: g.title, client: o.name,
      meta: `${g.id} · high-severity finding`, href: demoPath(slug, 'gaps'), owner: g.owner, due: g.due,
    }));
  const urgent = forClient(slug, now);
  return [...urgent, ...findings.sort((a, b) => time(a.due) - time(b.due))];
}

