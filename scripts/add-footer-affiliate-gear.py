#!/usr/bin/env python3
"""Add compact Recommended Gear affiliate strip to SiteFooter (Step A)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FOOTER = ROOT / "src" / "components" / "SiteFooter.tsx"
GEAR = ROOT / "src" / "components" / "AffiliateGearStrip.tsx"
TAG = "sf6maxdatabas-20"
MARKER = "AFFILIATE-GEAR-STRIP"

GEAR_TSX = f'''import Link from "next/link";

const GEAR_LINKS = [
  {{
    label: "Street Fighter 6 (PS5)",
    href: "https://www.amazon.com/dp/B0BPJRGNSD?tag={TAG}",
  }},
  {{
    label: "8BitDo Arcade Stick",
    href: "https://www.amazon.com/dp/B0BX8N6F5K?tag={TAG}",
  }},
] as const;

export function AffiliateGearStrip() {{
  return (
    <section
      aria-label="Recommended gear"
      className="mx-auto mt-8 max-w-2xl rounded-lg border border-border/60 bg-surface/40 px-4 py-5"
    >
      <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">
        Recommended Gear
      </p>
      <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
        {{GEAR_LINKS.map((item) => (
          <li key={{item.href}}>
            <a
              href={{item.href}}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-sm font-semibold text-accent hover:text-accent-hover"
            >
              {{item.label}} on Amazon →
            </a>
          </li>
        ))}}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-muted/80">
        Affiliate links — we may earn a commission at no extra cost to you.{" "}
        <Link href="/about#affiliate" className="text-accent hover:text-accent-hover">
          Disclosure
        </Link>
      </p>
    </section>
  );
}}
'''

FOOTER_IMPORT = 'import { AffiliateGearStrip } from "@/components/AffiliateGearStrip";\n'
FOOTER_INSERT_ANCHOR = """        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/characters" className="text-accent hover:text-accent-hover">
            Character roster →
          </Link>"""

FOOTER_INSERT_BLOCK = """        <AffiliateGearStrip />
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/characters" className="text-accent hover:text-accent-hover">
            Character roster →
          </Link>"""


def main() -> int:
    if not GEAR.is_file():
        GEAR.write_text(GEAR_TSX, encoding="utf-8")
        print(f"[done] created {GEAR.relative_to(ROOT)}")
    else:
        print("[info] AffiliateGearStrip already present")

    if not FOOTER.is_file():
        print(f"[error] missing {FOOTER}")
        return 1

    text = FOOTER.read_text(encoding="utf-8")
    if MARKER in text or "AffiliateGearStrip" in text:
        print("[info] SiteFooter gear strip already wired")
        return 0

    if FOOTER_IMPORT.strip() not in text:
        text = text.replace(
            'import Link from "next/link";\n',
            f'import Link from "next/link";\n{FOOTER_IMPORT}',
            1,
        )

    if FOOTER_INSERT_ANCHOR not in text:
        print("[error] SiteFooter anchor not found")
        return 1

    text = text.replace(FOOTER_INSERT_ANCHOR, FOOTER_INSERT_BLOCK, 1)
    if MARKER not in text:
        text = text.replace(
            '<footer className="border-t border-border/80 bg-background">',
            f'<footer className="border-t border-border/80 bg-background">\n      {{/* {MARKER} */}}',
            1,
        )

    FOOTER.write_text(text, encoding="utf-8")
    print(f"[done] updated {FOOTER.relative_to(ROOT)}")
    print("[info] 2 Amazon affiliate links in footer (SF6 + Arcade Stick)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
