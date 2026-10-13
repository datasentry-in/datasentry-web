/**
 * One client's data, as every console page reads it: `clientData(slug)`.
 * Northstar is the fully worked example; Quadrant is a mature programme with
 * its own register; Meridian is in discovery, so nothing has been built from
 * its interview yet. A live app replaces this module with a data layer that
 * returns the same shape — pages never import a client's data directly.
 */
import type {
  AuditEntry, ClientData, Org, OrgProfile, PrivacyCentre,
} from '../types';
import {
  ACTIVITIES, AUDIT, BOARD_INTIMATION, CHECK_IN, CLIENT_THEME, COMMENTS, CONSENT_LEDGER, CONSENT_SUMMARY, CONSULTANT,
  DSRS, EVIDENCE_PACK, FLOW_EDGES, FLOW_NODES, GAPS, INCIDENTS, OWNERS, PEOPLE, PRIVACY_CENTRE, PROFILES, QUESTIONNAIRE,
  SCORE_HISTORY, TASKS, WALKTHROUGH, WALKTHROUGH_AGENDA, lastSignIn,
} from './data';
import { MERIDIAN } from './meridian';
import { QUADRANT } from './quadrant';

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
  evidence: EVIDENCE_PACK,
  questionnaire: QUESTIONNAIRE,
  flowNodes: FLOW_NODES,
  flowEdges: FLOW_EDGES,
  privacyCentre: PRIVACY_CENTRE,
  walkthrough: WALKTHROUGH,
  walkthroughAgenda: WALKTHROUGH_AGENDA,
  checkIn: CHECK_IN,
  audit: AUDIT,
  comments: COMMENTS,
  scoreHistory: SCORE_HISTORY,
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

/** A client's data. Callers resolve the slug with `findOrg` first; unknown slugs are a 404. */
export const clientData = (slug: string): ClientData => BY_SLUG[slug];

/** A client's counts, computed from its own data so they can never disagree with the pages. */
function summaryOf(p: OrgProfile): Org {
  const d = BY_SLUG[p.slug];
  const sev = (s: 'High' | 'Medium' | 'Low') => d.gaps.filter((g) => g.severity === s).length;
  return {
    ...p,
    openGaps: { high: sev('High'), medium: sev('Medium'), low: sev('Low') },
    activities: d.activities.length,
    exemptActivities: d.activities.filter((a) => a.role === 'Exempt').length,
    dsrOpen: d.dsrs.filter((r) => r.status !== 'Closed').length,
    incidentOpen: d.incidents.filter((i) => i.status === 'Open').length,
  };
}

/** Every client, with computed counts — the portfolio, switcher and palette read this. */
export const ORGS: Org[] = PROFILES.map(summaryOf);

/** The client for a slug, or undefined — pages turn undefined into a 404. */
export const findOrg = (slug: string): Org | undefined => ORGS.find((o) => o.slug === slug);

/** The client for a slug that is known to exist (inside a resolved route). */
export const getOrg = (slug: string): Org => findOrg(slug) ?? ORGS[0];

/** The client's brand colours, for white-labelled public pages and the client mark. */
export const clientTheme = (slug: string) => CLIENT_THEME[slug] ?? CLIENT_THEME.northstar;

/** The signed-in consultant. */
export const currentUser = CONSULTANT;
export { lastSignIn };

/** The DataSentry team — mentionable on every client's records. */
export const TEAM = PEOPLE.filter((p) => p.side === 'DataSentry');

/** A record's audit trail: entries on the record, or that name it. */
export const auditFor = (d: ClientData, ref: string): AuditEntry[] => d.audit.filter((e) => e.ref === ref || e.what.includes(ref));

/** The person who holds an owner role, as `Person` props; the role itself when no one is named. */
export const personFor = (owners: Record<string, string>, role: string): { name: string; role?: string } =>
  owners[role] ? { name: owners[role], role } : { name: role };

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
