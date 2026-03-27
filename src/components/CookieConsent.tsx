'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

type ConsentState = 'unknown' | 'granted' | 'denied' | 'revoked';

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>('unknown');
  const [showBanner, setShowBanner] = useState(false);
  const [showRevoke, setShowRevoke] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent') as ConsentState | null;
    if (!stored) {
      // First visit — show main banner
      setShowBanner(true);
      setConsent('unknown');
    } else if (stored === 'revoked') {
      // Previously revoked — only show floating icon, no auto-banner
      setConsent('revoked');
    } else {
      setConsent(stored as ConsentState);
    }
    setReady(true);
  }, []);

  const updateGtag = (granted: boolean) => {
    if (typeof window !== 'undefined' && window.gtag) {
      const value = granted ? 'granted' : 'denied';
      window.gtag('consent', 'update', {
        analytics_storage: value,
        ad_storage: value,
        ad_user_data: value,
        ad_personalization: value,
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setConsent('granted');
    setShowBanner(false);
    updateGtag(true);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'denied');
    setConsent('denied');
    setShowBanner(false);
    updateGtag(false);
  };

  const handleRevoke = () => {
    // Update consent state
    localStorage.setItem('cookie_consent', 'revoked');
    setConsent('revoked');
    setShowRevoke(false);

    // Deny all via gtag
    updateGtag(false);

    // Clear all browser cookies
    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
    });

    // Reload to kill running analytics scripts
    window.location.reload();
  };

  const handleFloatingClick = () => {
    if (consent === 'revoked') {
      // After revocation, let user re-consent via main banner
      setShowBanner(true);
    } else {
      // Active consent (granted/denied) — show revoke-only panel
      setShowRevoke(true);
    }
  };

  if (!ready) return null;

  const showFloatingIcon = !showBanner && !showRevoke && consent === 'granted';

  return (
    <>
      {/* Main Cookie Banner — first visit or re-consent after revocation */}
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

      {/* Revoke-only Banner — shown when user clicks floating icon with active consent */}
      {showRevoke && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pb-6 sm:pb-8 flex justify-center pointer-events-none">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 max-w-4xl w-full pointer-events-auto flex flex-col md:flex-row gap-6 items-center justify-between animate-slide-up">
            <div className="grow">
              <h3 className="font-display font-bold text-xl uppercase mb-2">Cookie Preferences</h3>
              <p className="font-mono text-sm text-gray-700 leading-relaxed">
                You have the right to withdraw your cookie consent at any time. Revoking consent will clear all cookies and disable tracking.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setShowRevoke(false)}
                className="bg-background-light font-mono font-bold text-sm uppercase px-6 py-3 border-2 border-black hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleRevoke}
                className="bg-red-600 text-white font-mono font-bold text-sm uppercase px-6 py-3 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Revoke Consent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating cookie icon — visible whenever banner/revoke panel is closed and user has made a choice */}
      {showFloatingIcon && (
        <button
          onClick={handleFloatingClick}
          className="fixed bottom-4 left-4 z-40 bg-black text-white font-mono text-[10px] uppercase tracking-wider px-3 py-2 border border-white/20 hover:border-primary hover:text-primary transition-all opacity-60 hover:opacity-100"
          aria-label="Manage cookie preferences"
        >
          <span className="material-icons text-xs align-middle mr-1">cookie</span>
          Cookie Settings
        </button>
      )}
    </>
  );
}
