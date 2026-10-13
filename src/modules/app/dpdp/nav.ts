import type { IconName } from '@/modules/app/ui/Icons';

/**
 * The console's information architecture, in one place: the sidebar, the
 * command palette and the keyboard shortcuts all read it. `seg` is the path segment
 * under /<org>; '' is the client overview.
 */
/** `key` is the second key of the "g then <key>" shortcut. */
export type NavItem = { seg: string; label: string; icon: IconName; key: string; keywords?: string };
export type NavGroup = { title: string; items: NavItem[] };

export const MODULES: NavItem[] = [
  { seg: '', label: 'Overview', icon: 'overview', key: 'o', keywords: 'readiness score home' },
  { seg: 'discovery', label: 'Discovery', icon: 'discovery', key: 'd', keywords: 'interview questionnaire' },
  { seg: 'ropa', label: 'RoPA register', icon: 'ropa', key: 'r', keywords: 'processing activities records' },
  { seg: 'flows', label: 'Data flows', icon: 'flows', key: 'f', keywords: 'processors cross-border transfers' },
  { seg: 'gaps', label: 'Gap report', icon: 'gaps', key: 'g', keywords: 'findings rules remediation' },
  { seg: 'consent', label: 'Notice & consent', icon: 'consent', key: 'c', keywords: 'ledger withdrawal notice' },
  { seg: 'dsr', label: 'DSR desk', icon: 'dsr', key: 's', keywords: 'requests erasure access grievance' },
  { seg: 'breach', label: 'Breach register', icon: 'breach', key: 'b', keywords: 'incident 72-hour board intimation' },
  { seg: 'evidence', label: 'Evidence pack', icon: 'evidence', key: 'e', keywords: 'audit artefacts documents' },
];

/** How information reaches the register without integrations or file imports. */
export const INTAKE: NavItem[] = [
  { seg: 'intake', label: 'Intake channels', icon: 'intake', key: 'i', keywords: 'privacy centre inbox' },
  { seg: 'walkthrough', label: 'Walkthroughs', icon: 'walkthrough', key: 'w', keywords: 'screen-share observed' },
  { seg: 'tasks', label: 'Tasks & attestations', icon: 'tasks', key: 't', keywords: 'fulfilment owners attest' },
  { seg: 'check-in', label: 'Quarterly check-in', icon: 'checkIn', key: 'q', keywords: 're-attestation questions' },
];

export const NAV: NavGroup[] = [
  { title: 'Modules', items: MODULES },
  { title: 'Intake', items: INTAKE },
];


/** "g then a" goes to the portfolio; every other g-shortcut is a page above. */
export const ALL_CLIENTS_KEY = 'a';
