#!/usr/bin/env python3
"""Add YASMINE to SF6 MAX DATABASE (roster / images / thumb / frame data / audit).

Run on Doc's PC:   cd C:\\Users\\pmx00\\sf6_site
                   python scripts\\add-yasmine.py          (apply)
                   python scripts\\add-yasmine.py --dry    (only report)
No git commands. Report -> scripts/_yasmine_report.txt
"""
import importlib.util
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

DRY = "--dry" in sys.argv
ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "scripts"
SLUG, EN, JA, DIR = "yasmine", "YASMINE", "ヤスミン", "yas_jpg"
REPORT: list[str] = []


def log(msg: str) -> None:
    print(msg)
    REPORT.append(msg)


def read(p: Path) -> str:
    return p.read_bytes().decode("utf-8")


def write(p: Path, text: str) -> None:
    if not DRY:
        p.write_bytes(text.encode("utf-8"))


def insert_after_line(rel: str, anchor: re.Pattern, new_line: str) -> None:
    """Insert new_line after the first line matching anchor (keeps CRLF/LF)."""
    p = ROOT / rel
    text = read(p)
    if SLUG in text:
        log(f"[skip] {rel}: already has {SLUG}")
        return
    lines = text.splitlines(keepends=True)
    for i, line in enumerate(lines):
        if anchor.search(line):
            nl = "\r\n" if line.endswith("\r\n") else "\n"
            lines.insert(i + 1, new_line + nl)
            write(p, "".join(lines))
            log(f"[edit] {rel}: +{SLUG}")
            return
    log(f"[WARN] {rel}: anchor not found, NOT edited")


# 1) code registration ------------------------------------------------------
insert_after_line(
    "src/data/characters.ts",
    re.compile(r'slug:\s*"ingrid"'),
    f'  {{ slug: "{SLUG}", en: "{EN}", ja: "{JA}", thumb: "/characters/{SLUG}.jpg" }},',
)
insert_after_line(
    "src/lib/character-image-path.ts",
    re.compile(r'^\s*ingrid:\s*"ing_jpg"'),
    f'  {SLUG}: "{DIR}",',
)
insert_after_line(
    "src/lib/wiki-full-ui.ts",
    re.compile(r'^\s*"ingrid",'),
    f'  "{SLUG}",',
)
prefix_line = f'    "{SLUG}": ["yasmine_", "Yasmine_", "yas_"],'
for rel in ("scripts/process-wiki-cargo.py", "scripts/fetch_wiki_cargo.py"):
    insert_after_line(rel, re.compile(r'^\s*"ingrid":\s*\['), prefix_line)

# 2) images -----------------------------------------------------------------
TRASH = [
    re.compile(r"_test\.(jpe?g|png|webp)$", re.I),
    re.compile(r"test\.(jpe?g|png|webp)$", re.I),
    re.compile(r"名称未設定"),
    re.compile(r"未設定-\d+\.(jpe?g|png|webp)$"),
]
desk = Path.home() / "Desktop"
src_dir = None
for pat in (f"*20260706*/{DIR}", f"*/*20260706*/{DIR}"):
    hits = [h for h in desk.glob(pat) if h.is_dir()]
    if hits:
        src_dir = hits[0]
        break
if not src_dir:
    log(f"[ERROR] {DIR} not found under {desk} (20260706 folder)")
else:
    dest = ROOT / "public" / "images" / "characters" / DIR
    files = [
        f for f in src_dir.iterdir()
        if re.search(r"\.(jpe?g|png|webp)$", f.name, re.I)
        and not any(t.search(f.name) for t in TRASH)
    ]
    log(f"[images] source: {src_dir}  -> {len(files)} files")
    if not DRY:
        dest.mkdir(parents=True, exist_ok=True)
        for f in files:
            shutil.copy2(f, dest / f.name)
    non_prefixed = [f.name for f in files if not f.name.lower().startswith("yas_")]
    if non_prefixed:
        log(f"[WARN] files without yas_ prefix: {non_prefixed[:10]}")
    # thumbnail
    thumb_dir = src_dir.parent / "sf6_samuneiru"
    cands = sorted(thumb_dir.glob("yas*")) if thumb_dir.is_dir() else []
    if cands:
        t_dest = ROOT / "public" / "characters" / f"{SLUG}.jpg"
        if not DRY:
            t_dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(cands[0], t_dest)
        log(f"[thumb] {cands[0].name} -> public/characters/{SLUG}.jpg")
    else:
        log("[WARN] thumbnail yas* not found in sf6_samuneiru (roster thumb will 404)")

# 3) frame data (Cargo) -----------------------------------------------------
def load_mod(name: str, fname: str):
    spec = importlib.util.spec_from_file_location(name, SCRIPTS / fname)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


raw_dir = SCRIPTS / "cargo_raw"
raw_file = raw_dir / f"{SLUG}.json"
incoming = SCRIPTS / "incoming" / f"{SLUG}.json"
cargo = None
if raw_file.exists():
    cargo = json.loads(read(raw_file))
    log(f"[cargo] using existing {raw_file.name}")
elif incoming.exists():
    cargo = json.loads(read(incoming))
    log(f"[cargo] using incoming/{incoming.name}")
else:
    fetch_mod = load_mod("fetch_wiki_cargo", "fetch_wiki_cargo.py")
    for prefix in ("yasmine_", "Yasmine_", "yas_"):
        log(f"[cargo] try prefix {prefix}")
        cargo = fetch_mod.fetch(prefix)
        if cargo:
            break
    if cargo and not DRY:
        raw_dir.mkdir(exist_ok=True)
        raw_file.write_text(json.dumps(cargo, ensure_ascii=False), encoding="utf-8")

if not cargo:
    log("[BLOCKED] Cargo data not obtained (wiki bot protection?). "
        "Put JSON at scripts/incoming/yasmine.json and rerun.")
else:
    proc = load_mod("process_wiki_cargo", "process-wiki-cargo.py")
    moves = proc.process_cargo(cargo, SLUG)
    log(f"[cargo] processed {len(moves)} moves")
    out = ROOT / "src" / "data" / "wiki-frame-data.json"
    data = json.loads(read(out))
    before = len(data)
    if moves:
        data[SLUG] = moves
        if not DRY:
            shutil.copy2(out, out.with_suffix(".json.bak"))
            write(out, json.dumps(data, ensure_ascii=False, indent=2))
        log(f"[json] wiki-frame-data.json characters {before} -> {len(data)} (backup .bak)")

# 4) scan: other files that mention ingrid (to spot missing yasmine) --------
log("[scan] src files mentioning 'ingrid' but not 'yasmine':")
for p in sorted((ROOT / "src").rglob("*")):
    if p.suffix in (".ts", ".tsx") and p.is_file():
        try:
            t = read(p)
        except Exception:
            continue
        if "ingrid" in t.lower() and SLUG not in t.lower():
            log(f"   {p.relative_to(ROOT)}")

# 5) audit ------------------------------------------------------------------
if not DRY:
    try:
        r = subprocess.run(
            "npx tsx scripts/audit-all-characters.ts",
            cwd=ROOT, shell=True, capture_output=True, text=True,
            encoding="utf-8", errors="replace", timeout=600,
        )
        lines = (r.stdout + r.stderr).splitlines()
        yas = [l for l in lines if "yas" in l.lower()]
        log("[audit] tail:")
        REPORT.extend(lines[-15:])
        log("[audit] yasmine lines: " + (" | ".join(yas[:20]) or "(none)"))
    except Exception as e:
        log(f"[audit] failed: {e}")

(SCRIPTS / "_yasmine_report.txt").write_text("\n".join(REPORT), encoding="utf-8")
print("\nreport -> scripts/_yasmine_report.txt")
