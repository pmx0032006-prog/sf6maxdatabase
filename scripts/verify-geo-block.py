#!/usr/bin/env python3
"""Verify geo-block on sf6maxdatabase (vercel.app + custom domain)."""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone

URLS = {
    "vercel": "https://sf6maxdatabase.vercel.app/",
    "www": "https://www.sf6maxdatabase.com/",
    "apex": "https://sf6maxdatabase.com/",
}

BLOCKED = {"JP", "CN", "RU", "BY", "IR", "KP", "MM", "TM", "DO", "PK"}


def fetch(name: str, url: str, timeout: int = 20) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "sf6maxdatabase-verify/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read(500).decode("utf-8", errors="replace")
            return {
                "name": name,
                "url": url,
                "status": resp.status,
                "blocked": False,
                "snippet": body[:120],
            }
    except urllib.error.HTTPError as exc:
        body = exc.read(500).decode("utf-8", errors="replace")
        blocked = exc.code in (403, 451) or "Not Available" in body
        return {
            "name": name,
            "url": url,
            "status": exc.code,
            "blocked": blocked,
            "snippet": body[:120],
        }
    except Exception as exc:  # noqa: BLE001
        return {
            "name": name,
            "url": url,
            "status": None,
            "blocked": None,
            "error": str(exc),
        }


def ollama_report(results: list[dict], model: str = "llama3.1:8b") -> str:
    payload = json.dumps(results, ensure_ascii=False, indent=2)
    prompt = (
        "You are a concise assistant for Doc (site owner). "
        "Summarize this geo-block verification in Japanese, 4-6 bullet points, "
        "secretary tone (desu/masu). Mention vercel.app and www separately.\n\n"
        f"DATA:\n{payload}"
    )
    try:
        proc = subprocess.run(
            ["ollama", "run", model, prompt],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=120,
        )
        if proc.returncode == 0 and proc.stdout.strip():
            return proc.stdout.strip()
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass
    return ""


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify geo-block")
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--ollama", action="store_true", help="Append Ollama Japanese summary")
    parser.add_argument("--model", default="llama3.1:8b")
    args = parser.parse_args()

    results = [fetch(name, url) for name, url in URLS.items()]
    vercel = next(r for r in results if r["name"] == "vercel")
    www = next(r for r in results if r["name"] == "www")

    summary = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "vercel_blocked": vercel.get("blocked") is True,
        "vercel_status": vercel.get("status"),
        "www_blocked": www.get("blocked") is True,
        "www_status": www.get("status"),
        "all_ok_for_japan": vercel.get("blocked") is True and www.get("blocked") is True,
        "results": results,
    }

    if args.json:
        print(json.dumps(summary, ensure_ascii=False, indent=2))
    else:
        print("=== Geo-block verification ===")
        for r in results:
            status = r.get("status", "ERR")
            mark = "BLOCKED" if r.get("blocked") else ("OPEN" if r.get("blocked") is False else "UNKNOWN")
            print(f"  [{r['name']}] {status} -> {mark}")
            if r.get("snippet"):
                print(f"    {r['snippet'][:80]!r}")
        print()
        if summary["all_ok_for_japan"]:
            print("[OK] Japan-facing URLs appear blocked from this network.")
        else:
            print("[WARN] Some URLs still reachable — check deploy or network.")

    if args.ollama and not args.json:
        report = ollama_report(results, args.model)
        if report:
            print("\n--- Ollama report ---")
            print(report)

    return 0 if summary["all_ok_for_japan"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
