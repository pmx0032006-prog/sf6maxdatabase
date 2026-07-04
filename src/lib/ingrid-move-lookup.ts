/** イングリッド — ing_ 画像接頭辞・OD・TC・空中派生・SA など */

const INGRID_ALIASES: Record<string, string[]> = {
  "2141c_214hp": ["214hp_1stock", "214hp"],
  "2144c_214hp": ["214hp_1stock", "214hp"],
  "2144c_214ppod": ["214pp"],
  "214214lp_7": ["214214p_0stock"],
  "214214lp_sa2_1": ["214214p_0stock"],
  "214214lp_sa2_2": ["214214p_0stock"],
  "214214lp_sa2_3": ["214214p_0stock"],
  "214214lp_sa2_4": ["214214p_0stock"],
  "214214lp_sa2_5": ["214214p_0stock"],
  "214214lp_sa2_6": ["214214p_0stock"],
  "214214lp_sa2_7": ["214214p_0stock"],
  "236236lk_sa1_1": ["236236k_0stock"],
  "236236lk_sa1_2": ["236236k_0stock"],
  "236236lk_sa1_3": ["236236k_0stock"],
  "236236lp_sa31.5": ["236236p"],
  "236236lp_sa3_1": ["236236p"],
  "236236lp_sa3_2": ["236236p"],
  "236236lp_sa3_3": ["236236p"],
  "236236lp_sa3_4": ["236236p"],
  "236236lp_sa3_5": ["236236p"],
  "236236lp_sa3_6": ["236236p"],
  "236kkod_2": ["236kk"],
  "236kkod_3": ["236kk"],
  "236kkod_4": ["236kk"],
  "236ppod_1": ["236lpmp", "236mphp"],
  "236ppod_2": ["236lpmp", "236mphp"],
  "22hk": ["22k"],
  "22kkod": ["22kk"],
  "22lk": ["22k"],
  "22lk_1": ["22k"],
  "22lk_2": ["22k"],
  "22mk": ["22kk"],
  "4hphp": ["4hp_hp"],
  "4mkhp": ["4mk_hp"],
  "8j214_2c": ["j214mp"],
  "8j214_3c": ["j214mp"],
  "8j214hp": ["j214hp_1stock", "j214hp_2stock", "j214mp"],
  "8j214hp_cx": ["j214hp_1stock", "j214pp"],
  "8j214lp_4c": ["j214lp"],
  "8j214lp_end": ["j214lp"],
  "8j214mp": ["j214mp"],
  "8j214ppod_cx": ["j214pp"],
  "8jhkhk_1": ["jhk_jhk"],
  kkod_1: ["22kk", "236kk"],
  kkod: ["22kk", "236kk"],
  ing_kkod: ["22kk", "236kk"],
  lmp: ["5mp_mk"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function superCandidates(key: string): string[] {
  const out: string[] = [];

  if (/214214lp(?:_\d+|_sa\d.*)?$/i.test(key)) {
    addUnique(out, "214214p_0stock");
    addUnique(out, "214214p");
  }
  if (/236236lk_sa\d/i.test(key)) {
    addUnique(out, "236236k_0stock");
    addUnique(out, "236236k");
  }
  if (/236236lp_sa\d/i.test(key)) {
    addUnique(out, "236236p");
    addUnique(out, "236236p(ca)");
  }

  return out;
}

function normalizeIngridKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^ing_/, "")
    .replace(/^8j214/gi, "j214")
    .replace(/214214lp/gi, "214214p")
    .replace(/236236lk/gi, "236236k")
    .replace(/22hk/gi, "22k")
    .replace(/22mk/gi, "22kk")
    .replace(/4hphp/gi, "4hp_hp")
    .replace(/4mkhp/gi, "4mk_hp")
    .replace(/jhkhk/gi, "jhk_jhk")
    .replace(/ppod/gi, "pp")
    .replace(/_+$/, "");
}

function odComboCandidates(key: string): string[] {
  const out: string[] = [];

  if (/ppod$/i.test(key)) {
    addUnique(out, key.replace(/ppod$/i, "pp"));
    addUnique(out, key.replace(/ppod$/i, "lpmp"));
    addUnique(out, key.replace(/ppod$/i, "mphp"));
  }
  if (/kkod$/i.test(key)) {
    addUnique(out, key.replace(/kkod$/i, "kk"));
  }
  if (/lpmpod$/i.test(key)) {
    addUnique(out, key.replace(/lpmpod$/i, "lpmp"));
  }
  if (/mphpod$/i.test(key)) {
    addUnique(out, key.replace(/mphpod$/i, "mphp"));
  }

  return out;
}

export function expandIngridLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeIngridKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = INGRID_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
    for (const sa of superCandidates(candidate)) add(sa);
  }

  return out;
}
