import Link from "next/link";
import { HitboxColorLegend } from "@/components/character/HitboxColorLegend";
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
      "We use lightweight JPG stills so low-spec phones load hitboxes fast — no heavy GIF downloads.",
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
    id: "hitbox-colors",
    title: "Hitbox Colors",
    body: [
      "Each JPG still uses the standard Street Fighter 6 hitbox color coding. Red boxes are where the move can hit; green is where the character can be hit.",
      "Use this legend when checking a move between rounds — same colors as community frame databases.",
    ],
    legend: true,
  },
  {
    id: "read",
    title: "How to Read the Data",
    items: [
      {
        term: "St (Startup)",
        anchor: "startup",
        desc: "Frames from your input until the move becomes active. Lower St means a faster button.",
      },
      {
        term: "Bk (Advantage)",
        anchor: "advantage",
        desc: "Block advantage on guard — positive (+) means you recover first; negative (−) means your opponent does.",
      },
      {
        term: "DMG & columns",
        desc: "Damage and other frame-table fields shown on each move row.",
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
    id: "coverage",
    title: "What You Get",
    body: [
      "All 30 roster fighters with move-by-move frame numbers and JPG hitbox stills.",
      "St, Bk, damage, cancels, and move notes — laid out for quick mid-match lookup.",
      "Multi-frame moves (_1, _2, _3 …) and expanded detail on every character page.",
      "We keep shipping fixes and roster updates as SF6 evolves.",
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
  {
    id: "affiliate",
    title: "Affiliate Disclosure",
    body: [
      "Some links are affiliate links.",
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
                        id={"anchor" in item ? item.anchor : undefined}
                        className="grid scroll-mt-24 gap-1 px-4 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-5 sm:py-4"
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
                {"legend" in section && section.legend ? (
                  <HitboxColorLegend variant="full" />
                ) : null}
              </article>
            ))}

            
            <article id="affiliate-link" className="space-y-3">
              <p className="text-sm leading-relaxed text-muted sm:text-base">
                <a
                  href="https://www.amazon.com/dp/B0BPJRGNSD?tag=sf6maxdatabas-20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent hover:text-accent-hover"
                >
                  Street Fighter 6 (PS5) on Amazon
                </a>
              </p>
            </article>


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
