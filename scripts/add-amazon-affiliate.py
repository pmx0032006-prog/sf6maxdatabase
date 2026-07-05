#!/usr/bin/env python3
"""Add Amazon affiliate disclosure + SF6 link to About page."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ABOUT = ROOT / "src" / "app" / "about" / "page.tsx"
MARKER = 'id: "affiliate"'
AFFILIATE_URL = "https://www.amazon.com/dp/B0BPJRGNSD?tag=sf6maxdatabas-20"

SECTION = """
  {
    id: "affiliate",
    title: "Affiliate Disclosure",
    body: [
      "Some links are affiliate links.",
    ],
  },
"""

LINK_BLOCK = """
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
"""


def main() -> int:
    if not ABOUT.is_file():
        print(f"[error] missing {ABOUT}")
        return 1

    text = ABOUT.read_text(encoding="utf-8")
    if MARKER in text:
        print("[info] affiliate section already present")
        return 0

    anchor = "  },\n] as const;"
    if anchor not in text:
        print("[error] could not find sections array anchor")
        return 1
    text = text.replace(anchor, f"  }},{SECTION}] as const;", 1)

    flex_anchor = '<div className="flex flex-wrap gap-4 border-t border-border/80 pt-8">'
    if flex_anchor not in text:
        print("[error] could not find footer links anchor")
        return 1
    text = text.replace(flex_anchor, f"{LINK_BLOCK}\n\n            {flex_anchor}", 1)

    ABOUT.write_text(text, encoding="utf-8")
    print(f"[done] updated {ABOUT.relative_to(ROOT)}")
    print(f"[link] {AFFILIATE_URL}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
