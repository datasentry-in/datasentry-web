'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { auditFor, clientData } from '@/modules/app/dpdp/mock/clients';
import { demoPath } from '@/modules/app/dpdp/routes';
import { responseWindow } from '@/modules/app/dpdp/sla';
import type { Dsr } from '@/modules/app/dpdp/types';
import { useNow } from '@/modules/app/dpdp/useNow';
import { REQUEST_STATUS, TASK_LABEL, TASK_STATUS } from '@/modules/app/dpdp/workStatus';
import { useMenu, type MenuItem } from '@/modules/app/ui/Menu';
import Sheet, { SheetSection } from '@/modules/app/ui/Sheet';
import { useToast } from '@/modules/app/ui/Toast';
import { useListKeys } from '@/modules/app/ui/useListKeys';
import { StatusIcon, WorkList, WorkRow } from '@/modules/app/ui/WorkRow';
import { Skeleton } from '@/modules/app/ui/ui';
import AuditTimeline from './AuditTimeline';
import SlaBar from './SlaBar';

/**
 * Open data principal requests as a worklist: status, reference, what was
 * asked and by whom, and the response window left — red once it has run out.
 * Lateness is live from the clock (sla.ts), never stored. Each request opens
 * beside the list with its window, its fulfilment tasks and its history.
 */
export default function RequestList({ org }: { org: string }) {
  const d = clientData(org);
  const days = d.privacyCentre?.responseDays ?? 30;
  const now = useNow(60_000);
  const [openId, setOpenId] = useState<string | null>(null);
  // Status changes made here (s, the row menu); a live app writes them to the request and its audit trail.
  const [changed, setChanged] = useState<Record<string, Dsr['status']>>({});
  const toast = useToast();
  const menu = useMenu();
  const list = useRef<HTMLUListElement>(null);
  const rows = d.dsrs.filter((r) => r.status !== 'Closed').map((r) => (changed[r.id] ? { ...r, status: changed[r.id] } : r));
  const open = rows.find((r) => r.id === openId) ?? null;
  const statusItems = (r: Dsr): MenuItem[] => [
    { heading: 'Status' },
    ...(['New', 'In progress', 'Awaiting client', 'Closed'] as Dsr['status'][]).map((s) => ({
      label: s,
      icon: <StatusIcon status={REQUEST_STATUS[s]} label={s} />,
      checked: r.status === s,
      onSelect: () => {
        setChanged((c) => ({ ...c, [r.id]: s }));
        toast(`${r.id} → ${s}`, s === 'Closed'
          ? 'Marked closed. In the live app it moves to the closed log, which is the evidence, and the change is audited, old → new.'
          : 'In the live app this is logged to the audit trail, old → new.');
      },
    })),
  ];
  useListKeys(list, {
    onStatus: (id, el) => {
      const r = rows.find((x) => x.id === id);
      if (r) menu.openBelow(el, statusItems(r), `Status of ${id}`);
    },
  });
  const late = (r: Dsr) => now !== null && responseWindow(r.received, days, now).late;
  const status = (r: Dsr) => (
    <StatusIcon
      status={late(r) ? 'overdue' : REQUEST_STATUS[r.status]}
      label={late(r) ? `${r.status} — past the response window` : r.status}
    />
  );

  return (
    <>
      <WorkList idWidth="6.75rem" ref={list}>
        {rows.map((r) => (
          <WorkRow
            key={r.id}
            id={r.id}
            status={status(r)}
            title={`${r.type} — ${r.principal}`}
            onOpen={() => setOpenId(r.id)}
            current={openId === r.id}
            onContextMenu={(e) => {
              e.preventDefault();
              menu.openAt(e.clientX, e.clientY, [
                { label: 'Open', hint: '↵', onSelect: () => setOpenId(r.id) },
                { label: 'Copy reference', onSelect: () => { void navigator.clipboard?.writeText(r.id); toast(`Copied ${r.id}`); } },
                'separator',
                ...statusItems(r),
              ], `Actions for ${r.id}`);
            }}
            meta={`${r.relationship} · ${r.channel ?? 'Email'}`}
            due={<WindowLeft received={r.received} days={days} now={now} />}
          />
        ))}
      </WorkList>
      {menu.element}

      <Sheet
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open && `${open.type} request from ${open.principal}`}
        meta={open && (
          <>
            <span className="ds-id text-[12px] text-[var(--ds-text-3)]">{open.id}</span>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--ds-text-2)]">{status(open)}{open.status}</span>
          </>
        )}
      >
        {open && (
          <>
            <SheetSection title="Data principal">
              <p className="text-[14px]">{open.principal}</p>
              <p className="text-[13px] text-[var(--ds-text-2)]">{open.relationship}</p>
            </SheetSection>
            <SheetSection title="Response window">
              <p className="mb-2 text-[13px] text-[var(--ds-text-2)]">
                Received {open.received} by {(open.channel ?? 'email').toLowerCase()} · {days} days to respond
              </p>
              <SlaBar received={open.received} days={days} />
            </SheetSection>
            <SheetSection title="Fulfilment">
              {(() => {
                const tasks = d.tasks.filter((t) => t.source.ref === open.id);
                if (!tasks.length) {
                  return <p className="text-[13px] text-[var(--ds-text-3)]">No tasks yet — they are raised per system once the request is verified.</p>;
                }
                return (
                  <ul className="space-y-1.5">
                    {tasks.map((t) => (
                      <li key={t.id} className="flex items-center gap-2.5 text-[13px]">
                        <StatusIcon status={TASK_STATUS[t.status]} label={TASK_LABEL[t.status]} />
                        <span className="ds-id w-12 shrink-0 text-[12px] text-[var(--ds-text-3)]">{t.id}</span>
                        <span className="min-w-0 truncate">{t.system} — {t.action}</span>
                      </li>
                    ))}
                  </ul>
                );
              })()}
              <Link href={demoPath(org, 'tasks')} className="mt-2 inline-block text-[13px] font-medium text-[var(--ds-accent-hover)] hover:underline">
                Tasks &amp; attestations →
              </Link>
            </SheetSection>
            <SheetSection title="History">
              <AuditTimeline entries={auditFor(d, open.id)} empty={`Logged ${open.received}. No changes since.`} />
            </SheetSection>
          </>
        )}
      </Sheet>
    </>
  );
}

/** "12 days left" or "3 days overdue" — red once late, exact due date on hover. */
function WindowLeft({ received, days, now }: { received: string; days: number; now: number | null }) {
  if (now === null) return <Skeleton className="h-3 w-16" />;
  const w = responseWindow(received, days, now);
  const due = new Date(w.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
  return (
    <span title={`Due ${due}`} className={`ds-fade-in ${w.late ? 'text-[var(--ds-danger)]' : ''}`}>
      {w.late ? `${-w.daysLeft} day${w.daysLeft === -1 ? '' : 's'} overdue` : `${w.daysLeft} day${w.daysLeft === 1 ? '' : 's'} left`}
    </span>
  );
}
