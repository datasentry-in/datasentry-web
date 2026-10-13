'use client';

import { useClosable } from '@/modules/app/ui/useClosable';
import { currentUser, lastSignIn } from '@/modules/app/dpdp/mock/clients';
import { PRESENTER, setPref, usePref } from '@/modules/app/ui/prefs';

/** The signed-in consultant: name beside the avatar on wide screens, and a menu to sign out. */
export default function AccountMenu({ onSignOut }: { onSignOut: () => void }) {
  const menu = useClosable();
  const { open, close } = menu;
  const presenter = usePref(PRESENTER, true);
  return (
    <>
      <div className="hidden text-right xl:block">
        <p className="text-[13px] font-medium leading-tight">{currentUser.name}</p>
        <p className="text-[11px] leading-tight text-[var(--ds-text-3)]">
          {currentUser.firm} · {currentUser.role}
        </p>
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={menu.toggle}
          aria-expanded={open}
          aria-label="Account menu"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ds-accent)] text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          {currentUser.initials}
        </button>
        {open && (
          <>
            <div aria-hidden className="fixed inset-0 z-40" onClick={close} />
            <div data-state={menu.state} className="ds-pop ds-origin-tr absolute right-0 z-50 mt-2 w-60 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] p-1 shadow-[var(--ds-shadow-md)]">
              <div className="px-2.5 py-2">
                <p className="text-[13px] font-medium">{currentUser.name}</p>
                <p className="truncate text-[12px] text-[var(--ds-text-2)]">{currentUser.email}</p>
                <p className="mt-1 text-[12px] text-[var(--ds-text-3)]">{currentUser.role}</p>
              </div>
              <div className="my-1 h-px bg-[var(--ds-border)]" />
              <button
                type="button"
                role="switch"
                aria-checked={presenter}
                onClick={() => setPref(PRESENTER, !presenter)}
                className="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left text-[13px] text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
              >
                <span>
                  Presenter mode
                  <span className="block text-[11px] text-[var(--ds-text-3)]">Show design notes on each page</span>
                </span>
                <span className={`relative h-4 w-7 shrink-0 rounded-full transition-colors duration-200 ${presenter ? 'bg-[var(--ds-accent)]' : 'bg-[var(--ds-border-strong)]'}`}>
                  <span className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-300 ease-[var(--ds-ease-spring)] motion-reduce:transition-none ${presenter ? 'translate-x-3' : 'translate-x-0'}`} />
                </span>
              </button>
              <div className="my-1 h-px bg-[var(--ds-border)]" />
              <p className="px-2.5 py-1 text-[11px] text-[var(--ds-text-3)]">Last sign-in {lastSignIn()}</p>
              <button
                type="button"
                onClick={() => {
                  close();
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
