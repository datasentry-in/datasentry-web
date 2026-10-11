import CookieConsent from '@/modules/web/components/CookieConsent';

/**
 * The marketing site, datasentry.in/*. A route group, so it adds no URL
 * segment; it exists to give the site its own chrome (the cookie banner)
 * without the product under /app inheriting it.
 */
export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieConsent />
    </>
  );
}
