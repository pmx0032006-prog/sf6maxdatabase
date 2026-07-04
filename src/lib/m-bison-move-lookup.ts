/** M.バイソン — チャージ(2c-8/4c-6)・Shadow Rise派生・Mine・TC など */

const MBISON_ALIASES: Record<string, string[]> = {
  "214lp_bm": ["214lp_mine"],
  "214214mk": ["214214k"],
  "214214lkl": ["214214k"],
  "28lp": ["28k"],
  "28lk": ["28k"],
  "28mk": ["28k"],
  "28hk": ["28k"],
  "28k_lk": ["28k_k"],
  "28k_mk": ["28k"],
  "28k_jp": ["28k"],
  "28k_lpskr": ["28k_k_p"],
  "28kk_lk": ["28kk_k"],
  "28kk_lp": ["28kk_p"],
  "46ppod": ["46pp"],
  "4c-6ppod": ["46pp"],
  "5mp2hk": ["5mp_2hk"],
  "5mp6hp": ["5mp_6hp"],
  "jmpmp": ["jmp_jmp"],
  sa2: ["214214k"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeMBisonKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^ve_/, "")
    .replace(/2c-?8/gi, "28")
    .replace(/4c-?6/gi, "46")
    .replace(/28mk-lp/gi, "28k")
    .replace(/28k-lp-skr/gi, "28k_k_p")
    .replace(/-/g, "")
    .replace(/kkod/gi, "kk")
    .replace(/ppod/gi, "pp")
    .replace(/_bm$/i, "_mine")
    .replace(/214lp_bm/gi, "214lp_mine")
    .replace(/214214mk/gi, "214214k")
    .replace(/214214lkl/gi, "214214k")
    .replace(/28lp/gi, "28k")
    .replace(/28lk/gi, "28k")
    .replace(/28mk/gi, "28k")
    .replace(/28hk/gi, "28k")
    .replace(/28k_lk/gi, "28k_k")
    .replace(/28k_mk/gi, "28k")
    .replace(/28k_jp/gi, "28k")
    .replace(/28k_lpskr/gi, "28k_k_p")
    .replace(/28kk_lk/gi, "28kk_k")
    .replace(/28kk_lp/gi, "28kk_p")
    .replace(/5mp2hk/gi, "5mp_2hk")
    .replace(/5mp6hp/gi, "5mp_6hp")
    .replace(/jmpmp/gi, "jmp_jmp")
    .replace(/_+$/, "");
}

function superCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeMBisonKey(key);

  if (/214214.*sa2/i.test(k)) {
    addUnique(out, "214214k");
  }
  if (/214214.*sa1/i.test(k)) {
    addUnique(out, "236236p");
    addUnique(out, "236236p(ca)");
  }
  if (/236236.*sa3/i.test(k)) {
    addUnique(out, "236236k");
  }

  return out;
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

export function expandMBisonLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeMBisonKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = MBISON_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of superCandidates(normalized)) add(candidate);

  return out;
}
