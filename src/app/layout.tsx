import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteDescription, siteDomain, siteName, siteNameFull, siteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { DesktopSideRails } from "@/components/DesktopSideRails";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteNameFull,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteNameFull,
    title: siteNameFull,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteNameFull,
    description: siteDescription,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8960641434315655"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* DESKTOP-SIDE-RAILS */}
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteNameFull,
              url: siteUrl,
              description: siteDescription,
            }),
          }}
        />
        <DesktopSideRails />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
