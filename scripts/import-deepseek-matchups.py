#!/usr/bin/env python3
"""Parse DeepSeek diagram matchups from desktop raw text and apply to site."""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW_DESKTOP = Path(r"C:\Users\pmx00\Desktop\deepseek_matchups_raw.txt")
RAW_COPY = ROOT / "scripts" / "deepseek_matchups_raw.txt"
SNAPSHOT = ROOT / "scripts" / "character_meta_snapshot.json"
META_TS = ROOT / "src" / "data" / "character-meta.ts"
MATCHUPS_PAGE = ROOT / "src" / "app" / "matchups" / "page.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

TIER_ORDER = ("S+", "S", "A", "B", "C")

EN_TO_SLUG: dict[str, str] = {
    "Mai": "mai",
    "Blanka": "blanka",
    "JP": "jp",
    "Ryu": "ryu",
    "Ed": "ed",
    "Akuma": "akuma",
    "M.Bison": "m-bison",
    "Luke": "luke",
    "Elena": "elena",
    "Cammy": "cammy",
    "Rashid": "rashid",
    "Terry": "terry",
    "Guile": "guile",
    "Chun-Li": "chun-li",
    "C.Viper": "c-viper",
    "Ken": "ken",
    "Sagat": "sagat",
    "A.K.I.": "aki",
    "Dee Jay": "dee-jay",
    "Juri": "juri",
    "Kimberly": "kimberly",
    "Zangief": "zangief",
    "Dhalsim": "dhalsim",
    "E.Honda": "e-honda",
    "Jamie": "jamie",
    "Manon": "manon",
    "Marisa": "marisa",
    "Lily": "lily",
    "Alex": "alex",
    "Ingrid": "ingrid",
}

JA_TO_SLUG: dict[str, str] = {
    "舞": "mai",
    "ブランカ": "blanka",
    "JP": "jp",
    "リュウ": "ryu",
    "エド": "ed",
    "豪鬼": "akuma",
    "ベガ": "m-bison",
    "ルーク": "luke",
    "エレナ": "elena",
    "キャミィ": "cammy",
    "ラシード": "rashid",
    "テリー": "terry",
    "ガイル": "guile",
    "春麗": "chun-li",
    "C.バイパー": "c-viper",
    "ケン": "ken",
    "サガット": "sagat",
    "エイキ": "aki",
    "DJ": "dee-jay",
    "ジュリ": "juri",
    "キンバリー": "kimberly",
    "ザンギエフ": "zangief",
    "ダルシム": "dhalsim",
    "本田": "e-honda",
    "ジェイミー": "jamie",
    "マノン": "manon",
    "マリーザ": "marisa",
    "リリー": "lily",
    "アレックス": "alex",
    "イングリッド": "ingrid",
}

SECTION_RE = re.compile(r"^■\s+.+?（([^）]+)）")
RATIO_RE = re.compile(r"^[\*?]?(\d)[-:−](\d)[\*]?$")


def normalize_ratio(raw: str) -> tuple[str, bool]:
    text = raw.strip().replace("：", "-").replace("−", "-").replace(":", "-")
    tentative = "*" in raw or "?" in raw
    m = RATIO_RE.match(text.replace("*", ""))
    if not m:
        return "5-5", True
    return f"{m.group(1)}-{m.group(2)}", tentative


def slug_from_en(name: str) -> str | None:
    name = name.strip()
    return EN_TO_SLUG.get(name)


def slug_from_ja(name: str) -> str | None:
    name = name.strip()
    return JA_TO_SLUG.get(name)


def parse_raw(text: str) -> tuple[dict[str, dict[str, str]], dict[str, dict[str, str]]]:
    matchups: dict[str, dict[str, str]] = {}
    notes: dict[str, dict[str, str]] = {}
    row_slug: str | None = None
    row_count = 0
    full_section = False

    for line in text.splitlines():
        section = SECTION_RE.match(line.strip())
        if section:
            en = section.group(1).strip()
            new_slug = slug_from_en(en)
            if not new_slug:
                continue
            is_full = "全30" in line
            if new_slug in matchups and not is_full:
                row_slug = new_slug
                row_count = len(matchups[new_slug])
                full_section = False
                continue
            if new_slug in matchups and is_full and row_count >= 25:
                row_slug = new_slug
                matchups[new_slug] = {}
                notes[new_slug] = {}
                full_section = True
                row_count = 0
                continue
            row_slug = new_slug
            full_section = is_full
            row_count = 0
            if row_slug not in matchups:
                matchups[row_slug] = {}
                notes[row_slug] = {}
            continue

        if not row_slug or "\t" not in line:
            continue
        parts = [p.strip() for p in line.split("\t") if p.strip()]
        if len(parts) < 2 or parts[0] == "対戦キャラ":
            continue
        col_slug = slug_from_ja(parts[0])
        if not col_slug or col_slug == row_slug:
            continue
        ratio, tentative = normalize_ratio(parts[1])
        note = parts[2] if len(parts) > 2 else ""
        if tentative and "暫定" not in note and "データ" not in note:
            note = (note + "（暫定）").strip("（）") + "（暫定）" if note else "暫定"
        matchups[row_slug][col_slug] = ratio
        if note:
            notes[row_slug][col_slug] = note
        row_count += 1

    return matchups, notes


def meta_ts(data: dict, notes: dict[str, dict[str, str]]) -> str:
    tiers = data["tiers"]
    core = data["matchup_core"]
    matchups = data["matchups"]
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


MATCHUPS_PAGE_TSX = '''import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import {
  MATCHUP_CORE,
  MATCHUP_NOTES,
  MATCHUPS,
  META_DISCLAIMER,
  META_UPDATED,
  type MatchupRatio,
} from "@/data/character-meta";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Character Affinity | ${siteName}`,
  description: "Full-roster SF6 character affinity diagram — win-rate style ratios, not match results.",
  alternates: { canonical: `${siteUrl}/matchups` },
};

function ratioClass(ratio: MatchupRatio): string {
  const left = Number(ratio.split("-")[0] ?? 5);
  if (left >= 7) return "bg-emerald-500/20 text-emerald-700";
  if (left === 6) return "bg-accent/15 text-accent";
  if (left === 5) return "bg-surface text-muted";
  if (left === 4) return "bg-orange-500/15 text-orange-700";
  return "bg-red-500/15 text-red-700";
}

export default function MatchupsPage() {
  const coreChars = MATCHUP_CORE.map((slug) => roster.find((c) => c.slug === slug)).filter(
    (c): c is (typeof roster)[number] => Boolean(c),
  );

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="matchups" />

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">Meta</p>
          <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl" translate="no">
            キャラクター相性表
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            縦のキャラが横のキャラに対してどれだけ有利か（ダイヤグラム方式）。セルにカーソルを合わせると一言メモが出ます。
          </p>
          <p className="mt-1 text-xs text-muted/80">
            更新: {META_UPDATED} — {META_DISCLAIMER}
          </p>
          <p className="mt-2 text-xs text-muted">
            <span translate="no">7-3</span> かなり有利 / <span translate="no">6-4</span> やや有利 / <span translate="no">5-5</span> 互角 / <span translate="no">4-6</span> やや不利 / <span translate="no">3-7</span> かなり不利
          </p>
          <p className="mt-1 text-xs text-muted/80">
            上ほど強キャラ・下ほど弱キャラ（ティア順）。全30キャラ（イングリッドまで）。
          </p>

          <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
            <table className="min-w-full border-collapse text-center text-[10px] sm:text-xs">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="sticky left-0 z-10 bg-background px-2 py-2 text-left font-bold" translate="no">
                    相手 →
                  </th>
                  {coreChars.map((col) => (
                    <th key={col.slug} className="min-w-[2.5rem] px-1 py-2 font-bold">
                      <Link
                        href={`/characters/${col.slug}`}
                        className="hover:text-accent"
                        translate="no"
                        lang="ja"
                        title={col.en}
                      >
                        {col.ja}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coreChars.map((row) => (
                  <tr key={row.slug} className="border-b border-border/70 last:border-0">
                    <th className="sticky left-0 z-10 bg-surface px-2 py-2 text-left font-bold">
                      <Link
                        href={`/characters/${row.slug}`}
                        className="hover:text-accent"
                        translate="no"
                        lang="ja"
                        title={row.en}
                      >
                        {row.ja}
                      </Link>
                    </th>
                    {coreChars.map((col) => {
                      if (row.slug === col.slug) {
                        return (
                          <td key={col.slug} className="px-1 py-2 text-muted">
                            —
                          </td>
                        );
                      }
                      const ratio = MATCHUPS[row.slug]?.[col.slug] ?? ("5-5" as MatchupRatio);
                      const note = MATCHUP_NOTES[row.slug]?.[col.slug];
                      return (
                        <td key={col.slug} className="px-1 py-2">
                          <span
                            className={`inline-block min-w-[2.25rem] rounded px-1 py-0.5 font-bold ${ratioClass(ratio)}`}
                            title={note}
                            translate="no"
                          >
                            {ratio}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/tier" className="font-semibold text-accent hover:text-accent-hover">
              ← キャラクターランク
            </Link>
            <Link href="/" className="font-semibold text-muted hover:text-accent">
              ロスターへ戻る
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
'''


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
    src = RAW_DESKTOP if RAW_DESKTOP.is_file() else RAW_COPY
    if not src.is_file():
        print("[error] deepseek_matchups_raw.txt not found", file=sys.stderr)
        return 1

    text = src.read_text(encoding="utf-8")
    RAW_COPY.write_text(text, encoding="utf-8")

    matchups, notes = parse_raw(text)
    expected_rows = 30
    if len(matchups) < expected_rows:
        print(f"[warn] parsed {len(matchups)} row chars, expected {expected_rows}", file=sys.stderr)

    snap = json.loads(SNAPSHOT.read_text(encoding="utf-8"))
    core = list(snap["matchup_core"])
    for row in core:
        if row not in matchups:
            matchups[row] = {}
            notes[row] = {}
        for col in core:
            if row == col:
                continue
            if col not in matchups[row]:
                matchups[row][col] = "5-5"
            if col not in notes[row]:
                notes[row][col] = "暫定"

    snap["matchups"] = {row: {col: matchups[row][col] for col in core if col != row} for row in core}
    snap["matchup_notes"] = {row: {col: notes[row].get(col, "") for col in core if col != row} for row in core}
    SNAPSHOT.write_text(json.dumps(snap, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    META_TS.write_text(meta_ts(snap, snap["matchup_notes"]), encoding="utf-8")
    MATCHUPS_PAGE.write_text(MATCHUPS_PAGE_TSX, encoding="utf-8")

    filled = sum(len(snap["matchups"][r]) for r in core)
    print(f"[done] diagram matchups: {len(matchups)} rows, {filled} cells, notes attached")

    git(
        "add",
        "scripts/deepseek_matchups_raw.txt",
        "scripts/import-deepseek-matchups.py",
        "scripts/character_meta_snapshot.json",
        "src/data/character-meta.ts",
        "src/app/matchups/page.tsx",
        "scripts/meta-loop-tick.py",
    )
    commit = git("commit", "-m", "Import DeepSeek 30x30 diagram matchups with notes")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
