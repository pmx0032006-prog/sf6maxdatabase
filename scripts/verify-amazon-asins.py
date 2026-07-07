#!/usr/bin/env python3
"""Verify Amazon ASINs in affiliate-gear lineup."""
from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LINEUP = ROOT / "scripts" / "affiliate_gear_lineup.json"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"


def check_asin(asin: str) -> dict:
    url = f"https://www.amazon.com/dp/{asin}"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept-Language": "en-US,en;q=0.9",
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            html = resp.read(300000).decode("utf-8", "replace")
            final_url = resp.geturl()
            status = resp.status
    except urllib.error.HTTPError as exc:
        return {"asin": asin, "ok": False, "status": exc.code, "error": str(exc)}
    except Exception as exc:  # noqa: BLE001
        return {"asin": asin, "ok": False, "status": 0, "error": str(exc)}

    bad_markers = (
        "Page Not Found",
        "Dogs of Amazon",
        "Sorry! We couldn't find that page",
        "Looking for something?",
        "Crayola Colored Pencils",
    )
    bad = any(marker in html for marker in bad_markers)
    title_match = re.search(r'id="productTitle"[^>]*>\s*([^<]+)', html)
    if not title_match:
        title_match = re.search(r'property="og:title"\s+content="([^"]+)"', html, re.I)
    if not title_match:
        title_match = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = re.sub(r"\s+", " ", title_match.group(1)).strip() if title_match else ""
    title = re.sub(r"\s*:\s*Amazon\.com.*$", "", title, flags=re.I)
    redirect_asin = asin
    redirect_match = re.search(r"/dp/([A-Z0-9]{10})", final_url)
    if redirect_match:
        redirect_asin = redirect_match.group(1)

    ok = bool(title) and not bad and status == 200
    return {
        "asin": asin,
        "ok": ok,
        "status": status,
        "title": title[:100],
        "redirect_asin": redirect_asin,
        "final_url": final_url,
        "bad_page": bad,
    }


def main() -> int:
    data = json.loads(LINEUP.read_text(encoding="utf-8"))
    results = []
    for item in data["items"]:
        row = check_asin(item["asin"])
        row["label"] = item["shortLabel"]
        results.append(row)
        mark = "OK" if row.get("ok") else "BAD"
        print(
            f"[{mark}] {item['shortLabel']}: {item['asin']} "
            f"-> redirect={row.get('redirect_asin', '?')} title={row.get('title', '')[:60]}"
        )
        if row.get("error"):
            print(f"       error: {row['error']}")

    bad = [r for r in results if not r.get("ok")]
    print(f"\nSUMMARY: {len(results) - len(bad)}/{len(results)} OK, {len(bad)} BAD")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
