#!/usr/bin/env python3
"""Apply sf6maxdatabase.com center-diagonal watermark to public JPGs (in-place)."""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_TARGETS = [
    ROOT / "public" / "images" / "characters",
    ROOT / "public" / "characters",
]

WATERMARK = "sf6maxdatabase.com"
IMAGE_EXTS = {".jpg", ".jpeg", ".webp"}
CACHE_PATH = Path(__file__).resolve().parent / ".watermark-cache.json"
CACHE_VERSION = 2


def file_stamp(path: Path) -> str:
    stat = path.stat()
    return f"{stat.st_size}:{int(stat.st_mtime)}"


def load_cache() -> dict:
    if not CACHE_PATH.is_file():
        return {"version": CACHE_VERSION, "files": {}}
    try:
        data = json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {"version": CACHE_VERSION, "files": {}}
    if data.get("version") != CACHE_VERSION:
        return {"version": CACHE_VERSION, "files": {}}
    return data


def save_cache(data: dict) -> None:
    CACHE_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in (
        Path(r"C:\Windows\Fonts\arial.ttf"),
        Path(r"C:\Windows\Fonts\segoeui.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    ):
        if path.is_file():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def text_size(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=font)
    return box[2] - box[0], box[3] - box[1]


def apply_watermark(path: Path) -> bool:
    with Image.open(path) as opened:
        base = opened.convert("RGBA")
    width, height = base.size
    if width < 40 or height < 24:
        return False

    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    center_font = load_font(max(11, min(width, height) // 11))
    tw, th = text_size(draw, WATERMARK, center_font)
    strip = Image.new("RGBA", (tw + 48, th + 24), (0, 0, 0, 0))
    strip_draw = ImageDraw.Draw(strip)
    strip_draw.text((24, 12), WATERMARK, font=center_font, fill=(0, 0, 0, 45))
    strip_draw.text((23, 11), WATERMARK, font=center_font, fill=(255, 255, 255, 72))
    rotated = strip.rotate(28, expand=True, resample=Image.Resampling.BICUBIC)
    cx = (width - rotated.width) // 2
    cy = (height - rotated.height) // 2
    overlay.alpha_composite(rotated, (cx, cy))

    merged = Image.alpha_composite(base, overlay)
    if path.suffix.lower() in {".jpg", ".jpeg"}:
        merged.convert("RGB").save(path, "JPEG", quality=88, optimize=True)
    else:
        merged.save(path, optimize=True)
    return True


def iter_images(targets: list[Path]) -> list[Path]:
    files: list[Path] = []
    for target in targets:
        if not target.exists():
            continue
        if target.is_file() and target.suffix.lower() in IMAGE_EXTS:
            files.append(target)
            continue
        for path in sorted(target.rglob("*")):
            if path.is_file() and path.suffix.lower() in IMAGE_EXTS:
                files.append(path)
    return files


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Watermark public SF6 images (center diagonal only)."
    )
    parser.add_argument("paths", nargs="*", help="Optional paths (default: public folders)")
    parser.add_argument("--dry-run", action="store_true", help="List files only")
    parser.add_argument("--limit", type=int, default=0, help="Process at most N files")
    parser.add_argument("--force", action="store_true", help="Re-apply even if cached")
    args = parser.parse_args()

    targets = [Path(p) for p in args.paths] if args.paths else DEFAULT_TARGETS
    files = iter_images(targets)
    if args.limit > 0:
        files = files[: args.limit]

    if not files:
        print("No images found.", file=sys.stderr)
        return 1

    if args.dry_run:
        print(f"Would watermark {len(files)} files (center diagonal only)")
        for path in files[:10]:
            print(f"  {path.relative_to(ROOT)}")
        if len(files) > 10:
            print(f"  ... +{len(files) - 10} more")
        return 0

    started = time.time()
    ok = 0
    skipped = 0
    cached = 0
    cache = load_cache()
    files_map: dict[str, str] = cache.setdefault("files", {})

    for index, path in enumerate(files, start=1):
        rel = str(path.relative_to(ROOT)).replace("\\", "/")
        try:
            stamp = file_stamp(path)
            if not args.force and files_map.get(rel) == stamp:
                cached += 1
                continue
            if apply_watermark(path):
                ok += 1
                files_map[rel] = file_stamp(path)
            else:
                skipped += 1
        except Exception as exc:
            print(f"[error] {path}: {exc}", file=sys.stderr)
        if index % 250 == 0 or index == len(files):
            print(f"[watermark] {index}/{len(files)}", file=sys.stderr)

    cache["version"] = CACHE_VERSION
    save_cache(cache)

    elapsed = time.time() - started
    print(
        f"[done] watermarked={ok} cached={cached} skipped={skipped} total={len(files)} "
        f"elapsed={elapsed:.1f}s"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
