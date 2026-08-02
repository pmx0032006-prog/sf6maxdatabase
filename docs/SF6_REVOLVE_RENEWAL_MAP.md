# SF6 MAX DATABASE × REVOLVE — 境界・地図（刺し1）

> Generated: 2026-08-02  
> Scope: C:\\Users\\pmx00\\sf6_site only  
> Status: **地図のみ（実装コードなし）**  
> Identity: US公開の判定JPG＋フレームDB。予約ロビーではない。生活の要の1つめ＝米国収益。

---

## 0. 絶対境界（守る）

| 項目 | 方針 |
|------|------|
| 触ってよい木 | C:\\Users\\pmx00\\sf6_site のみ |
| 触るな | prem-reservation-platform / prem-reservation-platform-tekken8 |
| 層A | 判定画像・フレーム・lookup・wiki-full-ui・trash・30キャラ |
| 赤線 | 
px tsx scripts/audit-all-characters.ts → **0 MISS** |
| 禁止 | GIF辞書化・重いアニメ・画像一括フルデコード・攻略長文量産 |
| REVOLVE本線 | 読むだけ。SF6へ写す。本線は書き換えない |
| Git | 無断 commit / 無断本番破壊禁止 |

### 層A 保護パス（壊す提案をしない）

- src/data/wiki-frame-data.json
- src/lib/wiki-frame-lookup.ts / wiki-full-ui.ts / 
esolve-moves.ts
- src/lib/character-images.ts / character-image-path.ts / *move-lookup.ts
- src/components/character/*（判定ビューア・フレーム表中核）
- public/images/characters/*_jpg
- scripts/audit-all-characters.ts

---

## 1) ジオブロック地図（US本拠）

### 現状（実装済み・維持）

| 層 | 場所 | 内容 |
|----|------|------|
| Edge middleware | src/middleware.ts | ENFORCE_GEO_BLOCK = true |
| 判定ヘッダ | x-vercel-ip-country | 一致で **451 Not Available** |
| Cloudflare | オレンジ雲＋国制限 | グレーに戻さない（既存方針） |

### 現行ブロック国コード（middleware と同期）

JP, CN, RU, BY, IR, KP, MM, TM, DO, PK

### プロンプト要求とのギャップ

| 要求 | 現状 | ギャップ |
|------|------|----------|
| US本拠・主戦場 | 方針どおり（ホワイトリストではない） | 「許可国ホワイトリスト」は未導入（拒否リスト型） |
| JP / DO / CN | ブロック済み | OK |
| 戦争／侵略国を単一ソース化 | middleware 内ハードコード | **geo-block 設定ファイルへの単一ソース化が未** |
| 管理者JP例外 | 未地図化 | ドク確認事項（IP許可等）。一般開放はしない |
| Privacy/Terms に地域制限一文 | Privacy あり／Terms なし | Terms＋短文追記が未 |
| ブロック試験手順の文書 | なし | 本地図 §1.1 に試験方法を定義 |

### 1.1 ブロック試験方法（受け入れ用・1つ）

1. **US許可**: US VPN または Vercel/Cloudflare ログで country=US の 200 を確認  
2. **JP遮断**: JP出口 IP で https://www.sf6maxdatabase.com/ → **451**（または Cloudflare ブロック画面）  
3. **DO/CN**: 同様に遮断を確認（可能な範囲）  
4. 試験結果は docs/geo-block-test-log.md に日付付きで追記（後刺し）

### 1.2 推奨単一ソース（実装は後刺し・提案のみ）

- 候補パス: src/config/geo-block.ts（または src/data/geo-block.json）  
- 中身: BLOCKED_COUNTRIES + ENFORCE_GEO_BLOCK + コメント（Cloudflareリストと同期）  
- middleware / Cloudflare ドキュメントはそこを参照するだけにする  
- **判定パイプライン・アフィリエイトコードとは分離**

### ドク確認待ち（§10）

1. 戦争／侵略国の**正式**ISOリスト確定（現行10コードで足りるか）  
2. 管理者の日本例外アクセス方法  

---

## 2) 米国収益設計地図（AdSense＋アフィリエイト）

### 二刀

| 刀 | 役割 | 現状 | 次 |
|----|------|------|-----|
| AdSense | 表示収益の基盤 | Privacy に記載あり。枠の本番埋めは未確認 | 審査・OK置き場のみ仮枠 |
| Amazon Associates US | 高単価本丸 | **稼働中** 	ag=sf6maxdatabas-20 | ドル箱4選＋CTA済み。ピラー強化 |
| Impact | 棚上げ | 却下済み・粘らない | 触らない |
| Direct sponsor | 後段 | なし | 信用と数のあと |

### 既存アフィ資産（活かす）

| 資産 | パス | 状態 |
|------|------|------|
| 商品マスタ | src/data/affiliate-gear.ts | Kitsune / Haute42 / FS-12 / 8BitDo + converters |
| サイドレール | src/components/DesktopSideRails.tsx | US Meta / Premium・Buzz |
| キャラCTA | src/components/character/CharacterAmazonCta.tsx | 判定後 |
| ホーム推奨 | homePrimeGear() | Kitsune + Haute42 |
| ピラー下書き | scripts/us_affiliate/leverless-pillar-draft.md | 未公開ページ化 |
| 開示 | About #affiliate + Privacy affiliate 節 | 英語あり。専用 Disclosure ページは薄い |

### OK置き場（プロンプト準拠・現状照合）

| 置き場 | AdSense | Affiliate | 現状 |
|--------|---------|-----------|------|
| キャラ一覧下 | ○ | ○ | フッターstrip等 |
| About 下部 | ○ | ○ | あり |
| キャラ詳細・十分スクロール後 | ○軽 | ○本丸CTA | CharacterAmazonCta あり |
| ギア特集ページ | ○ | ○厚く可 | **未**（draftのみ） |
| デスクトップレール | △邪魔に注意 | ○ | あり（2xl） |

### NG置き場（絶対）

- 判定画像ビューア直上・オーバーレイ  
- フレーム表ヘッダ張り付き  
- モバイル1画面に広告多重  
- 「Click the ad」誘導  

### がっつり設計（優先順・実装は後）

1. **維持**: 判定パス＋現行Amazonドル箱導線  
2. **法定**: Terms / Contact / Ads+Affiliate Disclosure（英語）を揃える → AdSense審査耐性  
3. **AdSense**: OK置き場のみスロット（一覧下・詳細下部・About）。ビューア非接触  
4. **アフィ本丸ページ**: /guides/best-leverless-controllers-sf6（draft昇格）。検索流入×CVR  
5. **計測**: US中心（Vercel Analytics / AdSense / Amazon reports）  
6. Impact再申請はしない  

### 収益ギャップ要約

| 項目 | ギャップ |
|------|----------|
| Terms / Contact ページ | **欠落** |
| AdSense 本番ユニット | 未確認／仮枠未設置 |
| Leverless ピラー公開 | draftのみ |
| ジオ×収益コピー整合 | Privacyに地域制限一文が薄い |

---

## 3) REVOLVE新編成ギャップ（外壳のみ・層A非破壊）

### 当てるもの（層B）

- コンパクト・ヒーロー新編成（小ピル＋キッカー＋大タイトル）  
- 優しさマニフェスト（英語短句）  
- 白地×白字ゼロ／タイトル潰れ禁止  
- 第一CTA = **Characters / Look up frames**（募集ではない）  
- Privacy / Terms / Contact / Disclosure  
- 広告・アフィ枠規律  

### 当てないもの（禁止融合）

- トップをロビー予約に差し替え  
- FastAPIロビー同居  
- 判定をカード装飾で見にくくする  
- 闘魂／鉄拳の鍵・タグ・ドメイン混入  

### ギャップ表（現状 → 目標）

| 要素 | 現状（概略） | REVOLVE目標 | 層A影響 |
|------|--------------|-------------|---------|
| ヒーロー | 既存ホーム構成 | 上段コンパクト＋英キッカー＋大タイトル | なし（外壳） |
| Pill | 未統一の可能性 | US · SF6 · FRAME + HITBOX · FREE | なし |
| Kicker | 要確認 | THE KINDEST FIGHTING GAME FRAME DATABASE ON EARTH | なし |
| Manifesto | 弱／なし | Don't rage 等の英語短句 | なし |
| 第一CTA | Characters系あり想定 | Look up frames を第一 | 導線強化のみ |
| コントラスト | 暗色テーマ運用中 | 白箱×白字ゼロ監査 | なし |
| 一覧 | 機能あり | 読みやすさリニューアル | 見た目のみ |
| 詳細 | 判定＋フレーム健在 | 視線誘導のみ。機能変更なし | **機能変更禁止** |
| About | 英語で存在・JPG方針あり | 強化（薄くしない） | なし |
| Terms/Contact | **欠** | 英語新設 | なし |
| REVOLVE併記 | なし | ドク確認 | なし |

### デザイン移植の境界

| SF6 | REVOLVE本線 |
|-----|-------------|
| Next.js sf6_site :3000 | FastAPI :8000/:8001 |
| デザインシステム（色・字・余白・ヒーロー型）のみ写す | API・ロビーは写さない |

---

## 4. 受け入れテスト（GO）チェック — 刺し1時点

| 項目 | 刺し1 |
|------|-------|
| 地図が docs に保存された | 本ファイル |
| 層A保護リストが明示 | §0 |
| ジオ／収益／新編成ギャップが短く地図化 | §1–3 |
| 実装コードを書いていない | 遵守 |
| マーヴル／鉄拳木を変更していない | 遵守 |

残GO（後刺し）: US開く / JP遮断試験ログ / 0 MISS再走 / ヒーロー新編成 / 法定ページ / AdSense枠 / アフィピラー公開

---

## 5. 次の刺し候補（実装はドクの「やれ」後）

推奨順（短い刺し）:

1. **ジオ単一ソース化設計の確定**（ドクの正式国リスト確認後）  
2. **法定英語ページ地図→Terms/Contact/Disclosure**  
3. **ヒーロー新編成（外壳のみ）**  
4. **Leverlessピラー公開（アフィ本丸）**  
5. **AdSense仮枠（OK置き場のみ）**  
6. 監査 0 MISS  

迷ったら: **正確なデータ ＞ 米国で稼げる導線 ＞ 装飾**

---

## 6. ドク確認事項（ブロッカー）

1. 戦争／侵略国の正式ブロックリスト（ISO）  
2. 管理者JP例外の方法  
3. REVOLVEワードマーク併記の有無  
4. AdSense以外の広告網の有無  
5. メインアフィ継続確認（Amazon.com = 現行正）  
6. 公開連絡先メール  
7. ドメイン／Vercel状態の最新確認  

---

*End of map — 刺し1完了。実装なし。*
