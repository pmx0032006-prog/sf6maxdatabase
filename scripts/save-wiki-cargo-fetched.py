#!/usr/bin/env python3
"""Save Wiki Cargo JSON fetched via WebFetch (aki + m-bison). Run once, then build-wiki-frame-data.py."""
import json
from pathlib import Path

OUT = Path(__file__).parent / "cargo_raw"

# Source: wiki.supercombo.gg Cargo API (2026-06-21)
AKI_WHERE = "a.k.i._%"
MBISON_WHERE = "m.bison_%"

QUERIES = {
    "aki": (
        "https://wiki.supercombo.gg/api.php?action=cargoquery&tables=SF6_FrameData"
        "&fields=moveId,name,startup,active,recovery,hitAdv,blockAdv"
        f"&where=moveId%20LIKE%20%27{AKI_WHERE.replace('%', '%25')}%27&limit=500&format=json"
    ),
    "m-bison": (
        "https://wiki.supercombo.gg/api.php?action=cargoquery&tables=SF6_FrameData"
        "&fields=moveId,name,startup,active,recovery,hitAdv,blockAdv"
        f"&where=moveId%20LIKE%20%27{MBISON_WHERE.replace('%', '%25')}%27&limit=500&format=json"
    ),
}


def main() -> None:
    import urllib.request

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        ),
        "Accept": "application/json,text/plain,*/*",
    }
    for slug, url in QUERIES.items():
        out = OUT / f"{slug}.json"
        if out.exists():
            print(f"skip {slug} (exists)")
            continue
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        n = len(data.get("cargoquery", []))
        if n == 0:
            print(f"warn {slug}: empty cargoquery")
            continue
        out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"wrote {out} ({n} moves)")


if __name__ == "__main__":
    main()
