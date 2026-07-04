/** AKI — 22pp→2pp(Sinister Slide)・214派生・2pp follow-up など */

const AKI_ALIASES: Record<string, string[]> = {
  "22pp": ["2pp"],
  "22": ["2pp"],
  "2pp_lk": ["2pp_k"],
  "2pp_lp": ["2pp_p"],
  "214lp_6lp": ["214lp_6p"],
  "214ppod_6lp": ["214pp_6p"],
  "6mp": ["3mp"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeAkiKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^22pp/i, "2pp")
    .replace(/^22_/i, "2pp_")
    .replace(/2pp_lk/gi, "2pp_k")
    .replace(/2pp_lp/gi, "2pp_p")
    .replace(/_6lp/gi, "_6p")
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

export function expandAkiLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeAkiKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = AKI_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
  }

  const jump = key.match(/^[789]j(.+)$/i);
  if (jump) {
    add(jump[1].toLowerCase());
  }

  return out;
}
