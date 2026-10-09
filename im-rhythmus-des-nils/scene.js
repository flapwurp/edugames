/* Im Rhythmus des Nils – Querschnitt durch das Niltal.
   scene(state) baut aus einem Zustand ein vollständiges SVG. Keine Spiellogik, nur Darstellung. */
import * as A from "./assets.js";
const { C } = A;

export const W = 1150, H = 560;
export const VIEW = { y: 118, h: 402 };   // sichtbarer Ausschnitt

/* Gelände: Oberkante von links (Nil) nach rechts (Wüste) */
export const GROUND = {
  bed: 515,
  f1: { x0: 184, x1: 392, y: 372 },   // Feld am Ufer (mit Graben am Ende)
  f2: { x0: 398, x1: 598, y: 334 },   // mittleres Feld
  f3: { x0: 606, x1: 800, y: 296 },   // oberes Feld
  site: { x0: 822, x1: 1110, y: 266 }, // Hof bzw. Dorf
  ditch: { x0: 362, x1: 390, y: 394, water: 364 }
};

/* Wasserstände (y) */
export const LEVEL = { tief: 456, normal: 432, niedrig: 360, gut: 284, hoch: 240 };

const G = GROUND;
const SURF = [
  [0, 512], [100, 518], [140, 470], [166, 400], [184, 372],
  [G.ditch.x0, 372], [G.ditch.x0 + 5, G.ditch.y], [G.ditch.x1 - 4, G.ditch.y], [G.ditch.x1, 372],
  [392, 372], [398, 334], [598, 334], [606, 296], [800, 296], [822, 266], [1110, 266], [1140, 232], [1150, 230]
];

/* Höhe der Oberfläche an Stelle x */
export function groundY(x){
  for (let i = 1; i < SURF.length; i++){
    const [x0, y0] = SURF[i - 1], [x1, y1] = SURF[i];
    if (x <= x1) return x1 === x0 ? y1 : y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return SURF[SURF.length - 1][1];
}

/* Bis wohin reicht Wasser mit Spiegel y (von links gesehen)? dike: Deich als Barriere */
export function waterReach(level, dike = null){
  for (let i = 1; i < SURF.length; i++){
    const [x0, y0] = SURF[i - 1], [x1, y1] = SURF[i];
    if (y1 < level && y0 >= level) return x0 + ((level - y0) / (y1 - y0)) * (x1 - x0);
    if (dike && x1 >= dike.x0 && level > dike.top) return dike.x0 + 10;
  }
  return W;
}

const pts = a => a.map(p => `${p[0]} ${p[1]}`).join(" L ");
const terrainPath = `M${pts(SURF)} L ${W} ${H} L 0 ${H} Z`;
const airPath = `M0 0 L ${pts(SURF)} L ${W} 0 Z`;
const kemetTop = SURF.filter(p => p[0] >= 166 && p[0] <= 822);
const kemetPath = `M${pts(kemetTop)} L ${pts(kemetTop.slice().reverse().map(([x, y]) => [x, y + (x > 800 ? 4 : 20)]))} Z`;

function background(sky){
  const grad = sky === "dawn" ? "skyDawn" : sky === "peret" ? "skyDay" : "skyHot";
  let s = `<rect width="${W}" height="${H}" fill="url(#${grad})"/>`;
  if (sky === "dawn") s += A.stars(W, 270, 5).replace(/cy="(\d+)/g, (m, y) => `cy="${+y + 140}`) + A.sirius(700, 172);
  else s += A.sun(sky === "peret" ? 980 : 300, 200);
  const far = sky === "dawn" ? "#5b4a5a" : "#e9d2a6", far2 = sky === "dawn" ? "#4a3c4c" : "#dfc08e";
  s += `<path d="M0 330 Q 140 312 280 320 T 600 300 Q 760 286 860 282 L 940 250 L 1010 248 L 1060 232 L 1150 226 L 1150 ${H} L 0 ${H} Z" fill="${far}"/>`;
  s += `<path d="M820 290 L 900 262 L 980 260 L 1040 244 L 1150 238 L 1150 ${H} L 820 ${H} Z" fill="${far2}"/>`;
  const pc = sky === "dawn" ? "#3a3044" : "#c3b98e";
  [[24, 326], [50, 323], [250, 318], [276, 320]].forEach(([x, y]) => {
    s += `<path d="M${x} ${y} l 2 -24" stroke="${pc}" stroke-width="2.5"/><path d="M${x + 2} ${y - 24} q -10 -2 -14 6 M ${x + 2} ${y - 24} q 10 -3 14 5 M ${x + 2} ${y - 24} q -4 -8 -12 -8 M ${x + 2} ${y - 24} q 6 -8 13 -6" fill="none" stroke="${pc}" stroke-width="2.4"/>`;
  });
  return s;
}

function ground(){
  let s = `<clipPath id="clipGround"><path d="${terrainPath}"/></clipPath>`;
  s += `<path d="${terrainPath}" fill="${C.soil}"/>`;
  s += `<g clip-path="url(#clipGround)">`;
  s += `<path d="M810 0 L ${W} 0 L ${W} ${H} L 810 ${H} Z" fill="${C.sandDark}"/>`;
  s += `<path d="M0 452 Q 300 470 600 452 T 1150 440 L 1150 ${H} L 0 ${H} Z" fill="${C.rock}"/>`;
  s += `<path d="M${kemetPath.slice(1)}" fill="${C.kemet}"/>`;
  const r = A.rand(11);
  for (let i = 0; i < 40; i++){
    const x = r() * W, y = 460 + r() * 90;
    s += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(2 + r() * 4).toFixed(1)}" ry="${(1.5 + r() * 2).toFixed(1)}" fill="${A.shade(C.rock, -0.22)}" opacity=".7"/>`;
  }
  s += `<path d="M0 508 L 100 514 L 140 466 L 166 400 L 174 402 L 150 472 L 108 524 L 0 520 Z" fill="${C.mudWet}" opacity=".85"/>`;
  s += `</g>`;
  s += `<path d="M${pts(SURF)}" fill="none" stroke="${C.ink}" stroke-width="2.4" stroke-linejoin="round"/>`;
  return s;
}

function waterBack(level, kind, reach){
  const col = kind === "flut" ? C.flood : C.water, deep = kind === "flut" ? C.floodDeep : C.waterDeep;
  return `<defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}"/><stop offset="1" stop-color="${deep}"/></linearGradient></defs>
    <rect x="0" y="${level}" width="${reach.toFixed(1)}" height="${H - level}" fill="url(#wg)"/>`;
}

function waterFront(level, kind, reach){
  const hi = kind === "flut" ? C.floodHi : C.waterHi;
  const col = kind === "flut" ? C.flood : C.water;
  let wave = `M0 ${level}`;
  for (let x = 0; x < reach; x += 40) wave += ` q 10 -4 20 0 t 20 0`;
  let s = `<clipPath id="clipAir"><path d="${airPath}"/></clipPath>`;
  s += `<g clip-path="url(#clipAir)"><rect x="0" y="${level}" width="${reach.toFixed(1)}" height="${H - level}" fill="${col}" opacity=".62"/></g>`;
  s += `<clipPath id="clipReach"><rect x="0" y="0" width="${reach.toFixed(1)}" height="${H}"/></clipPath>`;
  s += `<g clip-path="url(#clipReach)"><path d="${wave}" fill="none" stroke="${hi}" stroke-width="3" stroke-linecap="round"/>`;
  if (kind === "flut"){
    const r = A.rand(level);
    for (let i = 0; i < 26; i++){
      const x = r() * reach, y = level + 10 + r() * 60;
      if (y < groundY(x)) s += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q 6 -2 12 0" stroke="${C.floodHi}" stroke-width="1.6" fill="none" opacity=".7"/>`;
    }
  }
  return s + `</g>`;
}

/* Zeichnungen in Szenengröße: um den Fußpunkt (x, y) vergrößern */
export const K = 1.32;
export const big = (svg, x, y, k = K) => `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${svg}</g>`;

function field(i, st, seed, level){
  const F = [G.f1, G.f2, G.f3][i];
  const x0 = F.x0 + 6, x1 = (i === 0 ? G.ditch.x0 : F.x1) - 4;
  if (!st) return "";
  if (F.y > level) st = { ...st, soil: "schlamm", plants: st.plants && st.plants !== "saat" ? st.plants : null };
  let s = "";
  if (st.plants && st.plants !== "saat") s += A.fieldPlants(st.plants, x0, x1, F.y - 1, seed, 1.3);
  s += A.fieldSoil(st.soil || "trocken", x0, x1, F.y, seed + 4);
  if (st.plants === "saat") s += A.fieldSoil("gesaet", x0, x1, F.y, seed + 4);
  if (st.boundary !== false){
    const x = F.x0 + 3, y = groundY(x + 2);
    s += `<path d="M${x - 5} ${y} L ${x - 4} ${y - 12} L ${x + 4} ${y - 12} L ${x + 5} ${y} Z" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.4"/>`;
  }
  return s;
}

function label(x, y, text, dx = 0, dy = -34){
  const w = text.length * 8.6 + 18;
  const lx = x + dx - w / 2, ly = y + dy;
  return `<g class="tag"><path d="M${x} ${y - 4} L ${x + dx} ${ly + 26}" stroke="${C.ink}" stroke-width="1.6"/>
    <rect x="${lx.toFixed(0)}" y="${ly}" width="${w.toFixed(0)}" height="26" rx="13" fill="#fffaf0" stroke="${C.ink}" stroke-width="1.6"/>
    <text x="${(x + dx).toFixed(0)}" y="${ly + 18}" text-anchor="middle" class="tag-text">${text}</text></g>`;
}

const DIKE = { x0: 792, x1: 836, top: 226 };
const SHADUF_X = 473;

/* Zustand (alles optional):
   sky: "achet" | "peret" | "schemu" | "dawn"
   water: { level, kind: "nil" | "flut" } · ditchWater: Restwasser im Graben
   fields: [{ soil, plants, boundary }, …] für Ufer, Mitte, oben
   hof: { fill, wall, ruined } · hut / hutRuined: Feldhütte am oberen Feld
   village: { stage: 0..1 (Bau), fill, dike }
   shaduf: { t, n } · plow: { field, x, n }
   people: [{ x, pose, n, flip, kind }] · extra: zusätzliches SVG (schon in Szenengröße)
   ghost: y – so hoch stünde das Wasser ohne Deich · labels: [...] · oldMark · nmLabels */
export function scene(st = {}){
  const sky = st.sky || "peret";
  const dike = st.village && st.village.dike ? DIKE : null;
  const lvl = st.water ? st.water.level : LEVEL.normal;
  const kind = st.water ? st.water.kind || "nil" : "nil";
  const reach = waterReach(lvl, dike && (st.village.stage ?? 1) >= 1 ? dike : null);
  const labels = new Set(st.labels || []);
  const site = G.site.y;
  let s = `<svg class="scene" viewBox="0 ${VIEW.y} ${W} ${VIEW.h}" role="img" aria-label="${st.alt || "Querschnitt durch das Niltal"}" xmlns="http://www.w3.org/2000/svg">`;
  s += `<defs>${A.skyDefs()}</defs>`;
  s += background(sky);
  s += waterBack(lvl, kind, reach);
  s += ground();
  if (st.ditchWater) s += `<path d="M${G.ditch.x0 + 3} ${G.ditch.water} L ${G.ditch.x1 - 2} ${G.ditch.water} L ${G.ditch.x1 - 4} ${G.ditch.y} L ${G.ditch.x0 + 5} ${G.ditch.y} Z" fill="${C.water}"/><path d="M${G.ditch.x0 + 4} ${G.ditch.water} L ${G.ditch.x1 - 3} ${G.ditch.water}" stroke="${C.waterHi}" stroke-width="2"/>`;

  // Ufer: Papyrus, Nilmesser
  s += big(A.papyrus({ x: 150, y: 452, h: 62, n: 5, seed: 3 }), 150, 452, 1.1) + big(A.papyrus({ x: 124, y: 500, h: 54, n: 4, seed: 8 }), 124, 500, 1.1);
  s += A.nilometer({ x: 64, yBottom: 516, yTop: 196, marks: { niedrig: 326, gut: 286, hoch: 254 }, old: st.oldMark ? 222 : null });

  // Hof bzw. Dorf
  s += big(A.palm({ x: 1130, y: groundY(1130), h: 100, lean: -6 }), 1130, groundY(1130), 1.05);
  if (st.hof){
    if (st.hof.wall) s += big(A.earthWall({ x: 826, y: site, w: 30, h: 15 }), 826, site);
    s += big(A.house({ x: 856, y: site, w: 80, h: 48, ruined: !!st.hof.ruined }), 856, site);
    s += big(A.granary({ x: 1000, y: site, w: 46, h: 60, fill: st.hof.fill ?? 0.3 }), 1000, site);
    s += big(A.palm({ x: 1066, y: site, h: 92, lean: 8 }), 1066, site, 1.12);
  }
  if (st.hut || st.hutRuined) s += big(A.fieldHut({ x: 752, y: G.f3.y, ruined: !!st.hutRuined }), 752, G.f3.y);
  if (st.village){
    const v = st.village, k = v.stage ?? 1;
    if (k >= 1){
      s += big(A.house({ x: 842, y: site, w: 56, h: 42, door: "left", seed: 5 }), 842, site);
      s += big(A.house({ x: 908, y: site, w: 62, h: 46, seed: 6 }), 908, site);
      s += big(A.storeYard({ x: 994, y: site, fill: v.fill ?? 0.6 }), 994, site, 0.92);
    } else {
      s += big(A.house({ x: 842, y: site, w: 56, h: Math.max(10, 42 * k), door: "left", roof: false, seed: 5 }), 842, site);
      s += big(A.house({ x: 908, y: site, w: 62, h: 46, seed: 6 }), 908, site);
      if (k > 0.3) s += big(A.granary({ x: 1050, y: site, w: 44, h: 60 * k, fill: 0, ladder: false }), 1050, site);
    }
    if (dike){
      const top = k >= 1 ? dike.top : G.f3.y - (G.f3.y - dike.top) * k;
      s += A.dike({ x0: dike.x0 - 26, x1: dike.x1 + 12, y: G.f3.y + 2, top });
    }
  }
  // Felder
  (st.fields || []).forEach((fs, i) => { s += field(i, fs, 10 + i * 7, lvl); });
  if (st.plow){
    const F = [G.f1, G.f2, G.f3][st.plow.field ?? 1];
    s += big(A.plowTeam({ x: st.plow.x ?? F.x0 + 130, y: F.y, scale: 1, n: st.plow.n ?? 0 }), st.plow.x ?? F.x0 + 130, F.y, 0.92);
  }
  if (st.shaduf) s += big(A.shaduf({ x: SHADUF_X, y: G.f2.y, t: st.shaduf.t ?? 0, n: st.shaduf.n ?? 1, rope: 110 }), SHADUF_X, G.f2.y, 1.18);
  for (const p of st.people || []) s += A.person({ x: p.x, y: groundY(p.x), pose: p.pose, n: p.n ?? 0, flip: p.flip, kind: p.kind, scale: p.scale ?? K });
  if (st.extra) s += st.extra;
  s += waterFront(lvl, kind, reach);
  if (st.nmLabels){
    const t = (y, txt, col) => `<text x="84" y="${y + 5}" class="nm-label" fill="${col}">${txt}</text>`;
    s += t(326, "zu wenig", "#a3461f") + t(286, "gut", "#2f6b1f") + t(254, "zu viel", "#a3461f");
  }
  if (st.ghost){
    s += `<path d="M${DIKE.x1} ${st.ghost} L ${G.site.x1 + 30} ${st.ghost}" stroke="#1f5f86" stroke-width="3.4" stroke-dasharray="12 7"/>`;
    s += `<g class="tag"><rect x="${G.site.x1 - 212}" y="${st.ghost - 98}" width="236" height="48" rx="12" fill="#fffaf0" stroke="#1f5f86" stroke-width="2"/>
      <text x="${G.site.x1 - 94}" y="${st.ghost - 78}" text-anchor="middle" class="ghost-text">ohne Deich stünde das</text>
      <text x="${G.site.x1 - 94}" y="${st.ghost - 58}" text-anchor="middle" class="ghost-text">Wasser bis zur Linie</text>
      <path d="M${G.site.x1 - 94} ${st.ghost - 50} L ${G.site.x1 - 94} ${st.ghost - 4}" stroke="#1f5f86" stroke-width="2"/></g>`;
  }
  if (labels.has("nilmesser")) s += label(64, 196, "Nilmesser", 50, -34);
  if (labels.has("schaduf")) s += label(SHADUF_X, G.f2.y - 150, "Schaduf", 70, -24);
  if (labels.has("deich")) s += label(814, DIKE.top, "Deich", -50, -36);
  if (labels.has("speicher")) s += label(1000, site - 82, "Kornspeicher", 30, -30);
  if (labels.has("dorfspeicher")) s += label(1060, site - 74, "Dorfspeicher", 20, -34);
  if (labels.has("hof")) s += label(910, site - 70, "euer Hof", -40, -40);
  if (labels.has("felder")) s += label(278, G.f1.y, "Feld am Ufer", 0, -66) + label(498, G.f2.y, "mittleres Feld", 0, -66) + label(703, G.f3.y, "oberes Feld", 0, -66);
  if (labels.has("graben")) s += label(376, G.ditch.y - 24, "Graben", -60, -56);
  s += `</svg>`;
  return s;
}
