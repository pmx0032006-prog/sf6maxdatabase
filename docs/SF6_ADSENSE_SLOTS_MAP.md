# SF6 MAX DATABASE — AdSense仮枠置き場地図（刺し7）

> Generated: 2026-08-02  
> Scope: `C:\\Users\\pmx00\\sf6_site` のみ（実装コードなし）  
> Status: **地図のみ**（ユニットID差込・本番タグ接続は審査後）  
> 前提: US本拠／層A非接触／Amazon本丸は別刀／Impact棚上げ  
> 既存痕跡: `layout.tsx` に `ca-pub-8960641434315655` ＋ adsbygoogle script  
> コメント予約: `HomeSidebar` 内 `ADSENSE-HOME-SIDEBAR`

---

## 0. 絶対境界

| 項目 | 方針 |
|------|------|
| いまやる範囲 | **OK置き場の定義と仮枠ID案だけ** |
| いまやらない | 審査申請作業そのもの／クリック誘導／Auto ads 全面ONの強要 |
| 層A | 判定ビューア・フレーム表ヘッダ — **枠を置かない** |
| モバイル | 1画面に広告を重ねない（AdSense + Amazon 同時密集を避ける） |
| 文言 | 「Click the ad」系はサイト全体で禁止 |

---

## 1. 現状

| 項目 | 状態 |
|------|------|
| pub-id meta / script | **あり**（layout） |
| 画面上のAdSenseユニット | **未確認／未設置**（仮枠コンポーネントなし） |
| Amazonレール・キャラCTA | **稼働**（別刀。AdSenseと役割分担） |
| Privacy 広告節 | あり |
| Disclosure 専用ページ | COPY済み・ルート未実装 |

scriptが既にあるので、仮枠HTMLを足す前に **審査ポリシーとレイアウト規律** をこの地図で固定する。

---

## 2. OK置き場（仮枠スロット地図）

スロットIDは実装時のコメント／`id` 用。Googleの「広告ユニットID」取得は審査後。

| 優先 | Slot ID | ページ | DOM位置 | サイズ感 | メモ |
|-----:|---------|--------|---------|----------|------|
| 1 | `adsense-roster-below` | `/` および `/characters` | キャラ一覧（roster）の**下** | responsive / in-article | 読む流れの休憩。Amazon stripと隣接しすぎない |
| 2 | `adsense-about-below` | `/about` | About本文の**最下部**（JPG節を薄くしない） | responsive | オリジナル説明の後 |
| 3 | `adsense-char-after-data` | `/characters/[slug]` | フレーム＋判定が十分読めた**後**（`CharacterAmazonCta` の前後どちらか一方側） | responsive | Amazon CTAと**同時に画面上部へ出さない** |
| 4 | `adsense-guide-bottom` | `/guides/best-leverless-controllers-sf6` | ピラー最下部（Disclosure直前） | responsive | アフィ本丸ページ。1枠まで |
| 5 | `adsense-home-sidebar` | `/`（lg+） | `HomeSidebar` コメント位置 | fixed rectangle | デスクトップのみ。モバイル非表示 |
| 6 | `adsense-legal-bottom` | `/privacy` `/terms` `/disclosure` | 本文下 | responsive | 審査用ページにも薄い枠可。Contactは任意 |

### 2.1 キャラ詳細の順序（重要）

推奨スタック（上→下）:

1. 判定ビューア ＋ フレーム表（層A）  
2. 関連リンク等の既存UI  
3. **十分スクロール後**  
4. Amazon CTA（収益本丸）  
5. AdSense 1枠（薄い）  
6. Footer

AdSenseをAmazonより上に置く場合でも、**ビューア直下には置かない**。

---

## 3. NG置き場（絶対）

| 場所 | 理由 |
|------|------|
| 判定画像ビューア直上・オーバーレイ | 層A破壊・誤クリック・審査リスク |
| フレーム表ヘッダへの sticky 広告 | データ可読性破壊 |
| ホームREVOLVEヒーロー内 | ブランド／第一CTA汚染 |
| SiteHeader内 | ナビ邪魔 |
| モバイルでレールAmazon＋AdSense＋CTAが同一画面 | 多重禁止 |
| 「Click the ad to support」類 | ポリシー違反 |

Desktop side rails（2xl Amazon）に AdSenseを**積み増ししない**（Amazon専用のまま）。

---

## 4. 仮枠の見た目規律（実装時）

| 項目 | 方針 |
|------|------|
| 審査前 | 灰色の予約ボックス＋`Advertisement` ラベル程度で可（タグ未接続でもレイアウト確認用） |
| 審査後 | 同じSlot ID位置にユニット接続 |
| コントラスト | 白×白ゼロ（外壳トークンに合わせる） |
| CLS | 高さ min-height を先に確保 |
| 遅延 | ビューア画像より優先ロードしない |

コンポーネント案（後刺し）: `src/components/AdSenseSlot.tsx`  
props: `slotId`, `className`。層Aコンポーネント配下に入れない。

---

## 5. Auto ads 方針

| 方針 | 内容 |
|------|------|
| 既定 | **手動スロット優先**（OK置き場のみ） |
| Auto ads | 審査後も当面OFF推奨。ONにするならドク許可＋NG領域の除外確認後 |
| 理由 | 判定ビューア近傍に自動挿入されるリスクを避ける |

---

## 6. Amazonとの役割分担

| 刀 | 役割 | 置き場 |
|----|------|--------|
| Amazon | 高単価本丸 | レール／キャラCTA／leverlessピラー |
| AdSense | 表示の底上げ | 本地図のOK置き場のみ |

同じ帯に両方を並べるときは、**Amazonを主・AdSenseを従**。モバイルはどちらか一方を優先。

---

## 7. 法定・申請との接続

| 項目 | 依存 |
|------|------|
| Privacy / Terms / Contact / Disclosure | COPY済み。ページ実装＋公開メールが申請前に欲しい |
| About オリジナル | 維持（薄くしない） |
| Geo block | 維持。USで審査・表示される前提 |
| pub-id | `ca-pub-8960641434315655`（既存） |

申請チェック自体はドク作業。この地図は置き場固定が目的。

---

## 8. 受け入れ（刺し7）

| 項目 | 結果 |
|------|------|
| 地図が `docs/SF6_ADSENSE_SLOTS_MAP.md` に保存 | 本ファイル |
| OKスロットにID案がある | §2 |
| NGがビューア非接触で明記 | §3 |
| Auto ads 既定OFF | §5 |
| 実装コードなし | 遵守 |
| 層A非破壊 | 遵守 |

---

## 9. 地図フェーズの棚卸し（ここまで）

| 刺し | 成果物 |
|------|--------|
| 1 | `docs/SF6_REVOLVE_RENEWAL_MAP.md` |
| 2 | `docs/SF6_REVOLVE_TOKENS_MAP.md` |
| 3 | `docs/SF6_REVOLVE_HERO_MAP.md` |
| 4 | `docs/SF6_REVOLVE_LEGAL_MAP.md` |
| 5 | `docs/SF6_LEGAL_COPY_EN.md` |
| 6 | `docs/SF6_LEVERLESS_PILLAR_MAP.md` |
| 7 | 本ファイル（AdSense仮枠） |

実装に入るなら推奨順:

1. 公開メール確定 → 法定ページ実装  
2. AdSense仮枠（OK置き場）  
3. leverlessピラー公開  
4. ヒーロー外壳  
5. 監査 0 MISS → 公開確認（ドメイン＋ジオ＋申請）

---

## 10. 次の刺し候補（1個）

地図は一通り揃いました。次はどちらかです。

- **確認**: 公開連絡先メールを決める（法定実装の鍵）  
- **実装開始**: 「法定ページをやれ」（COPYを `/terms` `/contact` `/disclosure` へ）

迷ったら: **正確なデータ ＞ 米国で稼げる導線 ＞ 装飾**

---

*End of map — 刺し7完了。実装なし。*
