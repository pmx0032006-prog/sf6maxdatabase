/** ホールド / パーフェクト — 画像 hld・hd → Wiki hold・perfect */

const GROUND_FLASH_HOLD = /^(214(?:lp|mp|hp))_hld$/i;
const GROUND_FLASH_PERFECT = /^(214(?:lp|mp|hp))hd$/i;
const AIR_FLASH_HOLD = /^j214(?:lp|mp|hp)_hld$/i;
const AIR_FLASH_PERFECT = /^j214(?:lp|mp|hp)hd$/i;

export function expandHoldLookupKeys(rawKey: string): string[] {
  let key = rawKey.toLowerCase();
  const jump = key.match(/^[789](j.+)$/i);
  if (jump) {
    key = jump[1];
  }

  const out: string[] = [];

  const groundHold = key.match(GROUND_FLASH_HOLD);
  if (groundHold) {
    out.push(`${groundHold[1]}_hold`);
  }

  const groundPerfect = key.match(GROUND_FLASH_PERFECT);
  if (groundPerfect) {
    out.push(`${groundPerfect[1]}_perfect`);
  }

  const airHold = key.match(AIR_FLASH_HOLD);
  if (airHold) {
    out.push("j214p_hold");
  }

  if (/^j214(?:lp|mp|hp)_hid$/i.test(key)) {
    out.push("j214p_hold");
  }

  const airPerfect = key.match(AIR_FLASH_PERFECT);
  if (airPerfect) {
    out.push("j214p_hold");
  }

  if (/_ch$/i.test(key)) {
    const base = key.replace(/_ch$/i, "");
    if (base === "236p") {
      out.push("236lp_hold", "236mp_hold", "236hp_hold");
    } else {
      out.push(`${base}_hold`);
    }
  }

  return out;
}
