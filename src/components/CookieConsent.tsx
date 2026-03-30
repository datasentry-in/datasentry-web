'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    [key: string]: unknown;
  }
}

type ConsentState = 'unknown' | 'granted' | 'denied';
type PopupState = 'hidden' | 'opening' | 'visible' | 'closing';
const GA_MEASUREMENT_ID = 'G-ZVZD226ZME';
const CLOSE_ANIMATION_MS = 320;
const OPEN_ANIMATION_DELAY_MS = 16;

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>('unknown');
  const [bannerState, setBannerState] = useState<PopupState>('hidden');
  const [revokeState, setRevokeState] = useState<PopupState>('hidden');
  const [preferencesMode, setPreferencesMode] = useState<'actions' | 'confirmation'>('actions');
  const [preferencesAction, setPreferencesAction] = useState<'accept' | 'revoke' | null>(null);
  const [ready, setReady] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const bannerCloseTimerRef = useRef<number | null>(null);
  const revokeCloseTimerRef = useRef<number | null>(null);
  const bannerOpenTimerRef = useRef<number | null>(null);
  const revokeOpenTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent');
    if (!stored) {
      // First visit — show main banner
      setBannerState('opening');
      bannerOpenTimerRef.current = window.setTimeout(() => {
        setBannerState('visible');
        bannerOpenTimerRef.current = null;
      }, OPEN_ANIMATION_DELAY_MS);
      setConsent('unknown');
    } else if (stored === 'granted') {
      setConsent('granted');
    } else {
      // Treat denied and legacy revoked as denied.
      setConsent('denied');
    }
    setReady(true);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
      if (bannerCloseTimerRef.current) {
        window.clearTimeout(bannerCloseTimerRef.current);
      }
      if (revokeCloseTimerRef.current) {
        window.clearTimeout(revokeCloseTimerRef.current);
      }
      if (bannerOpenTimerRef.current) {
        window.clearTimeout(bannerOpenTimerRef.current);
      }
      if (revokeOpenTimerRef.current) {
        window.clearTimeout(revokeOpenTimerRef.current);
      }
    };
  }, []);

  const beginRevokeOpen = () => {
    if (revokeOpenTimerRef.current) {
      window.clearTimeout(revokeOpenTimerRef.current);
    }
    if (revokeCloseTimerRef.current) {
      window.clearTimeout(revokeCloseTimerRef.current);
    }
    setRevokeState('opening');
    revokeOpenTimerRef.current = window.setTimeout(() => {
      setRevokeState('visible');
      revokeOpenTimerRef.current = null;
    }, OPEN_ANIMATION_DELAY_MS);
  };

  const beginBannerClose = () => {
    if (bannerCloseTimerRef.current) {
      window.clearTimeout(bannerCloseTimerRef.current);
    }
    setBannerState('closing');
    bannerCloseTimerRef.current = window.setTimeout(() => {
      setBannerState('hidden');
      bannerCloseTimerRef.current = null;
    }, CLOSE_ANIMATION_MS);
  };

  const beginRevokeClose = () => {
    if (revokeCloseTimerRef.current) {
      window.clearTimeout(revokeCloseTimerRef.current);
    }
    setRevokeState('closing');
    revokeCloseTimerRef.current = window.setTimeout(() => {
      setRevokeState('hidden');
      setPreferencesMode('actions');
      setPreferencesAction(null);
      revokeCloseTimerRef.current = null;
    }, CLOSE_ANIMATION_MS);
  };

  const updateGtag = (granted: boolean) => {
    if (typeof window !== 'undefined' && window.gtag) {
      const value = granted ? 'granted' : 'denied';
      window[`ga-disable-${GA_MEASUREMENT_ID}`] = !granted;
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
    if (bannerState !== 'hidden') {
      beginBannerClose();
    }
    updateGtag(true);
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID);
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'denied');
    setConsent('denied');
    if (bannerState !== 'hidden') {
      beginBannerClose();
    }
    updateGtag(false);
  };

  const handleRevoke = () => {
    // Revocation is persisted as denied.
    localStorage.setItem('cookie_consent', 'denied');
    setConsent('denied');

    // Deny all via gtag
    updateGtag(false);

    // Clear all browser cookies
    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
    });

  };

  const handleFloatingClick = () => {
    setPreferencesMode('actions');
    setPreferencesAction(null);
    beginRevokeOpen();
  };

  const handlePreferencesAction = (action: 'accept' | 'revoke') => {
    if (action === 'accept') {
      handleAccept();
    } else {
      handleRevoke();
    }
    setPreferencesAction(action);
    setPreferencesMode('confirmation');

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      beginRevokeClose();
      closeTimerRef.current = null;
    }, 1400);
  };

  if (!ready) return null;

  const showBanner = bannerState !== 'hidden';
  const showRevoke = revokeState !== 'hidden';
  const showFloatingIcon = bannerState === 'hidden' && revokeState === 'hidden' && consent !== 'unknown';
  const popupMotionClass = (state: PopupState) =>
    `transition-all duration-300 ease-out ${
      state === 'visible' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.98]'
    }`;

  return (
    <>
      {/* Main Cookie Banner — first visit only */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pb-6 sm:pb-8 flex justify-center pointer-events-none">
          <div className={`bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 max-w-4xl w-full pointer-events-auto flex flex-col md:flex-row gap-6 items-center justify-between ${popupMotionClass(bannerState)}`}>
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

      {/* Cookie preferences panel — shown when user clicks floating icon */}
      {showRevoke && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pb-6 sm:pb-8 flex justify-center pointer-events-none">
          <div className={`bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 max-w-4xl w-full pointer-events-auto flex flex-col md:flex-row gap-6 items-center justify-between ${popupMotionClass(revokeState)}`}>
            <div className="grow">
              <div
                className={`transition-all duration-300 ${
                  preferencesMode === 'actions'
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-1 h-0 overflow-hidden'
                }`}
              >
                <h3 className="font-display font-bold text-xl uppercase mb-2">Cookie Preferences</h3>
                <p className="font-mono text-sm text-gray-700 leading-relaxed">
                  {consent === 'granted'
                    ? 'You can withdraw consent at any time. Revoking will clear cookies and disable tracking.'
                    : 'Cookie tracking is currently disabled. You can accept cookies at any time to enable analytics.'}
                </p>
              </div>
              <div
                className={`transition-all duration-300 ${
                  preferencesMode === 'confirmation'
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-1 h-0 overflow-hidden'
                }`}
              >
                <h3 className="font-display font-bold text-xl uppercase mb-2">
                  {preferencesAction === 'revoke' ? 'Consent revoked' : 'Cookies accepted'}
                </h3>
                <p className="font-mono text-sm text-gray-700 leading-relaxed">
                  {preferencesAction === 'revoke'
                    ? 'Analytics tracking is now disabled. Closing cookie settings...'
                    : 'Analytics tracking is now enabled. Closing cookie settings...'}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              {preferencesMode === 'actions' ? (
                <>
                  <button
                    onClick={() => {
                      beginRevokeClose();
                    }}
                    className="bg-background-light font-mono font-bold text-sm uppercase px-6 py-3 border-2 border-black hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handlePreferencesAction(consent === 'granted' ? 'revoke' : 'accept')}
                    className={`font-mono font-bold text-sm uppercase px-6 py-3 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${
                      consent === 'granted'
                        ? 'bg-red-600 text-white'
                        : 'bg-primary text-black'
                    }`}
                  >
                    {consent === 'granted' ? 'Revoke Consent' : 'Accept Cookies'}
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="bg-gray-200 text-gray-700 font-mono font-bold text-sm uppercase px-6 py-3 border-2 border-black cursor-not-allowed"
                >
                  Closing...
                </button>
              )}
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
