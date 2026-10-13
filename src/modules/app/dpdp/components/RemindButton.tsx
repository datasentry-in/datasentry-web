'use client';

import { formatIst } from '@/modules/app/dpdp/time';
import { useToast } from '@/modules/app/ui/Toast';

/**
 * Nudge the owner of an item. In the live app this sends the reminder email
 * and logs it to the audit trail; in the mock it only confirms, and says so.
 */
export default function RemindButton({ person, what }: { person: string; what: string }) {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() => toast(`Reminder sent to ${person}`, `${what} · ${formatIst(new Date())} · in this mock nothing is emailed`)}
      className="rounded-md border border-[var(--ds-border-strong)] bg-[var(--ds-panel)] px-2.5 py-1 text-[12px] font-medium text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
    >
      Remind
    </button>
  );
}
