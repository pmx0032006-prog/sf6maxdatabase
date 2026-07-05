#!/usr/bin/env python3
"""Step-by-step internal link SEO patches for SF6 MAX DATABASE."""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAR_PAGE = ROOT / "src" / "app" / "characters" / "[slug]" / "page.tsx"
RELATED_COMPONENT = ROOT / "src" / "components" / "character" / "CharacterRelatedLinks.tsx"
MARKER_BACKBAR = "INTERNAL-LINKS-BACKBAR"
MARKER_RELATED = "INTERNAL-LINKS-RELATED"

BACKBAR_OLD = """function BackBar() {
  return (
    <div className="border-b border-white/10 bg-[#0a0f0c]">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-3 sm:px-5 lg:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.28em] text-white/50 hover:text-accent"
        >
          <span aria-hidden>←</span>
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}"""

BACKBAR_NEW = """function BackBar() {
  return (
    <div className="border-b border-white/10 bg-[#0a0f0c]">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-3 sm:px-5 lg:px-6">
        <nav
          aria-label="Character page navigation"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold tracking-[0.28em] text-white/50"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:text-accent"
          >
            <span aria-hidden>←</span>
            SF6 MAX DATABASE Home
          </Link>
          <Link href="/characters" className="hover:text-accent">
            SF6 Character List
          </Link>
        </nav>
      </div>
    </div>
  );
}"""

RELATED_COMPONENT_TSX = """import Link from "next/link";
import { roster } from "@/data/characters";

type CharacterRelatedLinksProps = {
  currentSlug: string;
  currentName: string;
};

function titleCase(name: string): string {
  return name
    .split(/[\\s.]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function pickRelatedSlugs(currentSlug: string, count = 4): string[] {
  const index = roster.findIndex((character) => character.slug === currentSlug);
  if (index < 0) {
    return roster.slice(0, count).map((character) => character.slug);
  }

  const picks: string[] = [];
  for (let offset = 1; picks.length < count && offset < roster.length; offset += 1) {
    const slug = roster[(index + offset) % roster.length].slug;
    if (slug !== currentSlug) {
      picks.push(slug);
    }
  }
  return picks;
}

export function CharacterRelatedLinks({
  currentSlug,
  currentName,
}: CharacterRelatedLinksProps) {
  const related = pickRelatedSlugs(currentSlug)
    .map((slug) => roster.find((character) => character.slug === slug))
    .filter((character): character is (typeof roster)[number] => Boolean(character));

  return (
    <section className="border-t border-white/10 bg-[#0a0f0c]">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-8 sm:px-5 lg:px-6">
        <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">
          More SF6 Frame Data
        </p>
        <h2 className="mt-2 font-display text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
          Related Characters
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {related.map((character) => (
            <li key={character.slug}>
              <Link
                href={`/characters/${character.slug}`}
                className="inline-flex rounded border border-white/10 bg-surface px-3 py-2 text-[11px] font-bold tracking-wide text-white/75 hover:border-accent/50 hover:text-accent"
              >
                {titleCase(character.en)} SF6 Frame Data
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-white/45">
          Browse all {titleCase(currentName)} matchups from the{" "}
          <Link href="/characters" className="text-accent hover:text-accent-hover">
            SF6 character list
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
"""

RELATED_IMPORT = 'import { CharacterRelatedLinks } from "@/components/character/CharacterRelatedLinks";\n'
RELATED_USAGE = """
        <CharacterRelatedLinks currentSlug={slug} currentName={character.en} />
"""


def read_char_page() -> str:
    if not CHAR_PAGE.is_file():
        raise FileNotFoundError(f"missing {CHAR_PAGE}")
    return CHAR_PAGE.read_text(encoding="utf-8")


def write_char_page(text: str) -> None:
    CHAR_PAGE.write_text(text, encoding="utf-8")
    print(f"[done] updated {CHAR_PAGE.relative_to(ROOT)}")


def step_backbar() -> bool:
    text = read_char_page()
    if MARKER_BACKBAR in text or BACKBAR_NEW in text:
        print("[info] BackBar internal links already present")
        return False

    if BACKBAR_OLD not in text:
        print("[error] BackBar block not found; manual merge needed")
        return False

    text = text.replace(BACKBAR_OLD, BACKBAR_NEW, 1)
    if MARKER_BACKBAR not in text:
        text = text.replace(
            'export const dynamic = "force-dynamic";',
            f'export const dynamic = "force-dynamic"; // {MARKER_BACKBAR}\n',
            1,
        )
    write_char_page(text)
    print("[done] step 1: BackBar links -> Home + SF6 Character List")
    return True


def step_related() -> bool:
    changed = False
    text = read_char_page()

    if not RELATED_COMPONENT.is_file():
        RELATED_COMPONENT.parent.mkdir(parents=True, exist_ok=True)
        RELATED_COMPONENT.write_text(RELATED_COMPONENT_TSX, encoding="utf-8")
        print(f"[done] created {RELATED_COMPONENT.relative_to(ROOT)}")
        changed = True
    else:
        print("[info] CharacterRelatedLinks component already present")

    if RELATED_IMPORT.strip() not in text:
        text = text.replace(
            'import { SiteFooter } from "@/components/SiteFooter";\n',
            f'{RELATED_IMPORT}import {{ SiteFooter }} from "@/components/SiteFooter";\n',
            1,
        )
        changed = True

    if "<CharacterRelatedLinks" not in text:
        anchor = "      </main>\n\n      <SiteFooter />"
        replacement = f"      </main>{RELATED_USAGE}\n      <SiteFooter />"
        if anchor not in text:
            print("[error] main/footer anchor not found for related links")
            return changed
        text = text.replace(anchor, replacement, 1)
        changed = True

    if MARKER_RELATED not in text:
        text = text.replace(
            f"// {MARKER_BACKBAR}",
            f"// {MARKER_BACKBAR}\n// {MARKER_RELATED}",
            1,
        )

    if changed:
        write_char_page(text)
        print("[done] step 2: related character links on detail pages")
    else:
        print("[info] related links already wired on character page")

    return changed


def main() -> int:
    parser = argparse.ArgumentParser(description="Apply internal link SEO patches.")
    parser.add_argument(
        "--step",
        type=int,
        choices=(1, 2, 0),
        default=1,
        help="1=BackBar, 2=Related links, 0=all remaining steps",
    )
    args = parser.parse_args()

    if args.step in (1, 0):
        step_backbar()
    if args.step in (2, 0):
        step_related()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
