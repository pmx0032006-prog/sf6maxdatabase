#!/usr/bin/env python3
"""Audit Amazon affiliate tags in SF6 MAX DATABASE source.

Expected store tag: sf6maxdatabas-20
Scans src/ (and key config) for amazon URLs, tag= params, and gearHref usage.
Writes JSON + Markdown reports under scripts/.
"""
from __future__ import annotations

import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent.parent
EXPECTED_TAG = "sf6maxdatabas-20"
SCAN_DIRS = [ROOT / "src", ROOT / "public"]
EXTRA_FILES = [
    ROOT / "package.json",
    ROOT / "next.config.ts",
    ROOT / "next.config.js",
    ROOT / "next.config.mjs",
]
SKIP_DIR_NAMES = {".git", "node_modules", ".next", "_trash", "dist", "out"}
TEXT_SUFFIXES = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".md",
    ".mdx",
    ".html",
    ".css",
    ".txt",
    ".env",
    ".yml",
    ".yaml",
}

# Full amazon URLs and common short forms
URL_RE = re.compile(
    r"""(?P<url>https?://(?:www\.)?(?:amazon\.[a-z.]+|amzn\.to|a\.co)/[^\s"'`<>)\]]+)""",
    re.I,
)
# Bare tag= in source (including template strings)
TAG_ASSIGN_RE = re.compile(
    r"""(?:AFFILIATE_TAG\s*=\s*["']([^"']+)["'])|(?:[?&]tag=([A-Za-z0-9_-]+))|(?:tag=\{?["']([A-Za-z0-9_-]+)["']\}?)""",
    re.I,
)
ASIN_RE = re.compile(r"/dp/([A-Z0-9]{10})", re.I)
GEAR_HREF_RE = re.compile(r"gearHref\s*\(")


def iter_files() -> list[Path]:
    files: list[Path] = []
    for base in SCAN_DIRS:
        if not base.exists():
            continue
        for path in base.rglob("*"):
            if not path.is_file():
                continue
            if any(part in SKIP_DIR_NAMES for part in path.parts):
                continue
            if path.suffix.lower() not in TEXT_SUFFIXES and path.name not in {
                ".env",
                ".env.local",
                ".env.production",
            }:
                continue
            files.append(path)
    for path in EXTRA_FILES:
        if path.is_file():
            files.append(path)
    # de-dupe
    return sorted(set(files), key=lambda p: str(p).lower())


def normalize_url(raw: str) -> str:
    # Do not strip "}" — needed for JS template urls like ?tag=${AFFILIATE_TAG}
    return raw.rstrip(".,);>'\"")


def extract_tag_from_url(url: str) -> str | None:
    # Template: ...?tag=${AFFILIATE_TAG}
    if re.search(r"[?&]tag=\$\{AFFILIATE_TAG\}?", url):
        return EXPECTED_TAG
    if re.search(r"[?&]tag=\$\{[^}]*\}?", url):
        return None
    try:
        qs = parse_qs(urlparse(url).query)
    except Exception:
        return None
    vals = qs.get("tag") or qs.get("AssociateTag")
    if not vals:
        return None
    raw = vals[0]
    if "AFFILIATE_TAG" in raw:
        return EXPECTED_TAG
    return raw


def main() -> int:
    files = iter_files()
    findings: list[dict] = []
    tags_found: Counter[str] = Counter()
    urls_ok = 0
    urls_bad_tag = 0
    urls_missing_tag = 0
    short_links = 0
    gear_href_uses = 0
    affiliate_tag_const: str | None = None

    for path in files:
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            findings.append(
                {
                    "severity": "read_error",
                    "file": str(path.relative_to(ROOT)).replace("\\", "/"),
                    "detail": str(exc),
                }
            )
            continue

        rel = str(path.relative_to(ROOT)).replace("\\", "/")

        if "AFFILIATE_TAG" in text:
            m = re.search(r'AFFILIATE_TAG\s*=\s*["\']([^"\']+)["\']', text)
            if m:
                affiliate_tag_const = m.group(1)
                tags_found[m.group(1)] += 1
                severity = "ok" if m.group(1) == EXPECTED_TAG else "error"
                findings.append(
                    {
                        "severity": severity,
                        "kind": "AFFILIATE_TAG_const",
                        "file": rel,
                        "tag": m.group(1),
                        "detail": f'AFFILIATE_TAG = "{m.group(1)}"',
                    }
                )

        gear_href_uses += len(GEAR_HREF_RE.findall(text))

        for m in URL_RE.finditer(text):
            url = normalize_url(m.group("url"))
            line = text.count("\n", 0, m.start()) + 1
            host = urlparse(url).netloc.lower()
            asin_m = ASIN_RE.search(url)
            asin = asin_m.group(1).upper() if asin_m else None
            tag = extract_tag_from_url(url)

            if "amzn.to" in host or host.endswith("a.co"):
                short_links += 1
                findings.append(
                    {
                        "severity": "warn",
                        "kind": "short_link",
                        "file": rel,
                        "line": line,
                        "url": url,
                        "detail": "Short link — tag not visible in source",
                    }
                )
                continue

            if tag is None:
                urls_missing_tag += 1
                findings.append(
                    {
                        "severity": "error",
                        "kind": "missing_tag",
                        "file": rel,
                        "line": line,
                        "url": url,
                        "asin": asin,
                        "detail": "Amazon URL without ?tag=",
                    }
                )
            elif tag != EXPECTED_TAG:
                urls_bad_tag += 1
                tags_found[tag] += 1
                findings.append(
                    {
                        "severity": "error",
                        "kind": "wrong_tag",
                        "file": rel,
                        "line": line,
                        "url": url,
                        "asin": asin,
                        "tag": tag,
                        "detail": f'Expected "{EXPECTED_TAG}", found "{tag}"',
                    }
                )
            else:
                urls_ok += 1
                tags_found[tag] += 1
                findings.append(
                    {
                        "severity": "ok",
                        "kind": "tagged_url",
                        "file": rel,
                        "line": line,
                        "url": url,
                        "asin": asin,
                        "tag": tag,
                    }
                )

        # Hardcoded tag= not already captured via full URL (e.g. broken splits)
        for m in re.finditer(r"[?&]tag=([A-Za-z0-9_-]+)", text):
            tag = m.group(1)
            # skip if this match sits inside a URL we already logged
            window = text[max(0, m.start() - 80) : m.end()]
            if "amazon." in window.lower() or "amzn.to" in window.lower():
                continue
            tags_found[tag] += 1
            if tag != EXPECTED_TAG:
                line = text.count("\n", 0, m.start()) + 1
                findings.append(
                    {
                        "severity": "warn",
                        "kind": "orphan_tag_param",
                        "file": rel,
                        "line": line,
                        "tag": tag,
                        "detail": "tag= found outside clear amazon URL context",
                    }
                )

    errors = [f for f in findings if f["severity"] == "error"]
    warns = [f for f in findings if f["severity"] == "warn"]
    oks = [f for f in findings if f["severity"] == "ok"]

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "expected_tag": EXPECTED_TAG,
        "affiliate_tag_const": affiliate_tag_const,
        "files_scanned": len(files),
        "summary": {
            "urls_ok": urls_ok,
            "urls_wrong_tag": urls_bad_tag,
            "urls_missing_tag": urls_missing_tag,
            "short_links": short_links,
            "gearHref_call_sites": gear_href_uses,
            "errors": len(errors),
            "warnings": len(warns),
            "ok_items": len(oks),
            "pass": len(errors) == 0
            and affiliate_tag_const == EXPECTED_TAG
            and short_links == 0,
        },
        "tags_counter": dict(tags_found),
        "errors": errors,
        "warnings": warns,
        "ok_sample": oks[:30],
        "all_ok_count": len(oks),
    }

    out_json = ROOT / "scripts" / "amazon-tag-audit.json"
    out_md = ROOT / "scripts" / "amazon-tag-audit.md"
    out_json.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    lines = [
        "# Amazon Affiliate Tag Audit",
        "",
        f"- Generated (UTC): `{report['generated_at']}`",
        f"- Expected tag: `{EXPECTED_TAG}`",
        f"- `AFFILIATE_TAG` const: `{affiliate_tag_const}`",
        f"- Files scanned: **{len(files)}**",
        f"- gearHref() call sites: **{gear_href_uses}**",
        "",
        "## Summary",
        "",
        f"| Metric | Count |",
        f"|--------|------:|",
        f"| URLs with correct tag | {urls_ok} |",
        f"| Wrong tag | {urls_bad_tag} |",
        f"| Missing tag | {urls_missing_tag} |",
        f"| Short links | {short_links} |",
        f"| Errors | {len(errors)} |",
        f"| Warnings | {len(warns)} |",
        f"| **PASS** | {'YES' if report['summary']['pass'] else 'NO'} |",
        "",
        "## Tags seen",
        "",
    ]
    if tags_found:
        for tag, n in tags_found.most_common():
            mark = "OK" if tag == EXPECTED_TAG else "CHECK"
            lines.append(f"- `{tag}` × {n} ({mark})")
    else:
        lines.append("- (none)")

    lines += ["", "## Errors", ""]
    if errors:
        for f in errors:
            lines.append(
                f"- **{f.get('kind')}** `{f['file']}`"
                + (f":{f['line']}" if "line" in f else "")
                + f" — {f.get('detail', '')}"
            )
            if f.get("url"):
                lines.append(f"  - `{f['url']}`")
    else:
        lines.append("- None")

    lines += ["", "## Warnings", ""]
    if warns:
        for f in warns:
            lines.append(
                f"- **{f.get('kind')}** `{f['file']}`"
                + (f":{f['line']}" if "line" in f else "")
                + f" — {f.get('detail', '')}"
            )
    else:
        lines.append("- None")

    lines += [
        "",
        "## Notes",
        "",
        "- Runtime links built via `gearHref(asin)` inherit `AFFILIATE_TAG`.",
        "- This audit covers **source under `src/`** (and a few configs), not live HTML behind Cloudflare.",
        "",
    ]
    out_md.write_text("\n".join(lines), encoding="utf-8")

    print(f"[audit] files={len(files)} expected={EXPECTED_TAG}")
    print(f"[audit] AFFILIATE_TAG={affiliate_tag_const}")
    print(
        f"[audit] urls_ok={urls_ok} wrong={urls_bad_tag} missing={urls_missing_tag} short={short_links}"
    )
    print(f"[audit] gearHref_sites={gear_href_uses} errors={len(errors)} warns={len(warns)}")
    print(f"[audit] PASS={report['summary']['pass']}")
    print(f"[audit] wrote {out_json.relative_to(ROOT)}")
    print(f"[audit] wrote {out_md.relative_to(ROOT)}")
    return 0 if report["summary"]["pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
