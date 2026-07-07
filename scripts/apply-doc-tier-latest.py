#!/usr/bin/env python3
"""Apply Doc-edited latest tier list (S+ support) and refresh matchups order."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOC_TIER = ROOT / "scripts" / "doc_tier_2026-07.json"
SNAPSHOT = ROOT / "scripts" / "character_meta_snapshot.json"
META_TS = ROOT / "src" / "data" / "character-meta.ts"
TIER_PAGE = ROOT / "src" / "app" / "tier" / "page.tsx"
TIER_BAND = ROOT / "src" / "components" / "TierBand.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

TIER_ORDER = ("S+", "S", "A", "B", "C")

DOC_TIERS = {
    "S+": ["mai"],
    "S": ["blanka", "jp", "ryu", "ed", "akuma"],
    "A": ["m-bison", "luke", "elena", "cammy", "rashid", "terry", "guile", "chun-li", "c-viper", "ken"],
    "B": ["sagat", "aki", "dee-jay", "juri", "kimberly", "zangief", "dhalsim", "e-honda"],
    "C": ["jamie", "manon", "marisa", "lily", "alex", "ingrid"],
}

ROSTER = {s for t in DOC_TIERS.values() for s in t}


def tier_index(slug: str, tiers: dict[str, list[str]]) -> tuple[int, int]:
    for i, tier in enumerate(TIER_ORDER):
        bucket = tiers.get(tier, [])
        if slug in bucket:
            return i, bucket.index(slug)
    return 99, 99


def sort_core(tiers: dict[str, list[str]]) -> list[str]:
    return sorted(ROSTER, key=lambda s: tier_index(s, tiers))


def default_rating(row: str, col: str, tiers: dict[str, list[str]]) -> str:
    diff = tier_index(col, tiers)[0] - tier_index(row, tiers)[0]
    if diff == 0:
        return "="
    if diff == 1:
        return "+"
    if diff >= 2:
        return "++"
    if diff == -1:
        return "-"
    return "--"


def build_matchups(tiers: dict[str, list[str]], seed: dict[str, dict[str, str]]) -> dict[str, dict[str, str]]:
    slugs = sort_core(tiers)
    full: dict[str, dict[str, str]] = {}
    for row in slugs:
        row_map = dict(seed.get(row, {}))
        for col in slugs:
            if row == col:
                continue
            if col not in row_map:
                row_map[col] = default_rating(row, col, tiers)
        full[row] = {col: row_map[col] for col in slugs if col != row}
    return full


def meta_ts(data: dict) -> str:
    tiers = data["tiers"]
    core = data["matchup_core"]
    matchups = data["matchups"]
    lines = [
        f'export const META_UPDATED = "{data["updated"]}" as const;',
        "export const META_DISCLAIMER =",
        '  "Community snapshot — not official Capcom data. Tiers and matchups may be outdated." as const;',
        "",
        'export type Tier = "S+" | "S" | "A" | "B" | "C";',
        'export type MatchupRating = "++" | "+" | "=" | "-" | "--";',
        "",
        'export const TIER_ORDER = ["S+", "S", "A", "B", "C"] as const satisfies readonly Tier[];',
        "",
        "export const TIERS = {",
    ]
    for tier in TIER_ORDER:
        slugs = ", ".join(f'"{s}"' for s in tiers[tier])
        lines.append(f'  "{tier}": [{slugs}],')
    lines.append("} as const satisfies Record<Tier, readonly string[]>;")
    lines.append("")
    core_line = ", ".join(f'"{s}"' for s in core)
    lines.append(f"export const MATCHUP_CORE = [{core_line}] as const;")
    lines.append("")
    lines.append("export const MATCHUP_LABELS: Record<MatchupRating, string> = {")
    lines.append('  "++": "Strong advantage",')
    lines.append('  "+": "Slight advantage",')
    lines.append('  "=": "Even",')
    lines.append('  "-": "Slight disadvantage",')
    lines.append('  "--": "Tough matchup",')
    lines.append("};")
    lines.append("")
    lines.append("export const MATCHUP_LABELS_JA: Record<MatchupRating, string> = {")
    lines.append('  "++": "かなり有利",')
    lines.append('  "+": "やや有利",')
    lines.append('  "=": "互角",')
    lines.append('  "-": "やや不利",')
    lines.append('  "--": "かなり不利",')
    lines.append("};")
    lines.append("")
    lines.append("export const MATCHUPS: Record<string, Record<string, MatchupRating>> = {")
    for row, cols in matchups.items():
        inner = ", ".join(f'"{k}": "{v}"' for k, v in cols.items())
        lines.append(f'  "{row}": {{ {inner} }},')
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


TIER_PAGE_PATCH = '''          <p className="mt-1 text-xs text-muted/80">
            各ティアは左ほど強い → 右ほど弱い。更新: {META_UPDATED} — {META_DISCLAIMER}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {TIER_ORDER.map((tier) => (
              <div
                key={tier}
                className={`rounded-lg border bg-surface p-4 shadow-sm ${
                  tier === "S+" ? "border-amber-400/60 sm:col-span-2" : "border-border"
                }`}
              >
                <p
                  className={`text-lg font-black ${tier === "S+" ? "text-amber-600" : "text-foreground"}`}
                  translate="no"
                >
                  ティア {tier}
                </p>'''


def patch_tier_page() -> None:
    text = TIER_PAGE.read_text(encoding="utf-8")
    old = '''          <p className="mt-1 text-xs text-muted/80">
            更新: {META_UPDATED} — {META_DISCLAIMER}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {TIER_ORDER.map((tier) => (
              <div key={tier} className="rounded-lg border border-border bg-surface p-4 shadow-sm">
                <p className="text-lg font-black text-foreground" translate="no">
                  ティア {tier}
                </p>'''
    if old in text:
        text = text.replace(old, TIER_PAGE_PATCH, 1)
        TIER_PAGE.write_text(text, encoding="utf-8")


def patch_tier_band() -> None:
    text = TIER_BAND.read_text(encoding="utf-8")
    if '"S+"' in text:
        return
    text = text.replace(
        "const TIER_STYLES: Record<string, string> = {\n  S:",
        'const TIER_STYLES: Record<string, string> = {\n  "S+": "border-yellow-300/60 bg-yellow-400/15 text-yellow-100",\n  S:',
    )
    text = text.replace(
        '<p className="text-[10px] font-black tracking-[0.2em]">TIER {tier}</p>',
        '<p className="text-[10px] font-black tracking-[0.2em]">TIER {tier === "S+" ? "S+" : tier}</p>',
    )
    TIER_BAND.write_text(text, encoding="utf-8")


def git_env() -> dict[str, str]:
    env = os.environ.copy()
    env.setdefault("GIT_AUTHOR_NAME", "pmx0032006-prog")
    env.setdefault("GIT_AUTHOR_EMAIL", "pmx0032006@gmail.com")
    env.setdefault("GIT_COMMITTER_NAME", "pmx0032006-prog")
    env.setdefault("GIT_COMMITTER_EMAIL", "pmx0032006@gmail.com")
    return env


def git(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        cwd=ROOT,
        env=git_env(),
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="replace",
    )


def main() -> int:
    if len(ROSTER) != 30:
        print(f"[error] expected 30 chars, got {len(ROSTER)}", file=sys.stderr)
        return 1

    doc_payload = {
        "updated": "2026-07",
        "source_note": "Community snapshot — not official Capcom data.",
        "editor": "Doc + DeepSeek baseline",
        "tiers": DOC_TIERS,
    }
    DOC_TIER.write_text(json.dumps(doc_payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    snap = json.loads(SNAPSHOT.read_text(encoding="utf-8"))
    seed = snap.get("matchups", {})
    snap["updated"] = "2026-07"
    snap["tiers"] = DOC_TIERS
    snap["matchup_core"] = sort_core(DOC_TIERS)
    snap["matchups"] = build_matchups(DOC_TIERS, seed)
    SNAPSHOT.write_text(json.dumps(snap, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    META_TS.write_text(meta_ts(snap), encoding="utf-8")
    patch_tier_page()
    patch_tier_band()

    print("[done] Doc tier applied: S+ mai, S blanka>jp>ryu>ed>akuma, A bison...ken")

    git(
        "add",
        "scripts/doc_tier_2026-07.json",
        "scripts/character_meta_snapshot.json",
        "src/data/character-meta.ts",
        "src/app/tier/page.tsx",
        "src/components/TierBand.tsx",
        "scripts/apply-doc-tier-latest.py",
        "scripts/meta-loop-tick.py",
        "scripts/sort-matchup-core-by-tier.py",
        "scripts/expand-full-roster-matchups.py",
    )
    commit = git("commit", "-m", "Apply Doc latest tier list with S+ tier and matchup resort")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
