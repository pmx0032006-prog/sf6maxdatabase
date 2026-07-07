#!/usr/bin/env python3
"""Phase 1: dense Amazon side rails until AdSense goes live. AdSense code stays in place."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAILS = ROOT / "src" / "components" / "DesktopSideRails.tsx"
LAYOUT = ROOT / "src" / "app" / "layout.tsx"
PHASE_FILE = ROOT / "scripts" / "monetization_phase.json"
SETUP_SCRIPT = ROOT / "scripts" / "setup-fgc-gear-lineup.py"
DENSE_MARKERS = ("RAIL_HALF", "startIndex={RAIL_HALF}")
SPLIT_LINE = "const RAIL_COUNT = 3; // phase 2: one card per gear — AdSense fills the rest"


def patch_rails(text: str) -> tuple[str, bool]:
    if all(m in text for m in DENSE_MARKERS):
        return text, False
    if SETUP_SCRIPT.is_file():
        subprocess.run([sys.executable, str(SETUP_SCRIPT)], cwd=ROOT, check=False)
        return RAILS.read_text(encoding="utf-8"), True
    print("[warn] setup-fgc-gear-lineup.py missing; cannot restore split rails")
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
        print("[done] DesktopSideRails: restored split rails (no duplicate gear)")
    else:
        print("[info] DesktopSideRails already split (left/right unique)")

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
