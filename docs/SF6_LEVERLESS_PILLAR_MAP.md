# SF6 MAX DATABASE — US Leverless ピラー公開地図（刺し6）

> Generated: 2026-08-02  
> Scope: `C:\\Users\\pmx00\\sf6_site` のみ（実装コードなし）  
> Status: **地図のみ**  
> Draft参照: `scripts/us_affiliate/leverless-pillar-draft.md`  
> 前提: Amazon.com 本丸（tag `sf6maxdatabas-20`）／ Impact **棚上げ・粘らない**  
> 関連: 刺し1収益節 ／ `src/data/affiliate-gear.ts` ／ 法定COPY・Disclosure

---

## 0. 絶対境界

| 項目 | 方針 |
|------|------|
| 目的 | 検索流入 × CVR の **アフィ本丸ページ**（層B） |
| 層A | 判定／フレーム／lookup — **壊さない・広告で覆わない** |
| CTA主 | Amazon.com のみ（Impact公式CTAは書かない） |
| 開示 | `/disclosure`（未実装なら当面 `/about#affiliate` → 後で寄せる） |
| NG | ビューア直上・フレーム表ヘッダ張り付き・「Click the ad」・モバイル多重 |

---

## 1. Draftからの戦術更新

| Draft（2026-07-23） | いまの正 |
|---------------------|----------|
| Impact + Amazon hybrid | **Amazon only**（Impact却下済み） |
| TOP3: Kitsune / Hit Box / Victrix | ドル箱に合わせて差し替え（下表） |
| Hit Box 公式寄せ | 在庫・ASIN未固定なら **載せない or 後段**（曖昧リンク禁止） |
| 攻略長文量産 | **しない**。比較短文＋表＋CTAのみ |

---

## 2. 公開URL / IA

| 項目 | 値 |
|------|-----|
| Path | `/guides/best-leverless-controllers-sf6` |
| Title | Best Leverless Controllers for Street Fighter 6 (2026) |
| H1 | Best Leverless Controllers for SF6 |
| Meta | US FGC leverless picks for SF6 — Kitsune, Haute42, Victrix FS-12, and more. Amazon picks with honest platform notes. |
| Index | sitemap に追加（実装時） |
| Layout | 既存 SiteHeader / Footer。外壳トーンはトークン地図に合わせ可 |

ページは **ガイド1枚**。キャラ詳細の機能は触らない。

---

## 3. 商品カード地図（Amazonドル箱と同期）

主砲（ページ上半分・比較表の核）:

| 順 | 商品 | ASIN | 役割 | 注意 |
|----|------|------|------|------|
| 1 | Razer Kitsune | `B0CCX2DMXV` | US #1 / PS5+PC | 第一CTA |
| 2 | Haute42 M Ultra | `B0DQ4PTBCW` | 高CVRバジェット | 第二CTA |
| 3 | Victrix Pro FS-12 | `B0B3VQKGHW` | プレミアム | 旧スティックASINと混同しない |
| 4 | 8BitDo Leverless | `B0F7RMB4RH` | 安・話題 | **Xbox/PC。PS5非対応を赤字級で明記** |

ついで買い（コンバータ帯・表の下）:

| 商品 | ASIN | 役割 |
|------|------|------|
| Haute42 Booter5 | `B0GSHLBQSB` | Haute系→PS5 |
| Brook Wingman FGC2 | `B0DLWD1WMQ` | 汎用PS5アダプタ |

リンク形（常にこれ）:

`https://www.amazon.com/dp/{ASIN}?tag=sf6maxdatabas-20`

CTAラベル案: `Check price on Amazon`（公式Impactボタンは置かない）

---

## 4. セクション順（短く・1仕事ずつ）

1. **Who this is for** — frame/hitbox学習者向け（サイト本線と接続）  
2. **Why leverless in SF6** — 同時入力・方向転換・学習との相性（3〜5箇条）  
3. **Quick picks** — 上表1〜4＋Amazon CTA  
4. **Comparison table** — Platform / Best for / Watch-outs（価格は変動するので「See Amazon」でも可）  
5. **Who should NOT buy** — パッド派・予算・PS5必須なのにXbox機を選ぶ人 等  
6. **Converters** — Booter5 / Wingman（必要な人だけ）  
7. **Practice with data** — 内部リンク: `/characters`・代表キャラ1〜2・`/about#jpg`  
8. **Disclosure** — `/disclosure`（または暫定 About）  
9. **Optional AdSense** — ページ最下部のみ（ビューア無しページなので厚め可。それでも1枠推奨）

禁止: 長文攻略・パッチ速報日記・GIF埋め込み・画像一括デコード。

---

## 5. 比較表の列（公開前に埋める）

| 列 | 必須 | メモ |
|----|------|------|
| Product | ○ | 上表 |
| Platforms | ○ | Kitsune PS5/PC／8BitDo Xbox+PC 等を正確に |
| Best for | ○ | tournament / budget / premium |
| Watch-outs | ○ | PS5非対応・ドングル必要など |
| Amazon | ○ | tag付き |
| Price USD | △ | 変動大 → 数値固定より「Check Amazon」優先可 |

Draftの未チェック（price/cable/Modern）は、分かる範囲だけ。曖昧なら書かない。

---

## 6. 内部リンク設計（DB → ピラー）

| 出元 | 入れ方 | 層A影響 |
|------|--------|---------|
| `CharacterAmazonCta` 付近 | 「Full leverless guide」テキストリンク1本 | 機能変更なし |
| HomeSidebar / レール | ガイドへの小さなリンク | なし |
| About 下部 | Guides への1リンク | About本文は薄くしない |
| Footer | 任意 | なし |

キャラCTAのASIN順（現行正）は維持: Kitsune → Haute42 → FS-12。  
ピラーはそれを説明する「本丸記事」にする。

---

## 7. SEO / 差別化（UFDとのすみ分けを壊さない）

| やる | やらない |
|------|----------|
| 「frame DB siteが選ぶレバーレス」視点 | UFDのGIF通常技を真似る |
| 軽量JPG＋フレーム学習との接続文 | 攻略コンボ長文 |
| プラットフォーム注意の正直さ | 誇大「必ず勝つ」 |

Titleに Year（2026）は draft踏襲可。煽りすぎない。

---

## 8. 実装ファイル候補（後刺し・いま作らない）

| ファイル | 役割 |
|----------|------|
| `src/app/guides/best-leverless-controllers-sf6/page.tsx` | ページ本体 |
| 既存 `affiliate-gear.ts` | ASIN単一ソース（ページはここをimport） |
| `sitemap.ts` | ルート追加 |
| draft md | 編集メモのまま残す／または「昇格済み」注記のみ |

新規の重い画像パイプラインは不要。Amazon画像ホットリンクに依存しすぎない（テキスト＋公式風でも可）。

---

## 9. 受け入れ（刺し6）

| 項目 | 結果 |
|------|------|
| 地図が `docs/SF6_LEVERLESS_PILLAR_MAP.md` に保存 | 本ファイル |
| Impact棚上げ・Amazon主が明記 | §0 / §1 |
| ドル箱ASINと同期 | §3 |
| 8BitDo PS5非対応を明記 | §3 |
| 層A非破壊・NG置き場明記 | §0 / §6 |
| 実装コードなし | 遵守 |

---

## 10. 次の刺し候補（1個）

地図フェーズの残り候補:

1. **刺し7 — AdSense仮枠置き場地図**（OK置き場のみ・ビューア非接触）  
2. またはドクが実装フェーズへ切るなら、優先は **法定ページ実装**（メール確定後）→ ピラー実装 → ヒーロー外壳

迷ったら: **正確なデータ ＞ 米国で稼げる導線 ＞ 装飾**

ドクへ一言（任意）: 公開メールが決まれば、法定ページ実装に進める準備が揃っています。

---

*End of map — 刺し6完了。実装なし。*
