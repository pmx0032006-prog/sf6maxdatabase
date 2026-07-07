#!/usr/bin/env python3
"""Global back-to-top button + scroll padding; tier page footer link."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAYOUT = ROOT / "src" / "app" / "layout.tsx"
GLOBALS = ROOT / "src" / "app" / "globals.css"
TIER = ROOT / "src" / "app" / "tier" / "page.tsx"
COMP = ROOT / "src" / "components" / "BackToTop.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

COMP_TSX = '''"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="back-to-top fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full border border-accent/45 bg-[#0a0f0c]/92 px-3.5 py-2 text-[11px] font-bold tracking-wide text-accent shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-accent hover:bg-accent/15 hover:text-accent-mint sm:bottom-6 sm:right-6 sm:px-4 sm:text-xs"
      aria-label="ページトップへ戻る"
    >
      <span aria-hidden className="text-sm leading-none">
        ↑
      </span>
      <span className="hidden sm:inline" translate="no">
        TOP
      </span>
    </button>
  );
}
'''

OLD_LAYOUT_IMPORT = 'import { DesktopSideRails } from "@/components/DesktopSideRails";'
NEW_LAYOUT_IMPORT = '''import { BackToTop } from "@/components/BackToTop";
import { DesktopSideRails } from "@/components/DesktopSideRails";'''

OLD_LAYOUT_BODY = '''        <DesktopSideRails />
        {children}
        <Analytics />'''

NEW_LAYOUT_BODY = '''        <DesktopSideRails />
        {children}
        <BackToTop />
        <Analytics />'''

OLD_GLOBALS_BODY = '''body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), "Hiragino Sans", "Yu Gothic UI", sans-serif;
}'''

NEW_GLOBALS_BODY = '''html {
  scroll-behavior: smooth;
  scroll-padding-top: 3.5rem;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), "Hiragino Sans", "Yu Gothic UI", sans-serif;
}'''

OLD_TIER_H1 = '''          <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl" translate="no">
            キャラクターランク
          </h1>'''

NEW_TIER_H1 = '''          <h1
            id="page-top"
            className="mt-1 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl"
            translate="no"
          >
            キャラクターランク
          </h1>'''

OLD_TIER_FOOTER = '''            <Link href="/" className="font-semibold text-muted hover:text-accent">
              ← ロスターへ戻る
            </Link>
          </p>'''

NEW_TIER_FOOTER = '''            <Link href="/" className="font-semibold text-muted hover:text-accent">
              ← ロスターへ戻る
            </Link>
            <a href="#page-top" className="font-semibold text-muted hover:text-accent">
              上へ戻る ↑
            </a>
          </p>'''


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
    COMP.write_text(COMP_TSX, encoding="utf-8")

    layout = LAYOUT.read_text(encoding="utf-8")
    if OLD_LAYOUT_IMPORT not in layout or OLD_LAYOUT_BODY not in layout:
        print("[error] layout.tsx pattern not found", file=sys.stderr)
        return 1
    LAYOUT.write_text(
        layout.replace(OLD_LAYOUT_IMPORT, NEW_LAYOUT_IMPORT, 1).replace(OLD_LAYOUT_BODY, NEW_LAYOUT_BODY, 1),
        encoding="utf-8",
    )

    g = GLOBALS.read_text(encoding="utf-8")
    if "scroll-behavior: smooth" not in g:
        g = g.replace(OLD_GLOBALS_BODY, NEW_GLOBALS_BODY, 1)
        GLOBALS.write_text(g, encoding="utf-8")

    tier = TIER.read_text(encoding="utf-8")
    if OLD_TIER_H1 in tier and OLD_TIER_FOOTER in tier:
        TIER.write_text(
            tier.replace(OLD_TIER_H1, NEW_TIER_H1, 1).replace(OLD_TIER_FOOTER, NEW_TIER_FOOTER, 1),
            encoding="utf-8",
        )

    print("[done] global BackToTop + nav scroll padding")

    git(
        "add",
        "src/components/BackToTop.tsx",
        "src/app/layout.tsx",
        "src/app/globals.css",
        "src/app/tier/page.tsx",
        "scripts/patch-back-to-top-global.py",
    )
    commit = git("commit", "-m", "Add global back-to-top button and scroll padding")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
