#!/usr/bin/env python3
"""Phase 1: dense Amazon side rails until AdSense goes live. AdSense code stays in place."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAILS = ROOT / "src" / "components" / "DesktopSideRails.tsx"
LAYOUT = ROOT / "src" / "app" / "layout.tsx"
PHASE_FILE = ROOT / "scripts" / "monetization_phase.json"
DENSE_LINE = "const RAIL_COUNT = 8; // phase 1: dense Amazon rails until AdSense is live"
SPLIT_LINE = "const RAIL_COUNT = 3; // phase 2: one card per gear — AdSense fills the rest"


def patch_rails(text: str) -> tuple[str, bool]:
    if DENSE_LINE.split(";")[0] in text:
        return text, False
    for old in (SPLIT_LINE, "const RAIL_COUNT = 3; // one card per gear pick — rest is AdSense auto ads", "const RAIL_COUNT = 8;"):
        if old in text:
            return text.replace(old, DENSE_LINE, 1), True
    print("[warn] RAIL_COUNT anchor not found")
    return text, False


def patch_layout_note(text: str) -> tuple[str, bool]:
    old = "        {/* MONETIZATION-SPLIT: Amazon 3 gear links in rails/footer; AdSense auto ads elsewhere */}\n"
    new = "        {/* MONETIZATION-PHASE-1: dense Amazon rails (2xl+). AdSense auto ads after approval. */}\n"
    if new in text:
        return text, False
    if old in text:
        return text.replace(old, new, 1), True
    if "MONETIZATION-PHASE" not in text:
        anchor = "        <DesktopSideRails />"
        if anchor in text:
            return text.replace(anchor, new + anchor, 1), True
    return text, False


def main() -> int:
    if not RAILS.is_file():
        print(f"[error] missing {RAILS}")
        return 1

    rails_text = RAILS.read_text(encoding="utf-8")
    rails_text, rails_changed = patch_rails(rails_text)
    if rails_changed:
        RAILS.write_text(rails_text, encoding="utf-8")
        print("[done] DesktopSideRails: restored 8 cards/side (dense Amazon)")
    else:
        print("[info] DesktopSideRails already dense (8/side)")

    if LAYOUT.is_file():
        layout_text = LAYOUT.read_text(encoding="utf-8")
        layout_text, note_changed = patch_layout_note(layout_text)
        if note_changed:
            LAYOUT.write_text(layout_text, encoding="utf-8")
            print("[done] layout note -> phase 1")

    PHASE_FILE.write_text(
        json.dumps({"phase": "amazon_dense", "adsense": "wait_for_notification"}, indent=2) + "\n",
        encoding="utf-8",
    )
    print("[phase] amazon_dense — AdSense snippet kept; switch after approval email")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
