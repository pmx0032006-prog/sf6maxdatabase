#!/usr/bin/env python3
"""Save cargo_raw/{slug}.json from incoming/{slug}.webfetch.txt files."""
import json
import re
import sys
from pathlib import Path

SCRIPT = Path(__file__).parent
RAW = SCRIPT / "cargo_raw"
INCOMING = SCRIPT / "incoming"

MISSING = [
    "jamie", "manon", "kimberly", "marisa", "lily", "jp", "juri", "guile",
    "chun-li", "blanka", "dhalsim", "e-honda", "dee-jay", "zangief", "aki",
    "ed", "rashid", "akuma", "elena", "terry", "mai", "sagat", "c-viper",
    "alex", "m-bison",
]


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


def save_slug(slug: str, text: str) -> int:
    cargo = extract_cargo(text)
    RAW.mkdir(parents=True, exist_ok=True)
    out = RAW / f"{slug}.json"
    out.write_text(json.dumps(cargo, ensure_ascii=False, indent=2), encoding="utf-8")
    return len(cargo["cargoquery"])


def main() -> None:
    if len(sys.argv) >= 3 and sys.argv[1] == "--stdin":
        slug = sys.argv[2]
        count = save_slug(slug, sys.stdin.read())
        print(f"OK {slug}: {count} moves")
        return

    saved = []
    missing = []
    for slug in MISSING:
        src = INCOMING / f"{slug}.webfetch.txt"
        if not src.exists():
            missing.append(slug)
            continue
        try:
            count = save_slug(slug, src.read_text(encoding="utf-8"))
            saved.append((slug, count))
            print(f"OK {slug}: {count} moves")
        except Exception as exc:
            missing.append(slug)
            print(f"FAIL {slug}: {exc}", file=sys.stderr)
    print("---")
    print(json.dumps({"saved": saved, "missing": missing}, ensure_ascii=False))


if __name__ == "__main__":
    main()
