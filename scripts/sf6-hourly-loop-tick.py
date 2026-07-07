#!/usr/bin/env python3
"""Hourly SF6 loop: matchup memo dock + Vercel analytics report."""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MATCHUP = ROOT / "scripts" / "matchup-note-loop-tick.py"
ANALYTICS = ROOT / "scripts" / "analytics-loop-tick.py"
DOCK_PATCH = ROOT / "scripts" / "patch-matchup-note-dock.py"


def run(script: Path) -> tuple[int, str]:
    result = subprocess.run(
        [sys.executable, str(script)],
        cwd=ROOT,
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="replace",
    )
    return result.returncode, (result.stdout or "") + (result.stderr or "")


def parse_line(output: str, prefix: str) -> dict | None:
    for line in output.splitlines():
        if line.startswith(prefix + " "):
            try:
                return json.loads(line[len(prefix) + 1 :])
            except json.JSONDecodeError:
                return None
    return None


def country_label(code: str) -> str:
    names = {
        "JP": "日本",
        "US": "米国",
        "GB": "英国",
        "DE": "ドイツ",
        "FR": "フランス",
        "KR": "韓国",
        "TW": "台湾",
        "BR": "ブラジル",
        "CA": "カナダ",
        "AU": "豪州",
    }
    return names.get(code, code)


def main() -> int:
    matchup_code, matchup_out = run(MATCHUP)
    analytics_code, analytics_out = run(ANALYTICS)
    print(matchup_out, end="")
    print(analytics_out, end="")

    matchup = parse_line(matchup_out, "MATCHUP_NOTE_LOOP_TICK") or {}
    analytics = parse_line(analytics_out, "ANALYTICS_LOOP_TICK") or {}

    if matchup_code != 0 and DOCK_PATCH.is_file():
        subprocess.run([sys.executable, str(DOCK_PATCH)], cwd=ROOT, check=False)

    all_ok = matchup_code == 0 and analytics_code == 0
    payload = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "matchup_ok": matchup_code == 0,
        "analytics_ok": analytics_code == 0,
        "all_ok": all_ok,
    }
    print("SF6_HOURLY_LOOP_TICK", json.dumps(payload, ensure_ascii=False))
    print("SF6_HOURLY_LOOP_OK" if all_ok else "SF6_HOURLY_LOOP_PENDING")

    print("--- ドク向け報告 ---")
    print(f"1. メモ欄ロック: {'OK' if matchup_code == 0 else '要確認'}")
    if analytics.get("status") == "ok":
        top = analytics.get("countries_top3") or []
        top_txt = " / ".join(
            f"{country_label(str(row.get('country', '??')))} {row.get('share_pct', 0)}%"
            for row in top[:3]
        ) or "データなし"
        print(
            f"2. 閲覧(7日): PV {analytics.get('pageviews_7d', 0)} / 訪問者 {analytics.get('visitors_7d', 0)}"
        )
        print(
            f"3. 国トップ3(7日): {top_txt}（24h PV {analytics.get('pageviews_24h', 0)}）"
        )
    else:
        print(f"2. アナリティクス: {analytics.get('message') or analytics.get('error') or '取得待ち'}")
        print("3. Vercelトークン設定後、次の1時間ループで数値が出ます")

    return 0 if all_ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
