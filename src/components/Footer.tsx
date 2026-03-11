import Link from 'next/link';

export default function Footer() {
  return (
    <>
      {/* CTA Band */}
      <section className="relative bg-secondary text-white py-20 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute -right-10 -top-10 text-[300px] font-display font-bold text-white/5 select-none pointer-events-none leading-none z-0">05</div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight uppercase mb-6">
              Stop Losing Deals To <span className="bg-primary text-black px-2">Security Gaps.</span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              Don&apos;t let compliance hurdles slow down your sales cycle. Secure your data, achieve certification, and close deals faster with DataSentry.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              className="inline-block bg-black text-white font-mono font-bold text-lg px-12 py-5 uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
              href="/contact"
            >
              Book a Free Assessment →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-dark text-white py-16 border-t-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-primary border-2 border-black flex items-center justify-center mr-3">
                  <span className="font-display font-bold text-black text-lg leading-none text-center">DATA<br/>Sentry</span>
                </div>
              </div>
              <p className="font-mono text-sm text-gray-400 mt-4">
                <span className="font-bold text-white">Headquarters</span><br/>
                DataSentry, 211 Wadala Udyog Bhavan<br/>
                Naigaon Cross Road, Mumbai<br/>
                400031, India
              </p>
              <div className="mt-4 space-y-2 font-mono text-sm">
                <p className="text-secondary">✉ enquiry@datasentry.in</p>
                <p className="text-secondary">📞 +91 9819740174</p>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-display font-bold text-lg uppercase mb-6 border-b border-gray-700 pb-2">Our Services</h3>
              <ul className="space-y-3 font-mono text-sm text-gray-400">
                <li><Link href="/#services" className="hover:text-primary transition-colors">• ISO 27001 Certification</Link></li>
                <li><Link href="/#services" className="hover:text-primary transition-colors">• Privacy & Data Protection</Link></li>
                <li><Link href="/#services" className="hover:text-primary transition-colors">• AI Governance (ISO 42001)</Link></li>
                <li><Link href="/#services" className="hover:text-primary transition-colors">• Compliance Program Design</Link></li>
                <li><Link href="/#services" className="hover:text-primary transition-colors">• Risk Management</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-display font-bold text-lg uppercase mb-6 border-b border-gray-700 pb-2">Company</h3>
              <ul className="space-y-3 font-mono text-sm text-gray-400">
                <li><Link href="/" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog & Insights</Link></li>
                <li><Link href="/podcast" className="hover:text-primary transition-colors">Podcast</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* CTA Card */}
            <div className="bg-primary text-black p-6 border-2 border-black">
              <h3 className="font-display font-bold text-xl uppercase mb-4">Ready to Secure Your Future?</h3>
              <p className="text-sm mb-6">Talk to our experts today and get a customized roadmap for your security needs.</p>
              <Link
                className="inline-block bg-black text-white font-mono font-bold text-sm px-8 py-3 uppercase border-2 border-black hover:bg-white hover:text-black transition-all"
                href="/contact"
              >
                Book a Call
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-gray-500 text-xs">© 2024 DataSentry. All rights reserved.</p>
            <div className="flex space-x-4 font-mono text-sm text-gray-400">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
            <div className="flex space-x-4">
              <Link className="text-gray-400 hover:text-primary transition-colors w-10 h-10 border border-gray-700 flex items-center justify-center" href="#">in</Link>
              <Link className="text-gray-400 hover:text-primary transition-colors w-10 h-10 border border-gray-700 flex items-center justify-center" href="#">𝕏</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
