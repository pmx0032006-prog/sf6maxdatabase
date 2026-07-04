#!/usr/bin/env python3
"""Apply English UI strings to SF6 MAX DATABASE in phased steps."""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STATE_PATH = Path(__file__).resolve().parent / ".english-ui-state.json"
TOTAL_PHASES = 5


def load_state() -> dict:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    return {"completed": []}


def save_state(state: dict) -> None:
    STATE_PATH.write_text(json.dumps(state, indent=2), encoding="utf-8")


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def write(rel: str, content: str) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def apply_pairs(rel: str, pairs: list[tuple[str, str]]) -> list[str]:
    text = read(rel)
    changed: list[str] = []
    for old, new in pairs:
        if old not in text:
            continue
        text = text.replace(old, new)
        changed.append(old[:48] + ("..." if len(old) > 48 else ""))
    if changed:
        write(rel, text)
    return changed


def phase_1() -> None:
    apply_pairs(
        "src/lib/site.ts",
        [
            (
                "ストリートファイター6のフレームデータと軽量JPG判定画像 — 低スペックスマホでも素早く確認できるデータベース",
                "Street Fighter 6 frame data and lightweight JPG hitbox images — a fast-loading database for low-spec phones",
            ),
            (
                "軽量JPG判定画像 × フレーム数値 — モバイル向けSF6データベース",
                "Lightweight JPG hitboxes × frame data — a mobile-first SF6 database",
            ),
        ],
    )


def phase_2() -> None:
    pairs_by_file: dict[str, list[tuple[str, str]]] = {
        "src/app/page.tsx": [
            (
                "キャラクターを選んでフレームデータ・判定画像へ",
                "Pick a character for frame data and hitbox images",
            ),
        ],
        "src/components/FeaturesSection.tsx": [
            ('title: "フレームデータ"', 'title: "Frame Data"'),
            (
                "起動・ガード有利・ダメージなど、技ごとの数値をセクション分けで素早く確認。",
                "Startup, frame advantage, damage, and more — grouped by move section for quick lookup.",
            ),
            ('title: "軽量JPG判定画像"', 'title: "Lightweight JPG Hitboxes"'),
            (
                "約3万枚から抽出した低画質JPG。GIFより軽く、低スペックスマホでもサクッと開けます。",
                "Low-quality JPGs extracted from ~30k assets. Lighter than GIFs — opens fast on low-spec phones.",
            ),
            ('title: "複数フレーム閲覧"', 'title: "Multi-Frame View"'),
            (
                "同一技の _1 _2 _3 … をカード内または拡大画面で切替。対戦の合間にサッと確認。",
                "Switch _1 _2 _3 … frames in-card or fullscreen. Quick checks between matches.",
            ),
        ],
        "src/components/NewsSection.tsx": [
            (
                "軽量JPG × フレーム数値の更新履歴",
                "Updates — lightweight JPG × frame data",
            ),
        ],
        "src/data/news.ts": [
            (
                "Aboutページ追加 — 軽量JPG方針とデータの見方を公開",
                "About page added — JPG approach and how to read the data",
            ),
            (
                "全29キャラ move lookup 0 MISS・本番ビルド確認済み",
                "All 30 characters move lookup 0 MISS — production build verified",
            ),
            (
                "全29キャラの判定画像・サムネイルを公開",
                "Hitbox images and thumbnails published for all 30 characters",
            ),
            (
                "SF6 MAX DATABASE ブランド・ドメイン名を決定",
                "SF6 MAX DATABASE brand and domain finalized",
            ),
        ],
        "src/components/SiteFooter.tsx": [
            (
                "全29キャラ — 軽量JPG判定画像 + フレーム数値（lookup 0 MISS）",
                "All 30 characters — lightweight JPG hitboxes + frame data (lookup 0 MISS)",
            ),
            ("キャラ一覧 →", "Character roster →"),
        ],
        "src/components/SiteHeader.tsx": [
            ('aria-label="メインナビゲーション"', 'aria-label="Main navigation"'),
            ('aria-label="モバイルナビゲーション"', 'aria-label="Mobile navigation"'),
        ],
        "src/components/RosterIntro.tsx": [
            (
                "全29キャラ — フレームデータと判定画像",
                "All 30 characters — frame data and hitbox images",
            ),
        ],
        "src/app/characters/page.tsx": [
            (
                f"`${'{siteName}'} — 全29キャラのフレームデータと判定画像`",
                f"`${'{siteName}'} — frame data and hitbox images for all 30 characters`",
            ),
            (
                "キャラクターを選んで、フレーム数値と軽量JPG判定画像を確認できます。",
                "Pick a character to view frame data and lightweight JPG hitbox images.",
            ),
            (
                "全29キャラ — タップでフレームデータへ",
                "All 30 characters — tap for frame data",
            ),
        ],
    }
    for rel, pairs in pairs_by_file.items():
        apply_pairs(rel, pairs)


def phase_3() -> None:
    about = read("src/app/about/page.tsx")
    if "About This Site" in about:
        return
    write("src/app/about/page.tsx", ABOUT_PAGE_EN)


def phase_4() -> None:
    pairs_by_file: dict[str, list[tuple[str, str]]] = {
        "src/lib/move-sort.ts": [
            ('standing: "立ち通常技"', 'standing: "Normals (Standing)"'),
            ('crouch: "しゃがみ通常技"', 'crouch: "Normals (Crouching)"'),
            ('target: "ターゲットコンボ"', 'target: "Target Combos"'),
            ('lever: "レバー技"', 'lever: "Unique Actions"'),
            ('jump: "ジャンプ技"', 'jump: "Jump Normals"'),
            ('special: "必殺技"', 'special: "Special Moves"'),
            ('super: "スーパーアーツ"', 'super: "Super Arts"'),
        ],
        "src/components/character/wiki-frame-columns.ts": [
            ('label: "発生", shortLabel: "発生"', 'label: "Startup", shortLabel: "Start"'),
            ('label: "ヒット", shortLabel: "ヒット"', 'label: "On Hit", shortLabel: "Hit"'),
            ('label: "ガード", shortLabel: "ガード"', 'label: "On Block", shortLabel: "Blk"'),
            ('label: "ダメージ", shortLabel: "ダメ"', 'label: "Damage", shortLabel: "DMG"'),
            ('label: "キャンセルルート"', 'label: "Cancel Route"'),
            ('shortLabel: "キャンセル"', 'shortLabel: "Cancel"'),
            ('label: "持続", shortLabel: "持続"', 'label: "Active", shortLabel: "Active"'),
            ('label: "回復", shortLabel: "回復"', 'label: "Recovery", shortLabel: "Rec"'),
            ('label: "全体", shortLabel: "全体"', 'label: "Total", shortLabel: "Total"'),
            ('label: "ガード属性", shortLabel: "LH"', 'label: "Guard", shortLabel: "LH"'),
            ('label: "DRキャンセル(ヒット)"', 'label: "DR Cancel (Hit)"'),
            ('label: "DRキャンセル(ガード)"', 'label: "DR Cancel (Block)"'),
            ('label: "DR後(ヒット)"', 'label: "After DR (Hit)"'),
            ('label: "DR後(ガード)"', 'label: "After DR (Block)"'),
            ('label: "ヒット確認"', 'label: "Hit Confirm"'),
            ('label: "無敵"', 'label: "Invuln"'),
        ],
        "src/components/character/FrameDataDetailTable.tsx": [
            ('label: "入力"', 'label: "Input"'),
            ('label: "短縮"', 'label: "Short"'),
            ('label: "発生"', 'label: "Startup"'),
            ('label: "持続"', 'label: "Active"'),
            ('label: "回復"', 'label: "Recovery"'),
            ('label: "全体"', 'label: "Total"'),
            ('label: "ガード"', 'label: "Guard"'),
            ('label: "キャンセル"', 'label: "Cancel"'),
            ('label: "キャンセル可否"', 'label: "Cancelable"'),
            ('label: "DR対応"', 'label: "DR"'),
            ('label: "ダメージ"', 'label: "Damage"'),
            ('label: "ヒット"', 'label: "On Hit"'),
            ('label: "ガード時"', 'label: "On Block"'),
            ('label: "DRキャンセル(ヒット)"', 'label: "DR Cancel (Hit)"'),
            ('label: "DRキャンセル(ガード)"', 'label: "DR Cancel (Block)"'),
            ('label: "DR後(ヒット)"', 'label: "After DR (Hit)"'),
            ('label: "DR後(ガード)"', 'label: "After DR (Block)"'),
            ('label: "ヒット確認"', 'label: "Hit Confirm"'),
            ('label: "無敵"', 'label: "Invuln"'),
            ('label: "備考"', 'label: "Notes"'),
            ('row.label === "備考"', 'row.label === "Notes"'),
        ],
        "src/components/character/MoveDataCard.tsx": [
            ('labelJa: "発生"', 'labelJa: "Startup"'),
            ('labelJa: "持続"', 'labelJa: "Active"'),
            ('labelJa: "全体"', 'labelJa: "Total"'),
            ('labelJa: "ガード"', 'labelJa: "On Block"'),
            ('labelJa: "ヒット"', 'labelJa: "On Hit"'),
        ],
        "src/components/character/InvulnBadge.tsx": [
            ("        無敵", "        Invuln"),
        ],
        "src/components/character/WikiFrameDataCardPreview.tsx": [
            ('<span className="font-bold text-muted">キャンセル</span>', '<span className="font-bold text-muted">Cancel</span>'),
            ("            備考 {displayWikiValue(move.notes)}", "            Notes {displayWikiValue(move.notes)}"),
        ],
        "src/components/character/WikiFrameDataTable.tsx": [
            ("          ヒットボックスオフ", "          Hitboxes off"),
            ("            プレイヤー向け", "            Player view"),
            ("            詳細（Wiki）", "            Details (Wiki)"),
            ('<span className="font-bold text-foreground/70">備考：</span>', '<span className="font-bold text-foreground/70">Notes:</span>'),
        ],
        "src/components/character/MoveDataGrid.tsx": [
            ("              <span>発 {displayWikiValue(move.startup)}</span>", "              <span>St {displayWikiValue(move.startup)}</span>"),
            ("              <span>ガ {displayWikiValue(move.onBlock)}</span>", "              <span>Bk {displayWikiValue(move.onBlock)}</span>"),
            ("        全 {moves.length} 技 — サムネをクリックで拡大", "        {moves.length} moves — click thumbnail to expand"),
            (
                "（_1 _2 _3 … はカード内に表示 / 拡大後 ← → で切替）",
                "(_1 _2 _3 … shown in card / use ← → when expanded)",
            ),
            ('aria-label={`${active.nameJa} のヒットボックス`}', 'aria-label={`${active.nameEn ?? active.nameJa} hitbox`}'),
            ('aria-label="前のフレーム"', 'aria-label="Previous frame"'),
            ('aria-label="次のフレーム"', 'aria-label="Next frame"'),
        ],
        "src/components/character/CharacterPreparing.tsx": [
            ("            準備中です", "            Coming soon"),
            (
                "{ja}（{en}）のフレームデータ・攻略記事は現在制作中です。",
                "Frame data for {en} is coming soon.",
            ),
            ("            公開までしばらくお待ちください。", "            Please check back later."),
        ],
        "src/components/character/FrameDataList.tsx": [
            ("        判定画像が見つかりません。", "        No hitbox images found."),
            ("        デスクトップ素材を同期するには", "        To sync desktop assets, run"),
            ("          を実行してください。", "          ."),
            (
                "          判定画像は公開済みです。フレーム数値（発生・ガード等）は現在制作中です。",
                "          Hitbox images are live. Frame data (startup, block advantage, etc.) is coming soon.",
            ),
        ],
        "src/lib/character-text.ts": [
            ('  c: "クラシック"', '  c: "Classic"'),
            ('  m: "モダン"', '  m: "Modern"'),
        ],
        "src/app/characters/[slug]/page.tsx": [
            ('if (!character) return { title: "キャラクター" };', 'if (!character) return { title: "Character" };'),
            (
                "? `${character.ja}のフレームデータ・判定画像`",
                "? `${character.en} — frame data and hitbox images`",
            ),
            ('      : `${character.ja} — 準備中`,', '      : `${character.en} — coming soon`,'),
            (
                "title={`クラシック・${character.ja}攻略`}",
                "title={`Classic — ${character.en} guide`}",
            ),
            ('title="クラシック攻略"', 'title="Classic guide"'),
            (
                "body={`${character.ja}のクラシック攻略記事は準備中です。`}",
                "body={`Classic guide for ${character.en} is coming soon.`}",
            ),
            (
                "title={`モダン・${character.ja}攻略`}",
                "title={`Modern — ${character.en} guide`}",
            ),
            ('title="モダン攻略"', 'title="Modern guide"'),
            (
                "body={`${character.ja}のモダン攻略記事は準備中です。`}",
                "body={`Modern guide for ${character.en} is coming soon.`}",
            ),
        ],
    }
    for rel, pairs in pairs_by_file.items():
        apply_pairs(rel, pairs)

    grid = read("src/components/CharacterGrid.tsx")
    if "character.ja" not in grid:
        return
    grid = re.sub(
        r"\s*<span\s+className=\{`mt-1 text-white/85[^`]*`\}\s*>\s*\{character\.ja\}\s*</span>\s*",
        "\n",
        grid,
        count=1,
    )
    grid = re.sub(
        r"\s*<span className=\{`mt-2 \$\{styles\.ja\}`\}>\{character\.ja\}</span>\s*",
        "\n",
        grid,
        count=1,
    )
    write("src/components/CharacterGrid.tsx", grid)


def phase_5() -> None:
    apply_pairs(
        "src/app/layout.tsx",
        [
            ('lang="ja"', 'lang="en"'),
        ],
    )


PHASES = {
    1: ("site.ts tagline and description", phase_1),
    2: ("Home + Features + News + Footer", phase_2),
    3: ("About page full English", phase_3),
    4: ("Character UI + frame labels", phase_4),
    5: ("layout lang=en", phase_5),
}


ABOUT_PAGE_EN = '''import Link from "next/link";
import { PageMasthead } from "@/components/PageMasthead";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteName, siteNameFull } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: `${siteNameFull} — lightweight JPG hitboxes and how to read frame data`,
};

const sections = [
  {
    id: "concept",
    title: "About This Site",
    body: [
      `${siteNameFull} is a database focused on opening Street Fighter 6 frame data and hitbox images quickly on smartphones.`,
      "We use low-quality JPGs extracted from ~30k assets so low-spec devices can load move data without heavy downloads.",
    ],
  },
  {
    id: "jpg",
    title: "Why JPG Instead of GIF",
    body: [
      "Animated hitbox GIFs carry a lot of information, but they also increase page weight.",
      "This site uses still JPG images so you can check frames on mobile data or between matches.",
      "When a move has multiple frames (_1, _2, _3 …), switch them in-card or in the expanded view with ← → keys.",
    ],
  },
  {
    id: "read",
    title: "How to Read the Data",
    items: [
      {
        term: "St / Bk / DMG",
        desc: "Startup frames, block advantage, damage, and more — sourced from the Wiki frame table.",
      },
      {
        term: "_1 _2 _3 …",
        desc: "Frame sequence for the same move. Check at the bottom of the card or in expanded view.",
      },
      {
        term: "Sections",
        desc: "Standing normals, crouching normals, specials, Super Arts, and more — ordered for in-match lookup.",
      },
      {
        term: "— (dash)",
        desc: "Shown when data is unavailable or not applicable for that move.",
      },
    ],
  },
  {
    id: "source",
    title: "Data Sources",
    body: [
      "Frame numbers are based on SuperCombo Wiki (Cargo API), processed and merged for this site.",
      "Hitbox images come from a proprietary asset set (~30k extracted images).",
      "Accuracy is always improving — corrections will ship in future updates.",
    ],
  },
  {
    id: "roadmap",
    title: "Roadmap",
    body: [
      "The public site is English-first. We do not publish strategy articles — only frame data and hitbox images.",
      "Regional access and other launch details are configured at the edge (geo restrictions).",
    ],
  },
] as const;

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="about" />

      <main className="flex-1">
        <PageMasthead
          eyebrow={siteName}
          title="About"
          subtitle="Lightweight JPG × frame data — a mobile-first SF6 database"
          showBackLink
        />

        <section className="bg-background">
          <div className="mx-auto max-w-3xl space-y-14 px-4 py-12 sm:px-10 sm:py-16">
            {sections.map((section) => (
              <article key={section.id} id={section.id} className="space-y-4">
                <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {section.title}
                </h2>
                {"body" in section && section.body
                  ? section.body.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 24)}
                        className="text-sm leading-relaxed text-muted sm:text-base"
                      >
                        {paragraph}
                      </p>
                    ))
                  : null}
                {"items" in section && section.items ? (
                  <dl className="divide-y divide-border rounded-lg border border-border/80 bg-surface">
                    {section.items.map((item) => (
                      <div
                        key={item.term}
                        className="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-5 sm:py-4"
                      >
                        <dt className="text-xs font-bold tracking-wide text-accent sm:text-sm">
                          {item.term}
                        </dt>
                        <dd className="text-sm leading-relaxed text-muted">
                          {item.desc}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </article>
            ))}

            <div className="flex flex-wrap gap-4 border-t border-border/80 pt-8">
              <Link
                href="/characters"
                className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent-hover"
              >
                Character roster →
              </Link>
              <Link
                href="/"
                className="inline-flex items-center text-sm text-muted hover:text-foreground"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
'''


def run_phase(n: int) -> None:
    name, fn = PHASES[n]
    print(f"=== Phase {n}/{TOTAL_PHASES}: {name} ===", flush=True)
    fn()
    state = load_state()
    done = set(state.get("completed", []))
    done.add(n)
    state["completed"] = sorted(done)
    save_state(state)
    print(f"Phase {n} done.", flush=True)


def run_build() -> int:
    print(">>> npx next build", flush=True)
    result = subprocess.run(
        ["npx", "next", "build"],
        cwd=ROOT,
        shell=True,
    )
    return result.returncode


def main() -> int:
    parser = argparse.ArgumentParser(description="English UI phased migration")
    parser.add_argument("--phase", type=int, choices=range(1, TOTAL_PHASES + 1))
    parser.add_argument("--next", action="store_true", help="Run next incomplete phase")
    parser.add_argument("--all", action="store_true", help="Run all incomplete phases")
    parser.add_argument("--status", action="store_true")
    parser.add_argument("--build", action="store_true", help="Run next build after phases")
    args = parser.parse_args()

    state = load_state()
    completed = set(state.get("completed", []))

    if args.status:
        for n in range(1, TOTAL_PHASES + 1):
            mark = "done" if n in completed else "pending"
            print(f"  Phase {n}: {mark} — {PHASES[n][0]}")
        remaining = [n for n in range(1, TOTAL_PHASES + 1) if n not in completed]
        print(f"Remaining: {remaining or 'none'}")
        return 0

    if args.phase:
        run_phase(args.phase)
    elif args.all:
        for n in range(1, TOTAL_PHASES + 1):
            if n not in completed:
                run_phase(n)
                completed.add(n)
    elif args.next:
        remaining = [n for n in range(1, TOTAL_PHASES + 1) if n not in completed]
        if not remaining:
            print("All phases complete.")
            return 0
        run_phase(remaining[0])
    else:
        parser.print_help()
        return 1

    completed = set(load_state().get("completed", []))
    if args.build and len(completed) == TOTAL_PHASES:
        return run_build()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
