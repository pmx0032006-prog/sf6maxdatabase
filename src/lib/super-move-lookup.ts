/** 画像 slug（5lp, 236236lp_sa1 …）→ Wiki スーパー技キー候補 */

const MOTION_BUTTON = /^(236236|214214|623623|63214)(lp|lk|mp|mk|hp|hk|pp|kk)$/i;

/** _sa1, _elc, _hldelc などを除去 */
export function stripSuperImageSuffix(key: string): string {
  return key
    .replace(/_hldelc.*$/i, "")
    .replace(/_elc.*$/i, "")
    .replace(/_sa\d+(\.\d+)?.*$/i, "")
    .replace(/_od.*$/i, "");
}

/** 236236lp → 236236p / 236236lk など Wiki 候補 */
function motionButtonCandidates(motionKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => {
    const v = k.toLowerCase();
    if (v && !out.includes(v)) out.push(v);
  };

  add(motionKey);

  const m = motionKey.match(MOTION_BUTTON);
  if (!m) return out;

  const motion = m[1].toLowerCase();
  const btn = m[2].toLowerCase();

  if (btn === "lp" || btn === "mp" || btn === "hp") {
    add(`${motion}p`);
  }
  if (btn === "lk" || btn === "mk" || btn === "hk") {
    add(`${motion}k`);
  }
  if (btn === "pp") {
    add(`${motion}pp`);
    add(`${motion}p`);
  }
  if (btn === "kk") {
    add(`${motion}kk`);
    add(`${motion}k`);
  }

  return out;
}

/** SA / CA 画像名 → 追加ルックアップキー */
export function expandSuperLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => {
    const v = k.toLowerCase();
    if (v && !out.includes(v)) out.push(v);
  };

  add(rawKey);

  const stripped = stripSuperImageSuffix(rawKey);
  add(stripped);

  for (const candidate of motionButtonCandidates(stripped)) {
    add(candidate);
    add(`${candidate}(ca)`);
  }

  if (/hldelc/i.test(rawKey)) {
    for (const candidate of motionButtonCandidates(stripped)) {
      add(`${candidate}_denjin`);
      if (candidate.endsWith("p")) {
        add(`${candidate}_denjin_lv2`);
        add(`${candidate}_denjin_lv3`);
      }
      if (candidate.match(/^214214p$/)) {
        add("214214p_lv2");
        add("214214p_lv3");
      }
    }
  }

  if (/sa3/i.test(rawKey)) {
    add("236236k(ca)");
    add("236236p(ca)");
    add("214214p(ca)");
    add("214214k(ca)");
  }

  return out;
}
