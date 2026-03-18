import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-grow flex flex-col relative overflow-hidden">

        {/* HERO — exact Stitch */}
        <section className="relative bg-background-dark text-white flex-grow flex items-center py-20 lg:py-32 border-b-2 border-white">
          <div className="absolute inset-0 halftone-pattern pointer-events-none"></div>
          <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left">
            <span className="font-mono text-primary text-xs tracking-[0.2em] uppercase">HOMEPAGE 2026 // VER 4.0</span>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-block bg-white text-black px-2 py-1 mb-6 font-mono text-xs font-bold border border-black shadow-brutal-sm">
                  TRUST, RISK &amp; COMPLIANCE ADVISORY
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8 font-display uppercase">
                  Build <span className="text-primary italic">Trust.</span> <br/>
                  Navigate <span className="text-secondary italic">Regulation.</span> <br/>
                  Strengthen Governance.
                </h1>
                <div className="font-mono text-gray-400 max-w-xl text-sm md:text-base leading-relaxed mb-10 border-l-2 border-primary pl-4 space-y-4">
                  <p>
                    DataSentry helps organizations navigate information security, privacy, and regulatory frameworks with clarity—from ISO certifications to data protection governance.
                  </p>
                  <p className="text-gray-500">
                    Led by experienced compliance professionals and supported by a trusted partner ecosystem, we guide companies through complex security and privacy journeys with practical, implementation-focused advice.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-primary text-black font-bold px-8 py-4 font-mono uppercase tracking-wider hover:bg-white transition-colors shadow-brutal-blue border-2 border-black">
                    Book a Consultation
                  </button>
                  <button className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 font-mono uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
                    Explore Our Approach
                  </button>
                </div>
              </div>
              <div className="lg:col-span-5 relative mt-12 lg:mt-0">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-10 -left-10 w-40 h-40 bg-primary rounded-full blur-3xl opacity-20"></div>
                <div className="bg-white border-2 border-black p-6 shadow-brutal transform rotate-1 transition-transform hover:rotate-0">
                  <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="font-mono text-xs text-gray-500 uppercase">System Status</h3>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                        <span className="font-bold text-lg text-black">Active Monitoring</span>
                      </div>
                    </div>
                    <span className="material-icons text-secondary text-3xl">radar</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 border border-gray-200">
                      <p className="font-mono text-xs text-gray-500 mb-1">Compliance Rate</p>
                      <p className="text-4xl font-bold text-black">87%</p>
                      <div className="w-full bg-gray-200 h-1 mt-2">
                        <div className="bg-secondary h-1 w-[87%]"></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 border border-gray-200">
                      <p className="font-mono text-xs text-gray-500 mb-1">VAPT Findings</p>
                      <p className="text-4xl font-bold text-primary">34</p>
                      <p className="text-xs text-red-500 mt-1 font-mono flex items-center">
                        <span className="material-icons text-[10px] mr-1">arrow_upward</span> 2 Critical
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center bg-black text-white p-2">
                      <span>ISO 27001 Audit</span>
                      <span className="text-primary">IN PROGRESS</span>
                    </div>
                    <div className="flex justify-between items-center border border-gray-200 p-2 text-gray-600">
                      <span>SOC 2 Type II</span>
                      <span className="text-green-600">COMPLIANT</span>
                    </div>
                    <div className="flex justify-between items-center border border-gray-200 p-2 text-gray-600">
                      <span>GDPR Review</span>
                      <span className="text-gray-400">PENDING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TICKER — exact Stitch */}
        <div className="bg-primary text-black border-y-2 border-black overflow-hidden py-3 relative z-20">
          <div className="flex whitespace-nowrap animate-scroll-left">
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center"><span className="material-icons mr-2">verified</span> ISO Certification</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center">•</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center"><span className="material-icons mr-2">lock</span> Data Privacy</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center">•</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center"><span className="material-icons mr-2">psychology</span> AI Governance</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center">•</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center"><span className="material-icons mr-2">policy</span> Risk Management</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center">•</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center"><span className="material-icons mr-2">verified</span> ISO Certification</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center">•</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center"><span className="material-icons mr-2">lock</span> Data Privacy</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center">•</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center"><span className="material-icons mr-2">psychology</span> AI Governance</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center">•</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center"><span className="material-icons mr-2">policy</span> Risk Management</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center">•</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center"><span className="material-icons mr-2">verified</span> ISO Certification</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center">•</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center"><span className="material-icons mr-2">lock</span> Data Privacy</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center">•</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center"><span className="material-icons mr-2">psychology</span> AI Governance</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center">•</span>
            <span className="mx-4 font-mono font-bold text-lg uppercase flex items-center"><span className="material-icons mr-2">policy</span> Risk Management</span>
          </div>
        </div>

        {/* Industries We Work With */}
        <section className="bg-gray-50 py-12 border-b-4 border-black border-t-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center font-mono text-sm font-bold uppercase tracking-widest text-black mb-8">Industries We Work With</p>
            <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6 px-4">
              <div className="border-2 border-black bg-white px-4 py-2 font-mono font-bold text-sm text-black shadow-[4px_4px_0px_0px_#FFED00] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-default flex items-center">
                <i className="fas fa-building-columns mr-2"></i> Financial Services <span className="font-sans text-xs tracking-normal opacity-80 ml-1">(NBFC / Housing Finance)</span>
              </div>
              <div className="border-2 border-black bg-white px-4 py-2 font-mono font-bold text-sm text-black shadow-[4px_4px_0px_0px_#009FE3] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-default flex items-center">
                <i className="fas fa-cloud mr-2"></i> SaaS &amp; Technology Platforms
              </div>
              <div className="border-2 border-black bg-white px-4 py-2 font-mono font-bold text-sm text-black shadow-[4px_4px_0px_0px_#FFED00] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-default flex items-center">
                <i className="fas fa-network-wired mr-2"></i> AI &amp; Data Analytics Companies
              </div>
              <div className="border-2 border-black bg-white px-4 py-2 font-mono font-bold text-sm text-black shadow-[4px_4px_0px_0px_#009FE3] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-default flex items-center">
                <i className="fas fa-shield-halved mr-2"></i> Background Screening &amp; Risk Intelligence
              </div>
              <div className="border-2 border-black bg-white px-4 py-2 font-mono font-bold text-sm text-black shadow-[4px_4px_0px_0px_#FFED00] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-default flex items-center">
                <i className="fas fa-briefcase mr-2"></i> Management &amp; Business Consulting Firms
              </div>
            </div>
          </div>
        </section>

        {/* CORE ADVISORY SERVICES */}
        <section id="services" className="bg-background-light py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Core Advisory Services</h2>
              <div className="w-20 h-2 bg-primary"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                <div className="w-12 h-12 bg-primary/20 flex items-center justify-center mb-6 border border-primary text-primary shrink-0">
                  <span className="material-icons">verified_user</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-display">Security &amp; Compliance Frameworks</h3>
                <p className="text-gray-600 font-mono text-sm leading-relaxed mb-6">Helping organizations implement globally recognized governance frameworks.</p>
                <ul className="text-sm font-mono text-gray-500 space-y-2 mb-6 flex-grow">
                  <li>• ISO 27001 implementation</li>
                  <li>• ISO 27701 privacy extension</li>
                  <li>• ISO 42001 AI Management System</li>
                  <li>• Risk management controls</li>
                </ul>
              </div>
              <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center mb-6 border border-secondary text-secondary shrink-0">
                  <span className="material-icons">privacy_tip</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-display">Privacy &amp; Data Protection</h3>
                <p className="text-gray-600 font-mono text-sm leading-relaxed mb-6">Supporting organizations in interpreting and implementing modern data protection obligations.</p>
                <ul className="text-sm font-mono text-gray-500 space-y-2 mb-6 flex-grow">
                  <li>• Privacy governance program design</li>
                  <li>• Data protection frameworks</li>
                  <li>• Regulatory interpretation</li>
                  <li>• Data processing agreements</li>
                </ul>
              </div>
              <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                <div className="w-12 h-12 bg-black/10 flex items-center justify-center mb-6 border border-black text-black shrink-0">
                  <span className="material-icons">assignment_turned_in</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-display">Compliance &amp; Audit Readiness</h3>
                <p className="text-gray-600 font-mono text-sm leading-relaxed mb-6">Helping organizations prepare for certifications, regulatory expectations, and client security reviews.</p>
                <ul className="text-sm font-mono text-gray-500 space-y-2 mb-6 flex-grow">
                  <li>• Internal compliance reviews</li>
                  <li>• Policy &amp; control frameworks</li>
                  <li>• Audit preparation support</li>
                  <li>• Vendor governance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* THE CHALLENGE */}
        <section className="relative py-24 px-6 md:px-12 lg:px-20 overflow-hidden bg-background-light transition-colors duration-300">
          <div className="absolute inset-0 halftone-dark pointer-events-none"></div>
          <div className="absolute -right-10 -top-20 text-[300px] md:text-[500px] font-display font-bold text-black/5 select-none pointer-events-none leading-none z-0">
            01
          </div>
          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="flex flex-col">
              <div className="space-y-6 mb-8">
                <div className="inline-block bg-black text-white font-display font-bold px-4 py-1 text-sm uppercase tracking-wider shadow-brutal-sm">
                  The Challenge
                </div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight uppercase text-black">
                  The Compliance Landscape Is <span className="bg-primary text-black px-2">Complex</span>.
                </h2>
                <p className="text-lg text-gray-700 max-w-xl leading-relaxed">
                  Regulators and partners increasingly require strong security practices. Organizations must demonstrate accountability, but translating rules into operations is overwhelming.
                </p>
              </div>
              <div className="bg-white border-2 border-black p-6 shadow-brutal-black rotate-1 hover:rotate-0 transition-transform duration-300">
                <h3 className="font-display font-bold text-xl mb-4 uppercase border-b-2 border-black/10 pb-2">Common Struggles</h3>
                <ul className="space-y-3 font-mono text-sm text-gray-700 mb-4">
                  <li className="flex gap-3 items-start"><span className="text-secondary material-icons-outlined text-lg shrink-0">close</span> <span>Understanding where to start with frameworks like ISO 27001 or AI standards</span></li>
                  <li className="flex gap-3 items-start"><span className="text-secondary material-icons-outlined text-lg shrink-0">close</span> <span>Managing endless client security questionnaires</span></li>
                  <li className="flex gap-3 items-start"><span className="text-secondary material-icons-outlined text-lg shrink-0">close</span> <span>Translating regulatory obligations into practical internal controls</span></li>
                  <li className="flex gap-3 items-start"><span className="text-secondary material-icons-outlined text-lg shrink-0">close</span> <span>Finding the right specialists across legal, technical, and governance domains</span></li>
                </ul>
                <div className="p-3 bg-red-100 border border-red-300 text-red-800 font-bold text-sm">
                  Without a structured approach, compliance becomes fragmented, reactive, and difficult to sustain.
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white border-2 border-black p-8 shadow-brutal-lg max-w-md mx-auto transform -rotate-2">
                <div className="border-b-2 border-black/10 pb-4 mb-6 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 border border-black"></div>
                    <div className="w-3 h-3 bg-primary border border-black"></div>
                    <div className="w-3 h-3 bg-green-500 border border-black"></div>
                  </div>
                  <div className="font-mono text-xs text-gray-500 uppercase">Procurement Mail</div>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-12 shrink-0">From:</span>
                    <span className="font-bold text-black">Enterprise Procurement</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-12 shrink-0">To:</span>
                    <span className="text-black">Your Startup CEO</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-12 shrink-0">Subj:</span>
                    <span className="bg-red-100 text-red-600 font-bold px-1">Vendor Onboarding Halted - Urgent</span>
                  </div>
                  <div className="pt-4 text-gray-800 leading-relaxed">
                    <p className="mb-4">Hi Team,</p>
                    <p className="mb-4">We regret to inform you that we cannot proceed with the contract signing.</p>
                    <p className="mb-4 bg-primary/20 p-2 border-l-4 border-primary">
                      Your current security posture does not meet our minimum vendor requirements (ISO 27001 / SOC 2 Type II missing).
                    </p>
                    <p>Please reach out once you have these certifications in place.</p>
                    <br/>
                    <p className="text-gray-400">Sent from Enterprise Secure Mail Gateway</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-600 flex items-center justify-center border-2 border-black shadow-brutal-black text-white font-display font-bold text-xl uppercase rotate-[-15deg] opacity-90">
                  Deal Lost
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE SOLUTION — A Practical Approach to Trust & Compliance */}
        <section className="relative bg-background-dark text-white py-24 px-6 md:px-12 lg:px-20 overflow-hidden border-t-8 border-primary">
          <div className="absolute -left-20 top-20 text-[300px] md:text-[500px] font-display font-bold text-white/5 select-none pointer-events-none leading-none z-0">
            02
          </div>
          <div className="relative z-10 max-w-7xl mx-auto text-center space-y-16">
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 bg-white/5 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
                <span className="text-sm font-mono tracking-wider uppercase">The DataSentry Solution</span>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] uppercase tracking-tighter">
                A Practical Approach to <br/>
                <span className="text-primary italic">Trust</span> &amp; <span className="text-secondary italic">Compliance</span>.
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                At DataSentry, we help organizations move from regulatory confusion to structured compliance programs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 mt-16">
              <div className="group relative bg-surface-dark border border-white/10 p-8 hover:border-primary transition-colors duration-300 text-left flex flex-col h-full">
                <div className="absolute top-0 right-0 w-8 h-8 bg-primary translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-primary material-icons-outlined text-4xl mb-4">gavel</div>
                <h4 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors">Legal Understanding</h4>
                <p className="text-gray-400 font-mono text-sm leading-relaxed border-t border-white/10 pt-4 mt-auto">Deep knowledge and interpretation of complex regulatory obligations.</p>
              </div>
              <div className="group relative bg-surface-dark border border-white/10 p-8 hover:border-secondary transition-colors duration-300 text-left flex flex-col h-full">
                <div className="absolute top-0 right-0 w-8 h-8 bg-secondary translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-secondary material-icons-outlined text-4xl mb-4">security</div>
                <h4 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-secondary transition-colors">InfoSec Governance</h4>
                <p className="text-gray-400 font-mono text-sm leading-relaxed border-t border-white/10 pt-4 mt-auto">Structuring recognized frameworks like ISO 27001 tailored to your business.</p>
              </div>
              <div className="group relative bg-surface-dark border border-white/10 p-8 hover:border-primary transition-colors duration-300 text-left flex flex-col h-full">
                <div className="absolute top-0 right-0 w-8 h-8 bg-primary translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-white material-icons-outlined text-4xl mb-4">build</div>
                <h4 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors">Operational Implementation</h4>
                <p className="text-gray-400 font-mono text-sm leading-relaxed border-t border-white/10 pt-4 mt-auto">Practical, hands-on guidance to embed governance into daily operations.</p>
              </div>
            </div>

            <div className="text-left max-w-5xl mx-auto mt-16 bg-white/5 border border-white/10 p-8 md:p-12">
              <h3 className="text-3xl font-display font-bold text-white mb-8 border-b border-white/10 pb-4">The Entire Compliance Lifecycle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8">
                <ul className="space-y-4 font-mono text-sm text-gray-300">
                  <li className="flex gap-3"><span className="text-primary material-icons-outlined text-lg shrink-0">check_circle</span> <span>Security &amp; privacy governance design</span></li>
                  <li className="flex gap-3"><span className="text-primary material-icons-outlined text-lg shrink-0">check_circle</span> <span>ISO certification readiness</span></li>
                  <li className="flex gap-3"><span className="text-primary material-icons-outlined text-lg shrink-0">check_circle</span> <span>Risk management frameworks</span></li>
                </ul>
                <ul className="space-y-4 font-mono text-sm text-gray-300">
                  <li className="flex gap-3"><span className="text-primary material-icons-outlined text-lg shrink-0">check_circle</span> <span>Vendor &amp; third-party risk oversight</span></li>
                  <li className="flex gap-3"><span className="text-primary material-icons-outlined text-lg shrink-0">check_circle</span> <span>Privacy compliance programs</span></li>
                  <li className="flex gap-3"><span className="text-primary material-icons-outlined text-lg shrink-0">check_circle</span> <span>ISO 42001 AI Management System</span></li>
                </ul>
              </div>
              <div className="border-t border-white/10 pt-6 mt-6 flex gap-4 items-start">
                <span className="material-icons-outlined text-secondary text-2xl shrink-0">handshake</span>
                <p className="font-mono text-gray-400 text-sm leading-relaxed">
                  Where specialized technical assessments are required, such as vulnerability assessments or penetration testing, we coordinate with <span className="text-white font-bold">trusted partner specialists</span>, ensuring clients receive a seamless end-to-end experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS HEADER */}
        <section className="border-t-4 border-black">
          <div className="py-16 bg-background-light border-b-2 border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end mb-12">
                <h2 className="font-display text-5xl font-bold uppercase tracking-tight">How It Works</h2>
                <div className="ml-6 mb-2 h-4 w-32 bg-primary hidden md:block"></div>
              </div>
            </div>
          </div>

          {/* STEP 01 */}
          <div className="bg-primary border-b-2 border-black py-16 relative overflow-hidden text-black group">
            <div className="absolute top-0 right-0 font-display text-[10rem] md:text-[12rem] font-bold text-yellow-300 leading-none -mt-4 -mr-4 select-none z-0 opacity-50">01</div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-block bg-black text-white font-mono px-3 py-1 mb-6 text-sm font-bold uppercase">Discovery</div>
                  <h3 className="font-display text-4xl font-bold mb-6">Understand Your Environment</h3>
                  <p className="text-lg leading-relaxed font-medium">
                    We begin by understanding your business model, regulatory exposure, and current governance maturity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 02 */}
          <div className="bg-white border-b-2 border-black py-16 relative overflow-hidden group">
            <div className="absolute top-0 left-0 font-display text-[10rem] md:text-[12rem] font-bold text-gray-100 leading-none -mt-4 -ml-4 select-none z-0">02</div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 hidden lg:block"></div>
                <div className="order-1 lg:order-2">
                  <div className="inline-block bg-black text-white font-mono px-3 py-1 mb-6 text-sm font-bold uppercase">Planning</div>
                  <h3 className="font-display text-4xl font-bold mb-6">Define the Compliance Roadmap</h3>
                  <p className="text-lg leading-relaxed text-gray-700">
                    We identify applicable frameworks and design a structured roadmap aligned with regulatory and client expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 03 */}
          <div className="bg-secondary border-b-2 border-black py-16 relative overflow-hidden text-white group">
            <div className="absolute bottom-0 right-0 font-display text-[10rem] md:text-[12rem] font-bold text-blue-400 leading-none -mb-4 -mr-4 select-none z-0 opacity-50">03</div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-block bg-black text-white font-mono px-3 py-1 mb-6 text-sm font-bold uppercase">Execution</div>
                  <h3 className="font-display text-4xl font-bold mb-6">Implement Governance Controls</h3>
                  <p className="text-lg leading-relaxed font-medium">
                    Policies, procedures, risk registers, vendor oversight, and compliance structures are implemented with practical guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 04 */}
          <div className="bg-white border-b-2 border-black py-16 relative overflow-hidden group">
            <div className="absolute top-0 left-0 font-display text-[10rem] md:text-[12rem] font-bold text-gray-100 leading-none -mt-4 -ml-4 select-none z-0">04</div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 hidden lg:block"></div>
                <div className="order-1 lg:order-2">
                  <div className="inline-block bg-black text-white font-mono px-3 py-1 mb-6 text-sm font-bold uppercase">Validation</div>
                  <h3 className="font-display text-4xl font-bold mb-6">Certification &amp; Audit Readiness</h3>
                  <p className="text-lg leading-relaxed text-gray-700">
                    We prepare organizations for external audits, certifications, and client security assessments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 05 */}
          <div className="bg-background-dark border-b-2 border-black text-white py-16 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 font-display text-[10rem] md:text-[12rem] font-bold text-white/5 leading-none -mb-4 -mr-4 select-none z-0">05</div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-block bg-primary text-black font-mono px-3 py-1 mb-6 text-sm font-bold uppercase">Sustainability</div>
                  <h3 className="font-display text-4xl font-bold mb-6">Ongoing Advisory</h3>
                  <p className="text-lg leading-relaxed text-gray-400">
                    We continue to support organizations as regulations evolve and governance programs mature.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* WHY DATASENTRY */}
        <section id="about" className="bg-background-dark py-24 px-6 md:px-12 lg:px-20 border-b-4 border-primary text-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 md:flex md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-5xl md:text-7xl font-bold mb-6">
                  Why Organizations Work With <span className="text-primary">DataSentry</span>
                </h2>
                <div className="w-24 h-2 bg-secondary mb-6"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-dark border border-white/20 p-8 hover:border-primary transition-colors group">
                <div className="w-12 h-12 bg-white/5 border border-white/20 flex items-center justify-center mb-6 overflow-hidden">
                  <span className="material-icons-outlined text-primary group-hover:scale-110 transition-transform">balance</span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Legal + Security Perspective</h3>
                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                  We bridge the gap between regulatory requirements and technical implementation.
                </p>
              </div>
              
              <div className="bg-surface-dark border border-white/20 p-8 hover:border-secondary transition-colors group">
                <div className="w-12 h-12 bg-white/5 border border-white/20 flex items-center justify-center mb-6 overflow-hidden">
                  <span className="material-icons-outlined text-secondary group-hover:scale-110 transition-transform">construction</span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Implementation-Focused</h3>
                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                  We don&apos;t just hand over a gap assessment; we help you build the controls.
                </p>
              </div>
              
              <div className="bg-surface-dark border border-white/20 p-8 hover:border-primary transition-colors group">
                <div className="w-12 h-12 bg-white/5 border border-white/20 flex items-center justify-center mb-6 overflow-hidden">
                  <span className="material-icons-outlined text-white group-hover:scale-110 transition-transform">engineering</span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Founder-Led Engagement</h3>
                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                  Smaller teams, highly experienced advisors. You always work with senior experts.
                </p>
              </div>
              
              <div className="bg-surface-dark border border-white/20 p-8 hover:border-secondary transition-colors group">
                <div className="w-12 h-12 bg-white/5 border border-white/20 flex items-center justify-center mb-6 overflow-hidden">
                  <span className="material-icons-outlined text-primary group-hover:scale-110 transition-transform">hub</span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Trusted Partner Ecosystem</h3>
                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                  A seamless experience for VAPT and external audits via our partner network.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF — exact Stitch 04 */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-secondary/10 blur-3xl pointer-events-none" style={{borderRadius: '50%'}}></div>
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="font-display text-4xl sm:text-6xl md:text-8xl font-bold text-black leading-none tracking-tighter mb-4">
                Real companies. <br/>
                <span className="text-secondary">Real compliance journeys.</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl font-medium border-l-4 border-primary pl-4">
                Join organizations building trust through stronger security, privacy, and compliance practices.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Featured testimonial */}
              <div className="lg:col-span-7 bg-primary border-4 border-black p-8 md:p-12 shadow-brutal-lg relative transform hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
                <div className="absolute -top-6 -right-6 bg-black text-white font-display font-bold text-xl px-4 py-2 border-2 border-primary rotate-3 shadow-md">
                  FEATURED STORY
                </div>
                <div>
                  <div className="text-6xl text-black opacity-20 font-serif absolute top-8 left-8">&ldquo;</div>
                  <blockquote className="font-display text-2xl md:text-4xl font-bold text-black leading-tight relative z-10 mb-12 mt-8">
                    In preparation for our Audit, DataSentry put policies and processes in place which have significantly minimised the chance of breach incidents.
                  </blockquote>
                </div>
                <div className="border-t-2 border-black pt-6">
                  <div className="font-bold text-lg text-black/80 uppercase tracking-wider">
                    CO-FOUNDER, RESPONSE POINT
                  </div>
                </div>
              </div>
              
              {/* Three smaller testimonials */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Testimonial 1 */}
                <div className="bg-white border-2 border-black p-6 shadow-brutal-sm hover:shadow-brutal-lg transition-shadow duration-300 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex text-primary text-xs space-x-1 mb-3">
                      <i className="fas fa-star text-black"></i><i className="fas fa-star text-black"></i><i className="fas fa-star text-black"></i><i className="fas fa-star text-black"></i><i className="fas fa-star text-black"></i>
                    </div>
                    <p className="text-gray-800 font-medium text-lg leading-relaxed mb-6">
                      &ldquo;With our GRC function out-sourced to Team DataSentry, all the stress of team recruitment, motivation, attrition ... is in the past.&rdquo;
                    </p>
                  </div>
                  <div className="text-xs font-bold text-black/70 uppercase tracking-wider">
                    MD, DELTA PUMPS
                  </div>
                </div>
                {/* Testimonial 2 */}
                <div className="bg-white border-2 border-black p-6 shadow-brutal-sm hover:shadow-brutal-lg transition-shadow duration-300 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex text-primary text-xs space-x-1 mb-3">
                      <i className="fas fa-star text-black"></i><i className="fas fa-star text-black"></i><i className="fas fa-star text-black"></i><i className="fas fa-star text-black"></i><i className="fas fa-star text-black"></i>
                    </div>
                    <p className="text-gray-800 font-medium text-lg leading-relaxed mb-6">
                      &ldquo;Dharita is crystal-clear in her thought process, and stands by her integrity—never recommending anything unless fully convinced of its value.&rdquo;
                    </p>
                  </div>
                  <div className="text-xs font-bold text-black/70 uppercase tracking-wider">
                    HEAD OF DEVELOPMENT AND DELIVERY - IT, VASTU HOUSING
                  </div>
                </div>
                {/* Testimonial 3 */}
                <div className="bg-white border-2 border-black p-6 shadow-brutal-sm hover:shadow-brutal-lg transition-shadow duration-300 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex text-primary text-xs space-x-1 mb-3">
                      <i className="fas fa-star text-black"></i><i className="fas fa-star text-black"></i><i className="fas fa-star text-black"></i><i className="fas fa-star text-black"></i><i className="fas fa-star text-black"></i>
                    </div>
                    <p className="text-gray-800 font-medium text-lg leading-relaxed mb-6">
                      &ldquo;We used to worry about hidden risks in our systems. Thanks to DataSentry&apos;s VAPT services, we found them and made our defences stronger than ever.&rdquo;
                    </p>
                  </div>
                  <div className="text-xs font-bold text-black/70 uppercase tracking-wider">
                    SR. DIRECTOR - PRODUCT DEVELOPMENT, NEXSALES
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM — The Architect (Dharita Gada) */}
        <section className="relative bg-primary border-t-4 border-black overflow-hidden">
          <div className="absolute right-0 top-0 leading-none text-[400px] font-display font-bold text-white opacity-20 select-none pointer-events-none -mt-24 -mr-24 mix-blend-overlay">
            04
          </div>
          
          {/* Header Area Full Width */}
          <div className="relative z-10 px-6 py-16 md:px-12 lg:px-20 border-b-4 border-black">
            <div className="max-w-7xl mx-auto">
              <h2 className="font-display text-5xl md:text-7xl font-bold text-black mb-4">
                The <span className="stroke-text">Architects</span>
              </h2>
              <p className="text-xl text-black font-medium max-w-xl">
                Meet the experts building the future of trust and compliance. A team obsessed with security, simplicity, and practical governance.
              </p>
            </div>
          </div>
          
          {/* Full Width Grid for Founder */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 bg-black border-b-4 border-black">
            {/* Photo area - 40% (5 cols) */}
            <div className="lg:col-span-5 relative h-96 lg:h-auto overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-black bg-primary">
              <img
                alt="Dharita Gada"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                src="/founder.png"
              />
              <div className="absolute bottom-0 left-0 bg-secondary text-white font-bold font-display tracking-wide text-sm px-6 py-3 border-t-4 border-r-4 border-black">
                FOUNDER &amp; CEO
              </div>
            </div>
            
            {/* Info area - 60% (7 cols) */}
            <div className="lg:col-span-7 bg-secondary text-white p-8 md:p-16 lg:p-24 flex flex-col justify-center">
              <h3 className="font-display text-5xl md:text-6xl font-bold mb-4 text-white">Dharita Gada</h3>
              <div className="h-1 w-24 bg-primary mb-8"></div>
              <p className="text-white text-xl leading-relaxed mb-10 max-w-2xl font-medium">
                15+ years of professional experience spanning law, compliance, and information security governance. Founder of DataSentry focused on translating regulation into practical compliance frameworks.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-primary"></div>
                  <span className="font-mono text-sm md:text-base text-white uppercase tracking-widest font-bold">Trust, Risk &amp; Compliance Advisory</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-black"></div>
                  <span className="font-mono text-sm md:text-base text-white uppercase tracking-widest font-bold">ISO 27001 &amp; ISO 42001 Lead Implementer</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-400"></div>
                  <span className="font-mono text-sm md:text-base text-white uppercase tracking-widest font-bold">Privacy &amp; Data Protection Programs</span>
                </div>
              </div>
              <div className="flex gap-8">
                <a className="text-white hover:text-black transition-colors hover:-translate-y-1 transform duration-200" href="#"><i className="fab fa-linkedin text-3xl"></i></a>
                <a className="text-white hover:text-black transition-colors hover:-translate-y-1 transform duration-200" href="#"><i className="fas fa-globe text-3xl"></i></a>
              </div>
            </div>
          </div>
        </section>
        {/* CALL TO ACTION */}
        <section className="bg-black py-24 px-6 md:px-12 lg:px-20 text-white relative overflow-hidden flex items-center justify-center border-t-4 border-black border-b-4 border-black">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="font-display text-4xl sm:text-6xl md:text-8xl font-bold leading-none uppercase tracking-tighter mb-8 text-white drop-shadow-md">
              Start Your <br/> <span className="text-secondary drop-shadow-lg">Compliance</span> Journey
            </h2>
            <p className="text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto text-gray-300">
              Ready to turn regulatory requirements into a competitive advantage? Let&apos;s talk strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="#" className="inline-block bg-primary text-black font-display font-bold text-xl px-10 py-5 uppercase tracking-wide border-2 border-primary shadow-brutal-blue hover:translate-y-1 hover:shadow-none transition-all duration-200">
                Book a Consultation
              </a>
              <a href="#" className="inline-block bg-white text-black font-display font-bold text-xl px-10 py-5 uppercase tracking-wide border-2 border-white hover:bg-black hover:text-white transition-all duration-200">
                Contact Us
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
