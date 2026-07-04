import Link from "next/link";
import { PageMasthead } from "@/components/PageMasthead";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteName, siteNameFull } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: `${siteNameFull} — lightweight JPG hitboxes and how to read frame data`,
};

const sections = [
  {
    id: "concept",
    title: "About This Site",
    body: [
      `${siteNameFull} is a database focused on opening Street Fighter 6 frame data and hitbox images quickly on smartphones.`,
      "We use low-quality JPGs extracted from ~30k assets so low-spec devices can load move data without heavy downloads.",
    ],
  },
  {
    id: "jpg",
    title: "Why JPG Instead of GIF",
    body: [
      "Animated hitbox GIFs carry a lot of information, but they also increase page weight.",
      "This site uses still JPG images so you can check frames on mobile data or between matches.",
      "When a move has multiple frames (_1, _2, _3 …), switch them in-card or in the expanded view with ← → keys.",
    ],
  },
  {
    id: "read",
    title: "How to Read the Data",
    items: [
      {
        term: "St / Bk / DMG",
        desc: "Startup frames, block advantage, damage, and more — sourced from the Wiki frame table.",
      },
      {
        term: "_1 _2 _3 …",
        desc: "Frame sequence for the same move. Check at the bottom of the card or in expanded view.",
      },
      {
        term: "Sections",
        desc: "Standing normals, crouching normals, specials, Super Arts, and more — ordered for in-match lookup.",
      },
      {
        term: "— (dash)",
        desc: "Shown when data is unavailable or not applicable for that move.",
      },
    ],
  },
  {
    id: "source",
    title: "Data Sources",
    body: [
      "Frame numbers are based on SuperCombo Wiki (Cargo API), processed and merged for this site.",
      "Hitbox images come from a proprietary asset set (~30k extracted images).",
      "Accuracy is always improving — corrections will ship in future updates.",
    ],
  },
  {
    id: "roadmap",
    title: "Roadmap",
    body: [
      "The public site is English-first. We do not publish strategy articles — only frame data and hitbox images.",
      "Regional access and other launch details are configured at the edge (geo restrictions).",
    ],
  },
] as const;

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="about" />

      <main className="flex-1">
        <PageMasthead
          eyebrow={siteName}
          title="About"
          subtitle="Lightweight JPG × frame data — a mobile-first SF6 database"
          showBackLink
        />

        <section className="bg-background">
          <div className="mx-auto max-w-3xl space-y-14 px-4 py-12 sm:px-10 sm:py-16">
            {sections.map((section) => (
              <article key={section.id} id={section.id} className="space-y-4">
                <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {section.title}
                </h2>
                {"body" in section && section.body
                  ? section.body.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 24)}
                        className="text-sm leading-relaxed text-muted sm:text-base"
                      >
                        {paragraph}
                      </p>
                    ))
                  : null}
                {"items" in section && section.items ? (
                  <dl className="divide-y divide-border rounded-lg border border-border/80 bg-surface">
                    {section.items.map((item) => (
                      <div
                        key={item.term}
                        className="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-5 sm:py-4"
                      >
                        <dt className="text-xs font-bold tracking-wide text-accent sm:text-sm">
                          {item.term}
                        </dt>
                        <dd className="text-sm leading-relaxed text-muted">
                          {item.desc}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </article>
            ))}

            <div className="flex flex-wrap gap-4 border-t border-border/80 pt-8">
              <Link
                href="/characters"
                className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent-hover"
              >
                Character roster →
              </Link>
              <Link
                href="/"
                className="inline-flex items-center text-sm text-muted hover:text-foreground"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
