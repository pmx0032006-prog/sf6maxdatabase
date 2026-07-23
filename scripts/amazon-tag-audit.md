# Amazon Affiliate Tag Audit

- Generated (UTC): `2026-07-23T04:08:40.487426+00:00`
- Expected tag: `sf6maxdatabas-20`
- `AFFILIATE_TAG` const: `sf6maxdatabas-20`
- Files scanned: **132**
- gearHref() call sites: **4**

## Summary

| Metric | Count |
|--------|------:|
| URLs with correct tag | 2 |
| Wrong tag | 0 |
| Missing tag | 0 |
| Short links | 0 |
| Errors | 0 |
| Warnings | 0 |
| **PASS** | YES |

## Tags seen

- `sf6maxdatabas-20` × 3 (OK)

## Errors

- None

## Warnings

- None

## Notes

- Runtime links built via `gearHref(asin)` inherit `AFFILIATE_TAG`.
- This audit covers **source under `src/`** (and a few configs), not live HTML behind Cloudflare.
