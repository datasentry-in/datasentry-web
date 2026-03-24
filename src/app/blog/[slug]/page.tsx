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
      <h3>Disclaimer</h3>
      <p><em>This newsletter is for general information only and not legal or financial advice. DataSentry is not liable for actions taken based on this content. Please consult professional advisors for guidance specific to your situation.</em></p>

      <h3>What Is CSCRF and Why Should You Care?</h3>
      <p>Imagine: You’re a regulated financial entity in India, perhaps a stockbroker, asset manager, or depository participant. One day, SEBI knocks on your door, asking for detailed evidence of your cybersecurity measures: policies, monitoring systems, incident response plans, and board-level oversight. If you’re caught unprepared, the consequences could be severe.</p>
      
      <p>In August 2024, the Securities and Exchange Board of India (SEBI) introduced the Cybersecurity and Cyber Resilience Framework (CSCRF). This framework consolidates various cybersecurity requirements into a unified, comprehensive guideline applicable to all SEBI-regulated entities (REs). It mandates that REs not only implement robust cybersecurity measures but also demonstrate resilience — the ability to anticipate, withstand, and recover from cyber incidents.</p>

      <h3>The 3-Step CSCRF Readiness Guide</h3>
      <p><strong>Step 1: Assess Your Cybersecurity Posture.</strong> Start with a gap analysis. Look at access controls, endpoint protection, data backup, log monitoring, and incident response.</p>
      <p><strong>Step 2: Build Governance &amp; Documentation.</strong> CSCRF emphasizes accountability. You’ll need customized policies, clear roles (like a dedicated CISO), and audit-ready documentation. If it’s not written down, it didn’t happen.</p>
      <p><strong>Step 3: Implement Real-Time Monitoring &amp; Reporting.</strong> SEBI expects ongoing risk management, strong access controls, encryption, Network segmentation, and a fully functional Security Operations Centre (SOC) for Mid-size or Qualified Regulatory Entities.</p>
    `
  },
  'how-secure-is-your-most-sensitive-data': {
    title: 'How secure is your most sensitive data?',
    cat: 'Background Screening',
    date: 'Jul 9, 2025',
    author: 'Dharita Gada',
    content: `
      <h3>The Hidden Vulnerabilities in Screening</h3>
      <p>In a recent discussion with Chetan Desai, we explored the high-stakes security challenges inherent to the background screening industry. Every day, screening firms process highly sensitive personal data—from financial records to criminal histories. Yet, the infrastructure protecting this data often lags behind the sophistication of modern threats.</p>
      
      <h3>Data Lifecycle and Silos</h3>
      <p>One of the biggest risks is fragmented data storage. When sensitive information is passed between HR systems, screening vendors, and sub-contractors via email or unsecured APIs, the attack surface multiplies. Organizations need to adopt end-to-end encryption and zero-trust architectures to ensure that data remains secure both at rest and in transit.</p>
      
      <h3>Preparing for Modern Regulations</h3>
      <p>With regulations like India's DPDP Act coming into full force, the cost of a breach extends far beyond operational downtime—it threatens the very existence of the firm through direct penalties and catastrophic reputational damage. Security can no longer be an afterthought; it must be the foundation upon which screening services are built.</p>
    `
  },
  'compliance-competitive-advantage': {
    title: 'How Companies Turn Compliance into a Competitive Advantage',
    cat: 'Strategic Governance',
    date: 'May 23, 2025',
    author: 'Dharita Gada',
    content: `
      <h3>Beyond Check-Box Compliance</h3>
      <p>For decades, compliance has been viewed as a tax on doing business—a mere cost center required to avoid regulatory fines. However, forward-thinking organizations are realizing that robust data privacy and security frameworks can be a massive competitive differentiator.</p>
      
      <h3>Trust as a Business Differentiator</h3>
      <p>In B2B environments, especially within SaaS, FinTech, and enterprise services, procurement teams are actively filtering out vendors with weak security postures. By achieving and maintaining standards like ISO 27001, SOC 2, and DPDPA compliance, companies significantly shorten sales cycles and win enterprise deals that would otherwise be lost to more secure competitors.</p>
      
      <h3>The ROI of Good Governance</h3>
      <p>When compliance is integrated into the product design phase (Privacy by Design), it builds inherent trust with end-users. Customers are increasingly loyal to platforms that transparently protect their data. Ultimately, turning compliance into a competitive advantage means treating security not as a hurdle to jump over, but as a feature you actively sell.</p>
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
        <article className="max-w-3xl mx-auto px-6 py-16 md:py-24 prose prose-lg prose-headings:font-display prose-headings:font-bold prose-headings:text-black prose-p:font-mono prose-p:text-gray-700 prose-p:leading-relaxed prose-h3:mb-2 prose-h3:mt-8 prose-p:mt-0 prose-p:mb-5 prose-li:font-mono prose-li:text-gray-700 prose-a:text-secondary hover:prose-a:text-primary transition-colors">
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
