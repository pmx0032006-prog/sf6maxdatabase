/** ダルシム — 236p/k 強度表記・手足伸ばし(ppp/kkk)・空中63214 など */

const DHALSIM_ALIASES: Record<string, string[]> = {
  "236lp": ["236p"],
  "236mp": ["236p"],
  "236hp": ["236p"],
  "236lk": ["236k"],
  "236mk": ["236k"],
  "236hk": ["236k"],
  "4ppp": ["4pppkkk"],
  "4kkk": ["4pppkkk"],
  "5ppp": ["5pppkkk"],
  "6ppp": ["6pppkkk", "6ppp_6kkk_4ppp_4kkk"],
  "6kkk": ["6pppkkk", "6ppp_6kkk_4ppp_4kkk"],
  j4ppp: ["4pppkkk"],
  j4kkk: ["4pppkkk"],
  j6ppp: ["j6ppp_6kkk_4ppp_4kkk", "6pppkkk"],
  j6kkk: ["j6ppp_6kkk_4ppp_4kkk", "6pppkkk"],
  j63214lp: ["j63214p"],
  j63214mp: ["j63214p"],
  "2lkmk": ["2lplk", "lplk"],
  "2mkhk": ["hphk", "6hphk"],
  j2hp: ["jhp"],
  sa1: ["236236lp", "236236mp", "236236hp"],
  sa2: ["214214k", "214214k_hold", "214214k_partial_hold"],
  sa3: ["236236k", "236236k(ca)"],
  l2kk: ["2kk"],
  l63214lp: ["63214lp"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeDhalsimKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^8j/, "j")
    .replace(/-/g, "")
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

function superCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeDhalsimKey(key);

  if (/236236_sa\d/i.test(k) || /236236lp_sa\d/i.test(k)) {
    addUnique(out, "236236lp");
    addUnique(out, "236236mp");
    addUnique(out, "236236hp");
  }
  if (/236236lk_sa\d/i.test(k)) {
    addUnique(out, "236236k");
    addUnique(out, "236236k(ca)");
  }
  if (/214214lk_sa\d/i.test(k)) {
    addUnique(out, "214214k");
    addUnique(out, "214214k_hold");
    addUnique(out, "214214k_partial_hold");
  }

  return out;
}

export function expandDhalsimLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeDhalsimKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = DHALSIM_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of superCandidates(normalized)) add(candidate);

  const jump = key.match(/^[789]j(.+)$/i);
  if (jump) {
    add(jump[1].toLowerCase());
    const inner = normalizeDhalsimKey(jump[1]);
    if (inner !== jump[1].toLowerCase()) add(inner);
    const innerAliases = DHALSIM_ALIASES[inner];
    if (innerAliases) {
      for (const alias of innerAliases) add(alias);
    }
  }

  return out;
}
