/**
 * Meridian Support Solutions — in discovery, phase 1 of 3. The interview has
 * not started, so there is no register: no activities, findings, flows or
 * evidence yet. What does exist from day one is the request desk — Meridian
 * publishes only an email address, so requests arrive by email, forwarded into
 * the platform — and two of them are already past their response window.
 */
import type { ClientData } from './clients';

const EVIDENCE_NAMES = [
  'Record of Processing Activities', 'Role determination memo', 'Data flow map', 'Gap report with remediation plan',
  'Employee privacy notice', 'Candidate privacy notice', 'Retention & erasure policy', 'Data principal request SOP',
  'Breach response SOP', 'Processor / DPA register', 'Consent ledger extract', 'Grievance & DPO designation note',
  's.17(1)(d) applicability memo',
];

export const MERIDIAN: ClientData = {
  registerBuilt: false,
  owners: {
    'HR Head': 'Lakshmi Narayanan',
    'IT Manager': 'Senthil Kumar',
    'Legal & Compliance': 'Aarthi Raman',
  },
  people: [
    { name: 'Lakshmi Narayanan', role: 'HR Head' },
    { name: 'Senthil Kumar', role: 'IT Manager' },
    { name: 'Aarthi Raman', role: 'Legal & Compliance' },
  ],

  activities: [],
  gaps: [],
  dsrs: [
    { id: 'DSR-2026-0014', type: 'Access', principal: 'Karthik Subramanian', relationship: 'Ex-employee — exited 30 Jun 2026', received: '02 Sep 2026', channel: 'Email', daysLeft: -11, status: 'In progress' },
    { id: 'DSR-2026-0015', type: 'Erasure', principal: 'Divya Ramesh', relationship: 'Candidate — applied May 2026', received: '08 Sep 2026', channel: 'Email', daysLeft: -5, status: 'Awaiting client' },
    { id: 'DSR-2026-0016', type: 'Correction', principal: 'Prakash Velu', relationship: 'Current employee', received: '22 Sep 2026', channel: 'Email', daysLeft: 9, status: 'In progress' },
    { id: 'DSR-2026-0017', type: 'Grievance', principal: 'Anonymous (customer of a client)', relationship: 'Client end-user', received: '01 Oct 2026', channel: 'Email', daysLeft: 18, status: 'New' },
    { id: 'DSR-2026-0018', type: 'Access', principal: 'Meena Sundaram', relationship: 'Current employee', received: '09 Oct 2026', channel: 'Email', daysLeft: 26, status: 'New' },
  ],
  incidents: [],
  tasks: [],
  evidence: EVIDENCE_NAMES.map((name) => ({ name, status: 'Not started' as const, detail: 'Generated from the register once discovery is done', ts: '—' })),
  questionnaire: null,
  flowNodes: [],
  flowEdges: [],
  // Meridian publishes an email address only — no hosted privacy centre yet.
  privacyCentre: null,
  walkthrough: null,
  walkthroughAgenda: [],
  checkIn: null,
  audit: [
    { at: '10 Oct 2026, 09:30', who: 'Rohan Mehta', ref: 'DSR-2026-0018', what: 'Request forwarded from privacy@meridiansupport.in and logged', change: { field: 'Status', from: '—', to: 'New' } },
    { at: '09 Oct 2026, 15:00', who: 'Dharita Gada', ref: 'Engagement', what: 'Intake call held with the HR Head and IT Manager — baseline score recorded', change: { field: 'Readiness score', from: '—', to: '19' } },
    { at: '07 Oct 2026, 11:20', who: 'Senthil Kumar', ref: 'Inbox', what: 'Forwarding set up from privacy@meridiansupport.in to the request inbox' },
    { at: '06 Oct 2026, 10:00', who: 'Dharita Gada', ref: 'Engagement', what: 'Engagement opened', change: { field: 'Phase', from: '—', to: 'Discovery — 1 of 3' } },
  ],
  comments: [],
  scoreHistory: [{ on: '09 Oct 2026', score: 19 }],
  boardIntimation: null,
  consent: null,
  progress: [
    { module: 'Scope & role register', seg: 'ropa', pct: 0, note: 'built from the discovery interview' },
    { module: 'Notice & consent', seg: 'consent', pct: 0, note: 'follows the register' },
    { module: 'DSR & grievance desk', seg: 'dsr', pct: 20, note: 'email forwarding live, 2 requests late' },
    { module: 'Breach register', seg: 'breach', pct: 10, note: 'register open, no SOP yet' },
    { module: 'Evidence & audit pack', seg: 'evidence', pct: 0, note: 'generated from the register' },
  ],
  roles: null,
  basisBreakdown: [],
  processors: [],
  dsrFocus: null,
  crossBorder: [],
};
