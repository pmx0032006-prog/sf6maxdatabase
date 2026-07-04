import { CharacterGrid } from "@/components/CharacterGrid";
import { PageMasthead } from "@/components/PageMasthead";
import { RosterIntro } from "@/components/RosterIntro";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import { siteName } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Characters",
  description: `${siteName} — frame data and hitbox images for all 30 characters`,
};

export default function CharactersPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="characters" />

      <main className="flex-1">
        <PageMasthead
          eyebrow={siteName}
          title="Characters"
          subtitle="Pick a character to view frame data and lightweight JPG hitbox images."
          showBackLink
        />
        <section className="bg-background">
          <RosterIntro />
          <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-10 sm:pb-28 sm:pt-16">
            <CharacterGrid
              title="Roster"
              subtitle="All 30 characters — tap for frame data"
              mode="classic"
              characters={roster}
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
