#!/usr/bin/env python3
"""Persist WebFetch cargo payloads captured in this script's PAYLOADS dict."""
import json
from pathlib import Path

# Payloads extracted from WebFetch responses (cargoquery only)
from _webfetch_payloads_data import PAYLOADS  # noqa: E402

RAW = Path(__file__).parent / "cargo_raw"
RAW.mkdir(parents=True, exist_ok=True)

for name, cargo in PAYLOADS.items():
    path = RAW / f"{name}.json"
    path.write_text(json.dumps(cargo, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{name}: {len(cargo['cargoquery'])} moves -> {path}")
