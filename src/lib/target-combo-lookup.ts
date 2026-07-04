/** 画像 slug（2hphp, 5mpmk …）→ Wiki TC キー候補 */

const TARGET_COMBO_ALIASES: Record<string, string[]> = {
  "2hphp": ["2hp_hp"],
  "3hphp": ["3hp_3hp"],
  "5hphp": ["5hp_hp"],
  "hphp": ["5hp_hp"],
  "lplp": ["5lp_lp"],
  "mpmp": ["5mp_mp"],
  "6hhk": ["6hk_6hk"],
  "4mkmk": ["4mk_mk"],
  "5mpmk": ["5mp_mk"],
  "5mpmkmk": ["5mp_mk_mk"],
  "5mpmkmp": ["5mp_mk_mp"],
  "63214p": ["63214lp", "63214mp", "63214hp"],
  "236lp_0": ["236p_hold"],
  "236ppod_0": ["236pp_hold"],
};

export function expandTargetComboLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => {
    const v = k.toLowerCase();
    if (v && !out.includes(v)) out.push(v);
  };

  const key = rawKey.toLowerCase();
  add(key);

  const aliases = TARGET_COMBO_ALIASES[key];
  if (aliases) {
    for (const alias of aliases) add(alias);
  }

  return out;
}
