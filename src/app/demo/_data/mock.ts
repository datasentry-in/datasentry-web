// Mock data for the DataSentry DPDP platform demo.
// Figures are illustrative and shaped to look like a real 240-seat ITES firm.

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

export const CONSULTANT = {
  name: 'Dharita Gada',
  firm: 'DataSentry',
  role: 'Consultant Admin',
};

/** Statutory milestones — drives the countdown banner. */
export const DEADLINE = {
  label: 'DPDP substantive compliance',
  date: '2027-05-13',
  rulesNote: 'Rules 3, 5-16, 22-23 (notice, consent, safeguards, breach reporting, principal rights)',
  consentManager: '2026-11-13',
};

export const ORGS: Org[] = [
  {
    slug: 'northstar',
    name: 'Northstar BPO Services Pvt Ltd',
    sector: 'ITES — voice & claims processing',
    headcount: 240,
    locations: 'Pune, Bengaluru',
    score: 42,
    trend: '+11 since Aug',
    openGaps: { high: 4, medium: 6, low: 4 },
    activities: 19,
    exemptActivities: 2,
    dsrOpen: 3,
    dsrBreaching: 0,
    incidentOpen: 1,
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
    openGaps: { high: 1, medium: 4, low: 5 },
    activities: 14,
    exemptActivities: 3,
    dsrOpen: 1,
    dsrBreaching: 0,
    incidentOpen: 0,
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
    openGaps: { high: 7, medium: 9, low: 3 },
    activities: 22,
    exemptActivities: 4,
    dsrOpen: 5,
    dsrBreaching: 2,
    incidentOpen: 0,
    engagement: 'Discovery — Phase 1 of 3',
    lastReview: '09 Oct 2026',
  },
];

export const getOrg = (slug: string) => ORGS.find((o) => o.slug === slug) ?? ORGS[0];

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
    evidence: 'Reconciled against ATS export of 09 Oct 2026 (6,431 records)',
  },
  {
    id: 'G-02', severity: 'High',
    title: 'Background verification vendor engaged without a data processing agreement',
    detail: 'AuthBridge processes candidate identity, education, employment and criminal-record data under a purchase order only. There is no written contract covering purpose limitation, security, sub-processing, breach notification or return and erasure on termination.',
    provision: 's.8(2)', activity: 'PA-02 Pre-employment background verification',
    owner: 'Legal & Compliance', due: '30 Nov 2026',
    evidence: 'Vendor file review — PO 2024/BGV/117, no MSA on record',
  },
  {
    id: 'G-03', severity: 'High',
    title: 'Candidate application form carries no Rule 3 notice',
    detail: 'The application form collects 14 distinct data items behind a single "I agree to the Privacy Policy" checkbox. There is no itemised description of data with a purpose per item, no withdrawal link, and no route to complain to the Data Protection Board.',
    provision: 'Rule 3 read with s.5 and s.6', activity: 'PA-01 Recruitment & applicant tracking',
    owner: 'Head of Talent Acquisition', due: '31 Dec 2026',
    evidence: 'Form capture — careers.northstarbpo.in/apply, reviewed 08 Oct 2026',
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
    evidence: 'Insurer roster export of 30 Sep 2026',
  },
  {
    id: 'G-06', severity: 'Medium',
    title: 'Alumni mailing list of 1,340 ex-employees has no lawful basis on record',
    detail: 'Marketing mails rehire openings and company news to 1,340 former employees. No consent was captured at exit, and s.7(i) does not extend to marketing after the employment relationship has ended. Basis is recorded as Not determined.',
    provision: 's.6 read with s.4', activity: 'PA-12 Alumni communications',
    owner: 'Marketing Lead', due: '15 Dec 2026',
    evidence: 'Mailchimp audience export of 01 Oct 2026',
  },
  {
    id: 'G-07', severity: 'Medium',
    title: 'Active Google Workspace accounts for 23 departed employees',
    detail: 'Reconciliation of the Workspace user list against the HRMS exit roster shows 23 enabled accounts belonging to employees who have left. The oldest exit was 14 months ago. Four of these accounts retain access to the shared HR drive.',
    provision: 's.8(4) reasonable security safeguards', activity: 'PA-11 Exit & full-and-final settlement',
    owner: 'IT Manager', due: '25 Oct 2026',
    evidence: 'Workspace user export vs Keka exit roster, 09 Oct 2026',
  },
  {
    id: 'G-08', severity: 'Medium',
    title: 'Payroll folder on Google Drive is shared with anyone holding the link',
    detail: 'The folder HR/Payroll/FY26 is set to "Anyone with the link — Viewer". It contains 12 monthly registers covering 240 employees with salary, PAN, bank account and PF number.',
    provision: 's.8(4) reasonable security safeguards', activity: 'PA-04 Payroll processing',
    owner: 'IT Manager', due: '18 Oct 2026',
    evidence: 'Drive sharing report of 09 Oct 2026',
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
    evidence: 'Controller configuration review, 08 Oct 2026',
  },
  {
    id: 'G-11', severity: 'Low',
    title: 'Offshore delivery exemption claimed without mapped contract evidence',
    detail: 'PA-16 and PA-17 are recorded as exempt under s.17(1)(d). The MSAs are on file but the specific clauses establishing that the principals are outside India and that the counterparty is a person outside India have not been extracted and linked.',
    provision: 's.17(1)(d)', activity: 'PA-16, PA-17 Client delivery',
    owner: 'Legal & Compliance', due: '28 Feb 2027',
    evidence: 'MSA 14 Feb 2024; MSA 03 Sep 2025',
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
    relationship: 'Ex-employee — exited 22 Mar 2024', received: '08 Oct 2026',
    daysLeft: 27, status: 'In progress',
    conflicts: [
      { record: 'Provident Fund member records', statute: 'EPF & MP Act, 1952', until: 'Statutory — not erasable' },
      { record: 'Form 16 / TDS records', statute: 'Income Tax Act, 1961 r/w Rule 31', until: '31 Mar 2031' },
      { record: 'ICC complaint record (respondent)', statute: 'POSH Act, 2013 — s.21 reporting', until: '14 Jun 2027' },
      { record: 'Payroll register FY24', statute: 'Maharashtra Shops & Establishments Act', until: '31 Mar 2032' },
    ],
  },
  {
    id: 'DSR-2026-0040', type: 'Access', principal: 'Arun Kelkar',
    relationship: 'Ex-employee — exited 11 Jan 2026', received: '30 Sep 2026',
    daysLeft: 19, status: 'In progress',
  },
  {
    id: 'DSR-2026-0039', type: 'Grievance', principal: 'Sneha Dutta',
    relationship: 'Current employee', received: '23 Sep 2026',
    daysLeft: 12, status: 'Awaiting client',
    outcome: 'Objects to fingerprint capture for attendance; asks for a card-based alternative',
  },
  {
    id: 'DSR-2026-0038', type: 'Correction', principal: 'Mohammed Irfan',
    relationship: 'Candidate — applied 02 Sep 2026', received: '14 Sep 2026',
    daysLeft: null, status: 'Closed',
    outcome: 'Corrected — total experience amended from 4y to 6y 3m. Closed in 6 days.',
  },
  {
    id: 'DSR-2026-0037', type: 'Erasure', principal: 'Kavya Nair',
    relationship: 'Candidate — not selected', received: '09 Sep 2026',
    daysLeft: null, status: 'Closed',
    outcome: 'Fully honoured — ATS record and BGV file erased, vendor instructed. Closed in 2 days.',
  },
  {
    id: 'DSR-2026-0036', type: 'Nomination', principal: 'Rajesh Pillai',
    relationship: 'Current employee', received: '28 Aug 2026',
    daysLeft: null, status: 'Closed',
    outcome: 'Nominee recorded — spouse, with identity verified.',
  },
];

export const INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-003',
    title: 'Monthly payroll register emailed to the wrong distribution list',
    awareness: '10 Oct 2026, 14:20 IST',
    deadline: '13 Oct 2026, 14:20 IST',
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

export const CONSENT_SUMMARY = {
  activeCandidate: 1284,
  withdrawn: 96,
  expiredClock: 212,
  pendingErasureTasks: 18,
  employeeExceptions: 171,
  noticeVersion: 'v3 — published 01 Oct 2026',
  languages: ['English', 'Hindi', 'Marathi', 'Kannada'],
};

export const CONSENT_LEDGER = [
  { ts: '10 Oct 2026, 11:42', principal: 'Nikhil Barve', type: 'Candidate', purposes: 'Screening, BGV, Talent pool 180d', notice: 'v3', lang: 'English', action: 'Granted' },
  { ts: '10 Oct 2026, 10:18', principal: 'Shalini Menon', type: 'Candidate', purposes: 'Screening, BGV', notice: 'v3', lang: 'Marathi', action: 'Granted' },
  { ts: '09 Oct 2026, 17:55', principal: 'Deepa Krishnan', type: 'Candidate', purposes: 'Talent pool 180d', notice: 'v2', lang: 'English', action: 'Withdrawn' },
  { ts: '09 Oct 2026, 16:02', principal: 'Imran Shaikh', type: 'Employee', purposes: 'Wellness programme, Photo on website', notice: 'v3', lang: 'Hindi', action: 'Granted' },
  { ts: '09 Oct 2026, 14:30', principal: 'Anita Deshpande', type: 'Employee', purposes: 'Dependant enrolment (2 dependants)', notice: 'v3', lang: 'Marathi', action: 'Granted' },
  { ts: '08 Oct 2026, 19:11', principal: 'Vikram Rao', type: 'Candidate', purposes: 'Screening, Share with client for staffing', notice: 'v3', lang: 'Kannada', action: 'Granted' },
  { ts: '08 Oct 2026, 12:47', principal: 'Farah Qureshi', type: 'Candidate', purposes: 'Talent pool 180d', notice: 'v2', lang: 'English', action: 'Clock expired' },
];

export const EVIDENCE_PACK = [
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

export const QUESTIONNAIRE = {
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
    { field: 'Retention — PA-11 Exit & FnF', value: '8 years post-exit', provenance: 'ai_suggested' as Provenance },
    { field: 'Role — PA-11', value: 'Fiduciary', provenance: 'consultant_reviewed' as Provenance },
    { field: 'Basis — PA-11', value: 's.7(i) employment + legal obligation', provenance: 'consultant_reviewed' as Provenance },
  ],
};

export const FLOWS = {
  sources: [
    { id: 'ats', label: 'Zoho Recruit', note: 'Candidate', x: 60, y: 40 },
    { id: 'hrms', label: 'Keka HR', note: 'Employee', x: 60, y: 130 },
    { id: 'payroll', label: 'Zoho Payroll', note: 'Employee', x: 60, y: 220 },
    { id: 'biometric', label: 'Matrix COSEC', note: 'Employee', x: 60, y: 310 },
    { id: 'vdi', label: 'Client VDI', note: 'Client end-users', x: 60, y: 440 },
  ],
  processors: [
    { id: 'authbridge', label: 'AuthBridge', note: 'BGV — no DPA', x: 330, y: 40, flag: true },
    { id: 'insurer', label: 'Niva Bupa', note: 'Mediclaim', x: 330, y: 150 },
    { id: 'epfo', label: 'EPFO / ESIC', note: 'Statutory', x: 330, y: 260 },
    { id: 'mailchimp', label: 'Mailchimp', note: 'Alumni — no basis', x: 330, y: 345, flag: true },
  ],
  destinations: [
    { id: 'india', label: 'India', note: '9 systems', x: 600, y: 90 },
    { id: 'us', label: 'United States', note: '4 transfers', x: 600, y: 230 },
    { id: 'uk', label: 'United Kingdom', note: '1 transfer — exempt', x: 600, y: 440 },
  ],
  edges: [
    ['ats', 'authbridge'], ['ats', 'india'],
    ['hrms', 'insurer'], ['hrms', 'epfo'], ['hrms', 'india'],
    ['payroll', 'epfo'], ['payroll', 'india'],
    ['biometric', 'india'],
    ['vdi', 'uk'],
    ['authbridge', 'india'], ['insurer', 'india'], ['epfo', 'india'],
    ['mailchimp', 'us'], ['hrms', 'mailchimp'],
  ] as [string, string][],
};
