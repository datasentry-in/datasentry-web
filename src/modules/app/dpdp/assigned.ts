import { ORGS, clientData } from '@/modules/app/dpdp/mock/clients';
import { demoPath } from '@/modules/app/dpdp/routes';
import { responseWindow } from '@/modules/app/dpdp/sla';
import { formatDate } from '@/modules/app/dpdp/time';
import { REQUEST_STATUS } from '@/modules/app/dpdp/workStatus';
import type { WorkStatus } from '@/modules/app/ui/WorkRow';

/**
 * Assigned to me: everything on the consultant's side, across clients — the requests
 * to answer, the Board intimation to send, artefacts to review, check-ins to
 * read, interviews to run and attested fixes to look at on the next
 * walkthrough. Owners' work in their own systems is theirs (tasks); this is the
 * consultant's. Derived from each client's data; a live app adds assignment.
 */

export type WorkKind = 'Request' | 'Board intimation' | 'Evidence' | 'Check-in' | 'Discovery' | 'Walkthrough';

export type AssignedItem = {
  id: string;
  org: string;
  client: string;
  kind: WorkKind;
  title: string;
  ref?: string;
  /** What it concerns, in a few words — shown after the title. */
  context?: string;
  href: string;
  /** A display date ("15 Nov 2026"), when there is one. */
  due?: string;
  status: WorkStatus;
  statusLabel: string;
};

export function assignedAt(now: number | null): AssignedItem[] {
  const out: AssignedItem[] = [];
  for (const o of ORGS) {
    const d = clientData(o.slug);
    const base = { org: o.slug, client: o.name };
    const days = d.privacyCentre?.responseDays ?? 30;

    for (const i of d.incidents.filter((x) => x.status === 'Open')) {
      out.push({
        ...base, id: `${o.slug}:${i.id}`, kind: 'Board intimation', ref: i.id, title: `Send the Board intimation for ${i.id}`,
        context: `${i.affected} data principals affected`, href: demoPath(o.slug, 'breach', 'intimation'), due: i.deadline,
        status: 'overdue', statusLabel: '72-hour clock running',
      });
    }
    for (const r of d.dsrs.filter((x) => x.status !== 'Closed')) {
      const w = responseWindow(r.received, days, now ?? 0);
      const late = now !== null && w.late;
      out.push({
        ...base, id: `${o.slug}:${r.id}`, kind: 'Request', ref: r.id, title: `Respond to ${r.principal} — ${r.type.toLowerCase()}`,
        context: r.relationship, href: demoPath(o.slug, 'dsr'), due: formatDate(new Date(w.end)),
        status: late ? 'overdue' : REQUEST_STATUS[r.status], statusLabel: late ? `${r.status} — past the response window` : r.status,
      });
    }
    if (d.checkIn) {
      out.push({
        ...base, id: `${o.slug}:check-in`, kind: 'Check-in', title: `Read the ${d.checkIn.label} answers`,
        context: `sent to the ${d.checkIn.sentTo}`, href: demoPath(o.slug, 'check-in'), due: d.checkIn.due,
        status: 'waiting', statusLabel: 'Waiting on the client',
      });
    }
    if (!d.registerBuilt) {
      out.push({
        ...base, id: `${o.slug}:discovery`, kind: 'Discovery', title: 'Run the discovery interview',
        context: 'nothing is on the register yet', href: demoPath(o.slug, 'discovery'), status: 'todo', statusLabel: 'Not started',
      });
    }
    for (const e of d.evidence.filter((x) => x.status === 'Review pending' || x.status === 'Incomplete')) {
      out.push({
        ...base, id: `${o.slug}:ev:${e.name}`, kind: 'Evidence', title: `${e.status === 'Review pending' ? 'Review' : 'Complete'} the ${e.name}`,
        context: e.detail, href: demoPath(o.slug, 'evidence'),
        status: e.status === 'Review pending' ? 'progress' : 'todo', statusLabel: e.status,
      });
    }
    for (const t of d.tasks.filter((x) => x.status === 'Attested')) {
      out.push({
        ...base, id: `${o.slug}:obs:${t.id}`, kind: 'Walkthrough', ref: t.id, title: `Look at ${t.id} on the next walkthrough`,
        context: `${t.system} — attested, not yet observed`, href: demoPath(o.slug, 'walkthrough'), due: d.walkthrough?.next,
        status: 'todo', statusLabel: 'Attested — not yet observed',
      });
    }
  }
  return out;
}
