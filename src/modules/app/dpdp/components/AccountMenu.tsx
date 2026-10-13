'use client';

import { useState } from 'react';
import { CONSULTANT, lastSignIn } from '@/modules/app/dpdp/mock/data';

/** The signed-in consultant: name beside the avatar on wide screens, and a menu to sign out. */
export default function AccountMenu({ onSignOut }: { onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="hidden text-right lg:block">
        <p className="text-[13px] font-medium leading-tight">{CONSULTANT.name}</p>
        <p className="text-[11px] leading-tight text-[var(--ds-text-3)]">
          {CONSULTANT.firm} · {CONSULTANT.role}
        </p>
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Account menu"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ds-accent)] text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          {CONSULTANT.initials}
        </button>
        {open && (
          <>
            <div aria-hidden className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="ds-pop absolute right-0 z-50 mt-2 w-60 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] p-1 shadow-[var(--ds-shadow-md)]">
              <div className="px-2.5 py-2">
                <p className="text-[13px] font-medium">{CONSULTANT.name}</p>
                <p className="truncate text-[12px] text-[var(--ds-text-2)]">{CONSULTANT.email}</p>
                <p className="mt-1 text-[12px] text-[var(--ds-text-3)]">{CONSULTANT.role}</p>
              </div>
              <div className="my-1 h-px bg-[var(--ds-border)]" />
              <p className="px-2.5 py-1 text-[11px] text-[var(--ds-text-3)]">Last sign-in {lastSignIn()}</p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onSignOut();
                }}
                className="w-full rounded-md px-2.5 py-1.5 text-left text-[13px] text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
