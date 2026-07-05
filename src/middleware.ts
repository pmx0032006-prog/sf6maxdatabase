import { NextResponse } from "next/server";
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
