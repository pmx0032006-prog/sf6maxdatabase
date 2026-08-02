# SF6 MAX DATABASE × REVOLVE — 新編成トークン地図（刺し2）

> Generated: 2026-08-02  
> Scope: `C:\\Users\\pmx00\\sf6_site` のみ（実装コードなし）  
> Status: **地図のみ**  
> 参照（読取のみ）: `prem-reservation-platform/frontend/static/style.css` / `ai-site-contrast.css` / `index.html`  
> 前提: `docs/SF6_REVOLVE_RENEWAL_MAP.md`（刺し1）／公式ブロック国は現行10コード確定

---

## 0. 絶対境界

| 項目 | 方針 |
|------|------|
| 写す | 色・字・余白・ヒーロー型・コントラスト規律・優しさコピー骨格 |
| 写さない | 募集API・ロビーUI・闘魂／鉄拳固有・マーヴル木の書き換え |
| 層A | 判定JPG・フレームDB・lookup・wiki-full-ui・trash・30キャラ — **触らない** |
| 赤線 | `npx tsx scripts/audit-all-characters.ts` → 0 MISS |
| 第一CTA | Characters / Look up frames（募集ではない） |

層A保護パスは刺し1 §0 と同じ。トークン作業でパス変更を提案しない。

---

## 1. REVOLVE本線トークン（読取メモ）

### 1.1 カラー（`:root` / style.css）

| トークン | 値 | 役割 |
|----------|-----|------|
| `--bg` | `#070b14` | インク地 |
| `--bg-elev` | `#0e1628` | 一段上げ |
| `--panel` / `--panel-solid` | `rgba(16,24,40,0.72)` / `#121a2b` | 面 |
| `--text` | `#e8eefc` | 本文 |
| `--muted` | `#9aa8c7` | 補助 |
| `--line` | `rgba(232,238,252,0.14)` | 線 |
| `--orange` / `--orange-dark` | `#ff6a3d` / `#ff8f66` | 主アクセント（ember） |
| `--cyan` | `#3de0ff` | 副アクセント |
| `--green` | `#34d399` | 成功／安心 |
| `--danger` | `#fb7185` | 危険 |
| `--radius-lg` | `22px` | 大角 |
| `--shadow-glow` | cyan縁＋深い影 | 面の浮き |

方針メモ（本線コメント）: **紫グラデは使わない**。ink + ember + cyan。

### 1.2 書体

| トークン | 値 |
|----------|-----|
| `--font-body` | Zen Kaku Gothic New → Hiragino → Yu Gothic UI |
| `--font-display` | Syne → Zen Kaku Gothic New |

### 1.3 ヒーロー構造トークン（型）

上から固定順（コンパクト新編成）:

1. **badge-row**: 小ピル＋地球バッジ（gap 6px、font ~0.72rem）
2. **kicker**: 英大文字・字間広め・`0.62rem`・uppercase
3. **brand-title-stack**: 縦積み大タイトル（clamp ~2.6–4.2rem）
4. **brand-jp**（任意）: 日本語サブ（SF6は英語US本拠なら短英サブでも可）
5. **manifesto**: 短句ピル群（怒らない／見下さない…）
6. **kindness**（任意・外壳）: 今日の優しさ箱 — SF6では必須ではない

### 1.4 コントラスト規律（ai-site-contrast.css）

- 目標: **白地×白字ゼロ**
- 面の既定: ダーク面 `#152038` ＋ 明色文字 `#f5f8ff`
- テキスト影で誤魔化さない（`text-shadow: none` 寄せ）
- タイトル潰れ禁止（透明クリップ＋暗背景で消えないこと）

### 1.5 本線コピー骨格（読替用）

| 枠 | 本線 | SF6読替（地図案） |
|----|------|-------------------|
| ピル | 日本向け · マーヴル闘魂 · 完全無料 | `US · SF6 · FRAME + HITBOX · FREE` |
| 地球バッジ | 地球上どこよりも優しいゲーム | **同一維持可** |
| キッカー | The Kindest Fighting Game Lobby on Earth | `THE KINDEST FIGHTING GAME FRAME DATABASE ON EARTH` |
| タイトル | REVOLVE / LOBBY 縦積み | 案A: 既存名主役＋キッカー／案B: REVOLVE併記（**ドク確認待ち**） |
| マニフェスト | 怒らない・見下さない・マナー重視・煽り行為なし・初心者〜中級者歓迎 | **同一**（英語公開面は EN 対訳を後刺し） |

---

## 2. SF6 現状トークン（globals.css）

| トークン | 値 | メモ |
|----------|-----|------|
| `--background` | `#f4f7f5` | 現状ライト地 |
| `--foreground` | `#141816` | 濃色本文 |
| `--accent` | `#00b368` | ミント緑（DBアイデンティティ） |
| `--accent-hover` | `#009456` | |
| `--accent-soft` | `rgba(0,179,104,0.12)` | |
| `--accent-mint` | `#2dffb8` | ホバー強調 |
| `--surface` | `#ffffff` | 白面 |
| `--muted` | `#6b7a72` | |
| `--border` | `#dde6e0` | |
| `--font-sans` / display | Geist Sans | 表現力は本線Syneより弱い |
| `--site-header-h` | 5.75rem / lg 4rem | 既存レイアウト依存 |

層A周辺CSS（`.char-cell` / `.move-data-card` 等）は **判定体験の一部** → トークン差し替え時も壊さない。

---

## 3. ギャップ → SF6層Bトークン案（写す／残す）

### 3.1 方針（迷ったらこれ）

| 軸 | 決定案 |
|----|--------|
| 色の主役 | **SF6ミントを維持**（判定DBの既存ブランド）。本線オレンジを主色にしない |
| 外壳トーン | ヒーロー／法定まわりは **ダーク面＋明色文字**（コントラスト規律を写す） |
| 本文地 | 一覧・詳細のデータ面は現状ライト維持可（読みやすさ優先）。外壳と二層でもよい |
| 書体 | display に表現力ある1系統を候補（本線の Syne 相当）。本文は既存Geistでも可 |
| 構造 | ピル→キッカー→大タイトル→マニフェスト→第一CTA の順を固定 |

### 3.2 提案トークン表（実装は後・名前だけ先に固定）

保存想定（後刺し実装）: `src/app/globals.css` の `:root` 拡張、または `src/styles/revolve-tokens.css`（新ファイル案）。  
**いまは地図のみ。ファイルはまだ作らない。**

| 提案名 | 値案 | 由来 |
|--------|------|------|
| `--rv-bg` | `#070b14` | 本線 ink |
| `--rv-bg-elev` | `#0e1628` | 本線 |
| `--rv-panel` | `#121a2b` / `#152038` | 本線＋contrast |
| `--rv-text` | `#e8eefc` / `#f5f8ff` | 本線 |
| `--rv-muted` | `#9aa8c7` | 本線 |
| `--rv-line` | `rgba(232,238,252,0.14)` | 本線 |
| `--rv-accent` | `var(--accent)` `#00b368` | **SF6維持** |
| `--rv-accent-bright` | `var(--accent-mint)` `#2dffb8` | SF6維持 |
| `--rv-accent-soft` | `rgba(0,179,104,0.16)` | SF6寄せ |
| `--rv-cyan` | `#3de0ff` | 本線副色（任意・装飾限定） |
| `--rv-danger` | `#fb7185` | 本線 |
| `--rv-radius-pill` | `999px` | ピル |
| `--rv-radius-lg` | `16px`〜`22px` | 外壳パネル |
| `--rv-font-display` | Syne or 同等（後で選定） | 本線型 |
| `--rv-font-body` | 既存 Geist / システム | 軽量維持 |
| `--rv-kicker-size` | `0.62rem` | 本線 |
| `--rv-kicker-tracking` | `0.14em` | 本線 |
| `--rv-pill-size` | `0.72rem` | 本線 |
| `--rv-title-clamp` | `clamp(2.4rem, 8vw, 3.8rem)` | DB名は長いので本線より少し抑えめ |
| `--rv-hero-pad` | `14px 14px 12px` | コンパクト |
| `--rv-badge-gap` | `6px` | 本線 |

### 3.3 コピー・トークン（文字列定数・地図）

| キー | 英語案（US本拠） | 備考 |
|------|------------------|------|
| `pill.primary` | `US · SF6 · FRAME + HITBOX · FREE` | |
| `pill.earth` | Kindest frame DB on Earth（短）／地球バッジ維持はドク可 | 絵文字乱用しない |
| `kicker` | `THE KINDEST FIGHTING GAME FRAME DATABASE ON EARTH` | |
| `title.primary` | `SF6 MAX DATABASE`（既存ブランド優先） | REVOLVE併記は確認待ち |
| `cta.primary` | `Look up frames` → `/characters` | 第一CTA固定 |
| `cta.secondary` | `About the data` | |
| `manifesto[]` | Don't rage / No looking down / Manners first / No toxicity / Beginners welcome | 本線同一意味 |
| `diff.line` | Lightweight JPG hitboxes · Full frame data · 30 characters | UFD差分の核 |

### 3.4 コントラスト監査トークン（受け入れ）

| 検査 | 合格条件 |
|------|----------|
| 白×白 | 背景輝度高 × 文字輝度高の組み合わせゼロ |
| タイトル | ヒーローH1が背景に沈まない |
| データ面 | フレーム表・判定ビューアの可読性を落とさない |
| 広告面 | OK置き場のみ。ビューア非接触（刺し1どおり） |

---

## 4. 当てる範囲 / 当てない範囲

### 当てる（層B）

- ホーム・ヒーロー外壳
- 共通ヘッダー周り（コントラスト・ピル言語）
- About / 将来 Terms・Contact のトーン
- 広告・アフィ枠の「面」色（中身のASINロジックは触らない）

### 当てない（層A・禁止）

- `wiki-frame-data.json` / lookup / wiki-full-ui / resolve-moves
- `character-images*` / `public/images/characters/*_jpg`
- 判定ビューア・フレーム表の機能・パス・セクション順
- Amazon ASIN・tag（`sf6maxdatabas-20`）の収益ロジック
- geo-block / Cloudflare オレンジ雲

---

## 5. 確定済み / 未確定

| 項目 | 状態 |
|------|------|
| ブロック国10コード | **確定**（JP CN RU BY IR KP MM TM DO PK） |
| 色の主役＝SF6ミント | 地図案（異議あればドク） |
| REVOLVEワードマーク併記 | **未**（ドク確認） |
| 管理者JP例外 | **未** |
| displayフォント最終選定 | 後刺し（ヒーロー実装時） |
| ヒーロー全面ダーク化 vs 二層（外壳ダーク／データライト） | 地図推奨は二層。実装前に一言確認可 |

---

## 6. 受け入れ（刺し2）

| 項目 | 結果 |
|------|------|
| 地図が `docs/SF6_REVOLVE_TOKENS_MAP.md` に保存 | 本ファイル |
| REVOLVEは読取のみ・本線未変更 | 遵守 |
| SF6実装コード未変更 | 遵守 |
| 層Aパスを壊す提案なし | 遵守 |
| 次刺しに渡せるトークン表がある | §3 |

---

## 7. 次の刺し候補（1個）

推奨: **刺し3 — トップヒーロー新編成地図**（外壳のみ・第一CTA=Look up frames）  
実装コードはドクの「やれ」後。トークン実装もヒーローと同時か直前後。

迷ったら: **正確なデータ ＞ 米国で稼げる導線 ＞ 装飾**

---

*End of map — 刺し2完了。実装なし。*
