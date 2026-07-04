/** リュウ — 電刃(Denjin)・TC・236pp表記ゆれ など */

const RYU_ALIASES: Record<string, string[]> = {
  "22hp": ["22p"],
  "236hp_ch": ["236p(charged)", "236hp"],
  "236oopd_ch": ["236pp(charged)", "236pp"],
  "236oopd": ["236pp"],
  "5hphk": ["5hp_hk"],
  "5mplk": ["5mp_lk"],
  "5mplkhk": ["5mp_lk_hk"],
  jmp15: ["jmp"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeRyuKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^ryu_/, "")
    .replace(/22hp/gi, "22p")
    .replace(/236hp_ch/gi, "236p(charged)")
    .replace(/236oopd_ch/gi, "236pp(charged)")
    .replace(/236oopd/gi, "236pp")
    .replace(/5mplkhk/gi, "5mp_lk_hk")
    .replace(/5mplk/gi, "5mp_lk")
    .replace(/5hphk/gi, "5hp_hk")
    .replace(/jmp\d+\.\d+/gi, "jmp")
    .replace(/_ch$/i, "")
    .replace(/_+$/, "");
}

function chargedCandidates(key: string): string[] {
  const out: string[] = [];

  if (/236lp_ch|236mp_ch|236hp_ch/i.test(key)) {
    addUnique(out, "236p(charged)");
  }
  if (/236pp_ch|236oopd_ch/i.test(key)) {
    addUnique(out, "236pp(charged)");
  }
  if (/214lp_ch|214mp_ch|214hp_ch/i.test(key)) {
    addUnique(out, "214p(charged)");
  }
  if (/214pp_ch/i.test(key)) {
    addUnique(out, "214pp(charged)");
  }

  return out;
}

function odComboCandidates(key: string): string[] {
  const out: string[] = [];

  if (/ppod$/i.test(key)) {
    addUnique(out, key.replace(/ppod$/i, "pp"));
  }
  if (/oopd$/i.test(key)) {
    addUnique(out, key.replace(/oopd$/i, "pp"));
  }
  if (/kkod$/i.test(key)) {
    addUnique(out, key.replace(/kkod$/i, "kk"));
  }

  return out;
}

export function expandRyuLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeRyuKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = RYU_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
    for (const charged of chargedCandidates(candidate)) add(charged);
  }

  return out;
}
