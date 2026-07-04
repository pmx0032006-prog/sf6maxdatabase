#!/usr/bin/env python3
"""Fetch missing SF6 cargo via CORS proxy fallback, save to cargo_raw/."""
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from fetch_wiki_cargo import ROSTER, FIELDS, BASE, fetch

TO_FETCH = [
    "jamie", "manon", "kimberly", "marisa", "lily", "jp", "juri", "guile",
    "chun-li", "blanka", "dhalsim", "e-honda", "dee-jay", "zangief", "aki",
    "ed", "rashid", "akuma", "elena", "terry", "mai", "sagat", "c-viper",
    "alex", "m-bison",
]

OUT = Path(__file__).parent / "cargo_raw"
PROXY = "https://api.allorigins.win/raw?url="


def fetch_via_proxy(prefix: str) -> dict | None:
    where = urllib.parse.quote(f"moveId LIKE '{prefix}%'")
    target = (
        f"{BASE}?action=cargoquery&tables=SF6_FrameData"
        f"&fields={FIELDS}&where={where}&limit=500&format=json"
    )
    url = PROXY + urllib.parse.quote(target, safe="")
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (compatible; SF6FrameData/1.0)"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            text = resp.read().decode("utf-8")
        if not text.lstrip().startswith("{"):
            return None
        data = json.loads(text)
        if data.get("cargoquery"):
            return {"cargoquery": data["cargoquery"]}
    except Exception as exc:
        print(f"  proxy error {prefix}: {exc}", file=sys.stderr)
    return None


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    saved: list[tuple[str, int, str]] = []
    failed: list[str] = []

    for slug in TO_FETCH:
        if (OUT / f"{slug}.json").exists() and slug not in TO_FETCH:
            continue
        ok = False
        for prefix in ROSTER.get(slug, []):
            print(f"fetch {slug} via {prefix}", flush=True)
            data = fetch(prefix)
            if not data:
                data = fetch_via_proxy(prefix)
            time.sleep(1.0)
            if not data:
                continue
            path = OUT / f"{slug}.json"
            path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            count = len(data["cargoquery"])
            saved.append((slug, count, prefix))
            print(f"  ok {count} moves ({prefix})", flush=True)
            ok = True
            break
        if not ok:
            failed.append(slug)
            print(f"  FAILED {slug}", flush=True)

    print("---SUMMARY---")
    print(json.dumps({"saved": saved, "failed": failed}, ensure_ascii=False))


if __name__ == "__main__":
    main()
