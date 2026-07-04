/** キャミィ — 236lp→236lk・スパイラル派生・Wiki Cargo キー対応 */

const CAMMY_ALIASES: Record<string, string[]> = {
  "236lp": ["236lk", "236p"],
  "236mp": ["236mk"],
  "236hp": ["236hk"],
  "236ppod": ["236pp", "236kk"],
  "236od": ["236pp", "236kk"],
  "623od": ["623kk"],
  "214od": ["214pp"],
  "236p_2k": ["236p_2k"],
  "236p_lplk": ["236p_lplk"],
  "236p_n": ["236p_no_input", "236lk"],
  "236p_k": ["236p_k", "236lk", "236mk"],
  "236ppod_2k": ["236pp_2k"],
  "236ppod_lplk": ["236pp_lplk"],
  "236ppod_n": ["236pp_no_input", "236pp", "236kk"],
  "236ppod_k": ["236pp_k", "236pp", "236kk"],
  "236ppod_p": ["236pp_p"],
  "236hp_lp": ["236hp_hold_p", "236pp_p"],
  "236lp_2lk": ["236p_2k"],
  "236lp_lp+lk": ["236p_lplk"],
  "4mphk": ["4mp_hk"],
  "5hphk": ["5hp_hk"],
  "236hk_hld": ["236hk_hold", "236hk"],
  "236hp_hld": ["236hp_hold"],
  "9j214hk": ["j214kk", "j214k"],
  "9j214kkod": ["j214kk"],
  "9j214od": ["j214kk"],
  "9j214lk": ["j214k", "j214kk"],
  "9j214mk": ["j214kk", "j214k"],
  j896lk: ["j214kk"],
  "896od": ["236pp", "236kk"],
  "9l214hk": ["j214kk", "j214k"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeCammyKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/_hld_+/g, "_hld_")
    .replace(/_hld_$/g, "_hld")
    .replace(/_+$/, "");
}

/** 画像 SA 名 → Wiki Cargo キー（236236lk → 236236k 等） */
function superCandidates(key: string): string[] {
  const out: string[] = [];

  if (/236236lk_sa\d/i.test(key)) {
    addUnique(out, "236236k");
    addUnique(out, "236236lk");
  }
  if (/236236lp_sa\d/i.test(key)) {
    addUnique(out, "236236p");
    addUnique(out, "236236lp");
  }
  if (/214214lp_sa\d/i.test(key)) {
    addUnique(out, "214214p");
    addUnique(out, "214214lp");
  }
  if (/9j214214lp_sa\d/i.test(key)) {
    addUnique(out, "j214214p");
    addUnique(out, "214214p");
  }

  return out;
}

function spiralFollowupCandidates(key: string): string[] {
  const out: string[] = [];

  if (/^236ppod/i.test(key)) {
    addUnique(out, "236pp");
    if (/2k/i.test(key)) addUnique(out, "236pp_2k");
    if (/lplk/i.test(key)) addUnique(out, "236pp_lplk");
    if (/[_-]n/i.test(key)) addUnique(out, "236pp_no_input");
    if (/[_-]k/i.test(key)) addUnique(out, "236pp_k");
    if (/[_-]p$/i.test(key)) addUnique(out, "236pp_p");
  }

  if (/^236p_/i.test(key) && !/^236pp/i.test(key)) {
    if (/2k/i.test(key)) addUnique(out, "236p_2k");
    if (/lplk/i.test(key)) addUnique(out, "236p_lplk");
    if (/[_-]n/i.test(key)) addUnique(out, "236p_no_input");
    if (/[_-]k/i.test(key)) addUnique(out, "236p_k");
    if (/[_-]p$/i.test(key)) addUnique(out, "236p_p");
  }

  return out;
}

export function expandCammyLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = normalizeCammyKey(rawKey);
  if (!key) return out;

  add(key);

  const aliases = CAMMY_ALIASES[key];
  if (aliases) {
    for (const alias of aliases) add(alias);
  }

  if (/_hld/i.test(key)) {
    const base = key.replace(/_hld.*$/i, "");
    add(base);
    add(`${base}_hold`);
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of spiralFollowupCandidates(key)) add(candidate);

  const jump = key.match(/^[789]j(.+)$/i);
  if (jump) {
    add(jump[1].toLowerCase());
  }

  return out;
}
