export type BlogTone = 'primary' | 'secondary' | 'dark';

export type BlogLink = {
  label: string;
  href: string;
  external?: boolean;
};

type ParagraphBlock = {
  type: 'paragraph';
  text: string;
};

type ListBlock = {
  type: 'list';
  title?: string;
  items: string[];
  variant?: 'bullet' | 'check';
};

type QuoteBlock = {
  type: 'quote';
  text: string;
  attribution?: string;
};

type CalloutBlock = {
  type: 'callout';
  title: string;
  text: string;
};

type LinksBlock = {
  type: 'links';
  title?: string;
  links: BlogLink[];
};

export type BlogBlock =
  | ParagraphBlock
  | ListBlock
  | QuoteBlock
  | CalloutBlock
  | LinksBlock;

export type BlogSection = {
  id: string;
  title: string;
  blocks: BlogBlock[];
};

type RawBlogPost = {
  slug: string;
  title: string;
  coverTitle: string;
  category: string;
  publishedAt: string;
  author: string;
  authorRole: string;
  excerpt: string;
  summary: string;
  tone: BlogTone;
  featured?: boolean;
  keyTakeaways: string[];
  disclaimer?: string;
  sections: BlogSection[];
  cta: {
    title: string;
    body: string;
    links: BlogLink[];
  };
};

function collectBlockText(block: BlogBlock): string[] {
  switch (block.type) {
    case 'paragraph':
      return [block.text];
    case 'list':
      return [block.title ?? '', ...block.items];
    case 'quote':
      return [block.text, block.attribution ?? ''];
    case 'callout':
      return [block.title, block.text];
    case 'links':
      return [block.title ?? '', ...block.links.map((link) => link.label)];
    default:
      return [];
  }
}

function estimateReadingMinutes(post: RawBlogPost): number {
  const text = [
    post.title,
    post.excerpt,
    post.summary,
    post.disclaimer ?? '',
    ...post.keyTakeaways,
    ...post.sections.flatMap((section) => [
      section.title,
      ...section.blocks.flatMap((block) => collectBlockText(block)),
    ]),
    post.cta.title,
    post.cta.body,
    ...post.cta.links.map((link) => link.label),
  ]
    .join(' ')
    .trim();

  const wordCount = text.length === 0 ? 0 : text.split(/\s+/).length;
  return Math.max(3, Math.ceil(wordCount / 220));
}

const rawBlogPosts: RawBlogPost[] = [
  {
    slug: 'navigating-sebis-cscrf',
    title: "Navigating SEBI's CSCRF: 3 Things to Fix Before It's Too Late",
    coverTitle: 'SEBI CSCRF',
    category: 'Regulatory Compliance',
    publishedAt: '2025-05-07',
    author: 'Dharita Gada',
    authorRole: 'Founder, DataSentry',
    excerpt:
      'A practical guide for SEBI-regulated entities to understand and implement the Cyber Security and Cyber Resilience Framework.',
    summary:
      'CSCRF turns cybersecurity from an IT-only concern into an evidence-driven governance program. This guide breaks down what changed, why it matters, and where regulated entities should focus first.',
    tone: 'primary',
    featured: true,
    keyTakeaways: [
      'CSCRF expects documented controls, board oversight, and evidence that resilience practices are operational.',
      'A focused gap assessment is the fastest way to surface weak access controls, monitoring gaps, and recovery risks.',
      'Mid-size and qualified entities need stronger monitoring, audit evidence, and regulator-ready reporting.',
    ],
    disclaimer:
      'This article is for general information only and should not be treated as legal or financial advice. Consult professional advisors for guidance specific to your entity and regulatory posture.',
    sections: [
      {
        id: 'what-cscrf-changes',
        title: 'What CSCRF changes',
        blocks: [
          {
            type: 'paragraph',
            text:
              "CSCRF was introduced by SEBI in August 2024 to consolidate cybersecurity expectations for SEBI-regulated entities into a single operating framework.",
          },
          {
            type: 'paragraph',
            text:
              'The shift is not only about preventing attacks. It is about proving that your organization can anticipate, withstand, respond to, and recover from cyber incidents with documented evidence.',
          },
        ],
      },
      {
        id: 'why-board-level-attention-matters',
        title: 'Why board-level attention matters',
        blocks: [
          {
            type: 'paragraph',
            text:
              "Cyberattacks on financial firms in India are increasing in both volume and complexity. Ransomware, phishing, and service disruption now create direct business and regulatory exposure.",
          },
          {
            type: 'paragraph',
            text:
              "CSCRF makes it clear that cybersecurity is no longer a narrow IT task. Governance, reporting, ownership, and oversight all have to stand up to scrutiny.",
          },
          {
            type: 'quote',
            text:
              'Cybersecurity is no longer only an IT problem. Under CSCRF, it is a boardroom responsibility backed by evidence.',
          },
        ],
      },
      {
        id: 'what-good-evidence-looks-like',
        title: 'What good evidence looks like',
        blocks: [
          {
            type: 'paragraph',
            text:
              'A credible CSCRF program is built on operating evidence, not assumptions. Regulators will expect the control environment to be visible, repeatable, and reviewable.',
          },
          {
            type: 'list',
            items: [
              'Policies that are documented and aligned to actual operations',
              'Real-time monitoring over key systems, logs, and alerts',
              'Clear ownership from the CISO through to senior management and the board',
              'Regular incident response drills and recovery exercises',
              'Reporting rhythms that support management review and regulatory escalation',
            ],
          },
        ],
      },
      {
        id: 'assess-your-posture',
        title: 'Step 1: Assess your current posture',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Start with a gap assessment across the controls that most directly affect resilience and evidence readiness.',
          },
          {
            type: 'list',
            title: 'Review these areas first',
            items: [
              'Access controls and privileged access management',
              'Endpoint protection and hardening',
              'Backup, restoration, and recovery discipline',
              'Log collection, alerting, and monitoring coverage',
              'Incident response roles, triggers, and runbooks',
            ],
          },
          {
            type: 'callout',
            title: 'Priority lens',
            text:
              'Look for the controls that are both weak and easy to improve. Quick wins reduce exposure while larger remediation work is planned.',
          },
        ],
      },
      {
        id: 'formalize-governance',
        title: 'Step 2: Formalize governance and documentation',
        blocks: [
          {
            type: 'paragraph',
            text:
              'CSCRF places heavy weight on accountability. If responsibilities are unclear or the paperwork does not reflect reality, the control environment will not hold up.',
          },
          {
            type: 'list',
            title: 'Documentation to tighten up',
            items: [
              'Cybersecurity policies tailored to the business instead of boilerplate templates',
              'Named owners for key controls, especially the CISO function',
              'Incident response plans, risk registers, and escalation workflows',
              'Audit-ready records that show approvals, testing, and follow-through',
            ],
          },
          {
            type: 'callout',
            title: 'Bottom line',
            text: "If it is not documented, reviewed, and maintained, it will be difficult to defend.",
          },
        ],
      },
      {
        id: 'operationalize-monitoring',
        title: 'Step 3: Operationalize monitoring and reporting',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Mid-size and qualified regulated entities should expect higher expectations around visibility, resilience, and reporting discipline.',
          },
          {
            type: 'list',
            title: 'Baseline expectations',
            items: [
              'A board-approved cybersecurity policy and ongoing risk management framework',
              'Identification of critical systems with regular risk assessments',
              'Strong access controls, encryption, segmentation, and log retention',
              'A functioning SOC capability and periodic CERT-In aligned reviews',
              'Documented incident response, crisis management, and recovery plans',
            ],
          },
          {
            type: 'list',
            title: 'Additional expectations for qualified entities',
            items: [
              'Annual Cyber Capability Index self-assessments',
              'Regular VAPT, red teaming, and API security validation',
              'ISO 27001 certification and periodic SOC effectiveness reviews',
            ],
          },
          {
            type: 'callout',
            title: 'Readiness target',
            text:
              'Resilience is not optional. The goal is to show that controls are active, tested, and visible to leadership.',
          },
        ],
      },
    ],
    cta: {
      title: 'Translate CSCRF into evidence',
      body:
        'If you need help turning framework language into working controls, DataSentry can help you prioritize the first 90 days.',
      links: [
        {
          label: 'Book a consultation',
          href: 'https://calendly.com/dharita-gada-datasentry/30min',
          external: true,
        },
        {
          label: 'Talk to DataSentry',
          href: '/contact',
        },
      ],
    },
  },
  {
    slug: 'how-secure-is-your-most-sensitive-data',
    title: 'How secure is your most sensitive data?',
    coverTitle: 'Sensitive Data',
    category: 'Background Screening',
    publishedAt: '2025-07-09',
    author: 'Dharita Gada',
    authorRole: 'Founder, DataSentry',
    excerpt:
      'Key lessons from our conversation with Chetan Desai on protecting high-risk screening data and moving beyond checkbox compliance.',
    summary:
      'Background screening firms sit on dense concentrations of sensitive personal data. This episode recap explains why that raises the bar for security operations, privacy governance, and leadership accountability.',
    tone: 'secondary',
    keyTakeaways: [
      'Screening data combines identity, financial, and background records that attackers can monetize quickly.',
      'ISO 27001 certification is a baseline, not a substitute for continuous monitoring and training.',
      'DPDP readiness depends on minimization, consent clarity, rights handling, and breach reporting discipline.',
    ],
    sections: [
      {
        id: 'why-screening-data-is-high-risk',
        title: 'Why screening data creates outsized risk',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Background screening firms process personally identifiable information, financial records, and sensitive history data in one place. That concentration makes them attractive targets.',
          },
          {
            type: 'paragraph',
            text:
              'A breach in this environment does not only expose records. It can damage trust, trigger legal exposure, and disrupt client relationships at the same time.',
          },
        ],
      },
      {
        id: 'security-beyond-certification',
        title: 'Security is broader than certification',
        blocks: [
          {
            type: 'paragraph',
            text:
              'One of the clearest points from the discussion was that compliance does not automatically equal security. Certification helps, but it does not replace day-to-day operating discipline.',
          },
          {
            type: 'quote',
            text: "Being compliant is not the same as being secure.",
            attribution: 'Chetan Desai',
          },
          {
            type: 'list',
            title: 'What real protection still requires',
            items: [
              'Continuous monitoring over systems and access patterns',
              'Regular employee awareness and training',
              'Active support from senior leadership',
            ],
          },
        ],
      },
      {
        id: 'iso-27001-2022-transition',
        title: 'What the ISO 27001:2022 shift means',
        blocks: [
          {
            type: 'paragraph',
            text:
              'The move from the 2013 version of ISO 27001 to ISO 27001:2022 is not a cosmetic update. It pushes teams to align risk management with current operating realities.',
          },
          {
            type: 'list',
            title: 'Why the update matters',
            items: [
              'Stronger emphasis on risk-based decision making',
              'A leaner control set that is easier to navigate and explain',
              'Better fit for cloud infrastructure, remote work, and modern tooling',
            ],
          },
        ],
      },
      {
        id: 'dpdp-priorities',
        title: 'What DPDP readiness should focus on',
        blocks: [
          {
            type: 'paragraph',
            text:
              "India's DPDP Act increases the pressure to collect less, explain processing clearly, and handle rights requests in a disciplined way.",
          },
          {
            type: 'list',
            title: 'Operational priorities',
            items: [
              'Collect only the data that is necessary for the screening purpose',
              'Capture informed consent in language people can understand',
              'Support access, correction, and deletion requests consistently',
              'Prepare breach notification workflows for escalation to the Data Protection Board of India',
            ],
          },
        ],
      },
      {
        id: 'misconceptions-to-drop',
        title: 'Misconceptions worth dropping early',
        blocks: [
          {
            type: 'list',
            items: [
              'Certification alone does not make an organization safe.',
              'Encryption is essential, but it does not solve weak processes or poor access discipline.',
              'Smaller firms are still attractive targets if they hold valuable data.',
            ],
          },
          {
            type: 'callout',
            title: 'Operating principle',
            text:
              'Security has to be treated as a company-wide habit, not a back-office responsibility delegated to one team.',
          },
        ],
      },
      {
        id: 'listen-to-the-full-episode',
        title: 'Listen to the full conversation',
        blocks: [
          {
            type: 'links',
            title: 'Continue with the supporting content',
            links: [
              {
                label: 'Watch the SecureSearch episode on YouTube',
                href: 'https://www.youtube.com/watch?v=OQ-zUwuVBl4',
                external: true,
              },
              {
                label: 'Browse all podcast episodes',
                href: '/podcast',
              },
            ],
          },
        ],
      },
    ],
    cta: {
      title: 'Continue the conversation',
      body:
        'Watch the full episode for the detailed discussion on ISO 27001:2022, DPDP readiness, and operational security habits.',
      links: [
        {
          label: 'Watch the episode',
          href: 'https://www.youtube.com/watch?v=OQ-zUwuVBl4',
          external: true,
        },
        {
          label: 'Browse the podcast',
          href: '/podcast',
        },
      ],
    },
  },
  {
    slug: 'compliance-competitive-advantage',
    title: 'How Companies Turn Compliance into a Competitive Advantage',
    coverTitle: 'Competitive Advantage',
    category: 'Strategic Governance',
    publishedAt: '2025-05-23',
    author: 'Dharita Gada',
    authorRole:
      'Founder @DataSentry | ISO & GRC Consultant | InfoSec, DPDP, GDPR, VAPT | Helping Mid-size Businesses Stay Compliant, Secure & Audit ready',
    excerpt:
      'Episode 1 recap on how Nexsales turned its certified security program into a competitive edge.',
    summary:
      'Most teams treat compliance like a chore, but this episode shows how the right security and compliance program can actually accelerate the business.',
    tone: 'dark',
    keyTakeaways: [
      'The team reworked policies to match how people actually work.',
      'Security became an integral part of daily decisions instead of a side process.',
      'Compliance turned into a growth tool rather than a bottleneck.',
    ],
    sections: [
      {
        id: 'episode-1-recap-and-free-downloads',
        title: 'Episode 1 Recap + Free Downloads',
        blocks: [
          {
            type: 'paragraph',
            text:
              "Let's be real: most teams treat compliance like a chore. Something you do for the audit. Something you hope never slows you down. But what if security and compliance could actually accelerate your business?",
          },
          {
            type: 'paragraph',
            text:
              'In Episode 1 of the DataSentry Podcast, we sat down with Rohit Bhat, VP of Operations at Nexsales, to unpack how they turned their certified security program into a competitive edge and how you can, too.',
            },
        ],
      },
      {
        id: 'from-certified-to-business-ready',
        title: 'From "Certified" to Business-Ready',
        blocks: [
          {
            type: 'paragraph',
            text:
              "Nexsales already had ISO 27001. But as the company scaled fast, those early policies couldn't keep up. Documentation drifted. Actual operations looked nothing like the paper trail.",
          },
          {
            type: 'paragraph',
            text:
              'Instead of waiting for cracks to show, they took action and turned their security program into a living, breathing part of the business.',
          },
          {
            type: 'list',
            title: "Here's what changed",
            variant: 'check',
            items: [
              'The team reworked the policies to match how people actually work.',
              'Teams were trained on the why, not just the what.',
              'Security became an integral part of daily decisions.',
              'Compliance turned into a growth tool, not a bottleneck.',
            ],
          },
          {
            type: 'quote',
            text: 'When employees saw how security supported our growth, they stopped resisting it.',
            attribution: 'Rohit Bhat',
          },
        ],
      },
      {
        id: 'what-they-gained',
        title: 'What They Gained',
        blocks: [
          {
            type: 'paragraph',
            text:
              'By aligning compliance with real operations, Nexsales saw:',
          },
          {
            type: 'list',
            variant: 'check',
            items: [
              'Stronger trust from enterprise clients',
              'Smoother onboarding and sales cycles',
              'More confident teams in customer conversations',
              'Resilience against evolving threats (AI, new regulations, etc.)',
            ],
          },
        ],
      },
      {
        id: 'free-resource',
        title: 'Free Resource',
        blocks: [
          {
            type: 'paragraph',
            text:
              'We made a quick-start tool for Founders and Operations leaders who want to actually make progress on compliance without getting lost in jargon.',
          },
          {
            type: 'links',
            title: 'Download: The Compliance Conversation Guide',
            links: [
              {
                label: 'Grab it here',
                href: '/contact',
              },
            ],
          },
          {
            type: 'paragraph',
            text:
              'Get the prompts, talking points, and mindset shifts to kick-start your own journey.',
          },
        ],
      },
      {
        id: 'listen-to-the-full-story',
        title: 'Listen to the Full Story',
        blocks: [
          {
            type: 'paragraph',
            text:
              "This episode isn't a checklist; it's a playbook. Hear how Nexsales made compliance part of their core strategy and how it's paying off.",
          },
          {
            type: 'links',
            links: [
              {
                label: 'Watch on YouTube',
                href: 'https://www.youtube.com/watch?v=uNJ3IGD4Ak0',
                external: true,
              },
            ],
          },
          {
            type: 'paragraph',
            text: 'Until next time,',
          },
          {
            type: 'paragraph',
            text: 'The DataSentry Team',
          },
        ],
      },
    ],
    cta: {
      title: 'Watch Episode 1',
      body:
        'Turning Compliance into a Competitive Advantage is available on YouTube if you want the full conversation behind this recap.',
      links: [
        {
          label: 'Watch on YouTube',
          href: 'https://www.youtube.com/watch?v=uNJ3IGD4Ak0',
          external: true,
        },
        {
          label: 'Grab the guide',
          href: '/contact',
        },
      ],
    },
  },
];

export const blogPosts = rawBlogPosts
  .map((post) => ({
    ...post,
    readingMinutes: estimateReadingMinutes(post),
  }))
  .sort(
    (left, right) =>
      new Date(`${right.publishedAt}T00:00:00Z`).getTime() -
      new Date(`${left.publishedAt}T00:00:00Z`).getTime(),
  );

export type BlogPost = (typeof blogPosts)[number];

export const featuredBlogPost =
  blogPosts.find((post) => post.featured) ?? blogPosts[0];

export const standardBlogPosts = blogPosts.filter(
  (post) => post.slug !== featuredBlogPost.slug,
);

export const blogCategories = Array.from(
  new Set(blogPosts.map((post) => post.category)),
);

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function formatBlogDate(
  date: string,
  month: 'short' | 'long' = 'short',
) {
  return new Intl.DateTimeFormat('en-US', {
    month,
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
