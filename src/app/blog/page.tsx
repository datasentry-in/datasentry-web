import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Blog() {
  const articles = [
    {
      letter: 'V',
      cat: 'Engineering',
      date: 'Oct 24',
      title: 'Vulnerability Management in 2024',
      desc: 'Why traditional scanning isn\'t enough anymore. Moving towards continuous monitoring and automated remediation.',
      bg: 'bg-secondary',
      textColor: 'text-white/20',
    },
    {
      letter: 'D',
      cat: 'Cloud Security',
      date: 'Oct 22',
      title: 'Designing Secure APIs',
      desc: 'Best practices for authentication, rate limiting, and input validation in modern REST and GraphQL APIs.',
      bg: 'bg-background-dark',
      textColor: 'text-[#1F1F1F]',
    },
    {
      letter: 'I',
      cat: 'Tutorials',
      date: 'Sep 18',
      title: 'Infrastructure as Code Security',
      desc: 'Scanning Terraform and CloudFormation templates for misconfigurations before deployment.',
      bg: 'bg-primary',
      textColor: 'text-yellow-300/30',
    },
    {
      letter: 'G',
      cat: 'Data Privacy',
      date: 'Nov 16',
      title: 'GDPR for Devs',
      desc: 'Practical implementation of Right to Erasure and Data Portability in your application architecture.',
      bg: 'bg-green-600',
      textColor: 'text-green-300/20',
    },
    {
      letter: 'T',
      cat: 'Engineering',
      date: 'Sep 12',
      title: 'Threat Modeling 101',
      desc: 'How to conduct effective threat modeling sessions using STRIDE without boring your team.',
      bg: 'bg-primary',
      textColor: 'text-yellow-300/30',
    },
    {
      letter: 'C',
      cat: 'Cloud Security',
      date: 'Aug 28',
      title: 'Container Hardening Guide',
      desc: 'Essential security practices for Docker and Kubernetes environments in production.',
      bg: 'bg-secondary',
      textColor: 'text-white/20',
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <header className="w-full bg-background-dark text-white py-16 md:py-24 border-b-[3px] border-black">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-4xl">
              <div className="inline-block bg-secondary text-white px-3 py-1 font-mono text-xs uppercase mb-6 border border-white/30">
                Cybersecurity Intelligence
              </div>
              <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-8 font-display">
                Security intelligence for teams that <span className="text-primary italic">build.</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-mono leading-relaxed mb-10 border-l-4 border-primary pl-6">
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
        <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
          {/* Featured Article */}
          <div className="mb-16 relative">
            <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#FFED00] p-0 flex flex-col md:flex-row overflow-hidden group hover:shadow-brutal-black transition-all duration-300">
              <div className="md:w-1/2 bg-background-dark relative min-h-[320px] md:min-h-auto overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <h1 className="text-[180px] font-black text-[#1a1a1a] leading-none select-none absolute -right-10 -bottom-10 rotate-[-10deg] group-hover:text-[#2a2a2a] transition-colors duration-500 font-display">ISO</h1>
                <div className="relative z-10 p-8">
                  <span className="material-icons text-6xl text-primary mb-4 block">verified_user</span>
                  <p className="text-white font-mono text-sm uppercase tracking-widest border-b border-primary inline-block pb-1">Startups Guide</p>
                </div>
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center border-t-[3px] md:border-t-0 md:border-l-[3px] border-black bg-white relative">
                <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-2 font-mono text-xs font-bold uppercase border-l-[3px] border-b-[3px] border-black">Featured</div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 font-mono text-xs font-bold uppercase border border-secondary">GRC & Compliance</span>
                  <span className="text-gray-500 text-xs font-mono uppercase">8 MIN READ</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold leading-[1.1] mb-4 group-hover:text-secondary transition-colors font-display">
                  The Complete Guide to ISO 27001 Certification for Startups
                </h3>
                <p className="text-gray-600 font-mono text-sm md:text-base mb-8 leading-relaxed border-l-2 border-gray-200 pl-4">
                  A step-by-step breakdown of how to prepare your engineering team for your first ISO audit without slowing down velocity. We cover gap analysis, policy creation, and evidence collection.
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <button className="flex items-center gap-2 bg-primary border-2 border-black px-6 py-3 font-bold text-sm uppercase shadow-brutal-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    Read Article <span className="material-icons text-lg">arrow_outward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t-[3px] border-l-[3px] border-black">
            {articles.map((a, i) => (
              <article key={i} className={`group border-r-[3px] border-b-[3px] border-black ${i % 2 === 0 ? 'bg-white' : 'bg-background-light'} hover:bg-primary/5 transition-colors relative flex flex-col h-full`}>
                <div className={`h-48 ${a.bg} flex items-center justify-center relative overflow-hidden border-b-[3px] border-black`}>
                  <span className={`text-9xl font-black ${a.textColor} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500 font-display`}>{a.letter}</span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono text-xs font-bold uppercase text-secondary">{a.cat}</span>
                    <span className="font-mono text-xs text-gray-400">{a.date}</span>
                  </div>
                  <h4 className="text-xl font-bold leading-tight mb-3 group-hover:underline decoration-2 underline-offset-2 font-display">{a.title}</h4>
                  <p className="text-sm font-mono text-gray-600 mb-6 flex-grow line-clamp-3">{a.desc}</p>
                  <Link className="inline-flex items-center gap-2 font-bold text-sm uppercase hover:text-secondary mt-auto" href="#">
                    Read <span className="material-icons text-base">arrow_forward</span>
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
