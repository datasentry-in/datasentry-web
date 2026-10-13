import type { IconName } from '@/modules/app/ui/Icons';

/**
 * The console's information architecture, in one place: the sidebar, the
 * breadcrumb and the command palette all read it. `seg` is the path segment
 * under /<org>; '' is the client overview.
 */
export type NavItem = { seg: string; label: string; icon: IconName; keywords?: string };
export type NavGroup = { title: string; items: NavItem[] };

export const MODULES: NavItem[] = [
  { seg: '', label: 'Overview', icon: 'overview', keywords: 'readiness score home' },
  { seg: 'discovery', label: 'Discovery', icon: 'discovery', keywords: 'interview questionnaire' },
  { seg: 'ropa', label: 'RoPA register', icon: 'ropa', keywords: 'processing activities records' },
  { seg: 'flows', label: 'Data flows', icon: 'flows', keywords: 'processors cross-border transfers' },
  { seg: 'gaps', label: 'Gap report', icon: 'gaps', keywords: 'findings rules remediation' },
  { seg: 'consent', label: 'Notice & consent', icon: 'consent', keywords: 'ledger withdrawal notice' },
  { seg: 'dsr', label: 'DSR desk', icon: 'dsr', keywords: 'requests erasure access grievance' },
  { seg: 'breach', label: 'Breach register', icon: 'breach', keywords: 'incident 72-hour board intimation' },
  { seg: 'evidence', label: 'Evidence pack', icon: 'evidence', keywords: 'audit artefacts documents' },
];

/** How information reaches the register without integrations or file imports. */
export const INTAKE: NavItem[] = [
  { seg: 'intake', label: 'Intake channels', icon: 'intake', keywords: 'privacy centre inbox' },
  { seg: 'walkthrough', label: 'Walkthroughs', icon: 'walkthrough', keywords: 'screen-share observed' },
  { seg: 'tasks', label: 'Tasks & attestations', icon: 'tasks', keywords: 'fulfilment owners attest' },
  { seg: 'check-in', label: 'Quarterly check-in', icon: 'checkIn', keywords: 're-attestation questions' },
];

export const NAV: NavGroup[] = [
  { title: 'Modules', items: MODULES },
  { title: 'Intake', items: INTAKE },
];

export const navLabel = (seg: string) => [...MODULES, ...INTAKE].find((m) => m.seg === seg)?.label ?? seg;
