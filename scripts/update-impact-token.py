#!/usr/bin/env python3
"""Replace Impact verification token in layout.tsx."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAYOUT = ROOT / "src" / "app" / "layout.tsx"
NEW = "08c2c446-59ee-435e-837a-a8ea1b8f375d"


def main() -> int:
    text = LAYOUT.read_text(encoding="utf-8")
    updated, n = re.subn(
        r"(impact-site-verification[^>]*(?:value|content)=['\"])([0-9a-f-]+)(['\"])",
        rf"\g<1>{NEW}\g<3>",
        text,
        flags=re.I,
    )
    if n == 0:
        # insert both forms if missing
        needle = "      <head>\n"
        insert = (
            "      <head>\n"
            f"        <meta name='impact-site-verification' value='{NEW}' />\n"
            f'        <meta name="impact-site-verification" content="{NEW}" />\n'
        )
        if needle not in text:
            print("[error] head not found")
            return 1
        updated = text.replace(needle, insert, 1)
        n = 2
    LAYOUT.write_text(updated, encoding="utf-8")
    print(f"[done] impact token -> {NEW} (replacements≈{n})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
