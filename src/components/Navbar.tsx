'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="border-t-8 border-primary border-b-2 border-b-black bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <div className="h-10 w-10 bg-black border-2 border-black flex items-center justify-center mr-3 relative">
              <span className="absolute top-1 left-1 w-full h-full bg-secondary -z-10"></span>
              <span className="material-icons text-primary">security</span>
            </div>
            <span className="font-mono text-xl font-bold tracking-tighter uppercase">Data<span className="text-secondary">Sentry</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link className="font-mono text-sm uppercase font-medium hover:text-secondary transition-colors" href="/">Home</Link>
            <Link className="font-mono text-sm uppercase font-medium hover:text-secondary transition-colors" href="/blog">Blog</Link>
            <Link className="font-mono text-sm uppercase font-medium hover:text-secondary transition-colors" href="/podcast">Podcast</Link>
            <Link className="font-mono text-sm uppercase font-medium hover:text-secondary transition-colors" href="/contact">Contact</Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex">
            <Link
              className="bg-black text-primary font-mono text-sm px-6 py-3 font-bold border-2 border-transparent hover:bg-secondary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              href="/contact"
            >
              BOOK A CONSULTATION
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-900 hover:text-secondary focus:outline-none" type="button" onClick={() => setOpen(!open)}>
              <span className="material-icons text-3xl">{open ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t-2 border-black px-4 pb-6 space-y-4">
          <Link className="block font-mono text-sm uppercase font-medium py-2 hover:text-secondary" href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link className="block font-mono text-sm uppercase font-medium py-2 hover:text-secondary" href="/blog" onClick={() => setOpen(false)}>Blog</Link>
          <Link className="block font-mono text-sm uppercase font-medium py-2 hover:text-secondary" href="/podcast" onClick={() => setOpen(false)}>Podcast</Link>
          <Link className="block font-mono text-sm uppercase font-medium py-2 hover:text-secondary" href="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link
            className="block bg-black text-primary font-mono text-sm px-6 py-3 font-bold text-center"
            href="/contact"
            onClick={() => setOpen(false)}
          >
            BOOK A CONSULTATION
          </Link>
        </div>
      )}
    </nav>
  );
}
