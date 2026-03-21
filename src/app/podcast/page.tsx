import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Podcast() {
  const episodes = [
    {
      ep: '12',
      cat: 'ISO Standards',
      title: 'The Future of AI Governance & Security Protocols',
      desc: 'We dive deep into the new regulations shaping artificial intelligence security protocols. What does the new ISO 42001 mean for your organization?',
      duration: '48:30',
      status: 'NEW',
    },
    {
      ep: '11',
      cat: 'Threat Analysis',
      title: 'Zero Trust Architecture Explained',
      desc: 'Moving beyond the perimeter. Why trusting no one is the only safe policy in 2024.',
      duration: '42:15',
      status: '',
    },
    {
      ep: '10',
      cat: 'Industry News',
      title: 'The Great Firewall Updates',
      desc: 'Breaking down the latest changes in international data privacy laws and firewall restrictions.',
      duration: '38:20',
      status: '',
    },
    {
      ep: '09',
      cat: 'Guest Interview',
      title: 'Ethical Hacking 101',
      desc: 'Interview with a certified white hat hacker on discovering vulnerabilities before the bad guys do.',
      duration: '55:45',
      status: '',
    },
    {
      ep: '08',
      cat: 'Compliance',
      title: 'GDPR Two Years Later — What Changed?',
      desc: 'A retrospective on GDPR enforcement actions and how organizations have adapted their privacy programs.',
      duration: '44:10',
      status: '',
    },
    {
      ep: '07',
      cat: 'Risk Management',
      title: 'Vendor Risk in a Remote-First World',
      desc: 'Managing third-party risk when your vendor ecosystem is distributed across time zones and jurisdictions.',
      duration: '41:30',
      status: '',
    },
    {
      ep: '06',
      cat: 'AI Governance',
      title: 'Building an AI Governance Framework',
      desc: 'Understanding ISO 42001 and what AI governance readiness looks like for organizations adopting machine learning.',
      duration: '48:30',
      status: '',
    },
    {
      ep: '05',
      cat: 'Data Privacy',
      title: 'Privacy by Design — From Theory to Practice',
      desc: 'How to embed privacy considerations into product development from day one.',
      duration: '42:15',
      status: '',
    },
    {
      ep: '04',
      cat: 'ISO Standards',
      title: 'The ISO 27001 Journey: Real Stories',
      desc: 'A candid conversation about what ISO certification actually looks like from the inside.',
      duration: '55:20',
      status: '',
    },
    {
      ep: '03',
      cat: 'Vendor Governance',
      title: 'Vendor Risk Management in 2024',
      desc: 'Managing third-party risk when your vendor ecosystem is growing faster than your security team.',
      duration: '38:45',
      status: '',
    },
    {
      ep: '02',
      cat: 'Compliance',
      title: 'Regulatory Compliance for Startups',
      desc: 'Breaking down regulatory obligations for growing tech companies.',
      duration: '44:10',
      status: '',
    },
    {
      ep: '01',
      cat: 'Founder Story',
      title: 'From Courtroom to Cybersecurity',
      desc: 'The journey from law practice to information security advisory.',
      duration: '51:30',
      status: 'PILOT',
    },
  ];

  const featured = episodes[0];
  const recentEpisodes = episodes.slice(1, 4);
  const allEpisodes = episodes.slice(4);

  return (
    <>
      <Navbar />
      <main>
        {/* ═══════════ HERO ═══════════ */}
        <header className="relative bg-background-dark text-white overflow-hidden border-b-4 border-primary">
          {/* Ambient glow */}
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left copy */}
              <div>
                <div className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 bg-white/5 backdrop-blur-sm mb-8">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="font-mono text-xs uppercase tracking-widest text-gray-300">Now Streaming</span>
                </div>
                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight uppercase mb-8">
                  Compliance<br />
                  <span className="text-primary italic">Unfiltered.</span>
                </h1>
                <p className="font-mono text-gray-400 text-base md:text-lg leading-relaxed max-w-lg mb-10">
                  Real talk about ISO standards, AI governance, and the future of digital defense. No fluff. Just data. Hosted by the team at DataSentry.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: 'smart_display', label: 'YouTube', color: 'hover:bg-red-600' },
                    { icon: 'graphic_eq', label: 'Spotify', color: 'hover:bg-green-600' },
                    { icon: 'podcasts', label: 'Apple', color: 'hover:bg-purple-600' },
                  ].map((p, i) => (
                    <a key={i} href="#" className={`group/btn flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-mono font-bold text-sm px-6 py-3 ${p.color} hover:border-transparent transition-all duration-300`}>
                      <span className="material-icons text-lg">{p.icon}</span>
                      {p.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Right — Waveform Viz */}
              <div className="hidden lg:block relative">
                <div className="relative w-full h-80">
                  {/* Sound wave ring */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border border-white/5 rounded-full"></div>
                    <div className="absolute w-48 h-48 border border-white/10 rounded-full"></div>
                    <div className="absolute w-32 h-32 border border-white/15 rounded-full"></div>
                    <div className="absolute w-20 h-20 bg-primary/10 border-2 border-primary/30 rounded-full flex items-center justify-center">
                      <span className="material-icons text-primary text-3xl">headphones</span>
                    </div>
                  </div>
                  {/* Floating badges */}
                  <div className="absolute top-4 right-8 bg-surface-dark border border-white/10 px-4 py-3 backdrop-blur-md">
                    <p className="font-mono text-[10px] text-gray-500 uppercase mb-1">Episodes</p>
                    <p className="font-display text-2xl font-bold text-primary">12</p>
                  </div>
                  <div className="absolute bottom-8 left-4 bg-surface-dark border border-white/10 px-4 py-3 backdrop-blur-md">
                    <p className="font-mono text-[10px] text-gray-500 uppercase mb-1">Total Hours</p>
                    <p className="font-display text-2xl font-bold text-secondary">9.2</p>
                  </div>
                  <div className="absolute top-1/2 right-0 bg-surface-dark border border-white/10 px-4 py-3 backdrop-blur-md">
                    <p className="font-mono text-[10px] text-gray-500 uppercase mb-1">Season</p>
                    <p className="font-display text-2xl font-bold text-white">01</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ═══════════ LATEST TRANSMISSION ═══════════ */}
        <section className="bg-white py-20 md:py-28 border-b-2 border-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
              <div>
                <div className="inline-block bg-primary text-black px-3 py-1 font-mono text-xs font-bold uppercase mb-4 border border-black">Latest Episode</div>
                <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tight leading-none">
                  Latest<br />Transmission
                </h2>
              </div>
              <a href="#all-episodes" className="mt-4 md:mt-0 flex items-center gap-2 font-mono text-sm font-bold uppercase text-secondary hover:text-black transition-colors">
                View All Episodes <span className="material-icons text-base">arrow_forward</span>
              </a>
            </div>

            {/* Featured Card */}
            <div className="group bg-background-dark border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left content */}
                <div className="lg:col-span-7 p-10 md:p-14 text-white relative">
                  <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-secondary/5 to-transparent pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <span className="bg-primary text-black font-mono font-bold text-xs uppercase px-3 py-1.5 border border-black">EP. {featured.ep}</span>
                      <span className="bg-secondary/10 text-secondary font-mono font-bold text-xs uppercase px-3 py-1.5 border border-secondary/30">{featured.cat}</span>
                      <span className="bg-red-500/10 text-red-400 font-mono font-bold text-[10px] uppercase px-2 py-1 border border-red-500/30 animate-pulse">● Live</span>
                    </div>
                    <h3 className="font-display text-3xl md:text-5xl font-bold leading-[1.05] mb-6 group-hover:text-primary transition-colors duration-300">
                      {featured.title}
                    </h3>
                    <p className="font-mono text-gray-400 text-sm md:text-base leading-relaxed max-w-lg mb-10">
                      {featured.desc}
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-3 bg-primary text-black font-mono font-bold text-sm uppercase px-8 py-4 border-2 border-black hover:bg-white transition-colors shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                        <span className="material-icons">play_arrow</span> Listen Now
                      </button>
                      <span className="font-mono text-gray-500 text-sm">{featured.duration}</span>
                    </div>
                  </div>
                </div>
                {/* Right visual */}
                <div className="lg:col-span-5 bg-gradient-to-br from-secondary/80 to-secondary border-t-2 lg:border-t-0 lg:border-l-2 border-black relative min-h-[300px] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                  <div className="text-[220px] font-display font-black text-white/10 absolute -bottom-12 -right-8 leading-none select-none">{featured.ep}</div>
                  <div className="relative z-10 text-center">
                    <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500 cursor-pointer">
                      <span className="material-icons text-white text-5xl drop-shadow-lg">play_arrow</span>
                    </div>
                    <p className="font-display font-bold text-xl text-white uppercase tracking-wider">Episode {featured.ep}</p>
                    <p className="font-mono text-xs text-white/50 uppercase mt-1">{featured.duration} · {featured.cat}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ RECENT EPISODES ═══════════ */}
        <section className="bg-background-dark py-20 md:py-24 border-b-4 border-primary text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-3 h-3 bg-primary"></div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide">Recent Episodes</h2>
              <div className="flex-1 h-px bg-white/10 ml-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentEpisodes.map((ep, i) => {
                const colors = ['bg-secondary', 'bg-background-dark border border-white/10', 'bg-primary'];
                const textColors = ['text-white/20', 'text-white/10', 'text-black/10'];
                const numColors = ['text-white', 'text-primary', 'text-black'];
                return (
                  <article key={i} className="group bg-surface-dark border border-white/10 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                    {/* Visual tile */}
                    <div className={`h-52 ${colors[i]} relative overflow-hidden flex items-center justify-center`}>
                      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%)', backgroundSize: '40px 40px' }}></div>
                      <span className={`text-8xl font-display font-black ${textColors[i]} select-none`}>{ep.ep}</span>
                      <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-primary font-mono font-bold text-[11px] px-3 py-1 uppercase">EP. {ep.ep}</span>
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300">
                        <div className="w-14 h-14 bg-white/0 group-hover:bg-white rounded-full flex items-center justify-center scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="material-icons text-black text-3xl">play_arrow</span>
                        </div>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-6">
                      <span className="font-mono text-[10px] font-bold uppercase text-secondary tracking-wider">{ep.cat}</span>
                      <h4 className="font-display text-lg font-bold leading-snug mt-2 mb-3 group-hover:text-primary transition-colors">{ep.title}</h4>
                      <p className="font-mono text-xs text-gray-500 line-clamp-2 mb-5">{ep.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-gray-600">{ep.duration}</span>
                        <a href="#" className="flex items-center gap-1.5 font-mono font-bold text-xs uppercase text-primary hover:text-white transition-colors">
                          Listen <span className="material-icons text-sm">arrow_forward</span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ ALL EPISODES ═══════════ */}
        <section id="all-episodes" className="bg-background-light py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-3 h-3 bg-secondary"></div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide">All Episodes</h2>
              <div className="flex-1 h-px bg-black/10 ml-4"></div>
            </div>

            <div className="space-y-4">
              {allEpisodes.map((ep, i) => (
                <div key={i} className="group bg-white border-2 border-black/10 hover:border-black hover:shadow-[4px_4px_0px_0px_#FFED00] p-0 flex flex-col md:flex-row overflow-hidden transition-all duration-300">
                  {/* Episode Number */}
                  <div className="md:w-24 bg-background-dark text-white flex items-center justify-center p-4 md:p-0 border-b-2 md:border-b-0 md:border-r-2 border-black/10 group-hover:border-black relative transition-colors">
                    <span className="text-3xl font-display font-bold text-primary">{ep.ep}</span>
                    {ep.status && (
                      <span className="absolute top-1.5 right-1.5 bg-secondary text-white font-mono text-[9px] font-bold px-1.5 py-0.5 uppercase">{ep.status}</span>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 px-6 py-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[10px] font-bold uppercase text-secondary tracking-wider">{ep.cat}</span>
                      <h3 className="text-base font-display font-bold group-hover:text-secondary transition-colors mt-0.5 truncate">{ep.title}</h3>
                      <p className="font-mono text-xs text-gray-500 mt-1 truncate">{ep.desc}</p>
                    </div>
                    <div className="flex items-center gap-5 md:flex-shrink-0">
                      <span className="font-mono text-sm text-gray-400">{ep.duration}</span>
                      <button className="w-10 h-10 bg-primary border-2 border-black flex items-center justify-center hover:bg-black hover:text-primary transition-all duration-200 shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]">
                        <span className="material-icons text-lg">play_arrow</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SUBSCRIBE CTA ═══════════ */}
        <section className="relative bg-background-dark text-white py-20 md:py-28 border-t-4 border-primary overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 bg-white/5 backdrop-blur-sm mb-8">
                <span className="material-icons text-primary text-lg">notifications_active</span>
                <span className="font-mono text-xs uppercase tracking-widest text-gray-300">Stay Updated</span>
              </div>
              <h3 className="font-display text-4xl md:text-6xl font-bold uppercase mb-6 leading-tight">
                Never Miss a<br /><span className="text-primary">Transmission</span>
              </h3>
              <p className="font-mono text-gray-400 text-sm mb-12 max-w-md mx-auto">
                Subscribe to Compliance Unfiltered and get notified when new episodes drop. Available on all major podcast platforms.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                {[
                  { icon: 'smart_display', label: 'YouTube', color: 'hover:bg-red-600 hover:border-red-600' },
                  { icon: 'graphic_eq', label: 'Spotify', color: 'hover:bg-green-600 hover:border-green-600' },
                  { icon: 'podcasts', label: 'Apple', color: 'hover:bg-purple-600 hover:border-purple-600' },
                  { icon: 'rss_feed', label: 'RSS', color: 'hover:bg-orange-500 hover:border-orange-500' },
                ].map((platform, i) => (
                  <a key={i} href="#" className={`flex items-center gap-2 bg-white/5 border border-white/15 text-white font-mono font-bold text-sm px-6 py-3.5 ${platform.color} hover:text-white transition-all duration-300`}>
                    <span className="material-icons text-lg">{platform.icon}</span>
                    {platform.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
