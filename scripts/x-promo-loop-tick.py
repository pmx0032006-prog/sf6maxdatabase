#!/usr/bin/env python3
"""Loop tick: regenerate X promo kit if missing; report readiness."""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GEN = ROOT / "scripts" / "generate-x-promo-kit.py"
SETUP = ROOT / "promo" / "x-account-setup.txt"
JSON_KIT = ROOT / "promo" / "x-promo-kit.json"


def run_gen() -> int:
    result = subprocess.run(
        [sys.executable, str(GEN)],
        cwd=ROOT,
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="replace",
    )
    if result.stdout:
        print(result.stdout, end="")
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr)
    return result.returncode


def main() -> int:
    if not SETUP.is_file() or not JSON_KIT.is_file():
        run_gen()

    ready = SETUP.is_file() and JSON_KIT.is_file()
    status = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "kit_ready": ready,
        "setup_file": str(SETUP.relative_to(ROOT)) if SETUP.is_file() else "",
        "manual_step": "Create X account in browser using promo/x-account-setup.txt",
    }
    print("X_PROMO_LOOP_TICK", json.dumps(status, ensure_ascii=False))
    if ready:
        print("X_PROMO_LOOP_OK")
        return 0
    print("X_PROMO_LOOP_PENDING")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
