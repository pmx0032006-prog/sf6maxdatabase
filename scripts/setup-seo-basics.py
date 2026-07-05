#!/usr/bin/env python3
"""Add sitemap, robots, OG/canonical metadata, and richer character SEO."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE_TS = ROOT / "src" / "lib" / "site.ts"
SITEMAP = ROOT / "src" / "app" / "sitemap.ts"
ROBOTS = ROOT / "src" / "app" / "robots.ts"
LAYOUT = ROOT / "src" / "app" / "layout.tsx"
HOME = ROOT / "src" / "app" / "page.tsx"
CHAR_PAGE = ROOT / "src" / "app" / "characters" / "[slug]" / "page.tsx"
MARKER = "SEO-BASICS-APPLIED"

SITEMAP_TS = '''import type { MetadataRoute } from "next";
import { roster } from "@/data/characters";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = ["", "/characters", "/about", "/privacy"];

  const pages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const characterPages: MetadataRoute.Sitemap = roster.map((character) => ({
    url: `${siteUrl}/characters/${character.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...pages, ...characterPages];
}
'''

ROBOTS_TS = '''import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
'''

SITE_URL_LINE = 'export const siteUrl = "https://www.sf6maxdatabase.com";\n'

LAYOUT_IMPORT_OLD = "import { siteDescription, siteDomain } from \"@/lib/site\";"
LAYOUT_IMPORT_NEW = (
    "import { siteDescription, siteDomain, siteName, siteNameFull, siteUrl } from \"@/lib/site\";"
)

LAYOUT_METADATA_OLD = """export const metadata: Metadata = {
  title: {
    default: siteDomain,
    template: `%s | ${siteDomain}`,
  },
  description: siteDescription,
};"""

LAYOUT_METADATA_NEW = """export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteNameFull,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteNameFull,
    title: siteNameFull,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteNameFull,
    description: siteDescription,
  },
  alternates: {
    canonical: siteUrl,
  },
};"""

JSONLD_SNIPPET = """
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteNameFull,
              url: siteUrl,
              description: siteDescription,
            }),
          }}
        />"""

HOME_METADATA = '''import type { Metadata } from "next";
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

'''

CHAR_METADATA_OLD = """  return {
    title: character.en,
    description: isCharacterReady(slug)
      ? `${character.en} — frame data and hitbox images`
      : `${character.en} — coming soon`,
  };"""

CHAR_METADATA_NEW = """  const title = isCharacterReady(slug)
    ? `${character.en} SF6 Frame Data`
    : `${character.en} SF6 Frame Data (Coming Soon)`;
  const description = isCharacterReady(slug)
    ? `${character.en} Street Fighter 6 frame data, startup, block advantage, damage, and lightweight JPG hitbox images. Mobile-friendly SF6 database.`
    : `${character.en} Street Fighter 6 frame data page is coming soon on SF6 MAX DATABASE.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/characters/${slug}`,
    },
    openGraph: {
      title: `${title} | SF6 MAX DATABASE`,
      description,
      url: `${siteUrl}/characters/${slug}`,
    },
  };"""


def parse_roster_slugs() -> list[str]:
    text = (ROOT / "src" / "data" / "characters.ts").read_text(encoding="utf-8")
    return re.findall(r'slug:\s*"([^"]+)"', text)


def ensure_site_url(text: str) -> str:
    if "export const siteUrl" in text:
        return text
    if SITE_URL_LINE.strip() not in text:
        return text.rstrip() + "\n\n" + SITE_URL_LINE
    return text


def patch_char_import(text: str) -> str:
    needle = "import { SiteFooter } from \"@/components/SiteFooter\";"
    insert = 'import { siteUrl } from "@/lib/site";\n'
    if "siteUrl" in text:
        return text
    return text.replace(needle, insert + needle, 1)


def main() -> int:
    changed = False

    site_text = SITE_TS.read_text(encoding="utf-8")
    new_site = ensure_site_url(site_text)
    if new_site != site_text:
        SITE_TS.write_text(new_site, encoding="utf-8")
        print(f"[done] updated {SITE_TS.relative_to(ROOT)}")
        changed = True
    elif "export const siteUrl" in site_text:
        print("[info] siteUrl already present")

    if not SITEMAP.is_file() or MARKER not in SITEMAP.read_text(encoding="utf-8"):
        content = f"// {MARKER}\n{SITEMAP_TS}"
        SITEMAP.write_text(content, encoding="utf-8")
        print(f"[done] created {SITEMAP.relative_to(ROOT)}")
        changed = True
    else:
        print("[info] sitemap.ts already present")

    if not ROBOTS.is_file() or MARKER not in ROBOTS.read_text(encoding="utf-8"):
        content = f"// {MARKER}\n{ROBOTS_TS}"
        ROBOTS.write_text(content, encoding="utf-8")
        print(f"[done] created {ROBOTS.relative_to(ROOT)}")
        changed = True
    else:
        print("[info] robots.ts already present")

    layout = LAYOUT.read_text(encoding="utf-8")
    layout_new = layout
    if LAYOUT_IMPORT_OLD in layout_new:
        layout_new = layout_new.replace(LAYOUT_IMPORT_OLD, LAYOUT_IMPORT_NEW, 1)
    if LAYOUT_METADATA_OLD in layout_new:
        layout_new = layout_new.replace(LAYOUT_METADATA_OLD, LAYOUT_METADATA_NEW, 1)
    if JSONLD_SNIPPET.strip() not in layout_new:
        layout_new = layout_new.replace(
            "        {children}\n        <Analytics />",
            f"        {JSONLD_SNIPPET}\n        {{children}}\n        <Analytics />",
            1,
        )
    if layout_new != layout:
        LAYOUT.write_text(layout_new, encoding="utf-8")
        print(f"[done] updated {LAYOUT.relative_to(ROOT)}")
        changed = True
    else:
        print("[info] layout SEO already present")

    home = HOME.read_text(encoding="utf-8")
    if "export const metadata" not in home:
        home_new = home.replace(
            'import { siteTagline } from "@/lib/site";',
            HOME_METADATA.split("export const metadata")[0].strip() + "\n",
        )
        if home_new == home:
            home_new = HOME_METADATA + home
        else:
            home_new = home_new.replace(
                HOME_METADATA.split("export const metadata")[0].strip() + "\n\n",
                HOME_METADATA,
            )
        HOME.write_text(home_new, encoding="utf-8")
        print(f"[done] updated {HOME.relative_to(ROOT)}")
        changed = True
    else:
        print("[info] home metadata already present")

    char_text = CHAR_PAGE.read_text(encoding="utf-8")
    char_new = patch_char_import(char_text)
    if CHAR_METADATA_OLD in char_new:
        char_new = char_new.replace(CHAR_METADATA_OLD, CHAR_METADATA_NEW, 1)
    if char_new != char_text:
        CHAR_PAGE.write_text(char_new, encoding="utf-8")
        print(f"[done] updated {CHAR_PAGE.relative_to(ROOT)}")
        changed = True
    else:
        print("[info] character metadata already enhanced")

    slugs = parse_roster_slugs()
    print(f"[info] sitemap routes: {4 + len(slugs)} URLs ({len(slugs)} characters)")
    if not changed:
        print("[info] nothing to do")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
