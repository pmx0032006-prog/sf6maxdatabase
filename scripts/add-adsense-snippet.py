#!/usr/bin/env python3
"""Add Google AdSense head snippet and ads.txt for site verification."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAYOUT = ROOT / "src" / "app" / "layout.tsx"
ADS_TXT = ROOT / "public" / "ads.txt"
PUBLISHER_ID = "ca-pub-8960641434315655"
MARKER = PUBLISHER_ID

SCRIPT_TAG = """        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8960641434315655"
          crossOrigin="anonymous"
        />"""

ADS_TXT_BODY = "google.com, pub-8960641434315655, DIRECT, f08c47fec0942fa0\n"


def patch_layout(text: str) -> str:
    if MARKER in text:
        return text

    if "<head>" not in text:
        text = text.replace(
            '    <html\n      lang="en"',
            '    <html\n      lang="en"\n    >\n      <head>\n' + SCRIPT_TAG + "\n      </head>",
            1,
        )
        # Fix double closing - actually the original has html with className on same tag
        # Re-read approach: insert head after opening html tag line

    if MARKER not in text:
        anchor = '      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}\n    >\n      <body'
        if anchor not in text:
            print("[error] could not find layout html anchor")
            return text
        text = text.replace(
            anchor,
            '      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}\n    >\n      <head>\n'
            + SCRIPT_TAG
            + "\n      </head>\n      <body",
            1,
        )
    return text


def main() -> int:
    if not LAYOUT.is_file():
        print(f"[error] missing {LAYOUT}")
        return 1

    layout_text = LAYOUT.read_text(encoding="utf-8")
    if MARKER in layout_text:
        print("[info] AdSense snippet already in layout.tsx")
    else:
        layout_text = patch_layout(layout_text)
        LAYOUT.write_text(layout_text, encoding="utf-8")
        print(f"[done] updated {LAYOUT.relative_to(ROOT)}")

    if ADS_TXT.is_file() and ADS_TXT.read_text(encoding="utf-8").strip() == ADS_TXT_BODY.strip():
        print("[info] ads.txt already present")
    else:
        ADS_TXT.write_text(ADS_TXT_BODY, encoding="utf-8")
        print(f"[done] created {ADS_TXT.relative_to(ROOT)}")

    print(f"[publisher] {PUBLISHER_ID}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
