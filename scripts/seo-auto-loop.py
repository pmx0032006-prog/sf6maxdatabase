#!/usr/bin/env python3
"""SEO auto loop: strengthen local SEO, audit local+live, write Doc-needed gate.

Runs without pushing. Calls for Doc only when a real blocker needs human action
(Cloudflare API token missing AND live unreachable; or GSC manual steps flagged).
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SITE_TS = ROOT / "src" / "lib" / "site.ts"
CHARS_TS = ROOT / "src" / "data" / "characters.ts"
STRENGTHEN = ROOT / "scripts" / "seo-strengthen.py"
OUT_JSON = ROOT / "scripts" / "seo-auto-status.json"
OUT_MD = ROOT / "scripts" / "seo-auto-status.md"
OUT_CHECKLIST = ROOT / "scripts" / "seo-gsc-checklist.md"
LOCAL = "http://127.0.0.1:3000"

SITE_URL_RE = re.compile(r'export const siteUrl = "([^"]+)"')
SLUG_RE = re.compile(r'slug:\s*"([^"]+)"')

UAS = {
    "audit": "sf6maxdatabase-seo-audit/1.0",
    "chrome": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    ),
    "googlebot": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
}


def site_url() -> str:
    text = SITE_TS.read_text(encoding="utf-8")
    m = SITE_URL_RE.search(text)
    if not m:
        raise SystemExit("siteUrl not found")
    return m.group(1).rstrip("/")


def roster_slugs() -> list[str]:
    text = CHARS_TS.read_text(encoding="utf-8")
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


def fetch(url: str, ua: str, timeout: int = 12) -> tuple[int, str]:
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return int(resp.status), resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace") if e.fp else ""
        return int(e.code), body
    except Exception as e:  # noqa: BLE001
        return 0, str(e)


def parse_sitemap_urls(xml_text: str) -> list[str]:
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml_text)
    urls: list[str] = []
    for loc in root.iter():
        if loc.tag.endswith("loc") and loc.text:
            urls.append(loc.text.strip())
    return urls


def run_strengthen() -> dict:
    result = subprocess.run(
        [sys.executable, str(STRENGTHEN)],
        cwd=ROOT,
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="replace",
    )
    return {
        "exit": result.returncode,
        "stdout": (result.stdout or "")[-2000:],
        "stderr": (result.stderr or "")[-1000:],
    }


def main() -> int:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    base = site_url()
    slugs = roster_slugs()
    expected = expected_urls(base, slugs)
    expected_set = set(expected)

    strengthen = run_strengthen()

    # Local golden source
    local_robots = fetch(f"{LOCAL}/robots.txt", UAS["audit"])
    local_sm = fetch(f"{LOCAL}/sitemap.xml", UAS["audit"])
    local_urls = parse_sitemap_urls(local_sm[1]) if local_sm[0] == 200 else []
    local_missing = sorted(expected_set - set(local_urls))
    local_extra = sorted(set(local_urls) - expected_set)

    sample_local = ["/", "/characters", "/characters/ryu", "/matchups", "/tier", "/about"]
    local_pages = []
    for path in sample_local:
        code, _ = fetch(f"{LOCAL}{path}", UAS["audit"])
        local_pages.append({"path": path, "status": code, "ok": 200 <= code < 400})

    # Live multi-UA (may 403 from JP geo-block — expected)
    live_matrix: dict[str, dict[str, int]] = {}
    for ua_name, ua in UAS.items():
        live_matrix[ua_name] = {}
        for label, url in [
            ("robots", f"{base}/robots.txt"),
            ("sitemap", f"{base}/sitemap.xml"),
            ("home", f"{base}/"),
        ]:
            code, _ = fetch(url, ua)
            live_matrix[ua_name][label] = code

    any_live_ok = any(
        200 <= live_matrix[u][k] < 400 for u in live_matrix for k in live_matrix[u]
    )
    all_403 = all(
        live_matrix[u][k] == 403 for u in live_matrix for k in live_matrix[u]
    )

    cf_token = bool(os.environ.get("CLOUDFLARE_API_TOKEN"))
    cf_zone = bool(os.environ.get("CLOUDFLARE_ZONE_ID"))

    local_ok = (
        local_robots[0] == 200
        and local_sm[0] == 200
        and len(local_missing) == 0
        and all(p["ok"] for p in local_pages)
    )

    # Doc needed ONLY when:
    # - local SEO broken (should not happen), OR
    # - we have CF credentials and can automate but didn't, OR
    # - live is reachable and broken in a way code can fix (rare)
    # JP-geo 403 from this PC is NOT enough alone to page Doc every loop.
    doc_needed = False
    doc_reasons: list[str] = []

    if not local_ok:
        doc_needed = True
        doc_reasons.append("Local SEO/sitemap failed — fix code or start `npm run dev`.")

    if all_403 and not cf_token:
        # Soft gate: one actionable Doc item, not a hard stop every time
        doc_reasons.append(
            "Live returns 403 for all UAs from this network (likely JP geo-block / CF). "
            "Googlebot from US may still work (GSC sitemap was previously OK). "
            "To automate CF: set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ZONE_ID, or open CF once."
        )

    # Optional deferred Doc action (does not flip doc_needed by itself)
    deferred_doc = [
        "Search Console: keep requesting indexing for priority character URLs.",
        "Amazon Associates: finish Japan bank payment if red banner still shows.",
    ]

    status = {
        "generated_at": now,
        "site_url": base,
        "local_ok": local_ok,
        "any_live_ok": any_live_ok,
        "all_live_403": all_403,
        "cloudflare_env": {"token": cf_token, "zone": cf_zone},
        "doc_needed_now": doc_needed,
        "doc_reasons": doc_reasons,
        "deferred_doc_actions": deferred_doc,
        "strengthen": {
            "exit": strengthen["exit"],
            "stdout_tail": strengthen["stdout"][-500:],
        },
        "local": {
            "robots": local_robots[0],
            "sitemap": local_sm[0],
            "sitemap_count": len(local_urls),
            "expected_count": len(expected),
            "missing": local_missing,
            "extra": local_extra,
            "pages": local_pages,
        },
        "live_matrix": live_matrix,
        "hypothesis": (
            "Production 403 from this IP is consistent with Cloudflare country block "
            "(JP listed) and/or Bot Fight — not proof that Google cannot crawl."
        ),
    }

    OUT_JSON.write_text(json.dumps(status, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    lines = [
        "# SEO Auto Status",
        "",
        f"Generated: {now}",
        f"Site: {base}",
        "",
        "## Gate",
        "",
        f"- local_ok: **{local_ok}**",
        f"- any_live_ok: **{any_live_ok}**",
        f"- all_live_403: **{all_403}**",
        f"- doc_needed_now: **{doc_needed}**",
        "",
        "## Local (source of truth for this loop)",
        "",
        f"- robots.txt: {local_robots[0]}",
        f"- sitemap.xml: {local_sm[0]} ({len(local_urls)}/{len(expected)} urls)",
        f"- missing vs expected: {len(local_missing)}",
        "",
    ]
    for p in local_pages:
        mark = "OK" if p["ok"] else "FAIL"
        lines.append(f"- [{mark}] `{p['path']}` → {p['status']}")

    lines += ["", "## Live multi-UA matrix", ""]
    for ua_name, row in live_matrix.items():
        lines.append(
            f"- {ua_name}: robots={row['robots']} sitemap={row['sitemap']} home={row['home']}"
        )

    lines += ["", "## Hypothesis", "", status["hypothesis"], ""]

    if doc_reasons:
        lines += ["", "## Doc reasons (only if doc_needed_now)", ""]
        for r in doc_reasons:
            lines.append(f"- {r}")

    lines += ["", "## Deferred (not blocking auto loop)", ""]
    for r in deferred_doc:
        lines.append(f"- {r}")

    lines += [
        "",
        "## Re-run",
        "",
        "```bash",
        "python scripts/seo-auto-loop.py",
        "```",
        "",
    ]
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")

    # Keep GSC checklist updated from local expected list
    checklist = [
        "# Search Console SEO Checklist",
        "",
        f"Generated: {now}",
        f"Site: {base}",
        "",
        "## Auto (local-first)",
        "",
        f"- local_ok: **{local_ok}**",
        f"- local sitemap: **{len(local_urls)}** / expected **{len(expected)}**",
        f"- live all_403 from this network: **{all_403}**",
        "",
        "## Priority index requests (Doc / GSC when convenient)",
        "",
    ]
    for u in [
        base,
        f"{base}/characters",
        f"{base}/matchups",
        f"{base}/tier",
        f"{base}/characters/ryu",
        f"{base}/characters/mai",
        f"{base}/characters/akuma",
        f"{base}/characters/ingrid",
    ]:
        checklist.append(f"- {u}")
    checklist += ["", "## Full expected URL list", ""]
    for u in expected:
        checklist.append(f"- {u}")
    checklist.append("")
    OUT_CHECKLIST.write_text("\n".join(checklist), encoding="utf-8")

    print(f"[seo-auto] local_ok={local_ok} all_live_403={all_403} doc_needed_now={doc_needed}")
    print(f"[seo-auto] sitemap local={len(local_urls)}/{len(expected)}")
    print(f"[seo-auto] wrote {OUT_MD.relative_to(ROOT)}")
    print(f"[seo-auto] wrote {OUT_JSON.relative_to(ROOT)}")
    if strengthen["stdout"]:
        print(strengthen["stdout"].strip()[-400:])
    # Exit 0 if local OK — auto loop continues without paging Doc
    return 0 if local_ok else 2


if __name__ == "__main__":
    raise SystemExit(main())
