'use client';

import { useState } from 'react';
import { GAPS, OWNERS, auditFor } from '@/modules/app/dpdp/mock/data';
import { parseDisplayDate } from '@/modules/app/dpdp/time';
import type { Gap, Severity } from '@/modules/app/dpdp/types';
import Sheet, { SheetSection } from '@/modules/app/ui/Sheet';
import AuditTimeline from './AuditTimeline';
import Discussion from './Discussion';
import { useTableView, type Sort, type View } from '@/modules/app/ui/useTableView';
import {
  BasisTag, CiteLink, FilterInput, Person, SeverityTag, SortHead, TableWrap, Th, ViewTabs,
} from '@/modules/app/ui/ui';
import RemindButton from './RemindButton';
import When from './When';

/**
 * The gap report as a worklist: saved views (by severity, by what is due soon,
 * by owner), sortable columns, and each finding opened beside the list with
 * its evidence, provision and history.
 */

const RANK: Record<Severity, number> = { High: 0, Medium: 1, Low: 2 };
const due = (g: Gap) => parseDisplayDate(g.due)?.getTime() ?? 0;
const DAY = 86_400_000;

// "Due in 30 days" is measured from the mock's review date, so the view is
// stable in a prerendered page; the relative labels use the real clock.
const REVIEWED = parseDisplayDate('08 Oct 2026')!.getTime();

const VIEWS: View<Gap>[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'high', label: 'High', test: (g) => g.severity === 'High' },
  { id: 'soon', label: 'Due in 30 days', test: (g) => due(g) - REVIEWED <= 30 * DAY },
  { id: 'legal', label: 'Legal & Compliance', test: (g) => g.owner === 'Legal & Compliance' },
  { id: 'unobserved', label: 'Not yet observed', test: (g) => g.basis !== 'observed' },
];
const SORTS: Sort<Gap>[] = [
  { id: 'severity', label: 'Severity', compare: (a, b) => RANK[a.severity] - RANK[b.severity] || due(a) - due(b) },
  { id: 'due', label: 'Due', compare: (a, b) => due(a) - due(b) },
  { id: 'id', label: 'ID', compare: (a, b) => a.id.localeCompare(b.id) },
];
const search = (g: Gap) => `${g.id} ${g.title} ${g.provision} ${g.activity} ${g.owner} ${OWNERS[g.owner] ?? ''}`;

export default function FindingsList() {
  const [openId, setOpenId] = useState<string | null>(null);
  const t = useTableView({ rows: GAPS, views: VIEWS, sorts: SORTS, search });
  const open = GAPS.find((g) => g.id === openId) ?? null;
  const person = (g: Gap) => OWNERS[g.owner] ?? g.owner;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ds-border)] px-4 py-3 sm:px-5">
        <ViewTabs views={VIEWS} active={t.view} counts={t.counts} onChange={t.setView} />
        <FilterInput value={t.query} onChange={t.setQuery} placeholder="Filter findings, owners…" />
      </div>
      <TableWrap minWidth="52rem">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <SortHead id="id" label="ID" active={t.sort === 'id'} dir={t.dir} onSort={t.sortBy} className="w-20" />
              <Th>Finding</Th>
              <SortHead id="severity" label="Severity" active={t.sort === 'severity'} dir={t.dir} onSort={t.sortBy} />
              <Th>Owner</Th>
              <SortHead id="due" label="Due" active={t.sort === 'due'} dir={t.dir} onSort={t.sortBy} />
              <th className="w-24 border-b border-[var(--ds-border)] bg-[var(--ds-subtle)]" />
            </tr>
          </thead>
          <tbody>
            {t.shown.map((g) => (
              <tr key={g.id} className="ds-row cursor-pointer hover:bg-[var(--ds-subtle)]">
                <td className="ds-id border-b border-[var(--ds-border)] px-3 py-3 align-top text-[12px] text-[var(--ds-text-2)]">{g.id}</td>
                <td className="border-b border-[var(--ds-border)] px-3 py-3 align-top">
                  <button type="button" onClick={() => setOpenId(g.id)} className="ds-row-link text-left text-[13px] font-medium leading-snug">
                    {g.title}
                  </button>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--ds-text-3)]">
                    <CiteLink provision={g.provision} /> {g.activity}
                  </span>
                </td>
                <td className="border-b border-[var(--ds-border)] px-3 py-3 align-top"><SeverityTag s={g.severity} /></td>
                <td className="border-b border-[var(--ds-border)] px-3 py-3 align-top"><Person name={person(g)} role={OWNERS[g.owner] ? g.owner : undefined} /></td>
                <td className="whitespace-nowrap border-b border-[var(--ds-border)] px-3 py-3 align-top text-[12px]">
                  <span className="block font-medium">{g.due}</span>
                  <When date={g.due} className="text-[12px]" />
                </td>
                <td className="border-b border-[var(--ds-border)] px-3 py-3 text-right align-top">
                  <span className="ds-row-actions"><RemindButton person={person(g)} what={`${g.id} — ${g.title}`} /></span>
                </td>
              </tr>
            ))}
            {t.shown.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-[var(--ds-text-3)]">No findings match this view.</td>
              </tr>
            )}
          </tbody>
        </table>
      </TableWrap>

      <Sheet
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.title}
        meta={open && (<><span className="ds-id text-[12px] text-[var(--ds-text-3)]">{open.id}</span><SeverityTag s={open.severity} /><CiteLink provision={open.provision} /></>)}
        footer={open && <RemindButton person={person(open)} what={`${open.id} — ${open.title}`} />}
      >
        {open && (
          <>
            <p className="text-[14px] leading-relaxed text-[var(--ds-text-2)]">{open.detail}</p>
            <SheetSection title="Ownership">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Person name={person(open)} role={OWNERS[open.owner] ? open.owner : undefined} />
                <p className="text-right text-[13px]">
                  <span className="block font-medium">{open.due}</span>
                  <When date={open.due} className="text-[12px]" />
                </p>
              </div>
            </SheetSection>
            <SheetSection title="Activity">
              <p className="text-[13px]">{open.activity}</p>
            </SheetSection>
            {open.evidence && (
              <SheetSection title="Evidence">
                <div className="ds-bar ds-bar-plain">
                  {open.basis && <BasisTag b={open.basis} />}
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--ds-text-2)]">{open.evidence}</p>
                </div>
              </SheetSection>
            )}
            <SheetSection title="Why this is a finding">
              <p className="text-[14px] leading-relaxed text-[var(--ds-text-2)]">
                Raised by rule set v1.4 from a register field, citing {open.provision}. The model does not draw this
                conclusion; it can be traced line by line to the register and the rule.
              </p>
            </SheetSection>
                    <SheetSection title="Discussion">
              <Discussion refId={open.id} client="Northstar" />
            </SheetSection>
            <SheetSection title="History">
              <AuditTimeline entries={auditFor(open.id)} empty="Raised 08 Oct 2026 by rule engine v1.4. No changes since." />
            </SheetSection>   </>
        )}
      </Sheet>
    </>
  );
}
