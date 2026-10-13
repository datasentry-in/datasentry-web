// Mock data for the DataSentry DPDP platform demo.
// Figures are illustrative and shaped to look like a real 240-seat ITES firm.
// The live app replaces this module with a real data layer; the types live in ../types.ts.

import type {
  Activity, AgendaItem, AuditEntry, CheckIn, ComplianceDoc, ConsentRow, ConsentSummary, Dsr, EvidenceItem, FlowEdge,
  FlowNode, FulfilmentTask, Gap, Incident, OrgProfile, PrivacyCentre, Questionnaire, RecordComment, Walkthrough,
} from '../types';

export const CONSULTANT = {
  name: 'Dharita Gada',
  firm: 'DataSentry',
  role: 'Consultant Admin',
  email: 'dharita.gada@datasentry.in',
  initials: 'DG',
};

/**
 * Last sign-in, read off the clock rather than frozen into the mock: 09:12 IST
 * today once that hour has passed, otherwise the same time yesterday, so the
 * line is always in the past and always current.
 *
 * Call this from client-rendered markup only — a prerendered build would bake
 * in the build date and then disagree with the browser on hydration.
 */
export function lastSignIn() {
  const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const at = new Date(ist);
  at.setHours(9, 12, 0, 0);
  if (at > ist) at.setDate(at.getDate() - 1);
  const date = at.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${date}, 09:12 IST · Mumbai`;
}

/** Client profiles. Counts are computed from each client's data (mock/clients.ts). */
export const PROFILES: OrgProfile[] = [
  {
    slug: 'northstar',
    name: 'Northstar BPO Services Pvt Ltd',
    sector: 'ITES — voice & claims processing',
    headcount: 240,
    locations: 'Pune, Bengaluru',
    score: 42,
    trend: '+11 since Aug',
    engagement: 'Readiness assessment — Phase 2 of 3',
    lastReview: '08 Oct 2026',
  },
  {
    slug: 'quadrant',
    name: 'Quadrant Analytics LLP',
    sector: 'ITES — data annotation',
    headcount: 95,
    locations: 'Hyderabad',
    score: 67,
    trend: '+24 since Jul',
    engagement: 'Readiness assessment — Phase 3 of 3',
    lastReview: '02 Oct 2026',
  },
  {
    slug: 'meridian',
    name: 'Meridian Support Solutions',
    sector: 'ITES — technical helpdesk',
    headcount: 410,
    locations: 'Chennai, Coimbatore',
    score: 19,
    trend: 'baseline',
    engagement: 'Discovery — Phase 1 of 3',
    lastReview: '09 Oct 2026',
  },
];


export const ACTIVITIES: Activity[] = [
  {
    id: 'PA-01', name: 'Recruitment & applicant tracking', department: 'Human Resources',
    purpose: 'Evaluate applicants against open roles and maintain a talent pool',
    principals: 'Candidate', items: 14, systems: ['Zoho Recruit', 'Gmail'],
    role: 'Fiduciary', basis: 'Consent', retention: '180 days from application',
    processors: ['Zoho Corporation'], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-02', name: 'Pre-employment background verification', department: 'Human Resources',
    purpose: 'Verify identity, education, employment history and criminal record',
    principals: 'Candidate', items: 11, systems: ['AuthBridge portal', 'Google Drive'],
    role: 'Fiduciary', basis: 'Consent', retention: '3 years from verification',
    processors: ['AuthBridge Research Services'], crossBorder: null, provenance: 'consultant_reviewed',
  },
  {
    id: 'PA-03', name: 'Offer issuance & onboarding documentation', department: 'Human Resources',
    purpose: 'Constitute the employment contract and statutory personnel file',
    principals: 'Employee', items: 22, systems: ['Keka HR', 'Google Drive'],
    role: 'Fiduciary', basis: 's.7(i) employment', retention: '8 years post-exit',
    processors: ['Keka Technologies'], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-04', name: 'Payroll processing', department: 'Finance',
    purpose: 'Compute and disburse salary, reimbursements and deductions',
    principals: 'Employee', items: 17, systems: ['Zoho Payroll', 'ICICI corporate banking'],
    role: 'Fiduciary', basis: 's.7(i) employment', retention: '8 years from financial year',
    processors: ['Zoho Corporation'], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-05', name: 'Statutory filings — PF, ESIC, PT, TDS', department: 'Finance',
    purpose: 'Discharge employer obligations under PF, ESI, Professional Tax and Income Tax',
    principals: 'Employee', items: 12, systems: ['EPFO portal', 'ESIC portal', 'TRACES'],
    role: 'Fiduciary', basis: 'Legal obligation', retention: 'As prescribed per statute',
    processors: [], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-06', name: 'Attendance & biometric access control', department: 'Administration',
    purpose: 'Record attendance and control physical access to the delivery floor',
    principals: 'Employee', items: 6, systems: ['Matrix COSEC', 'Keka HR'],
    role: 'Fiduciary', basis: 's.7(i) employment', retention: 'Not stated',
    processors: ['Matrix Comsec'], crossBorder: null, provenance: 'consultant_reviewed',
  },
  {
    id: 'PA-07', name: 'Performance management', department: 'Human Resources',
    purpose: 'Appraise performance and determine increments and promotions',
    principals: 'Employee', items: 9, systems: ['Keka HR'],
    role: 'Fiduciary', basis: 's.7(i) employment', retention: '3 years',
    processors: ['Keka Technologies'], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-08', name: 'Learning & certification records', department: 'Human Resources',
    purpose: 'Track mandatory client-process certification and refresher training',
    principals: 'Employee', items: 7, systems: ['Google Sheets', 'Client LMS'],
    role: 'Fiduciary', basis: 's.7(i) employment', retention: '5 years',
    processors: [], crossBorder: 'United States (client LMS)', provenance: 'consultant_reviewed',
  },
  {
    id: 'PA-09', name: 'Group mediclaim & dependant enrolment', department: 'Human Resources',
    purpose: 'Enrol employees and their dependants in the group health policy',
    principals: 'Employee, Dependant (incl. minors)', items: 13, systems: ['Insurer portal', 'Google Sheets'],
    role: 'Fiduciary', basis: 'Consent', retention: 'Policy term + 2 years',
    processors: ['Niva Bupa', 'Marsh India (broker)'], crossBorder: null, provenance: 'consultant_reviewed',
  },
  {
    id: 'PA-10', name: 'POSH / Internal Committee proceedings', department: 'Human Resources',
    purpose: 'Receive, inquire into and record sexual harassment complaints',
    principals: 'Employee', items: 10, systems: ['Sealed physical file', 'Google Drive (restricted)'],
    role: 'Fiduciary', basis: 'Legal obligation', retention: '3 years from disposal',
    processors: [], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-11', name: 'Exit & full-and-final settlement', department: 'Human Resources',
    purpose: 'Process resignation, clearance, recovery and final dues',
    principals: 'Ex-employee', items: 15, systems: ['Keka HR', 'Zoho Payroll'],
    role: 'Fiduciary', basis: 's.7(i) employment', retention: '8 years post-exit',
    processors: ['Keka Technologies'], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-12', name: 'Alumni communications', department: 'Marketing',
    purpose: 'Send rehire openings and company news to former employees',
    principals: 'Ex-employee', items: 4, systems: ['Mailchimp'],
    role: 'Fiduciary', basis: 'Not determined', retention: 'Indefinite',
    processors: ['Intuit Mailchimp'], crossBorder: 'United States', provenance: 'ai_suggested',
  },
  {
    id: 'PA-13', name: 'CCTV surveillance', department: 'Administration',
    purpose: 'Physical security of premises and client-mandated floor monitoring',
    principals: 'Employee, Visitor', items: 3, systems: ['Hikvision NVR (on-premise)'],
    role: 'Fiduciary', basis: 's.7(i) safeguarding', retention: '30 days rolling',
    processors: [], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-14', name: 'Visitor management register', department: 'Administration',
    purpose: 'Record and badge visitors to the delivery centre',
    principals: 'Visitor', items: 6, systems: ['Reception register (paper)', 'Google Forms'],
    role: 'Fiduciary', basis: 's.7(i) safeguarding', retention: '1 year',
    processors: [], crossBorder: null, provenance: 'consultant_reviewed',
  },
  {
    id: 'PA-15', name: 'IT monitoring & data loss prevention', department: 'Information Technology',
    purpose: 'Detect exfiltration of client data from managed endpoints',
    principals: 'Employee', items: 8, systems: ['Microsoft Defender', 'Forcepoint DLP'],
    role: 'Fiduciary', basis: 's.7(i) safeguarding', retention: '90 days',
    processors: ['Microsoft', 'Forcepoint'], crossBorder: 'United States', provenance: 'consultant_reviewed',
  },
  {
    id: 'PA-16', name: 'Client delivery — US healthcare claims', department: 'Operations',
    purpose: 'Adjudicate claims on behalf of a US payer under MSA dated 14 Feb 2024',
    principals: 'Client end-users (United States)', items: 21, systems: ['Client VDI (no local storage)'],
    role: 'Exempt', basis: 's.17(1)(d) exempt', retention: 'Per MSA — no local retention',
    processors: [], crossBorder: 'Data remains in client environment (US)', provenance: 'client_confirmed',
  },
  {
    id: 'PA-17', name: 'Client delivery — UK retail support', department: 'Operations',
    purpose: 'Tier-1 customer support for a UK retailer under MSA dated 03 Sep 2025',
    principals: 'Client end-users (United Kingdom)', items: 9, systems: ['Client Zendesk tenant'],
    role: 'Exempt', basis: 's.17(1)(d) exempt', retention: 'Per MSA — no local retention',
    processors: [], crossBorder: 'Data remains in client environment (UK)', provenance: 'consultant_reviewed',
  },
  {
    id: 'PA-18', name: 'Website enquiry & lead capture', department: 'Marketing',
    purpose: 'Respond to sales enquiries and nurture prospects',
    principals: 'Prospect', items: 5, systems: ['Website form', 'HubSpot'],
    role: 'Fiduciary', basis: 'Consent', retention: '2 years',
    processors: ['HubSpot'], crossBorder: 'United States', provenance: 'consultant_reviewed',
  },
  {
    id: 'PA-19', name: 'Vendor & contractor management', department: 'Finance',
    purpose: 'Onboard, contract with and pay vendors and independent contractors',
    principals: 'Vendor contact', items: 11, systems: ['Zoho Books', 'Google Drive'],
    role: 'Fiduciary', basis: 'Legal obligation', retention: '7 years',
    processors: ['Zoho Corporation'], crossBorder: null, provenance: 'client_confirmed',
  },
];

export const GAPS: Gap[] = [
  {
    id: 'G-01', severity: 'High',
    title: 'Candidate records retained far beyond the declared purpose',
    detail: '4,812 candidate records in Zoho Recruit are older than the declared 180-day talent-pool period. The oldest is 4 years 2 months. No erasure trigger is configured and no purge has ever run.',
    provision: 's.8(7) read with Rule 8', activity: 'PA-01 Recruitment & applicant tracking',
    owner: 'Head of Talent Acquisition', due: '15 Nov 2026',
    evidence: 'Walkthrough 09 Oct 2026 — candidate list viewed on screen in Zoho Recruit: 6,431 records, oldest Aug 2022, no purge rule',
    basis: 'observed',
  },
  {
    id: 'G-02', severity: 'High',
    title: 'Background verification vendor engaged without a data processing agreement',
    detail: 'AuthBridge processes candidate identity, education, employment and criminal-record data under a purchase order only. There is no written contract covering purpose limitation, security, sub-processing, breach notification or return and erasure on termination.',
    provision: 's.8(2)', activity: 'PA-02 Pre-employment background verification',
    owner: 'Legal & Compliance', due: '30 Nov 2026',
    evidence: 'Vendor file reviewed on the walkthrough — PO 2024/BGV/117, no MSA on record',
    basis: 'observed',
  },
  {
    id: 'G-03', severity: 'High',
    title: 'Job application form asks for one blanket consent, with no itemised notice',
    detail: 'The application form collects 14 distinct data items behind a single "I agree to the Privacy Policy" checkbox. There is no itemised description of data with a purpose per item, no withdrawal link, and no route to complain to the Data Protection Board.',
    provision: 'Rule 3 read with s.5 and s.6', activity: 'PA-01 Recruitment & applicant tracking',
    owner: 'Head of Talent Acquisition', due: '31 Dec 2026',
    evidence: 'Public form reviewed — careers.northstarbpo.in/apply, 08 Oct 2026',
    basis: 'observed',
  },
  {
    id: 'G-04', severity: 'High',
    title: 'No breach response procedure and no incident register',
    detail: 'There is no documented procedure for identifying, escalating or notifying a personal data breach, and no register of past incidents. Rule 7 requires intimation to the Board within 72 hours of becoming aware, with no severity threshold, and intimation to affected principals without delay.',
    provision: 'Rule 7 read with s.8(6)', activity: 'All activities',
    owner: 'Chief Information Security Officer', due: '30 Nov 2026',
    evidence: null,
  },
  {
    id: 'G-05', severity: 'Medium',
    title: 'Dependant data for 61 minors held without verifiable guardian consent',
    detail: 'The group mediclaim roster includes 61 dependants recorded as under 18. Enrolment was collected from the employee without any guardian verification step, and no separate notice was issued.',
    provision: 's.9', activity: 'PA-09 Group mediclaim & dependant enrolment',
    owner: 'HR Operations Manager', due: '31 Jan 2027',
    evidence: 'Declared in discovery by the HR Operations Manager — 61 dependants under 18 on the mediclaim roster',
    basis: 'declared',
  },
  {
    id: 'G-06', severity: 'Medium',
    title: 'Alumni mailing list of 1,340 ex-employees has no lawful basis on record',
    detail: 'Marketing mails rehire openings and company news to 1,340 former employees. No consent was captured at exit, and s.7(i) does not extend to marketing after the employment relationship has ended. Basis is recorded as Not determined.',
    provision: 's.6 read with s.4', activity: 'PA-12 Alumni communications',
    owner: 'Marketing Lead', due: '15 Dec 2026',
    evidence: 'Walkthrough 09 Oct 2026 — Mailchimp audience of 1,340 viewed on screen, no consent field',
    basis: 'observed',
  },
  {
    id: 'G-07', severity: 'Medium',
    title: 'Active Google Workspace accounts for 23 departed employees',
    detail: 'On the walkthrough, the Workspace admin console showed 23 enabled accounts belonging to employees who have left. The oldest exit was 14 months ago. Four of these accounts retain access to the shared HR drive.',
    provision: 's.8(4) reasonable security safeguards', activity: 'PA-11 Exit & full-and-final settlement',
    owner: 'IT Manager', due: '25 Oct 2026',
    evidence: 'Walkthrough 09 Oct 2026 — Workspace admin console checked against the leavers HR named on the call',
    basis: 'observed',
  },
  {
    id: 'G-08', severity: 'Medium',
    title: 'Payroll folder on Google Drive is shared with anyone holding the link',
    detail: 'The folder HR/Payroll/FY26 is set to "Anyone with the link — Viewer". It contains 12 monthly registers covering 240 employees with salary, PAN, bank account and PF number.',
    provision: 's.8(4) reasonable security safeguards', activity: 'PA-04 Payroll processing',
    owner: 'IT Manager', due: '18 Oct 2026',
    evidence: 'Walkthrough 09 Oct 2026 — folder sharing settings viewed on screen',
    basis: 'observed',
  },
  {
    id: 'G-09', severity: 'Medium',
    title: 'No grievance mechanism or contact person published',
    detail: 'Neither the website nor the employee handbook designates a person to answer questions about processing, and there is no published grievance route. Data principals currently have no address at which to exercise rights.',
    provision: 's.13 read with s.5(1)(c)', activity: 'All activities',
    owner: 'Company Secretary', due: '30 Nov 2026',
    evidence: null,
  },
  {
    id: 'G-10', severity: 'Medium',
    title: 'Biometric attendance has no stated retention and no alternative',
    detail: 'Fingerprint templates are held in the Matrix COSEC controller with no retention period defined and no purge. Employees are not offered a non-biometric means of marking attendance, which weakens the claim that the processing is necessary for the employment purpose.',
    provision: 's.8(7) read with s.7(i)', activity: 'PA-06 Attendance & biometric access control',
    owner: 'Administration Head', due: '31 Jan 2027',
    evidence: 'Controller settings viewed on screen, 08 Oct 2026',
    basis: 'observed',
  },
  {
    id: 'G-11', severity: 'Low',
    title: 'Offshore delivery exemption claimed without mapped contract evidence',
    detail: 'PA-16 and PA-17 are recorded as exempt under s.17(1)(d). The MSAs are on file but the specific clauses establishing that the principals are outside India and that the counterparty is a person outside India have not been extracted and linked.',
    provision: 's.17(1)(d)', activity: 'PA-16, PA-17 Client delivery',
    owner: 'Legal & Compliance', due: '28 Feb 2027',
    evidence: 'MSA 14 Feb 2024; MSA 03 Sep 2025 — named by Legal, clauses not yet linked',
    basis: 'declared',
  },
  {
    id: 'G-12', severity: 'Low',
    title: 'No nomination register maintained',
    detail: 'Section 14 entitles a data principal to nominate another individual to exercise their rights in the event of death or incapacity. No facility to record a nomination exists.',
    provision: 's.14', activity: 'All activities',
    owner: 'HR Operations Manager', due: '31 Mar 2027',
    evidence: null,
  },
  {
    id: 'G-13', severity: 'Low',
    title: 'Website enquiry data retained two years with no erasure trigger',
    detail: 'HubSpot retains enquiry records for two years by policy, but nothing links the retention period to the stated purpose of responding to the enquiry, and no erasure runs at expiry.',
    provision: 's.8(7)', activity: 'PA-18 Website enquiry & lead capture',
    owner: 'Marketing Lead', due: '31 Mar 2027',
    evidence: null,
  },
  {
    id: 'G-14', severity: 'Low',
    title: 'Vendor contact retention of seven years not tied to a stated purpose',
    detail: 'Vendor contact records follow the financial-records retention period of seven years. The contact details of individual vendor representatives are not themselves financial records and no separate purpose has been articulated.',
    provision: 's.8(7)', activity: 'PA-19 Vendor & contractor management',
    owner: 'Finance Controller', due: '31 Mar 2027',
    evidence: null,
  },
];

export const DSRS: Dsr[] = [
  {
    id: 'DSR-2026-0041', type: 'Erasure', principal: 'Priya Raghunathan',
    relationship: 'Ex-employee — exited 22 Mar 2024', received: '08 Oct 2026', channel: 'Privacy centre', status: 'In progress',
    conflicts: [
      { record: 'Provident Fund member records', statute: 'EPF & MP Act, 1952', until: 'Statutory — not erasable' },
      { record: 'Form 16 / TDS records', statute: 'Income Tax Act, 1961 r/w Rule 31', until: '31 Mar 2031' },
      { record: 'ICC complaint record (respondent)', statute: 'POSH Act, 2013 — s.21 reporting', until: '14 Jun 2027' },
      { record: 'Payroll register FY24', statute: 'Maharashtra Shops & Establishments Act', until: '31 Mar 2032' },
    ],
  },
  {
    id: 'DSR-2026-0040', type: 'Access', principal: 'Arun Kelkar',
    relationship: 'Ex-employee — exited 11 Jan 2026', received: '30 Sep 2026', channel: 'Email', status: 'In progress',
  },
  {
    id: 'DSR-2026-0039', type: 'Grievance', principal: 'Sneha Dutta',
    relationship: 'Current employee', received: '23 Sep 2026', channel: 'Privacy centre', status: 'Awaiting client',
    outcome: 'Objects to fingerprint capture for attendance; asks for a card-based alternative',
  },
  {
    id: 'DSR-2026-0038', type: 'Correction', principal: 'Mohammed Irfan',
    relationship: 'Candidate — applied 02 Sep 2026', received: '14 Sep 2026', status: 'Closed',
    outcome: 'Corrected — total experience amended from 4y to 6y 3m. Closed in 6 days.',
  },
  {
    id: 'DSR-2026-0037', type: 'Erasure', principal: 'Kavya Nair',
    relationship: 'Candidate — not selected', received: '09 Sep 2026', status: 'Closed',
    outcome: 'Fully honoured — ATS record and BGV file erased, vendor instructed. Closed in 2 days.',
  },
  {
    id: 'DSR-2026-0036', type: 'Nomination', principal: 'Rajesh Pillai',
    relationship: 'Current employee', received: '28 Aug 2026', status: 'Closed',
    outcome: 'Nominee recorded — spouse, with identity verified.',
  },
];

export const INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-003',
    title: 'Monthly payroll register emailed to the wrong distribution list',
    awareness: '10 Oct 2026, 14:20 IST',
    deadline: '13 Oct 2026, 14:20 IST',
    deadlineIso: '2026-10-13T14:20:00+05:30',
    affected: 240,
    categories: 'Name, employee ID, designation, gross and net salary, PAN, bank account number, PF number',
    status: 'Open',
    boardIntimation: 'Drafted — not yet sent',
    principalNotice: 'Drafted — not yet sent',
  },
  {
    id: 'INC-2026-002',
    title: 'Laptop lost in transit with cached candidate CVs',
    awareness: '04 Aug 2026, 09:05 IST',
    deadline: '07 Aug 2026, 09:05 IST',
    affected: 38,
    categories: 'Name, contact details, CV contents',
    status: 'Closed',
    boardIntimation: 'Sent 05 Aug 2026, 16:40 IST',
    principalNotice: 'Sent 05 Aug 2026 to 38 candidates',
  },
  {
    id: 'INC-2026-001',
    title: 'Shared mailbox credentials found in a public code repository',
    awareness: '19 May 2026, 11:30 IST',
    deadline: '22 May 2026, 11:30 IST',
    affected: 0,
    categories: 'No personal data accessed — credentials rotated before use',
    status: 'Closed',
    boardIntimation: 'Sent 19 May 2026, 18:10 IST — nil impact recorded',
    principalNotice: 'Not applicable',
  },
];

export const CONSENT_SUMMARY: ConsentSummary = {
  activeCandidate: 1284,
  withdrawn: 96,
  expiredClock: 212,
  pendingErasureTasks: 18,
  employeeExceptions: 171,
  noticeVersion: 'v3 — published 01 Oct 2026',
  languages: ['English', 'Hindi', 'Marathi', 'Kannada'],
};

export const CONSENT_LEDGER: ConsentRow[] = [
  { ts: '10 Oct 2026, 11:42', principal: 'Nikhil Barve', type: 'Candidate', purposes: 'Screening, BGV, Talent pool 180d', notice: 'v3', lang: 'English', action: 'Granted' },
  { ts: '10 Oct 2026, 10:18', principal: 'Shalini Menon', type: 'Candidate', purposes: 'Screening, BGV', notice: 'v3', lang: 'Marathi', action: 'Granted' },
  { ts: '09 Oct 2026, 17:55', principal: 'Deepa Krishnan', type: 'Candidate', purposes: 'Talent pool 180d', notice: 'v2', lang: 'English', action: 'Withdrawn' },
  { ts: '09 Oct 2026, 16:02', principal: 'Imran Shaikh', type: 'Employee', purposes: 'Wellness programme, Photo on website', notice: 'v3', lang: 'Hindi', action: 'Granted' },
  { ts: '09 Oct 2026, 14:30', principal: 'Anita Deshpande', type: 'Employee', purposes: 'Dependant enrolment (2 dependants)', notice: 'v3', lang: 'Marathi', action: 'Granted' },
  { ts: '08 Oct 2026, 19:11', principal: 'Vikram Rao', type: 'Candidate', purposes: 'Screening, Share with client for staffing', notice: 'v3', lang: 'Kannada', action: 'Granted' },
  { ts: '08 Oct 2026, 12:47', principal: 'Farah Qureshi', type: 'Candidate', purposes: 'Talent pool 180d', notice: 'v2', lang: 'English', action: 'Clock expired' },
];

export const EVIDENCE_PACK: EvidenceItem[] = [
  { name: 'Record of Processing Activities', status: 'Generated', detail: '19 activities, RoPA v4', ts: '08 Oct 2026' },
  { name: 'Role determination memo', status: 'Generated', detail: '17 Fiduciary, 2 exempt under s.17(1)(d)', ts: '08 Oct 2026' },
  { name: 'Data flow map', status: 'Generated', detail: '11 systems, 4 cross-border destinations', ts: '08 Oct 2026' },
  { name: 'Gap report with remediation plan', status: 'Generated', detail: '14 findings — 4 High, 6 Medium, 4 Low', ts: '08 Oct 2026' },
  { name: 'Employee privacy notice', status: 'Generated', detail: 'EN, HI, MR, KN — notice v3', ts: '01 Oct 2026' },
  { name: 'Candidate privacy notice', status: 'Generated', detail: 'EN, HI, MR, KN — notice v3, Rule 3 itemised', ts: '01 Oct 2026' },
  { name: 'Retention & erasure policy', status: 'Generated', detail: 'Keyed to 19 activities + statutory matrix', ts: '08 Oct 2026' },
  { name: 'Data principal request SOP', status: 'Generated', detail: 'Intake, verification, SLA, part-refusal', ts: '08 Oct 2026' },
  { name: 'Breach response SOP', status: 'Review pending', detail: 'Awaiting CISO sign-off', ts: '—' },
  { name: 'Processor / DPA register', status: 'Incomplete', detail: '8 of 10 processors have an executed DPA', ts: '08 Oct 2026' },
  { name: 'Consent ledger extract', status: 'Generated', detail: '1,592 records, append-only, hash-chained', ts: '10 Oct 2026' },
  { name: 'Grievance & DPO designation note', status: 'Not started', detail: 'Blocked on G-09', ts: '—' },
  { name: 's.17(1)(d) applicability memo', status: 'Review pending', detail: 'Blocked on G-11 contract clause mapping', ts: '—' },
];

export const QUESTIONNAIRE: Questionnaire = {
  section: 4,
  sections: 7,
  sectionName: 'Exit & post-employment',
  answered: 46,
  total: 71,
  question: 'When an employee leaves, which of their records do you keep, and for how long?',
  why: 'This determines whether an erasure request from an ex-employee can be lawfully refused in part. Statutory retention under PF, income tax and POSH overrides an erasure request; anything outside those grounds does not.',
  suggestion:
    'Based on your payroll stack (Zoho Payroll), your 8-year financial retention policy and the POSH committee you described in section 3, the likely set is: personnel file 8 years, payroll register 8 years, Form 16 until 31 Mar of the sixth assessment year, PF member records permanently with EPFO, ICC records 3 years from disposal.',
  followUps: [
    'Do you keep the resignation letter and exit interview notes, and for how long?',
    'Is the alumni mailing list drawn from exit records? (flagged — relates to PA-12)',
    'Are personnel files purged on a schedule, or only when storage is reclaimed?',
  ],
  derived: [
    { field: 'Retention — PA-11 Exit & FnF', value: '8 years post-exit', provenance: 'ai_suggested' },
    { field: 'Role — PA-11', value: 'Fiduciary', provenance: 'consultant_reviewed' },
    { field: 'Basis — PA-11', value: 's.7(i) employment + legal obligation', provenance: 'consultant_reviewed' },
  ],
};

/**
 * Northstar's data-flow map, drawn from RoPA v4. Three trust boundaries:
 * Northstar's own systems, third parties in India, and parties outside India.
 * Categories are named as they are; the DPDP Act has no "sensitive personal
 * data" class, so nothing is labelled sensitive.
 */
export const FLOW_NODES: FlowNode[] = [
  { id: 'ats', label: 'Zoho Recruit', kind: 'system', zone: 'internal', region: 'IN', safeguard: 'Internal', principals: 'Candidates' },
  { id: 'hrms', label: 'Keka HR', kind: 'system', zone: 'internal', region: 'IN', safeguard: 'Internal', principals: 'Employees, ex-employees' },
  { id: 'payroll', label: 'Zoho Payroll', kind: 'system', zone: 'internal', region: 'IN', safeguard: 'Internal', principals: 'Employees' },
  { id: 'biometric', label: 'Matrix COSEC', kind: 'system', zone: 'internal', region: 'IN', safeguard: 'Internal', principals: 'Employees', finding: 'G-10', note: 'On-premises · data stays in Northstar · retention not stated' },
  { id: 'endpoints', label: 'Laptops & email', kind: 'system', zone: 'internal', region: 'IN', safeguard: 'Internal', principals: 'Employees' },
  { id: 'vdi', label: 'Client VDI desks', kind: 'system', zone: 'internal', region: 'IN', safeguard: 'Internal', principals: 'Client end-users' },
  { id: 'authbridge', label: 'AuthBridge', kind: 'processor', zone: 'india', region: 'IN', safeguard: 'No DPA', principals: 'Candidates', finding: 'G-02' },
  { id: 'insurer', label: 'Niva Bupa', kind: 'processor', zone: 'india', region: 'IN', safeguard: 'DPA in place', principals: 'Employees, dependants' },
  { id: 'epfo', label: 'EPFO / ESIC', kind: 'statutory', zone: 'india', region: 'IN', safeguard: 'Statutory', principals: 'Employees' },
  { id: 'mailchimp', label: 'Mailchimp', kind: 'processor', zone: 'abroad', region: 'US', safeguard: 'Terms only', principals: 'Ex-employees', finding: 'G-06' },
  { id: 'forcepoint', label: 'Forcepoint DLP', kind: 'processor', zone: 'abroad', region: 'US', safeguard: 'DPA in place', principals: 'Employees' },
  { id: 'ukclient', label: 'UK retail client', kind: 'client', zone: 'abroad', region: 'UK', safeguard: 'Exempt', principals: 'Client end-users' },
];

export const FLOW_EDGES: FlowEdge[] = [
  { id: 'f1', from: 'ats', to: 'authbridge', activity: 'PA-02 Pre-employment background verification', label: 'ID, criminal record', categories: ['Identity documents', 'Education records', 'Employment history', 'Criminal record'], principals: 'Candidates', basis: 'Consent', finding: 'G-02' },
  { id: 'f2', from: 'hrms', to: 'insurer', activity: 'PA-09 Group mediclaim & dependant enrolment', label: 'Health, dependants', categories: ['Name, date of birth', 'Dependant details', 'Health claims'], principals: 'Employees', basis: 'Consent' },
  { id: 'f3', from: 'hrms', to: 'epfo', activity: 'PA-05 Statutory filings', label: 'UAN, wages', categories: ['UAN', 'Aadhaar-linked KYC', 'Wages'], principals: 'Employees', basis: 'Legal obligation' },
  { id: 'f4', from: 'payroll', to: 'epfo', activity: 'PA-05 Statutory filings', label: 'PAN, PF number', categories: ['PAN', 'PF number', 'Contribution amounts'], principals: 'Employees', basis: 'Legal obligation' },
  { id: 'f5', from: 'hrms', to: 'mailchimp', activity: 'PA-12 Alumni communications', label: '1,340 alumni contacts', categories: ['Name', 'Personal email', 'Last role'], principals: 'Ex-employees', basis: 'Not determined', finding: 'G-06' },
  { id: 'f6', from: 'endpoints', to: 'forcepoint', activity: 'PA-15 IT monitoring & DLP', label: 'DLP and activity logs', categories: ['Device and user IDs', 'File and email activity'], principals: 'Employees', basis: 's.7(i) safeguarding' },
  { id: 'f7', from: 'vdi', to: 'ukclient', activity: 'PA-17 Client delivery — UK retailer', label: 'Client end-user records', categories: ['Customer account data handled on the client’s systems'], principals: 'Client end-users', basis: 's.17(1)(d) exempt' },
];


/* ---------------------------------------------------------------------------
   Intake without integrations (docs/dpdp-mvp-scope.md). Nothing below came from
   an export or a connector: it was observed on a screen-share, attested by an
   owner, or arrived through a channel the platform runs itself.
   ------------------------------------------------------------------------- */

/** The client's public privacy centre and request inbox — run by the platform. */
export const PRIVACY_CENTRE: PrivacyCentre = {
  url: 'privacy.northstarbpo.in',
  contactEmail: 'privacy@northstarbpo.in',
  /** Forwarding address: requests that arrive by email land in the DSR desk. */
  inbox: 'requests.northstar@in.datasentry.in',
  /** Not designated yet — finding G-09. Shown as a gap on the public page. */
  grievanceOfficer: null,
  responseDays: 30,
  languages: ['English', 'हिन्दी', 'मराठी', 'ಕನ್ನಡ'],
  consentSnippet: '<script src="https://datasentry.in/c/northstar.js" async></script>',
};

/** The latest consultant walkthrough — what was seen, not what was sent. */
export const WALKTHROUGH: Walkthrough = {
  id: 'WT-2026-02',
  date: '09 Oct 2026, 16:30–17:20 IST',
  consultant: 'Dharita Gada',
  attendees: ['HR Operations Manager', 'IT Manager', 'Head of Talent Acquisition'],
  next: '08 Jan 2027',
  observations: [
    { system: 'Zoho Recruit', looked: 'Candidate records held', declared: 'About 1,500, kept 180 days', observed: '6,431 records; oldest created Aug 2022', result: 'differs', finding: 'G-01' },
    { system: 'Zoho Recruit', looked: 'Records older than 180 days', declared: null, observed: '4,812 — list filtered on screen by created date', result: 'new', finding: 'G-01' },
    { system: 'Zoho Recruit', looked: 'Automatic purge rule', declared: 'Purged after 180 days', observed: 'No rule configured; no purge has ever run', result: 'differs', finding: 'G-01' },
    { system: 'Google Workspace', looked: 'Accounts of people who have left', declared: 'Disabled on the last working day', observed: '23 still enabled; oldest exit 14 months ago', result: 'differs', finding: 'G-07' },
    { system: 'Google Drive', looked: 'Sharing on HR/Payroll/FY26', declared: 'Restricted to the HR team', observed: 'Anyone with the link — Viewer', result: 'differs', finding: 'G-08' },
    { system: 'Mailchimp', looked: 'Alumni audience', declared: 'About 1,000 contacts', observed: '1,340 contacts; no consent field on the audience', result: 'differs', finding: 'G-06' },
    { system: 'Keka HR', looked: 'Active employees', declared: '240', observed: '240', result: 'matches' },
  ],
};

const DSR_0041 = { kind: 'Request' as const, ref: 'DSR-2026-0041', label: 'Erasure · Priya Raghunathan, ex-employee' };
const WITHDRAWAL = { kind: 'Consent withdrawal' as const, ref: 'CW-0412', label: 'Deepa Krishnan, candidate — withdrawn 09 Oct' };
const EXPIRY = { kind: 'Retention expiry' as const, ref: 'RX-2026-10', label: '212 candidates past the 180-day talent pool' };
const G08 = { kind: 'Finding' as const, ref: 'G-08', label: 'Payroll folder shared by link' };

/**
 * Per-system work the platform cannot do itself, generated from the RoPA.
 * An owner does it in their own system and attests it; nothing is verified by
 * machine, and the evidence pack says so.
 */
export const TASKS: FulfilmentTask[] = [
  { id: 'T-101', source: DSR_0041, system: 'Keka HR', action: 'Erase the personnel file — appraisals and training records', owner: 'HR Operations Manager', due: '20 Oct 2026', status: 'Attested',
    attestation: { by: 'Meera Joshi, HR Operations Manager', at: '10 Oct 2026, 16:05 IST', note: 'Personnel file and appraisal history deleted. Keka audit log entry 8812.', proof: 'keka-file-deleted.png' } },
  { id: 'T-102', source: DSR_0041, system: 'Mailchimp', action: 'Remove from the alumni audience and suppress', owner: 'Marketing Lead', due: '20 Oct 2026', status: 'Attested',
    attestation: { by: 'Farhan Qureshi, Marketing Lead', at: '10 Oct 2026, 11:20 IST', note: 'Contact archived, deleted and added to the suppression list.', proof: null } },
  { id: 'T-103', source: DSR_0041, system: 'Zoho Recruit', action: 'Erase the original application record', owner: 'Head of Talent Acquisition', due: '20 Oct 2026', status: 'Open' },
  { id: 'T-104', source: DSR_0041, system: 'Google Drive', action: 'Delete the 2023 marketing photograph', owner: 'Marketing Lead', due: '20 Oct 2026', status: 'Open' },
  { id: 'T-105', source: DSR_0041, system: 'Zoho Payroll', action: 'Keep the FY24 payroll register and cite the ground in the response', owner: 'HR Operations Manager', due: '20 Oct 2026', status: 'Retained',
    retainedFor: 'Maharashtra Shops & Establishments Act — until 31 Mar 2032' },
  { id: 'T-098', source: WITHDRAWAL, system: 'Zoho Recruit', action: 'Erase the candidate record', owner: 'Head of Talent Acquisition', due: '16 Oct 2026', status: 'Attested',
    attestation: { by: 'Ritu Sharma, Head of Talent Acquisition', at: '11 Oct 2026, 09:40 IST', note: 'Candidate record deleted, including attachments.', proof: 'recruit-record-deleted.png' } },
  { id: 'T-099', source: WITHDRAWAL, system: 'AuthBridge (processor)', action: 'Instruct the vendor to erase the BGV file and confirm in writing', owner: 'Legal & Compliance', due: '16 Oct 2026', status: 'Open' },
  { id: 'T-100', source: WITHDRAWAL, system: 'Google Drive', action: 'Delete the CV copy in Recruitment/2026', owner: 'Head of Talent Acquisition', due: '16 Oct 2026', status: 'Open' },
  { id: 'T-091', source: EXPIRY, system: 'Zoho Recruit', action: 'Purge 212 candidate records past the talent-pool period', owner: 'Head of Talent Acquisition', due: '08 Oct 2026', status: 'Overdue' },
  { id: 'T-087', source: G08, system: 'Google Drive', action: 'Restrict HR/Payroll/FY26 to the HR group', owner: 'IT Manager', due: '18 Oct 2026', status: 'Attested',
    attestation: { by: 'Anil Deshmukh, IT Manager', at: '10 Oct 2026, 12:45 IST', note: 'Link sharing turned off; access limited to hr-team@.', proof: 'drive-sharing-restricted.png' } },
];

/** The quarterly re-attestation that keeps the register current. */
export const CHECK_IN: CheckIn = {
  label: 'Q3 2026 check-in',
  due: '15 Oct 2026',
  sentTo: 'HR Operations Manager',
  sentOn: '01 Oct 2026',
  last: { on: '10 Jul 2026', changes: 2 },
  questions: [
    { id: 'tools', kind: 'yesno', text: 'Have you started using any new tool or vendor that holds employee, candidate or customer data?', register: 'The register lists 11 systems and 10 processors.', placeholder: 'e.g. Moved payroll to RazorpayX in September' },
    { id: 'retired', kind: 'yesno', text: 'Has any tool been replaced or switched off?', register: 'Payroll runs on Zoho Payroll; attendance on Matrix COSEC.', placeholder: 'e.g. Stopped using Mailchimp in August' },
    { id: 'headcount', kind: 'number', text: 'Roughly how many people are on the payroll today?', register: '240 at the last check-in.', placeholder: '240' },
    { id: 'purposes', kind: 'yesno', text: 'Are you using existing data for anything new — monitoring, marketing, analytics?', register: '19 activities, each with one stated purpose.', placeholder: 'e.g. Started productivity reports from the DLP agent' },
    { id: 'clients', kind: 'yesno', text: 'Any new client, or a change in where client work is contracted?', register: 'Two offshore clients, both contracted outside India.', placeholder: 'e.g. New Indian telco client from November' },
    { id: 'offplatform', kind: 'yesno', text: 'Did any privacy request, complaint or incident reach you outside this platform?', register: 'Requests come in through the privacy centre or the request inbox.', placeholder: 'e.g. An ex-employee asked HR by phone for their records' },
  ],
};

/** Who holds each owner role — attestations are signed by a person, not a role. */
export const OWNERS: Record<string, string> = {
  'HR Operations Manager': 'Meera Joshi',
  'Head of Talent Acquisition': 'Ritu Sharma',
  'Marketing Lead': 'Farhan Qureshi',
  'Legal & Compliance': 'Kiran Rao',
  'IT Manager': 'Anil Deshmukh',
};

/**
 * The next walkthrough's agenda, generated from the register: for each system,
 * what to look at and what the register currently says. Open findings and
 * attested fixes both land here, so a fix is looked at, not just taken on trust.
 */
export const WALKTHROUGH_AGENDA: AgendaItem[] = [
  { id: 'A1', system: 'Zoho Recruit', looked: 'Records older than 180 days', register: '4,812 on 09 Oct; purge task T-091 overdue', why: 'Confirms the purge happened', finding: 'G-01' },
  { id: 'A2', system: 'Google Workspace', looked: 'Accounts of people who have left', register: '23 enabled on 09 Oct', why: 'Open finding', finding: 'G-07' },
  { id: 'A3', system: 'Google Drive', looked: 'Sharing on HR/Payroll/FY26', register: 'Restricted to HR — attested 10 Oct (T-087)', why: 'Looks at an attested fix', finding: 'G-08' },
  { id: 'A4', system: 'Matrix COSEC', looked: 'Template retention setting', register: 'No purge configured', why: 'Open finding', finding: 'G-10' },
  { id: 'A5', system: 'Mailchimp', looked: 'Consent field on the alumni audience', register: 'No consent field; 1,340 contacts', why: 'Open finding', finding: 'G-06' },
  { id: 'A6', system: 'Keka HR', looked: 'Active employees', register: '240', why: 'Scope check' },
];

/**
 * Client-facing pages are white-labelled: the client's colour replaces the
 * DataSentry accent through the same tokens, so every component follows.
 */
export const CLIENT_THEME: Record<string, { accent: string; hover: string; weak: string; border: string; initials: string }> = {
  northstar: { accent: '#1d4f73', hover: '#163d59', weak: '#eaf1f7', border: '#c6d8e8', initials: 'NB' },
  quadrant: { accent: '#5b3f8c', hover: '#47306f', weak: '#f1ecf8', border: '#d9cdec', initials: 'QA' },
  meridian: { accent: '#0f6b62', hover: '#0b544d', weak: '#e8f4f2', border: '#c3e1dc', initials: 'MS' },
};

/** Readiness score at each review, oldest first — for the trend line. */
export const SCORE_HISTORY = [
  { on: '12 Aug 2026', score: 31 }, { on: '29 Aug 2026', score: 34 }, { on: '12 Sep 2026', score: 36 },
  { on: '26 Sep 2026', score: 39 }, { on: '08 Oct 2026', score: 42 },
];


export const AUDIT: AuditEntry[] = [
  { at: '10 Oct 2026, 16:05', who: 'Meera Joshi', ref: 'DSR-2026-0041', what: 'Erasure attested — Keka HR personnel file' },
  { at: '10 Oct 2026, 14:22', who: 'CISO', ref: 'INC-2026-003', what: 'Incident opened — 72-hour clock started' },
  { at: '10 Oct 2026, 11:42', who: 'Careers portal', ref: 'PA-01', what: 'Candidate consent recorded — notice v3, English' },
  { at: '09 Oct 2026, 17:20', who: 'Dharita Gada', ref: 'G-01', what: 'Walkthrough observation attached', change: { field: 'Basis', from: 'Declared', to: 'Observed' } },
  { at: '09 Oct 2026, 17:05', who: 'Dharita Gada', ref: 'PA-01', what: 'Retention checked on screen in Zoho Recruit', change: { field: 'Records past retention', from: 'Unknown', to: '4,812' } },
  { at: '08 Oct 2026, 16:40', who: 'Meera Joshi', ref: 'RoPA', what: 'RoPA confirmed', change: { field: 'Version', from: 'v3', to: 'v4' } },
  { at: '08 Oct 2026, 15:56', who: 'Rule engine v1.4', ref: 'G-06', what: 'Finding raised from PA-12', change: { field: 'Status', from: '—', to: 'Open' } },
  { at: '08 Oct 2026, 15:55', who: 'Dharita Gada', ref: 'PA-12', what: 'Lawful basis reviewed', change: { field: 'Lawful basis', from: 'Consent', to: 'Not determined' } },
  { at: '07 Oct 2026, 12:10', who: 'Dharita Gada', ref: 'PA-02', what: 'Processor DPA checked', change: { field: 'AuthBridge DPA', from: 'Assumed', to: 'Missing' } },
  { at: '06 Oct 2026, 10:30', who: 'Kiran Rao', ref: 'G-02', what: 'Owner assigned', change: { field: 'Owner', from: 'Unassigned', to: 'Legal & Compliance' } },
  { at: '03 Oct 2026, 18:02', who: 'Dharita Gada', ref: 'PA-06', what: 'Retention reviewed', change: { field: 'Retention', from: '7 years', to: 'Not stated' } },
];


/** Everyone who can be @mentioned: the consultant team and the client's owners. */
export const PEOPLE: { name: string; role: string; side: 'DataSentry' | 'Client' }[] = [
  { name: 'Dharita Gada', role: 'Consultant Admin', side: 'DataSentry' },
  { name: 'Rohan Mehta', role: 'Consultant', side: 'DataSentry' },
  { name: 'Meera Joshi', role: 'HR Operations Manager', side: 'Client' },
  { name: 'Ritu Sharma', role: 'Head of Talent Acquisition', side: 'Client' },
  { name: 'Farhan Qureshi', role: 'Marketing Lead', side: 'Client' },
  { name: 'Kiran Rao', role: 'Legal & Compliance', side: 'Client' },
  { name: 'Anil Deshmukh', role: 'IT Manager', side: 'Client' },
  { name: 'Vikram Iyer', role: 'Chief Information Security Officer', side: 'Client' },
];


export const COMMENTS: RecordComment[] = [
  { id: 'c1', ref: 'G-01', who: 'Ritu Sharma', at: '10 Oct 2026, 11:05', visibility: 'shared', text: 'Zoho support says the purge rule can run monthly. Can we keep campus hires for 12 months instead of 180 days?' },
  { id: 'c2', ref: 'G-01', who: 'Dharita Gada', at: '10 Oct 2026, 12:20', visibility: 'shared', text: '@Ritu Sharma 12 months works if the notice says so — we would update the candidate notice to v4 first. Drafting it this week.' },
  { id: 'c3', ref: 'G-01', who: 'Rohan Mehta', at: '10 Oct 2026, 12:41', visibility: 'internal', text: 'Watch the scope: notice change pushes the evidence pack to v5.' },
  { id: 'c4', ref: 'G-06', who: 'Farhan Qureshi', at: '09 Oct 2026, 16:10', visibility: 'shared', text: 'We could add an opt-in to the exit form. Would that cover the people already on the list?' },
  { id: 'c5', ref: 'G-06', who: 'Dharita Gada', at: '09 Oct 2026, 17:02', visibility: 'shared', text: 'It covers future leavers. The 1,340 already on the list need a one-time re-permission email — or we stop mailing them. @Kiran Rao to confirm.' },
  { id: 'c6', ref: 'PA-12', who: 'Rohan Mehta', at: '08 Oct 2026, 16:02', visibility: 'internal', text: 'Basis set to Not determined on purpose so the finding fires. Revisit after the re-permission campaign.' },
  { id: 'c7', ref: 'INC-2026-003', who: 'Vikram Iyer', at: '13 Oct 2026, 10:15', visibility: 'shared', text: 'Recall confirmed for all 34 recipients. Please add that to section 3.' },
  { id: 'c8', ref: 'INC-2026-003', who: 'Dharita Gada', at: '13 Oct 2026, 10:40', visibility: 'shared', text: '@Vikram Iyer done — section 3 updated. Ready for your sign-off.' },
];


export const BOARD_INTIMATION: ComplianceDoc = {
  id: 'board-intimation',
  ref: 'INC-2026-003',
  title: 'Intimation to the Data Protection Board',
  kind: 'Personal data breach — intimation',
  provision: 'Rule 7(2)',
  owner: 'Dharita Gada',
  approver: 'Vikram Iyer',
  due: '13 Oct 2026, 14:20',
  version: 2,
  sections: [
    {
      heading: 'Who is notifying',
      provenance: 'consultant_reviewed',
      text: 'Northstar BPO Services Pvt Ltd, Pune, Maharashtra, as Data Fiduciary. Contact for this intimation: Vikram Iyer, Chief Information Security Officer — privacy@northstarbpo.in.',
    },
    {
      heading: 'What happened',
      provenance: 'ai_suggested',
      source: 'Drafted from incident record INC-2026-003',
      text: 'On 10 October 2026 the September 2026 payroll register was sent by email to an internal distribution list that included 34 recipients with no need to access it. The register held the name, employee ID, designation, gross and net salary, PAN, bank account number and PF number of 240 employees.',
    },
    {
      heading: 'When we became aware, and what we did',
      provenance: 'consultant_reviewed',
      text: 'We became aware at 14:20 IST on 10 October 2026. The message was recalled at 14:52 IST and the distribution list was corrected the same afternoon. Recall has been confirmed for all 34 recipients. No onward disclosure has been identified.',
    },
    {
      heading: 'People and personal data affected',
      provenance: 'ai_suggested',
      source: 'From the register — PA-04 Payroll processing',
      text: '240 current employees. Identity data (name, employee ID, designation), financial data (salary, bank account number) and government identifiers (PAN, PF number). No data of children, and no data from outside India.',
    },
    {
      heading: 'Likely consequences',
      provenance: 'ai_suggested',
      source: 'Suggested from the categories involved',
      text: 'Bank account numbers alongside PAN raise the risk of targeted financial fraud and phishing. Salary disclosure inside the company may cause distress. The risk is limited by the recipients all being employees bound by confidentiality.',
    },
    {
      heading: 'Measures taken and planned',
      provenance: 'consultant_reviewed',
      text: 'Recall and deletion confirmed by each recipient. Payroll registers now go only to a named list owned by Finance, with external-sharing blocked on the payroll folder (finding G-08). Affected employees are being told what happened and how to watch for fraud attempts.',
    },
  ],
  versions: [
    { v: 2, at: '13 Oct 2026, 10:40', who: 'Dharita Gada', note: 'Section 3 updated after the CISO confirmed recall for all 34 recipients' },
    { v: 1, at: '13 Oct 2026, 09:30', who: 'DataSentry draft', note: 'Generated from incident record INC-2026-003 and the register' },
  ],
};
