#!/usr/bin/env python3
"""Generate X (Twitter) dedicated account promo kit for SF6 MAX DATABASE."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "promo"
JSON_OUT = OUT_DIR / "x-promo-kit.json"
SETUP_OUT = OUT_DIR / "x-account-setup.txt"
POSTS_OUT = OUT_DIR / "x-first-posts.txt"

SITE_URL = "https://www.sf6maxdatabase.com"
SITE_NAME = "SF6 MAX DATABASE"
HANDLE_SUGGESTIONS = [
    "sf6maxdatabase",
    "SF6MaxDatabase",
    "sf6framedb",
    "sf6maxdb",
]

PROFILE = {
    "display_name": "SF6 MAX DATABASE",
    "handle_suggestions": HANDLE_SUGGESTIONS,
    "bio": (
        "Lightweight SF6 frame data + JPG hitboxes for mobile.\n"
        "All 30 characters. Fast on low-spec phones.\n"
        f"{SITE_URL}"
    ),
    "bio_short": f"Mobile-first SF6 frame data & JPG hitboxes | 30 chars | {SITE_URL}",
    "location": "",
    "website": SITE_URL,
    "pinned_post": (
        "I built a lightweight Street Fighter 6 frame data site focused on fast mobile lookup.\n\n"
        "• All 30 characters\n"
        "• Frame data + JPG hitbox images\n"
        "• Designed for low-spec phones\n\n"
        f"{SITE_URL}\n\n"
        "#StreetFighter6 #SF6 #FGC"
    ),
}

POSTS = [
    {
        "day": 1,
        "label": "launch",
        "text": PROFILE["pinned_post"],
    },
    {
        "day": 2,
        "label": "differentiator",
        "text": (
            "Why JPG instead of GIF for SF6 hitboxes?\n\n"
            "Still frames load faster on mobile data and low-spec phones.\n"
            "Built for quick checks between matches.\n\n"
            f"{SITE_URL}\n\n"
            "#SF6 #FGC"
        ),
    },
    {
        "day": 3,
        "label": "ingrid",
        "text": (
            "Ingrid frame data and hitbox images are live on SF6 MAX DATABASE.\n\n"
            f"{SITE_URL}/characters/ingrid\n\n"
            "#StreetFighter6 #SF6"
        ),
    },
    {
        "day": 4,
        "label": "mobile",
        "text": (
            "Tip: Add the site to your phone home screen for quick frame checks mid-session.\n\n"
            f"{SITE_URL}\n\n"
            "#SF6 #FGC"
        ),
    },
    {
        "day": 5,
        "label": "compare",
        "text": (
            "Not a strategy blog — just frame numbers and hitbox images, fast.\n"
            "Classic / Modern tabs included.\n\n"
            f"{SITE_URL}\n\n"
            "#StreetFighter6"
        ),
    },
]

REDDIT_DRAFT = {
    "subreddit": "r/StreetFighter",
    "title": "[Resource] Lightweight SF6 frame data site with JPG hitboxes (mobile-friendly)",
    "body": (
        "I made a frame data site focused on fast mobile lookup:\n\n"
        f"- {SITE_URL}\n"
        "- All 30 characters\n"
        "- Frame data + still JPG hitbox images (lighter than GIF)\n"
        "- Built for low-spec phones\n\n"
        "Not affiliated with Capcom. Data sourced from SuperCombo Wiki.\n"
        "Feedback welcome if anything looks off."
    ),
}

CHECKLIST = [
    "Open https://x.com/i/flow/signup in a private browser (optional)",
    "Use a NEW email (not main account) OR new Google account",
    "Pick handle from suggestions (first available wins)",
    "Paste display name + bio from x-account-setup.txt",
    "Set website URL in profile",
    "Post pinned launch tweet (Day 1)",
    "Do NOT link this account to your main or diet account",
    "Wait 24h before Day 2 post (avoid spam flags)",
]


def write_setup_txt() -> None:
    lines = [
        "SF6 MAX DATABASE — X Dedicated Account Setup",
        "=" * 48,
        "",
        "DISPLAY NAME:",
        PROFILE["display_name"],
        "",
        "HANDLE (try in order):",
    ]
    for h in HANDLE_SUGGESTIONS:
        lines.append(f"  @{h}")
    lines.append("")
    lines.append("BIO (copy all):")
    lines.append(PROFILE["bio"])
    lines.append("")
    lines.append("WEBSITE:")
    lines.append(PROFILE["website"])
    lines.append("")
    lines.append("PINNED POST (Day 1 — post first, then pin):")
    lines.append("-" * 40)
    lines.append(PROFILE["pinned_post"])
    lines.append("")
    lines.append("SETUP CHECKLIST:")
    for i, step in enumerate(CHECKLIST, 1):
        lines.append(f"  {i}. {step}")
    lines.append("")
    lines.append("NOTE: Account creation must be done manually in browser.")
    lines.append("Python cannot bypass X phone/email verification.")
    SETUP_OUT.write_text("\n".join(lines), encoding="utf-8")


def write_posts_txt() -> None:
    lines = ["SF6 MAX DATABASE — X Post Queue", "=" * 48, ""]
    for post in POSTS:
        lines.append(f"Day {post['day']} ({post['label']})")
        lines.append("-" * 40)
        lines.append(post["text"])
        lines.append("")
    POSTS_OUT.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    kit = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "site_url": SITE_URL,
        "profile": PROFILE,
        "posts": POSTS,
        "reddit_draft": REDDIT_DRAFT,
        "checklist": CHECKLIST,
        "limits": {
            "bio_max_chars": 160,
            "tweet_max_chars": 280,
        },
        "char_counts": {
            "bio_short": len(PROFILE["bio_short"]),
            "pinned_post": len(PROFILE["pinned_post"]),
        },
    }

    JSON_OUT.write_text(json.dumps(kit, ensure_ascii=False, indent=2), encoding="utf-8")
    write_setup_txt()
    write_posts_txt()

    print(f"[done] {JSON_OUT.relative_to(ROOT)}")
    print(f"[done] {SETUP_OUT.relative_to(ROOT)}")
    print(f"[done] {POSTS_OUT.relative_to(ROOT)}")
    print(f"[bio chars] short={kit['char_counts']['bio_short']} pinned={kit['char_counts']['pinned_post']}")
    print("[note] Open x-account-setup.txt and follow checklist in browser")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
