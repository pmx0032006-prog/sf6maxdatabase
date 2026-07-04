#!/usr/bin/env python3
"""Install @vercel/analytics and add <Analytics /> to root layout."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAYOUT = ROOT / "src" / "app" / "layout.tsx"


def main() -> int:
    print(">>> npm i @vercel/analytics", flush=True)
    result = subprocess.run(
        ["npm", "i", "@vercel/analytics"],
        cwd=ROOT,
        shell=True,
    )
    if result.returncode != 0:
        return result.returncode

    text = LAYOUT.read_text(encoding="utf-8")
    if "@vercel/analytics" in text:
        print("[info] Analytics already in layout.tsx")
        return 0

    if 'import { Analytics } from "@vercel/analytics/next";' not in text:
        text = text.replace(
            'import "./globals.css";',
            'import { Analytics } from "@vercel/analytics/next";\nimport "./globals.css";',
        )

    if "<Analytics />" not in text:
        text = text.replace(
            "        {children}\n      </body>",
            "        {children}\n        <Analytics />\n      </body>",
        )

    LAYOUT.write_text(text, encoding="utf-8")
    print("[done] layout.tsx updated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
