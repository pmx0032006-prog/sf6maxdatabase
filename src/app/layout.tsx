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
        {/* Impact asks for value=; React types only allow content=. Emit both via raw HTML. */}
        <meta
          name="impact-site-verification"
          content="3b3719cd-edb1-4ecd-8be3-453f8aaffff4"
          {...({ value: "3b3719cd-edb1-4ecd-8be3-453f8aaffff4" } as Record<string, string>)}
        />
<meta name="google-adsense-account" content="ca-pub-8960641434315655" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8960641434315655"
          crossOrigin="anonymous"
        />
        {/* Impact tracking verification */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7510574-5bac-44f0-88fb-5acd6161b8761.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');`,
          }}
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
        {/* MONETIZATION: Amazon rails (2xl+). AdSense = manual slots only; Auto ads stay off. */}
        <DesktopSideRails />
        {children}
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
