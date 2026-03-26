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
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      setHasConsented(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setShowBanner(false);
    setHasConsented(true);
    
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
    setHasConsented(true);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
  };

  const handleRevoke = () => {
    // Clear consent from localStorage
    localStorage.removeItem('cookie_consent');
    
    // Update GA consent to denied
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }

    // Clear all cookies
    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
    });

    // Full page reload to kill any running analytics scripts
    window.location.reload();
  };

  const handleManageCookies = () => {
    setShowBanner(true);
  };

  return (
    <>
      {/* Main Cookie Banner */}
      {showBanner && (
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
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              {hasConsented && (
                <button 
                  onClick={handleRevoke}
                  className="bg-red-50 text-red-700 font-mono font-bold text-xs uppercase px-5 py-3 border-2 border-red-300 hover:bg-red-100 transition-colors"
                >
                  Revoke Consent
                </button>
              )}
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
      )}

      {/* Persistent "Manage Cookies" button — only shown when banner is closed and user has consented */}
      {!showBanner && hasConsented && (
        <button
          onClick={handleManageCookies}
          className="fixed bottom-4 left-4 z-40 bg-black text-white font-mono text-[10px] uppercase tracking-wider px-3 py-2 border border-white/20 hover:border-primary hover:text-primary transition-all opacity-60 hover:opacity-100"
          aria-label="Manage cookie preferences"
        >
          <span className="material-icons text-xs align-middle mr-1">cookie</span>
          Manage Cookies
        </button>
      )}
    </>
  );
}
