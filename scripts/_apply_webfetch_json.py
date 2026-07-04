#!/usr/bin/env python3
"""Write cargo_raw/*.json from WebFetch-extracted cargoquery payloads."""
import json
import re
import sys
from pathlib import Path

RAW_DIR = Path(__file__).parent / "cargo_raw"
INCOMING = Path(__file__).parent / "incoming"


def extract_cargo(text: str) -> dict:
    text = text.strip()
    if text.startswith("{"):
        data = json.loads(text)
    else:
        m = re.search(r"(\{\"cargoquery\".*\})\s*$", text, re.DOTALL)
        if not m:
            raise ValueError("cargo JSON not found in text")
        data = json.loads(m.group(1))
    if "cargoquery" not in data:
        raise ValueError("missing cargoquery key")
    return {"cargoquery": data["cargoquery"]}


def save_char(name: str, text: str) -> int:
    cargo = extract_cargo(text)
    path = RAW_DIR / f"{name}.json"
    path.write_text(json.dumps(cargo, ensure_ascii=False, indent=2), encoding="utf-8")
    return len(cargo["cargoquery"])


def main() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    if len(sys.argv) < 2:
        print("usage: apply_webfetch_json.py <char> <file>")
        sys.exit(1)
    name = sys.argv[1]
    src = Path(sys.argv[2])
    count = save_char(name, src.read_text(encoding="utf-8"))
    print(f"saved {name}: {count} moves -> {RAW_DIR / (name + '.json')}")


if __name__ == "__main__":
    main()
