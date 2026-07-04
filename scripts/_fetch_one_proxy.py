#!/usr/bin/env python3
"""Fetch one character via allorigins proxy; save incoming + cargo_raw."""
import json
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from fetch_wiki_cargo import ROSTER, BASE, FIELDS

PROXIES = ("https://api.allorigins.win/raw?url=",)
SCRIPT = Path(__file__).parent


def fetch_prefix(prefix: str) -> str | None:
    where = urllib.parse.quote(f"moveId LIKE '{prefix}%'")
    target = (
        f"{BASE}?action=cargoquery&tables=SF6_FrameData"
        f"&fields={FIELDS}&where={where}&limit=500&format=json"
    )
    last_exc: Exception | None = None
    for proxy in PROXIES:
        url = proxy + urllib.parse.quote(target, safe="")
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, timeout=90) as resp:
                return resp.read().decode("utf-8")
        except Exception as exc:
            last_exc = exc
    if last_exc:
        raise last_exc
    return None


def main() -> None:
    if len(sys.argv) < 2:
        print("usage: _fetch_one_proxy.py <slug>", file=sys.stderr)
        sys.exit(1)
    slug = sys.argv[1]
    for prefix in ROSTER.get(slug, []):
        for attempt in range(6):
            try:
                text = fetch_prefix(prefix)
                if not text or not text.lstrip().startswith("{"):
                    raise RuntimeError(f"non-JSON: {text[:80]!r}")
                data = json.loads(text)
                if not data.get("cargoquery"):
                    break
                inc = SCRIPT / "incoming" / f"{slug}.webfetch.txt"
                inc.parent.mkdir(parents=True, exist_ok=True)
                inc.write_text(text, encoding="utf-8")
                subprocess.run(
                    [sys.executable, str(SCRIPT / "_apply_webfetch_json.py"), slug, str(inc)],
                    check=True,
                )
                print(json.dumps({"slug": slug, "moves": len(data["cargoquery"]), "prefix": prefix}))
                return
            except Exception as exc:
                print(f"  {prefix} attempt {attempt + 1}: {exc}", file=sys.stderr)
                time.sleep(2 + attempt)
    print(json.dumps({"slug": slug, "failed": True}))
    sys.exit(1)


if __name__ == "__main__":
    main()
