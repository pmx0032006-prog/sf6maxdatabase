#!/usr/bin/env python3
"""Hourly SF6 loop: matchup memo dock + analytics alarm URL."""
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


def main() -> int:
    matchup_code, matchup_out = run(MATCHUP)
    analytics_code, analytics_out = run(ANALYTICS)
    print(matchup_out, end="")
    print(analytics_out, end="")

    analytics = parse_line(analytics_out, "ANALYTICS_LOOP_TICK") or {}

    if matchup_code != 0 and DOCK_PATCH.is_file():
        subprocess.run([sys.executable, str(DOCK_PATCH)], cwd=ROOT, check=False)

    matchup_ok = matchup_code == 0
    analytics_ok = analytics_code == 0
    all_ok = matchup_ok and analytics_ok
    payload = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "matchup_ok": matchup_ok,
        "analytics_ok": analytics_ok,
        "analytics_mode": analytics.get("mode", "manual_alarm"),
        "all_ok": all_ok,
    }
    print("SF6_HOURLY_LOOP_TICK", json.dumps(payload, ensure_ascii=False))
    print("SF6_HOURLY_LOOP_OK" if all_ok else "SF6_HOURLY_LOOP_PENDING")

    urls = analytics.get("urls") or {}
    print("--- ドク向け報告 ---")
    print(f"1. メモ欄ロック: {'OK' if matchup_ok else '要確認'}")
    print("2. アナリティクス: アラーム済み（ドクがURLを開いて確認）")
    print(f"3. 分析URL: {urls.get('analytics', 'https://vercel.com/dashboard')}")
    print(f"   サイト: {urls.get('site', 'https://www.sf6maxdatabase.com')}")

    return 0 if all_ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
