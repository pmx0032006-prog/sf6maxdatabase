#!/usr/bin/env python3
"""Save cargo JSON blobs passed as files named {slug}.cargo.txt in scripts/incoming/."""
import json
import re
import shutil
from pathlib import Path

INCOMING = Path(__file__).parent / "incoming"
OUT = Path(__file__).parent / "cargo_raw"


def extract_json(text: str) -> str:
    m = re.search(r"(\{\"cargoquery\".*\})\s*$", text, re.DOTALL)
    if not m:
        raise ValueError("cargo JSON not found")
    return m.group(1)


def main() -> None:
    OUT.mkdir(exist_ok=True)
    if not INCOMING.exists():
        print("no incoming dir")
        return
    for path in INCOMING.glob("*.cargo.txt"):
        slug = path.stem.replace(".cargo", "")
        payload = extract_json(path.read_text(encoding="utf-8"))
        json.loads(payload)
        (OUT / f"{slug}.json").write_text(payload, encoding="utf-8")
        print(f"saved {slug}")


if __name__ == "__main__":
    main()
