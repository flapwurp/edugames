/* Who is it? – creating and drawing the people. No screen code in here (so it can be tested). */
import { CONFIG, FEATURES, SKINS } from "./content.js";
import { roundRng, shuffle, pickWeighted } from "../shared/random.js";
import { levelOf } from "../shared/session.js";

export const FEATURE_KEYS = Object.keys(FEATURES);

/* ---------- People ---------- */
function normalise(p){
  if (p.headwear !== "none" && p.hairStyle === "bald") p.hairStyle = "short";
  return p;
}
export function randomPerson(rng){
  const p = {};
  for (const k of FEATURE_KEYS) p[k] = pickWeighted(rng, FEATURES[k].values);
  p.skin = Math.floor(rng() * SKINS.length);   // skin tone is never a deciding feature
  return normalise(p);
}
function visible(p){
  const v = {};
  for (const k of FEATURE_KEYS) v[k] = p[k];
  if (p.hairStyle === "bald" && p.facialHair === "none") v.hairColour = "-";
  return v;
}
export function differences(a, b){
  const va = visible(a), vb = visible(b);
  return FEATURE_KEYS.filter(k => va[k] !== vb[k]).length;
}
export function lookKey(p){ const v = visible(p); return FEATURE_KEYS.map(k => v[k]).join("|"); }
function mutate(base, n, rng){
  const p = { ...base };
  const keys = shuffle([...FEATURE_KEYS], rng).slice(0, n);
  for (const k of keys){
    const others = FEATURES[k].values.filter(v => v.id !== base[k]);
    p[k] = others[Math.floor(rng() * others.length)].id;
  }
  p.skin = Math.floor(rng() * SKINS.length);
  return normalise(p);
}

export function makeRound(code, round){
  const L = CONFIG.levels[levelOf(code)];
  const rng = roundRng(code, round);
  const target = randomPerson(rng);
  const people = [target];
  const seen = new Set([lookKey(target)]);
  let guard = 0;
  while (people.length < L.suspects && guard < 4000){
    guard++;
    let c;
    if (L.distractors === "similar"){
      const [lo, hi] = L.changes;
      c = mutate(target, lo + Math.floor(rng() * (hi - lo + 1)), rng);
      if (differences(c, target) < lo) continue;
    } else {
      c = randomPerson(rng);
      if (differences(c, target) < L.minDifferences) continue;
    }
    const k = lookKey(c);
    if (seen.has(k)) continue;
    seen.add(k); people.push(c);
  }
  while (people.length < L.suspects){
    const c = randomPerson(rng); const k = lookKey(c);
    if (!seen.has(k)){ seen.add(k); people.push(c); }
  }
  shuffle(people, rng);
  return { people, target: people.indexOf(target) };
}

/* ---------- Drawing ---------- */
let uid = 0;
function val(k, id){ return FEATURES[k].values.find(v => v.id === id); }
function shade(hex, amt){
  const n = parseInt(hex.slice(1), 16);
  const c = x => Math.max(0, Math.min(255, x + amt));
  const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function light(hex){
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 > 0.6;
}
export function avatarSVG(p){
  const id = "av" + (++uid);
  const skin = SKINS[p.skin], skinDark = shade(skin, -22);
  const hair = val("hairColour", p.hairColour).c;
  const top = val("topColour", p.topColour).c, topDark = shade(top, -45);
  const mark = light(top) ? "rgba(27,42,65,.45)" : "rgba(255,255,255,.75)";
  let defs = "", fill = top;
  if (p.pattern === "striped"){
    defs = `<pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="${top}"/><rect width="10" height="4" fill="${mark}"/></pattern>`;
    fill = `url(#${id})`;
  } else if (p.pattern === "spotted"){
    defs = `<pattern id="${id}" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="${top}"/><circle cx="3" cy="3" r="2.3" fill="${mark}"/><circle cx="9" cy="9" r="2.3" fill="${mark}"/></pattern>`;
    fill = `url(#${id})`;
  }
  const s = [`<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs}</defs>`];

  // hair behind the head
  if (p.hairStyle === "long") s.push(`<path d="M33 54 Q31 26 60 26 Q89 26 87 54 L91 106 Q60 114 29 106 Z" fill="${hair}"/>`);
  if (p.hairStyle === "curly"){
    for (let a = 150; a <= 390; a += 20){
      const r = a * Math.PI / 180;
      s.push(`<circle cx="${(60 + 25 * Math.cos(r)).toFixed(1)}" cy="${(54 + 25 * Math.sin(r)).toFixed(1)}" r="9" fill="${hair}"/>`);
    }
  }
  // neck + body
  s.push(`<rect x="51" y="72" width="18" height="26" rx="5" fill="${skinDark}"/>`);
  s.push(`<path d="M12 130 C14 104 34 94 60 94 C86 94 106 104 108 130 Z" fill="${fill}"/>`);
  if (p.top === "tshirt"){
    s.push(`<path d="M48 94.6 Q60 108 72 94.6 Z" fill="${skinDark}"/><path d="M48 94.6 Q60 108 72 94.6" fill="none" stroke="${topDark}" stroke-width="2.5"/>`);
    s.push(`<path d="M31 110 L34 130 M89 110 L86 130" stroke="${topDark}" stroke-opacity=".35" stroke-width="2"/>`);
  } else if (p.top === "hoodie"){
    s.push(`<path d="M33 105 Q37 89 60 89 Q83 89 87 105 Q74 98 60 107 Q46 98 33 105 Z" fill="${topDark}"/>`);
    s.push(`<path d="M54 106 L53 121 M66 106 L67 121" stroke="#f4f4f4" stroke-width="2.4" stroke-linecap="round"/>`);
    s.push(`<path d="M41 130 L46 119 L74 119 L79 130 Z" fill="${topDark}" fill-opacity=".4"/>`);
  } else if (p.top === "shirt"){
    s.push(`<path d="M48 93 L60 104 L44 107 Z M72 93 L60 104 L76 107 Z" fill="#ffffff" stroke="${topDark}" stroke-width="1.5" stroke-linejoin="round"/>`);
    s.push(`<path d="M56.5 103 L63.5 103 L62 108 L66 125 L60 130 L54 125 L58 108 Z" fill="#26324a"/>`);
  }
  // head
  s.push(`<circle cx="37" cy="58" r="5.5" fill="${skin}"/><circle cx="83" cy="58" r="5.5" fill="${skin}"/>`);
  s.push(`<circle cx="60" cy="56" r="23" fill="${skin}"/>`);
  s.push(`<circle cx="46" cy="65" r="4" fill="#e8737a" fill-opacity=".22"/><circle cx="74" cy="65" r="4" fill="#e8737a" fill-opacity=".22"/>`);
  // front hair
  if (p.hairStyle === "short" || p.hairStyle === "long"){
    s.push(`<path d="M36 58 Q33 27 60 28 Q87 27 84 58 Q79 40 60 40 Q41 40 36 58 Z" fill="${hair}"/>`);
  } else if (p.hairStyle === "curly"){
    for (let a = 205; a <= 335; a += 26){
      const r = a * Math.PI / 180;
      s.push(`<circle cx="${(60 + 20 * Math.cos(r)).toFixed(1)}" cy="${(54 + 20 * Math.sin(r)).toFixed(1)}" r="7.5" fill="${hair}"/>`);
    }
  }
  // face
  const brow = p.hairStyle === "bald" ? "#4a3b33" : shade(hair, -50);
  s.push(`<path d="M46 51 Q51 47.5 56 51 M64 51 Q69 47.5 74 51" stroke="${brow}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);
  s.push(`<circle cx="51" cy="57.5" r="2.7" fill="#1e1e24"/><circle cx="69" cy="57.5" r="2.7" fill="#1e1e24"/>`);
  s.push(`<path d="M60 59.5 Q63 64 59.5 65.5" stroke="${shade(skin, -50)}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`);
  if (p.facialHair === "beard") s.push(`<path d="M37 58 Q37 86 60 87 Q83 86 83 58 Q80 73 70 74 Q60 71 50 74 Q40 73 37 58 Z" fill="${hair}"/>`);
  if (p.facialHair === "moustache") s.push(`<path d="M50 67 Q55 62.5 60 65.5 Q65 62.5 70 67 Q65 70 60 68 Q55 70 50 67 Z" fill="${hair}"/>`);
  s.push(`<path d="M54 71 Q60 75 66 71" stroke="#9b3c4a" stroke-width="2" fill="none" stroke-linecap="round"/>`);
  // glasses
  if (p.glasses !== "none"){
    const lens = p.glasses === "sunglasses" ? "#1d1f27" : "rgba(255,255,255,.25)";
    s.push(`<g fill="${lens}" stroke="#1d1f27" stroke-width="2"><circle cx="51" cy="57.5" r="7"/><circle cx="69" cy="57.5" r="7"/></g>`);
    s.push(`<path d="M58 57.5 L62 57.5 M44 56.5 L38 55 M76 56.5 L82 55" stroke="#1d1f27" stroke-width="2" fill="none"/>`);
  }
  // headwear
  if (p.headwear === "cap"){
    s.push(`<path d="M36 45 Q36 21 60 21 Q84 21 84 45 Z" fill="#2c4a86"/>`);
    s.push(`<path d="M33 44 Q60 38 87 44 Q89 49 60 48 Q31 49 33 44 Z" fill="#1d3463"/><circle cx="60" cy="22" r="2.4" fill="#1d3463"/>`);
  } else if (p.headwear === "woolly hat"){
    s.push(`<path d="M35 46 Q35 17 60 17 Q85 17 85 46 Z" fill="#b23a48"/>`);
    s.push(`<rect x="33" y="37" width="54" height="10" rx="5" fill="#8e2c39"/><circle cx="60" cy="15" r="6.5" fill="#d9606d"/>`);
  }
  s.push(`</svg>`);
  return s.join("");
}
