'use client';
import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="border-t-4 sm:border-t-8 border-primary border-b-2 border-b-black bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Logo className="h-10 w-auto sm:h-12" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link className="font-mono text-sm uppercase font-medium hover:text-secondary transition-colors" href="/">Home</Link>
            <Link className="font-mono text-sm uppercase font-medium hover:text-secondary transition-colors" href="/#services">Services</Link>
            <Link className="font-mono text-sm uppercase font-medium hover:text-secondary transition-colors" href="/#about">About Us</Link>
            <Link className="font-mono text-sm uppercase font-medium hover:text-secondary transition-colors" href="/podcast">Podcast</Link>
            <Link className="font-mono text-sm uppercase font-medium hover:text-secondary transition-colors" href="/blog">Blogs</Link>
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
        <div className="md:hidden bg-white border-t-2 border-black px-4 pb-6 pt-2">
          <Link className="block font-mono text-sm uppercase font-medium py-3 hover:text-secondary border-b border-gray-100" href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link className="block font-mono text-sm uppercase font-medium py-3 hover:text-secondary border-b border-gray-100" href="/#services" onClick={() => setOpen(false)}>Services</Link>
          <Link className="block font-mono text-sm uppercase font-medium py-3 hover:text-secondary border-b border-gray-100" href="/#about" onClick={() => setOpen(false)}>About Us</Link>
          <Link className="block font-mono text-sm uppercase font-medium py-3 hover:text-secondary border-b border-gray-100" href="/podcast" onClick={() => setOpen(false)}>Podcast</Link>
          <Link className="block font-mono text-sm uppercase font-medium py-3 hover:text-secondary border-b border-gray-100" href="/blog" onClick={() => setOpen(false)}>Blogs</Link>
          <Link
            className="block bg-black text-primary font-mono text-sm px-6 py-4 font-bold text-center mt-4 border-2 border-black"
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
