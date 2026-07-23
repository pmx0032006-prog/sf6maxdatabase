#!/usr/bin/env python3
"""Search Console SEO audit for SF6 MAX DATABASE.

Checks local expected URLs vs live sitemap/robots, writes a GSC action list.
Does not push or change site code.
"""
from __future__ import annotations

import json
import re
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SITE_TS = ROOT / "src" / "lib" / "site.ts"
CHARS_TS = ROOT / "src" / "data" / "characters.ts"
OUT_MD = ROOT / "scripts" / "seo-gsc-checklist.md"
OUT_JSON = ROOT / "scripts" / "seo-gsc-audit.json"

SITE_URL_RE = re.compile(r'export const siteUrl = "([^"]+)"')
SLUG_RE = re.compile(r'slug:\s*"([^"]+)"')


def site_url() -> str:
    text = SITE_TS.read_text(encoding="utf-8")
    m = SITE_URL_RE.search(text)
    if not m:
        raise SystemExit("siteUrl not found in site.ts")
    return m.group(1).rstrip("/")


def roster_slugs() -> list[str]:
    text = CHARS_TS.read_text(encoding="utf-8")
    # Prefer unique slug: lines in roster objects
    slugs: list[str] = []
    for m in SLUG_RE.finditer(text):
        s = m.group(1)
        if s not in slugs:
            slugs.append(s)
    return slugs


def expected_urls(base: str, slugs: list[str]) -> list[str]:
    static = ["", "/characters", "/tier", "/matchups", "/about", "/privacy"]
    urls = [f"{base}{p}" if p else base for p in static]
    urls.extend(f"{base}/characters/{s}" for s in slugs)
    return urls


def fetch(url: str, timeout: int = 15) -> tuple[int, str]:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "sf6maxdatabase-seo-audit/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            return int(resp.status), body
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace") if e.fp else ""
        return int(e.code), body
    except Exception as e:  # noqa: BLE001
        return 0, str(e)


def parse_sitemap_urls(xml_text: str) -> list[str]:
    urls: list[str] = []
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        # fallback: regex
        return re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml_text)
    # handle namespaces
    for loc in root.iter():
        if loc.tag.endswith("loc") and loc.text:
            urls.append(loc.text.strip())
    return urls


def head_ok(url: str) -> tuple[bool, int]:
    req = urllib.request.Request(
        url,
        method="HEAD",
        headers={"User-Agent": "sf6maxdatabase-seo-audit/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            return True, int(resp.status)
    except urllib.error.HTTPError as e:
        # some hosts reject HEAD; try GET lightly
        if e.code in (405, 403):
            code, _ = fetch(url, timeout=12)
            return 200 <= code < 400, code
        return False, int(e.code)
    except Exception:
        code, _ = fetch(url, timeout=12)
        return 200 <= code < 400, code


def main() -> int:
    base = site_url()
    slugs = roster_slugs()
    expected = expected_urls(base, slugs)

    robots_url = f"{base}/robots.txt"
    sitemap_url = f"{base}/sitemap.xml"

    robots_status, robots_body = fetch(robots_url)
    sm_status, sm_body = fetch(sitemap_url)
    live_urls = parse_sitemap_urls(sm_body) if sm_status == 200 else []

    expected_set = set(expected)
    live_set = set(live_urls)
    missing_in_live = sorted(expected_set - live_set)
    extra_in_live = sorted(live_set - expected_set)

    # Spot-check key pages
    sample = [
        base,
        f"{base}/characters",
        f"{base}/characters/ryu",
        f"{base}/matchups",
        f"{base}/tier",
        f"{base}/about",
    ]
    sample_results = []
    for u in sample:
        ok, code = head_ok(u)
        sample_results.append({"url": u, "ok": ok, "status": code})

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    report = {
        "generated_at": now,
        "site_url": base,
        "roster_count": len(slugs),
        "expected_url_count": len(expected),
        "robots": {
            "url": robots_url,
            "status": robots_status,
            "mentions_sitemap": "sitemap" in robots_body.lower(),
            "snippet": robots_body[:400],
        },
        "sitemap": {
            "url": sitemap_url,
            "status": sm_status,
            "live_url_count": len(live_urls),
            "missing_vs_expected": missing_in_live,
            "extra_vs_expected": extra_in_live,
        },
        "sample_pages": sample_results,
        "all_expected_urls": expected,
    }
    OUT_JSON.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    lines = [
        "# Search Console SEO Checklist",
        "",
        f"Generated: {now}",
        f"Site: {base}",
        "",
        "## Auto audit",
        "",
        f"- Roster characters: **{len(slugs)}**",
        f"- Expected indexable URLs: **{len(expected)}**",
        f"- Live robots.txt: **{robots_status}** (sitemap mentioned: {report['robots']['mentions_sitemap']})",
        f"- Live sitemap.xml: **{sm_status}** (urls: {len(live_urls)})",
        f"- Missing from live sitemap: **{len(missing_in_live)}**",
        f"- Extra in live sitemap: **{len(extra_in_live)}**",
        "",
        "### Sample page checks",
        "",
    ]
    for row in sample_results:
        mark = "OK" if row["ok"] else "FAIL"
        lines.append(f"- [{mark}] `{row['url']}` → {row['status']}")

    lines += [
        "",
        "## Doc: do this in Google Search Console",
        "",
        "1. Open property for `https://www.sf6maxdatabase.com` (www preferred).",
        "2. Sitemaps → add/resubmit: `https://www.sf6maxdatabase.com/sitemap.xml`",
        "3. URL Inspection → request indexing for these priority pages first:",
        "",
    ]
    priority = [
        base,
        f"{base}/characters",
        f"{base}/matchups",
        f"{base}/tier",
        f"{base}/characters/ryu",
        f"{base}/characters/mai",
        f"{base}/characters/akuma",
        f"{base}/characters/ingrid",
    ]
    for u in priority:
        lines.append(f"   - {u}")

    lines += [
        "",
        "4. Pages report → check “Crawled - currently not indexed” and “Discovered - currently not indexed”.",
        "5. After 48h, re-run: `python scripts/seo-gsc-audit.py`",
        "",
        "## Full expected URL list",
        "",
    ]
    for u in expected:
        lines.append(f"- {u}")

    if missing_in_live:
        lines += ["", "## Missing from live sitemap", ""]
        for u in missing_in_live:
            lines.append(f"- {u}")

    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"site={base}")
    print(f"expected={len(expected)} live_sitemap={len(live_urls)} missing={len(missing_in_live)}")
    print(f"robots={robots_status} sitemap={sm_status}")
    print(f"WROTE {OUT_MD.relative_to(ROOT)}")
    print(f"WROTE {OUT_JSON.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
