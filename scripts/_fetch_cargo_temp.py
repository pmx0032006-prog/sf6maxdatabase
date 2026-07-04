import json
import urllib.request
import ssl
from pathlib import Path

URLS = {
    "ryu": "https://wiki.supercombo.gg/api.php?action=cargoquery&tables=SF6_FrameData&fields=moveId,name,startup,active,recovery,hitAdv,blockAdv&where=moveId%20LIKE%20%27ryu_%25%27&limit=500&format=json",
    "ken": "https://wiki.supercombo.gg/api.php?action=cargoquery&tables=SF6_FrameData&fields=moveId,name,startup,active,recovery,hitAdv,blockAdv&where=moveId%20LIKE%20%27ken_%25%27&limit=500&format=json",
    "luke": "https://wiki.supercombo.gg/api.php?action=cargoquery&tables=SF6_FrameData&fields=moveId,name,startup,active,recovery,hitAdv,blockAdv&where=moveId%20LIKE%20%27Luke_%25%27&limit=500&format=json",
}

OUT_DIR = Path(__file__).parent / "cargo_raw"
OUT_DIR.mkdir(parents=True, exist_ok=True)
ctx = ssl.create_default_context()
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

for name, url in URLS.items():
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=90) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    cargo = {"cargoquery": data["cargoquery"]}
    path = OUT_DIR / f"{name}.json"
    path.write_text(json.dumps(cargo, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{name}: {len(cargo['cargoquery'])} entries -> {path}")
