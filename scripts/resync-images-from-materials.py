#!/usr/bin/env python3
"""Re-copy character JPGs from desktop materials to public (no watermark)."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MATERIALS = Path(
    r"C:\Users\pmx00\Desktop\ストリートファイター6　攻略サイト　素材\ストリートファイター6　攻略サイト　素材　20260620"
)
THUMB_SRC = MATERIALS / "sf6_samuneiru"

DIRS = {
    "cammy": "cyam_jpg",
    "ryu": "ryu_jpg",
    "ken": "ken_jpg",
    "luke": "ruke_jpg",
    "jamie": "je_jpg",
    "manon": "mannon_jpg",
    "kimberly": "kin_jpg",
    "marisa": "mariza_jpg",
    "lily": "riri_jpg",
    "jp": "jp_jpg",
    "juri": "juri_jpg",
    "guile": "guile_jpg",
    "chun-li": "chun_jpg",
    "blanka": "bla_jpg",
    "dhalsim": "daru_jpg",
    "e-honda": "honda_jpg",
    "dee-jay": "dj_jpg",
    "zangief": "zan_jpg",
    "aki": "aki_jpg",
    "ed": "ed_jpg",
    "rashid": "ras_jpg",
    "akuma": "akuma_jpg",
    "elena": "ere_jpg",
    "terry": "ter_jpg",
    "mai": "mai_jpg",
    "sagat": "sag_jpg",
    "c-viper": "cv_jpg",
    "alex": "are_jpg",
    "m-bison": "ve_jpg",
    "ingrid": "ing_jpg",
}

THUMBS = {
    "aki_sam.jpg": "aki.jpg",
    "are_sam.jpg": "alex.jpg",
    "bra_sam.jpg": "blanka.jpg",
    "cam_sam.jpg": "cammy.jpg",
    "chun_sam.jpg": "chun-li.jpg",
    "cv_sam.jpg": "c-viper.jpg",
    "dar_sam.jpg": "dhalsim.jpg",
    "dee_sam.jpg": "dee-jay.jpg",
    "ed_sam.jpg": "ed.jpg",
    "ere_sam.jpg": "elena.jpg",
    "gou_sam.jpg": "akuma.jpg",
    "gui_sam.jpg": "guile.jpg",
    "honda_sam.jpg": "e-honda.jpg",
    "jei_sam.jpg": "jamie.jpg",
    "jp_sam.jpg": "jp.jpg",
    "ju_sam.jpg": "juri.jpg",
    "ken_sam.jpg": "ken.jpg",
    "kin_sam.jpg": "kimberly.jpg",
    "m.baison_sam.jpg": "m-bison.jpg",
    "mai_sam.jpg": "mai.jpg",
    "man_sam.jpg": "manon.jpg",
    "mari_sam.jpg": "marisa.jpg",
    "ras_sam.jpg": "rashid.jpg",
    "riri_sam.jpg": "lily.jpg",
    "ruu_sam.jpg": "luke.jpg",
    "ryu_sam.jpg": "ryu.jpg",
    "sagat_sam.jpg": "sagat.jpg",
    "ter_sam.jpg": "terry.jpg",
    "zan_sam.jpg": "zangief.jpg",
    "ing_sam.jpg": "ingrid.jpg",
}


def main() -> None:
    total = 0
    for slug, folder in DIRS.items():
        src = MATERIALS / folder
        dest = ROOT / "public" / "images" / "characters" / folder
        if not src.is_dir():
            print(f"[skip] {slug}: {src}")
            continue
        dest.mkdir(parents=True, exist_ok=True)
        count = 0
        for file in src.glob("*.jpg"):
            shutil.copy2(file, dest / file.name)
            count += 1
        total += count
        print(f"[copy] {slug}: {count}")

    thumb_dest = ROOT / "public" / "characters"
    thumb_dest.mkdir(parents=True, exist_ok=True)
    thumbs = 0
    for src_name, dest_name in THUMBS.items():
        src = THUMB_SRC / src_name
        if src.is_file():
            shutil.copy2(src, thumb_dest / dest_name)
            thumbs += 1
    print(f"[done] moves={total} thumbs={thumbs}")


if __name__ == "__main__":
    main()
