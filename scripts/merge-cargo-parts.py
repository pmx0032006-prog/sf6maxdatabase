#!/usr/bin/env python3
"""Merge paginated Wiki Cargo snapshots into scripts/cargo_raw/*.json."""
import json
from pathlib import Path

RAW = Path(__file__).parent / "cargo_raw"


def merge_parts(slug: str, parts: list[str]) -> None:
    merged: list[dict] = []
    seen: set[str] = set()
    for name in parts:
        path = RAW / name
        if not path.exists():
            print(f"missing {path}")
            continue
        cargo = json.loads(path.read_text(encoding="utf-8"))
        for item in cargo.get("cargoquery", []):
            move_id = (item.get("title") or item).get("moveId", "")
            if move_id and move_id not in seen:
                seen.add(move_id)
                merged.append(item)
    out = RAW / f"{slug}.json"
    out.write_text(
        json.dumps({"cargoquery": merged}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"wrote {out} ({len(merged)} moves)")


def main() -> None:
    merge_parts("aki", ["aki_p1.json", "aki_p2.json"])
    # m-bison is saved as a single snapshot file
    if (RAW / "m-bison_snapshot.json").exists() and not (RAW / "m-bison.json").exists():
        (RAW / "m-bison.json").write_text(
            (RAW / "m-bison_snapshot.json").read_text(encoding="utf-8"),
            encoding="utf-8",
        )
        print("copied m-bison_snapshot.json -> m-bison.json")


if __name__ == "__main__":
    main()
