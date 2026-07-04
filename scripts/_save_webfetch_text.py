#!/usr/bin/env python3
"""Save slug from WebFetch markdown/text passed as argv[2] or stdin."""
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).parent


def main() -> None:
    if len(sys.argv) < 3:
        print("usage: _save_webfetch_text.py <slug> <text-file>", file=sys.stderr)
        sys.exit(1)
    slug = sys.argv[1]
    text = Path(sys.argv[2]).read_text(encoding="utf-8")
    inc = SCRIPT / "incoming" / f"{slug}.webfetch.txt"
    inc.parent.mkdir(parents=True, exist_ok=True)
    inc.write_text(text, encoding="utf-8")
    subprocess.run(
        [sys.executable, str(SCRIPT / "_apply_webfetch_json.py"), slug, str(inc)],
        check=True,
    )


if __name__ == "__main__":
    main()
