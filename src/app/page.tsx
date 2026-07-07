import Link from "next/link";
import { CharacterGrid } from "@/components/CharacterGrid";
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
        <div className="mx-auto grid max-w-7xl items-end gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-8">
          <div className="min-w-0">
            <p className="text-[9px] font-bold tracking-[0.32em] text-accent uppercase sm:text-[10px]">
              Street Fighter 6
            </p>
            <h1 className="mt-0.5 font-display text-xl font-black uppercase leading-none tracking-tight text-white sm:text-2xl">
              MAX <span className="text-accent">DATABASE</span>
            </h1>
            <p className="mt-1 max-w-xl text-[11px] leading-snug text-white/55 sm:text-xs">
              {siteTagline}
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 lg:flex-col lg:items-end lg:gap-2">
            <Link
              href="/tier"
              className="font-display text-2xl font-black tracking-tight text-white transition hover:text-accent sm:text-3xl"
              translate="no"
            >
              キャラランク →
            </Link>
            <Link
              href="/matchups"
              className="font-display text-2xl font-black tracking-tight text-accent transition hover:text-white sm:text-3xl"
              translate="no"
            >
              キャラ相性 →
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-1 bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-5">
          <div className="min-w-0 space-y-8">
            <section id="roster">
              <CharacterGrid mode="classic" characters={roster} hideHeader />
            </section>

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
