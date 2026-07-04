/** マリーザ — 214K派生・チャージ(ch)・画像 typo など */

const MARISA_ALIASES: Record<string, string[]> = {
  "214wpod": ["214pp"],
  "214hk": ["214hp"],
  "214lk": ["214lp"],
  "214mk": ["214mp"],
  "22hp": ["nj2hp", "nj2hp_hold"],
  "6hp": ["6mp_hp"],
  "214_lplk": ["4lplk", "214k_lplk"],
  "214p_6p": ["214lp_6p", "214mp_6p", "214hp_6p"],
  "214kkod_k": ["214k_k", "214kk"],
  "214kkod_p": ["214k_p", "214k_p_p", "214kk"],
  "214kkod_lplk": ["214k_lplk", "214kk"],
  "214kkod_p_2": ["214k_p_p", "214k_p"],
  "3hphp": ["3hp_3hp"],
  "hphp": ["5hp_hp"],
  "lplp": ["5lp_lp"],
  "mpmp": ["5mp_mp"],
  "6hhk": ["6hk_6hk"],
  "holdhk": ["5hk_hold", "2hk_hold", "6hk_hold", "jhk_hold"],
  "j2hp": ["nj2hp", "nj2hp_hold"],
  "2km": ["2mk"],
  "236p_ch": ["236lp_hold", "236mp_hold", "236hp_hold"],
};

function chargeHoldCandidates(motion: string): string[] {
  if (!/_ch$/i.test(motion)) return [];
  const base = motion.replace(/_ch$/i, "");
  if (base === "236p") {
    return ["236lp_hold", "236mp_hold", "236hp_hold"];
  }
  return [`${base}_hold`];
}

function normalizeMarisaKey(key: string): string {
  return key
    .replace(/^marizz_/i, "mariza_")
    .replace(/^mariza_/, "")
    .replace(/214hk/gi, "214hp")
    .replace(/214lk/gi, "214lp")
    .replace(/214mk/gi, "214mp")
    .replace(/22hp/gi, "nj2hp")
    .replace(/^6hp$/i, "6mp_hp");
}

export function expandMarisaLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => {
    const v = k.toLowerCase();
    if (v && !out.includes(v)) out.push(v);
  };

  const key = normalizeMarisaKey(rawKey.toLowerCase()).replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const aliases = MARISA_ALIASES[key];
  if (aliases) {
    for (const alias of aliases) add(alias);
  }

  for (const candidate of chargeHoldCandidates(key)) add(candidate);

  if (key.startsWith("214kkod")) {
    const suffix = key.replace(/^214kkod_?/, "");
    if (suffix) {
      add(`214k_${suffix}`);
      if (suffix === "p") add("214k_p_p");
    }
    add("214kk");
  }

  return out;
}
