#!/usr/bin/env python3
"""Fetch remaining missing slugs via multi-proxy."""
import json
import subprocess
import sys
import time
from pathlib import Path

SCRIPT = Path(__file__).parent
sys.path.insert(0, str(SCRIPT))
from fetch_wiki_cargo import ROSTER

MISSING = [
    "dhalsim", "e-honda", "dee-jay", "aki", "elena", "c-viper", "m-bison",
]


def main() -> None:
    raw = SCRIPT / "cargo_raw"
    saved = []
    failed = []
    for slug in MISSING:
        if (raw / f"{slug}.json").exists():
            data = json.loads((raw / f"{slug}.json").read_text(encoding="utf-8"))
            saved.append({"slug": slug, "moves": len(data["cargoquery"]), "source": "existing"})
            continue
        rc = subprocess.run(
            [sys.executable, str(SCRIPT / "_fetch_one_proxy.py"), slug],
            capture_output=True,
            text=True,
        )
        print(rc.stdout, end="")
        print(rc.stderr, end="", file=sys.stderr)
        if rc.returncode == 0 and (raw / f"{slug}.json").exists():
            data = json.loads((raw / f"{slug}.json").read_text(encoding="utf-8"))
            saved.append({"slug": slug, "moves": len(data["cargoquery"])})
        else:
            failed.append(slug)
        time.sleep(2)
    print(json.dumps({"saved": saved, "failed": failed}, ensure_ascii=False))


if __name__ == "__main__":
    main()
