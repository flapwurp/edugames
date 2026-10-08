/* Seeded random numbers.
   The same game code always produces the same numbers – on every device.
   That is why two iPads show matching halves of the same puzzle without a server. */

export function hashInt(n){
  n = (n ^ 61) ^ (n >>> 16); n = (n + (n << 3)) | 0; n = n ^ (n >>> 4);
  n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15); return n >>> 0;
}

export function mulberry32(a){
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Random generator for one round of one game */
export const roundRng = (code, round) => mulberry32(hashInt(code * 1009 + round * 7919));

export function shuffle(arr, rng){
  for (let i = arr.length - 1; i > 0; i--){ const j = Math.floor(rng() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}

/* values: [{ id, w }] – w is an optional weight (default 1) */
export function pickWeighted(rng, values){
  const total = values.reduce((s, v) => s + (v.w || 1), 0);
  let r = rng() * total;
  for (const v of values){ r -= (v.w || 1); if (r < 0) return v.id; }
  return values[values.length - 1].id;
}
