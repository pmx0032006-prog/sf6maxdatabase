#!/usr/bin/env python3
from pathlib import Path

LAYOUT = Path(__file__).resolve().parent.parent / "src" / "app" / "layout.tsx"
TOKEN = "3e22c3d0-b35a-419f-b3f4-efc54540e266"
CONTENT_LINE = (
    f'        <meta name="impact-site-verification" content="{TOKEN}" />'
)


def main() -> int:
    text = LAYOUT.read_text(encoding="utf-8")
    if f'content="{TOKEN}"' in text:
        print("[info] content= meta already present")
        return 0
    anchor = (
        f"        <meta name='impact-site-verification' value='{TOKEN}' />"
    )
    if anchor not in text:
        print("[error] value= meta not found")
        return 1
    LAYOUT.write_text(
        text.replace(anchor, anchor + "\n" + CONTENT_LINE, 1),
        encoding="utf-8",
    )
    print("[done] added content= meta")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
