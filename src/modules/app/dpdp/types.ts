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

/** Where a finding's remediation stands. Resolved means the consultant has seen the fix, not just been told. */
export type GapStatus = 'Open' | 'In progress' | 'Resolved';

export type Gap = {
  id: string;
  severity: Severity;
  /** Open unless set. */
  status?: GapStatus;
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

/** Who a client is and where the engagement stands — entered, not derived. */
export type OrgProfile = {
  slug: string;
  name: string;
  sector: string;
  headcount: number;
  locations: string;
  score: number;
  trend: string;
  engagement: string;
  lastReview: string;
};

/**
 * A client as the console shows it: its profile plus counts computed from its
 * own data (`summaryFor` in mock/clients.ts), so there is one source of truth.
 * Lateness is not here — it depends on the clock (see sla.ts).
 */
export type Org = OrgProfile & {
  openGaps: { high: number; medium: number; low: number };
  activities: number;
  exemptActivities: number;
  dsrOpen: number;
  incidentOpen: number;
};

/**
 * The data-flow map, derived from the register. A node is a system or a party
 * that holds personal data; `zone` is the trust boundary it sits in.
 */
export type FlowZone = 'internal' | 'india' | 'abroad';
/** Where data is held: ISO country code. */
export type Region = 'IN' | 'US' | 'UK' | 'SG' | 'IE' | 'DE';
export type FlowNode = {
  id: string;
  label: string;
  kind: 'system' | 'processor' | 'statutory' | 'client';
  zone: FlowZone;
  /** Where the data is held: ISO country code. */
  region: Region;
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
  basis: Basis;
  finding?: string;
};

/**
 * The register's systems and recipients — every place personal data sits or is
 * sent. Its trust zone is not stored: it follows from where it is hosted and
 * what it is (flowGraph.zoneFor). `finding` is one recorded against the party
 * itself (e.g. retention not stated); findings the map's rules raise are live.
 */
export type Party = Omit<FlowNode, 'zone'>;

/**
 * One movement of personal data, recorded against a RoPA activity — the
 * register's recipients and transfers. Its lawful basis is the activity's, read
 * live; `finding` is one recorded against it beyond what the rules raise live.
 */
export type Transfer = {
  id: string;
  /** The RoPA activity it belongs to, e.g. 'PA-12'. */
  activity: string;
  from: string;
  to: string;
  /** Short label drawn on the flow. */
  label: string;
  categories: string[];
  principals: FlowEdge['principals'];
  finding?: string;
};

/**
 * The append-only audit trail, newest first. A field change records the old
 * and the new value, so the history says exactly what changed, not
 * "record updated". `ref` ties an entry to a record (an activity, finding,
 * request or incident).
 */
export type AuditEntry = {
  at: string;
  who: string;
  ref: string;
  what: string;
  change?: { field: string; from: string; to: string };
};

/**
 * Comments on a record. `visibility` decides who sees it: an internal note stays
 * with the DataSentry team; a shared comment is visible to the client's owners.
 */
export type RecordComment = {
  id: string;
  ref: string;
  who: string;
  at: string;
  text: string;
  visibility: 'internal' | 'shared';
};

/**
 * A generated compliance document, opened as a page. Sections carry their own
 * provenance: AI-drafted from the record, or reviewed by the consultant.
 * Editing a drafted section marks it reviewed.
 */
export type DocSection = { heading: string; text: string; provenance: Provenance; source?: string };

export type ComplianceDoc = {
  id: string;
  ref: string;
  title: string;
  kind: string;
  provision: string;
  owner: string;
  approver: string;
  due: string;
  version: number;
  sections: DocSection[];
  versions: { v: number; at: string; who: string; note: string }[];
};

/** An artefact in the evidence pack, generated from the register. */
export type EvidenceItem = { name: string; status: 'Generated' | 'Review pending' | 'Incomplete' | 'Not started'; detail: string; ts: string };

export type ConsentSummary = {
  activeCandidate: number;
  withdrawn: number;
  expiredClock: number;
  pendingErasureTasks: number;
  employeeExceptions: number;
  noticeVersion: string;
  languages: string[];
};
export type ConsentRow = {
  ts: string;
  principal: string;
  type: 'Candidate' | 'Employee';
  purposes: string;
  notice: string;
  lang: string;
  action: 'Granted' | 'Withdrawn' | 'Clock expired';
};

/** The client's hosted privacy centre and request inbox. */
export type PrivacyCentre = {
  url: string;
  contactEmail: string;
  /** Forwarding address: requests that arrive by email land in the DSR desk. */
  inbox: string;
  /** Null until designated — shown as a gap on the public page. */
  grievanceOfficer: string | null;
  responseDays: number;
  languages: string[];
  consentSnippet: string;
};

export type CheckInQuestion = {
  id: 'tools' | 'retired' | 'headcount' | 'purposes' | 'clients' | 'offplatform';
  kind: 'yesno' | 'number';
  text: string;
  register: string;
  placeholder: string;
};
/** The quarterly re-attestation that keeps the register current. */
export type CheckIn = {
  label: string;
  due: string;
  sentTo: string;
  sentOn: string;
  last: { on: string; changes: number };
  questions: CheckInQuestion[];
};

/** One item on the next walkthrough's agenda, generated from the register. */
export type AgendaItem = { id: string; system: string; looked: string; register: string; why: string; finding?: string };

/** Where the discovery interview stands, and the question in front of the client. */
export type Questionnaire = {
  section: number;
  sections: number;
  sectionName: string;
  answered: number;
  total: number;
  question: string;
  why: string;
  suggestion: string;
  followUps: string[];
  derived: { field: string; value: string; provenance: Provenance }[];
};

/**
 * One client's data, as every console page reads it. The mock serves it from
 * mock/clients.ts; a live app's data layer returns the same shape.
 */
export type ClientData = {
  /** False until discovery has produced a register: modules built from it show "not started". */
  registerBuilt: boolean;
  /** Who holds each owner role in the client. */
  owners: Record<string, string>;
  /** The client's people who can be @mentioned. */
  people: { name: string; role: string }[];

  activities: Activity[];
  gaps: Gap[];
  dsrs: Dsr[];
  incidents: Incident[];
  tasks: FulfilmentTask[];
  evidence: EvidenceItem[];
  questionnaire: Questionnaire | null;
  /** Systems and recipients, and the transfers between them — the map is derived from these (flowGraph). */
  parties: Party[];
  transfers: Transfer[];
  privacyCentre: PrivacyCentre | null;
  walkthrough: Walkthrough | null;
  walkthroughAgenda: AgendaItem[];
  checkIn: CheckIn | null;
  audit: AuditEntry[];
  comments: RecordComment[];
  scoreHistory: { on: string; score: number }[];
  boardIntimation: ComplianceDoc | null;

  consent: {
    summary: ConsentSummary;
    ledger: ConsentRow[];
    /** Purposes that need consent rather than the employment exemption. */
    employeeConsentPurposes: string[];
  } | null;

  /** Overview: module completion, as the consultant last assessed it. */
  progress: { module: string; seg: string; pct: number; note: string }[];
  /** Overview: role determination, as counted on the register. */
  roles: { fiduciary: { count: number; text: string }; exempt: { count: number; text: string } } | null;
  /** RoPA: how lawful bases break down, with a line on each. */
  basisBreakdown: { label: string; count: number; note: string }[];
  /** RoPA: processors and their contract status. */
  processors: { name: string; activities: string; dpa: string }[];
  /** DSR desk: the request worked through in detail, when there is one. */
  dsrFocus: string | null;
  /** Data flows: the cross-border position in words. */
  crossBorder: { title: string; text: string; tone: 'plain' | 'ok' }[];
};
