"""SF6 coaching — next one move via Ollama Qwen. Cursor stays thin."""
from __future__ import annotations

import json
import sys
import urllib.request

MODEL = "qwen2.5:7b"
FACTS = """
事実（これ以外を作るな）:
- 商品: サウジ向け SF6 コーチング。日本在住。元日本代表は KOF 2001。SF6 日本代表ではない。
- Snap 新規垢: JP SF6 Coach / jpsf6coach。公開プロフィール作成済み。顔なしロゴ済み。宣伝ボタンはまだ押していない。
- ロビー垢 revolvelobbyjp は別。混ぜない。
- ローカル頁: http://localhost:3000/coach あり。本文はアラビア語＋英語。日本語本文は載せていない。
- 本番 https://www.sf6maxdatabase.com には /coach はまだ出ていない。
- Snap の中を Python で自動操作しない（垢停止）。
- スマホ必須にしない。PC の公式画面でよい。
- 木は C:\\Users\\pmx00\\sf6_site だけ。闘魂ロビー木は触らない。
"""

PROMPT = f"""あなたは日本語の秘書＋先生。ですます調。ロールプレイ禁止。
{FACTS}
ドクは流れが分からない。出力は日本語3行だけ。番号付き。選択肢を並べるな。
1 いま: Snap垢とローカルのコーチ頁まではできた。本番サイトにはまだ無い。
2 次の1手: ドクは http://localhost:3000/coach を見て「これでやって」（本番に載せる）と言う。
3 やらない: Snap自動操作、宣伝ボタン、日本語本文の追加、ロビー垢。
"""


def main() -> int:
    body = json.dumps(
        {
            "model": MODEL,
            "prompt": PROMPT,
            "stream": False,
            "options": {"temperature": 0.1},
        },
        ensure_ascii=False,
    ).encode("utf-8")
    req = urllib.request.Request(
        "http://127.0.0.1:11434/api/generate",
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    with urllib.request.urlopen(req, timeout=90) as res:
        data = json.loads(res.read().decode("utf-8"))
    text = (data.get("response") or "").strip()
    out = sys.stdout
    if hasattr(out, "reconfigure"):
        out.reconfigure(encoding="utf-8")
    print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
