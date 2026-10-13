'use client';

import { ORGS, clientData } from '@/modules/app/dpdp/mock/clients';
import { lateRequests } from '@/modules/app/dpdp/sla';
import { useNow } from '@/modules/app/dpdp/useNow';
import { Button, Fact, Facts, NextStep, Stat, Tag } from '@/modules/app/ui/ui';

/**
 * Everything that depends on whether a request is past its response window.
 * Lateness is worked out from the live clock (sla.ts), so these render on the
 * client; before the clock is known they show the count without a verdict.
 */

const windowDays = (org: string) => clientData(org).privacyCentre?.responseDays ?? 30;

function useLate(org: string) {
  const now = useNow(60_000);
  const d = clientData(org);
  return { now, d, late: lateRequests(d.dsrs, windowDays(org), now) };
}

/** The overview's "Open requests" cell. */
export function RequestsStat({ org }: { org: string }) {
  const { now, d, late } = useLate(org);
  const open = d.dsrs.filter((r) => r.status !== 'Closed').length;
  return (
    <Stat
      label="Open requests"
      value={open}
      note={now === null ? 'checking response windows' : late.length ? `${late.length} past the response window` : 'none past the window'}
      tone={late.length ? 'bad' : 'plain'}
    />
  );
}

/** The portfolio's "Open requests" cell, across every client. */
export function PortfolioRequestsStat() {
  const now = useNow(60_000);
  const open = ORGS.reduce((n, o) => n + o.dsrOpen, 0);
  const late = now === null ? 0 : ORGS.reduce((n, o) => n + lateRequests(clientData(o.slug).dsrs, windowDays(o.slug), now).length, 0);
  return (
    <Stat
      label="Open requests"
      value={open}
      note={now === null ? 'checking response windows' : late ? `${late} past the response window` : 'none past the window'}
      tone={late ? 'bad' : 'plain'}
    />
  );
}

/** The portfolio row's request tag. */
export function RequestsTag({ org }: { org: string }) {
  const { d, late } = useLate(org);
  const open = d.dsrs.filter((r) => r.status !== 'Closed').length;
  if (!open) return null;
  return <Tag tone={late.length ? 'alert' : 'dark'}>{open} open DSR{late.length ? ` · ${late.length} late` : ''}</Tag>;
}

/** The request desk's properties row and next step. */
export function DsrHeader({ org }: { org: string }) {
  const { d, late } = useLate(org);
  const open = d.dsrs.filter((r) => r.status !== 'Closed');
  const closed = d.dsrs.filter((r) => r.status === 'Closed');
  const conflicts = d.dsrs.filter((r) => r.conflicts?.length).length;
  const grievance = d.privacyCentre?.grievanceOfficer ?? null;
  const focus = d.dsrFocus ? d.dsrs.find((r) => r.id === d.dsrFocus) : undefined;

  return (
    <>
      <Facts>
        <Fact label="Open requests" value={open.length} note={late.length ? `${late.length} past the response window` : 'none past the response window'} tone={late.length ? 'bad' : open.length ? 'warn' : 'plain'} />
        <Fact label="Closed this quarter" value={closed.length} note="the log is the evidence" tone="good" />
        <Fact label="Erasure conflicts" value={conflicts} note="statutory retention applies" tone="bad" />
        <Fact label="Grievance contact" value={grievance ?? 'None'} note={grievance ? 'published on the privacy centre' : 'no one named to handle complaints (s.13)'} tone={grievance ? 'good' : 'bad'} />
      </Facts>

      {focus ? (
        <NextStep
          title={`Send ${focus.principal} a partial-erasure response`}
          action={<Button as="link" href="#dsr-focus">Review the drafted response</Button>}
        >
          Four of her records are kept by law. The response has to name each one and the statute that keeps it — the
          draft below already does.
        </NextStep>
      ) : late.length ? (
        <NextStep title={`Respond to ${late[0].dsr.principal} — ${-late[0].daysLeft} days past the response window`}>
          {late.map((w) => `${w.dsr.id} (${w.dsr.type.toLowerCase()}, received ${w.dsr.received} by ${w.dsr.channel?.toLowerCase() ?? 'email'})`).join(' · ')}.
          Each arrived at the published email address and was forwarded into the desk; the window ran from the day it arrived.
        </NextStep>
      ) : null}
    </>
  );
}
