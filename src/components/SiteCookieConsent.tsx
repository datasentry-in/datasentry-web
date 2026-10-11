'use client';

import { usePathname } from 'next/navigation';
import CookieConsent from './CookieConsent';

/**
 * The /demo console is a product mock shown in review sessions. The marketing
 * cookie banner would sit on top of the screens being reviewed, so it is held
 * back there and rendered everywhere else unchanged.
 */
export default function SiteCookieConsent() {
  const pathname = usePathname();
  if (pathname?.startsWith('/demo')) return null;
  return <CookieConsent />;
}
