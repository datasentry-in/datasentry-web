'use client';

import { useState } from 'react';
import DisplayMenu, { type DisplayOption } from './DisplayMenu';
import { useClosable } from './useClosable';
import type { Field, Grouping, View, useTableView } from './useTableView';
import { FilterInput } from './ui';
import ViewTabs from './ViewTabs';

type TableView<T> = ReturnType<typeof useTableView<T>>;

/**
 * One bar over a worklist: saved views on the left; on the right, + Filter
 * (pick a field, then a value), the search box and Display (grouping and
 * order). Active filters sit beneath as chips, each removable.
 */
export default function FilterBar<T>({
  t, views, fields = [], orders, groupings, placeholder,
}: {
  t: TableView<T>;
  views: View<T>[];
  fields?: Field<T>[];
  orders: DisplayOption[];
  groupings?: Grouping<T>[];
  placeholder: string;
}) {
  const active = fields.filter((f) => t.filters[f.id] !== undefined);
  return (
    <div className="border-b border-[var(--ds-border)] px-4 py-2.5 sm:px-5">
      <div className="flex flex-wrap items-center gap-2">
        <ViewTabs views={views} active={t.view} counts={t.counts} onChange={t.setView} />
        <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
          {fields.length > 0 && (
            <FilterMenu fields={fields} optionsFor={t.optionsFor} onPick={t.setFilter} />
          )}
          <FilterInput value={t.query} onChange={t.setQuery} placeholder={placeholder} className="min-w-0 flex-1 sm:w-44 sm:flex-none" />
          <DisplayMenu
            orders={orders}
            order={t.sort}
            dir={t.dir}
            onOrder={t.orderBy}
            onFlip={t.flip}
            groups={groupings && [{ id: 'none', label: 'No grouping' }, ...groupings.map((g) => ({ id: g.id, label: g.label }))]}
            group={t.grouping}
            onGroup={t.setGrouping}
          />
        </div>
      </div>
      {active.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {active.map((f) => {
            const value = t.filters[f.id];
            return (
              <span key={f.id} className="inline-flex h-6 items-center gap-1 rounded-md border border-[var(--ds-border)] pl-2 text-[12px]">
                <span className="text-[var(--ds-text-3)]">{f.label} is</span>
                <span className="font-medium text-[var(--ds-text)]">{f.display?.(value) ?? value}</span>
                <button
                  type="button"
                  onClick={() => t.clearFilter(f.id)}
                  aria-label={`Remove the ${f.label.toLowerCase()} filter`}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--ds-text-3)] transition-colors hover:text-[var(--ds-text)]"
                >
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                    <path d="m4.5 4.5 7 7M11.5 4.5l-7 7" />
                  </svg>
                </button>
              </span>
            );
          })}
          {active.length > 1 && (
            <button
              type="button"
              onClick={() => active.forEach((f) => t.clearFilter(f.id))}
              className="px-1.5 text-[12px] text-[var(--ds-text-3)] hover:text-[var(--ds-text)]"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const ITEM =
  'flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left text-[13px] text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]';

/** "+ Filter": choose a field, then one of the values it takes (with counts). */
function FilterMenu<T>({
  fields, optionsFor, onPick,
}: {
  fields: Field<T>[];
  optionsFor: TableView<T>['optionsFor'];
  onPick: (field: string, value: string) => void;
}) {
  const menu = useClosable();
  const [field, setField] = useState<Field<T> | null>(null);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setField(null);
          menu.toggle();
        }}
        aria-expanded={menu.open}
        aria-haspopup="menu"
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-dashed border-[var(--ds-border-strong)] px-2.5 text-[13px] text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <path d="M8 3.5v9M3.5 8h9" />
        </svg>
        Filter
      </button>
      {menu.open && (
        <>
          <div aria-hidden className="fixed inset-0 z-40" onClick={menu.close} />
          <div
            role="menu"
            data-state={menu.state}
            className="ds-pop ds-origin-tl absolute left-0 z-50 mt-1.5 max-h-80 w-64 overflow-y-auto rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] p-1 shadow-[var(--ds-shadow-md)]"
          >
            {field === null ? (
              fields.map((f) => (
                <button key={f.id} type="button" role="menuitem" onClick={() => setField(f)} className={ITEM}>
                  {f.label}
                  <span aria-hidden className="text-[var(--ds-text-3)]">›</span>
                </button>
              ))
            ) : (
              <>
                <button type="button" onClick={() => setField(null)} className="flex w-full items-center gap-1.5 rounded-md px-2.5 py-1.5 text-left text-[12px] text-[var(--ds-text-3)] hover:text-[var(--ds-text)]">
                  <span aria-hidden>‹</span> {field.label}
                </button>
                <div className="my-1 h-px bg-[var(--ds-border)]" />
                {optionsFor(field.id).map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onPick(field.id, o.value);
                      menu.close();
                    }}
                    className={ITEM}
                  >
                    <span className="min-w-0 truncate">{o.label}</span>
                    <span className="ds-figure shrink-0 text-[11px] text-[var(--ds-text-3)]">{o.count}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
