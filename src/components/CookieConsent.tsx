'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setShowBanner(false);
    
    // Update Google Analytics consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'denied');
    setShowBanner(false);
    
    // Explicitly update GA to denied (though it defaults to denied)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pb-6 sm:pb-8 flex justify-center pointer-events-none">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 max-w-4xl w-full pointer-events-auto flex flex-col md:flex-row gap-6 items-center justify-between animate-slide-up">
        <div className="grow">
          <h3 className="font-display font-bold text-xl uppercase mb-2">We Use Cookies</h3>
          <p className="font-mono text-sm text-gray-700 leading-relaxed">
            We use cookies to enhance your browsing experience, analyze site traffic, and serve tailored content in accordance with our{' '}
            <Link href="/privacy-policy" className="text-secondary font-bold hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
          <button 
            onClick={handleDecline}
            className="bg-background-light font-mono font-bold text-sm uppercase px-6 py-3 border-2 border-black hover:bg-gray-200 transition-colors"
          >
            Decline All
          </button>
          <button 
            onClick={handleAccept}
            className="bg-primary text-black font-mono font-bold text-sm uppercase px-6 py-3 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
