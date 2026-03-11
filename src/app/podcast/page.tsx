import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Podcast() {
  const episodes = [
    { ep: '06', title: 'Building an AI Governance Framework', guest: 'With Dr. Amit Sharma', desc: 'Understanding ISO 42001 and what AI governance readiness looks like for organizations adopting machine learning and automation.', duration: '48:30', status: 'NEW' },
    { ep: '05', title: 'Privacy by Design — From Theory to Practice', guest: 'With Priya Murthy, Privacy Counsel', desc: 'How to embed privacy considerations into product development from day one, not as an afterthought.', duration: '42:15', status: '' },
    { ep: '04', title: 'The ISO 27001 Journey: Real Stories', guest: 'With Rohan Desai, CISO', desc: 'A candid conversation about what ISO certification actually looks like from the inside — the wins, the challenges, and the surprises.', duration: '55:20', status: '' },
    { ep: '03', title: 'Vendor Risk Management in 2024', guest: 'With Sarah Chen, VP Engineering', desc: 'Managing third-party risk when your vendor ecosystem is growing faster than your security team can assess.', duration: '38:45', status: '' },
    { ep: '02', title: 'Regulatory Compliance for Startups', guest: 'With Kavita Patel, Legal Advisor', desc: 'Breaking down regulatory obligations for growing tech companies — when to invest in compliance and where to start.', duration: '44:10', status: '' },
    { ep: '01', title: 'From Courtroom to Cybersecurity', guest: 'With Dharita Gada, Founder', desc: 'The journey from law practice to information security advisory — how legal thinking shapes compliance strategy.', duration: '51:30', status: 'PILOT' },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <header className="w-full bg-background-dark text-white py-16 md:py-24 border-b-[3px] border-black">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-4xl">
              <div className="inline-block bg-primary text-black px-3 py-1 font-mono text-xs uppercase mb-6 border border-black font-bold">
                Podcast Series
              </div>
              <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-8 font-display">
                Compliance <span className="text-primary italic">Conversations.</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-mono leading-relaxed mb-10 border-l-4 border-primary pl-6">
                Through conversations with security leaders, compliance professionals, and operational teams, we explore ISO implementation journeys, practical compliance challenges, and emerging regulatory expectations.
              </p>
              <div className="flex gap-4">
                <button className="bg-primary text-black font-bold px-8 py-4 font-mono uppercase tracking-wider hover:bg-white transition-colors border-2 border-black shadow-brutal-blue">
                  <span className="flex items-center gap-2"><span className="material-icons">play_circle</span> Listen Now</span>
                </button>
                <button className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 font-mono uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Episodes */}
        <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4 font-display">All Episodes</h2>
            <div className="w-20 h-2 bg-primary"></div>
          </div>

          <div className="space-y-0">
            {episodes.map((ep, i) => (
              <div key={i} className="group border-[3px] border-black -mt-[3px] first:mt-0 p-0 flex flex-col md:flex-row overflow-hidden hover:bg-primary/5 transition-colors bg-white">
                {/* Episode Number */}
                <div className="md:w-32 bg-background-dark text-white flex items-center justify-center p-6 md:p-0 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black relative">
                  <span className="text-5xl font-display font-bold text-primary">{ep.ep}</span>
                  {ep.status && (
                    <span className="absolute top-2 right-2 bg-secondary text-white font-mono text-[10px] font-bold px-2 py-0.5 uppercase">{ep.status}</span>
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold mb-1 group-hover:text-secondary transition-colors">{ep.title}</h3>
                    <p className="font-mono text-xs text-secondary uppercase mb-2">{ep.guest}</p>
                    <p className="font-mono text-sm text-gray-600 line-clamp-2">{ep.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 md:flex-shrink-0">
                    <span className="font-mono text-sm text-gray-400">{ep.duration}</span>
                    <button className="w-12 h-12 bg-primary border-2 border-black flex items-center justify-center hover:bg-black hover:text-primary transition-colors shadow-[2px_2px_0px_0px_#000]">
                      <span className="material-icons">play_arrow</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subscribe CTA */}
          <div className="mt-16 bg-background-dark text-white border-[3px] border-black p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-3xl font-display font-bold mb-4">Never Miss an Episode</h3>
              <p className="font-mono text-gray-400 text-sm">Subscribe to Compliance Conversations and get notified when new episodes drop. Available on all major podcast platforms.</p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              {['podcasts', 'headphones', 'rss_feed'].map((icon, i) => (
                <button key={i} className="w-14 h-14 border-2 border-white flex items-center justify-center text-white hover:bg-primary hover:text-black hover:border-black transition-all">
                  <span className="material-icons">{icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
