'use client';

import { useMemo, useState } from 'react';

/**
 * Everything a list page keeps about how it is being looked at, in one hook:
 * saved views (named predicates, with counts), a search box, filters on named
 * fields ("Owner is Ritu Sharma"), the order, and the grouping. A live app
 * would persist the chosen view, filters and display per user.
 */
export type View<T> = { id: string; label: string; test: (row: T) => boolean };
export type Sort<T> = { id: string; label: string; compare: (a: T, b: T) => number };
/** A field the list can be filtered on: the value a row has, and how to show it. */
export type Field<T> = { id: string; label: string; value: (row: T) => string; display?: (value: string) => string };
/** A way to group the list: each row's group key, and the order groups appear in (others follow in list order). */
export type Grouping<T> = { id: string; label: string; key: (row: T) => string; order?: string[] };

export const NO_GROUPING = 'none';

export function useTableView<T>({
  rows, views, sorts, search, fields = [], groupings = [], initialGrouping = NO_GROUPING,
}: {
  rows: T[];
  views: View<T>[];
  sorts: Sort<T>[];
  search: (row: T) => string;
  fields?: Field<T>[];
  groupings?: Grouping<T>[];
  initialGrouping?: string;
}) {
  const [view, setView] = useState(views[0].id);
  const [sort, setSort] = useState(sorts[0].id);
  const [dir, setDir] = useState<1 | -1>(1);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [grouping, setGrouping] = useState(initialGrouping);

  const shown = useMemo(() => {
    const v = views.find((x) => x.id === view) ?? views[0];
    const s = sorts.find((x) => x.id === sort) ?? sorts[0];
    const q = query.trim().toLowerCase();
    const active = fields.filter((f) => filters[f.id] !== undefined);
    return rows
      .filter(v.test)
      .filter((r) => active.every((f) => f.value(r) === filters[f.id]))
      .filter((r) => !q || search(r).toLowerCase().includes(q))
      .sort((a, b) => s.compare(a, b) * dir);
  }, [rows, views, sorts, fields, search, view, sort, dir, query, filters]);

  const counts = useMemo(() => Object.fromEntries(views.map((v) => [v.id, rows.filter(v.test).length])), [rows, views]);

  /** The rows in groups, in the grouping's order — or null when the list is not grouped. */
  const groups = useMemo(() => {
    const g = groupings.find((x) => x.id === grouping);
    if (!g) return null;
    const buckets = new Map<string, T[]>();
    for (const r of shown) buckets.set(g.key(r), [...(buckets.get(g.key(r)) ?? []), r]);
    const rank = (k: string) => {
      const i = g.order?.indexOf(k) ?? -1;
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };
    // Groups without a set order follow the list's own order: the group whose
    // first row comes first (the most urgent, when ordered by due) leads.
    return [...buckets.entries()]
      .sort(([a], [b]) => rank(a) - rank(b))
      .map(([key, items]) => ({ key, rows: items }));
  }, [groupings, grouping, shown]);

  /** The values a field takes across the whole list, with how many rows have each. */
  const optionsFor = (id: string) => {
    const f = fields.find((x) => x.id === id);
    if (!f) return [];
    const n = new Map<string, number>();
    for (const r of rows) n.set(f.value(r), (n.get(f.value(r)) ?? 0) + 1);
    return [...n.entries()].map(([value, count]) => ({ value, label: f.display?.(value) ?? value, count }));
  };

  const sortBy = (id: string) => {
    if (id === sort) setDir((d) => (d === 1 ? -1 : 1));
    else {
      setSort(id);
      setDir(1);
    }
  };

  return {
    shown, view, setView, counts, sort, dir, sortBy, query, setQuery,
    /** For a Display menu: pick the order without flipping it, and flip it separately. */
    orderBy: setSort, flip: () => setDir((d) => (d === 1 ? -1 : 1)),
    grouping, setGrouping, groups,
    filters, optionsFor,
    setFilter: (id: string, value: string) => setFilters((f) => ({ ...f, [id]: value })),
    clearFilter: (id: string) => setFilters((f) => {
      const next = { ...f };
      delete next[id];
      return next;
    }),
  };
}
