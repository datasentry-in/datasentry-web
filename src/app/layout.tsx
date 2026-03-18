import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataSentry — Trust, Risk & Compliance Advisory",
  description: "DataSentry helps organizations navigate information security, privacy, and regulatory frameworks with clarity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Space+Grotesk:wght@300;400;500;600;700&family=Montserrat:wght@700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="bg-[#F5F5F5] font-[Space_Grotesk] text-gray-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
