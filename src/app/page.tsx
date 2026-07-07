import { CharacterGrid } from "@/components/CharacterGrid";
import { HomeMetaLinks } from "@/components/HomeMetaLinks";
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
        <div className="mx-auto grid max-w-7xl items-center gap-2.5 px-4 py-2 sm:px-6 sm:py-2.5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,19rem)] lg:gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,21rem)] xl:gap-5">
          <div className="min-w-0">
            <p className="text-[9px] font-bold tracking-[0.32em] text-accent uppercase sm:text-[10px]">
              Street Fighter 6
            </p>
            <h1
              id="page-top"
              className="mt-0.5 font-display text-xl font-black uppercase leading-none tracking-tight text-white sm:text-2xl"
            >
              MAX <span className="text-accent">DATABASE</span>
            </h1>
            <p className="mt-1 max-w-xl text-[11px] leading-snug text-white/55 sm:text-xs">
              {siteTagline}
            </p>
          </div>

          <div className="min-w-0 lg:px-1">
            <HomeMetaSummary />
          </div>

          <div className="min-w-0 lg:justify-self-end">
            <HomeMetaLinks />
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
