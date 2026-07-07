#!/usr/bin/env python3
"""Amazon = 3 gear picks only; rest left to Google AdSense auto ads."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAYOUT = ROOT / "src" / "app" / "layout.tsx"
RAILS = ROOT / "src" / "components" / "DesktopSideRails.tsx"
PUBLISHER = "ca-pub-8960641434315655"
META_TAG = f'        <meta name="google-adsense-account" content="{PUBLISHER}" />'


def patch_rails(text: str) -> tuple[str, bool]:
    old = "const RAIL_COUNT = 8;"
    new = "const RAIL_COUNT = 3; // one card per gear pick — rest is AdSense auto ads"
    if old in text:
        return text.replace(old, new, 1), True
    if "const RAIL_COUNT = 3;" in text:
        return text, False
    print("[warn] RAIL_COUNT anchor not found in DesktopSideRails.tsx")
    return text, False


def patch_layout(text: str) -> tuple[str, bool]:
    changed = False
    if 'name="google-adsense-account"' not in text:
        anchor = "      <head>\n        <script"
        if anchor in text:
            text = text.replace(anchor, f"      <head>\n{META_TAG}\n        <script", 1)
            changed = True
        else:
            print("[warn] layout <head> anchor not found")
    if "MONETIZATION-SPLIT" not in text:
        note = "        {/* MONETIZATION-SPLIT: Amazon 3 gear links in rails/footer; AdSense auto ads elsewhere */}\n"
        anchor = "        <DesktopSideRails />"
        if anchor in text:
            text = text.replace(anchor, note + anchor, 1)
            changed = True
    return text, changed


def main() -> int:
    ok = True

    if RAILS.is_file():
        rails_text = RAILS.read_text(encoding="utf-8")
        rails_text, rails_changed = patch_rails(rails_text)
        if rails_changed:
            RAILS.write_text(rails_text, encoding="utf-8")
            print("[done] DesktopSideRails: 8 cards/side -> 3 (one per product)")
        else:
            print("[info] DesktopSideRails already 3-product rail")
    else:
        print(f"[error] missing {RAILS}")
        ok = False

    if LAYOUT.is_file():
        layout_text = LAYOUT.read_text(encoding="utf-8")
        layout_text, layout_changed = patch_layout(layout_text)
        if layout_changed:
            LAYOUT.write_text(layout_text, encoding="utf-8")
            print("[done] layout: AdSense account meta + monetization note")
        else:
            print("[info] layout monetization split already present")
        if PUBLISHER not in layout_text:
            print("[error] AdSense publisher id missing from layout")
            ok = False
    else:
        print(f"[error] missing {LAYOUT}")
        ok = False

    print("[policy] Amazon: 3 ASINs in rails (2xl+) + footer (<2xl). AdSense: auto ads elsewhere.")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
