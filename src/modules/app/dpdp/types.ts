/**
 * DPDP domain types — the shape of the register, findings, requests and
 * incidents. Shared by the mock and, later, the live app; only the data
 * behind them changes.
 */

export type Role = 'Fiduciary' | 'Processor' | 'Exempt';
export type Basis =
  | 's.7(i) employment'
  | 's.7(i) safeguarding'
  | 'Consent'
  | 'Legal obligation'
  | 's.17(1)(d) exempt'
  | 'Not determined';
export type Severity = 'High' | 'Medium' | 'Low';
export type Provenance = 'ai_suggested' | 'consultant_reviewed' | 'client_confirmed';

export type Activity = {
  id: string;
  name: string;
  department: string;
  purpose: string;
  principals: string;
  items: number;
  systems: string[];
  role: Role;
  basis: Basis;
  retention: string;
  processors: string[];
  crossBorder: string | null;
  provenance: Provenance;
};

export type Gap = {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  provision: string;
  activity: string;
  owner: string;
  due: string;
  evidence: string | null;
};

export type Dsr = {
  id: string;
  type: 'Erasure' | 'Access' | 'Correction' | 'Grievance' | 'Nomination';
  principal: string;
  relationship: string;
  received: string;
  daysLeft: number | null;
  status: 'New' | 'In progress' | 'Awaiting client' | 'Closed';
  outcome?: string;
  conflicts?: { record: string; statute: string; until: string }[];
};

export type Incident = {
  id: string;
  title: string;
  awareness: string;
  deadline: string;
  affected: number;
  categories: string;
  status: 'Open' | 'Notified' | 'Closed';
  boardIntimation: string;
  principalNotice: string;
};

export type Org = {
  slug: string;
  name: string;
  sector: string;
  headcount: number;
  locations: string;
  score: number;
  trend: string;
  openGaps: { high: number; medium: number; low: number };
  activities: number;
  exemptActivities: number;
  dsrOpen: number;
  dsrBreaching: number;
  incidentOpen: number;
  engagement: string;
  lastReview: string;
};
