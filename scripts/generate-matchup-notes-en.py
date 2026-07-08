#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate src/data/matchup-notes-en.ts from Japanese MATCHUP_NOTES."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
META = ROOT / "src" / "data" / "character-meta.ts"
OUT = ROOT / "src" / "data" / "matchup-notes-en.ts"

TRANSLATIONS: dict[str, str] = {
    "Devil Reverseに注意": "Watch for Devil Reverse",
    "すり抜けられて終わる": "Gets blown up when slipped past",
    "すり抜けられやすい": "Easy to slip past",
    "イングリッド弱位（ドク調整）": "Ingrid at a slight disadvantage (Doc tune)",
    "イングリッド相手はやや有利": "Slight edge vs Ingrid",
    "ケンのリーチの短さを突ける": "Exploit Ken's shorter reach",
    "ケンの暴れをトリガーで止める": "Stop Ken's pressure with Trigger",
    "コマンド投げ前にボールで潰す": "Shut down command grabs with balls",
    "コマンド投げ前に削る": "Poke before command grabs land",
    "スパイラルでボールをかわせるか": "Can Spiral past balls?",
    "スパイラルで一気に懐へ": "Spiral closes the gap fast",
    "スパイラルで接近されやすい": "Spiral makes it easy to get rushed",
    "スパイラルにDevil Reverseが負けることも": "Devil Reverse can beat Spiral",
    "スパイラルにボールが負けることも": "Balls can lose to Spiral",
    "スパイラルに波動を合わせられるか": "Can you match Spiral with fireballs?",
    "スパイラルに注意": "Respect Spiral",
    "スパイラルを差し返せる": "Can check Spiral on reaction",
    "スピード互角だが火力で負ける（暫定（暫定）": "Even speed but loses on damage (tentative)",
    "スピード勝負": "Speed matchup",
    "スピード勝負、データ少": "Speed matchup, limited data",
    "スピード勝負、暫定": "Speed matchup (tentative)",
    "スピード勝負（暫定（暫定）": "Speed matchup (tentative)",
    "ソニックでヨガを牽制": "Sonic keeps Yoga in check",
    "ソニックで牽制、接近戦は舞": "Sonic controls space; close range favors Mai",
    "ソニックで突進を止められるか": "Can Sonic stop the rush?",
    "ソニックに阻まれる": "Blocked by Sonic Boom",
    "ソニックに阻まれるが接近戦は互角": "Sonic slows you but close range is even",
    "ソニックに阻まれるが接近戦は舞": "Sonic blocks you but Mai wins up close",
    "ソニックの弾速で互角": "Even in Sonic Boom projectile war",
    "ソニックの弾速に負ける": "Loses to Sonic Boom bullet speed",
    "ソニックの弾速に阻まれる": "Sonic Boom speed walls you out",
    "ソニック戦は互角": "Sonic Boom war is even",
    "ソニック戦互角": "Even Sonic Boom matchup",
    "ソニック戦互角？（暫定（暫定）": "Sonic Boom war maybe even (tentative)",
    "テリーの置きをすり抜けやすい": "Can slip Terry's pokes",
    "データ不足": "Insufficient data",
    "データ不足、暫定互角": "Insufficient data, tentatively even",
    "トリガーに突進を止められやすい": "Trigger stops your dash-in easily",
    "ドリンクに注意": "Watch drink levels",
    "ドリンク前に削る": "Poke before drink stacks",
    "ドリンク前に終わらせる": "End the round before drink stacks",
    "ドリンク溜める前に終わる": "Finish before drink stacks",
    "ドリンク溜めさせずに終わらせる": "Don't let drink stack — close it out",
    "ドリンク溜める前に終わらせる": "Finish before drink stacks",
    "パワーで負ける": "Loses the power trade",
    "パワー勝負で有利": "Wins raw damage trades",
    "パワー勝負で負ける": "Loses raw damage trades",
    "プレッシャーを受けると厳しいが読み合い": "Rough under pressure but reads matter",
    "ヘッドバットに注意": "Respect Headbutt",
    "ヘッドバットをすり抜ける": "Can slip Headbutt",
    "ヘッドバットをトリガーで止める": "Stop Headbutt with Trigger",
    "ヘッドバットを差し返せる": "Can check Headbutt on reaction",
    "ボールで飛び込めるが読み負けると痛い": "Balls open gaps but bad reads hurt",
    "ボールに張り手が間に合わないことも": "Parry may not catch every ball",
    "ボールをすり抜けられるが読み合い": "Balls get slipped but reads decide it",
    "ボールをソニックで落とせるか": "Can Sonic knock down balls?",
    "ボールをトリガーで落とせる": "Trigger knocks down balls",
    "ボールをフラッシュナックルで落とされにくい": "Flash Knuckle rarely clears balls",
    "ボールをフラッシュナックルで落とせる": "Flash Knuckle clears balls well",
    "マリーザの攻撃を置きで止める": "Stop Marisa's buttons with pokes",
    "ヨガをかわしやすい": "Easy to slip Yoga attacks",
    "ヨガをかわせる": "Can slip Yoga attacks",
    "ヨガをスパイラルでかわせる": "Spiral slips past Yoga",
    "ヨガをリフレクト": "Reflect Yoga fireballs",
    "ヨガを置きで潰せる": "Poke Yoga fireballs down",
    "ヨガ戦互角": "Even Yoga fireball war",
    "リスクリターンで上回る": "Wins on risk/reward",
    "リスクリターンで負けがち": "Often loses risk/reward",
    "リスクリターンで負ける": "Loses risk/reward trades",
    "リズムに乗られると危ない（暫定（暫定）": "Dangerous if Dee Jay gets rhythm (tentative)",
    "リズム勝負（暫定（暫定）": "Rhythm matchup (tentative)",
    "リュウの置きをすり抜けやすい": "Can slip Ryu's pokes",
    "リーチでヨガを制す": "Outrange Yoga",
    "リーチで削られやすい": "Gets chipped at range",
    "リーチで削り勝ち": "Win at range with reach",
    "リーチで勝る": "Wins on reach",
    "リーチで圧倒": "Dominates at range",
    "リーチで負ける": "Loses on reach",
    "リーチで負けるがスピードでカバー": "Shorter reach but speed covers it",
    "リーチ差で勝る": "Wins the reach battle",
    "リーチ負けしない": "Doesn't lose on reach",
    "互角寄り": "Slightly even",
    "動きが読めずセットプレイに捲られる": "Hard to read — loses to setplay",
    "動きが読めず苦戦（暫定（暫定）": "Hard to track movement (tentative)",
    "動きでブランカを翻弄": "Movement tools mess with Blanka",
    "動きで接近しやすい": "Mobility makes approach easier",
    "動きで突進をかわす": "Movement slips past dashes",
    "動きで翻弄": "Mobility creates chaos",
    "動きに合わせるのが難しい": "Hard to match the movement",
    "動きに合わせるのが難しい（暫定（暫定）": "Hard to match movement (tentative)",
    "動き勝負、データ不足": "Mobility matchup, limited data",
    "動き勝負（暫定（暫定）": "Mobility matchup (tentative)",
    "同キャラ系": "Mirror-style matchup",
    "同キャラ系、読み合い": "Mirror-style — reads decide it",
    "同タイプ": "Similar archetype",
    "同タイプ、データ不足": "Similar archetype, limited data",
    "安定感で勝る": "Wins on consistency",
    "差し合いで負けがち": "Often loses the neutral",
    "差し合い互角": "Even neutral",
    "差し合い互角だが置きに負けがち": "Even neutral but loses pokes",
    "差し返されやすい": "Easy to counter-poke",
    "張り手で近づいて投げゲーに持ち込める": "Parry in and force throw game",
    "張り手に弱いが逃げながら削れる": "Weak to parry but can chip while escaping",
    "張り手に注意": "Respect Drive Parry",
    "張り手に注意、読み合い": "Watch parry — reads matter",
    "張り手に注意、距離管理": "Respect parry — manage spacing",
    "張り手に注意すれば勝てる": "Win if you respect parry",
    "張り手＋投げに弱い、距離管理必須": "Weak to parry + throw — spacing is key",
    "投げ勝負で有利": "Wins throw battles",
    "投げ勝負で負ける": "Loses throw battles",
    "攻撃をかわす": "Can slip attacks",
    "攻撃をすり抜けて裏を取る": "Slip attacks and take back control",
    "攻撃をソニックで止める": "Stop attacks with Sonic Boom",
    "攻撃をポータルでかわす": "Portals slip past attacks",
    "攻撃を置きで止める": "Stop attacks with pokes",
    "春麗のリーチをかわしやすい": "Easy to slip Chun-Li's reach",
    "春麗のリーチをポータルでカバー": "Portals cover Chun-Li's reach",
    "春麗のリーチを置きで封じる": "Pokes shut down Chun-Li's reach",
    "毒に注意、暫定": "Watch poison setups (tentative)",
    "毒に注意（暫定（暫定）": "Watch poison setups (tentative)",
    "毒戦術に注意、暫定": "Respect poison game (tentative)",
    "波動で削り、近距離は置きで止める": "Fireballs chip; pokes stop close pressure",
    "波動にスパイラルを合わせられるか": "Can you match fireballs with Spiral?",
    "波動に苦戦": "Struggles vs fireballs",
    "波動をすり抜けられるが読み合い": "Can slip fireballs but reads matter",
    "波動をリフレクト＋ポータル": "Reflect fireballs + portal mix",
    "波動を張り手で通り抜けられるが読み合い": "Parry through fireballs but reads matter",
    "波動合戦で勝てる": "Wins fireball wars",
    "波動合戦で負けがち": "Often loses fireball wars",
    "波動合戦互角": "Even fireball war",
    "爆発力はあるが安定感で勝る": "They hit hard but you win on consistency",
    "爆発力勝負": "Burst damage race",
    "爆発力勝負（暫定（暫定）": "Burst damage race (tentative)",
    "突進をすり抜けられるが読み合い": "Can slip dashes but reads matter",
    "突進をトリガーで止める": "Trigger stops the dash-in",
    "突進を止められない": "Can't stop the rush",
    "突進を止められるか": "Can you stop the dash-in?",
    "突進を置きで止められるか": "Can pokes stop the dash-in?",
    "突進を置きで止められるが読み合い": "Pokes can stop rush but reads matter",
    "竜巻に注意": "Respect Dragonlash",
    "竜巻を差し返せる": "Can check Dragonlash",
    "置きでボールを止めやすい": "Pokes shut down balls easily",
    "置きに負けがち": "Struggles against good pokes",
    "脆さを突かれる": "Gets punished for being fragile",
    "読み合い": "Reads decide it",
    "読み合い次第": "Depends on reads",
    "読み合い次第で化けられる": "Can flip it with good reads",
    "豪鬼の脆さを突ける": "Punish Akuma's low health",
    "距離を取って削り勝ち": "Keep distance and chip to win",
    "近距離で投げで返せる": "Throw game wins up close",
    "近距離の読み合い": "Close-range reads",
    "近距離の読み合いなら互角": "Even if reads are clean up close",
    "近距離は危ないが距離保てば勝ち": "Dangerous up close but wins at range",
    "速い技に苦戦するが暴れ性能互角": "Fast buttons hurt but scramble is even",
    "速さで負ける": "Loses on speed",
    "速さに押されがちだがパワーで逆転": "Gets rushed but power reverses it",
    "速さ勝負": "Speed matchup",
    "遠距離JP、近距離舞": "JP at range, Mai up close",
    "遠距離で削られやすい": "Gets chipped from far",
    "遠距離で削られる": "Gets chipped from far",
    "遠距離で削り勝ち": "Win by chipping from far",
    "遠距離で苦戦": "Struggles at range",
    "遠距離で詰む": "Gets locked out at range",
    "遠距離に詰め寄られなければ勝ち": "Win if they can't close the gap",
    "遠距離に詰め寄れないと厳しい": "Rough if you can't get in",
    "遠距離はJP、近距離は舞": "JP wins far, Mai wins near",
    "遠距離はキツいが捕まえたら勝ち": "Range is rough but one grab snowballs",
    "遠距離は楽だが捕まると終わる": "Easy at range but one grab ends you",
    "風水に注意": "Respect Feng Shui Engine",
    "風水エンジン前に削り切れる": "Can chip before Feng Shui Engine",
    "風水前に削り切る": "Chip down before Feng Shui Engine",
    "風水前に削り勝ち": "Win the poke war before Feng Shui",
    "風水前に削る": "Poke before Feng Shui Engine",
    "飛び道具をかわせる": "Can slip projectiles",
    "飛び道具をすり抜けやすい": "Easy to slip projectiles",
    "飛び道具をスパイラルでかわせる": "Spiral slips past projectiles",
    "飛び道具をリフレクト": "Reflect projectiles",
    "飛び道具戦で不利": "Loses projectile wars",
    "飛び道具戦で圧倒": "Dominates projectile wars",
    "飛び道具戦で圧倒される": "Gets dominated in projectile wars",
    "飛び道具戦で有利": "Wins projectile wars",
    "飛び道具戦互角": "Even projectile war",
}


def parse_matchup_notes(text: str) -> dict[str, dict[str, str]]:
    chunk = text.split("MATCHUP_NOTES")[1].split("export const MATCHUPS")[0]
    rows: dict[str, dict[str, str]] = {}
    for row_slug, inner in re.findall(r'"([a-z-]+)":\s*\{([^{}]*)\}', chunk):
        rows[row_slug] = dict(re.findall(r'"([a-z-]+)":\s*"([^"]*)"', inner))
    return rows


def main() -> None:
    raw = META.read_text(encoding="utf-8")
    notes_ja = parse_matchup_notes(raw)
    notes_en: dict[str, dict[str, str]] = {}
    missing: set[str] = set()

    for row, cols in notes_ja.items():
        notes_en[row] = {}
        for col, ja in cols.items():
            if not ja:
                notes_en[row][col] = ""
                continue
            en = TRANSLATIONS.get(ja)
            if en is None:
                missing.add(ja)
                en = ja
            notes_en[row][col] = en

    if missing:
        raise SystemExit(
            f"Missing {len(missing)} translations:\n" + "\n".join(sorted(missing))
        )

    lines = [
        "/** English matchup notes — generated by scripts/generate-matchup-notes-en.py */",
        "",
        "export const MATCHUP_NOTES_EN: Record<string, Record<string, string>> = ",
        json.dumps(notes_en, ensure_ascii=False, indent=2) + ";",
        "",
        "export function getMatchupNoteEn(rowSlug: string, colSlug: string): string {",
        '  return MATCHUP_NOTES_EN[rowSlug]?.[colSlug] ?? "";',
        "}",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"GENERATED {OUT.relative_to(ROOT)} ({len(notes_en)} rows)")


if __name__ == "__main__":
    main()
