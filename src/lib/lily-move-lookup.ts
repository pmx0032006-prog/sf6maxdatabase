/** リリー — 14789632→360・Windclad up_→_1stock など */

const LILY_ALIASES: Record<string, string[]> = {
  "214ppid": ["214pp"],
  "623od": ["623pp"],
  "6hphp": ["6hp_hp"],
  "6hphphp": ["6hp_hp_hp"],
  "2jp": ["jpp"],
  "pppod": ["623pp", "jppp"],
  "8jlpmp": ["jmp_mp"],
  "8j_mphp": ["jmp_mp"],
  "8jppod": ["jppp"],
  "8jpppod": ["jppp"],
  "236kkod_up": ["236mkhk_1stock", "236lkmk_1stock", "236kk"],
};

const STOCK_BASES = [
  "236lk",
  "236mk",
  "236hk",
  "236kk",
  "236kkod",
  "623lp",
  "623mp",
  "623hp",
  "236236lk_sa2",
  "8j236236lk_sa2",
  "j236236lk_sa2",
];

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

/** 14789632lp → 360lp（メキシカン・タイフーン等） */
function parseNumpad360(key: string): string[] {
  if (!/^14789632/i.test(key)) return [];

  const out: string[] = [];
  const rest = key.replace(/^14789632/i, "").replace(/-/g, "");

  if (/nage/i.test(rest)) {
    addUnique(out, "360pp");
    addUnique(out, "360hp");
    addUnique(out, "360mp");
    addUnique(out, "360lp");
    return out;
  }

  if (/^pp(?:od|id)/i.test(rest)) {
    addUnique(out, "360pp");
    return out;
  }

  const btn = rest.match(/^(lp|mp|hp|pp|p)$/i);
  if (!btn) return out;

  const strength = btn[1].toLowerCase();
  if (strength === "p") {
    addUnique(out, "360lp");
    addUnique(out, "360mp");
    addUnique(out, "360hp");
  } else if (strength === "pp") {
    addUnique(out, "360pp");
  } else {
    addUnique(out, `360${strength}`);
  }

  return out;
}

function windcladCandidates(key: string): string[] {
  const out: string[] = [];
  const withoutUp = key.replace(/_up(?:_(?:pp|\d+))?$/i, "").replace(/_up$/i, "");

  for (const base of STOCK_BASES) {
    if (withoutUp === base || withoutUp.startsWith(`${base}_`)) {
      const wikiBase = withoutUp
        .replace(/^8j/, "j")
        .replace(/236236lk_sa2/i, "236236k")
        .replace(/236kkod/i, "236kk");
      addUnique(out, `${wikiBase}_1stock`);
    }
  }

  if (/^8jlpmp/i.test(key) && /_up/i.test(key)) {
    addUnique(out, "jpp_1stock");
    addUnique(out, "jpp_pp_1stock");
  }
  if (/^8jmphp/i.test(key) && /_up/i.test(key)) {
    addUnique(out, "jpp_1stock");
    addUnique(out, "jmp_mp");
  }
  if (/^8jpppod/i.test(key) && /_up/i.test(key)) {
    addUnique(out, "jppp_1stock");
  }
  if (/8j236236lk_sa2.*_up/i.test(key)) {
    addUnique(out, "j236236k_1stock");
  }
  if (/236236lk_sa2.*_up/i.test(key) && !key.startsWith("8j")) {
    addUnique(out, "236236k_1stock");
  }

  if (/_up/i.test(key) && out.length === 0) {
    const core = withoutUp.replace(/^8j/, "j");
    addUnique(out, `${core}_1stock`);
  }

  return out;
}

function airJumpCandidates(key: string): string[] {
  const out: string[] = [];
  if (!/^8j/i.test(key)) return out;

  const stripped = key.replace(/^8j/i, "j");
  addUnique(out, stripped);

  if (/^8j236236lk_sa2/i.test(key)) {
    addUnique(out, "j236236k");
  }

  return out;
}

export function expandLilyLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const aliases = LILY_ALIASES[key];
  if (aliases) {
    for (const alias of aliases) add(alias);
  }

  for (const candidate of parseNumpad360(key)) add(candidate);
  for (const candidate of windcladCandidates(key)) add(candidate);
  for (const candidate of airJumpCandidates(key)) add(candidate);

  if (key.startsWith("j_")) {
    add(key.replace(/^j_/, "j"));
  }

  if (/j_?236236lk/i.test(key)) {
    add("j236236k");
    add("j236236k_1stock");
    add("236236k");
    add("236236k_1stock");
  }

  return out;
}
