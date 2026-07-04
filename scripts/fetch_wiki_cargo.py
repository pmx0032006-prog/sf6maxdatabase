#!/usr/bin/env python3
"""Fetch SF6 frame data from SuperCombo Wiki Cargo API (character-filtered)."""
import json
import re
import sys
import time
import urllib.parse
import urllib.request

ROSTER: dict[str, list[str]] = {
    "ryu": ["ryu_"],
    "ken": ["ken_", "Ken_"],
    "luke": ["Luke_"],
    "jamie": ["Jamie_", "jamie_"],
    "manon": ["manon_"],
    "kimberly": ["kimberly_", "Kimberly_"],
    "marisa": ["marisa_"],
    "lily": ["lily_"],
    "jp": ["jp_"],
    "juri": ["Juri_", "juri_"],
    "cammy": ["cammy_"],
    "guile": ["Guile_", "guile_"],
    "chun-li": ["Chun-Li_"],
    "blanka": ["blanka_"],
    "dhalsim": ["dhalsim_", "Dhalsim_"],
    "e-honda": ["E-Honda_", "e-honda_"],
    "dee-jay": ["Dee-Jay_", "dee-jay_", "deejay_"],
    "zangief": ["zangief_"],
    "aki": ["a.k.i._", "aki_", "Aki_"],
    "ed": ["ed_"],
    "rashid": ["rashid_"],
    "akuma": ["akuma_"],
    "elena": ["elena_"],
    "terry": ["terry_", "Terry_"],
    "mai": ["mai_"],
    "sagat": ["sagat_"],
    "c-viper": ["c.viper_", "C-Viper_", "c-viper_", "cviper_"],
    "alex": ["alex_"],
    "m-bison": ["m.bison_", "M-Bison_", "m-bison_", "mbison_", "bison_", "ve_"],
    "ingrid": ["ingrid_", "Ingrid_", "ing_"],
}

BASE = "https://wiki.supercombo.gg/api.php"
FIELDS = (
    "moveId,input,name,startup,active,recovery,total,guard,cancel,"
    "hitAdv,blockAdv,damage,invuln,DRcancelHit,DRcancelBlk,"
    "afterDRHit,afterDRBlk,hitconfirm,notes"
)


def fetch(prefix: str) -> dict | None:
    where = urllib.parse.quote(f"moveId LIKE '{prefix}%'")
    url = (
        f"{BASE}?action=cargoquery&tables=SF6_FrameData"
        f"&fields={FIELDS}&where={where}&limit=500&format=json"
    )
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; SF6FrameData/1.0; +local)",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            text = resp.read().decode("utf-8")
        if text.lstrip().startswith("<"):
            return None
        data = json.loads(text)
        if data.get("cargoquery"):
            return data
    except Exception as exc:
        print(f"  error {prefix}: {exc}", file=sys.stderr)
    return None


def main() -> None:
    out_dir = __import__("pathlib").Path(__file__).parent / "cargo_raw"
    out_dir.mkdir(exist_ok=True)
    prefixes_found: list[str] = []

    for slug, prefixes in ROSTER.items():
        saved = False
        for prefix in prefixes:
            print(f"fetch {slug} via {prefix}", file=sys.stderr)
            data = fetch(prefix)
            time.sleep(1.5)
            if not data:
                continue
            (out_dir / f"{slug}.json").write_text(
                json.dumps(data, ensure_ascii=False),
                encoding="utf-8",
            )
            prefixes_found.append(prefix.rstrip("_"))
            print(f"  ok {len(data['cargoquery'])} moves", file=sys.stderr)
            saved = True
            break
        if not saved:
            print(f"  skip {slug}", file=sys.stderr)

    print(json.dumps({"characterPrefixesFound": sorted(set(prefixes_found))}))


if __name__ == "__main__":
    main()
