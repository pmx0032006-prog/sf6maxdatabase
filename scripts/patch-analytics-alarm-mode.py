#!/usr/bin/env python3
"""Switch analytics to manual alarm + dashboard URL (no API token)."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ANALYTICS = ROOT / "scripts" / "analytics-loop-tick.py"
HOURLY = ROOT / "scripts" / "sf6-hourly-loop-tick.py"
CONFIG = ROOT / "scripts" / "vercel_analytics_config.json"
PUSH = ROOT / "scripts" / "push_to_github.py"

ANALYTICS_PY = '''#!/usr/bin/env python3
"""Manual analytics alarm: beep + dashboard URL (Doc checks in browser)."""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "scripts" / "vercel_analytics_config.json"


def load_config() -> dict:
    if CONFIG.is_file():
        return json.loads(CONFIG.read_text(encoding="utf-8"))
    return {}


def ring_alarm(title: str, message: str) -> None:
    try:
        import winsound

        for _ in range(2):
            winsound.MessageBeep(winsound.MB_ICONEXCLAMATION)
    except Exception:
        pass
    try:
        t = title.replace("'", "''")
        m = message.replace("'", "''")
        subprocess.run(
            [
                "powershell",
                "-NoProfile",
                "-Command",
                "Add-Type -AssemblyName System.Windows.Forms; "
                f"[System.Windows.Forms.MessageBox]::Show('{m}', '{t}')",
            ],
            check=False,
            timeout=30,
        )
    except Exception:
        pass


def main() -> int:
    cfg = load_config()
    checked_at = datetime.now(timezone.utc).isoformat()
    urls = {
        "analytics": str(
            cfg.get("analytics_url")
            or "https://vercel.com/dashboard → sf6maxdatabase → Analytics"
        ),
        "site": str(cfg.get("site_url") or "https://www.sf6maxdatabase.com"),
        "dashboard": str(cfg.get("dashboard_url") or "https://vercel.com/dashboard"),
    }
    payload = {
        "checked_at": checked_at,
        "status": "manual_alarm",
        "mode": "doc_opens_url",
        "urls": urls,
        "checklist": [
            "Page Views（閲覧数）",
            "Visitors（訪問者）",
            "Country パネルで国トップ3",
        ],
    }
    print("ANALYTICS_LOOP_TICK", json.dumps(payload, ensure_ascii=False))
    print("ANALYTICS_ALARM")
    print("=== SF6 アナリティクス確認 ===")
    print(f"サイト: {urls['site']}")
    print(f"分析: {urls['analytics']}")
    print("見る項目: 閲覧数 / 訪問者 / 国トップ3")
    ring_alarm(
        "SF6 アナリティクス",
        "閲覧数・国トップ3を確認してください。\\n\\n"
        + urls["analytics"]
        + "\\n\\n（Vercelダッシュボード → sf6maxdatabase → Analytics）",
    )
    print("ANALYTICS_LOOP_OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
'''

HOURLY_PY = '''#!/usr/bin/env python3
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
'''

CONFIG_JSON = '''{
  "project_name": "sf6maxdatabase",
  "site_url": "https://www.sf6maxdatabase.com",
  "dashboard_url": "https://vercel.com/dashboard",
  "analytics_url": "https://vercel.com/dashboard（sf6maxdatabase → 左メニュー Analytics）",
  "mode": "manual_alarm"
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
    ANALYTICS.write_text(ANALYTICS_PY, encoding="utf-8")
    HOURLY.write_text(HOURLY_PY, encoding="utf-8")
    CONFIG.write_text(CONFIG_JSON, encoding="utf-8")
    print("[done] analytics -> manual alarm + URL mode")

    git(
        "add",
        "scripts/analytics-loop-tick.py",
        "scripts/sf6-hourly-loop-tick.py",
        "scripts/vercel_analytics_config.json",
        "scripts/patch-analytics-alarm-mode.py",
    )
    commit = git("commit", "-m", "Analytics manual alarm mode with dashboard URL")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
