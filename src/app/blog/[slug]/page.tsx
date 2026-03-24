import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Static Data for the 3 Blogs
const blogPosts = {
  'navigating-sebis-cscrf': {
    title: 'Navigating SEBI’s CSCRF: 3 Things to Fix Before It’s Too Late📰',
    cat: 'Regulatory Compliance',
    date: 'May 7, 2025',
    author: 'Dharita Gada',
    content: `
      <p><em>Disclaimer: This newsletter is for general information only and not legal or financial advice. DataSentry is not liable for actions taken based on this content. Please consult professional advisors for guidance specific to your situation.</em></p>
      
      <p>Imagine: You’re a regulated financial entity in India, perhaps a stockbroker, asset manager, or depository participant. One day, SEBI knocks on your door, asking for detailed evidence of your cybersecurity measures: policies, monitoring systems, incident response plans, and board-level oversight.</p>
      
      <p>If you’re caught unprepared, the consequences could be severe.</p>
      
      <h3>📰 What Is CSCRF and Why Should You Care?</h3>
      <p>In August 2024, the Securities and Exchange Board of India (SEBI) introduced the Cybersecurity and Cyber Resilience Framework (CSCRF). This framework consolidates various cybersecurity requirements into a unified, comprehensive guideline applicable to all SEBI-regulated entities (REs).</p>
      
      <p>The CSCRF is SEBI’s response to the escalating cyber threats in the financial sector. It mandates that REs not only implement robust cybersecurity measures but also demonstrate resilience — the ability to anticipate, withstand, and recover from cyber incidents.</p>

      <h3>📰 Why Now?</h3>
      <p>Cyberattacks on financial firms in India are rising in both volume and complexity. Think of ransomware shutting down brokers mid-trade or phishing attacks stealing investor data. SEBI isn’t waiting for another big breach to happen.</p>

      <p>With CSCRF, SEBI is telling the industry:</p>
      <p><em>“Cybersecurity isn’t just an IT problem anymore. It’s a boardroom responsibility.”</em></p>

      <h3>📰 The Core Idea of CSCRF</h3>
      <p>CSCRF says, “You must build a cybersecurity system that can both prevent attacks and bounce back from them. And you must prove it with evidence.”</p>
      
      <p>This includes:</p>
      <ul>
        <li>Policies that are documented, not just understood</li>
        <li>Real-time monitoring of your IT systems and data</li>
        <li>Clear roles, from CISO to the board</li>
        <li>Regular incident response drills</li>
        <li>Reports sent to top management and regulators</li>
      </ul>

      <h3>📰 The 3-Step CSCRF Readiness Guide</h3>
      <p><strong>🔴 Step 1: Assess Your Cybersecurity Posture</strong></p>
      <p>Start with a gap analysis. Look at:</p>
      <ul>
        <li>Access controls</li>
        <li>Endpoint protection</li>
        <li>Data backup and recovery</li>
        <li>Log monitoring</li>
        <li>Incident response</li>
      </ul>
      <p>Bottom line: Find weak spots and prioritize quick wins before tackling long-term gaps.</p>

      <p><strong>🟠 Step 2: Build Governance &amp; Documentation</strong></p>
      <p>CSCRF emphasizes accountability. You’ll need:</p>
      <ul>
        <li>Cybersecurity policies (customized, not boilerplate)</li>
        <li>Clear roles and ownership, especially a dedicated CISO</li>
        <li>Updated incident response plans and risk registers</li>
        <li>Audit-ready documentation</li>
      </ul>
      <p>Bottom line: If it’s not written down, it didn’t happen.</p>

      <p><strong>🟡 Step 3: Implement Real-Time Monitoring &amp; Reporting</strong></p>
      <p>If you're a Mid-size or Qualified Regulatory Entity, SEBI expects:</p>
      <ul>
        <li>A board-approved cybersecurity policy and ongoing risk management framework</li>
        <li>Identification of critical systems, with regular risk assessments (including post-quantum risks)</li>
        <li>Strong access controls, encryption, network segmentation, and log retention</li>
        <li>A fully functional Security Operations Centre (SOC) and periodic CERT-In audits</li>
        <li>Documented incident response, crisis management, and recovery plans</li>
      </ul>

      <p>Additionally, Qualified REs must also have:</p>
      <ul>
        <li>Annual Cyber Capability Index (CCI) self-assessments</li>
        <li>Regular VAPT, red teaming, and API security measures</li>
        <li>ISO 27001 certification and bi-annual SOC effectiveness reviews</li>
      </ul>
      <p>Bottom line: For Mid-size and Qualified REs, resilience isn't optional — it's mandated.</p>
    `
  },
  'how-secure-is-your-most-sensitive-data': {
    title: 'How secure is your most sensitive data?',
    cat: 'Background Screening',
    date: 'July 9, 2025',
    author: 'Dharita Gada',
    content: `
      <p>In this episode of Breach the Noise, we speak with Chetan Desai, CEO of SecureSearch Screening Services —a leading provider of background screening services that manages some of the most sensitive data in the corporate world.</p>
      
      <p>Here’s what you’ll learn in less than 30 minutes:</p>

      <h3>🔍 Why Background Screening is a Security Pressure Cooker</h3>
      <p>SecureSearch manages personally identifiable info, financial records, criminal history, and more. A breach here doesn’t just expose data—it risks lives, lawsuits, and long-term trust.</p>

      <h3>📜 Security is Not Just Compliance</h3>
      <p>Chetan Desai reminds us: being compliant isn’t the same as being secure. Real protection requires constant monitoring, employee training, and senior leadership buy-in.</p>

      <h3>🔄 The ISO 27001 Update: From 2013 to 2022</h3>
      <p>SecureSearch Screening Services is transitioning to the newer ISO 27001:2022 standard. Why?</p>
      <ul>
        <li>Stronger risk management</li>
        <li>Fewer, clearer controls (93 vs 114)</li>
        <li>Better fit for modern tech: cloud, remote work, etc.</li>
      </ul>

      <h3>🛡️ Preparing for India’s DPDP Act (2023)</h3>
      <p>Companies must now:</p>
      <ul>
        <li>Collect only essential data</li>
        <li>Get clear, informed consent</li>
        <li>Offer data access, correction, and deletion rights</li>
        <li>Notify breaches to the Data Protection Board of India</li>
      </ul>

      <h3>🧠 Common Misconceptions (That Could Cost You)</h3>
      <ul>
        <li>“We are certified, so we are safe.” ❌</li>
        <li>“Encryption solves everything.” ❌</li>
        <li>“We are too small to be a target.” ❌</li>
      </ul>

      <p>Security isn’t just an IT task. It’s a company-wide mindset.</p>
      <p>Security is no longer a back-office function. It’s a leadership priority, a business enabler, and a brand protector.</p>

      <p>🎧 Listen to the full episode here: <a href="https://www.youtube.com/watch?v=OQ-zUwuVBl4" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline break-all">https://www.youtube.com/watch?v=OQ-zUwuVBl4</a></p>
    `
  },
  'compliance-competitive-advantage': {
    title: 'How Companies Turn Compliance into a Competitive Advantage',
    cat: 'Strategic Governance',
    date: 'May 23, 2025',
    author: 'Dharita Gada',
    content: `
      <h3>Episode 1 Recap + Free Downloads</h3>
      <p>Let’s be real: most teams treat compliance like a chore. Something you do for the audit. Something you hope never slows you down. But what if security and compliance could actually accelerate your business?</p>

      <p>In Episode 1 of the DataSentry Podcast, we sat down with Rohit Bhat, VP of Operations at Nexsales, to unpack how they turned their certified security program into a competitive edge and how you can, too.</p>

      <h3>From "Certified" to Business-Ready</h3>
      <p>Nexsales already had ISO 27001. But as the company scaled fast, those early policies couldn’t keep up. Documentation drifted. Actual operations looked nothing like the paper trail.</p>

      <p>Instead of waiting for cracks to show, they took action and turned their security program into a living, breathing part of the business.</p>

      <p>Here’s what changed:</p>
      <ul>
        <li>The team reworked the policies to match how people actually work.</li>
        <li>Teams were trained on the why, not just the what</li>
        <li>Security became an integral part of daily decisions</li>
        <li>Compliance turned into a growth tool, not a bottleneck</li>
      </ul>

      <p><em>“When employees saw how security supported our growth, they stopped resisting it.” — Rohit Bhat</em></p>

      <h3>What They Gained</h3>
      <p>By aligning compliance with real operations, Nexsales saw:</p>
      <ul>
        <li>✔️ Stronger trust from enterprise clients</li>
        <li>✔️ Smoother onboarding and sales cycles</li>
        <li>✔️ More confident teams in customer conversations</li>
        <li>✔️ Resilience against evolving threats (AI, new regulations, etc.)</li>
      </ul>

      <h3>Free Resource</h3>
      <p>We made a quick-start tool for Founders and Operations leaders who want to actually make progress on compliance without getting lost in jargon.</p>

      <p>📄 Download: The Compliance Conversation Guide</p>
      <p>Get the prompts, talking points, and mindset shifts to kick-start your own journey. 👉 Grab it here</p>

      <h3>🎧 Listen to the Full Story</h3>
      <p>This episode isn’t a checklist; it’s a playbook. Hear how Nexsales made compliance part of their core strategy and how it’s paying off.</p>

      <p>▶️ Watch Episode 1: Turning Compliance into a Competitive Advantage 👉 Watch on YouTube</p>

      <p>Until next time,</p>
      <p>— The DataSentry Team</p>
    `
  }
};

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug: slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-light">
        {/* Post Header */}
        <header className="w-full bg-background-dark text-white pt-32 pb-16 md:pb-24 border-b-[3px] border-black">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-primary text-black px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-black inline-block shadow-brutal-sm">
                {post.cat}
              </span>
              <span className="text-gray-400 font-mono text-xs uppercase">{post.date}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8 font-display">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary border-2 border-black overflow-hidden flex items-center justify-center font-bold font-display text-xl text-white">
                DG
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm uppercase font-mono">{post.author}</span>
                <span className="text-gray-400 text-xs font-mono uppercase">DataSentry Founder</span>
              </div>
            </div>
          </div>
        </header>

        {/* Thumbnail Replacement (Blank/Black block per request) */}
        <div className="w-full bg-black h-48 md:h-64 border-b-[3px] border-black flex items-center justify-center relative">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
        </div>

        {/* Article Body */}
        <article className="max-w-3xl mx-auto px-6 py-16 md:py-24 prose prose-lg prose-headings:font-display prose-headings:font-bold prose-headings:text-black prose-p:font-mono prose-p:text-gray-700 prose-p:leading-relaxed prose-li:font-mono prose-li:text-gray-700 prose-a:text-secondary hover:prose-a:text-primary transition-colors">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
        
        {/* Back Link */}
        <div className="max-w-3xl mx-auto px-6 pb-24">
          <Link href="/blog" className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase bg-white border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_#FFED00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <span className="material-icons text-base">arrow_back</span> Back to Blog
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
