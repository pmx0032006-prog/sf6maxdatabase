#!/usr/bin/env python3
"""Concatenate incoming/*_part*.txt fragments and save cargo_raw/*.json."""
import json
from pathlib import Path

ROOT = Path(__file__).parent
INCOMING = ROOT / "incoming"
RAW = ROOT / "cargo_raw"
RAW.mkdir(parents=True, exist_ok=True)


def save(name: str) -> int:
    parts = sorted(INCOMING.glob(f"{name}_part*.txt"))
    if not parts:
        raise FileNotFoundError(f"missing fragments for {name}")
    text = "".join(p.read_text(encoding="utf-8") for p in parts)
    data = json.loads(text)
    cargo = {"cargoquery": data["cargoquery"]}
    out = RAW / f"{name}.json"
    out.write_text(json.dumps(cargo, ensure_ascii=False, indent=2), encoding="utf-8")
    return len(cargo["cargoquery"])


def main() -> None:
    for name in ("ryu", "ken", "luke"):
        count = save(name)
        print(f"{name}: {count} moves -> {RAW / (name + '.json')}")


if __name__ == "__main__":
    main()
