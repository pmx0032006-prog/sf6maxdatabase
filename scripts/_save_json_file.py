#!/usr/bin/env python3
"""Save raw JSON from file to cargo_raw/{slug}.json and incoming."""
import json
import sys
from pathlib import Path

SCRIPT = Path(__file__).parent
RAW = SCRIPT / "cargo_raw"
INC = SCRIPT / "incoming"


def main() -> None:
    slug = sys.argv[1]
    src = Path(sys.argv[2])
    text = src.read_text(encoding="utf-8").strip()
    if not text.startswith("{"):
        # extract JSON from markdown
        idx = text.find('{"cargoquery"')
        if idx < 0:
            raise SystemExit("no JSON found")
        text = text[idx:]
    data = json.loads(text)
    cargo = {"cargoquery": data["cargoquery"]}
    RAW.mkdir(parents=True, exist_ok=True)
    INC.mkdir(parents=True, exist_ok=True)
    (INC / f"{slug}.webfetch.txt").write_text(json.dumps(cargo, ensure_ascii=False), encoding="utf-8")
    (RAW / f"{slug}.json").write_text(json.dumps(cargo, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"saved {slug}: {len(cargo['cargoquery'])} moves")


if __name__ == "__main__":
    main()
