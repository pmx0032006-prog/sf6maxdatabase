#!/usr/bin/env python3
"""Save cargo_raw/*.json from incoming/*.webfetch.txt (WebFetch markdown responses)."""
import json
import re
from pathlib import Path

RAW_DIR = Path(__file__).parent / "cargo_raw"
INCOMING = Path(__file__).parent / "incoming"
CHARS = ("ryu", "ken", "luke")


def extract_cargo(text: str) -> dict:
    text = text.strip()
    if text.startswith("{"):
        data = json.loads(text)
    else:
        m = re.search(r"(\{\"cargoquery\".*\})\s*$", text, re.DOTALL)
        if not m:
            raise ValueError("cargo JSON not found")
        data = json.loads(m.group(1))
    return {"cargoquery": data["cargoquery"]}


def main() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    for name in CHARS:
        src = INCOMING / f"{name}.webfetch.txt"
        if not src.exists():
            src = INCOMING / f"{name}.cargo.txt"
        text = src.read_text(encoding="utf-8")
        cargo = extract_cargo(text)
        out = RAW_DIR / f"{name}.json"
        out.write_text(json.dumps(cargo, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"{name}: {len(cargo['cargoquery'])} raw moves -> {out}")


if __name__ == "__main__":
    main()
