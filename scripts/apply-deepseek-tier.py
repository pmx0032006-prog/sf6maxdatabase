#!/usr/bin/env python3
"""Apply DeepSeek tier research to character_meta_snapshot.json."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEEPSEEK = ROOT / "scripts" / "deepseek_tier_2026-07.json"
SNAPSHOT = ROOT / "scripts" / "character_meta_snapshot.json"
META_TS = ROOT / "src" / "data" / "character-meta.ts"
PUSH = ROOT / "scripts" / "push_to_github.py"

TIER_ORDER = ("S", "A", "B", "C")
ROSTER = {
    "ryu", "ken", "luke", "jamie", "manon", "kimberly", "marisa", "lily", "jp", "juri",
    "cammy", "guile", "chun-li", "blanka", "dhalsim", "e-honda", "dee-jay", "zangief",
    "aki", "ed", "rashid", "akuma", "elena", "terry", "mai", "sagat", "c-viper", "alex",
    "m-bison", "ingrid",
}


def sort_core(tiers: dict[str, list[str]], core: list[str]) -> list[str]:
    def rank(slug: str) -> tuple[int, int]:
        for ti, tier in enumerate(TIER_ORDER):
            if slug in tiers[tier]:
                return ti, tiers[tier].index(slug)
        return 99, 99

    return sorted(core, key=rank)


def validate_tiers(tiers: dict[str, list[str]]) -> None:
    seen: set[str] = set()
    for tier in TIER_ORDER:
        for slug in tiers.get(tier, []):
            if slug not in ROSTER:
                raise ValueError(f"unknown slug: {slug}")
            if slug in seen:
                raise ValueError(f"duplicate slug: {slug}")
            seen.add(slug)
    missing = ROSTER - seen
    if missing:
        raise ValueError(f"missing slugs: {sorted(missing)}")


def meta_ts(data: dict) -> str:
    tiers = data["tiers"]
    core = data["matchup_core"]
    matchups = data["matchups"]
    lines = [
        f'export const META_UPDATED = "{data["updated"]}" as const;',
        "export const META_DISCLAIMER =",
        '  "Community snapshot — not official Capcom data. Tiers and matchups may be outdated." as const;',
        "",
        'export type Tier = "S" | "A" | "B" | "C";',
        'export type MatchupRating = "++" | "+" | "=" | "-" | "--";',
        "",
        'export const TIER_ORDER = ["S", "A", "B", "C"] as const satisfies readonly Tier[];',
        "",
        "export const TIERS = {",
    ]
    for tier in TIER_ORDER:
        slugs = ", ".join(f'"{s}"' for s in tiers[tier])
        lines.append(f"  {tier}: [{slugs}],")
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
    ds = json.loads(DEEPSEEK.read_text(encoding="utf-8"))
    snap = json.loads(SNAPSHOT.read_text(encoding="utf-8"))
    tiers = ds["tiers"]
    validate_tiers(tiers)

    snap["updated"] = ds["updated"]
    snap["source_note"] = ds["source_note"]
    snap["tiers"] = tiers
    snap["matchup_core"] = sort_core(tiers, snap["matchup_core"])

    SNAPSHOT.write_text(json.dumps(snap, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    META_TS.write_text(meta_ts(snap), encoding="utf-8")

    s = len(tiers["S"])
    print(f"[done] DeepSeek tiers applied: S={s} chars, Jamie/Manon in C, Luke/Juri down from old list")

    git(
        "add",
        "scripts/deepseek_tier_2026-07.json",
        "scripts/character_meta_snapshot.json",
        "src/data/character-meta.ts",
        "scripts/apply-deepseek-tier.py",
    )
    commit = git("commit", "-m", "Apply DeepSeek community tier list snapshot for 2026-07")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
