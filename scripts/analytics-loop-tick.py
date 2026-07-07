#!/usr/bin/env python3
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
        "閲覧数・国トップ3を確認してください。\n\n"
        + urls["analytics"]
        + "\n\n（Vercelダッシュボード → sf6maxdatabase → Analytics）",
    )
    print("ANALYTICS_LOOP_OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
