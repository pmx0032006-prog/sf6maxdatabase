/** エレナ — 236p派生・Moon Glider(214)~6P・TC・空中コンボ など */

const ELENA_ALIASES: Record<string, string[]> = {
  "214hp_6hp": ["214p_6p"],
  "214lp_6lp": ["214p_6p"],
  "214mp_6mp": ["214p_6p"],
  "214mk_6mp": ["214p_6p"],
  "214mk_6mp_6mp": ["214p_6p"],
  "214ppod_6lp": ["214pp_6p"],
  "236mp_6hk": ["236p_6hk"],
  "236mp_6hp": ["236p_6hp"],
  "236mp_6lk": ["236p_6lk"],
  "236mp_6lp": ["236p_6lp"],
  "236mp_6mk": ["236p_6mk"],
  "236mp_6mp": ["236p_6mp"],
  "2mkhk": ["2mk_hk"],
  "5mkhk": ["5mk_hk"],
  "5mpmp": ["5mp_mp"],
  "5hphphp": ["6hp_hp_hp", "5hp_hp"],
  "6hphp": ["6hp_hp"],
  "6mkmk": ["6mk_mk"],
  jlpmk: ["jlp_jmk"],
  jmphp: ["jmp_jhp"],
  sre_214hp: ["214hp"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeElenaKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^sre_/, "ere_")
    .replace(/^ere_/, "")
    .replace(/214hp_6p/gi, "214p_6p")
    .replace(/214lp_6p/gi, "214p_6p")
    .replace(/214mp_6p/gi, "214p_6p")
    .replace(/214mk_6p(?:_6p)?/gi, "214p_6p")
    .replace(/236mp_6/gi, "236p_6")
    .replace(/5hphphp/gi, "6hp_hp_hp")
    .replace(/5mkhk/gi, "5mk_hk")
    .replace(/2mkhk/gi, "2mk_hk")
    .replace(/5mpmp/gi, "5mp_mp")
    .replace(/6hphp/gi, "6hp_hp")
    .replace(/6mkmk/gi, "6mk_mk")
    .replace(/jlpmk/gi, "jlp_jmk")
    .replace(/jmphp/gi, "jmp_jhp")
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

export function expandElenaLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeElenaKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = ELENA_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
  }

  return out;
}
