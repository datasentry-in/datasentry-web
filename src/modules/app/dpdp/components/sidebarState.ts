/**
 * Whether the client sidebar is collapsed to an icon rail. Kept in
 * localStorage so it survives reloads, and read through useSyncExternalStore
 * so the prerendered HTML (always expanded) never mismatches on hydration.
 */
const KEY = 'ds-console-sidebar-collapsed';

let listeners: (() => void)[] = [];
export const subscribeSidebar = (l: () => void) => {
  listeners = [...listeners, l];
  return () => {
    listeners = listeners.filter((x) => x !== l);
  };
};

export const readCollapsed = () => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};
export const serverCollapsed = () => false;

export function toggleSidebar() {
  try {
    localStorage.setItem(KEY, readCollapsed() ? '0' : '1');
  } catch {
    /* storage blocked — the toggle just won't persist */
  }
  listeners.forEach((l) => l());
}
