import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteDescription, siteDomain, siteName, siteNameFull, siteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { BackToTop } from "@/components/BackToTop";
import { DesktopSideRails } from "@/components/DesktopSideRails";
import { JsonLd } from "@/components/JsonLd";
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
    // SEO-STRENGTHEN-20260721
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteNameFull,
    title: siteNameFull,
    description: siteDescription,
    images: [{ url: "/characters/ryu.jpg", width: 1200, height: 630, alt: siteNameFull }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteNameFull,
    description: siteDescription,
    images: ["/characters/ryu.jpg"],
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
        <meta name='impact-site-verification' value='3e22c3d0-b35a-419f-b3f4-efc54540e266' />
        <meta name="impact-site-verification" content="3e22c3d0-b35a-419f-b3f4-efc54540e266" />
        <meta name="google-adsense-account" content="ca-pub-8960641434315655" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8960641434315655"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* DESKTOP-SIDE-RAILS */}
        
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteNameFull,
            url: siteUrl,
            description: siteDescription,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteUrl}/characters?search={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
        {/* MONETIZATION-PHASE-1: dense Amazon rails (2xl+). AdSense auto ads after approval. */}
        <DesktopSideRails />
        {children}
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
