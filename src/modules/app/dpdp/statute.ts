/**
 * Statutory dates from the DPDP Act 2023 and the DPDP Rules 2025. These are
 * real, not mock data, so they live outside mock/ and carry over to the live app.
 */

/** Statutory milestones — drive the commencement countdown. */
export const DEADLINE = {
  label: 'DPDP substantive compliance',
  date: '2027-05-13',
  /** DPDP Rules 2025 notified (G.S.R. 846(E)); substantive obligations follow 18 months later. */
  notified: '2025-11-13',
  rulesNote: 'Rules 3, 5-16, 22-23 (notice, consent, safeguards, breach reporting, principal rights)',
  consentManager: '2026-11-13',
};
