import type { AuditEntry } from '@/modules/app/dpdp/mock/data';
import { Change } from '@/modules/app/ui/ui';

/** A record's audit trail, newest first, with each field change as old → new. */
export default function AuditTimeline({ entries, empty }: { entries: AuditEntry[]; empty: string }) {
  if (entries.length === 0) return <p className="text-[13px] text-[var(--ds-text-3)]">{empty}</p>;
  return (
    <ol className="space-y-3 border-l border-[var(--ds-border)] pl-4">
      {entries.map((e, i) => (
        <li key={e.at + i} className="relative">
          <span aria-hidden className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-[var(--ds-border-strong)] bg-[var(--ds-panel)]" />
          <p className="text-[13px]">{e.what}</p>
          {e.change && <Change {...e.change} />}
          <p className="text-[11px] text-[var(--ds-text-3)]">{e.who} · {e.at}</p>
        </li>
      ))}
    </ol>
  );
}
