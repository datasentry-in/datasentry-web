/**
 * The adaptive discovery question engine, as a mock.
 *
 * The scope document draws a hard line (docs/dpdp-mvp-scope.md, M1): the model
 * selects and phrases questions and normalises free-text into register fields;
 * a deterministic, versioned rule set draws every legal conclusion. This file
 * keeps that separation visible — `buildSection` is the "model" side (which
 * questions to ask, which activities to propose) and `fireRules` is the rule
 * engine (what follows, with a provision cited).
 *
 * Nothing here calls an API. The branching is real, though: the questions a
 * viewer sees genuinely depend on what they answered in section 1.
 */

export type Answers = Record<string, string | string[]>;

export type Choice = { value: string; label: string; hint?: string };

export type Question = {
  id: string;
  text: string;
  why: string;
  kind: 'text' | 'single' | 'multi' | 'number';
  options?: Choice[];
  placeholder?: string;
  provision?: string;
  /** Where the question came from — the honest version of "AI generated". */
  source: 'pack' | 'proposed' | 'followup';
  /** The answer that caused this question to be asked. */
  because?: string;
  /** The RoPA field it fills. */
  populates?: string;
};

export type SkippedQuestion = { text: string; reason: string };

export type DerivedRow = {
  id: string;
  name: string;
  principals: string;
  note: string;
  source: 'pack' | 'proposed';
};

export type RuleHit = {
  rule: string;
  kind: 'finding' | 'exemption' | 'note';
  title: string;
  detail: string;
  provision: string;
};

export type Section = {
  n: number;
  name: string;
  questions: Question[];
  skipped: SkippedQuestion[];
  /** The visible reasoning trace, revealed line by line. */
  trace: string[];
};

const has = (a: Answers, key: string, value: string) => {
  const v = a[key];
  return Array.isArray(v) ? v.includes(value) : v === value;
};
const list = (a: Answers, key: string) => (Array.isArray(a[key]) ? (a[key] as string[]) : []);
const text = (a: Answers, key: string) => (typeof a[key] === 'string' ? (a[key] as string) : '');

/* ------------------------------------------------------------- section one */

export const SYSTEM_CHOICES: Choice[] = [
  { value: 'ats', label: 'Applicant tracking / recruitment', hint: 'Zoho Recruit, Naukri RMS, Keka Hire' },
  { value: 'hrms', label: 'HRMS / employee records', hint: 'Keka, Darwinbox, greytHR' },
  { value: 'payroll', label: 'Payroll & statutory filings', hint: 'Zoho Payroll, RazorpayX, in-house' },
  { value: 'biometric', label: 'Biometric attendance or access control' },
  { value: 'cctv', label: 'CCTV / visitor register' },
  { value: 'insurance', label: 'Group mediclaim or benefits portal' },
  { value: 'marketing', label: 'Email marketing or CRM', hint: 'Mailchimp, HubSpot, Zoho CRM' },
  { value: 'ticketing', label: 'Client ticketing / helpdesk platform' },
  { value: 'monitoring', label: 'IT monitoring, DLP or endpoint agents' },
];

export const SECTION_1: Question[] = [
  {
    id: 'what',
    text: 'In your own words, what does the company actually do for its clients?',
    why: 'Free text is where activities that are not in the ITES domain pack surface. The question engine reads this before it chooses anything else to ask.',
    kind: 'text',
    placeholder:
      'e.g. We run a 24x7 technical helpdesk for two US software firms and one Indian telco. Agents take calls and chats, raise tickets, and sometimes screen-share into a customer’s machine.',
    source: 'pack',
    populates: 'Activity candidates',
  },
  {
    id: 'headcount',
    text: 'How many people are on the payroll today, including contractors on site?',
    why: 'Headcount sets the scale of the employee register and decides whether an Internal Committee under the POSH Act is mandatory.',
    kind: 'number',
    placeholder: '410',
    source: 'pack',
    populates: 'Scope — data principal volume',
  },
  {
    id: 'states',
    text: 'Which states do you operate in?',
    why: 'Shops and Establishments registers, professional tax and labour-record retention are state law, and they are what makes an erasure request lawfully refusable in part.',
    kind: 'multi',
    options: [
      { value: 'tn', label: 'Tamil Nadu' },
      { value: 'ka', label: 'Karnataka' },
      { value: 'mh', label: 'Maharashtra' },
      { value: 'tg', label: 'Telangana' },
      { value: 'dl', label: 'Delhi NCR' },
      { value: 'other', label: 'Elsewhere in India' },
    ],
    source: 'pack',
    populates: 'Scope — jurisdictions',
  },
  {
    id: 'systems',
    text: 'Which of these hold personal data today?',
    why: 'Each system selected pulls its canonical activities out of the ITES pack, and each one left unselected removes a whole branch of questions.',
    kind: 'multi',
    options: SYSTEM_CHOICES,
    source: 'pack',
    populates: 'Systems register',
  },
  {
    id: 'offshore',
    text: 'Do you deliver services to clients outside India?',
    why: 'This is the single biggest scope reducer in the Act. Processing the data of principals outside India under a contract with a person outside India is exempt from most substantive obligations.',
    kind: 'single',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No — Indian clients only' },
    ],
    provision: 's.17(1)(d)',
    source: 'pack',
    populates: 'Role determination input',
  },
  {
    id: 'departments',
    text: 'Which departments should be in scope for this assessment?',
    why: 'Role is decided per processing activity, never per department — but departments tell the engine who it will need to interview next.',
    kind: 'multi',
    options: [
      { value: 'hr', label: 'Human Resources' },
      { value: 'fin', label: 'Finance' },
      { value: 'ops', label: 'Delivery / Operations' },
      { value: 'it', label: 'IT & Security' },
      { value: 'admin', label: 'Admin & Facilities' },
      { value: 'sales', label: 'Sales & Marketing' },
    ],
    source: 'pack',
    populates: 'Scope — departments',
  },
];

/* ------------------------------------------------------- section two engine */

type Conditional = { when: (a: Answers) => boolean; q: Question; skipReason: string };

const SECTION_2_POOL: Conditional[] = [
  {
    when: (a) => has(a, 'offshore', 'yes'),
    skipReason: 'you deliver only to Indian clients, so the s.17(1)(d) branch does not apply',
    q: {
      id: 'offshore_countries',
      text: 'Where are those clients contracted, and whose data do your agents actually touch?',
      why: 'The exemption turns on two facts together: the data principals are outside India, and the contract is with a person outside India. Either one alone does not carry it.',
      kind: 'multi',
      options: [
        { value: 'us_entity', label: 'Contract is with a US-incorporated entity' },
        { value: 'uk_entity', label: 'Contract is with a UK-incorporated entity' },
        { value: 'in_entity', label: 'Contract is with the client’s Indian subsidiary' },
        { value: 'principals_outside', label: 'The end customers we handle are outside India' },
        { value: 'principals_india', label: 'Some end customers are in India' },
      ],
      provision: 's.17(1)(d)',
      source: 'pack',
      because: 'you said you deliver to clients outside India',
      populates: 'Role — offshore delivery activities',
    },
  },
  {
    when: (a) => has(a, 'offshore', 'yes'),
    skipReason: 'no offshore delivery to evidence',
    q: {
      id: 'offshore_evidence',
      text: 'Can you produce the MSA or SOW clause that names the contracting entity and the territory?',
      why: 'An exemption claimed without contract evidence on file is a finding, not a saving. The memo in the evidence pack cites this clause.',
      kind: 'single',
      options: [
        { value: 'yes', label: 'Yes, legal can pull it' },
        { value: 'partly', label: 'For some clients only' },
        { value: 'no', label: 'Not easily' },
      ],
      provision: 's.17(1)(d)',
      source: 'followup',
      because: 'an exemption needs evidence on file',
      populates: 'Evidence — s.17(1)(d) memo',
    },
  },
  {
    when: (a) => has(a, 'systems', 'ats'),
    skipReason: 'no applicant tracking system was selected',
    q: {
      id: 'candidate_retention',
      text: 'How long do you keep a CV from someone you did not hire?',
      why: 'The indefinitely retained resume database is the most common high-severity finding in ITES. Once the purpose is served, s.8(7) requires erasure.',
      kind: 'single',
      options: [
        { value: 'never', label: 'We have never deleted any of them' },
        { value: 'unsure', label: 'Nobody has decided' },
        { value: '180', label: 'Around 180 days' },
        { value: '1y', label: 'About a year' },
      ],
      provision: 's.8(7)',
      source: 'pack',
      because: 'you said candidate data sits in an ATS',
      populates: 'Retention — PA Recruitment',
    },
  },
  {
    when: (a) => has(a, 'systems', 'ats'),
    skipReason: 'no recruitment activity in scope',
    q: {
      id: 'bgv',
      text: 'Who runs background verification on an offered candidate, and is there a signed data processing agreement with them?',
      why: 'A BGV vendor is a Processor. s.8(2) requires a written contract before personal data reaches them, and candidate screening is one of the few places consent is genuinely the right basis.',
      kind: 'single',
      options: [
        { value: 'vendor_no_dpa', label: 'An external vendor, no DPA that I know of' },
        { value: 'vendor_dpa', label: 'An external vendor, DPA signed' },
        { value: 'inhouse', label: 'We do it in-house' },
        { value: 'none', label: 'We do not run BGV' },
      ],
      provision: 's.8(2)',
      source: 'pack',
      because: 'recruitment is in scope',
      populates: 'Processor register',
    },
  },
  {
    when: (a) => has(a, 'systems', 'biometric'),
    skipReason: 'no biometric attendance or access control was selected',
    q: {
      id: 'biometric_purpose',
      text: 'What is the biometric data used for, and does the template leave the device?',
      why: 'Attendance and premises access sit under the employment and safeguarding legitimate use. Anything beyond that — productivity scoring, for instance — needs its own basis.',
      kind: 'multi',
      options: [
        { value: 'attendance', label: 'Attendance and payroll input' },
        { value: 'access', label: 'Door and floor access' },
        { value: 'client_floor', label: 'Client-mandated secure floor access' },
        { value: 'exported', label: 'Templates sync to a vendor cloud' },
      ],
      provision: 's.7(i)',
      source: 'pack',
      because: 'you selected biometric attendance',
      populates: 'Basis — PA Attendance',
    },
  },
  {
    when: (a) => has(a, 'systems', 'cctv'),
    skipReason: 'no CCTV or visitor register was selected',
    q: {
      id: 'cctv_retention',
      text: 'How long is CCTV footage kept, and is there a notice at the entrance saying so?',
      why: 'Surveillance runs on the safeguarding limb of s.7(i), but the footage still needs a stated retention period and visitors still need notice.',
      kind: 'single',
      options: [
        { value: '30', label: '30 days, overwritten automatically' },
        { value: '90', label: '90 days or more' },
        { value: 'client', label: 'Whatever the client contract demands' },
        { value: 'unsure', label: 'Until the disk fills up' },
      ],
      provision: 's.7(i) safeguarding',
      source: 'pack',
      because: 'you selected CCTV and visitor records',
      populates: 'Retention — PA Surveillance',
    },
  },
  {
    when: (a) => has(a, 'systems', 'insurance'),
    skipReason: 'no benefits or mediclaim portal was selected',
    q: {
      id: 'dependants',
      text: 'Does the group policy cover dependants, and are any of them under eighteen?',
      why: 'Children’s data carries its own regime under s.9 — guardian consent, and no tracking or behavioural advertising directed at them.',
      kind: 'single',
      options: [
        { value: 'yes_minors', label: 'Yes, including children' },
        { value: 'yes_adults', label: 'Yes, adults only' },
        { value: 'no', label: 'Employee only' },
      ],
      provision: 's.9',
      source: 'pack',
      because: 'you selected a group mediclaim portal',
      populates: 'Activity — Dependant enrolment',
    },
  },
  {
    when: (a) => has(a, 'systems', 'marketing'),
    skipReason: 'no marketing or CRM system was selected',
    q: {
      id: 'alumni',
      text: 'Does anyone market to ex-employees or to people who only ever enquired on the website?',
      why: 'The employment legitimate use does not obviously survive the end of employment, so post-exit communication needs a basis of its own — usually consent.',
      kind: 'multi',
      options: [
        { value: 'alumni', label: 'Alumni mailers to ex-employees' },
        { value: 'enquiries', label: 'Website enquiry follow-ups' },
        { value: 'referral', label: 'Referral campaigns to past candidates' },
        { value: 'none', label: 'None of these' },
      ],
      provision: 's.6 read with s.7(i)',
      source: 'proposed',
      because: 'your free-text answer and your CRM selection both point at post-exit contact',
      populates: 'Basis — PA Alumni communications',
    },
  },
  {
    when: (a) => has(a, 'systems', 'monitoring') || has(a, 'departments', 'it'),
    skipReason: 'no monitoring tooling and no IT function in scope',
    q: {
      id: 'monitoring_scope',
      text: 'What do the endpoint and DLP agents capture?',
      why: 'Monitoring to protect the employer from loss or liability is a legitimate use. Monitoring for performance management is a different purpose and needs to be recorded as one.',
      kind: 'multi',
      options: [
        { value: 'dlp', label: 'File movement and data loss prevention' },
        { value: 'web', label: 'Web and application usage' },
        { value: 'screenshots', label: 'Periodic screenshots or keystrokes' },
        { value: 'calls', label: 'Call and screen recording on client work' },
      ],
      provision: 's.7(i) safeguarding',
      source: 'pack',
      because: 'you put IT & Security in scope',
      populates: 'Basis — PA IT monitoring',
    },
  },
  {
    when: (a) => has(a, 'systems', 'ticketing') || has(a, 'departments', 'ops'),
    skipReason: 'no delivery platform and no operations function in scope',
    q: {
      id: 'client_data',
      text: 'When an agent handles a ticket, whose personal data do they see?',
      why: 'This decides whether the company is a Fiduciary or a Processor for the delivery work — and it is decided per activity, not per client.',
      kind: 'multi',
      options: [
        { value: 'client_customers', label: 'The client’s own end customers' },
        { value: 'client_staff', label: 'The client’s staff' },
        { value: 'payment', label: 'Payment or financial identifiers' },
        { value: 'health', label: 'Health or insurance details' },
      ],
      provision: 's.2(i), s.8',
      source: 'pack',
      because: 'delivery work is in scope',
      populates: 'Role — PA Client delivery',
    },
  },
  {
    when: (a) => Number(text(a, 'headcount') || '0') >= 10,
    skipReason: 'below the headcount at which an Internal Committee is mandatory',
    q: {
      id: 'posh',
      text: 'Does the Internal Committee under the POSH Act keep its case records, and where?',
      why: 'POSH records carry a statutory retention that overrides an erasure request. This is the row that makes a part-refusal letter defensible later.',
      kind: 'single',
      options: [
        { value: 'hr_drive', label: 'In a shared HR drive folder' },
        { value: 'locked', label: 'Physical file, locked cabinet' },
        { value: 'none', label: 'No cases so far' },
      ],
      provision: 'POSH Act 2013, s.21',
      source: 'pack',
      because: 'your headcount makes an Internal Committee mandatory',
      populates: 'Retention — PA Grievance records',
    },
  },
  {
    when: (a) => list(a, 'states').length > 0,
    skipReason: 'no state of operation recorded yet',
    q: {
      id: 'labour_records',
      text: 'Who holds the Shops and Establishments register and the muster roll?',
      why: 'These are state-law retention grounds. They are the most common reason an ex-employee erasure request can only be partly honoured.',
      kind: 'single',
      options: [
        { value: 'inhouse', label: 'HR keeps them in-house' },
        { value: 'consultant', label: 'A labour-law consultant holds them' },
        { value: 'unsure', label: 'Not sure who holds them' },
      ],
      provision: 'State Shops & Establishments Acts',
      source: 'followup',
      because: 'of the states you selected',
      populates: 'Retention matrix input',
    },
  },
];

/** Rule-engine output. Deterministic, versioned, each hit citing a provision. */
export function fireRules(a: Answers): RuleHit[] {
  const hits: RuleHit[] = [];

  if (has(a, 'offshore', 'yes')) {
    const outside = has(a, 'offshore_countries', 'principals_outside');
    const foreignEntity =
      has(a, 'offshore_countries', 'us_entity') || has(a, 'offshore_countries', 'uk_entity');
    const indiaPrincipals = has(a, 'offshore_countries', 'principals_india');
    const indianEntity = has(a, 'offshore_countries', 'in_entity');

    if (outside && foreignEntity) {
      hits.push({
        rule: 'R-04',
        kind: 'exemption',
        title: 'Offshore delivery activities are candidates for the s.17(1)(d) exemption',
        detail:
          'Principals outside India, contract with a person outside India. Most substantive obligations fall away for those activities — security safeguards and the processor contract do not.',
        provision: 's.17(1)(d)',
      });
    }
    if (indianEntity && outside) {
      hits.push({
        rule: 'R-05',
        kind: 'note',
        title: 'Contracts routed through an Indian subsidiary break the exemption',
        detail:
          'Where the contracting party is an Indian entity, s.17(1)(d) does not apply even though the end customers are abroad. These activities stay in full scope and need to be separated in the register.',
        provision: 's.17(1)(d)',
      });
    }
    if (indiaPrincipals) {
      hits.push({
        rule: 'R-06',
        kind: 'note',
        title: 'Indian end customers in the same queue cannot ride the exemption',
        detail:
          'Split the delivery activity in two. Mixing them in one register row is how an exemption claim fails under scrutiny.',
        provision: 's.17(1)(d)',
      });
    }
    if (has(a, 'offshore_evidence', 'no') || has(a, 'offshore_evidence', 'partly')) {
      hits.push({
        rule: 'R-07',
        kind: 'finding',
        title: 'Exemption claimed without contract evidence on file',
        detail:
          'The applicability memo cannot be generated until the MSA or SOW clause naming the contracting entity and territory is attached per client.',
        provision: 's.17(1)(d)',
      });
    }
  }

  if (has(a, 'candidate_retention', 'never') || has(a, 'candidate_retention', 'unsure')) {
    hits.push({
      rule: 'R-08',
      kind: 'finding',
      title: 'Talent pool has no erasure trigger',
      detail:
        'CVs retained after the purpose is served, with no stated period and no purge ever run. Expect this to be the largest single volume of personal data in the organisation.',
      provision: 's.8(7)',
    });
  }
  if (has(a, 'bgv', 'vendor_no_dpa')) {
    hits.push({
      rule: 'R-12',
      kind: 'finding',
      title: 'Background verification vendor engaged without a data processing agreement',
      detail:
        'Identity, education, employment and criminal-record data reaches a Processor with no written contract in place.',
      provision: 's.8(2)',
    });
  }
  if (has(a, 'dependants', 'yes_minors')) {
    hits.push({
      rule: 'R-09',
      kind: 'finding',
      title: 'Children’s data processed without a recorded guardian consent',
      detail:
        'Dependant enrolment covering under-18s needs verifiable guardian consent and carries a prohibition on tracking and targeted advertising.',
      provision: 's.9',
    });
  }
  if (has(a, 'alumni', 'alumni') || has(a, 'alumni', 'referral')) {
    hits.push({
      rule: 'R-24',
      kind: 'finding',
      title: 'Post-exit communication has no determined basis',
      detail:
        'Commentary is divided on whether the employment legitimate use survives the end of employment, so alumni and past-candidate campaigns need consent or a statutory ground recorded against them.',
      provision: 's.6 read with s.7(i)',
    });
  }
  if (has(a, 'monitoring_scope', 'screenshots')) {
    hits.push({
      rule: 'R-18',
      kind: 'finding',
      title: 'Monitoring extends beyond the safeguarding purpose',
      detail:
        'Periodic screenshots and keystroke capture go past protecting the employer from loss or liability. Record the purpose separately and tell employees it happens.',
      provision: 's.7(i) safeguarding',
    });
  }
  if (has(a, 'biometric_purpose', 'exported')) {
    hits.push({
      rule: 'R-21',
      kind: 'finding',
      title: 'Biometric templates leave the device for a vendor cloud',
      detail:
        'The device vendor becomes a Processor and needs a DPA, and the template store needs its own retention and deletion trigger.',
      provision: 's.8(2)',
    });
  }
  if (has(a, 'cctv_retention', 'unsure')) {
    hits.push({
      rule: 'R-22',
      kind: 'finding',
      title: 'Surveillance footage has no stated retention period',
      detail: 'Footage kept until storage is reclaimed is retention by accident, which no notice can describe accurately.',
      provision: 's.7(i) safeguarding',
    });
  }
  if (has(a, 'client_data', 'client_customers')) {
    hits.push({
      rule: 'R-14',
      kind: 'note',
      title: 'Delivery work is Processor-side, not Fiduciary-side',
      detail:
        'Purpose and means are set by the client, so the obligations here run through the client contract. The register still records it, and the security safeguards still apply.',
      provision: 's.8',
    });
  }
  if (has(a, 'labour_records', 'unsure')) {
    hits.push({
      rule: 'R-31',
      kind: 'finding',
      title: 'Statutory labour records are unlocated',
      detail:
        'Until the holder of the Shops and Establishments register is identified, an ex-employee erasure request cannot be answered without guessing.',
      provision: 'State Shops & Establishments Acts',
    });
  }

  return hits;
}

/** Register rows the model proposes from section 1 alone. */
export function proposeActivities(a: Answers): DerivedRow[] {
  const rows: DerivedRow[] = [];
  const push = (id: string, name: string, principals: string, note: string, source: 'pack' | 'proposed' = 'pack') =>
    rows.push({ id, name, principals, note, source });

  if (has(a, 'systems', 'ats')) {
    push('PA-01', 'Recruitment & applicant tracking', 'Candidate', 'Consent is the right basis here, not s.7(i)');
    push('PA-02', 'Pre-employment background verification', 'Candidate', 'Vendor is a Processor — needs a DPA');
  }
  if (has(a, 'systems', 'hrms')) {
    push('PA-03', 'Employee records & lifecycle', 'Employee', 'Legitimate use under s.7(i)');
  }
  if (has(a, 'systems', 'payroll')) {
    push('PA-04', 'Payroll processing', 'Employee', 'Legitimate use under s.7(i)');
    push('PA-05', 'PF, ESIC, PT and TDS filings', 'Employee', 'Legal obligation — statutory retention applies');
  }
  if (has(a, 'systems', 'biometric')) {
    push('PA-06', 'Attendance & premises access', 'Employee, visitor', 'Safeguarding limb of s.7(i)');
  }
  if (has(a, 'systems', 'cctv')) {
    push('PA-07', 'CCTV & visitor register', 'Employee, visitor', 'Needs a stated retention period');
  }
  if (has(a, 'systems', 'insurance')) {
    push('PA-08', 'Group mediclaim & dependant enrolment', 'Employee, dependant', 'Dependant data may bring s.9 into play');
  }
  if (has(a, 'systems', 'marketing')) {
    push('PA-09', 'Marketing & website enquiries', 'Prospect, ex-employee', 'Consent territory — basis to be determined');
  }
  if (has(a, 'systems', 'monitoring')) {
    push('PA-10', 'IT monitoring & data loss prevention', 'Employee', 'Safeguarding limb of s.7(i)');
  }
  if (has(a, 'systems', 'ticketing')) {
    push('PA-11', 'Client delivery — ticket handling', 'Client end-user', 'Role decided by who sets purpose and means');
  }
  if (has(a, 'offshore', 'yes')) {
    push('PA-12', 'Offshore delivery for non-Indian clients', 'Client end-user (outside India)', 'Candidate for the s.17(1)(d) exemption', 'proposed');
  }
  if (has(a, 'departments', 'fin')) {
    push('PA-13', 'Vendor & contractor management', 'Vendor contact', 'Fiduciary regardless of department', 'proposed');
  }
  return rows;
}

/* ------------------------------------------------------------ the sections */

export function buildSection2(a: Answers): Section {
  const asked = SECTION_2_POOL.filter((c) => c.when(a)).map((c) => c.q);
  const skipped = SECTION_2_POOL.filter((c) => !c.when(a)).map((c) => ({
    text: c.q.text,
    reason: c.skipReason,
  }));

  const systems = list(a, 'systems').length;
  const states = list(a, 'states')
    .map((s) => ({ tn: 'Tamil Nadu', ka: 'Karnataka', mh: 'Maharashtra', tg: 'Telangana', dl: 'Delhi NCR', other: 'other states' }[s] ?? s))
    .join(', ');
  const free = text(a, 'what').trim();
  const proposed = proposeActivities(a);

  const trace = [
    `Reading the free-text answer (${free.split(/\s+/).filter(Boolean).length} words) and normalising it into activity candidates.`,
    `Matching ${systems} selected system${systems === 1 ? '' : 's'} against the ITES domain pack — ${proposed.filter((r) => r.source === 'pack').length} canonical activities matched.`,
    (() => {
      const n = proposed.filter((r) => r.source === 'proposed').length;
      if (n === 0) return 'No activities outside the domain pack were detected in your description.';
      return n === 1
        ? 'Proposing 1 activity that is not in the pack, read out of your own description.'
        : `Proposing ${n} activities that are not in the pack, read out of your own description.`;
    })(),
    states ? `Loading state-law retention grounds for ${states}.` : 'No state selected — labour-record retention questions held back.',
    has(a, 'offshore', 'yes')
      ? 'Offshore delivery declared — opening the s.17(1)(d) branch, which is the largest scope reducer available to you.'
      : 'Indian clients only — the s.17(1)(d) branch stays closed.',
    `Selected ${asked.length} follow-up questions and skipped ${skipped.length} that your answers made irrelevant.`,
  ];

  return { n: 2, name: 'Processing detail', questions: asked, skipped, trace };
}

export function buildSection3(a: Answers): Section {
  const qs: Question[] = [];

  if (has(a, 'candidate_retention', 'never') || has(a, 'candidate_retention', 'unsure')) {
    qs.push({
      id: 's3_ats_volume',
      text: 'Roughly how many CVs are sitting in the system, and how old is the oldest?',
      why: 'You don’t need to send anything. Read the count off the screen now, or show it on the next walkthrough — the age of the oldest records is usually the single biggest finding in the report.',
      kind: 'single',
      options: [
        { value: 'export', label: 'We can show it on the next walkthrough' },
        { value: 'admin', label: 'Only the vendor admin can' },
        { value: 'unknown', label: 'No idea how many there are' },
      ],
      source: 'followup',
      because: 'you said the talent pool has never been purged',
      populates: 'Walkthrough agenda — ATS',
    });
  }
  if (has(a, 'bgv', 'vendor_no_dpa')) {
    qs.push({
      id: 's3_bgv_name',
      text: 'Which vendor is it, and what do you send them?',
      why: 'The processor register needs the vendor named and the data categories listed before a DPA can be drafted against it.',
      kind: 'text',
      placeholder: 'e.g. AuthBridge — PAN, Aadhaar, education certificates, past employer details',
      provision: 's.8(2)',
      source: 'followup',
      because: 'you said there is no DPA with the BGV vendor',
      populates: 'Processor register',
    });
  }
  if (has(a, 'alumni', 'alumni') || has(a, 'alumni', 'referral')) {
    qs.push({
      id: 's3_alumni_source',
      text: 'Where does the alumni mailing list come from?',
      why: 'If it is drawn from exit records, the basis question attaches to the exit activity rather than to the mailing itself.',
      kind: 'single',
      options: [
        { value: 'exit', label: 'Exported from exit records' },
        { value: 'optin', label: 'People opted in before leaving' },
        { value: 'personal', label: 'Someone’s personal contact list' },
      ],
      source: 'followup',
      because: 'you said ex-employees get marketing mail',
      populates: 'Basis — PA Alumni communications',
    });
  }
  if (has(a, 'dependants', 'yes_minors')) {
    qs.push({
      id: 's3_guardian',
      text: 'Is anything recorded to show the parent or guardian agreed to the child’s enrolment?',
      why: 'An attestation at enrolment is enough to evidence guardian consent. Verifiable parental verification is explicitly out of scope for the first release.',
      kind: 'single',
      options: [
        { value: 'form', label: 'A signed enrolment form' },
        { value: 'email', label: 'An email from the employee only' },
        { value: 'nothing', label: 'Nothing specific' },
      ],
      provision: 's.9',
      source: 'followup',
      because: 'you said dependants include children',
      populates: 'Evidence — guardian attestation',
    });
  }
  if (has(a, 'offshore_evidence', 'no') || has(a, 'offshore_evidence', 'partly')) {
    qs.push({
      id: 's3_msa',
      text: 'Who in the business can get the signed MSAs out of the contract folder?',
      why: 'The exemption memo is blocked until the clause is attached, so this becomes a remediation task with an owner rather than an open question.',
      kind: 'text',
      placeholder: 'e.g. Head of Legal — contracts sit in SharePoint, restricted folder',
      source: 'followup',
      because: 'the contract evidence is not readily available',
      populates: 'Remediation task owner',
    });
  }
  if (has(a, 'labour_records', 'unsure')) {
    qs.push({
      id: 's3_labour_owner',
      text: 'Who would know where the muster roll and the Shops and Establishments register are kept?',
      why: 'Finding the holder is a five-minute task that unblocks the entire retention matrix for ex-employee requests.',
      kind: 'text',
      placeholder: 'e.g. the labour-law consultant in Chennai, through the Admin manager',
      source: 'followup',
      because: 'nobody could place the statutory labour records',
      populates: 'Retention matrix input',
    });
  }

  if (qs.length === 0) {
    qs.push({
      id: 's3_clean',
      text: 'Nothing in your answers raised a follow-up. Is there anything you know of that we have not asked about?',
      why: 'The engine only knows what the pack and your answers contain. A free-text escape hatch is how a genuinely unusual activity gets into the register.',
      kind: 'text',
      placeholder: 'e.g. we run a weekend coaching programme for a local college and hold student records',
      source: 'followup',
      populates: 'Activity candidates',
    });
  }

  const trace = [
    'Re-reading section 2 against the rule set (v1.4) before choosing what to ask next.',
    `${fireRules(a).length} rule${fireRules(a).length === 1 ? '' : 's'} fired on your answers — each one cites a provision and becomes a report line.`,
    `Generating ${qs.length} targeted follow-up${qs.length === 1 ? '' : 's'}; the remaining pack questions are already answered or do not apply.`,
    'Nothing here concludes anything legal — the questions fill fields, the rule engine draws the conclusions.',
  ];

  return { n: 3, name: 'Targeted follow-ups', questions: qs, skipped: [], trace };
}

/** Illustrative model-call accounting, shown to make the cost story concrete. */
export const CALL_META = {
  model: 'claude-opus-5-5',
  effort: 'high',
  cachedPrefix: '18.2k tokens — Act ss.5–9, 11–14, 16–17; Rules 3–7; ITES pack',
};
