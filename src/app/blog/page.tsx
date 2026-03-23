import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Blog() {
  const featuredArticle = {
    title: 'DPDPA Act: Implementation Insights for Global Background Screening',
    cat: 'Privacy & Compliance',
    date: 'Mar 23, 2026',
    desc: 'A strategic look at why the Digital Personal Data Protection (DPDPA) Act compliance is a boardroom and business-wide priority rather than just a technical IT checklist. Discusses lifecycle governance, strategic risk, and making compliance actionable.',
    slug: '/blog/dpdpa-implementation-insights'
  };

  const remainingArticles = [
    {
      title: 'How secure is your most sensitive data?',
      cat: 'Background Screening',
      date: 'Jul 9, 2025',
      desc: 'In this edition of Breach the Noise, Dharita speaks with Chetan Desai about the high-stakes security challenges in the background screening industry.',
      slug: '/blog/how-secure-is-your-most-sensitive-data'
    },
    {
      title: 'How Companies Turn Compliance into a Competitive Advantage',
      cat: 'Strategic Governance',
      date: 'May 23, 2025',
      desc: 'Explores the shift from check-box compliance to using data privacy and security as a core business differentiator and trust-builder.',
      slug: '/blog/compliance-competitive-advantage'
    }
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <header className="w-full bg-background-dark text-white py-12 md:py-24 border-b-[3px] border-black">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-4xl">
              <div className="inline-block bg-secondary text-white px-3 py-1 font-mono text-xs uppercase mb-6 border border-white/30">
                Cybersecurity Intelligence
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6 md:mb-8 font-display">
                Security intelligence for teams that <span className="text-primary italic">build.</span>
              </h2>
              <p className="text-base md:text-xl text-gray-300 max-w-2xl font-mono leading-relaxed mb-8 md:mb-10 border-l-4 border-primary pl-4 sm:pl-6">
                In-depth analysis, engineering tutorials, and compliance guides for the modern stack. No fluff, just raw data and actionable insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex w-full max-w-sm border-2 border-white bg-white">
                  <input className="w-full bg-transparent border-none px-4 py-3 text-black font-mono text-sm uppercase outline-none placeholder:text-gray-500" placeholder="ENTER YOUR EMAIL" type="email" />
                  <button className="bg-primary text-black px-6 py-3 font-bold uppercase hover:bg-white border-l-2 border-black transition-colors">
                    <span className="material-icons">arrow_forward</span>
                  </button>
                </div>
                <span className="text-gray-500 font-mono text-xs uppercase">Join 11,000+ Engineers</span>
              </div>
            </div>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="w-full bg-primary border-b-[3px] border-black overflow-x-auto">
          <div className="max-w-[1200px] mx-auto px-6 py-4">
            <div className="flex gap-3 min-w-max">
              {['All Posts', 'Engineering', 'GRC & Compliance', 'Cloud Security', 'Tutorials', 'Data Privacy'].map((tag, i) => (
                <button key={i} className={`${i === 0 ? 'bg-black text-white translate-y-[2px]' : 'bg-white text-black hover:-translate-y-1'} border-2 border-black px-4 py-2 font-mono text-sm font-bold uppercase transition-all`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-16">
          <div className="mb-16 relative">
            <div className="bg-white border-[3px] border-black shadow-brutal-yellow p-0 flex flex-col md:flex-row overflow-hidden group hover:shadow-brutal-black transition-all duration-300 min-h-[400px]">
              <div className="md:w-1/2 bg-black relative min-h-[320px] md:min-h-auto overflow-hidden flex items-center justify-center">
                <div className="relative z-10 p-8 self-end w-full">
                  <span className="bg-white text-black px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-black inline-block mb-4 shadow-brutal-sm">Latest Insight</span>
                </div>
              </div>
              <div className="md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center border-t-[3px] md:border-t-0 md:border-l-[3px] border-black bg-white relative">
                <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-2 font-mono text-xs font-bold uppercase border-l-[3px] border-b-[3px] border-black">Featured</div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 font-mono text-xs font-bold uppercase border border-secondary">{featuredArticle.cat}</span>
                  <span className="text-gray-500 text-xs font-mono uppercase">{featuredArticle.date}</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-bold leading-[1.1] mb-4 group-hover:text-secondary transition-colors font-display">
                  {featuredArticle.title}
                </h3>
                <p className="text-gray-600 font-mono text-sm md:text-base mb-8 leading-relaxed border-l-2 border-gray-200 pl-4">
                  {featuredArticle.desc}
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <Link href={featuredArticle.slug} className="flex items-center gap-2 bg-primary border-2 border-black px-6 py-3 font-bold text-sm uppercase shadow-brutal-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    Read Article <span className="material-icons text-lg">arrow_outward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t-[3px] border-l-[3px] border-black">
            {remainingArticles.map((a, i) => (
              <article key={i} className={`group border-r-[3px] border-b-[3px] border-black ${i % 2 === 0 ? 'bg-white' : 'bg-background-light'} hover:bg-primary/5 transition-colors relative flex flex-col h-full`}>
                <div className={`h-48 bg-black flex items-center justify-center relative overflow-hidden border-b-[3px] border-black`}>
                  {/* Blank Thumbnail per user request */}
                </div>
                <div className="p-6 flex flex-col grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono text-xs font-bold uppercase text-secondary">{a.cat}</span>
                    <span className="font-mono text-xs text-gray-400">{a.date}</span>
                  </div>
                  <h4 className="text-xl font-bold leading-tight mb-3 group-hover:underline decoration-2 underline-offset-2 font-display">{a.title}</h4>
                  <p className="text-sm font-mono text-gray-600 mb-6 grow line-clamp-3">{a.desc}</p>
                  <Link className="inline-flex items-center gap-2 font-bold text-sm uppercase hover:text-secondary mt-auto" href={a.slug}>
                    Read Article <span className="material-icons text-base">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-16">
            <button className="w-11 h-11 bg-white border-2 border-black flex items-center justify-center font-mono font-bold hover:bg-black hover:text-white transition-colors"><span className="material-icons">chevron_left</span></button>
            <button className="w-11 h-11 bg-black text-primary border-2 border-black flex items-center justify-center font-mono font-bold">1</button>
            <button className="w-11 h-11 bg-white border-2 border-black flex items-center justify-center font-mono font-bold hover:bg-black hover:text-white transition-colors">2</button>
            <button className="w-11 h-11 bg-white border-2 border-black flex items-center justify-center font-mono font-bold hover:bg-black hover:text-white transition-colors">3</button>
            <span className="font-mono text-gray-400">...</span>
            <button className="w-11 h-11 bg-white border-2 border-black flex items-center justify-center font-mono font-bold hover:bg-black hover:text-white transition-colors">8</button>
            <button className="w-11 h-11 bg-white border-2 border-black flex items-center justify-center font-mono font-bold hover:bg-black hover:text-white transition-colors"><span className="material-icons">chevron_right</span></button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
