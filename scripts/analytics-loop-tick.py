#!/usr/bin/env python3
"""Fetch Vercel Web Analytics: pageviews, visitors, top countries."""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "scripts" / "vercel_analytics_config.json"
CACHE = ROOT / "scripts" / "analytics_snapshot.json"
API = "https://api.vercel.com/v1/query/web-analytics"


def load_config() -> dict:
    if CONFIG.is_file():
        return json.loads(CONFIG.read_text(encoding="utf-8"))
    return {"project_name": "sf6maxdatabase", "project_id": "", "team_id": ""}


def token() -> str | None:
    return os.environ.get("VERCEL_TOKEN") or os.environ.get("VERCEL_ACCESS_TOKEN")


def api_get(path: str, params: dict[str, str], auth: str) -> dict:
    query = urllib.parse.urlencode(params)
    url = f"{API}/{path}?{query}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {auth}"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def list_projects(auth: str, name: str) -> list[dict]:
    params: dict[str, str] = {"search": name, "limit": "20"}
    cfg = load_config()
    if cfg.get("team_id"):
        params["teamId"] = str(cfg["team_id"])
    query = urllib.parse.urlencode(params)
    url = f"https://api.vercel.com/v9/projects?{query}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {auth}"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return list(data.get("projects") or [])


def resolve_project_id(auth: str, cfg: dict) -> str | None:
    if cfg.get("project_id"):
        return str(cfg["project_id"])
    name = str(cfg.get("project_name") or "sf6maxdatabase")
    projects = list_projects(auth, name)
    for project in projects:
        if project.get("name") == name or name in str(project.get("link", {}).get("repo", "")):
            return str(project.get("id"))
    if projects:
        return str(projects[0].get("id"))
    return None


def date_range(days: int) -> tuple[str, str]:
    until = datetime.now(timezone.utc).date()
    since = until - timedelta(days=days)
    return since.isoformat(), until.isoformat()


def top_countries(auth: str, project_id: str, cfg: dict, since: str, until: str, limit: int = 3) -> list[dict]:
    params: dict[str, str] = {
        "projectId": project_id,
        "since": since,
        "until": until,
        "by": "country",
        "limit": str(limit),
    }
    if cfg.get("team_id"):
        params["teamId"] = str(cfg["team_id"])
    data = api_get("visits/aggregate", params, auth)
    rows = list(data.get("data") or [])
    total_pv = sum(int(row.get("pageviews") or 0) for row in rows) or 1
    out: list[dict] = []
    for row in rows[:limit]:
        pv = int(row.get("pageviews") or 0)
        out.append(
            {
                "country": row.get("country") or "??",
                "pageviews": pv,
                "visitors": int(row.get("visitors") or 0),
                "share_pct": round(pv * 100 / total_pv, 1),
            }
        )
    return out


def count_totals(auth: str, project_id: str, cfg: dict, since: str, until: str) -> dict:
    params: dict[str, str] = {
        "projectId": project_id,
        "since": since,
        "until": until,
    }
    if cfg.get("team_id"):
        params["teamId"] = str(cfg["team_id"])
    data = api_get("visits/count", params, auth)
    block = data.get("data") or {}
    return {
        "pageviews": int(block.get("pageviews") or 0),
        "visitors": int(block.get("visitors") or 0),
    }


def main() -> int:
    cfg = load_config()
    auth = token()
    checked_at = datetime.now(timezone.utc).isoformat()

    if not auth:
        payload = {
            "checked_at": checked_at,
            "status": "auth_needed",
            "message": "VERCEL_TOKEN 未設定。Vercelダッシュボード → Settings → Tokens で発行し環境変数に設定してください。",
            "dashboard": "https://vercel.com/dashboard",
        }
        print("ANALYTICS_LOOP_TICK", json.dumps(payload, ensure_ascii=False))
        print("ANALYTICS_LOOP_PENDING")
        return 1

    try:
        project_id = resolve_project_id(auth, cfg)
        if not project_id:
            raise RuntimeError("project_id not found for sf6maxdatabase")

        since_7d, until = date_range(7)
        since_1d, _ = date_range(1)
        totals_7d = count_totals(auth, project_id, cfg, since_7d, until)
        totals_1d = count_totals(auth, project_id, cfg, since_1d, until)
        countries = top_countries(auth, project_id, cfg, since_7d, until, limit=3)

        payload = {
            "checked_at": checked_at,
            "status": "ok",
            "project_id": project_id,
            "pageviews_7d": totals_7d["pageviews"],
            "visitors_7d": totals_7d["visitors"],
            "pageviews_24h": totals_1d["pageviews"],
            "visitors_24h": totals_1d["visitors"],
            "countries_top3": countries,
        }
        CACHE.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print("ANALYTICS_LOOP_TICK", json.dumps(payload, ensure_ascii=False))
        print("ANALYTICS_LOOP_OK")
        return 0
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, OSError, RuntimeError, json.JSONDecodeError) as exc:
        cached = {}
        if CACHE.is_file():
            try:
                cached = json.loads(CACHE.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                cached = {}
        payload = {
            "checked_at": checked_at,
            "status": "error",
            "error": str(exc),
            "cached": cached if cached.get("status") == "ok" else None,
        }
        print("ANALYTICS_LOOP_TICK", json.dumps(payload, ensure_ascii=False))
        print("ANALYTICS_LOOP_PENDING")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
