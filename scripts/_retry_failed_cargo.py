#!/usr/bin/env python3
"""Retry failed cargo fetches with backoff."""
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from fetch_wiki_cargo import ROSTER, fetch

FAILED = [
    "jamie", "manon", "kimberly", "marisa", "lily", "juri", "guile",
    "dhalsim", "e-honda", "dee-jay", "aki", "ed", "rashid", "akuma",
    "elena", "terry", "c-viper", "alex", "m-bison",
]
OUT = Path(__file__).parent / "cargo_raw"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    saved = []
    still_failed = []
    for slug in FAILED:
        if (OUT / f"{slug}.json").exists():
            data = json.loads((OUT / f"{slug}.json").read_text(encoding="utf-8"))
            saved.append((slug, len(data["cargoquery"]), "existing"))
            continue
        ok = False
        for attempt in range(3):
            for prefix in ROSTER.get(slug, []):
                print(f"try {slug} {prefix} attempt {attempt+1}", flush=True)
                data = fetch(prefix)
                time.sleep(3 + attempt * 2)
                if not data or not data.get("cargoquery"):
                    continue
                (OUT / f"{slug}.json").write_text(
                    json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
                )
                saved.append((slug, len(data["cargoquery"]), prefix))
                print(f"  ok {len(data['cargoquery'])}", flush=True)
                ok = True
                break
            if ok:
                break
        if not ok:
            still_failed.append(slug)
    print("---SUMMARY---")
    print(json.dumps({"saved": saved, "failed": still_failed}, ensure_ascii=False))


if __name__ == "__main__":
    main()
