# SF6 MAX DATABASE — 許可国向け軽い翻訳地図（後段）

> Generated: 2026-08-02  
> Scope: sf6_site only (**no implementation**)  
> Status: later-phase map. Main line stays English US + Amazon  
> Geo block stays on (JP/CN/RU/BY/IR/KP/MM/TM/DO/PK)  
> Note: AdSense Sites issue = duplicate / low value. Thin MT pages can worsen that.

---

## 0. One-line policy

No full worldwide i18n.  
English remains canonical. Later, only a **light translation aid** for visitors outside the block list.

---

## 1. Hard boundaries

| Item | Rule |
|------|------|
| Geo block | Do not lift. Translation is not an excuse to open JP/CN/... |
| Layer A | Hitbox JPG / frames / lookup untouched; no per-locale image paths |
| Revenue | Amazon.com US stays primary |
| AdSense | Do not mass-produce thin translated URLs |
| Canonical lang | `lang=en` / `en_US` |

---

## 2. What "like UFD" usually is

| Approach | Fit for SF6 |
|----------|-------------|
| Browser auto-translate | Already available; no site work |
| On-page Translate widget | **Later candidate A** (lightest) |
| Full `/en` `/es` routes | Heavy; avoid for now |
| Human full translation | Too costly until needed |

JP ads like MuuMuu are a JP-surface pattern. Not a model for this US site.

---

## 3. Audience = non-blocked countries only

Help: US (canonical), CA/GB/AU, and other non-blocked regions.  
Do not: JP site Japanese (blocked + policy conflict).

If ever doing UI dictionaries (not full routes): EN canonical; optional ES/PT; no JP site locale.

---

## 4. Architecture (light → heavy)

### Option A (recommended later): Translate assist only
- Keep English HTML
- Footer "Translate this page" widget
- Keep `translate="no"` on numbers / names / scores
- No extra locale URLs

### Option B: UI shell dictionaries only
- Nav / About / legal labels
- Frame tables stay English
- Same URL, cookie language

### Option C (not now): Full multilingual routes
- High duplicate / low-value risk for AdSense
- Maintenance heavy
- Blurs Amazon US CTA

---

## 5. Translate yes / no

Yes: About, hero copy, legal explainers, guide prose, UI labels.  
No: Frame numbers, move-name meaning changes, hitbox pipeline, JP Amazon redirects, strategy article farms.

---

## 6. Timing gate (all required)

1. English About uniqueness is clear  
2. Leverless / legal / ad slots stable  
3. Doc explicitly says to implement translation  
4. Geo-block policy unchanged  

**Do now: nothing (map only).**

---

## 7. Next main-line stab

Prefer: strengthen English About (JPG originality / vs UFD / how to read).  
Translation implementation waits for the gate.

---

*End of map — light i18n is later. No implementation.*
