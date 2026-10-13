/**
 * Quadrant Analytics LLP — a 95-seat data-annotation firm in Hyderabad, in the
 * last phase of its readiness assessment. A mature programme: the register is
 * confirmed, most findings are closed, and what remains is mostly Low.
 * Illustrative only; a live app replaces this module with a data layer.
 */
import type {
  Activity, CheckIn, ClientData, Dsr, FlowEdge, FlowNode, FulfilmentTask, Gap, Incident,
} from '../types';

const OWNERS: Record<string, string> = {
  'People Operations Lead': 'Sravani Reddy',
  'Talent Acquisition Lead': 'Karthik Varma',
  'Delivery Head': 'Aditya Rao',
  'IT & Security Lead': 'Naveen Kumar Goud',
  'Finance Controller': 'Lakshmi Prasanna',
  'Designated Partner': 'Harsha Vardhan Reddy',
};

const ACTIVITIES: Activity[] = [
  {
    id: 'PA-01', name: 'Recruitment & applicant tracking', department: 'People Operations',
    purpose: 'Evaluate applicants for annotator and QA roles and keep a 12-month talent pool',
    principals: 'Candidate', items: 12, systems: ['Freshteam', 'Gmail'],
    role: 'Fiduciary', basis: 'Consent', retention: '12 months from application',
    processors: ['Freshworks'], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-02', name: 'Pre-employment background verification', department: 'People Operations',
    purpose: 'Verify identity, address, education and previous employment before joining',
    principals: 'Candidate', items: 10, systems: ['OnGrid portal'],
    role: 'Fiduciary', basis: 'Consent', retention: '3 years from verification',
    processors: ['OnGrid (Handy Online Solutions)'], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-03', name: 'Onboarding & personnel file', department: 'People Operations',
    purpose: 'Constitute the engagement contract and statutory personnel file',
    principals: 'Employee', items: 19, systems: ['Darwinbox', 'Google Drive'],
    role: 'Fiduciary', basis: 's.7(i) employment', retention: '8 years post-exit',
    processors: ['Darwinbox Digital Solutions'], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-04', name: 'Payroll processing', department: 'Finance',
    purpose: 'Compute and disburse salary, shift allowances and reimbursements',
    principals: 'Employee', items: 15, systems: ['RazorpayX Payroll', 'HDFC corporate banking'],
    role: 'Fiduciary', basis: 's.7(i) employment', retention: '8 years from financial year',
    processors: ['Razorpay Software'], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-05', name: 'Statutory filings — PF, ESIC, Telangana PT, TDS', department: 'Finance',
    purpose: 'Discharge employer obligations under PF, ESI, Telangana Professional Tax and Income Tax',
    principals: 'Employee', items: 11, systems: ['EPFO portal', 'ESIC portal', 'TRACES'],
    role: 'Fiduciary', basis: 'Legal obligation', retention: 'As prescribed per statute',
    processors: [], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-06', name: 'Attendance & floor access', department: 'Administration',
    purpose: 'Record shift attendance and restrict access to the secure annotation floor',
    principals: 'Employee', items: 5, systems: ['eSSL biometric terminals', 'Darwinbox'],
    role: 'Fiduciary', basis: 's.7(i) employment', retention: 'Duration of employment',
    processors: [], crossBorder: null, provenance: 'consultant_reviewed',
  },
  {
    id: 'PA-07', name: 'Performance & quality scoring', department: 'Delivery',
    purpose: 'Appraise annotators on accuracy, throughput and QA rework rates',
    principals: 'Employee', items: 8, systems: ['Darwinbox', 'Jira'],
    role: 'Fiduciary', basis: 's.7(i) employment', retention: 'Not stated',
    processors: ['Darwinbox Digital Solutions'], crossBorder: null, provenance: 'consultant_reviewed',
  },
  {
    id: 'PA-08', name: 'Group health insurance & dependant enrolment', department: 'People Operations',
    purpose: 'Enrol employees and their dependants in the group health policy',
    principals: 'Employee, Dependant (incl. minors)', items: 12, systems: ['Insurer portal', 'Darwinbox'],
    role: 'Fiduciary', basis: 'Consent', retention: 'Policy term + 2 years',
    processors: ['ICICI Lombard', 'Policybazaar for Business (broker)'], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-09', name: 'Exit & full-and-final settlement', department: 'People Operations',
    purpose: 'Process resignation, access revocation, recoveries and final dues',
    principals: 'Ex-employee', items: 14, systems: ['Darwinbox', 'RazorpayX Payroll'],
    role: 'Fiduciary', basis: 's.7(i) employment', retention: '8 years post-exit',
    processors: ['Darwinbox Digital Solutions', 'Razorpay Software'], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-10', name: 'Workplace tools & security monitoring', department: 'Information Technology',
    purpose: 'Run email and chat, and detect exfiltration from annotation workstations',
    principals: 'Employee', items: 7, systems: ['Google Workspace', 'Slack', 'ManageEngine Endpoint Central'],
    role: 'Fiduciary', basis: 's.7(i) safeguarding', retention: '180 days (logs)',
    processors: ['Google', 'Slack Technologies'], crossBorder: 'United States (Slack)', provenance: 'consultant_reviewed',
  },
  {
    id: 'PA-11', name: 'POSH / Internal Committee proceedings', department: 'People Operations',
    purpose: 'Receive, inquire into and record sexual harassment complaints',
    principals: 'Employee', items: 9, systems: ['Sealed physical file', 'Google Drive (restricted)'],
    role: 'Fiduciary', basis: 'Legal obligation', retention: '3 years from disposal',
    processors: [], crossBorder: null, provenance: 'client_confirmed',
  },
  {
    id: 'PA-12', name: 'Client delivery — US autonomous-driving imagery', department: 'Delivery',
    purpose: 'Label street-scene images for a US autonomy company under MSA dated 11 Mar 2025',
    principals: 'Client end-users (United States)', items: 6, systems: ['Client Labelbox workspace', 'Annotation workstations'],
    role: 'Exempt', basis: 's.17(1)(d) exempt', retention: 'Per MSA — purged at batch sign-off',
    processors: [], crossBorder: 'Data remains in client environment (US)', provenance: 'client_confirmed',
  },
  {
    id: 'PA-13', name: 'Client delivery — US conversational AI transcripts', department: 'Delivery',
    purpose: 'Tag intent and redact identifiers in support transcripts for a US AI company under MSA dated 02 Dec 2025',
    principals: 'Client end-users (United States)', items: 8, systems: ['Client annotation tool (browser-only)'],
    role: 'Exempt', basis: 's.17(1)(d) exempt', retention: 'Per MSA — no local retention',
    processors: [], crossBorder: 'Data remains in client environment (US)', provenance: 'client_confirmed',
  },
  {
    id: 'PA-14', name: 'Client delivery — UK retail product imagery', department: 'Delivery',
    purpose: 'Annotate shopper-submitted product photos for a UK retailer under SOW dated 20 Jun 2026',
    principals: 'Client end-users (United Kingdom)', items: 4, systems: ['Client S3 bucket via VDI'],
    role: 'Exempt', basis: 's.17(1)(d) exempt', retention: 'Per SOW — no local retention',
    processors: [], crossBorder: 'Data remains in client environment (UK)', provenance: 'consultant_reviewed',
  },
];

const GAPS: Gap[] = [
  {
    id: 'G-01', severity: 'High',
    title: 'Annotation workforce can download client source images to personal devices',
    detail: 'On the annotation floor, browser downloads and USB mass storage are allowed on 14 of 62 workstations, and the client Labelbox workspace permits image export for the "Reviewer" role. Source images include faces and number plates. The s.17(1)(d) exemption does not lift the duty to protect the data against a breach.',
    provision: 's.8(5) reasonable security safeguards — applies despite s.17(1)(d)',
    activity: 'PA-12 Client delivery — US autonomous-driving imagery',
    owner: 'IT & Security Lead', due: '31 Oct 2026',
    evidence: 'Walkthrough 02 Oct 2026 — ManageEngine device-control policy viewed on screen; one image downloaded from Labelbox as a test',
    basis: 'observed',
  },
  {
    id: 'G-02', severity: 'Medium',
    title: 'Fingerprint templates of former employees are never removed',
    detail: 'The eSSL terminals hold 131 enrolled templates against 95 current employees. The register states retention for the duration of employment, but no step in the exit checklist removes the template.',
    provision: 's.8(7)', activity: 'PA-06 Attendance & floor access',
    owner: 'People Operations Lead', due: '15 Nov 2026',
    evidence: 'Walkthrough 02 Oct 2026 — enrolled user count read off the eSSL admin screen',
    basis: 'observed',
  },
  {
    id: 'G-03', severity: 'Medium',
    title: 'Talent pool kept longer than the candidate notice says',
    detail: 'The candidate notice (v2) says applications are kept for 6 months. The register and the Freshteam purge rule both use 12 months. Either the notice or the rule must change so the two agree.',
    provision: 's.8(7) read with s.5(1)', activity: 'PA-01 Recruitment & applicant tracking',
    owner: 'Talent Acquisition Lead', due: '30 Oct 2026',
    evidence: 'Notice v2 compared with the Freshteam retention setting viewed on 02 Oct 2026',
    basis: 'observed',
  },
  {
    id: 'G-04', severity: 'Medium',
    title: 'Insurance broker handles dependant details without a processing agreement',
    detail: 'Policybazaar for Business collects the dependant enrolment sheet, including dates of birth of 23 minors, and forwards it to ICICI Lombard. The insurer has a DPA; the broker is engaged on its standard terms of business only.',
    provision: 's.8(2)', activity: 'PA-08 Group health insurance & dependant enrolment',
    owner: 'Designated Partner', due: '30 Nov 2026',
    evidence: 'Declared in the check-in by the People Operations Lead — broker engaged on its own terms',
    basis: 'declared',
  },
  {
    id: 'G-05', severity: 'Medium',
    title: 'Breach response procedure signed off but never rehearsed',
    detail: 'The breach SOP was approved on 18 Sep 2026. No tabletop exercise has been run, and the on-call list in the SOP still names an IT engineer who left in August.',
    provision: 'Rule 7 read with s.8(6)', activity: 'All activities',
    owner: 'IT & Security Lead', due: '20 Nov 2026',
    evidence: 'IT & Security Lead attested on 08 Oct 2026 that no drill has been held',
    basis: 'attested',
  },
  {
    id: 'G-06', severity: 'Low',
    title: 'UK client exemption claimed before the contract clause is linked',
    detail: 'PA-14 is recorded as exempt under s.17(1)(d). The SOW is on file, but the clause establishing that the shoppers are outside India and that the retailer contracts from outside India has not been extracted and linked.',
    provision: 's.17(1)(d)', activity: 'PA-14 Client delivery — UK retail product imagery',
    owner: 'Designated Partner', due: '15 Dec 2026',
    evidence: 'SOW 20 Jun 2026 — named by the Designated Partner, clause not yet linked',
    basis: 'declared',
  },
  {
    id: 'G-07', severity: 'Low',
    title: 'Employees have not been told they can nominate someone',
    detail: 'The privacy centre accepts nominations, but the employee notice and handbook do not mention the right, so none have been recorded.',
    provision: 's.14', activity: 'All activities',
    owner: 'People Operations Lead', due: '31 Jan 2027',
    evidence: null,
    basis: 'declared',
  },
  {
    id: 'G-08', severity: 'Low',
    title: 'Quality scores and review notes have no end date',
    detail: 'Per-annotator accuracy scores and reviewer notes in Jira are kept indefinitely. Appraisal outcomes in Darwinbox follow the personnel file; the underlying scoring data has no stated period.',
    provision: 's.8(7)', activity: 'PA-07 Performance & quality scoring',
    owner: 'Delivery Head', due: '31 Jan 2027',
    evidence: 'Declared in discovery by the Delivery Head',
    basis: 'declared',
  },
  {
    id: 'G-09', severity: 'Low',
    title: 'Telugu candidate notice not yet checked by a native reader',
    detail: 'The Telugu version of the candidate notice was machine-assisted and has not been proofread. Two purpose descriptions read awkwardly and one omits the withdrawal route.',
    provision: 's.5(3) read with Rule 3', activity: 'PA-01 Recruitment & applicant tracking',
    owner: 'Talent Acquisition Lead', due: '15 Nov 2026',
    evidence: 'Public notice reviewed — privacy.quadrantanalytics.in/te, 02 Oct 2026',
    basis: 'observed',
  },
  {
    id: 'G-10', severity: 'Low',
    title: 'Slack keeps direct messages forever',
    detail: 'The Slack workspace retention is set to "Keep everything". Annotators share leave and medical notes with leads by direct message, so these persist long after their purpose ends.',
    provision: 's.8(7)', activity: 'PA-10 Workplace tools & security monitoring',
    owner: 'IT & Security Lead', due: '31 Dec 2026',
    evidence: 'Walkthrough 02 Oct 2026 — Slack retention settings viewed on screen',
    basis: 'observed',
  },
];

const DSRS: Dsr[] = [
  {
    id: 'DSR-2026-0012', type: 'Access', principal: 'Bhargavi Kondapalli',
    relationship: 'Ex-employee — exited 30 Jun 2026', received: '07 Oct 2026', channel: 'Privacy centre', status: 'In progress',
  },
  {
    id: 'DSR-2026-0011', type: 'Erasure', principal: 'Sai Teja Mudiraj',
    relationship: 'Candidate — not selected', received: '16 Sep 2026', channel: 'Email', status: 'Closed',
    outcome: 'Fully honoured — Freshteam record and OnGrid file erased, vendor confirmed in writing. Closed in 4 days.',
  },
  {
    id: 'DSR-2026-0010', type: 'Correction', principal: 'Ayesha Fatima',
    relationship: 'Current employee', received: '28 Aug 2026', channel: 'Privacy centre', status: 'Closed',
    outcome: 'Corrected — nominee name and bank IFSC amended in Darwinbox and RazorpayX. Closed in 3 days.',
  },
  {
    id: 'DSR-2026-0009', type: 'Grievance', principal: 'Ravi Teja Bollam',
    relationship: 'Current employee', received: '04 Aug 2026', channel: 'Privacy centre', status: 'Closed',
    outcome: 'Asked why screen activity is logged. Explained the safeguarding purpose and 180-day log retention; accepted. Closed in 9 days.',
  },
];

const INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-001',
    title: 'Payslip emailed to the wrong employee',
    awareness: '03 Jul 2026, 10:15 IST',
    deadline: '06 Jul 2026, 10:15 IST',
    affected: 1,
    categories: 'Name, employee ID, gross and net salary, PAN, bank account (last 4 digits)',
    status: 'Closed',
    boardIntimation: 'Sent 04 Jul 2026, 15:30 IST',
    principalNotice: 'Sent 03 Jul 2026 to the affected employee',
  },
];

const FLOW_NODES: FlowNode[] = [
  { id: 'ats', label: 'Freshteam', kind: 'system', zone: 'internal', region: 'IN', safeguard: 'Internal', principals: 'Candidates' },
  { id: 'hrms', label: 'Darwinbox', kind: 'system', zone: 'internal', region: 'IN', safeguard: 'Internal', principals: 'Employees, ex-employees' },
  { id: 'payroll', label: 'RazorpayX Payroll', kind: 'system', zone: 'internal', region: 'IN', safeguard: 'Internal', principals: 'Employees' },
  { id: 'biometric', label: 'eSSL terminals', kind: 'system', zone: 'internal', region: 'IN', safeguard: 'Internal', principals: 'Employees, ex-employees', finding: 'G-02', note: 'On-premises · 131 templates for 95 staff' },
  { id: 'vdi', label: 'Annotation floor', kind: 'system', zone: 'internal', region: 'IN', safeguard: 'Internal', principals: 'Client end-users', finding: 'G-01', note: '62 workstations · client data viewed in client tools' },
  { id: 'authbridge', label: 'OnGrid', kind: 'processor', zone: 'india', region: 'IN', safeguard: 'DPA in place', principals: 'Candidates' },
  { id: 'insurer', label: 'ICICI Lombard', kind: 'processor', zone: 'india', region: 'IN', safeguard: 'DPA in place', principals: 'Employees, dependants' },
  { id: 'epfo', label: 'EPFO / ESIC', kind: 'statutory', zone: 'india', region: 'IN', safeguard: 'Statutory', principals: 'Employees' },
  { id: 'ukclient', label: 'US autonomy client', kind: 'client', zone: 'abroad', region: 'US', safeguard: 'Exempt', principals: 'Client end-users' },
];

const FLOW_EDGES: FlowEdge[] = [
  { id: 'f1', from: 'ats', to: 'authbridge', activity: 'PA-02 Pre-employment background verification', label: 'ID, education, PAN', categories: ['Identity documents', 'Address proof', 'Education records', 'Employment history'], principals: 'Candidates', basis: 'Consent' },
  { id: 'f2', from: 'hrms', to: 'insurer', activity: 'PA-08 Group health insurance & dependant enrolment', label: 'Dependants, health', categories: ['Name, date of birth', 'Dependant details', 'Health claims'], principals: 'Employees', basis: 'Consent' },
  { id: 'f3', from: 'hrms', to: 'epfo', activity: 'PA-05 Statutory filings', label: 'UAN, KYC', categories: ['UAN', 'Aadhaar-linked KYC', 'Date of joining'], principals: 'Employees', basis: 'Legal obligation' },
  { id: 'f4', from: 'payroll', to: 'epfo', activity: 'PA-05 Statutory filings', label: 'Wages, contributions', categories: ['PF number', 'Wages', 'Contribution amounts'], principals: 'Employees', basis: 'Legal obligation' },
  { id: 'f5', from: 'vdi', to: 'ukclient', activity: 'PA-12 Client delivery — US autonomous-driving imagery', label: 'Labelled image sets', categories: ['Street-scene images with faces and number plates, handled in the client’s workspace'], principals: 'Client end-users', basis: 's.17(1)(d) exempt', finding: 'G-01' },
];

const G01 = { kind: 'Finding' as const, ref: 'G-01', label: 'Client images downloadable on the floor' };
const DSR_0012 = { kind: 'Request' as const, ref: 'DSR-2026-0012', label: 'Access · Bhargavi Kondapalli, ex-employee' };
const DSR_0011 = { kind: 'Request' as const, ref: 'DSR-2026-0011', label: 'Erasure · Sai Teja Mudiraj, candidate' };
const EXPIRY = { kind: 'Retention expiry' as const, ref: 'RX-2026-09', label: '41 candidates past the 12-month talent pool' };

const TASKS: FulfilmentTask[] = [
  { id: 'T-034', source: DSR_0012, system: 'Darwinbox', action: 'List the personnel-file contents and categories held, for the access response', owner: 'People Operations Lead', due: '28 Oct 2026', status: 'Open' },
  { id: 'T-033', source: G01, system: 'ManageEngine Endpoint Central', action: 'Block USB storage and browser downloads on all 62 annotation workstations', owner: 'IT & Security Lead', due: '20 Oct 2026', status: 'Attested',
    attestation: { by: 'Naveen Kumar Goud, IT & Security Lead', at: '09 Oct 2026, 18:20 IST', note: 'Device-control policy "Floor-Lockdown" pushed to the Annotation group; 62 of 62 devices report compliant.', proof: 'endpoint-central-policy.png' } },
  { id: 'T-031', source: DSR_0011, system: 'OnGrid (processor)', action: 'Instruct the vendor to erase the BGV file and confirm in writing', owner: 'Talent Acquisition Lead', due: '30 Sep 2026', status: 'Attested',
    attestation: { by: 'Karthik Varma, Talent Acquisition Lead', at: '19 Sep 2026, 12:10 IST', note: 'OnGrid confirmed erasure by email, ref ONG-DEL-22871.', proof: 'ongrid-erasure-confirmation.pdf' } },
  { id: 'T-030', source: DSR_0011, system: 'Freshteam', action: 'Erase the candidate record, including the CV', owner: 'Talent Acquisition Lead', due: '30 Sep 2026', status: 'Attested',
    attestation: { by: 'Karthik Varma, Talent Acquisition Lead', at: '18 Sep 2026, 16:45 IST', note: 'Candidate and attachments deleted; removed from two pipelines.', proof: null } },
  { id: 'T-027', source: EXPIRY, system: 'Freshteam', action: 'Purge 41 candidate records past the talent-pool period', owner: 'Talent Acquisition Lead', due: '05 Oct 2026', status: 'Attested',
    attestation: { by: 'Karthik Varma, Talent Acquisition Lead', at: '03 Oct 2026, 11:30 IST', note: 'Monthly purge rule ran; 41 records deleted per the Freshteam activity log.', proof: 'freshteam-purge-log.png' } },
];

const QUADRANT_CHECK_IN: CheckIn = {
  label: 'Q3 2026 check-in',
  due: '24 Oct 2026',
  sentTo: 'People Operations Lead',
  sentOn: '10 Oct 2026',
  last: { on: '11 Jul 2026', changes: 3 },
  questions: [
    { id: 'tools', kind: 'yesno' as const, text: 'Have you started using any new tool or vendor that holds employee, candidate or client data?', register: 'The register lists 12 systems and 7 processors.', placeholder: 'e.g. Moved recruitment from Freshteam to Darwinbox Recruit' },
    { id: 'retired', kind: 'yesno' as const, text: 'Has any tool been replaced or switched off?', register: 'Payroll runs on RazorpayX; attendance on eSSL terminals.', placeholder: 'e.g. Stopped using Slack for shift handovers' },
    { id: 'headcount', kind: 'number' as const, text: 'Roughly how many people are on the payroll today?', register: '95 at the last check-in, all at the Hyderabad office.', placeholder: '95' },
    { id: 'purposes', kind: 'yesno' as const, text: 'Are you using existing data for anything new — monitoring, marketing, analytics?', register: '14 activities, each with one stated purpose.', placeholder: 'e.g. Started ranking annotators on a public leaderboard' },
    { id: 'clients', kind: 'yesno' as const, text: 'Any new client, or a change in where client work is contracted?', register: 'Three overseas clients — two US, one UK — all contracted outside India.', placeholder: 'e.g. New Bengaluru health-tech client from November' },
    { id: 'offplatform', kind: 'yesno' as const, text: 'Did any privacy request, complaint or incident reach you outside this platform?', register: 'Requests come in through the privacy centre or the request inbox.', placeholder: 'e.g. A former annotator called HR asking for their payslips' },
  ],
};

export const QUADRANT: ClientData = {
  registerBuilt: true,
  owners: OWNERS,
  people: [
    { name: 'Sravani Reddy', role: 'People Operations Lead' },
    { name: 'Karthik Varma', role: 'Talent Acquisition Lead' },
    { name: 'Aditya Rao', role: 'Delivery Head' },
    { name: 'Naveen Kumar Goud', role: 'IT & Security Lead' },
    { name: 'Lakshmi Prasanna', role: 'Finance Controller' },
    { name: 'Harsha Vardhan Reddy', role: 'Designated Partner' },
  ],
  activities: ACTIVITIES,
  gaps: GAPS,
  dsrs: DSRS,
  incidents: INCIDENTS,
  tasks: TASKS,
  evidence: [
    { name: 'Record of Processing Activities', status: 'Generated', detail: '14 activities, RoPA v6', ts: '02 Oct 2026' },
    { name: 'Role determination memo', status: 'Generated', detail: '11 Fiduciary, 3 exempt under s.17(1)(d)', ts: '02 Oct 2026' },
    { name: 'Data flow map', status: 'Generated', detail: '12 systems, 2 cross-border destinations', ts: '02 Oct 2026' },
    { name: 'Gap report with remediation plan', status: 'Generated', detail: '10 open findings — 1 High, 4 Medium, 5 Low', ts: '02 Oct 2026' },
    { name: 'Employee privacy notice', status: 'Generated', detail: 'EN, TE, HI — notice v2', ts: '12 Sep 2026' },
    { name: 'Candidate privacy notice', status: 'Generated', detail: 'EN, TE, HI — notice v2, Rule 3 itemised', ts: '12 Sep 2026' },
    { name: 'Retention & erasure policy', status: 'Generated', detail: 'Keyed to 14 activities + Telangana statutory matrix', ts: '19 Sep 2026' },
    { name: 'Data principal request SOP', status: 'Generated', detail: 'Intake, verification, SLA, part-refusal', ts: '22 Aug 2026' },
    { name: 'Breach response SOP', status: 'Generated', detail: 'Signed off 18 Sep 2026 — drill pending (G-05)', ts: '18 Sep 2026' },
    { name: 'Processor / DPA register', status: 'Generated', detail: '6 of 7 processors have an executed DPA or accepted terms', ts: '02 Oct 2026' },
    { name: 'Consent ledger extract', status: 'Generated', detail: '447 records, append-only, hash-chained', ts: '10 Oct 2026' },
    { name: 'Grievance & DPO designation note', status: 'Generated', detail: 'Harsha Vardhan Reddy designated, published on the privacy centre', ts: '29 Aug 2026' },
    { name: 's.17(1)(d) applicability memo', status: 'Review pending', detail: 'US clients mapped; UK clause pending (G-06)', ts: '—' },
  ],
  questionnaire: {
    section: 7,
    sections: 7,
    sectionName: 'Client data & delivery',
    answered: 58,
    total: 58,
    question: 'For each client, where does the client’s data sit while your annotators work on it, and can any of it leave that environment?',
    why: 'The s.17(1)(d) exemption covers data of people outside India processed under a contract with a person outside India. It does not lift the duty to keep that data safe: if annotators can save it locally, a leak is still a breach Quadrant must handle.',
    suggestion:
      'From your MSAs and the tools you named in section 5, the likely answer is: the US autonomy client’s images stay in its Labelbox workspace, the US AI company’s transcripts in its browser-only tool, and the UK retailer’s photos in an S3 bucket reached through VDI. Whether downloads are blocked on the floor should be checked on the walkthrough.',
    followUps: [
      'Can a Reviewer in the client Labelbox workspace export images? (flagged — relates to PA-12)',
      'Which contract clause says the UK retailer contracts from outside India?',
      'Does any client data reach Slack or Google Drive in screenshots or QA notes?',
    ],
    derived: [
      { field: 'Role — PA-12, PA-13, PA-14', value: 'Exempt — s.17(1)(d)', provenance: 'consultant_reviewed' },
      { field: 'Retention — PA-12', value: 'Per MSA — purged at batch sign-off', provenance: 'client_confirmed' },
      { field: 'Cross-border — PA-14', value: 'Data remains in client environment (UK)', provenance: 'ai_suggested' },
    ],
  },
  flowNodes: FLOW_NODES,
  flowEdges: FLOW_EDGES,
  privacyCentre: {
    url: 'privacy.quadrantanalytics.in',
    contactEmail: 'privacy@quadrantanalytics.in',
    inbox: 'requests.quadrant@in.datasentry.in',
    grievanceOfficer: 'Harsha Vardhan Reddy, Designated Partner',
    responseDays: 30,
    languages: ['English', 'తెలుగు', 'हिन्दी'],
    consentSnippet: '<script src="https://datasentry.in/c/quadrant.js" async></script>',
  },
  walkthrough: {
    id: 'WT-2026-03',
    date: '02 Oct 2026, 11:00–11:55 IST',
    consultant: 'Dharita Gada',
    attendees: ['IT & Security Lead', 'Delivery Head', 'People Operations Lead'],
    next: '15 Jan 2027',
    observations: [
      { system: 'ManageEngine Endpoint Central', looked: 'Device control on annotation workstations', declared: 'USB and downloads blocked on the floor', observed: 'Blocked on 48 of 62; 14 in the new bay have no policy', result: 'differs', finding: 'G-01' },
      { system: 'Client Labelbox workspace', looked: 'Export permission for the Reviewer role', declared: null, observed: 'Export enabled; a test image downloaded on screen', result: 'new', finding: 'G-01' },
      { system: 'eSSL admin', looked: 'Enrolled fingerprint templates', declared: 'One per current employee', observed: '131 templates; 95 current employees', result: 'differs', finding: 'G-02' },
      { system: 'Slack', looked: 'Message retention', declared: null, observed: 'Workspace set to keep everything', result: 'new', finding: 'G-10' },
      { system: 'Freshteam', looked: 'Talent-pool purge rule', declared: '12 months, monthly purge', observed: '12 months, last ran 01 Oct 2026', result: 'matches' },
      { system: 'Darwinbox', looked: 'Active employees', declared: '95', observed: '95', result: 'matches' },
    ],
  },
  walkthroughAgenda: [
    { id: 'A1', system: 'ManageEngine Endpoint Central', looked: 'Device-control policy on all 62 workstations', register: 'Blocked on all 62 — attested 09 Oct (T-033)', why: 'Looks at an attested fix', finding: 'G-01' },
    { id: 'A2', system: 'Client Labelbox workspace', looked: 'Export permission for the Reviewer role', register: 'Export enabled on 02 Oct', why: 'Open finding', finding: 'G-01' },
    { id: 'A3', system: 'eSSL admin', looked: 'Templates of former employees', register: '131 templates for 95 staff on 02 Oct', why: 'Open finding', finding: 'G-02' },
    { id: 'A4', system: 'Darwinbox', looked: 'Active employees', register: '95', why: 'Scope check' },
  ],
  checkIn: QUADRANT_CHECK_IN,
  audit: [
    { at: '10 Oct 2026, 09:05', who: 'Dharita Gada', ref: 'Check-in', what: 'Q3 2026 check-in sent to the People Operations Lead' },
    { at: '09 Oct 2026, 18:20', who: 'Naveen Kumar Goud', ref: 'G-01', what: 'Fix attested — device control on all 62 workstations (T-033)' },
    { at: '08 Oct 2026, 15:40', who: 'Naveen Kumar Goud', ref: 'G-05', what: 'Attested that no breach drill has been held', change: { field: 'Basis', from: 'Declared', to: 'Attested' } },
    { at: '07 Oct 2026, 14:12', who: 'Privacy centre', ref: 'DSR-2026-0012', what: 'Access request received — identity verified by email OTP' },
    { at: '02 Oct 2026, 13:10', who: 'Rule engine v1.4', ref: 'G-01', what: 'Finding raised from the walkthrough', change: { field: 'Severity', from: '—', to: 'High' } },
    { at: '02 Oct 2026, 12:30', who: 'Dharita Gada', ref: 'PA-07', what: 'Retention reviewed', change: { field: 'Retention', from: '3 years', to: 'Not stated' } },
    { at: '02 Oct 2026, 12:05', who: 'Sravani Reddy', ref: 'RoPA', what: 'RoPA confirmed', change: { field: 'Version', from: 'v5', to: 'v6' } },
    { at: '29 Sep 2026, 17:15', who: 'Dharita Gada', ref: 'PA-01', what: 'Retention reviewed', change: { field: 'Retention', from: '6 months from application', to: '12 months from application' } },
  ],
  comments: [
    { id: 'q1', ref: 'G-01', who: 'Naveen Kumar Goud', at: '09 Oct 2026, 18:32', visibility: 'shared', text: 'Policy is on all 62 now. Labelbox export is the client’s setting — Aditya has asked their admin to remove it for Reviewers.' },
    { id: 'q2', ref: 'G-01', who: 'Dharita Gada', at: '10 Oct 2026, 10:14', visibility: 'shared', text: '@Aditya Rao thanks — once the client confirms, we will look at both on the January walkthrough and close G-01.' },
    { id: 'q3', ref: 'G-03', who: 'Dharita Gada', at: '03 Oct 2026, 09:50', visibility: 'internal', text: 'Simplest fix is notice v3 saying 12 months; Karthik prefers that to shortening the purge rule.' },
  ],
  scoreHistory: [
    { on: '18 Jul 2026', score: 43 }, { on: '08 Aug 2026', score: 51 }, { on: '29 Aug 2026', score: 58 },
    { on: '19 Sep 2026', score: 63 }, { on: '06 Oct 2026', score: 67 },
  ],
  boardIntimation: null,
  consent: {
    summary: {
      activeCandidate: 382,
      withdrawn: 17,
      expiredClock: 41,
      pendingErasureTasks: 0,
      employeeExceptions: 64,
      noticeVersion: 'v2 — published 12 Sep 2026',
      languages: ['English', 'Telugu', 'Hindi'],
    },
    ledger: [
      { ts: '10 Oct 2026, 15:26', principal: 'Manasa Gorantla', type: 'Candidate', purposes: 'Screening, BGV, Talent pool 12m', notice: 'v2', lang: 'Telugu', action: 'Granted' },
      { ts: '10 Oct 2026, 11:08', principal: 'Rahul Yadav', type: 'Candidate', purposes: 'Screening, BGV', notice: 'v2', lang: 'Hindi', action: 'Granted' },
      { ts: '09 Oct 2026, 18:44', principal: 'Shaik Imran', type: 'Candidate', purposes: 'Talent pool 12m', notice: 'v2', lang: 'English', action: 'Withdrawn' },
      { ts: '08 Oct 2026, 12:02', principal: 'Pooja Nallamothu', type: 'Employee', purposes: 'Dependant enrolment (3 dependants)', notice: 'v2', lang: 'Telugu', action: 'Granted' },
      { ts: '01 Oct 2026, 00:05', principal: 'Vamshi Krishna', type: 'Candidate', purposes: 'Talent pool 12m', notice: 'v1', lang: 'English', action: 'Clock expired' },
    ],
    employeeConsentPurposes: [
      'Candidate screening and background verification',
      'Dependant enrolment in the group policy, including 23 minors',
      'Annotator photographs in client pitch decks',
      'Referral bonus contact with referred friends',
    ],
  },
  progress: [
    { module: 'Scope & role register', seg: 'ropa', pct: 96, note: '14 activities mapped, RoPA v6 confirmed' },
    { module: 'Notice & consent', seg: 'consent', pct: 82, note: 'notice v2 live in 3 languages, Telugu proofread pending' },
    { module: 'DSR & grievance desk', seg: 'dsr', pct: 85, note: 'grievance officer published, 1 request open' },
    { module: 'Breach register', seg: 'breach', pct: 60, note: 'SOP signed off, drill not yet run' },
    { module: 'Evidence & audit pack', seg: 'evidence', pct: 92, note: '12 of 13 artefacts generated' },
  ],
  roles: {
    fiduciary: { count: 11, text: 'Employee, candidate, ex-employee and dependant data. Obligations apply in full.' },
    exempt: { count: 3, text: 'Annotation work for two US AI companies and a UK retailer. Principals are outside India under contract with a person outside India.' },
  },
  basisBreakdown: [
    { label: 's.7(i) employment purposes', count: 5, note: 'Onboarding, payroll, attendance, quality scoring, exit — no consent needed' },
    { label: 's.7(i) safeguarding', count: 1, note: 'Workplace tools and workstation monitoring' },
    { label: 'Legal obligation', count: 2, note: 'PF/ESIC/Telangana PT/TDS filings, POSH records' },
    { label: 'Consent', count: 3, note: 'Candidate screening and BGV, dependant enrolment' },
    { label: 's.17(1)(d) exempt', count: 3, note: 'Annotation for the two US clients and the UK retailer' },
  ],
  processors: [
    { name: 'Freshworks (Freshteam)', activities: 'PA-01', dpa: 'Executed 14 Feb 2025' },
    { name: 'OnGrid (Handy Online Solutions)', activities: 'PA-02', dpa: 'Executed 06 Aug 2026' },
    { name: 'Darwinbox Digital Solutions', activities: 'PA-03, PA-07, PA-09', dpa: 'Executed 22 Nov 2024' },
    { name: 'Razorpay Software', activities: 'PA-04, PA-09', dpa: 'Executed 10 Jan 2025' },
    { name: 'ICICI Lombard', activities: 'PA-08', dpa: 'Executed 01 Apr 2026' },
    { name: 'Policybazaar for Business (broker)', activities: 'PA-08', dpa: 'MISSING' },
    { name: 'Google / Slack Technologies', activities: 'PA-10', dpa: 'Standard terms accepted' },
  ],
  dsrFocus: null,
  crossBorder: [
    { title: 'United States — exempt', text: 'PA-12 and PA-13 client delivery. Principals are outside India under contract with a person outside India. Also on the register: Slack (PA-10), standard terms.', tone: 'ok' },
    { title: 'United Kingdom — exempt', text: 'PA-14 client delivery. Contract clause still to be linked (G-06).', tone: 'ok' },
  ],
};
