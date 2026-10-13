'use client';

import { useState } from 'react';
import { ACTIVITIES, GAPS, OWNERS, auditFor, type AuditEntry } from '@/modules/app/dpdp/mock/data';
import { formatIst } from '@/modules/app/dpdp/time';
import type { Activity, Basis } from '@/modules/app/dpdp/types';
import Sheet, { SheetSection } from '@/modules/app/ui/Sheet';
import AuditTimeline from './AuditTimeline';
import { useToast } from '@/modules/app/ui/Toast';
import { useTableView, type Sort, type View } from '@/modules/app/ui/useTableView';
import {
  CiteLink, FilterInput, Person, ProvenanceTag, SeverityTag, SortHead, TableWrap, Tag, Td, Th, ViewTabs,
} from '@/modules/app/ui/ui';

/**
 * The register as a working surface: saved views, search and sorting; lawful
 * basis and retention edited in place; any activity opened beside the list.
 * An edit marks the row consultant-reviewed, writes an audit entry with the old
 * and new value, and says what the rule engine does with it — the model
 * proposes, the consultant decides, the rules draw the conclusion.
 */

const BASES: Basis[] = ['s.7(i) employment', 's.7(i) safeguarding', 'Consent', 'Legal obligation', 's.17(1)(d) exempt', 'Not determined'];
const roleTone = (r: string) => (r === 'Exempt' ? 'ok' : r === 'Processor' ? 'info' : 'dark');
const flagged = (a: Activity) => a.basis === 'Not determined' || a.retention === 'Not stated';

const VIEWS: View<Activity>[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'attention', label: 'Needs attention', test: flagged },
  { id: 'consent', label: 'Consent', test: (a) => a.basis === 'Consent' },
  { id: 'legit', label: 'Legitimate use', test: (a) => a.basis.startsWith('s.7(i)') },
  { id: 'exempt', label: 'Exempt', test: (a) => a.role === 'Exempt' },
];
const SORTS: Sort<Activity>[] = [
  { id: 'id', label: 'ID', compare: (a, b) => a.id.localeCompare(b.id) },
  { id: 'name', label: 'Activity', compare: (a, b) => a.name.localeCompare(b.name) },
  { id: 'items', label: 'Items', compare: (a, b) => a.items - b.items },
];
const search = (a: Activity) => `${a.id} ${a.name} ${a.purpose} ${a.department} ${a.systems.join(' ')} ${a.processors.join(' ')}`;

function BasisValue({ basis }: { basis: Basis }) {
  if (basis === 'Not determined') return <span className="font-medium text-[var(--ds-danger)]">Not determined</span>;
  if (basis === 's.17(1)(d) exempt') return <CiteLink provision="s.17(1)(d)" />;
  if (basis.startsWith('s.7(i)'))
    return (
      <span className="inline-flex flex-col items-start gap-0.5">
        <CiteLink provision="s.7(i)" />
        <span className="text-[11px] text-[var(--ds-text-3)]">{basis.includes('safeguard') ? 'safeguarding' : 'employment'}</span>
      </span>
    );
  return <span className="text-[var(--ds-text-2)]">{basis}</span>;
}

const editable =
  'group/edit -mx-1.5 rounded px-1.5 py-0.5 text-left transition-colors hover:bg-[var(--ds-subtle-2)] focus-visible:bg-[var(--ds-subtle-2)]';

export default function RopaRegister() {
  const toast = useToast();
  const [rows, setRows] = useState<Activity[]>(ACTIVITIES);
  const [edits, setEdits] = useState<AuditEntry[]>([]);
  const [editing, setEditing] = useState<{ id: string; field: 'basis' | 'retention' } | null>(null);
  const [draft, setDraft] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const t = useTableView({ rows, views: VIEWS, sorts: SORTS, search });

  const commit = (a: Activity, field: 'basis' | 'retention', value: string) => {
    setEditing(null);
    const from = a[field];
    if (!value.trim() || value === from) return;
    setRows((rs) => rs.map((r) => (r.id === a.id ? { ...r, [field]: value, provenance: 'consultant_reviewed' } : r)));
    const label = field === 'basis' ? 'Lawful basis' : 'Retention';
    setEdits((es) => [{ at: formatIst(new Date()), who: 'Dharita Gada', ref: a.id, what: `${label} edited in the register`, change: { field: label, from, to: value } }, ...es]);

    const bad = field === 'basis' ? 'Not determined' : 'Not stated';
    const finding = GAPS.find((g) => g.activity.startsWith(a.id));
    if (value === bad) toast(`Finding raised on ${a.id}`, `${label} is ${bad.toLowerCase()} — the rule engine opens a finding until it is set.`);
    else if (from === bad) toast(`${finding ? finding.id : 'The finding'} can close`, `${label} for ${a.id} is now “${value}”. It closes when the client confirms.`);
    else toast(`${a.id} updated`, `${label}: ${from} → ${value} · marked consultant-reviewed`);
  };

  const open = rows.find((r) => r.id === openId) ?? null;
  const findings = open ? GAPS.filter((g) => g.activity.startsWith(open.id)) : [];
  const history = open ? [...edits.filter((e) => e.ref === open.id), ...auditFor(open.id)] : [];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ds-border)] px-4 py-3 sm:px-5">
        <ViewTabs views={VIEWS} active={t.view} counts={t.counts} onChange={t.setView} />
        <FilterInput value={t.query} onChange={t.setQuery} placeholder="Filter activities, systems…" />
      </div>

      <TableWrap minWidth="64rem">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <SortHead id="id" label="ID" active={t.sort === 'id'} dir={t.dir} onSort={t.sortBy} className="w-20" />
              <SortHead id="name" label="Activity & purpose" active={t.sort === 'name'} dir={t.dir} onSort={t.sortBy} />
              <Th>Principals</Th>
              <Th>Role</Th>
              <Th>Lawful basis</Th>
              <Th>Retention</Th>
              <SortHead id="items" label="Items" active={t.sort === 'items'} dir={t.dir} onSort={t.sortBy} />
              <Th>Provenance</Th>
            </tr>
          </thead>
          <tbody>
            {t.shown.map((a) => (
              <tr key={a.id} className="hover:bg-[var(--ds-subtle)]">
                <Td className="ds-figure whitespace-nowrap text-[12px] text-[var(--ds-text-2)]">
                  <span className="flex items-center gap-1.5">
                    {flagged(a) && <span className="h-1.5 w-1.5 rounded-full bg-[var(--ds-danger)]" aria-label="Needs attention" />}
                    {a.id}
                  </span>
                </Td>
                <Td>
                  <button type="button" onClick={() => setOpenId(a.id)} className="text-left font-medium hover:text-[var(--ds-accent-hover)] hover:underline">
                    {a.name}
                  </button>
                  <span className="block text-[var(--ds-text-2)]">{a.purpose}</span>
                  <span className="block text-[11px] text-[var(--ds-text-3)]">{a.department} · {a.systems.join(', ')}</span>
                </Td>
                <Td className="text-[var(--ds-text-2)]">{a.principals}</Td>
                <Td>
                  <Tag tone={roleTone(a.role)}>{a.role}</Tag>
                </Td>
                <Td>
                  {editing?.id === a.id && editing.field === 'basis' ? (
                    <select
                      autoFocus
                      defaultValue={a.basis}
                      onChange={(e) => commit(a, 'basis', e.target.value)}
                      onBlur={() => setEditing(null)}
                      onKeyDown={(e) => e.key === 'Escape' && setEditing(null)}
                      aria-label={`Lawful basis for ${a.id}`}
                      className="h-8 rounded-md border border-[var(--ds-accent)] bg-white px-1.5 text-[12px] outline-none"
                    >
                      {BASES.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  ) : (
                    <button type="button" className={editable} onClick={() => setEditing({ id: a.id, field: 'basis' })} title="Click to change">
                      <BasisValue basis={a.basis} />
                    </button>
                  )}
                </Td>
                <Td>
                  {editing?.id === a.id && editing.field === 'retention' ? (
                    <input
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={() => commit(a, 'retention', draft)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commit(a, 'retention', draft);
                        if (e.key === 'Escape') setEditing(null);
                      }}
                      aria-label={`Retention for ${a.id}`}
                      className="h-8 w-40 rounded-md border border-[var(--ds-accent)] px-2 text-[12px] outline-none"
                    />
                  ) : (
                    <button
                      type="button"
                      className={`${editable} ${a.retention === 'Not stated' ? 'font-medium text-[var(--ds-danger)]' : 'text-[var(--ds-text-2)]'}`}
                      onClick={() => {
                        setDraft(a.retention === 'Not stated' ? '' : a.retention);
                        setEditing({ id: a.id, field: 'retention' });
                      }}
                      title="Click to change"
                    >
                      {a.retention}
                    </button>
                  )}
                </Td>
                <Td className="ds-figure text-[12px] text-[var(--ds-text-2)]">{a.items}</Td>
                <Td>
                  <ProvenanceTag p={a.provenance} />
                </Td>
              </tr>
            ))}
            {t.shown.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-[var(--ds-text-3)]">
                  No activities match this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableWrap>

      <Sheet
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.name}
        meta={
          open && (
            <>
              <span className="ds-figure text-[12px] text-[var(--ds-text-3)]">{open.id}</span>
              <Tag tone={roleTone(open.role)}>{open.role}</Tag>
              <ProvenanceTag p={open.provenance} />
            </>
          )
        }
      >
        {open && (
          <>
            <p className="text-[13px] leading-relaxed text-[var(--ds-text-2)]">{open.purpose}</p>
            <SheetSection title="Details">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                {[
                  ['Department', open.department],
                  ['Data principals', open.principals],
                  ['Data items', String(open.items)],
                  ['Retention', open.retention],
                  ['Systems', open.systems.join(', ')],
                  ['Processors', open.processors.join(', ') || 'None'],
                  ['Cross-border', open.crossBorder ?? 'None'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="ds-meta text-[var(--ds-text-3)]">{k}</dt>
                    <dd className={`mt-0.5 ${v === 'Not stated' ? 'font-medium text-[var(--ds-danger)]' : ''}`}>{v}</dd>
                  </div>
                ))}
                <div>
                  <dt className="ds-meta text-[var(--ds-text-3)]">Lawful basis</dt>
                  <dd className="mt-0.5"><BasisValue basis={open.basis} /></dd>
                </div>
              </dl>
            </SheetSection>

            <SheetSection title={`Findings on this activity (${findings.length})`}>
              {findings.length === 0 ? (
                <p className="text-[13px] text-[var(--ds-text-3)]">None — the rule engine raised nothing here.</p>
              ) : (
                <ul className="space-y-3">
                  {findings.map((g) => (
                    <li key={g.id} className="ds-bar ds-bar-plain">
                      <p className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium">
                        {g.title} <SeverityTag s={g.severity} />
                      </p>
                      <p className="mt-1 flex items-center gap-3 text-[12px] text-[var(--ds-text-3)]">
                        <Person name={OWNERS[g.owner] ?? g.owner} compact /> due {g.due}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </SheetSection>

                    <SheetSection title="History">
              <AuditTimeline entries={history} empty="No changes since RoPA v4 was confirmed." />
            </SheetSection>   </>
        )}
      </Sheet>
    </>
  );
}
