# SEO Auto Status

Generated: 2026-07-23 04:13 UTC
Site: https://www.sf6maxdatabase.com

## Gate

- local_ok: **True**
- any_live_ok: **False**
- all_live_403: **True**
- doc_needed_now: **False**

## Local (source of truth for this loop)

- robots.txt: 200
- sitemap.xml: 200 (36/36 urls)
- missing vs expected: 0

- [OK] `/` → 200
- [OK] `/characters` → 200
- [OK] `/characters/ryu` → 200
- [OK] `/matchups` → 200
- [OK] `/tier` → 200
- [OK] `/about` → 200

## Live multi-UA matrix

- audit: robots=403 sitemap=403 home=403
- chrome: robots=403 sitemap=403 home=403
- googlebot: robots=403 sitemap=403 home=403

## Hypothesis

Production 403 from this IP is consistent with Cloudflare country block (JP listed) and/or Bot Fight — not proof that Google cannot crawl.


## Doc reasons (only if doc_needed_now)

- Live returns 403 for all UAs from this network (likely JP geo-block / CF). Googlebot from US may still work (GSC sitemap was previously OK). To automate CF: set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ZONE_ID, or open CF once.

## Deferred (not blocking auto loop)

- Search Console: keep requesting indexing for priority character URLs.
- Amazon Associates: finish Japan bank payment if red banner still shows.

## Re-run

```bash
python scripts/seo-auto-loop.py
```
