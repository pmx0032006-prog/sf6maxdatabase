#!/usr/bin/env python3
"""Generate SuperCombo Wiki Cargo fetch URLs (full fields) per character slug."""
import json
import urllib.parse
from pathlib import Path

FIELDS = (
    "moveId,input,name,startup,active,recovery,total,guard,cancel,"
    "hitAdv,blockAdv,damage,invuln,DRcancelHit,DRcancelBlk,"
    "afterDRHit,afterDRBlk,hitconfirm,notes"
)

# slug -> primary moveId prefix that returns data from Wiki Cargo
PREFIXES: dict[str, str] = {
    "ryu": "ryu_",
    "ken": "ken_",
    "luke": "Luke_",
    "jamie": "Jamie_",
    "manon": "manon_",
    "kimberly": "kimberly_",
    "marisa": "marisa_",
    "lily": "lily_",
    "jp": "jp_",
    "juri": "Juri_",
    "cammy": "cammy_",
    "guile": "Guile_",
    "chun-li": "Chun-Li_",
    "blanka": "blanka_",
    "dhalsim": "dhalsim_",
    "e-honda": "E-Honda_",
    "dee-jay": "Dee-Jay_",
    "zangief": "zangief_",
    "aki": "a.k.i._",
    "ed": "ed_",
    "rashid": "rashid_",
    "akuma": "akuma_",
    "elena": "elena_",
    "terry": "terry_",
    "mai": "mai_",
    "sagat": "sagat_",
    "c-viper": "c.viper_",
    "alex": "alex_",
    "m-bison": "m.bison_",
}

BASE = "https://wiki.supercombo.gg/api.php"


def url_for(prefix: str) -> str:
    where = urllib.parse.quote(f"moveId LIKE '{prefix}%'")
    return (
        f"{BASE}?action=cargoquery&tables=SF6_FrameData"
        f"&fields={FIELDS}&where={where}&limit=500&format=json"
    )


def main() -> None:
    out = {slug: url_for(prefix) for slug, prefix in PREFIXES.items()}
    path = Path(__file__).parent / "cargo-fetch-urls.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {path} ({len(out)} urls)")


if __name__ == "__main__":
    main()
