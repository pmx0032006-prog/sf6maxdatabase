#!/usr/bin/env python3
"""Character grid: single-line names, adaptive size, translate=no — keep faces visible."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GRID = ROOT / "src" / "components" / "CharacterGrid.tsx"
CSS = ROOT / "src" / "app" / "globals.css"
PUSH = ROOT / "scripts" / "push_to_github.py"

GRID_TSX = '''import Link from "next/link";
import type { Character } from "@/data/characters";

type CharacterGridProps = {
  title?: string;
  subtitle?: string;
  mode: "classic" | "modern";
  characters: Character[];
  hideHeader?: boolean;
};

const modeStyles = {
  classic: {
    section: "border-accent",
    grid: "gap-3 lg:gap-4",
    cell: "rounded-xl bg-surface/90 shadow-[inset_0_0_0_1px_rgba(221,230,224,0.9)]",
    badge: "text-[8px] font-bold tracking-[0.2em] text-white/85 sm:text-[9px]",
    name: "font-display font-bold leading-none tracking-[0.04em]",
  },
  modern: {
    section: "border-accent-mint/80",
    grid: "gap-2.5 lg:gap-3",
    cell: "rounded-lg bg-[#eef8f2]/90 shadow-[inset_0_0_0_1px_rgba(0,179,104,0.14)]",
    badge: "text-[8px] font-bold tracking-[0.18em] text-white/85 sm:text-[9px]",
    name: "font-mono font-semibold leading-none tracking-[0.06em]",
  },
} as const;

function charNameSizeClass(label: string) {
  const len = [...label].length;
  if (len <= 4) return "text-lg sm:text-xl";
  if (len <= 6) return "text-base sm:text-lg";
  if (len <= 8) return "text-sm sm:text-base";
  return "text-xs sm:text-sm";
}

export function CharacterGrid({
  title = "Roster",
  subtitle = "Pick a character for frame data and hitbox images",
  mode,
  characters,
  hideHeader = false,
}: CharacterGridProps) {
  const styles = modeStyles[mode];

  return (
    <section className={hideHeader ? "" : "space-y-5"}>
      {!hideHeader ? (
        <div
          className={`space-y-1 border-l-4 pl-4 ${styles.section} ${
            mode === "modern" ? "border-l-[3px]" : ""
          }`}
        >
          <h2
            className={`text-sm font-semibold tracking-[0.2em] uppercase ${
              mode === "modern" ? "text-accent-mint" : "text-accent"
            }`}
          >
            {title}
          </h2>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
      ) : null}

      <ul
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${styles.grid}`}
      >
        {characters.map((character) => (
          <li key={`${mode}-${character.slug}`}>
            <Link
              href={`/characters/${character.slug}?mode=${mode}`}
              className={`char-cell group relative block overflow-hidden ${
                character.thumb
                  ? `aspect-[4/3] w-full ${
                      mode === "classic"
                        ? "rounded-xl shadow-[inset_0_0_0_1px_rgba(221,230,224,0.9)]"
                        : "rounded-lg shadow-[inset_0_0_0_1px_rgba(0,179,104,0.14)]"
                    }`
                  : styles.cell
              }`}
              translate="no"
              title={character.ja}
            >
              {character.thumb ? (
                <>
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-[inherit] bg-[#0d1210] bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${character.thumb})`,
                      backgroundPosition: "center top",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[38%] rounded-[inherit] bg-gradient-to-t from-[#0d1210]/96 via-[#0d1210]/55 to-transparent"
                  />
                  <span className="absolute left-2 top-2 z-[1] max-w-[calc(100%-1rem)] truncate rounded bg-black/50 px-1.5 py-0.5 backdrop-blur-[2px]">
                    <span className={`char-badge block truncate ${styles.badge}`}>{character.en}</span>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 z-[1] px-2 pb-2 pt-4">
                    <span
                      className={`char-name char-name-fit block w-full truncate text-center text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${styles.name} ${charNameSizeClass(character.ja)}`}
                      lang="ja"
                    >
                      {character.ja}
                    </span>
                  </span>
                </>
              ) : (
                <span className="relative z-[1] flex min-h-[5.5rem] flex-col items-center justify-center px-3 py-7 sm:min-h-[6.25rem]">
                  <span
                    className={`char-name text-foreground ${styles.name} ${charNameSizeClass(character.en)}`}
                  >
                    {character.en}
                  </span>
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
'''

CSS_SNIPPET = """
.char-name-fit {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
"""


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


def patch_css() -> None:
    text = CSS.read_text(encoding="utf-8")
    if ".char-name-fit" not in text:
        marker = ".char-cell:has(.text-white.char-name) .char-name {"
        if marker in text:
            text = text.replace(marker, CSS_SNIPPET + marker, 1)
        else:
            text += CSS_SNIPPET
        CSS.write_text(text, encoding="utf-8")


def main() -> int:
    GRID.write_text(GRID_TSX, encoding="utf-8")
    patch_css()
    print("[done] character grid names: single-line + adaptive size")

    git(
        "add",
        "src/components/CharacterGrid.tsx",
        "src/app/globals.css",
        "scripts/patch-char-grid-name-wrap.py",
    )
    commit = git("commit", "-m", "Fix roster card name wrap hiding character faces")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
