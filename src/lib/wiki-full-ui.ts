/** WikiフルUI（プレイヤー向け表）を有効にしたキャラ — 1人ずつ追加 */
const WIKI_FULL_UI_SLUGS = new Set([
  "alex",
  "aki",
  "akuma",
  "blanka",
  "cammy",
  "c-viper",
  "chun-li",
  "dhalsim",
  "dee-jay",
  "ed",
  "elena",
  "e-honda",
  "guile",
  "ingrid",
  "jamie",
  "jp",
  "juri",
  "ken",
  "kimberly",
  "lily",
  "luke",
  "m-bison",
  "mai",
  "manon",
  "marisa",
  "rashid",
  "ryu",
  "sagat",
  "terry",
  "zangief",
]);

export function hasWikiFullUi(characterSlug: string): boolean {
  return WIKI_FULL_UI_SLUGS.has(characterSlug);
}
