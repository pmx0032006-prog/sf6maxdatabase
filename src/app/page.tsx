import { CharacterGrid } from "@/components/CharacterGrid";
import { HomeHeroFactline } from "@/components/HomeHeroFactline";
import { HomeMetaSummary } from "@/components/HomeMetaSummary";
import { MetaNextSteps } from "@/components/MetaNextSteps";
import { FeaturesSection } from "@/components/FeaturesSection";
import { NewsSection } from "@/components/NewsSection";
import { HomeSidebar } from "@/components/HomeSidebar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import type { Metadata } from "next";
import { siteNameFull, siteTagline, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: siteNameFull,
  description: siteTagline,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: siteNameFull,
    description: siteTagline,
    url: siteUrl,
  },
};

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="home" />

      <section className="sticky top-[var(--site-header-h)] z-40 border-b border-white/10 bg-[#0a0f0c]/95 text-white backdrop-blur-md supports-[backdrop-filter]:bg-[#0a0f0c]/90">
        <div className="mx-auto grid max-w-7xl items-center gap-2 px-4 py-2.5 sm:px-6 sm:gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-4 lg:py-3">
          <h1 id="page-top" className="sr-only">
            {siteNameFull}
          </h1>
          <p className="min-w-0 max-w-md text-[11px] font-semibold leading-snug text-white/75 sm:text-sm">
            {siteTagline}
          </p>
          <HomeHeroFactline className="justify-self-center" />
          <div className="min-w-0 w-full justify-self-stretch sm:justify-self-end lg:w-auto lg:shrink-0">
            <HomeMetaSummary />
          </div>
        </div>
      </section>

      <main className="flex-1 bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:grid-cols-[minmax(0,1fr)_14.5rem] lg:gap-6">
          <div className="min-w-0 space-y-7">
            <section
              id="roster"
              className="rounded-xl border border-border/70 bg-surface p-3 shadow-sm sm:p-4"
            >
              <CharacterGrid mode="classic" characters={roster} hideHeader />
            </section>

            <MetaNextSteps variant="home" />

            <FeaturesSection />
            <NewsSection />
          </div>

          <HomeSidebar />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
