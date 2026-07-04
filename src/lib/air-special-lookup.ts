/** 空中必殺 — 9j214hk → j214hk → j214k など */

const JUMP_DIRECTION = /^[789](j.+)$/i;

/** j.214LK/HK など → Wiki 共通キー j214k */
const AIR_214K_BUTTON = /^j214(?:lp|lk|mp|mk|hp|hk)$/i;

/** ルーク等 — j214lp → j214p（空中フラッシュナックル） */
const AIR_FLASH_KNUCKLE = /^j214(?:lp|mp|hp)$/i;

export function expandAirSpecialLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => {
    const v = k.toLowerCase();
    if (v && !out.includes(v)) out.push(v);
  };

  let key = rawKey.toLowerCase();

  const jump = key.match(JUMP_DIRECTION);
  if (jump) {
    key = jump[1];
    add(key);
  }

  if (AIR_214K_BUTTON.test(key)) {
    add("j214k");
  }

  if (AIR_FLASH_KNUCKLE.test(key)) {
    add("j214p");
  }

  return out;
}
