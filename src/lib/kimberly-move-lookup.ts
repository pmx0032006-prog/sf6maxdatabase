/** キンバリー — スプレー缶・214P・236KK派生など */

const KIMBERLY_ALIASES: Record<string, string[]> = {
  "214lp": ["214p"],
  "214mp": ["214p"],
  "214hp": ["214p"],
  "22lp": ["22p_1stock", "22p_0stock"],
  "22lp_0": ["22p_0stock"],
  "22ppod_0": ["22pp_0stock"],
  "22mp": ["22p_1stock"],
  "22lp_1": ["22p_1stock"],
  "22ppod": ["22pp_0stock", "22pp_2stock"],
  "22lpmp": ["22pp_2stock"],
  "22lpmp_2": ["22pp_2stock"],
  "22mphp_2": ["22pp_2stock"],
  "22ppod_22lpmp": ["22pp_2stock"],
  "22ppod_22mphp": ["22pp_2stock"],
  "236kkodhk": ["236kk_hk"],
  "236kkodlk": ["236kk_lk"],
  "236kkodmk": ["236kk_mk"],
  "9j236lp": ["j236p"],
  "9j236mp": ["j236p", "j236pp"],
  "9j236hp": ["j236p", "j236pp"],
  "9j236ppod": ["j236pp"],
  "9j214214lp_sa2": ["j214214p"],
  "j236mp": ["j236p"],
  "5mphp": ["5mp_hp"],
  "5lpmp2hp": ["5lp_mp_2hp"],
  "5lpmp2hp2hk": ["5lp_mp_2hp_2hk"],
  "5lpmp2hphk": ["5lp_mp_2hp_hk"],
  "5lpmphphk": ["5lp_mp_hp_hk"],
  "236lk": ["236k_lk"],
  "236lk6": ["236k_lk"],
  "236lkhk": ["236k_hk"],
  "236lklk": ["236k_lk"],
  "236lklp": ["236k_p"],
  "236lkmk": ["236k_mk"],
  "236lkn": ["236k_lk"],
  "236lknlk": ["236k_lk"],
  "236lknlp": ["236k_p"],
  "236lk_hld": ["236k_lk"],
  "236lk_hld_k": ["236k_lk"],
  "236lk_hld_lp": ["236k_p"],
  "236lk_lp": ["236k_p"],
  "236mk_hld": ["236k_mk"],
  "236hk_hld": ["236k_hk"],
  "22pp_236236lk_bm": ["22pp_2stock", "236236k_1stock", "236236k_0stock"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeKimberlyKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^kin_/, "")
    .replace(/236lknlk/gi, "236k_lk")
    .replace(/236lknlp/gi, "236k_p")
    .replace(/236lknl/gi, "236k_lk")
    .replace(/236lkhk/gi, "236k_hk")
    .replace(/236lklk/gi, "236k_lk")
    .replace(/236lklp/gi, "236k_p")
    .replace(/236lkmk/gi, "236k_mk")
    .replace(/236lk6/gi, "236k_lk")
    .replace(/236lk_hld_lp/gi, "236k_p")
    .replace(/236lk_hld_k/gi, "236k_lk")
    .replace(/236lk_hld/gi, "236k_lk")
    .replace(/236lk_lp/gi, "236k_p")
    .replace(/236lk/gi, "236k_lk")
    .replace(/236mk_hld/gi, "236k_mk")
    .replace(/236hk_hld/gi, "236k_hk")
    .replace(/22pp_236236lk_bm/gi, "22pp_2stock")
    .replace(/_hld/gi, "_hold")
    .replace(/_bm$/i, "")
    .replace(/_+$/, "");
}

function saStockCandidates(motion: string): string[] {
  if (/236236lk_sa1/i.test(motion)) {
    return ["236236k_0stock", "236236k_1stock", "236236k"];
  }
  return [];
}

export function expandKimberlyLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => {
    const v = k.toLowerCase();
    if (v && !out.includes(v)) out.push(v);
  };

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  const normalized = normalizeKimberlyKey(key);
  const candidates = [key, normalized];

  for (const candidate of candidates) {
    if (!candidate) continue;
    add(candidate);
    for (const sa of saStockCandidates(candidate)) add(sa);
    const aliases = KIMBERLY_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    if (/^22lp_\d/.test(candidate)) add("22p_1stock");
    if (/^22mphp/.test(candidate)) add("22pp_2stock");
    if (/^22mp_22/.test(candidate)) add("22p_1stock");
  }

  return out;
}
