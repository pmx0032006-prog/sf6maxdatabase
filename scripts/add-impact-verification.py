#!/usr/bin/env python3
"""Insert Impact site verification meta tag into root layout <head>."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAYOUT = ROOT / "src" / "app" / "layout.tsx"
MARKER = "impact-site-verification"
TAG = (
    '<meta name="impact-site-verification" '
    'content="3e22c3d0-b35a-419f-b3f4-efc54540e266" />'
)
# Impact UI showed value= ; Next/HTML meta commonly uses content=.
# Emit both attributes via the content= form Impact accepts on crawl,
# plus keep the exact name they specified.
ALT = (
    "<meta name='impact-site-verification' "
    "value='3e22c3d0-b35a-419f-b3f4-efc54540e266' />"
)


def main() -> int:
    text = LAYOUT.read_text(encoding="utf-8")
    if MARKER in text:
        print("[info] impact verification already present")
        return 0

    needle = '      <head>\n        <meta name="google-adsense-account"'
    # Prefer Impact's exact attribute spelling from the modal (value=)
    insert = f"      <head>\n        {ALT}\n        <meta name=\"google-adsense-account\""
    if needle not in text:
        print("[error] head insertion point not found")
        return 1

    LAYOUT.write_text(text.replace(needle, insert, 1), encoding="utf-8")
    print(f"[done] inserted Impact meta into {LAYOUT.relative_to(ROOT)}")
    print(ALT)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
