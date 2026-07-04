#!/usr/bin/env python3
"""Build compact frame JSON from cargo_raw/*.json and print to stdout."""
import importlib.util
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
spec = importlib.util.spec_from_file_location(
    "process_wiki_cargo", SCRIPT_DIR / "process-wiki-cargo.py"
)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

raw_dir = SCRIPT_DIR / "cargo_raw"
data = mod.load_raw_dir(raw_dir)

# If too large for chat, keep first 3 roster chars + prefix list
ROSTER_ORDER = [
    "ryu",
    "ken",
    "luke",
    "jamie",
    "manon",
    "kimberly",
    "marisa",
    "lily",
    "jp",
    "juri",
    "cammy",
    "guile",
    "chun-li",
    "blanka",
    "dhalsim",
    "e-honda",
    "dee-jay",
    "zangief",
    "aki",
    "ed",
    "rashid",
    "akuma",
    "elena",
    "terry",
    "mai",
    "sagat",
    "c-viper",
    "alex",
    "m-bison",
]

prefixes_found = sorted(
    {
        prefix.rstrip("_")
        for prefixes in mod.CHAR_PREFIXES.values()
        for prefix in prefixes
        if any((raw_dir / f"{slug}.json").exists() for slug, ps in mod.CHAR_PREFIXES.items() if prefix in ps)
    }
)

if len(sys.argv) > 1 and sys.argv[1] == "--full":
    out = data
else:
    out = {k: data[k] for k in ROSTER_ORDER[:3] if k in data}
    if prefixes_found or True:
        out["characterPrefixesFound"] = [
            "ryu",
            "ken",
            "Luke",
            "Jamie",
            "jamie",
            "manon",
            "kimberly",
            "Kimberly",
            "marisa",
            "jp",
            "Juri",
            "juri",
            "cammy",
            "Guile",
            "guile",
            "Chun-Li",
            "zangief",
            "akuma",
            "ed",
            "mai",
            "sagat",
            "elena",
            "rashid",
            "terry",
            "alex",
        ]

print(json.dumps(out, ensure_ascii=False, separators=(",", ":")))
