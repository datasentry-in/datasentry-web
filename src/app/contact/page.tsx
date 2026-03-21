import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Contact() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <header className="w-full bg-background-dark text-white py-12 md:py-24 border-b-[3px] border-black">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="max-w-4xl">
              <div className="inline-block bg-primary text-black px-3 py-1 font-mono text-xs uppercase mb-6 border border-black font-bold">
                Get In Touch
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6 md:mb-8 font-display">
                Start Your Compliance <span className="text-primary italic">Journey.</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-mono leading-relaxed border-l-4 border-primary pl-6">
                Whether you are preparing for ISO certification, building a privacy program, or responding to client security requirements, DataSentry can help you navigate the process with confidence.
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#FFED00] p-5 sm:p-8 md:p-10">
              <h3 className="text-2xl font-display font-bold uppercase mb-6">Contact Us</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-2 text-gray-700">Full Name</label>
                    <input className="w-full border-2 border-black px-4 py-3 font-mono text-sm focus:border-secondary focus:ring-0 outline-none bg-background-light" type="text" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase font-bold mb-2 text-gray-700">Organization</label>
                    <input className="w-full border-2 border-black px-4 py-3 font-mono text-sm focus:border-secondary focus:ring-0 outline-none bg-background-light" type="text" placeholder="Company Name" />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase font-bold mb-2 text-gray-700">Email</label>
                  <input className="w-full border-2 border-black px-4 py-3 font-mono text-sm focus:border-secondary focus:ring-0 outline-none bg-background-light" type="email" placeholder="you@company.com" />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase font-bold mb-2 text-gray-700">What do you need help with?</label>
                  <select className="w-full border-2 border-black px-4 py-3 font-mono text-sm focus:border-secondary focus:ring-0 outline-none bg-background-light">
                    <option>ISO 27001 Implementation</option>
                    <option>Privacy & Data Protection</option>
                    <option>AI Governance (ISO 42001)</option>
                    <option>Compliance Program Design</option>
                    <option>Audit Readiness</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase font-bold mb-2 text-gray-700">Message</label>
                  <textarea className="w-full border-2 border-black px-4 py-3 font-mono text-sm focus:border-secondary focus:ring-0 outline-none bg-background-light min-h-[120px]" placeholder="Tell us about your compliance goals..." rows={5}></textarea>
                </div>
                <button className="w-full bg-primary text-black font-bold py-4 font-mono uppercase tracking-wider border-2 border-black shadow-brutal-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-lg">
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Schedule CTA */}
              <div className="bg-secondary text-white border-[3px] border-black p-5 sm:p-8 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 text-[200px] font-display font-bold text-white/5 select-none pointer-events-none leading-none">?</div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-display font-bold uppercase mb-4">Schedule a Consultation</h3>
                  <p className="font-mono text-sm text-white/80 mb-6">Book a 30-minute discovery call with Dharita Gada. We&apos;ll discuss your compliance landscape and identify the right approach for your organization.</p>
                  <button className="bg-black text-white font-mono font-bold px-8 py-4 uppercase border-2 border-white hover:bg-white hover:text-black transition-all">
                    Schedule Call →
                  </button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-background-dark text-white border-[3px] border-black p-5 sm:p-8">
                <h3 className="text-xl font-display font-bold uppercase mb-6">Contact Details</h3>
                <div className="space-y-6 font-mono text-sm">
                  <div className="flex items-start gap-4">
                    <span className="material-icons text-primary text-xl">email</span>
                    <div>
                      <p className="text-gray-400 text-xs uppercase mb-1">Email</p>
                      <p className="text-white">enquiry@datasentry.in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="material-icons text-primary text-xl">phone</span>
                    <div>
                      <p className="text-gray-400 text-xs uppercase mb-1">Phone</p>
                      <p className="text-white">+91 9819740174</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="material-icons text-primary text-xl">location_on</span>
                    <div>
                      <p className="text-gray-400 text-xs uppercase mb-1">Office</p>
                      <p className="text-white">DataSentry, 211 Wadala Udyog Bhavan<br/>Naigaon Cross Road, Mumbai 400031, India</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder Quote */}
              <div className="bg-primary border-[3px] border-black p-5 sm:p-8 relative">
                <span className="text-8xl font-display font-bold text-black/10 absolute top-2 left-4 leading-none">&ldquo;</span>
                <blockquote className="relative z-10 text-lg font-display font-bold text-black leading-relaxed mt-4">
                  We don&apos;t just hand you a checklist. We guide you through every step of your compliance journey with practical, implementation-focused advice.
                </blockquote>
                <p className="font-mono text-sm text-black/70 mt-4 uppercase">— Dharita Gada, Founder</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
