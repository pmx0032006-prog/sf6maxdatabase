#!/usr/bin/env python3
"""Add Vercel Edge middleware to geo-block restricted countries (incl. JP)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MIDDLEWARE = ROOT / "src" / "middleware.ts"

MIDDLEWARE_SRC = """import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Same list as Cloudflare Block Restricted Countries */
const BLOCKED_COUNTRIES = new Set([
  "JP",
  "CN",
  "RU",
  "BY",
  "IR",
  "KP",
  "MM",
  "TM",
  "DO",
  "PK",
]);

export function middleware(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country");
  if (country && BLOCKED_COUNTRIES.has(country)) {
    return new NextResponse("Not Available", {
      status: 451,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\\\..*).*)"],
};
"""


def main() -> int:
    if MIDDLEWARE.exists():
        existing = MIDDLEWARE.read_text(encoding="utf-8")
        if "BLOCKED_COUNTRIES" in existing:
            print("[info] middleware.ts already configured")
            return 0

    MIDDLEWARE.write_text(MIDDLEWARE_SRC, encoding="utf-8")
    print(f"[done] wrote {MIDDLEWARE.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
