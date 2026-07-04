# SF6 MAX DATABASE 攻略サイト

- フォルダ：`C:\Users\pmx00\sf6_site`
- 起動：`npm run dev` → http://localhost:3000
- 状態：**v1.0** / **30キャラ**判定画像 + **30キャラWikiフレーム数値** + **30キャラ move lookup 0 MISS** + **wiki-full-ui 30キャラ** + **Aboutページ** / ドメイン決定のみ（未購入）
- 方針：軽量・低画質JPG・CSSホバー0.3sのみ / 重いアニメ・ライブラリ禁止 / **攻略記事は載せない** / 将来**全世界多言語**
- サイト名：**Street Fighter 6 MAX DATABASE**（略称 SF6 MAX DATABASE）
- ドメイン：**sf6maxdatabase.com**（決定済み・未購入）
- 差別化：**GIFではなく低画質JPG**（約3万枚抽出）/ **低スペックスマホ向け**（UFD等のGIF辞書とは別カテゴリ）
- 素材：`Desktop\ストリートファイター6　攻略サイト　素材\…20260620`
- 同期：`npm run sync:images`（判定画像 + サムネ30枚）※ Node同期は環境によってクラッシュする場合あり（ingrid は手動コピーでも可）
- ビルド：`npx next build` **成功確認済み（2026-07-02・30キャラ）**
- 監査：`npx tsx scripts/audit-all-characters.ts` → **0 MISS**
- 実装：Cursor Pro+（Auto） / 指示は1つずつ
- 再開：新チャットで `PROJECT_RESUME.md` を読ませる

---

## 公開方針（仕上げ段階で細部調整）

- 最終的に**アメリカ発サイト**を目指す
- 今は**日本語ベース**で開発
- 日本は**管理者のみ閲覧** / ドミニカ公開 / 特定国は制限予定
- **技検索・モダン専用開発は今は不要**（キャラ→セクションで十分）

---

## ローカルURL

| ページ | URL |
|--------|-----|
| トップ | http://localhost:3000 |
| About | http://localhost:3000/about |
| キャラ一覧 | http://localhost:3000/characters |
| キャラ例 | http://localhost:3000/characters/cammy |
| Ingrid | http://localhost:3000/characters/ingrid |

```powershell
cd C:\Users\pmx00\sf6_site
npm run dev
```

---

## 完了していること

### サイト全体
- ブランド：**SF6 MAX DATABASE**
- トップ：キャラグリッド + Features + News
- **Aboutページ**（JPG方針・データの見方・ソース・今後の方針）
- 全30キャラ slug 登録済み（**30人目：Ingrid**）

### 全30キャラ（判定画像 + フレーム数値 + lookup）
- **30キャラ全員 0 MISS**
- wiki-full-ui 30キャラ有効
- Ingrid：`ing_jpg` 97枚 / Wiki cargo 83技 / `ingrid-move-lookup.ts`
- ゴミ箱対応（`image-trash.ts` / `_trash`）

### キャミィのみ攻略テキスト（レガシー・今後は拡張しない方針）
- `public/text/cammy_c.txt` / `cammy_m.txt`（タブは残存、新規記事は作らない）

---

## 主要ファイル

| ファイル | 役割 |
|---------|------|
| `src/app/about/page.tsx` | About（差別化・読み方） |
| `src/lib/site.ts` | サイト名・タグライン |
| `src/lib/wiki-frame-lookup.ts` | Wikiフレーム + lookup統合 |
| `src/lib/move-sort.ts` | フレーム連番判定（_1〜_99のみ除去） |
| `src/lib/ingrid-move-lookup.ts` | Ingrid 画像↔Wiki 別名 |
| `scripts/audit-all-characters.ts` | 30キャラ一括監査 |

---

## 次にやること

1. **ドメイン購入 + Vercel 公開**（月収0円のままなので最優先候補）
2. （任意）PWA・ホーム画面追加
3. （任意）多言語 i18n 下地
4. （仕上げ時）地域制御・公開範囲

---

## 新チャットでの最初の一文例

> `C:\Users\pmx00\sf6_site` の SF6 MAX DATABASE 続き。`PROJECT_RESUME.md` 参照。次は「〇〇」を1つだけお願いします。
