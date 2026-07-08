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

      <section className="border-b border-white/10 bg-[#0a0f0c] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-2 px-4 py-2 sm:gap-x-3 sm:px-6 sm:py-2.5 lg:flex-nowrap lg:gap-x-4">
          <h1 id="page-top" className="sr-only">
            {siteNameFull}
          </h1>
          <p className="min-w-[10rem] max-w-xs shrink-0 text-[11px] font-semibold leading-snug text-white/75 sm:max-w-sm sm:text-sm lg:max-w-md">
            {siteTagline}
          </p>
          <HomeHeroFactline />
          <div className="min-w-0 w-full sm:ml-auto sm:w-auto sm:flex-1 lg:flex-none lg:shrink-0">
            <HomeMetaSummary />
          </div>
        </div>
      </section>

      <main className="flex-1 bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-5">
          <div className="min-w-0 space-y-8">
            <section id="roster">
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
