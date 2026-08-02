# SF6 MAX DATABASE × REVOLVE — トップヒーロー新編成地図（刺し3）

> Generated: 2026-08-02  
> Scope: `C:\\Users\\pmx00\\sf6_site` のみ（実装コードなし）  
> Status: **地図のみ**  
> 前提: 刺し1 `SF6_REVOLVE_RENEWAL_MAP.md` ／ 刺し2 `SF6_REVOLVE_TOKENS_MAP.md`  
> 参照（読取のみ）: REVOLVE本線 `index.html` ヒーロー部 ＋ `style.css`（compact）

---

## 0. 絶対境界

| 項目 | 方針 |
|------|------|
| 対象 | ホーム**外壳ヒーローのみ**（層B） |
| 第一CTA | **Look up frames** → `/characters`（募集ではない） |
| 層A | 判定グリッド・lookup・画像パス・フレーム機能 — **変更禁止** |
| 収益 | ヒーローに広告を載せない。Amazonレール／CTAは現行位置を維持 |
| 本線 | REVOLVEは読むだけ。マーヴル／鉄拳木は触らない |

---

## 1. 現状（SF6ホーム）

### 1.1 いま画面に出ているもの（`src/app/page.tsx`）

上から:

1. `SiteHeader`（ナビ・検索）
2. **sticky 帯**（`#0a0f0c`）  
   - `h1` は **sr-only**（視覚上のブランドヒーローなし）  
   - 左: `siteTagline` 短文  
   - 中: `HomeHeroFactline`（hitbox demo / why JPG 等チップ）  
   - 右: `HomeMetaSummary`（メタ要約）
3. `main`（ライト地）→ `#roster` の `CharacterGrid` がすぐ主役
4. MetaNextSteps / Features / News + `HomeSidebar`（アフィ等）

### 1.2 休眠コンポーネント

| ファイル | 状態 | メモ |
|----------|------|------|
| `src/components/HomeHero.tsx` | **page.tsx から未使用** | 旧コンパクト案（MAX DATABASE＋featured 6枚）。復活候補だがREVOLVE型とは別物 |

### 1.3 ギャップ（REVOLVE目標との差）

| 要素 | 現状 | 目標 |
|------|------|------|
| ブランドH1 | sr-only（見えない） | 大きく見える（潰れない） |
| ピル | なし | `US · SF6 · FRAME + HITBOX · FREE` |
| キッカー | なし（taglineが代用） | FRAME DATABASE 英キッカー |
| マニフェスト | なし | 優しさ短句（EN） |
| 第一CTA | 暗黙（すぐroster） | 明示ボタン **Look up frames** |
| 情報密度 | stickyにメタ＋チップ密集 | ヒーローはブランド＋1CTA。メタは一段下へ |

---

## 2. 目標ワイヤー（第一画面の1組成物）

トークンは刺し2の `--rv-*` を使う前提。色の主役は **SF6ミント**。外壳はダーク面。

```
[ SiteHeader — 既存。機能変更なし ]

[ Hero shell — ダーク / compact ]
  (1) badge-row:  primary pill  +  earth pill（短）
  (2) kicker:     THE KINDEST FIGHTING GAME FRAME DATABASE ON EARTH
  (3) H1 stack:   SF6 MAX DATABASE（視覚主役）
                  ※ REVOLVE併記はドク確認待ち → 当面なし
  (4) one-liner:  Lightweight JPG hitboxes · Full frame data · 30 characters
  (5) manifesto:  Don't rage / No looking down / Manners first / No toxicity / Beginners welcome
                  （折り返し可・モバイルは2行まで推奨）
  (6) CTA group:  [ Look up frames → /characters ]  primary
                  [ About the data → /about ]       secondary
  ※ ヒーロー内にメタカード・統計・広告・予約UIを置かない

[ Optional strip — ヒーロー直下・薄い ]
  HomeHeroFactline（既存チップ）をここに降格してもよい
  HomeMetaSummary もここ or 現行main内へ（ヒーロー外）

[ main — 既存ライト地 ]
  #roster CharacterGrid … 層Aそのまま
  以降既存
```

### 2.1 第一ビューポート予算（ホーム）

入れてよい: ブランド／キッカー／一言／CTA／（短マニフェスト）  
入れない: 統計・スケジュール・広告・アフィカード・メタ「HOT NOW」類・featured 6枚グリッド

`HomeHero.tsx` の featured 6枚は **採用しない**（装飾カード化し第一画面を散らすため）。

---

## 3. コピー確定案（US英語・実装時にこの表を使う）

| 枠 | 文言 |
|----|------|
| pill.primary | `US · SF6 · FRAME + HITBOX · FREE` |
| pill.earth | `Kindest frame DB on Earth`（絵文字なし推奨） |
| kicker | `THE KINDEST FIGHTING GAME FRAME DATABASE ON EARTH` |
| h1 | `SF6 MAX DATABASE`（読み上げは `Street Fighter 6 MAX DATABASE` 可） |
| support | `Lightweight JPG hitboxes · Full frame data · 30 characters` |
| cta.primary | `Look up frames` → `/characters` |
| cta.secondary | `About the data` → `/about` |
| manifesto | Don't rage · No looking down · Manners first · No toxicity · Beginners welcome |

句読点より **中黒 / スペース**。煽り・「Click the ad」禁止。

---

## 4. コンポーネント当て方（実装は後・設計のみ）

| 役割 | 提案 | 層 |
|------|------|----|
| 新ヒーロー本体 | `HomeHero.tsx` を **REVOLVE型に書き換えて** `page.tsx` で使用 | B |
| 現行sticky帯 | 廃止 or ヒーロー直下の薄い strip に縮小 | B |
| Factline | ヒーロー外へ移動（残すなら） | B |
| MetaSummary | ヒーロー外へ移動（残すなら） | B |
| CharacterGrid | **触らない**（並び・画像・mode維持） | A |
| SiteHeader / Footer / Sidebar / Amazon | この刺しでは触らない | — |

実装ファイル候補（後刺し）:

- `src/components/HomeHero.tsx`（改修）
- `src/app/page.tsx`（ヒーロー差込＋sticky帯の整理）
- 必要なら `globals.css` に `--rv-*` と `.home-hero-*` 数クラス

**禁止**: character/* ビューア、lookup、wiki、画像パス、middleware、アフィASIN。

---

## 5. 動き（2〜3・軽いものだけ）

| 動き | 内容 | 注意 |
|------|------|------|
| CTA hover | ミント強調 0.2–0.3s | 既存accent言語 |
| マニフェスト | 初回だけ薄い fade-in 可 | `prefers-reduced-motion` でOFF |
| タイトル | 重いパーティクル／GIF背景は禁止 | 軽量維持 |

マスコット大画像・本線の浮遊アニメ丸写しは **必須にしない**（SF6は判定DB。装飾で重くしない）。

---

## 6. コントラスト／アクセプト

| 検査 | 合格 |
|------|------|
| 白×白 | ヒーロー内ゼロ |
| H1可視 | sticky帯の sr-only 状態を解消 |
| 第一CTA | タップ1回で `/characters` |
| 層A | roster の判定導線がヒーロー下で即使える |
| 広告 | ヒーロー内ゼロ |
| 監査 | 実装後も 0 MISS（この地図単体では走らせない） |

モバイル: ピル折返し可、H1が2行以内、CTAは親指届く幅。デスクトップ: 中央寄せ1カラムで十分（本線の2カラム kindness 箱は任意・初期は無しでよい）。

---

## 7. 未確定（ヒーロー実装前に1つ聞けば足りる）

| 項目 | 地図の仮決め |
|------|----------------|
| REVOLVEワードマーク併記 | **当面なし**（案A）。ドクが要ると言ったらキッカー下に小さく |
| 全面ダーク vs 二層 | **二層**（ヒーローダーク／mainライト） |
| MetaSummary の行き先 | ヒーロー直下 strip（推奨） |

---

## 8. 受け入れ（刺し3）

| 項目 | 結果 |
|------|------|
| 地図が `docs/SF6_REVOLVE_HERO_MAP.md` に保存 | 本ファイル |
| 第一CTAが Look up frames と明記 | §0 / §3 |
| 層A非破壊が明記 | §0 / §4 |
| 実装コードなし | 遵守 |
| REVOLVE本線未変更 | 遵守 |

---

## 9. 次の刺し候補（1個）

推奨順（収益耐性）:

1. **刺し4 — 法定英語ページ地図**（Terms / Contact / Ads+Affiliate Disclosure）  
2. または実装フェーズに入るなら「ヒーロー実装（外壳のみ）」※ドクの「やれ」必須

迷ったら: **正確なデータ ＞ 米国で稼げる導線 ＞ 装飾**  
→ ヒーロー見た目より先に法定を地図化する方が AdSense 耐性に効く。

---

*End of map — 刺し3完了。実装なし。*
