/** 豪鬼 — Demon Raid派生・OD/hold・瞬獄(Syungoku)・空中236 など */

const AKUMA_ALIASES: Record<string, string[]> = {
  "236hk": ["236hp"],
  "236lk": ["236lp"],
  "236mk": ["236mp"],
  "236od": ["236pp"],
  "214od": ["214pp"],
  "623od": ["623pp"],
  j214od: ["j214pp"],
  j236od: ["j236pp"],
  j236lp: ["j236p"],
  "236k_n": ["236k_no_input"],
  "236k_lp": ["236k_p"],
  "236k_lk": ["236k_k"],
  "236k_km": ["236k_k"],
  "236lk_lp": ["236k_p"],
  "236lk_hk": ["236k_k"],
  "236kkod_214lk": ["236kk_j214k"],
  "236kkod_236lp": ["236kk_j236p"],
  "236od_214lk": ["236kk_j214k"],
  "236od_236lp": ["236kk_j236p"],
  "214hphp": ["214hp_6p"],
  "214hp_6hp": ["214hp_6p"],
  "214lp_6lp": ["214lp_6p"],
  "214mpmp": ["214mp_6p"],
  "214mp_6mp": ["214mp_6p"],
  "214ppod_6hp": ["214pp_6p"],
  "5mkhk": ["5mk_hk"],
  "5mpmp": ["5mp_mp"],
  "6hphp": ["6hp_6hp"],
  "6hphphk": ["6hp_6hp_hk"],
  lplp6lkhp: ["lp_lp_6lk_hp(ca)"],
  syungoku: ["lp_lp_6lk_hp(ca)"],
  "9j236hp": ["j236p"],
  "9j236lp": ["j236p"],
  "9j236mp": ["j236p"],
  eku_236mp: ["236mp"],
  sa1: ["236236p"],
  sa2: ["214214p", "214214k"],
  sa3: ["236236k", "236236k(ca)", "lp_lp_6lk_hp(ca)"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeAkumaKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^eku_/, "aku_")
    .replace(/^aku_/, "")
    .replace(/_hld/gi, "_hold")
    .replace(/214hphp/gi, "214hp_6p")
    .replace(/214mpmp/gi, "214mp_6p")
    .replace(/5mkhk/gi, "5mk_hk")
    .replace(/5mpmp/gi, "5mp_mp")
    .replace(/6hphphk/gi, "6hp_6hp_hk")
    .replace(/6hphp/gi, "6hp_6hp")
    .replace(/236od/gi, "236pp")
    .replace(/214od/gi, "214pp")
    .replace(/623od/gi, "623pp")
    .replace(/j214od/gi, "j214pp")
    .replace(/j236od/gi, "j236pp")
    .replace(/236hk/gi, "236hp")
    .replace(/236lk/gi, "236lp")
    .replace(/236mk/gi, "236mp")
    .replace(/236k_n/gi, "236k_no_input")
    .replace(/236k_lp/gi, "236k_p")
    .replace(/236k_lk/gi, "236k_k")
    .replace(/236k_km/gi, "236k_k")
    .replace(/236lk_lp/gi, "236k_p")
    .replace(/236lk_hk/gi, "236k_k")
    .replace(/236kkod_214lk/gi, "236kk_j214k")
    .replace(/236kkod_236lp/gi, "236kk_j236p")
    .replace(/236pp_214lk/gi, "236kk_j214k")
    .replace(/236pp_236lp/gi, "236kk_j236p")
    .replace(/lplp6lkhp/gi, "lp_lp_6lk_hp")
    .replace(/syungoku/gi, "lp_lp_6lk_hp")
    .replace(/_6lp/gi, "_6p")
    .replace(/_6hp/gi, "_6p")
    .replace(/_6mp/gi, "_6p")
    .replace(/_+$/, "");
}

function odComboCandidates(key: string): string[] {
  const out: string[] = [];

  if (/ppod$/i.test(key)) {
    addUnique(out, key.replace(/ppod$/i, "pp"));
  }
  if (/kkod$/i.test(key)) {
    addUnique(out, key.replace(/kkod$/i, "kk"));
  }

  return out;
}

function holdCandidates(key: string): string[] {
  const out: string[] = [];

  if (/236hp_hold/i.test(key) || /236lp_hold/i.test(key)) {
    addUnique(out, "236p_hold");
    addUnique(out, "236p_partial_hold");
  }
  if (/236pp_hold/i.test(key)) {
    addUnique(out, "236pp_hold");
  }

  return out;
}

function superCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeAkumaKey(key);

  if (/214214lp(?:_\d+)?_sa\d/i.test(k) || /214214lp_sa\d/i.test(k)) {
    addUnique(out, "214214p");
    addUnique(out, "214214k");
  }
  if (/236236lp(?:_\d+)?_sa\d/i.test(k) || /236236lp_sa\d/i.test(k)) {
    addUnique(out, "236236p");
  }
  if (/236236lk_sa\d/i.test(k) || /j236236lk_sa\d/i.test(k)) {
    addUnique(out, "236236k");
    addUnique(out, "236236k(ca)");
    addUnique(out, "j236236k");
  }
  if (/lp_lp_6lk_hp/i.test(k) || /syungoku/i.test(k)) {
    addUnique(out, "lp_lp_6lk_hp(ca)");
  }

  return out;
}

export function expandAkumaLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeAkumaKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = AKUMA_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
    for (const hold of holdCandidates(candidate)) add(hold);
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of superCandidates(normalized)) add(candidate);

  const jump = key.match(/^[789]j(.+)$/i);
  if (jump) {
    add(jump[1].toLowerCase());
    const inner = normalizeAkumaKey(jump[1]);
    if (inner !== jump[1].toLowerCase()) add(inner);
  }

  return out;
}
