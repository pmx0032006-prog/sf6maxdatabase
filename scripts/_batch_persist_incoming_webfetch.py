#!/usr/bin/env python3
"""Persist all incoming/*.webfetch.txt into cargo_raw/{slug}.json."""
import json
import re
import sys
from pathlib import Path

SCRIPT = Path(__file__).parent
RAW = SCRIPT / "cargo_raw"
INCOMING = SCRIPT / "incoming"


def extract_cargo(text: str) -> dict:
    text = text.strip()
    if text.startswith("{"):
        data = json.loads(text)
    else:
        m = re.search(r"(\{\"cargoquery\".*\})\s*$", text, re.DOTALL)
        if not m:
            raise ValueError("cargo JSON not found")
        data = json.loads(m.group(1))
    if "cargoquery" not in data:
        raise ValueError("missing cargoquery key")
    return {"cargoquery": data["cargoquery"]}


def main() -> None:
    RAW.mkdir(parents=True, exist_ok=True)
    results: list[tuple[str, int]] = []
    failures: list[str] = []
    for src in sorted(INCOMING.glob("*.webfetch.txt")):
        slug = src.name.removesuffix(".webfetch.txt")
        try:
            cargo = extract_cargo(src.read_text(encoding="utf-8"))
            out = RAW / f"{slug}.json"
            out.write_text(json.dumps(cargo, ensure_ascii=False, indent=2), encoding="utf-8")
            count = len(cargo["cargoquery"])
            results.append((slug, count))
            print(f"OK {slug}: {count} moves -> {out}")
        except Exception as exc:
            failures.append(slug)
            print(f"FAIL {slug}: {exc}", file=sys.stderr)
    print("---SUMMARY---")
    print(json.dumps({"saved": results, "failed": failures}, ensure_ascii=False))


if __name__ == "__main__":
    main()
