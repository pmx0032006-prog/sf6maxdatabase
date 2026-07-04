#!/usr/bin/env python3
"""Process SuperCombo Wiki Cargo JSON into compact per-character frame data."""
import json
import re
import sys
from pathlib import Path

CHAR_PREFIXES: dict[str, list[str]] = {
    "ryu": ["ryu_"],
    "ken": ["ken_", "Ken_"],
    "luke": ["Luke_"],
    "jamie": ["Jamie_"],
    "manon": ["manon_"],
    "kimberly": ["kimberly_"],
    "marisa": ["marisa_", "Marisa_"],
    "lily": ["lily_", "Lily_"],
    "jp": ["jp_", "JP_", "Jp_"],
    "juri": ["juri_", "Juri_"],
    "cammy": ["cammy_"],
    "guile": ["Guile_"],
    "chun-li": ["Chun-Li_", "chun-li_"],
    "blanka": ["blanka_", "Blanka_"],
    "dhalsim": ["dhalsim_", "Dhalsim_"],
    "e-honda": ["e.honda_", "E-Honda_", "e-honda_", "ehonda_"],
    "dee-jay": ["dee_jay_", "Dee-Jay_", "dee-jay_", "deejay_"],
    "zangief": ["zangief_", "Zangief_"],
    "aki": ["a.k.i._", "aki_", "Aki_"],
    "ed": ["ed_", "Ed_"],
    "rashid": ["rashid_", "Rashid_"],
    "akuma": ["akuma_", "Akuma_"],
    "elena": ["elena_", "Elena_"],
    "terry": ["terry_", "Terry_"],
    "mai": ["mai_", "Mai_"],
    "sagat": ["sagat_", "Sagat_"],
    "c-viper": ["c.viper_", "C-Viper_", "c-viper_", "cviper_"],
    "alex": ["alex_", "Alex_"],
    "m-bison": ["m.bison_", "M-Bison_", "m-bison_", "mbison_", "bison_", "ve_"],
    "ingrid": ["ingrid_", "Ingrid_", "ing_"],
}


def clean_markup(value: str | None) -> str:
    if value is None:
        return ""
    s = re.sub(r"\{\{\{[^}]*\}\}\}", "", str(value))
    s = re.sub(r"'''", "", s)
    s = re.sub(r"<br\s*/?>", " / ", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\s+", " ", s).strip()


CARGO_FIELDS = (
    "moveId,input,name,startup,active,recovery,total,guard,cancel,"
    "hitAdv,blockAdv,damage,invuln,DRcancelHit,DRcancelBlk,"
    "afterDRHit,afterDRBlk,hitconfirm,notes"
)


def compute_total(startup: str, active: str, recovery: str) -> str:
    a_str = str(active)
    r_str = str(recovery)
    if (
        r_str == "-"
        or a_str == "-"
        or "+" in r_str
        or "+" in a_str
        or "(" in a_str
        or "(" in r_str
    ):
        return "—"
    s_match = re.match(r"(\d+)", str(startup))
    if not s_match:
        return "—"
    s = int(s_match.group(1))
    a = int(re.match(r"(\d+)", a_str).group(1)) if re.match(r"(\d+)", a_str) else 0
    r = int(re.match(r"(\d+)", r_str).group(1)) if re.match(r"(\d+)", r_str) else 0
    return str(s + a + r - 1)


def strip_prefix(move_id: str, prefixes: list[str]) -> str:
    for prefix in prefixes:
        if move_id.startswith(prefix):
            return move_id[len(prefix) :]
        if move_id.lower().startswith(prefix.lower()):
            return move_id[len(prefix) :]
    m = re.match(r"^[A-Za-z0-9-]+_(.+)$", move_id)
    return m.group(1) if m else move_id


def process_cargo(cargo: dict, char_slug: str) -> dict[str, dict]:
    prefixes = CHAR_PREFIXES.get(char_slug, [f"{char_slug}_"])
    rows = cargo.get("cargoquery") or []
    out: dict[str, dict] = {}
    for item in rows:
        title = item.get("title") or item
        move_id = title.get("moveId", "")
        if not move_id:
            continue
        key = strip_prefix(move_id, prefixes).lower()
        startup = clean_markup(title.get("startup"))
        active = clean_markup(title.get("active"))
        recovery = clean_markup(title.get("recovery"))
        total_raw = clean_markup(title.get("total"))
        out[key] = {
            "nameEn": clean_markup(title.get("name")),
            "nameJa": None,
            "input": clean_markup(title.get("input")),
            "startup": startup,
            "active": active,
            "recovery": recovery,
            "total": total_raw or compute_total(startup, active, recovery),
            "guard": clean_markup(title.get("guard")),
            "cancel": clean_markup(title.get("cancel")),
            "onHit": clean_markup(title.get("hitAdv")),
            "onBlock": clean_markup(title.get("blockAdv")),
            "damage": clean_markup(title.get("damage")),
            "invuln": clean_markup(title.get("invuln")),
            "drCancelHit": clean_markup(title.get("DRcancelHit")),
            "drCancelBlk": clean_markup(title.get("DRcancelBlk")),
            "afterDrHit": clean_markup(title.get("afterDRHit")),
            "afterDrBlk": clean_markup(title.get("afterDRBlk")),
            "hitconfirm": clean_markup(title.get("hitconfirm")),
            "notes": clean_markup(title.get("notes")),
        }
    return out


def load_raw_dir(raw_dir: Path) -> dict:
    result = {}
    for path in sorted(raw_dir.glob("*.json")):
        char = path.stem
        if char not in CHAR_PREFIXES:
            continue
        try:
            cargo = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        if not isinstance(cargo, dict) or "cargoquery" not in cargo:
            continue
        moves = process_cargo(cargo, char)
        if moves:
            result[char] = moves
    return result


def main() -> None:
    raw_dir = Path(__file__).parent / "cargo_raw"
    if len(sys.argv) > 1:
        raw_dir = Path(sys.argv[1])
    data = load_raw_dir(raw_dir)
    print(json.dumps(data, ensure_ascii=False, separators=(",", ":")))


if __name__ == "__main__":
    main()
