/* =====================================================================
   SYNC LAYER – how the two devices tell each other things.

   Today ("manual" mode) there is no server. A message travels by voice:
   one device shows a 3-digit code, the partner types it in.
   The code is different for every game and round, so it can't be guessed,
   and it carries a small number (e.g. how many errors were made).

   Later, a "live" mode can send the same messages over a realtime service
   (e.g. Supabase). The games only call encode()/decode() through this file,
   so they don't need to change when that happens.
   ===================================================================== */
import { hashInt } from "./random.js";

export const mode = "manual";

/* value: a small whole number (0 … 8) that the code should carry */
export function encode(gameCode, round, value){
  const base = hashInt(gameCode * 31 + round * 101 + 17) % 900;
  return ((base + value * 337) % 900) + 100;
}

/* Returns the value hidden in the typed code, or null if the code is wrong. */
export function decode(gameCode, round, typed, maxValue){
  for (let v = 0; v <= maxValue; v++){ if (encode(gameCode, round, v) === typed) return v; }
  return null;
}
