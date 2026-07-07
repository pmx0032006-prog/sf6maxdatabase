#!/usr/bin/env python3
"""Set all Ingrid matchups: 4-5 when she is row, 5-4 when she is column."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SNAPSHOT = ROOT / "scripts" / "character_meta_snapshot.json"
META_TS = ROOT / "src" / "data" / "character-meta.ts"
PUSH = ROOT / "scripts" / "push_to_github.py"
INGRID = "ingrid"
ROW_RATIO = "4-5"
COL_RATIO = "5-4"
TIER_ORDER = ("S+", "S", "A", "B", "C")


def meta_ts(data: dict) -> str:
    tiers = data["tiers"]
    core = data["matchup_core"]
    matchups = data["matchups"]
    notes = data.get("matchup_notes", {})
    lines = [
        f'export const META_UPDATED = "{data["updated"]}" as const;',
        "export const META_DISCLAIMER =",
        '  "Community snapshot — not official Capcom data. Tiers and matchups may be outdated." as const;',
        "",
        'export type Tier = "S+" | "S" | "A" | "B" | "C";',
        'export type MatchupRatio = `${number}-${number}` | "5-5";',
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
    lines.append("export const MATCHUP_NOTES: Record<string, Record<string, string>> = {")
    for row, cols in notes.items():
        inner = ", ".join(f'"{k}": {json.dumps(v, ensure_ascii=False)}' for k, v in cols.items())
        lines.append(f'  "{row}": {{ {inner} }},')
    lines.append("};")
    lines.append("")
    lines.append("export const MATCHUPS: Record<string, Record<string, MatchupRatio>> = {")
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
    snap = json.loads(SNAPSHOT.read_text(encoding="utf-8"))
    core = list(snap["matchup_core"])
    notes = snap.setdefault("matchup_notes", {})
    matchups = snap.setdefault("matchups", {})

    for slug in core:
        if slug == INGRID:
            continue
        if INGRID not in matchups:
            matchups[INGRID] = {}
        if slug not in matchups:
            matchups[slug] = {}
        if INGRID not in notes:
            notes[INGRID] = {}
        if slug not in notes:
            notes[slug] = {}

        matchups[INGRID][slug] = ROW_RATIO
        notes[INGRID][slug] = "イングリッド弱位（ドク調整）"
        matchups[slug][INGRID] = COL_RATIO
        notes[slug][INGRID] = "イングリッド相手はやや有利"

    snap["matchups"] = matchups
    snap["matchup_notes"] = notes
    SNAPSHOT.write_text(json.dumps(snap, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    META_TS.write_text(meta_ts(snap), encoding="utf-8")

    print(f"[done] ingrid matchups: row={ROW_RATIO}, vs ingrid={COL_RATIO}")

    git(
        "add",
        "scripts/character_meta_snapshot.json",
        "src/data/character-meta.ts",
        "scripts/apply-ingrid-matchups.py",
    )
    commit = git("commit", "-m", "Set Ingrid matchups to 4-5 disadvantage per Doc")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
