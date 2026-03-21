import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Podcast() {
  const episodes = [
    {
      ep: '04',
      title: 'AI, Compliance & ISO: Quantiphi on Responsible Innovation',
      guest: 'Quantiphi',
      desc: 'We sit down with the team at Quantiphi to discuss responsible AI innovation, ISO compliance, and how organizations can stay ahead of the governance curve while building cutting-edge AI systems.',
      duration: '31:01',
      views: '114',
      url: 'https://www.youtube.com/watch?v=qp1Mpn0Yx7Q',
      thumbnail: '/podcast-ep04.jpg',
      status: 'LATEST',
    },
    {
      ep: '03',
      title: 'ISO 27001 & AI: Inference Labs on Securing Innovation',
      guest: 'Inference Labs',
      desc: 'In this episode, Inference Labs shares how they approached ISO 27001 certification while building AI products — balancing security rigor with rapid innovation cycles.',
      duration: '12:01',
      views: '29',
      url: 'https://www.youtube.com/watch?v=qqtR5uhCs4Y',
      thumbnail: '/podcast-ep03.jpg',
      status: '',
    },
    {
      ep: '02',
      title: 'DPDP Compliance & ISO 27001:2022: SecureSearch Explains PII Protection',
      guest: 'SecureSearch',
      desc: 'SecureSearch breaks down how they tackled PII protection under the DPDP Act and aligned it with their ISO 27001:2022 certification journey. Real frameworks, real results.',
      duration: '23:08',
      views: '245',
      url: 'https://www.youtube.com/watch?v=OQ-zUwuVBl4',
      thumbnail: '/podcast-ep02.jpg',
      status: '',
    },
    {
      ep: '01',
      title: "ISO 27001 & 27701 Certification: Nexsales' Roadmap to Security & Privacy Excellence",
      guest: 'Nexsales',
      desc: 'The very first DS Podcast episode. Nexsales shares their complete roadmap from zero to ISO 27001 and 27701 certification — the challenges, the wins, and lessons learned along the way.',
      duration: '12:46',
      views: '331',
      url: 'https://www.youtube.com/watch?v=uNJ3IGD4Ak0',
      thumbnail: '/podcast-ep01.jpg',
      status: 'PILOT',
    },
  ];

  const featured = episodes[0];
  const restEpisodes = episodes.slice(1);

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
                  <span className="font-mono text-xs uppercase tracking-widest text-gray-300">The DS Podcast</span>
                </div>
                <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight uppercase mb-6 sm:mb-8">
                  Compliance<br />
                  <span className="text-primary italic">Conversations.</span>
                </h1>
                <p className="font-mono text-gray-400 text-base md:text-lg leading-relaxed max-w-lg mb-10">
                  Real conversations with organizations navigating ISO standards, privacy regulations, and information security governance. Hosted by DataSentry.
                </p>
                <a
                  href="https://www.youtube.com/@DataSentryIndia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 sm:gap-3 bg-red-600 text-white font-mono font-bold text-xs sm:text-sm uppercase px-6 py-3 sm:px-8 sm:py-4 border-2 border-red-700 hover:bg-red-700 transition-all duration-300 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  <span className="material-icons text-xl">smart_display</span>
                  Watch on YouTube
                </a>
              </div>

              {/* Right — Channel Stats */}
              <div className="hidden lg:block relative">
                <div className="relative w-full h-80">
                  {/* Concentric rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border border-white/5 rounded-full"></div>
                    <div className="absolute w-48 h-48 border border-white/10 rounded-full"></div>
                    <div className="absolute w-32 h-32 border border-white/15 rounded-full"></div>
                    <div className="absolute w-20 h-20 bg-red-600/20 border-2 border-red-500/40 rounded-full flex items-center justify-center">
                      <span className="material-icons text-red-400 text-3xl">play_arrow</span>
                    </div>
                  </div>
                  {/* Floating badges */}
                  <div className="absolute top-4 right-8 bg-surface-dark border border-white/10 px-4 py-3 backdrop-blur-md">
                    <p className="font-mono text-[10px] text-gray-500 uppercase mb-1">Episodes</p>
                    <p className="font-display text-2xl font-bold text-primary">04</p>
                  </div>
                  <div className="absolute bottom-8 left-4 bg-surface-dark border border-white/10 px-4 py-3 backdrop-blur-md">
                    <p className="font-mono text-[10px] text-gray-500 uppercase mb-1">Platform</p>
                    <p className="font-display text-xl font-bold text-red-400">YouTube</p>
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

        {/* ═══════════ LATEST EPISODE ═══════════ */}
        <section className="bg-white py-12 md:py-28 border-b-2 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
              <div>
                <div className="inline-block bg-primary text-black px-3 py-1 font-mono text-xs font-bold uppercase mb-4 border border-black">Latest Episode</div>
                <h2 className="font-display text-3xl md:text-6xl font-bold uppercase tracking-tight leading-none">
                  Latest<br />Episode
                </h2>
              </div>
              <a
                href="https://www.youtube.com/@DataSentryIndia"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 md:mt-0 flex items-center gap-2 font-mono text-sm font-bold uppercase text-secondary hover:text-black transition-colors"
              >
                View Channel <span className="material-icons text-base">arrow_forward</span>
              </a>
            </div>

            {/* Featured Card */}
            <a href={featured.url} target="_blank" rel="noopener noreferrer" className="block group">
              <div className="border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-300">
                {/* Thumbnail area — full width */}
                <div className="relative w-full aspect-video bg-black">
                  <img src={featured.thumbnail} alt={featured.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  {/* Play button centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-red-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300 shadow-lg">
                      <span className="material-icons text-white text-3xl sm:text-4xl">play_arrow</span>
                    </div>
                  </div>
                  {/* Badges on thumbnail */}
                  <div className="absolute top-5 left-5 flex items-center gap-3">
                    <span className="bg-primary text-black font-mono font-bold text-xs uppercase px-3 py-1.5 border border-black shadow-sm">EP. {featured.ep}</span>
                    <span className="bg-red-600 text-white font-mono font-bold text-xs uppercase px-3 py-1.5 border border-red-700 shadow-sm">Latest</span>
                  </div>
                  <div className="absolute bottom-5 right-5">
                    <span className="bg-black/70 backdrop-blur-sm text-white font-mono font-bold text-sm px-3 py-1.5 border border-white/10">{featured.duration}</span>
                  </div>
                </div>
                {/* Content below */}
                <div className="bg-background-dark p-5 sm:p-8 md:p-10 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-sm text-secondary font-bold">With {featured.guest}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-gray-500 font-mono text-xs">{featured.views} views</span>
                  </div>
                  <h3 className="font-display text-2xl md:text-4xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
                    {featured.title}
                  </h3>
                  <p className="font-mono text-gray-400 text-sm leading-relaxed max-w-3xl mb-8">
                    {featured.desc}
                  </p>
                  <span className="inline-flex items-center gap-2 sm:gap-3 bg-red-600 text-white font-mono font-bold text-xs sm:text-sm uppercase px-5 py-3 sm:px-8 sm:py-4 border-2 border-red-700 group-hover:bg-red-700 transition-colors shadow-[3px_3px_0px_0px_#000] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
                    <span className="material-icons">smart_display</span> Watch on YouTube
                  </span>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* ═══════════ ALL EPISODES ═══════════ */}
        <section className="bg-background-dark py-20 md:py-24 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-3 h-3 bg-primary"></div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide">All Episodes</h2>
              <div className="flex-1 h-px bg-white/10 ml-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {restEpisodes.map((ep, i) => {
                return (
                  <a key={i} href={ep.url} target="_blank" rel="noopener noreferrer" className="block group">
                    <article className="bg-surface-dark border border-white/10 hover:border-primary/50 transition-all duration-300 overflow-hidden h-full flex flex-col">
                      {/* Thumbnail */}
                      <div className="h-52 relative overflow-hidden bg-black">
                        <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-contain" />
                        <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-primary font-mono font-bold text-[11px] px-3 py-1 uppercase border border-white/10">EP. {ep.ep}</span>
                        {ep.status && (
                          <span className="absolute top-4 right-4 bg-secondary text-white font-mono font-bold text-[10px] px-2 py-0.5 uppercase">{ep.status}</span>
                        )}
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300">
                          <div className="w-16 h-16 bg-red-600/0 group-hover:bg-red-600 rounded-full flex items-center justify-center scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 border-2 border-transparent group-hover:border-white/20">
                            <span className="material-icons text-white text-3xl">play_arrow</span>
                          </div>
                        </div>
                      </div>
                      {/* Info */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] font-bold uppercase text-secondary tracking-wider">With {ep.guest}</span>
                          <span className="font-mono text-[10px] text-gray-600">{ep.views} views</span>
                        </div>
                        <h4 className="font-display text-lg font-bold leading-snug mt-1 mb-3 group-hover:text-primary transition-colors">{ep.title}</h4>
                        <p className="font-mono text-xs text-gray-500 line-clamp-2 mb-5 flex-grow">{ep.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-gray-600">{ep.duration}</span>
                          <span className="flex items-center gap-1.5 font-mono font-bold text-xs uppercase text-red-400 group-hover:text-red-300 transition-colors">
                            <span className="material-icons text-sm">smart_display</span> Watch
                          </span>
                        </div>
                      </div>
                    </article>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ SUBSCRIBE CTA ═══════════ */}
        <section className="relative bg-background-dark text-white py-20 md:py-28 border-t border-white/5 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 bg-white/5 backdrop-blur-sm mb-8">
                <span className="material-icons text-red-400 text-lg">notifications_active</span>
                <span className="font-mono text-xs uppercase tracking-widest text-gray-300">Stay Updated</span>
              </div>
              <h3 className="font-display text-3xl md:text-6xl font-bold uppercase mb-6 leading-tight">
                Subscribe on<br /><span className="text-red-400">YouTube</span>
              </h3>
              <p className="font-mono text-gray-400 text-sm mb-12 max-w-md mx-auto">
                Subscribe to the DS Podcast on YouTube and get notified when new episodes drop. Real conversations with real organizations.
              </p>
              <a
                href="https://www.youtube.com/@DataSentryIndia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sm:gap-3 bg-red-600 text-white font-mono font-bold text-xs sm:text-sm uppercase px-6 py-4 sm:px-10 sm:py-5 border-2 border-red-700 hover:bg-red-700 transition-all duration-300 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <span className="material-icons text-xl">smart_display</span>
                Subscribe on YouTube
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
