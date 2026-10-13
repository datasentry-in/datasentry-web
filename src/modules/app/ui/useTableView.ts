'use client';

import { useMemo, useState } from 'react';

/**
 * Saved views, a search box and sortable columns for a list — the state a
 * list page keeps, in one hook. Views are named predicates; sorts are named
 * comparators. A live app would persist the chosen view per user.
 */
export type View<T> = { id: string; label: string; test: (row: T) => boolean };
export type Sort<T> = { id: string; label: string; compare: (a: T, b: T) => number };

export function useTableView<T>({
  rows, views, sorts, search,
}: { rows: T[]; views: View<T>[]; sorts: Sort<T>[]; search: (row: T) => string }) {
  const [view, setView] = useState(views[0].id);
  const [sort, setSort] = useState(sorts[0].id);
  const [dir, setDir] = useState<1 | -1>(1);
  const [query, setQuery] = useState('');

  const shown = useMemo(() => {
    const v = views.find((x) => x.id === view) ?? views[0];
    const s = sorts.find((x) => x.id === sort) ?? sorts[0];
    const q = query.trim().toLowerCase();
    return rows
      .filter(v.test)
      .filter((r) => !q || search(r).toLowerCase().includes(q))
      .sort((a, b) => s.compare(a, b) * dir);
  }, [rows, views, sorts, search, view, sort, dir, query]);

  const counts = useMemo(() => Object.fromEntries(views.map((v) => [v.id, rows.filter(v.test).length])), [rows, views]);

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
  };
}
