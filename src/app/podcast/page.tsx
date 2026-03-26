'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

export default function Podcast() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const webinarRef = useRef<HTMLVideoElement>(null);

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

  const getVideoId = (url: string) => url.split('v=')[1];

  const handlePlayVideo = (videoId: string) => {
    // Pause webinar video when a YouTube video is activated
    if (webinarRef.current) {
      webinarRef.current.pause();
    }
    setActiveVideo(videoId);
  };

  const handleWebinarPlay = () => {
    // Deactivate any YouTube iframe when webinar starts
    setActiveVideo(null);
  };

  return (
    <>
      <Navbar />
      <Breadcrumb items={[{ label: 'Podcast' }]} />
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
            <div className="block group">
              <div className="border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] transition-all duration-300">
                {/* Video area — click to load */}
                <div
                  className="relative w-full aspect-video bg-black cursor-pointer"
                  onClick={() => handlePlayVideo(getVideoId(featured.url))}
                >
                  {activeVideo === getVideoId(featured.url) ? (
                    <iframe
                      className="w-full h-full border-0 absolute inset-0"
                      src={`https://www.youtube.com/embed/${getVideoId(featured.url)}?autoplay=1&modestbranding=1&rel=0`}
                      title={featured.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <>
                      <img
                        src={`https://img.youtube.com/vi/${getVideoId(featured.url)}/maxresdefault.jpg`}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-20 h-20 bg-red-600 border-2 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                          <span className="material-icons text-white text-4xl">play_arrow</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {/* Content below */}
                <div className="bg-background-dark p-5 sm:p-8 md:p-10 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-primary text-black font-mono font-bold text-xs uppercase px-3 py-1.5 border border-black shadow-[2px_2px_0px_0px_#000]">EP. {featured.ep}</span>
                    <span className="bg-red-600 text-white font-mono font-bold text-xs uppercase px-3 py-1.5 border border-red-700 shadow-[2px_2px_0px_0px_#000]">Latest</span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-sm text-secondary font-bold">With {featured.guest}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-gray-500 font-mono text-sm">{featured.duration}</span>
                  </div>
                  <h3 className="font-display text-2xl md:text-4xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
                    {featured.title}
                  </h3>
                  <p className="font-mono text-gray-400 text-sm leading-relaxed max-w-3xl">
                    {featured.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WEBINAR VIDEO SECTION */}
        <section className="bg-background-light py-16 md:py-24 border-b-4 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
              <div className="w-full lg:w-1/2 order-2 lg:order-1">
                <div className="bg-white border-[3px] border-black p-2 shadow-[8px_8px_0px_0px_#00A3E0] hover:shadow-[4px_4px_0px_0px_#00A3E0] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300">
                  <div className="relative w-full aspect-video bg-black border-2 border-black overflow-hidden">
                    <video 
                      ref={webinarRef}
                      src="/videos/webinar.mp4" 
                      controls 
                      controlsList="nodownload"
                      preload="metadata"
                      className="w-full h-full object-cover"
                      onPlay={handleWebinarPlay}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 order-1 lg:order-2">
                <div className="inline-block bg-primary text-black font-mono px-3 py-1 mb-6 text-sm font-bold uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative z-10 -rotate-2">
                  PBSA APAC Council • March 12, 2026
                </div>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight leading-none mb-6">
                  DPDPA Act: <br/><span className="text-secondary italic">Implementation Insights</span>
                </h2>
                <div className="text-gray-700 font-mono text-sm md:text-base leading-relaxed mb-8 border-l-4 border-secondary pl-4 space-y-4">
                  <p>In this featured session from the PBSA APAC Council, Dharita Gada unpacks the DPDPA Act for global background screening—making compliance actionable rather than theoretical.</p>
                  <div>
                    <p className="font-mono text-xs text-gray-400 uppercase font-bold tracking-widest mb-3 border-b border-gray-200 pb-2">Key Topics Unpacked:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                      <li className="flex items-center gap-2"><span className="text-primary material-icons text-sm">check_circle</span> Scope & Applicability</li>
                      <li className="flex items-center gap-2"><span className="text-primary material-icons text-sm">check_circle</span> Consent & Withdrawal</li>
                      <li className="flex items-center gap-2"><span className="text-primary material-icons text-sm">check_circle</span> Data Minimization</li>
                      <li className="flex items-center gap-2"><span className="text-primary material-icons text-sm">check_circle</span> Vendor & AI Risks</li>
                      <li className="flex items-center gap-2"><span className="text-primary material-icons text-sm">check_circle</span> 90-Day Roadmap</li>
                      <li className="flex items-center gap-2"><span className="text-primary material-icons text-sm">check_circle</span> Penalties & Enforcement</li>
                    </ul>
                  </div>
                </div>
                <a href="#all-episodes" className="inline-flex items-center justify-center gap-2 bg-black text-white font-mono font-bold text-xs uppercase px-8 py-4 border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                  See More Episodes
                  <span className="material-icons text-base">arrow_downward</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ ALL EPISODES ═══════════ */}
        <section id="all-episodes" className="bg-background-dark py-20 md:py-24 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-3 h-3 bg-primary"></div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide">All Episodes</h2>
              <div className="flex-1 h-px bg-white/10 ml-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {restEpisodes.map((ep, i) => {
                const videoId = getVideoId(ep.url);
                return (
                  <div key={i} className="block group">
                    <article className="bg-surface-dark border border-white/10 hover:border-primary/50 transition-all duration-300 overflow-hidden h-full flex flex-col">
                      {/* Video — click to load */}
                      <div
                        className="h-52 relative overflow-hidden bg-black cursor-pointer"
                        onClick={() => handlePlayVideo(videoId)}
                      >
                        {activeVideo === videoId ? (
                          <iframe
                            className="w-full h-full border-0 absolute inset-0"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                            title={ep.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <>
                            <img
                              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                              alt={ep.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/20 transition-colors">
                              <div className="w-14 h-14 bg-red-600 border-2 border-white flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                                <span className="material-icons text-white text-2xl">play_arrow</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-6 flex flex-col grow">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-[10px] font-bold uppercase text-secondary tracking-wider">With {ep.guest}</span>
                          <div className="flex gap-2 items-center">
                            {ep.status && (
                              <span className="bg-secondary text-white font-mono font-bold text-[10px] px-2 py-0.5 uppercase">{ep.status}</span>
                            )}
                            <span className="bg-white/10 text-primary font-mono font-bold text-[10px] px-2 py-0.5 border border-white/10">EP. {ep.ep}</span>
                          </div>
                        </div>
                        <h4 className="font-display text-lg font-bold leading-snug mt-1 mb-3 group-hover:text-primary transition-colors">{ep.title}</h4>
                        <p className="font-mono text-xs text-gray-500 line-clamp-2 mb-5 grow">{ep.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-gray-600">{ep.duration}</span>
                        </div>
                      </div>
                    </article>
                  </div>
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
