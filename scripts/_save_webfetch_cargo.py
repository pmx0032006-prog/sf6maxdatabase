#!/usr/bin/env python3
import json
from pathlib import Path

from curl_cffi import requests

URLS = {
    "ryu": "https://wiki.supercombo.gg/api.php?action=cargoquery&tables=SF6_FrameData&fields=moveId,name,startup,active,recovery,hitAdv,blockAdv&where=moveId%20LIKE%20%27ryu_%25%27&limit=500&format=json",
    "ken": "https://wiki.supercombo.gg/api.php?action=cargoquery&tables=SF6_FrameData&fields=moveId,name,startup,active,recovery,hitAdv,blockAdv&where=moveId%20LIKE%20%27ken_%25%27&limit=500&format=json",
    "luke": "https://wiki.supercombo.gg/api.php?action=cargoquery&tables=SF6_FrameData&fields=moveId,name,startup,active,recovery,hitAdv,blockAdv&where=moveId%20LIKE%20%27Luke_%25%27&limit=500&format=json",
}

OUT_DIR = Path(__file__).parent / "cargo_raw"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def fetch(url: str) -> dict:
    r = requests.get(url, impersonate="chrome120", timeout=90)
    r.raise_for_status()
    text = r.text.strip()
    if not text.startswith("{"):
        raise RuntimeError(f"non-JSON response: {text[:120]!r}")
    data = json.loads(text)
    return {"cargoquery": data["cargoquery"]}


def main() -> None:
    for name, url in URLS.items():
        cargo = fetch(url)
        path = OUT_DIR / f"{name}.json"
        path.write_text(json.dumps(cargo, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"{name}: {len(cargo['cargoquery'])} moves -> {path}")


if __name__ == "__main__":
    main()
