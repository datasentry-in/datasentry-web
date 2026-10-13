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
  basis?: EvidenceBasis;
};

/**
 * What a recorded fact rests on — no integrations or file imports in MVP, so
 * every fact is one of these, with actor and timestamp. The evidence pack
 * shows which, and never presents an attestation as a verified result.
 */
export type EvidenceBasis = 'declared' | 'observed' | 'attested';

/** Something a consultant saw on a client's screen-share. Nothing was exported. */
export type Observation = {
  system: string;
  looked: string;
  /** What the register held before the walkthrough; null when it said nothing. */
  declared: string | null;
  observed: string;
  result: 'matches' | 'differs' | 'new';
  /** The gap finding this raised or confirmed. */
  finding?: string;
};

export type Walkthrough = {
  id: string;
  date: string;
  consultant: string;
  attendees: string[];
  observations: Observation[];
  next: string;
};

/**
 * Work the platform cannot do itself: an owner does it in their own system and
 * attests it. Generated per system from the RoPA.
 */
export type FulfilmentTask = {
  id: string;
  source: { kind: 'Request' | 'Consent withdrawal' | 'Retention expiry' | 'Finding'; ref: string; label: string };
  system: string;
  action: string;
  owner: string;
  due: string;
  status: 'Open' | 'Overdue' | 'Attested' | 'Retained';
  attestation?: { by: string; at: string; note: string; proof: string | null };
  /** The statutory ground, when the record is lawfully kept instead. */
  retainedFor?: string;
};

export type Dsr = {
  id: string;
  type: 'Erasure' | 'Access' | 'Correction' | 'Grievance' | 'Nomination';
  principal: string;
  relationship: string;
  received: string;
  /** Where it came in — the platform is the system of record for both. */
  channel?: 'Privacy centre' | 'Email';
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
  /** The Board-intimation deadline as an instant, for live clocks. */
  deadlineIso?: string;
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

/**
 * The data-flow map, derived from the register. A node is a system or a party
 * that holds personal data; `zone` is the trust boundary it sits in.
 */
export type FlowZone = 'internal' | 'india' | 'abroad';
export type FlowNode = {
  id: string;
  label: string;
  kind: 'system' | 'processor' | 'statutory' | 'client';
  zone: FlowZone;
  /** Where the data is held: ISO country code. */
  region: 'IN' | 'US' | 'UK';
  /** The contract that governs the party's handling of the data. */
  safeguard: 'Internal' | 'DPA in place' | 'No DPA' | 'Terms only' | 'Statutory' | 'Exempt';
  principals: string;
  /** A finding raised on the node itself (e.g. retention not stated). */
  finding?: string;
  note?: string;
};
export type FlowEdge = {
  id: string;
  from: string;
  to: string;
  activity: string;
  /** Short label drawn on the arrow. */
  label: string;
  categories: string[];
  principals: 'Candidates' | 'Employees' | 'Ex-employees' | 'Client end-users';
  basis: string;
  finding?: string;
};
