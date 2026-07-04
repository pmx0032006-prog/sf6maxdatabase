#!/usr/bin/env python3
"""Save remaining slugs using discovered wiki moveId prefixes."""
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

BASE = "https://wiki.supercombo.gg/api.php"
FIELDS = "moveId,name,startup,active,recovery,hitAdv,blockAdv"
PROXY = "https://api.allorigins.win/raw?url="
RAW = Path(__file__).parent / "cargo_raw"
INCOMING = Path(__file__).parent / "incoming"

SPECS: list[tuple[str, list[str]]] = [
    ("e-honda", ["e.honda_"]),
    ("dee-jay", ["dee_jay_", "Dee-Jay_", "deejay_"]),
    ("aki", ["aki_", "Aki_"]),
    ("elena", ["elena_", "Elena_"]),
    ("c-viper", ["c.viper_", "C-Viper_", "cviper_"]),
    ("m-bison", ["ve_", "M-Bison_", "mbison_", "bison_", "m.bison_"]),
]


def fetch(prefix: str) -> dict | None:
    where = urllib.parse.quote(f"moveId LIKE '{prefix}%'")
    target = (
        f"{BASE}?action=cargoquery&tables=SF6_FrameData"
        f"&fields={FIELDS}&where={where}&limit=500&format=json"
    )
    url = PROXY + urllib.parse.quote(target, safe="")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        text = resp.read().decode("utf-8")
    if not text.lstrip().startswith("{"):
        return None
    data = json.loads(text)
    if data.get("cargoquery"):
        return {"cargoquery": data["cargoquery"]}
    return None


def save(slug: str, cargo: dict) -> int:
    RAW.mkdir(parents=True, exist_ok=True)
    INCOMING.mkdir(parents=True, exist_ok=True)
    text = json.dumps(cargo, ensure_ascii=False)
    (INCOMING / f"{slug}.webfetch.txt").write_text(text, encoding="utf-8")
    (RAW / f"{slug}.json").write_text(
        json.dumps(cargo, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return len(cargo["cargoquery"])


def main() -> None:
    saved = []
    failed = []
    for slug, prefixes in SPECS:
        if (RAW / f"{slug}.json").exists():
            n = len(json.loads((RAW / f"{slug}.json").read_text(encoding="utf-8"))["cargoquery"])
            saved.append({"slug": slug, "moves": n})
            continue
        ok = False
        for prefix in prefixes:
            for attempt in range(5):
                try:
                    cargo = fetch(prefix)
                    if cargo:
                        n = save(slug, cargo)
                        saved.append({"slug": slug, "moves": n, "prefix": prefix})
                        print(f"OK {slug}: {n} ({prefix})")
                        ok = True
                        break
                except Exception as exc:
                    print(f"{slug}/{prefix} #{attempt + 1}: {exc}")
                    time.sleep(3)
            if ok:
                break
        if not ok:
            failed.append(slug)
        time.sleep(2)
    print(json.dumps({"saved": saved, "failed": failed}, ensure_ascii=False))


if __name__ == "__main__":
    main()
