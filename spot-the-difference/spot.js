/* =====================================================================
   SPOT THE DIFFERENCE – game logic (no DOM, testable in Node)
   makeRound(code, round) builds both pictures from the game code, so both
   iPads have the same two pictures without a server. Player 1 sees picture A,
   Player 2 sees picture B.
   ===================================================================== */
import { roundRng, shuffle, pickWeighted } from "../shared/random.js";
import { levelOf } from "../shared/session.js";
import { CONFIG, COLOURS, NUMBERS, PARTY, PARK } from "./content.js";
import * as party from "./party.js";
import * as park from "./park.js";

export const SCENES = { party: { art: party, words: PARTY }, park: { art: park, words: PARK } };

const REQUIRED = ["place", "number", "activity"];
const WEIGHTS = { missing: 3, colour: 3, place: 2, number: 1.5, activity: 1.5, hat: 1, hatColour: 0.7, weather: 0.7 };
export const MIN_COLOUR_CONTRAST = 0.25;
export const MAX_PER_TYPE = 2;
const HIT_PAD = 14, HIT_MIN = 96;

/* Relative luminance (0 = black, 1 = white) – used to keep colour differences visible for everyone */
export function luminance(id){
  const h = COLOURS[id].c.replace("#", "");
  const [r, g, b] = [0, 2, 4].map(i => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrasting = (a, list) => list.filter(c => c !== a && Math.abs(luminance(c) - luminance(a)) >= MIN_COLOUR_CONTRAST);

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const between = (rng, [lo, hi]) => lo + Math.floor(rng() * (hi - lo + 1));
const clone = o => JSON.parse(JSON.stringify(o));

export const sceneFor = round => CONFIG.scenes[(round - 1) % CONFIG.scenes.length];

/* ---------- building the base picture ---------- */
function baseState(def, rng){
  switch (def.kind){
    case "weather": return { weather: rng() < 0.6 ? def.weathers[0] : def.weathers[1] };
    case "person": return { activity: null, colour: pick(rng, def.colours), hat: rng() < 0.6 ? pick(rng, def.hats) : null };
    default: {
      const s = {};
      if (def.colours) s.colour = pick(rng, def.colours);
      if (def.count) s.count = between(rng, def.count);
      return s;
    }
  }
}

function makeBase(art, rng, L){
  const extras = art.OBJECTS.filter(d => d.extra);
  let chosen;
  do { chosen = shuffle(extras.slice(), rng).slice(0, L.extras); }
  while (chosen.filter(d => d.kind === "movable").length < Math.min(2, L.extras));
  const ids = new Set(chosen.map(d => d.id));
  const pic = {};
  for (const def of art.OBJECTS){
    pic[def.id] = (!def.extra || ids.has(def.id)) ? baseState(def, rng) : null;
  }
  // two people, two different activities
  const acts = shuffle(art.ACTIVITIES.slice(), rng);
  art.OBJECTS.filter(d => d.kind === "person").forEach((d, i) => { pic[d.id].activity = acts[i]; });
  // movable things: one per slot
  const free = shuffle(Object.keys(art.SLOTS), rng);
  for (const def of art.OBJECTS.filter(d => d.kind === "movable" && pic[d.id])){
    const i = free.findIndex(sl => art.SLOTS[sl].allow.includes(def.id));
    pic[def.id].slot = free.splice(i, 1)[0];
  }
  return pic;
}

/* ---------- differences ---------- */
/* Tries to make one difference of this type on this thing. Returns true if it worked. */
function tryDiff(type, def, A, B, rng, art){
  const base = A[def.id];
  const side = rng() < 0.5 ? A : B;            // the picture that gets changed
  const other = side === A ? B : A;
  switch (type){
    case "missing":
      if (!def.extra || !base) return false;
      side[def.id] = null; return true;
    case "place": {
      if (def.kind !== "movable" || !base) return false;
      const used = new Set();
      for (const p of [A, B]) for (const d of art.OBJECTS) if (d.kind === "movable" && p[d.id]) used.add(p[d.id].slot);
      const options = Object.keys(art.SLOTS).filter(sl => !used.has(sl) && art.SLOTS[sl].allow.includes(def.id));
      if (!options.length) return false;
      side[def.id].slot = pick(rng, options); return true;
    }
    case "colour": {
      if (!def.colours || !base) return false;
      const options = contrasting(base.colour, def.colours);
      if (!options.length) return false;
      side[def.id].colour = pick(rng, options); return true;
    }
    case "number": {
      if (!def.count || !base) return false;
      const [lo, hi] = def.count, n = base.count;
      const options = [n - 2, n - 1, n + 1, n + 2].filter(v => v >= lo && v <= hi);
      side[def.id].count = pick(rng, options); return true;
    }
    case "activity": {
      if (def.kind !== "person") return false;
      const taken = art.OBJECTS.filter(d => d.kind === "person").flatMap(d => [A[d.id].activity, B[d.id].activity]);
      const options = art.ACTIVITIES.filter(a => !taken.includes(a));
      if (!options.length) return false;
      side[def.id].activity = pick(rng, options); return true;
    }
    case "hat":
      if (def.kind !== "person") return false;
      if (base.hat){ side[def.id].hat = null; }
      else { side[def.id].hat = pick(rng, def.hats); other[def.id].hat = null; }
      return true;
    case "hatColour": {
      if (def.kind !== "person" || !base.hat) return false;
      const options = contrasting(base.hat, def.hats);
      if (!options.length) return false;
      side[def.id].hat = pick(rng, options); return true;
    }
    case "weather":
      if (def.kind !== "weather") return false;
      side[def.id].weather = def.weathers.find(w => w !== base.weather); return true;
  }
  return false;
}

/* A tap counts for a difference if it is inside one of its boxes (in either picture). */
function hitBoxes(art, id, a, b){
  const out = [];
  for (const st of [a, b]){
    const bx = art.boxOf(id, st);
    if (!bx) continue;
    const w = Math.max(HIT_MIN, bx.w + 2 * HIT_PAD), h = Math.max(HIT_MIN, bx.h + 2 * HIT_PAD);
    const box = { x: bx.x + bx.w / 2 - w / 2, y: bx.y + bx.h / 2 - h / 2, w, h };
    if (!out.some(o => o.x === box.x && o.y === box.y && o.w === box.w && o.h === box.h)) out.push(box);
  }
  return out;
}

export function makeRound(code, round){
  const L = CONFIG.levels[levelOf(code)];
  const scene = sceneFor(round);
  const { art } = SCENES[scene];
  const rng = roundRng(code, round);
  const base = makeBase(art, rng, L);
  const A = clone(base), B = clone(base);
  const used = new Set(), diffs = [];

  const attempt = type => {
    const defs = shuffle(art.OBJECTS.filter(d => !used.has(d.id) && d.diffs.includes(type)), rng);
    for (const def of defs){
      if (tryDiff(type, def, A, B, rng, art)){ used.add(def.id); diffs.push({ id: def.id, type }); return true; }
    }
    return false;
  };
  for (const t of REQUIRED) attempt(t);
  let pool = Object.keys(WEIGHTS);
  while (diffs.length < L.differences && pool.length){
    const t = pickWeighted(rng, pool.map(id => ({ id, w: WEIGHTS[id] })));
    const ok = attempt(t);
    // at most MAX_PER_TYPE differences of one kind, so every round mixes them
    if (!ok || diffs.filter(d => d.type === t).length >= MAX_PER_TYPE) pool = pool.filter(p => p !== t);
  }
  shuffle(diffs, rng);
  for (const d of diffs) d.boxes = hitBoxes(art, d.id, A[d.id], B[d.id]);
  return { code, round, scene, a: A, b: B, diffs };
}

export const pictureFor = (r, player) => (player === 1 ? r.a : r.b);

/* Which difference does a tap at (x, y) find?
   → index of the difference, "found" if it was found before, or null (no difference here) */
export function hitTest(r, x, y, found){
  let best = null, bestArea = Infinity, again = false;
  r.diffs.forEach((d, i) => {
    for (const b of d.boxes){
      if (x < b.x || x > b.x + b.w || y < b.y || y > b.y + b.h) continue;
      if (found.has(i)){ again = true; continue; }
      const area = b.w * b.h;
      if (area < bestArea){ best = i; bestArea = area; }
    }
  });
  if (best !== null) return best;
  return again ? "found" : null;
}

/* ---------- sentences ---------- */
const num = (n, one, many) => (n === 1 ? `is one ${one}` : `are ${NUMBERS[n] || n} ${many}`);

/* What a player would say about this difference, looking at their own picture. */
export function sentence(r, diff, player){
  const { words: W, art } = SCENES[r.scene];
  const st = pictureFor(r, player)[diff.id], T = W.things[diff.id] || {};
  const def = art.OBJECTS.find(d => d.id === diff.id);
  const where = st && st.slot ? W.places[st.slot] : T.where;
  const say = s => `In my picture ${s}.`;
  switch (diff.type){
    case "missing":
      return st ? say(`there is ${T.a}${where ? " " + where : ""}`) : say(`there isn't ${T.a}`);
    case "place":
      return say(`${T.the} is ${where}`);
    case "colour": {
      const c = COLOURS[st.colour].word;
      if (T.plural) return say(`${T.the} are ${c}`);
      if (T.clothes) return say(`${T.the}'s ${T.clothes} is ${c}`);
      return say(`${T.the} is ${c}`);
    }
    case "number": {
      const N = def.countWord ? W.things[def.countWord] : T;
      return say(`there ${num(st.count, N.one, N.many)} ${N.where}`);
    }
    case "activity":
      return say(`${T.the} ${W.activities[st.activity]}`);
    case "hat":
      return st.hat ? say(`${T.the} is wearing ${W.things.hat.a}`) : say(`${T.the} isn't wearing ${W.things.hat.a}`);
    case "hatColour":
      return say(`${T.the}'s ${W.things.hat.the} is ${COLOURS[st.hat].word}`);
    case "weather":
      return say(W.weather[st.weather]);
  }
  return "";
}
