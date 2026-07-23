#!/usr/bin/env python3
"""Strengthen on-site SEO for Search Console (Python-driven).

- Refresh sitemap lastModified
- Enrich character page title/description/OG image
- Add default OG image on root layout
- Crawl local pages and write meta audit
Does not push. Does not touch Cloudflare.
"""
from __future__ import annotations

import re
import urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITEMAP = ROOT / "src" / "app" / "sitemap.ts"
CHAR_PAGE = ROOT / "src" / "app" / "characters" / "[slug]" / "page.tsx"
LAYOUT = ROOT / "src" / "app" / "layout.tsx"
OUT_AUDIT = ROOT / "scripts" / "seo-local-meta-audit.md"
MARKER = "SEO-STRENGTHEN-20260721"

LOCAL = "http://localhost:3000"
AUDIT_PATHS = [
    "/",
    "/characters",
    "/characters/ryu",
    "/characters/mai",
    "/characters/akuma",
    "/matchups",
    "/tier",
    "/about",
    "/robots.txt",
    "/sitemap.xml",
]


class MetaParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title = ""
        self._in_title = False
        self.metas: dict[str, str] = {}
        self.canonical = ""
        self.h1 = ""
        self._in_h1 = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        ad = {k: (v or "") for k, v in attrs}
        if tag == "title":
            self._in_title = True
        elif tag == "meta":
            key = ad.get("name") or ad.get("property")
            if key and "content" in ad:
                self.metas[key] = ad["content"]
        elif tag == "link" and ad.get("rel") == "canonical":
            self.canonical = ad.get("href", "")
        elif tag == "h1" and not self.h1:
            self._in_h1 = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        if tag == "h1":
            self._in_h1 = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data.strip()
        if self._in_h1 and not self.h1:
            text = data.strip()
            if text:
                self.h1 = text


def patch_sitemap() -> bool:
    text = SITEMAP.read_text(encoding="utf-8")
    today = datetime.now(timezone.utc).strftime("%Y-%m-%dT00:00:00.000Z")
    new, n = re.subn(
        r'const lastModified = new Date\("[^"]+"\);',
        f'const lastModified = new Date("{today}");',
        text,
        count=1,
    )
    if n == 0:
        new, n = re.subn(
            r"const lastModified = new Date\(\);",
            f'const lastModified = new Date("{today}");',
            text,
            count=1,
        )
    if n and new != text:
        SITEMAP.write_text(new, encoding="utf-8")
        return True
    return False


def patch_character_page() -> bool:
    text = CHAR_PAGE.read_text(encoding="utf-8")
    if MARKER in text:
        return False

    old = '''  const title = isCharacterReady(slug)
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
  };'''

    new = f'''  // {MARKER}
  const title = isCharacterReady(slug)
    ? `${{character.en}} SF6 Frame Data & Hitboxes`
    : `${{character.en}} SF6 Frame Data (Coming Soon)`;
  const description = isCharacterReady(slug)
    ? `${{character.en}} Street Fighter 6 frame data and lightweight JPG hitbox images — startup, block advantage, damage. Fast mobile SF6 database.`
    : `${{character.en}} Street Fighter 6 frame data page is coming soon on SF6 MAX DATABASE.`;
  const ogImage = character.thumb
    ? [{{ url: character.thumb, width: 1200, height: 630, alt: `${{character.en}} Street Fighter 6` }}]
    : undefined;

  return {{
    title,
    description,
    alternates: {{
      canonical: `${{siteUrl}}/characters/${{slug}}`,
    }},
    openGraph: {{
      title: `${{title}} | SF6 MAX DATABASE`,
      description,
      url: `${{siteUrl}}/characters/${{slug}}`,
      images: ogImage,
      type: "article",
      locale: "en_US",
    }},
    twitter: {{
      card: "summary_large_image",
      title,
      description,
      images: character.thumb ? [character.thumb] : undefined,
    }},
  }};'''

    if old not in text:
        print("WARN: character metadata block not found exactly; skip char patch")
        return False
    CHAR_PAGE.write_text(text.replace(old, new, 1), encoding="utf-8")
    return True


def patch_layout_og() -> bool:
    text = LAYOUT.read_text(encoding="utf-8")
    if MARKER in text:
        return False
    # Insert default OG image after openGraph description if missing images
    if "openGraph:" in text and "images:" in text.split("openGraph:", 1)[1][:400]:
        return False

    needle = '''  openGraph: {
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
  },'''

    repl = f'''  openGraph: {{
    // {MARKER}
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteNameFull,
    title: siteNameFull,
    description: siteDescription,
    images: [{{ url: "/characters/ryu.jpg", width: 1200, height: 630, alt: siteNameFull }}],
  }},
  twitter: {{
    card: "summary_large_image",
    title: siteNameFull,
    description: siteDescription,
    images: ["/characters/ryu.jpg"],
  }},'''

    if needle not in text:
        print("WARN: layout openGraph block not found exactly; skip layout patch")
        return False
    LAYOUT.write_text(text.replace(needle, repl, 1), encoding="utf-8")
    return True


def audit_local() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for path in AUDIT_PATHS:
        url = f"{LOCAL}{path}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "sf6-seo-strengthen/1.0"})
            with urllib.request.urlopen(req, timeout=20) as resp:
                body = resp.read().decode("utf-8", errors="replace")
                status = str(resp.status)
        except Exception as e:  # noqa: BLE001
            rows.append({"path": path, "status": "ERR", "note": str(e)[:120]})
            continue

        if path.endswith(".txt") or path.endswith(".xml"):
            rows.append({
                "path": path,
                "status": status,
                "note": f"bytes={len(body)} head={body[:60].replace(chr(10), ' ')}",
            })
            continue

        p = MetaParser()
        p.feed(body)
        missing = []
        if not p.title:
            missing.append("title")
        if "description" not in p.metas:
            missing.append("description")
        if not p.canonical:
            missing.append("canonical")
        rows.append({
            "path": path,
            "status": status,
            "title": p.title[:80],
            "desc": p.metas.get("description", "")[:90],
            "canonical": p.canonical,
            "h1": p.h1[:60],
            "note": ("missing:" + ",".join(missing)) if missing else "ok",
        })
    return rows


def write_audit(rows: list[dict[str, str]], patches: dict[str, bool]) -> None:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        "# Local SEO meta audit",
        "",
        f"Generated: {now}",
        "",
        "## Patches applied",
        "",
        f"- sitemap lastModified: {patches.get('sitemap')}",
        f"- character OG/title: {patches.get('character')}",
        f"- layout default OG image: {patches.get('layout')}",
        "",
        "## Page checks (localhost:3000)",
        "",
    ]
    for r in rows:
        lines.append(f"### `{r['path']}` — {r['status']}")
        if r.get("title"):
            lines.append(f"- title: {r['title']}")
        if r.get("desc"):
            lines.append(f"- description: {r['desc']}")
        if r.get("canonical"):
            lines.append(f"- canonical: {r['canonical']}")
        if r.get("h1"):
            lines.append(f"- h1: {r['h1']}")
        lines.append(f"- note: {r.get('note', '')}")
        lines.append("")
    lines += [
        "## Still needs Doc (Cloudflare)",
        "",
        "Production is Cloudflare-blocked for bots. Soften Bot Fight / allow Googlebot,",
        "then resubmit sitemap in Search Console.",
        "",
    ]
    OUT_AUDIT.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    patches = {
        "sitemap": patch_sitemap(),
        "character": patch_character_page(),
        "layout": patch_layout_og(),
    }
    print("PATCHES", patches)
    rows = audit_local()
    write_audit(rows, patches)
    ok = sum(1 for r in rows if r["status"] in {"200", "ok"} or r["status"] == "200")
    # status is numeric string
    ok = sum(1 for r in rows if r["status"] == "200")
    print(f"AUDIT ok={ok}/{len(rows)}")
    print(f"WROTE {OUT_AUDIT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
