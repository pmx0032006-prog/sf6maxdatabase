#!/usr/bin/env python3
"""Parse jina.ai cargo dump (newlines inside JSON strings) -> cargo_raw/ingrid.json"""
import json
import re
from pathlib import Path

SRC = Path(
    r"C:\Users\pmx00\.cursor\projects\C-Users-pmx00-AppData-Local-Temp-687396b9-97f4-40d4-9538-76a3576ad032\agent-tools\10dae3b7-ab46-4914-876c-74324f7ca516.txt"
)
OUT = Path(__file__).parent / "cargo_raw" / "ingrid.json"


def main() -> None:
    text = SRC.read_text(encoding="utf-8")
    idx = text.find('{"cargoquery"')
    if idx < 0:
        raise SystemExit("cargoquery not found")
    blob = text[idx:].strip()
    blob = re.sub(r"\s+", " ", blob)
    data = json.loads(blob)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {OUT} ({len(data['cargoquery'])} moves)")


if __name__ == "__main__":
    main()
