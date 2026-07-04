#!/usr/bin/env python3
"""Build src/data/wiki-frame-data.json from cargo_raw (full Wiki fields)."""
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
SCRIPT_DIR = Path(__file__).parent
OUT = ROOT / "src" / "data" / "wiki-frame-data.json"

spec = importlib.util.spec_from_file_location(
    "process_wiki_cargo", SCRIPT_DIR / "process-wiki-cargo.py"
)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

raw_dir = SCRIPT_DIR / "cargo_raw"
data = mod.load_raw_dir(raw_dir)

OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
summary = {slug: len(moves) for slug, moves in data.items()}
print(f"wrote {OUT}")
print(json.dumps(summary, ensure_ascii=False))
