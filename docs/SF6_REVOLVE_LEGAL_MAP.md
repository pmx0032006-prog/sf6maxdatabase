# SF6 MAX DATABASE × REVOLVE — 法定英語ページ地図（刺し4）

> Generated: 2026-08-02  
> Scope: `C:\\Users\\pmx00\\sf6_site` のみ（実装コードなし）  
> Status: **地図のみ**（本文の最終貼り付け・ページ実装は後刺し）  
> 前提: 刺し1〜3 ／ US本拠・英語公開 ／ Amazon tag `sf6maxdatabas-20`  
> 参照（読取のみ）: REVOLVE `00_inbox/ADSENSE_LEGAL_PAGES_MAP.md` / `ADSENSE_LEGAL_PAGES_COPY.md`  
> 写す: 必須見出し骨格・優しさ口調・フッター導線  
> 写さない: ロビー募集・ウデマエ・X連携・日本向けコミュニティ前提

---

## 0. 絶対境界

| 項目 | 方針 |
|------|------|
| 言語 | **英語**（US審査・US本拠） |
| 層A | 判定／フレーム／lookup — **触らない** |
| 国ブロック | 維持。法定文に地域制限の一文を足す（解除はしない） |
| Impact | 棚上げ。法定に粘らない |
| 連絡先 | 公開メールは **ドク確認待ち**（プレースホルダで地図化） |
| 広告網 | AdSense ＋ Amazon Associates を前提（他網は未確認＝書かない） |

---

## 1. 現状ギャップ

| ページ | 現状 | ギャップ |
|--------|------|----------|
| Privacy | `/privacy` あり（英・Cookie/Analytics/AdSense/Affiliate節あり） | Contactが About 任せ。地域制限一文が薄い |
| About | `/about` あり（JPG方針が強い・薄くするな） | `#affiliate` が1行だけ。開示としては不足 |
| Terms | **欠落** | 新設必須 |
| Contact | **欠落** | 新設必須（公開メール待ち） |
| Ads / Affiliate Disclosure | About断片＋Privacy節のみ | 専用ページ or 明確な英語開示ページが望ましい |
| Footer | About / Privacy のみ | Terms / Contact / Disclosure を追加 |
| Sitemap | about / privacy | 新ルートを後で追加 |

既存アセットを活かす: Privacy 本文は **捨てず補強**。About の判定説明は **削らない**。

---

## 2. 推奨IA（ルート）

| ルート | タイトル | 役割 |
|--------|----------|------|
| `/privacy` | Privacy Policy | 既存強化（地域制限・Contactリンク） |
| `/terms` | Terms of Use | **新設**（DBサイト向け・ロビー文は使わない） |
| `/contact` | Contact | **新設**（受付窓口1つ） |
| `/disclosure` | Ads & Affiliate Disclosure | **新設**（審査・透明性の本丸） |
| `/about` | About | 維持・強化。開示は `/disclosure` へ誘導可 |

別名候補: `/legal` 1枚まとめは **非推奨**（審査で個別URLの方が追いやすい）。  
`/community` はロビー語なので使わない → **Terms of Use**。

---

## 3. ページ別・必須見出し地図

### 3.1 Privacy（既存補強）

| 見出し | 必須か | 1行要旨（英） |
|--------|--------|----------------|
| Overview | 既存OK | Frame DB + JPG hitboxes site; policy applies to sf6maxdatabase.com |
| Information We Collect | 既存OK | No accounts; limited technical/log data |
| Cookies | 既存OK | Ops / prefs / analytics / ads |
| Analytics | 既存OK | Vercel Analytics |
| Advertising (AdSense) | 既存OK | Google cookies; partner-sites + opt-out links |
| Affiliate Links | 既存OK | Amazon Associates; commission disclosure |
| Third-Party Links | 既存OK | Not responsible for external policies |
| Regional Access | **追加** | Access may be restricted by region (geo). Blocked regions cannot use the service |
| Your Rights | 既存→修正 | Contact via `/contact`（About任せをやめる） |
| Changes | 既存OK | Posted on this page |
| Contact | 既存→修正 | Link to `/contact` |

### 3.2 Terms of Use（新設）

| 見出し | 必須段落名 | 1行要旨（英） |
|--------|------------|----------------|
| Service | What we provide | Free SF6 frame data + lightweight JPG hitbox reference. Not a matchmaking lobby |
| Eligibility / Region | Regional access | US-oriented public site; access may be blocked in certain countries/regions |
| Acceptable use | Conduct | Be kind: no harassment, hate, scraping abuse, or attempts to break the service |
| Data accuracy | No warranty on play | Frame/hitbox data is reference; patches change; play at your own judgment |
| Intellectual property | IP | Capcom/SF6 marks belong to owners; our presentation/DB tooling is ours; no bulk redistribution |
| Affiliates & ads | Monetization | Ads/affiliate links may appear in allowed placements only |
| Disclaimer | As-is | Provided as-is; no liability for decisions made from the data |
| Changes | Changes | We may update terms; continued use = acceptance |
| Contact | Contact | See `/contact` |

ロビー固有（募集・ウデマエ・X連携・日本法コミュニティ条）は **移植しない**。  
準拠法は地図では「後でドク確認」（US運営ならUS寄り／または一般的な as-is 条のみでも審査には足りることが多い）。

### 3.3 Contact（新設）

| 見出し | 必須段落名 | 1行要旨 |
|--------|------------|---------|
| Inbox | How to reach us | One public email |
| Topics | What to write about | Privacy, Terms, ads/affiliate, bugs, data corrections, sponsorship |
| Reply | Expectations | We review as soon as we can（確約しすぎない） |
| Safety | Emergencies | Personal danger → local authorities first |
| Geo note | Access issues | If blocked by region, that is intentional policy — do not ask to disable geo |

**メールプレースホルダ（実装時にドク実値）**

| 候補 | メモ |
|------|------|
| `impact@sf6maxdatabase.com` | Email Routing 済み（Impact用）。公開窓口に流用するかはドク判断 |
| 別アドレス（例: `hello@` / `support@`） | 公開用に分けるなら新設＋Routing |

地図上の仮表記: `CONTACT_EMAIL_PLACEHOLDER@sf6maxdatabase.com`

### 3.4 Ads & Affiliate Disclosure（新設・本丸）

| 見出し | 必須段落名 | 1行要旨（英） |
|--------|------------|----------------|
| Advertising | AdSense | We may show Google AdSense ads |
| Affiliate | Amazon | Amazon Associates; `tag=sf6maxdatabas-20`; amazon.com |
| No extra cost | Cost | Commission at no extra cost to you |
| Placement rules | Where ads appear | List/About/lower detail OK; **never** over hitbox viewer or sticky on frame header |
| Independence | Editorial | Hitbox/frame data is not altered to sell products |
| Other networks | Scope | No other ad networks listed until Doc confirms |
| Contact | Questions | `/contact` |

About `#affiliate` は「詳しくは `/disclosure`」へ1リンクで足りる（About本文は薄くてよいが、消さない）。

---

## 4. フッター／導線（実装時）

`SiteFooter` に英語リンクを揃える:

1. About  
2. Privacy  
3. Terms  
4. Contact  
5. Ads & Affiliates（`/disclosure`）  
6. Characters（既存の製品導線は残してよい）

サイドレールやキャラCTAの「Affiliate disclosure」リンクは、将来 `/disclosure` へ寄せる（後刺し）。

`sitemap.ts` に `/terms` `/contact` `/disclosure` を追加（実装時）。

---

## 5. 本文ソース方針（この刺しでは本文ファイルを作らない）

| ソース | 使い方 |
|--------|--------|
| SF6 `/privacy` 現行英文 | ベースとして残す |
| REVOLVE LEGAL COPY | **骨格のみ**参考。日本語ロビー文は直貼りしない |
| SF6固有 | JPG hitboxes、frame data、geo block、Amazon.com、AdSense pub 既存 |

後刺しで `docs/SF6_LEGAL_COPY_EN.md` に正式短文を置く案あり（実装の直前）。  
**いまは地図のみ。COPYファイル未作成。**

---

## 6. AdSense審査チェック（法定まわり）

| 項目 | 地図時点 |
|------|----------|
| Privacy reachable | 既存OK → Contactリンク補強 |
| Terms reachable | 欠 → `/terms` |
| Contact with email | 欠 → メール実値待ち |
| Ads/Affiliate clear | 弱い → `/disclosure` |
| Original content | About + 判定DB（薄くするな） |
| Geo honesty | Privacy/Terms に一文 |
| Don't click ads | サイト全体で禁止維持 |

`layout.tsx` に `ca-pub-8960641434315655` メタあり。ユニット本番埋めは別刺し（仮枠）。

---

## 7. 層A／収益NG再確認

法定ページ作業でも禁止:

- 判定ビューア直上・オーバーレイ広告の許可文言を書かない（むしろ禁止と書く）
- lookup / wiki / 画像パイプライン変更なし
- 国ブロック解除の案内を出さない

---

## 8. ドク確認（法定ブロッカー）

| # | 項目 | 状態 |
|---|------|------|
| 1 | 公開連絡先メール | **未**（プレースホルダ） |
| 2 | Terms の準拠法（US / 簡潔as-isのみ） | **未** |
| 3 | AdSense以外の広告網 | 地図は AdSense のみ記載 |
| 4 | 公開窓口に `impact@` を使ってよいか | **未** |

ブロック国10コードは確定済み（刺し1更新事項）。

---

## 9. 受け入れ（刺し4）

| 項目 | 結果 |
|------|------|
| 地図が `docs/SF6_REVOLVE_LEGAL_MAP.md` に保存 | 本ファイル |
| Terms / Contact / Disclosure の欠落が経路付きで明示 | §2 |
| Privacy/About を壊さず補強と明記 | §1 / §3 |
| 実装コードなし・本線未変更 | 遵守 |
| 層A非破壊 | 遵守 |

---

## 10. 次の刺し候補（1個）

推奨: **刺し5 — 法定英語COPY短文**（`docs/SF6_LEGAL_COPY_EN.md`、実装コードなし）  
メール未確定なら Contact 節はプレースホルダのまま。

または収益側: **USアフィ leverless ピラー公開地図**（draft → ページIA）。

迷ったら: **正確なデータ ＞ 米国で稼げる導線 ＞ 装飾**  
→ 審査耐性のため法定COPYが次点で効く。

---

*End of map — 刺し4完了。実装なし。*
