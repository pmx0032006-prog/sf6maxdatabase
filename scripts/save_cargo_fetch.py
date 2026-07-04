#!/usr/bin/env python3
"""Save raw cargo JSON lines from stdin (extract JSON object from mixed text)."""
import json
import re
import sys
from pathlib import Path

raw_dir = Path(__file__).parent / "cargo_raw"
raw_dir.mkdir(exist_ok=True)

text = sys.stdin.read()
match = re.search(r"(\{\"cargoquery\".*\})\s*$", text, re.DOTALL)
if not match:
    print("No cargo JSON found", file=sys.stderr)
    sys.exit(1)
payload = match.group(1)
char = sys.argv[1] if len(sys.argv) > 1 else "unknown"
out = raw_dir / f"{char}.json"
out.write_text(payload, encoding="utf-8")
data = json.loads(payload)
print(f"saved {char}: {len(data.get('cargoquery', []))} moves -> {out}")
