/**
 * One client's data, as every console page reads it: `clientData(slug)`.
 * Northstar is the fully worked example; Quadrant is a mature programme with
 * its own register; Meridian is in discovery, so nothing has been built from
 * its interview yet. A live app replaces this module with a data layer that
 * returns the same shape — pages never import a client's data directly.
 */
import type {
  Activity, Dsr, FlowEdge, FlowNode, FulfilmentTask, Gap, Incident, Provenance, Walkthrough,
} from '../types';
import {
  ACTIVITIES, AUDIT, BOARD_INTIMATION, CHECK_IN, COMMENTS, CONSENT_LEDGER, CONSENT_SUMMARY, DSRS, EVIDENCE_PACK,
  FLOW_EDGES, FLOW_NODES, GAPS, INCIDENTS, OWNERS, PRIVACY_CENTRE, QUESTIONNAIRE, SCORE_HISTORY, TASKS, WALKTHROUGH,
  WALKTHROUGH_AGENDA, type AuditEntry, type ComplianceDoc, type RecordComment,
} from './data';
import { MERIDIAN } from './meridian';
import { QUADRANT } from './quadrant';

export type EvidenceItem = { name: string; status: 'Generated' | 'Review pending' | 'Incomplete' | 'Not started'; detail: string; ts: string };
export type ConsentRow = { ts: string; principal: string; type: string; purposes: string; notice: string; lang: string; action: string };
export type CheckIn = typeof CHECK_IN;
export type Questionnaire = Omit<typeof QUESTIONNAIRE, 'derived'> & {
  derived: { field: string; value: string; provenance: Provenance }[];
};
export type PrivacyCentre = typeof PRIVACY_CENTRE;
export type AgendaItem = (typeof WALKTHROUGH_AGENDA)[number];

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
  flowNodes: FlowNode[];
  flowEdges: FlowEdge[];
  privacyCentre: PrivacyCentre | null;
  walkthrough: Walkthrough | null;
  walkthroughAgenda: AgendaItem[];
  checkIn: CheckIn | null;
  audit: AuditEntry[];
  comments: RecordComment[];
  scoreHistory: { on: string; score: number }[];
  boardIntimation: ComplianceDoc | null;

  consent: {
    summary: typeof CONSENT_SUMMARY;
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

const NORTHSTAR: ClientData = {
  registerBuilt: true,
  owners: OWNERS,
  people: [
    { name: 'Meera Joshi', role: 'HR Operations Manager' },
    { name: 'Ritu Sharma', role: 'Head of Talent Acquisition' },
    { name: 'Farhan Qureshi', role: 'Marketing Lead' },
    { name: 'Kiran Rao', role: 'Legal & Compliance' },
    { name: 'Anil Deshmukh', role: 'IT Manager' },
    { name: 'Vikram Iyer', role: 'Chief Information Security Officer' },
  ],
  activities: ACTIVITIES,
  gaps: GAPS,
  dsrs: DSRS,
  incidents: INCIDENTS,
  tasks: TASKS,
  evidence: EVIDENCE_PACK as EvidenceItem[],
  questionnaire: QUESTIONNAIRE,
  flowNodes: FLOW_NODES,
  flowEdges: FLOW_EDGES,
  privacyCentre: PRIVACY_CENTRE,
  walkthrough: WALKTHROUGH,
  walkthroughAgenda: WALKTHROUGH_AGENDA,
  checkIn: CHECK_IN,
  audit: AUDIT,
  comments: COMMENTS,
  scoreHistory: SCORE_HISTORY.northstar,
  boardIntimation: BOARD_INTIMATION,
  consent: {
    summary: CONSENT_SUMMARY,
    ledger: CONSENT_LEDGER,
    employeeConsentPurposes: [
      'Candidate screening and background verification',
      'Dependant enrolment in the group policy, including 61 minors',
      'Employee photographs used in marketing',
      'Optional wellness programme participation',
      'Alumni communications after exit',
    ],
  },
  progress: [
    { module: 'Scope & role register', seg: 'ropa', pct: 86, note: '19 activities mapped, 25 questions open' },
    { module: 'Notice & consent', seg: 'consent', pct: 54, note: 'notice v3 published, candidate capture live' },
    { module: 'DSR & grievance desk', seg: 'dsr', pct: 40, note: 'intake live, no grievance contact published' },
    { module: 'Breach register', seg: 'breach', pct: 25, note: 'register opened, SOP not signed off' },
    { module: 'Evidence & audit pack', seg: 'evidence', pct: 69, note: '9 of 13 artefacts generated' },
  ],
  roles: {
    fiduciary: { count: 17, text: 'Employee, candidate, ex-employee, dependant, visitor, vendor and prospect data. Obligations apply in full.' },
    exempt: { count: 2, text: 'Offshore delivery for the US payer and the UK retailer. Principals are outside India under contract with a person outside India.' },
  },
  basisBreakdown: [
    { label: 's.7(i) employment purposes', count: 7, note: 'Payroll, attendance, performance, onboarding, exit — no consent needed' },
    { label: 's.7(i) safeguarding', count: 3, note: 'CCTV, visitor register, IT monitoring and DLP' },
    { label: 'Legal obligation', count: 3, note: 'PF/ESIC/PT/TDS filings, POSH records, vendor financial records' },
    { label: 'Consent', count: 4, note: 'Candidate screening and BGV, dependant enrolment, website enquiries' },
    { label: 's.17(1)(d) exempt', count: 2, note: 'Offshore delivery for the US and UK clients' },
    { label: 'Not determined', count: 1, note: 'Alumni marketing — raised as G-06' },
  ],
  processors: [
    { name: 'Zoho Corporation', activities: 'PA-01, PA-04, PA-19', dpa: 'Executed 12 Apr 2024' },
    { name: 'Keka Technologies', activities: 'PA-03, PA-07, PA-11', dpa: 'Executed 03 Jun 2024' },
    { name: 'AuthBridge Research Services', activities: 'PA-02', dpa: 'MISSING' },
    { name: 'Niva Bupa', activities: 'PA-09', dpa: 'Executed 01 Apr 2026' },
    { name: 'Marsh India (broker)', activities: 'PA-09', dpa: 'MISSING' },
    { name: 'Matrix Comsec', activities: 'PA-06', dpa: 'Executed 20 Jan 2025' },
    { name: 'Intuit Mailchimp', activities: 'PA-12', dpa: 'Standard terms accepted' },
    { name: 'Microsoft', activities: 'PA-15', dpa: 'DPA via enterprise agreement' },
    { name: 'Forcepoint', activities: 'PA-15', dpa: 'Executed 15 Feb 2025' },
    { name: 'HubSpot', activities: 'PA-18', dpa: 'Standard terms accepted' },
  ],
  dsrFocus: 'DSR-2026-0041',
  crossBorder: [
    { title: 'United States — 4 transfers', text: 'Mapped: Mailchimp (PA-12), Forcepoint (PA-15). Also on the register: client LMS (PA-08), HubSpot (PA-18).', tone: 'plain' },
    { title: 'United Kingdom — exempt', text: 'PA-17 client delivery. Principals are outside India under contract with a person outside India.', tone: 'ok' },
  ],
};

const BY_SLUG: Record<string, ClientData> = { northstar: NORTHSTAR, quadrant: QUADRANT, meridian: MERIDIAN };

export const clientData = (slug: string): ClientData => BY_SLUG[slug] ?? NORTHSTAR;

/**
 * What the client-branded public pages show. A client without a hosted privacy
 * centre (Meridian publishes an email address only) still gets the staff
 * incident form and a preview, marked as not live.
 */
export const publicCentre = (slug: string): PrivacyCentre & { live: boolean } => {
  const pc = clientData(slug).privacyCentre;
  if (pc) return { ...pc, live: true };
  return {
    url: 'not live yet — preview',
    contactEmail: slug === 'meridian' ? 'privacy@meridiansupport.in' : `privacy@${slug}.in`,
    inbox: `requests.${slug}@in.datasentry.in`,
    grievanceOfficer: null,
    responseDays: 30,
    languages: ['English'],
    consentSnippet: '',
    live: false,
  };
};
