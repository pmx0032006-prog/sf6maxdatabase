import { CharacterGrid } from "@/components/CharacterGrid";
import { FeaturesSection } from "@/components/FeaturesSection";
import { NewsSection } from "@/components/NewsSection";
import { PageMasthead } from "@/components/PageMasthead";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import { siteTagline } from "@/lib/site";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="home" />

      <main className="flex-1">
        <PageMasthead
          eyebrow="Street Fighter 6"
          title="MAX"
          titleAccent="DATABASE"
          subtitle={siteTagline}
          compact
        />

        <section id="roster" className="bg-background">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-10 sm:py-5">
            <CharacterGrid
              title="Roster"
              subtitle="Pick a character for frame data and hitbox images"
              mode="classic"
              characters={roster}
            />
          </div>
        </section>

        <FeaturesSection />
        <NewsSection />
      </main>

      <SiteFooter />
    </div>
  );
}
