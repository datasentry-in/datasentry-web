import type { AuditEntry } from '@/modules/app/dpdp/types';
import Timeline from '@/modules/app/ui/Timeline';
import { Change } from '@/modules/app/ui/ui';

/** A record's audit trail, newest first, with each field change as old → new. */
export default function AuditTimeline({ entries, empty }: { entries: AuditEntry[]; empty: string }) {
  return (
    <Timeline
      empty={empty}
      items={entries.map((e, i) => ({
        key: `${e.at}-${i}`,
        title: e.what,
        body: e.change && <Change {...e.change} />,
        meta: `${e.who} · ${e.at}`,
      }))}
    />
  );
}
