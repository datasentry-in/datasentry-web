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

/**
 * The data principal's rights as the privacy centre offers them, in plain
 * language, with the provision behind each. Shared by the public page and the
 * request form.
 */
export const RIGHTS = [
  { type: 'access', title: 'Get a summary of your information', note: 'What we hold about you, and who we have shared it with.', right: 's.11', dsr: 'Access' },
  { type: 'correction', title: 'Correct or update something', note: 'Fix information that is wrong, incomplete or out of date.', right: 's.12', dsr: 'Correction' },
  { type: 'erasure', title: 'Ask us to erase your information', note: 'Where the law requires us to keep something, we’ll tell you what and why.', right: 's.12', dsr: 'Erasure' },
  { type: 'withdraw', title: 'Withdraw your consent', note: 'Stop processing that relies on consent you gave — as easily as you gave it.', right: 's.6(4)', dsr: 'Consent withdrawal' },
  { type: 'grievance', title: 'Raise a concern', note: 'Tell us about anything in how we handle your information.', right: 's.13', dsr: 'Grievance' },
  { type: 'nomination', title: 'Nominate someone', note: 'Name a person to act for you in the event of death or incapacity.', right: 's.14', dsr: 'Nomination' },
] as const;

export type RightType = (typeof RIGHTS)[number]['type'];
