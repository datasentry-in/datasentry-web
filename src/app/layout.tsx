import type { Metadata } from "next";
import Script from "next/script";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataSentry - Trust, Risk & Compliance Advisory",
  description: "DataSentry helps organizations navigate information security, privacy, and regulatory frameworks with clarity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaMeasurementId = 'G-ZVZD226ZME';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Space+Grotesk:wght@300;400;500;600;700&family=Montserrat:wght@700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        suppressHydrationWarning
        className="bg-background-light font-[Space_Grotesk] text-gray-900 min-h-screen flex flex-col"
      >
        {children}
        <CookieConsent />
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              
              var consent = localStorage.getItem('cookie_consent');
              var granted = consent === 'granted';
              window['ga-disable-${gaMeasurementId}'] = !granted;
              
              // Default to denied until explicitly granted.
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });

              // Only initialize tracking when consent is granted.
              if (granted) {
                gtag('consent', 'update', {
                  'analytics_storage': 'granted',
                  'ad_storage': 'granted',
                  'ad_user_data': 'granted',
                  'ad_personalization': 'granted'
                });
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
