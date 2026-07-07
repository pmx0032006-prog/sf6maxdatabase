#!/usr/bin/env python3
"""Verify matchup memo dock lock UI is present."""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TABLE = ROOT / "src" / "components" / "MatchupTable.tsx"


def main() -> int:
    text = TABLE.read_text(encoding="utf-8")
    checks = {
        "memo_dock_sticky": "sticky top-14" in text,
        "table_scroll_panel": "max-h-[calc(100dvh-12rem)]" in text and "overflow-y-auto" in text,
        "note_content": "NoteContent" in text,
        "hint_text": "スクロールしても追従" in text,
    }
    all_ok = all(checks.values())
    payload = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        **checks,
        "all_ok": all_ok,
    }
    print("MATCHUP_NOTE_LOOP_TICK", json.dumps(payload, ensure_ascii=False))
    print("MATCHUP_NOTE_LOOP_OK" if all_ok else "MATCHUP_NOTE_LOOP_PENDING")
    return 0 if all_ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
