/* Im Rhythmus des Nils – Zeichnungen (SVG).
   Jede Funktion liefert ein Stück SVG-Text. Koordinaten: x nach rechts, y nach unten.
   Stil: flächige Farben, dunkelbraune Kontur, Figuren im Profil (angelehnt an ägyptische Malerei). */

export const C = {
  ink: "#3b2718", inkSoft: "#6b4c33",
  skin: ["#a3653a", "#8a5130", "#b5784a", "#74462a", "#9c5d36", "#c08857"],
  hair: "#1c1410",
  linen: "#f4ecd9", linenShade: "#dccdab",
  sash: ["#b8432a", "#2c6c98", "#5c8a2a", "#86509a", "#c78a1e", "#2f8a7d"],
  sky: "#cfe4e6", skyLow: "#f3e7c9",
  sand: "#e8cd98", sandDark: "#d7b47a", desert: "#d9a46a", cliff: "#e2bf8f", cliffShade: "#cfa577",
  soil: "#b98d5c", soilDark: "#94693f", rock: "#a67c51",
  kemet: "#33271d", kemetShine: "#5d4a38", mudWet: "#2a2018",
  dry: "#d6b880", dryCrack: "#a8834f",
  water: "#2f7fa6", waterDeep: "#1f5f86", waterHi: "#a9d7e5",
  flood: "#7c8a5e", floodDeep: "#5f6c45", floodHi: "#c9cf9e",
  leaf: "#5f9634", leafDark: "#3e6e22", leafLight: "#8cbc52",
  gold: "#d9aa3c", goldDark: "#a67c1c", goldLight: "#f0cf6a",
  dead: "#a88a55", deadDark: "#7f6538", rot: "#56603f",
  brick: "#cf9f66", brickLight: "#e2b77f", brickDark: "#a97a45",
  plaster: "#d8b27c", plasterDark: "#b88b55",
  wood: "#8a5a32", woodDark: "#5c3a1e",
  palmTrunk: "#9a7148", palmLeaf: "#4f8a3a", palmLeafDark: "#3a6b2b", date: "#c4622d",
  papyrus: "#6e9e3c", papyrusDark: "#4f7a2a",
  stone: "#cbbfa6", stoneDark: "#9e9178",
  ox: "#b06d3f", oxDark: "#8d5330", oxSpot: "#f1e6d0"
};

const R = Math.PI / 180;
const f = n => Math.round(n * 10) / 10;
const pt = p => `${f(p[0])} ${f(p[1])}`;
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
/* Vektor einer Länge, Winkel 0 = senkrecht nach unten, positiv = nach vorne (rechts) */
const dir = (len, a) => [Math.sin(a * R) * len, Math.cos(a * R) * len];

/* kleiner deterministischer Zufall für Pflanzen usw. */
export function rand(seed){
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const stroke = (w = 2) => `stroke="${C.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

function limb(pts, color, w){
  const d = "M" + pts.map(pt).join(" L");
  return `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${w + 3}" stroke-linecap="round" stroke-linejoin="round"/>` +
         `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/* ---------- Figuren ---------- */

/* Posen: absolute Winkel der Glieder (0 = hängt nach unten, + = nach vorn).
   legB/legF = hinteres/vorderes Bein [Oberschenkel, Unterschenkel], armB/armF = Arme [Ober-, Unterarm]. */
export const POSES = {
  stehen:   { lean: 0,  legB: [-5, -3],   legF: [5, 2],    armB: [-10, -4],  armF: [8, 14] },
  gehen:    { lean: 3,  legB: [-22, -8],  legF: [20, 4],   armB: [18, 32],   armF: [-16, -6] },
  hacken:   { lean: 32, legB: [-18, -6],  legF: [16, 6],   armB: [62, 34],   armF: [74, 44], prop: "hacke" },
  saeen:    { lean: 6,  legB: [-20, -8],  legF: [18, 4],   armB: [-6, 70],   armF: [100, 118], prop: "saat" },
  ernten:   { lean: 42, legB: [-16, -4],  legF: [24, 12],  armB: [70, 50],   armF: [58, 96],  prop: "sichel" },
  pfluegen: { lean: 28, legB: [-22, -6],  legF: [14, 4],   armB: [58, 40],   armF: [66, 46] },
  ziehen:   { lean: 8,  legB: [-12, -4],  legF: [14, 4],   armB: [158, 172], armF: [150, 168] },
  tragen:   { lean: 0,  legB: [-18, -6],  legF: [16, 4],   armB: [165, 180], armF: [160, 176], prop: "korb" },
  sitzen:   { lean: 8,  legB: [84, -2],   legF: [92, 4],   armB: [52, 86],   armF: [44, 80], sit: true },
  messen:   { lean: 16, legB: [-10, -4],  legF: [12, 4],   armB: [64, 96],   armF: [52, 100], prop: "messgefaess" },
  spinnen:  { lean: 0,  legB: [-5, -3],   legF: [5, 2],    armB: [12, 40],   armF: [120, 160], prop: "spindel" },
  seil:     { lean: 4,  legB: [-14, -6],  legF: [12, 4],   armB: [70, 82],   armF: [80, 92],  prop: "seil" },
  bauen:    { lean: 22, legB: [-16, -6],  legF: [18, 8],   armB: [70, 120],  armF: [64, 112], prop: "ziegel" },
  winken:   { lean: 0,  legB: [-5, -3],   legF: [5, 2],    armB: [-10, -4],  armF: [150, 170] }
};

/* person({ x, y, pose, n (Nummer: Hautton/Schärpe), scale, flip, kind }) – y = Boden unter den Füßen */
export function person({ x = 0, y = 0, pose = "stehen", n = 0, scale = 1, flip = false, kind = false, sash = true } = {}){
  const P = typeof pose === "string" ? POSES[pose] : pose;
  const skin = C.skin[n % C.skin.length];
  const skinBack = shade(skin, -0.14);
  const TH = 18, SH = 17, TOR = 24, UA = 13, LA = 13;
  const legPts = L => { const k = dir(TH, L[0]); const a = add(k, dir(SH, L[1])); return [[0, 0], k, a]; };
  const lb = legPts(P.legB), lf = legPts(P.legF);
  const low = Math.max(lb[2][1], lf[2][1]);
  const hip = [0, -low - 2];
  const mv = p => add(hip, p);
  const legB = lb.map(mv), legF = lf.map(mv);
  const shoulder = add(hip, [Math.sin(P.lean * R) * TOR, -Math.cos(P.lean * R) * TOR]);
  const neck = add(shoulder, [Math.sin(P.lean * R) * 4, -Math.cos(P.lean * R) * 4]);
  const head = add(shoulder, [Math.sin(P.lean * R) * 11, -Math.cos(P.lean * R) * 11]);
  const arm = A => { const e = add(shoulder, dir(UA, A[0])); return [shoulder, e, add(e, dir(LA, A[1]))]; };
  const aB = arm(P.armB), aF = arm(P.armF);
  const foot = leg => { const a = leg[2]; return [...leg, add(a, [6, 0])]; };

  let s = "";
  s += limb(aB, skinBack, 5);
  s += `<circle cx="${f(aB[2][0])}" cy="${f(aB[2][1])}" r="3" fill="${skinBack}" ${stroke(1.4)}/>`;
  s += limb(foot(legB), skinBack, 6);
  // vorderes Bein vor dem Schurz zeichnen, damit Schurz und Gürtel darüber liegen
  s += limb(foot(legF), skin, 6);
  // Rumpf mit Leinengewand
  s += limb([hip, shoulder], C.linen, 14);
  // Rock / Schurz
  const sk = ((P.legB[0] + P.legF[0]) / 2) * (P.sit ? 0.6 : 0.8);
  const len = P.sit ? 15 : 19;
  const w0 = 7.5, w1 = P.sit ? 9 : 11.5;
  const hem = add(hip, dir(len, sk));
  const px = [Math.cos(P.lean * R), Math.sin(P.lean * R)];
  const skirt = [
    add(hip, [-px[0] * w0, -px[1] * w0]), add(hip, [px[0] * w0, px[1] * w0]),
    add(hem, [Math.cos(sk * R) * w1, -Math.sin(sk * R) * w1]), add(hem, [-Math.cos(sk * R) * w1, Math.sin(sk * R) * w1])
  ];
  s += `<path d="M${skirt.map(pt).join(" L")} Z" fill="${C.linen}" ${stroke(1.6)}/>`;
  s += `<path d="M${pt(add(hem, [-Math.cos(sk * R) * (w1 - 3), Math.sin(sk * R) * (w1 - 3)]))} L${pt(add(hip, [0, 3]))}" stroke="${C.linenShade}" stroke-width="1.4" fill="none"/>`;
  if (sash) s += `<path d="M${pt(add(hip, [-px[0] * 6.5, -px[1] * 6.5 - 1]))} L${pt(add(hip, [px[0] * 6.5, px[1] * 6.5 - 1]))}" stroke="${C.sash[n % C.sash.length]}" stroke-width="4" stroke-linecap="round"/>`;
  // Hals + Kopf
  s += limb([shoulder, neck], skin, 5);
  s += headSVG(head, P.lean, skin, n);
  // vorderer Arm
  s += limb(aF, skin, 5);
  s += `<circle cx="${f(aF[2][0])}" cy="${f(aF[2][1])}" r="3" fill="${skin}" ${stroke(1.4)}/>`;
  if (P.prop) s += prop(P.prop, aF, aB, head, P);
  const sc = (kind ? 0.78 : 1) * scale;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${flip ? -sc : sc} ${sc})">${s}</g>`;
}

function headSVG(c, lean, skin, n){
  const [x, y] = c;
  const r = 7.6;
  const t = lean * 0.35;
  const short = n % 3 === 1;
  const hair = short
    ? `<path d="M${f(x + 5)} ${f(y - 6.5)} A ${r + 0.6} ${r + 0.6} 0 0 0 ${f(x - 7.6)} ${f(y + 1.5)} L ${f(x - 6.6)} ${f(y + 3.5)} Q ${f(x - 2)} ${f(y - 1)} ${f(x + 1.5)} ${f(y - 3.6)} Q ${f(x + 4)} ${f(y - 4.2)} ${f(x + 5)} ${f(y - 6.5)} Z" fill="${C.hair}"/>`
    : `<path d="M${f(x + 5.5)} ${f(y - 6.2)} A ${r + 1} ${r + 1} 0 1 0 ${f(x - 5)} ${f(y + 8.6)} L ${f(x - 1.5)} ${f(y + 8.4)} L ${f(x - 1)} ${f(y + 1)} Q ${f(x + 2)} ${f(y - 3)} ${f(x + 5.5)} ${f(y - 6.2)} Z" fill="${C.hair}"/>`;
  return `<g transform="rotate(${f(t)} ${f(x)} ${f(y)})">
    <circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${skin}" ${stroke(1.6)}/>
    <path d="M${f(x + 7.2)} ${f(y - 1.5)} L ${f(x + 9.4)} ${f(y + 1.6)} L ${f(x + 7)} ${f(y + 2.2)}" fill="${skin}" ${stroke(1.3)}/>
    ${hair}
    <path d="M${f(x + 2.4)} ${f(y - 1.4)} L ${f(x + 5.6)} ${f(y - 1.2)}" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="${f(x + 4.2)}" cy="${f(y - 1.3)}" r="0.9" fill="${C.hair}"/>
  </g>`;
}

function prop(name, aF, aB, head, P){
  const h = aF[2], hb = aB[2];
  const la = Math.atan2(aF[2][0] - aF[1][0], aF[2][1] - aF[1][1]) / R; // Winkel Unterarm
  switch (name){
    case "hacke": {
      const end = add(h, dir(26, la + 8));
      const blade = add(end, dir(15, la - 120));
      return `<path d="M${pt(add(h, dir(-6, la + 8)))} L${pt(end)}" stroke="${C.woodDark}" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M${pt(add(h, dir(-6, la + 8)))} L${pt(end)}" stroke="${C.wood}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M${pt(end)} L${pt(blade)}" stroke="${C.woodDark}" stroke-width="5" stroke-linecap="round"/>
        <path d="M${pt(add(end, dir(-12, la + 8)))} L${pt(add(end, dir(7, la - 120)))}" stroke="${C.ink}" stroke-width="1.2"/>`;
    }
    case "sichel": {
      const a = add(h, dir(4, la)), b = add(h, dir(16, la + 40)), c = add(h, dir(14, la + 95));
      return `<path d="M${pt(h)} L${pt(a)}" stroke="${C.woodDark}" stroke-width="4" stroke-linecap="round"/>
        <path d="M${pt(a)} Q ${pt(b)} ${pt(c)}" fill="none" stroke="${C.ink}" stroke-width="4.4" stroke-linecap="round"/>
        <path d="M${pt(a)} Q ${pt(b)} ${pt(c)}" fill="none" stroke="#e8e2cf" stroke-width="2.2" stroke-linecap="round"/>`;
    }
    case "saat": {
      const bag = `<path d="M${f(hb[0] - 6)} ${f(hb[1])} Q ${f(hb[0] - 8)} ${f(hb[1] + 12)} ${f(hb[0])} ${f(hb[1] + 13)} Q ${f(hb[0] + 8)} ${f(hb[1] + 12)} ${f(hb[0] + 6)} ${f(hb[1])} Z" fill="${C.linenShade}" ${stroke(1.4)}/>`;
      let seeds = "";
      const rr = rand(7);
      for (let i = 0; i < 9; i++){
        const t = i / 8;
        const sx = h[0] + 4 + t * 26 + rr() * 4, sy = h[1] + 2 + t * t * 34 + rr() * 3;
        seeds += `<ellipse cx="${f(sx)}" cy="${f(sy)}" rx="1.3" ry="0.9" fill="${C.goldDark}"/>`;
      }
      return bag + seeds;
    }
    case "korb": {
      const top = add(head, [0, -8]);
      return `<path d="M${f(top[0] - 11)} ${f(top[1] - 1)} L ${f(top[0] + 11)} ${f(top[1] - 1)} L ${f(top[0] + 8)} ${f(top[1] + 6)} L ${f(top[0] - 8)} ${f(top[1] + 6)} Z" fill="${C.brickLight}" ${stroke(1.5)}/>
        <path d="M${f(top[0] - 9)} ${f(top[1] + 2.5)} L ${f(top[0] + 9)} ${f(top[1] + 2.5)}" stroke="${C.brickDark}" stroke-width="1"/>
        <path d="M${f(top[0] - 10)} ${f(top[1] - 1)} Q ${f(top[0])} ${f(top[1] - 9)} ${f(top[0] + 10)} ${f(top[1] - 1)} Z" fill="${C.gold}" ${stroke(1.3)}/>`;
    }
    case "messgefaess": {
      const c = add(h, [7, 0]);
      return `<path d="M${f(c[0] - 7)} ${f(c[1] - 9)} L ${f(c[0] + 7)} ${f(c[1] - 9)} L ${f(c[0] + 6)} ${f(c[1] + 7)} L ${f(c[0] - 6)} ${f(c[1] + 7)} Z" fill="${C.brick}" ${stroke(1.5)}/>
        <path d="M${f(c[0] - 6)} ${f(c[1] - 9)} Q ${f(c[0])} ${f(c[1] - 14)} ${f(c[0] + 6)} ${f(c[1] - 9)} Z" fill="${C.gold}" ${stroke(1.2)}/>`;
    }
    case "spindel": {
      const low = add(hb, [3, 24]);
      return `<path d="M${pt(h)} L${pt(add(hb, [3, 0]))} L${pt(low)}" fill="none" stroke="${C.linenShade}" stroke-width="1.2"/>
        <path d="M${f(low[0])} ${f(low[1] - 8)} L ${f(low[0])} ${f(low[1] + 6)}" stroke="${C.woodDark}" stroke-width="2.2"/>
        <ellipse cx="${f(low[0])}" cy="${f(low[1] + 2)}" rx="4.5" ry="2.2" fill="${C.wood}" ${stroke(1.2)}/>`;
    }
    case "seil": {
      return `<ellipse cx="${f(hb[0] - 2)}" cy="${f(hb[1] + 3)}" rx="6" ry="4" fill="none" stroke="${C.goldDark}" stroke-width="2.4"/>
        <path d="M${pt(h)} L ${f(h[0] + 60)} ${f(h[1] + 6)}" stroke="${C.goldDark}" stroke-width="1.8" stroke-dasharray="7 2"/>`;
    }
    case "ziegel": {
      const c = add(h, [4, 2]);
      return `<rect x="${f(c[0] - 7)}" y="${f(c[1] - 4)}" width="14" height="7" rx="1" fill="${C.brick}" ${stroke(1.3)}/>`;
    }
  }
  return "";
}

/* Farbe heller/dunkler machen */
export function shade(hex, amt){
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* ---------- Rinder und Pflug ---------- */

export function ox({ x = 0, y = 0, scale = 1, dark = false, spots = true } = {}){
  const body = dark ? C.oxDark : C.ox;
  const legC = shade(body, -0.12);
  const leg = (lx, ang, back) => {
    const top = [lx, -30], knee = add(top, dir(15, ang)), hoof = add(knee, dir(15, -ang * 0.4));
    return limb([top, knee, hoof], back ? shade(legC, -0.1) : legC, 7) +
      `<path d="M${f(hoof[0] - 3.5)} ${f(hoof[1])} L ${f(hoof[0] + 4)} ${f(hoof[1])}" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
  };
  let s = "";
  s += leg(-30, -10, true) + leg(30, 8, true);
  s += `<path d="M-46 -40 Q -50 -52 -36 -55 L 20 -57 Q 30 -64 38 -56 Q 46 -52 48 -42 L 46 -30 Q 40 -24 30 -26 L -28 -25 Q -44 -26 -46 -40 Z" fill="${body}" ${stroke(2)}/>`;
  if (spots){
    s += `<path d="M-30 -52 Q -18 -56 -12 -46 Q -16 -36 -28 -38 Q -36 -44 -30 -52 Z" fill="${C.oxSpot}" opacity=".9"/>
          <path d="M6 -44 Q 14 -50 20 -42 Q 16 -33 7 -35 Z" fill="${C.oxSpot}" opacity=".9"/>`;
  }
  s += `<path d="M-46 -42 Q -54 -30 -52 -16" fill="none" stroke="${C.ink}" stroke-width="2"/><path d="M-54 -18 Q -52 -11 -49 -17 Z" fill="${C.ink}"/>`;
  s += leg(-22, -14, false) + leg(38, 10, false);
  // Kopf
  s += `<path d="M40 -56 Q 54 -60 62 -50 L 70 -36 Q 72 -30 66 -29 L 60 -30 Q 52 -36 44 -38 Z" fill="${body}" ${stroke(2)}/>`;
  s += `<path d="M64 -31 Q 69 -31 70 -35" fill="none" stroke="${C.ink}" stroke-width="1.4"/>`;
  s += `<circle cx="57" cy="-48" r="1.6" fill="${C.ink}"/>`;
  s += `<path d="M50 -54 Q 44 -60 47 -63 Q 52 -60 53 -55 Z" fill="${shade(body, -0.15)}" ${stroke(1.4)}/>`;
  // Leierförmige Hörner (etwas kleiner)
  s += `<g transform="translate(55 -57) scale(.8) translate(-55 57)">`;
  s += `<path d="M54 -57 Q 46 -70 54 -80 Q 58 -84 62 -82" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>
        <path d="M54 -57 Q 46 -70 54 -80 Q 58 -84 62 -82" fill="none" stroke="${C.linen}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M57 -57 Q 66 -68 62 -78 Q 61 -82 66 -84" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>
        <path d="M57 -57 Q 66 -68 62 -78 Q 61 -82 66 -84" fill="none" stroke="${C.linen}" stroke-width="2.6" stroke-linecap="round"/></g>`;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${scale})">${s}</g>`;
}

/* Gespann: zwei Rinder, Joch, Hakenpflug, Pflüger. x = Mitte der Rinder, y = Boden */
export function plowTeam({ x = 0, y = 0, scale = 1, n = 0 } = {}){
  let s = "";
  s += ox({ x: 10, y: -3, dark: true, spots: false });
  // Deichsel zwischen den Rindern (liegt hinter dem vorderen Rind)
  s += `<path d="M44 -58 L -70 -14" stroke="${C.woodDark}" stroke-width="5" stroke-linecap="round"/><path d="M44 -58 L -70 -14" stroke="${C.wood}" stroke-width="2.6" stroke-linecap="round"/>`;
  s += ox({ x: 0, y: 0 });
  // Joch auf dem Nacken
  s += `<path d="M34 -62 L 54 -58" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/><path d="M34 -62 L 54 -58" stroke="${C.wood}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<path d="M-70 -14 L -48 -22" stroke="${C.woodDark}" stroke-width="4.4" stroke-linecap="round"/>`;
  // Pflug: Schar im Boden, Sterz nach hinten oben
  s += `<path d="M-70 -14 L -62 4 L -80 2 Z" fill="${C.woodDark}" ${stroke(1.4)}/>`;
  s += `<path d="M-74 -6 L -100 -44" stroke="${C.woodDark}" stroke-width="5" stroke-linecap="round"/><path d="M-74 -6 L -100 -44" stroke="${C.wood}" stroke-width="2.6" stroke-linecap="round"/>`;
  s += `<path d="M-98 -42 L -106 -44" stroke="${C.woodDark}" stroke-width="4" stroke-linecap="round"/>`;
  // aufgeworfene Erde
  s += `<path d="M-90 1 Q -80 -6 -66 1 Z" fill="${C.kemetShine}" ${stroke(1.2)}/>`;
  s += person({ x: -128, y: 0, pose: "pfluegen", n });
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${scale})">${s}</g>`;
}

/* ---------- Pflanzen ---------- */

/* Stadien: saat, keim, jung, halm, aehre, reif, stoppel, verdorrt, verfault */
export function plant(stage, x, y, r = Math.random, k = 1){
  const h = (0.85 + r() * 0.3) * k;
  const tilt = (r() - 0.5) * 8;
  const g = (inner) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(tilt)})">${inner}</g>`;
  const leafs = (n, len, col) => {
    let s = "";
    for (let i = 0; i < n; i++){
      const yy = -4 - i * len * 0.55, side = i % 2 ? 1 : -1;
      s += `<path d="M0 ${f(yy)} Q ${f(side * len * 0.55)} ${f(yy - len * 0.35)} ${f(side * len * 0.9)} ${f(yy - len * 0.15)}" fill="none" stroke="${col}" stroke-width="2.2" stroke-linecap="round"/>`;
    }
    return s;
  };
  const ear = (len, col, dark, droop = 0, awn = true) => {
    const top = -len * h;
    let s = `<g transform="translate(0 ${f(top)}) rotate(${droop})">`;
    s += `<path d="M0 0 Q -3.4 -6 0 -13 Q 3.4 -6 0 0 Z" fill="${col}" stroke="${dark}" stroke-width="1"/>`;
    s += `<path d="M-1.6 -3 L 1.6 -5 M -1.6 -7 L 1.6 -9" stroke="${dark}" stroke-width=".8"/>`;
    if (awn) s += `<path d="M0 -13 L -2 -20 M 0 -13 L 1.5 -21 M -1.6 -9 L -5 -15 M 1.6 -9 L 5 -15" stroke="${dark}" stroke-width=".7"/>`;
    return s + "</g>";
  };
  switch (stage){
    case "saat":
      return `<ellipse cx="${f(x)}" cy="${f(y - 1)}" rx="1.4" ry="1" fill="${C.goldLight}" stroke="${C.goldDark}" stroke-width=".6"/>`;
    case "keim":
      return g(`<path d="M0 0 L 0 -5" stroke="${C.leaf}" stroke-width="1.8"/><path d="M0 -4 Q -4 -8 -5 -6 M 0 -4 Q 4 -9 5 -7" fill="none" stroke="${C.leafLight}" stroke-width="2" stroke-linecap="round"/>`);
    case "jung":
      return g(`<path d="M0 0 L 0 ${f(-12 * h)}" stroke="${C.leaf}" stroke-width="2"/>${leafs(3, 9 * h, C.leafLight)}`);
    case "halm":
      return g(`<path d="M0 0 L 0 ${f(-24 * h)}" stroke="${C.leafDark}" stroke-width="2.2"/>${leafs(4, 12 * h, C.leaf)}`);
    case "aehre":
      return g(`<path d="M0 0 L 0 ${f(-30 * h)}" stroke="${C.leafDark}" stroke-width="2.2"/>${leafs(3, 13 * h, C.leaf)}${ear(30, C.leafLight, C.leafDark)}`);
    case "reif":
      return g(`<path d="M0 0 Q 1 ${f(-18 * h)} 2 ${f(-31 * h)}" fill="none" stroke="${C.goldDark}" stroke-width="2.2"/>${leafs(2, 11 * h, C.gold)}<g transform="translate(2 0)">${ear(31, C.gold, C.goldDark, 18)}</g>`);
    case "stoppel":
      return g(`<path d="M0 0 L 0 -6 M 2 0 L 2.5 -5" stroke="${C.goldDark}" stroke-width="1.8"/>`);
    case "verdorrt":
      return g(`<path d="M0 0 Q 0 ${f(-12 * h)} ${f(5 * h)} ${f(-18 * h)} Q ${f(8 * h)} ${f(-20 * h)} ${f(10 * h)} ${f(-13 * h)}" fill="none" stroke="${C.dead}" stroke-width="2"/><path d="M0 -5 Q -5 -4 -7 0 M 0 -9 Q 5 -10 7 -5" fill="none" stroke="${C.deadDark}" stroke-width="1.6" stroke-linecap="round"/>`);
    case "verfault":
      return g(`<path d="M0 0 Q -6 -6 -14 -4 M 0 0 Q 6 -5 13 -2" fill="none" stroke="${C.rot}" stroke-width="2.2" stroke-linecap="round"/>`);
  }
  return "";
}

/* ---------- Felder ---------- */

/* Bodenzustand: trocken, schlamm, gepflueg, gesaet, brache (rissig, Stoppeln möglich) */
export function fieldSoil(kind, x0, x1, y, seed = 1){
  const r = rand(seed);
  const w = x1 - x0;
  let s = "";
  if (kind === "trocken" || kind === "brache"){
    s += `<path d="M${x0} ${y} L ${x1} ${y} L ${x1} ${y + 9} L ${x0} ${y + 9} Z" fill="${C.dry}"/>`;
    let cx = x0 + 10;
    while (cx < x1 - 8){
      const d = 4 + r() * 6;
      s += `<path d="M${f(cx)} ${y} L ${f(cx + 1.5)} ${f(y + d)} L ${f(cx + 3.5)} ${f(y + d * 0.6)}" fill="none" stroke="${C.dryCrack}" stroke-width="1.4"/>`;
      cx += 12 + r() * 14;
    }
    s += `<path d="M${x0} ${y} L ${x1} ${y}" ${stroke(2)}/>`;
  } else if (kind === "schlamm"){
    s += `<path d="M${x0} ${y + 1} Q ${f(x0 + w * 0.3)} ${y - 3} ${f(x0 + w * 0.6)} ${y - 1} T ${x1} ${y} L ${x1} ${y + 10} L ${x0} ${y + 10} Z" fill="${C.mudWet}"/>`;
    for (let i = 0; i < 5; i++){
      const sx = x0 + 12 + r() * (w - 40);
      s += `<path d="M${f(sx)} ${f(y + 2 + r() * 3)} q 10 -2 ${f(16 + r() * 10)} 0" fill="none" stroke="${C.kemetShine}" stroke-width="1.6" stroke-linecap="round"/>`;
    }
    s += `<path d="M${x0} ${y + 1} Q ${f(x0 + w * 0.3)} ${y - 3} ${f(x0 + w * 0.6)} ${y - 1} T ${x1} ${y}" fill="none" ${stroke(2)}/>`;
  } else if (kind === "gepflueg" || kind === "gesaet"){
    let d = `M${x0} ${y}`;
    const n = Math.round(w / 12);
    for (let i = 0; i < n; i++){
      const a = x0 + (i / n) * w, b = x0 + ((i + 0.5) / n) * w, c = x0 + ((i + 1) / n) * w;
      d += ` Q ${f(a + 2)} ${f(y - 5)} ${f(b)} ${f(y - 4)} Q ${f(c - 2)} ${f(y - 4)} ${f(c)} ${f(y + 1)}`;
    }
    s += `<path d="${d} L ${x1} ${y + 10} L ${x0} ${y + 10} Z" fill="${C.kemet}"/>`;
    s += `<path d="${d}" fill="none" ${stroke(2)}/>`;
    if (kind === "gesaet") for (let i = 0; i < n; i++) s += plant("saat", x0 + ((i + 0.5) / n) * w, y - 2.5);
  }
  return s;
}

/* Pflanzenreihe auf einem Feld */
export function fieldPlants(stage, x0, x1, y, seed = 3, k = 1){
  if (!stage || stage === "saat") return "";
  const r = rand(seed);
  let s = "";
  const step = (stage === "stoppel" ? 9 : 11) * Math.min(k, 1.15);
  for (let x = x0 + 7; x < x1 - 4; x += step + r() * 3) s += `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">${plant(stage, 0, 0, r)}</g>`;
  return s;
}

/* ---------- Pflanzen am Rand ---------- */

export function palm({ x = 0, y = 0, h = 110, lean = 6, dates = true } = {}){
  const top = [x + lean, y - h];
  const mid = [x + lean * 0.2, y - h * 0.5];
  let s = "";
  // Stamm mit Ringen
  s += `<path d="M${x - 6} ${y} Q ${f(mid[0] - 5)} ${f(mid[1])} ${f(top[0] - 3)} ${f(top[1])} L ${f(top[0] + 3)} ${f(top[1])} Q ${f(mid[0] + 5)} ${f(mid[1])} ${x + 6} ${y} Z" fill="${C.palmTrunk}" ${stroke(1.8)}/>`;
  for (let i = 1; i < 10; i++){
    const t = i / 10;
    const cx = x + (top[0] - x) * t * t, cy = y - h * t;
    const ww = 6 - t * 3;
    s += `<path d="M${f(cx - ww)} ${f(cy + 2)} L ${f(cx)} ${f(cy - 1)} L ${f(cx + ww)} ${f(cy + 2)}" fill="none" stroke="${shade(C.palmTrunk, -0.3)}" stroke-width="1.2"/>`;
  }
  // Wedel
  const fronds = [-160, -130, -100, -70, -40, -15, 15, 40];
  const frond = (ang, len, col) => {
    const a = ang * R;
    const end = [top[0] + Math.cos(a) * len, top[1] + Math.sin(a) * len * 0.75 + len * 0.35];
    const ctrl = [top[0] + Math.cos(a) * len * 0.5, top[1] + Math.sin(a) * len * 0.5 - len * 0.18];
    let fr = `<path d="M${pt(top)} Q ${pt(ctrl)} ${pt(end)}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
    fr += `<path d="M${pt(top)} Q ${pt(ctrl)} ${pt(end)}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`;
    for (let i = 2; i < 10; i++){
      const t = i / 10;
      const px = (1 - t) * (1 - t) * top[0] + 2 * (1 - t) * t * ctrl[0] + t * t * end[0];
      const py = (1 - t) * (1 - t) * top[1] + 2 * (1 - t) * t * ctrl[1] + t * t * end[1];
      const l = 10 * (1 - t * 0.6);
      fr += `<path d="M${f(px)} ${f(py)} l ${f(-3)} ${f(l)} M ${f(px)} ${f(py)} l ${f(4)} ${f(l * 0.9)}" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`;
    }
    return fr;
  };
  fronds.forEach((a, i) => { if (i % 2) s += frond(a + 4, 46, C.palmLeafDark); });
  if (dates) s += `<g>${[[-5, 8], [0, 11], [5, 8], [-2, 14], [3, 15]].map(([dx, dy]) => `<circle cx="${f(top[0] + dx)}" cy="${f(top[1] + dy)}" r="3" fill="${C.date}" ${stroke(1)}/>`).join("")}</g>`;
  fronds.forEach((a, i) => { if (!(i % 2)) s += frond(a, 52, C.palmLeaf); });
  return s;
}

export function papyrus({ x = 0, y = 0, h = 60, n = 5, seed = 2 } = {}){
  const r = rand(seed);
  let s = "";
  for (let i = 0; i < n; i++){
    const bx = x + (i - n / 2) * 4;
    const tx = bx + (i - n / 2) * 6 + (r() - 0.5) * 6;
    const ty = y - h * (0.75 + r() * 0.3);
    s += `<path d="M${f(bx)} ${y} Q ${f(bx)} ${f(y - h * 0.5)} ${f(tx)} ${f(ty)}" fill="none" stroke="${C.papyrusDark}" stroke-width="2.6"/>`;
    // Dolde
    let u = "";
    for (let k = -3; k <= 3; k++){
      const a = (-90 + k * 22) * R;
      u += `M${f(tx)} ${f(ty)} l ${f(Math.cos(a) * 12)} ${f(Math.sin(a) * 10)} `;
    }
    s += `<path d="${u}" stroke="${C.papyrus}" stroke-width="2" stroke-linecap="round"/>`;
    s += `<path d="M${f(tx - 10)} ${f(ty - 4)} Q ${f(tx)} ${f(ty - 14)} ${f(tx + 10)} ${f(ty - 4)}" fill="none" stroke="${C.papyrusDark}" stroke-width="1"/>`;
  }
  return s;
}

/* ---------- Gebäude ---------- */

/* Lehmziegelhaus. x = linke untere Ecke */
export function house({ x = 0, y = 0, w = 70, h = 46, roof = true, door = "right", ruined = false, seed = 4 } = {}){
  const r = rand(seed);
  let s = "";
  if (ruined){
    const top = [];
    for (let i = 0; i <= 6; i++) top.push([x + (w * i) / 6, y - h * (0.25 + r() * 0.45)]);
    s += `<path d="M${x} ${y} L ${top.map(pt).join(" L ")} L ${x + w} ${y} Z" fill="${C.brick}" ${stroke(2)}/>`;
    s += `<path d="M${x + 6} ${f(y - h * 0.6)} L ${x + w + 14} ${f(y - h * 0.15)}" stroke="${C.woodDark}" stroke-width="4" stroke-linecap="round"/>`;
    for (let i = 0; i < 6; i++){
      const bx = x - 8 + r() * (w + 24), bw = 8 + r() * 8;
      s += `<rect x="${f(bx)}" y="${f(y - 5 - r() * 3)}" width="${f(bw)}" height="6" rx="1" transform="rotate(${f((r() - 0.5) * 30)} ${f(bx)} ${y})" fill="${C.brickDark}" ${stroke(1.2)}/>`;
    }
    s += `<path d="M${x - 14} ${y} Q ${x + w / 2} ${y - 8} ${x + w + 20} ${y} Z" fill="${C.mudWet}" opacity=".8"/>`;
    return s;
  }
  s += `<path d="M${x} ${y} L ${x} ${y - h} L ${x + w} ${y - h} L ${x + w} ${y} Z" fill="${C.brick}" ${stroke(2)}/>`;
  // Ziegelfugen andeuten
  for (let row = 1; row < h / 7; row++){
    const yy = y - row * 7;
    for (let c = 0; c < 3; c++){
      const bx = x + 6 + ((row % 2) * 8) + c * (w / 3) + r() * 4;
      if (bx < x + w - 12) s += `<path d="M${f(bx)} ${f(yy)} l 9 0" stroke="${C.brickDark}" stroke-width="1" opacity=".7"/>`;
    }
  }
  // Brüstung
  s += `<path d="M${x - 3} ${y - h} L ${x + w + 3} ${y - h} L ${x + w + 3} ${y - h - 6} L ${x - 3} ${y - h - 6} Z" fill="${C.brickLight}" ${stroke(1.8)}/>`;
  // Tür und Fenster
  const dx = door === "left" ? x + 10 : x + w - 26;
  s += `<path d="M${dx} ${y} L ${dx} ${y - 26} L ${dx + 16} ${y - 26} L ${dx + 16} ${y} Z" fill="${C.woodDark}" ${stroke(1.6)}/>`;
  s += `<path d="M${dx - 2} ${y - 27} L ${dx + 18} ${y - 27}" stroke="${C.wood}" stroke-width="3"/>`;
  const wx = door === "left" ? x + w - 22 : x + 10;
  s += `<rect x="${wx}" y="${y - h + 9}" width="12" height="7" fill="${C.woodDark}" ${stroke(1.2)}/>`;
  s += `<path d="M${wx + 4} ${y - h + 9} l 0 7 M ${wx + 8} ${y - h + 9} l 0 7" stroke="${C.brickDark}" stroke-width="1"/>`;
  // Dachunterstand aus Palmwedeln
  if (roof){
    const rx = door === "left" ? x + w - 34 : x + 6;
    s += `<path d="M${rx + 2} ${y - h - 6} L ${rx + 2} ${y - h - 22} M ${rx + 26} ${y - h - 6} L ${rx + 26} ${y - h - 22}" stroke="${C.woodDark}" stroke-width="2.4"/>`;
    s += `<path d="M${rx - 4} ${y - h - 21} Q ${rx + 14} ${y - h - 27} ${rx + 32} ${y - h - 21} L ${rx + 30} ${y - h - 18} L ${rx - 2} ${y - h - 18} Z" fill="${C.palmLeaf}" ${stroke(1.4)}/>`;
    s += `<path d="M${rx} ${y - h - 19} l 4 -4 M ${rx + 8} ${y - h - 19} l 4 -5 M ${rx + 16} ${y - h - 19} l 4 -5 M ${rx + 24} ${y - h - 19} l 4 -4" stroke="${C.palmLeafDark}" stroke-width="1.2"/>`;
  }
  return s;
}

/* Kuppelspeicher, aufgeschnitten. x = Mitte, fill 0..1 */
export function granary({ x = 0, y = 0, w = 44, h = 58, fill = 0.5, ladder = true, cut = true } = {}){
  const L = x - w / 2, Rr = x + w / 2;
  const dome = `M${L} ${y} L ${L} ${f(y - h * 0.45)} Q ${L} ${y - h} ${x} ${y - h} Q ${Rr} ${y - h} ${Rr} ${f(y - h * 0.45)} L ${Rr} ${y} Z`;
  const id = "g" + Math.round(x * 10 + y);
  let s = `<path d="${dome}" fill="${C.plaster}" ${stroke(2)}/>`;
  if (cut){
    const iL = L + 7, iR = Rr - 7, iT = y - h + 12, iB = y - 5;
    const inner = `M${iL} ${iB} L ${iL} ${f(y - h * 0.48)} Q ${iL} ${iT} ${x} ${iT} Q ${iR} ${iT} ${iR} ${f(y - h * 0.48)} L ${iR} ${iB} Z`;
    s += `<clipPath id="${id}"><path d="${inner}"/></clipPath>`;
    s += `<path d="${inner}" fill="${C.woodDark}"/>`;
    if (fill > 0){
      const top = iB - (iB - iT) * Math.min(1, fill);
      let grains = "";
      const r = rand(Math.round(x));
      for (let i = 0; i < 26; i++) grains += `<ellipse cx="${f(iL + r() * (iR - iL))}" cy="${f(top + 4 + r() * (iB - top))}" rx="1.5" ry="1" fill="${C.goldDark}"/>`;
      s += `<g clip-path="url(#${id})"><path d="M${iL - 2} ${iB + 2} L ${iL - 2} ${f(top + 6)} Q ${x} ${f(top - 7)} ${iR + 2} ${f(top + 6)} L ${iR + 2} ${iB + 2} Z" fill="${C.gold}" stroke="${C.goldDark}" stroke-width="1.2"/>${grains}</g>`;
    }
    s += `<path d="${inner}" fill="none" stroke="${C.ink}" stroke-width="1.4"/>`;
    // Schnittkante (gestrichelt), damit klar ist: hier sieht man hinein
    s += `<path d="${inner}" fill="none" stroke="${C.plasterDark}" stroke-width="1" stroke-dasharray="3 3" transform="translate(0 0)" opacity=".0"/>`;
  }
  // Luke oben
  s += `<path d="M${x - 7} ${y - h + 1} L ${x - 6} ${y - h - 5} L ${x + 6} ${y - h - 5} L ${x + 7} ${y - h + 1} Z" fill="${C.plasterDark}" ${stroke(1.6)}/>`;
  if (ladder){
    const lx = Rr - 2;
    s += `<path d="M${lx} ${y} L ${lx - 14} ${y - h + 4} M ${lx + 8} ${y} L ${lx - 6} ${y - h + 4}" stroke="${C.woodDark}" stroke-width="2.4"/>`;
    for (let i = 1; i < 6; i++){
      const t = i / 6;
      s += `<path d="M${f(lx - 14 * t)} ${f(y - (h - 4) * t)} l 8 0" stroke="${C.woodDark}" stroke-width="2"/>`;
    }
  }
  return s;
}

/* gemeinsamer Speicherhof: Mauer + drei Kuppeln */
export function storeYard({ x = 0, y = 0, fill = 0.6 } = {}){
  let s = "";
  s += granary({ x: x + 26, y, w: 40, h: 54, fill: Math.min(1, fill * 1.1), ladder: false });
  s += granary({ x: x + 70, y, w: 44, h: 60, fill, ladder: false });
  s += granary({ x: x + 116, y, w: 40, h: 54, fill: Math.max(0, fill * 0.9), ladder: true });
  s += `<path d="M${x - 4} ${y} L ${x - 4} ${y - 18} L ${x + 146} ${y - 18} L ${x + 146} ${y} Z" fill="${C.brick}" ${stroke(2)}/>`;
  s += `<path d="M${x - 6} ${y - 18} L ${x + 148} ${y - 18}" stroke="${C.brickLight}" stroke-width="4"/>`;
  return s;
}

/* Deich: Erddamm mit Ziegelkrone. x0..x1 Fuß, y = Fuß, top = Kronenhöhe */
export function dike({ x0 = 0, x1 = 60, y = 0, top = -60, seed = 9 } = {}){
  const r = rand(seed);
  const tw = (x1 - x0) * 0.32;
  const cx = (x0 + x1) / 2;
  let s = `<path d="M${x0} ${y} L ${f(cx - tw / 2)} ${top} L ${f(cx + tw / 2)} ${top} L ${x1} ${y} Z" fill="${C.soil}" ${stroke(2)}/>`;
  for (let i = 0; i < 4; i++){
    const yy = top + (y - top) * (0.25 + i * 0.2);
    s += `<path d="M${f(cx - tw / 2 - (yy - top) * 0.55 + 4)} ${f(yy)} l ${f(8 + r() * 10)} 0" stroke="${C.soilDark}" stroke-width="1.2"/>`;
  }
  // Schilfbündel an der Wasserseite
  for (let i = 0; i < 4; i++){
    const t = 0.15 + i * 0.22;
    const px = x0 + (cx - tw / 2 - x0) * t, py = y + (top - y) * t;
    s += `<path d="M${f(px - 3)} ${f(py + 6)} l 6 -10" stroke="${C.goldDark}" stroke-width="3" stroke-linecap="round"/>`;
  }
  s += `<path d="M${f(cx - tw / 2 - 2)} ${top} L ${f(cx + tw / 2 + 2)} ${top} L ${f(cx + tw / 2 + 2)} ${top - 6} L ${f(cx - tw / 2 - 2)} ${top - 6} Z" fill="${C.brick}" ${stroke(1.6)}/>`;
  return s;
}

/* kleiner Erdwall um den Hof */
export function earthWall({ x = 0, y = 0, w = 30, h = 16 } = {}){
  return `<path d="M${x} ${y} Q ${x + w * 0.2} ${y - h} ${x + w * 0.5} ${y - h} Q ${x + w * 0.8} ${y - h} ${x + w} ${y} Z" fill="${C.soil}" ${stroke(1.8)}/>
    <path d="M${x + w * 0.3} ${y - h * 0.6} l 6 0 M ${x + w * 0.5} ${y - h * 0.35} l 8 0" stroke="${C.soilDark}" stroke-width="1.2"/>`;
}

/* Feldhütte (einfacher Unterstand am Feld) */
export function fieldHut({ x = 0, y = 0, ruined = false } = {}){
  if (ruined) return `<path d="M${x} ${y} L ${x + 6} ${y - 14} M ${x + 30} ${y} L ${x + 20} ${y - 10}" stroke="${C.woodDark}" stroke-width="3" stroke-linecap="round"/><path d="M${x - 4} ${y} Q ${x + 14} ${y - 8} ${x + 34} ${y} Z" fill="${C.palmLeafDark}" opacity=".8" ${stroke(1.2)}/>`;
  return `<path d="M${x + 3} ${y} L ${x + 3} ${y - 26} M ${x + 27} ${y} L ${x + 27} ${y - 26}" stroke="${C.woodDark}" stroke-width="3"/>
    <path d="M${x - 4} ${y - 25} Q ${x + 15} ${y - 33} ${x + 34} ${y - 25} L ${x + 32} ${y - 21} L ${x - 2} ${y - 21} Z" fill="${C.palmLeaf}" ${stroke(1.4)}/>`;
}

/* ---------- Schaduf ---------- */

/* x = Fuß des Pfostens, y = Boden, t = 0 (Eimer unten im Wasser) … 1 (Eimer oben, gießt in den Trog).
   Der Eimer hängt etwa 82 px links vom Pfosten; dort muss das Ufer abfallen. */
export function shaduf({ x = 0, y = 0, t = 0, reach = 92, high = 125, rope = 100, operator = true, n = 0, pour = null } = {}){
  const pouring = pour == null ? t > 0.9 : pour;
  const pivot = [x, y - high];
  const ang = (-24 + (1 - t) * 52) * R;
  const tip = [pivot[0] - Math.cos(ang) * reach, pivot[1] + Math.sin(ang) * reach];
  const tail = [pivot[0] + Math.cos(ang) * 40, pivot[1] - Math.sin(ang) * 40];
  const bucket = [tip[0], tip[1] + rope];
  const tx = tip[0] + 6;
  let s = "";
  // Sockel aus Lehmziegeln, Pfosten mit Gabel
  s += `<path d="M${x - 12} ${y} L ${x - 9} ${y - 26} L ${x + 9} ${y - 26} L ${x + 12} ${y} Z" fill="${C.brick}" ${stroke(1.8)}/>`;
  s += `<path d="M${x - 9} ${y - 13} L ${x + 9} ${y - 13}" stroke="${C.brickDark}" stroke-width="1.2"/>`;
  s += `<path d="M${x} ${y - 24} L ${pivot[0]} ${pivot[1] + 2}" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/><path d="M${x} ${y - 24} L ${pivot[0]} ${pivot[1] + 2}" stroke="${C.wood}" stroke-width="5" stroke-linecap="round"/>`;
  s += `<path d="M${pivot[0] - 6} ${pivot[1] - 6} L ${pivot[0]} ${pivot[1] + 2} L ${pivot[0] + 6} ${pivot[1] - 6}" fill="none" stroke="${C.woodDark}" stroke-width="3.4" stroke-linecap="round"/>`;
  // Trog an der Uferkante, Rinne zum Feld
  s += `<path d="M${f(tx + 2)} ${y - 2} L ${x - 14} ${y - 2}" stroke="${pouring ? C.water : C.soilDark}" stroke-width="3" stroke-linecap="round" opacity=".9"/>`;
  s += `<path d="M${f(tx)} ${y - 11} L ${f(tx + 20)} ${y - 11} L ${f(tx + 18)} ${y - 1} L ${f(tx + 2)} ${y - 1} Z" fill="${C.brickLight}" ${stroke(1.5)}/>`;
  if (pouring) s += `<path d="M${f(tx + 3)} ${y - 9} L ${f(tx + 17)} ${y - 9}" stroke="${C.water}" stroke-width="3"/>`;
  if (operator) s += person({ x: tip[0] + 32, y, pose: { lean: 10, legB: [-14, -5], legF: [14, 5], armB: [112, 128], armF: [118, 132] }, n, flip: true });
  // Seil und Eimer
  const tilt = pouring ? -35 : 0;
  s += `<path d="M${pt(tip)} L ${pt(bucket)}" stroke="${C.goldDark}" stroke-width="1.8"/>`;
  s += `<g transform="rotate(${tilt} ${f(bucket[0])} ${f(bucket[1])})"><path d="M${f(bucket[0] - 7)} ${f(bucket[1])} L ${f(bucket[0] + 7)} ${f(bucket[1])} Q ${f(bucket[0] + 6)} ${f(bucket[1] + 12)} ${f(bucket[0])} ${f(bucket[1] + 13)} Q ${f(bucket[0] - 6)} ${f(bucket[1] + 12)} ${f(bucket[0] - 7)} ${f(bucket[1])} Z" fill="${C.wood}" ${stroke(1.6)}/>
    ${t > 0.3 ? `<path d="M${f(bucket[0] - 6)} ${f(bucket[1] + 2)} L ${f(bucket[0] + 6)} ${f(bucket[1] + 2)}" stroke="${C.waterHi}" stroke-width="2.2"/>` : ""}</g>`;
  if (pouring) s += `<path d="M${f(bucket[0] + 7)} ${f(bucket[1] - 1)} Q ${f(bucket[0] + 14)} ${f(bucket[1] + 6)} ${f(tx + 9)} ${y - 10}" fill="none" stroke="${C.water}" stroke-width="3.2" stroke-linecap="round"/>`;
  // Balken mit Gegengewicht (Lehmklumpen)
  s += `<path d="M${pt(tip)} L ${pt(tail)}" stroke="${C.ink}" stroke-width="6.5" stroke-linecap="round"/><path d="M${pt(tip)} L ${pt(tail)}" stroke="${C.wood}" stroke-width="3.6" stroke-linecap="round"/>`;
  s += `<path d="M${f(tail[0] - 3)} ${f(tail[1] - 4)} Q ${f(tail[0] + 15)} ${f(tail[1] - 11)} ${f(tail[0] + 14)} ${f(tail[1] + 9)} Q ${f(tail[0] + 4)} ${f(tail[1] + 17)} ${f(tail[0] - 4)} ${f(tail[1] + 7)} Z" fill="${C.soilDark}" ${stroke(1.8)}/>`;
  s += `<circle cx="${pivot[0]}" cy="${pivot[1]}" r="3" fill="${C.woodDark}" ${stroke(1.2)}/>`;
  return s;
}

/* ---------- Nilmesser ---------- */

/* Steinsäule mit Kerben. x = Mitte, yBottom = Fuß, yTop = Kopf.
   marks: { niedrig, gut, hoch } y-Werte; flood: y der alten Hochwassermarke */
export function nilometer({ x = 0, yBottom = 0, yTop = -300, marks = {}, old = null } = {}){
  const w = 22;
  let s = `<path d="M${x - w / 2} ${yBottom} L ${x - w / 2} ${yTop + 8} L ${x} ${yTop} L ${x + w / 2} ${yTop + 8} L ${x + w / 2} ${yBottom} Z" fill="${C.stone}" ${stroke(2)}/>`;
  for (let yy = yBottom - 15; yy > yTop + 14; yy -= 15) s += `<path d="M${x - w / 2} ${yy} l 7 0" stroke="${C.stoneDark}" stroke-width="1.6"/>`;
  const mark = (yy, col, label) => `<path d="M${x - w / 2 - 4} ${yy} L ${x + w / 2 + 4} ${yy}" stroke="${col}" stroke-width="3.2"/>` +
    (label ? `<text x="${x + w / 2 + 8}" y="${yy + 5}" class="nm-label" fill="${col}">${label}</text>` : "");
  if (marks.niedrig != null) s += mark(marks.niedrig, "#b8572a", marks.labels ? "zu wenig" : "");
  if (marks.gut != null) s += mark(marks.gut, "#3f7d2a", marks.labels ? "gut" : "");
  if (marks.hoch != null) s += mark(marks.hoch, "#b8572a", marks.labels ? "zu viel" : "");
  if (old != null) s += `<path d="M${x - 8} ${old} l 16 0 M ${x - 5} ${old - 4} l 10 0" stroke="${C.ink}" stroke-width="1.6"/>`;
  return s;
}

/* ---------- Himmel, Sirius, Sonne ---------- */

export function skyDefs(){
  return `<linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9d1dd"/><stop offset="1" stop-color="${C.skyLow}"/></linearGradient>
    <linearGradient id="skyHot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c4dcd8"/><stop offset="1" stop-color="#f6dfae"/></linearGradient>
    <linearGradient id="skyDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121c3d"/><stop offset=".55" stop-color="#3a3f6e"/><stop offset=".85" stop-color="#c77a5a"/><stop offset="1" stop-color="#f0b670"/></linearGradient>
    <radialGradient id="siriusGlow"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".35" stop-color="#cfe6ff" stop-opacity=".5"/><stop offset="1" stop-color="#cfe6ff" stop-opacity="0"/></radialGradient>
    <radialGradient id="sunGlow"><stop offset="0" stop-color="#fff6d8" stop-opacity=".9"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>`;
}

export function sirius(x, y){
  return `<circle cx="${x}" cy="${y}" r="30" fill="url(#siriusGlow)"/>
    <path d="M${x} ${y - 20} L ${x + 2.5} ${y - 2.5} L ${x + 20} ${y} L ${x + 2.5} ${y + 2.5} L ${x} ${y + 20} L ${x - 2.5} ${y + 2.5} L ${x - 20} ${y} L ${x - 2.5} ${y - 2.5} Z" fill="#fff"/>
    <circle cx="${x}" cy="${y}" r="4" fill="#fff"/>`;
}

export function stars(w, h, seed = 5){
  const r = rand(seed);
  let s = "";
  for (let i = 0; i < 60; i++) s += `<circle cx="${f(r() * w)}" cy="${f(r() * h)}" r="${f(0.6 + r() * 1.1)}" fill="#fff" opacity="${f(0.35 + r() * 0.5)}"/>`;
  return s;
}

export function sun(x, y){
  return `<circle cx="${x}" cy="${y}" r="46" fill="url(#sunGlow)"/><circle cx="${x}" cy="${y}" r="20" fill="#fff4cf" stroke="#f2d48a" stroke-width="2"/>`;
}

/* ---------- Kleine Symbole für die Oberfläche ---------- */

/* Schale: voll 0..1 */
export function bowl(fill = 1, size = 40){
  const s = size / 40;
  const g = fill <= 0 ? "" : `<path d="M${f(7 + (1 - fill) * 4)} ${f(19 - fill * 6)} Q 20 ${f(9 - fill * 8)} ${f(33 - (1 - fill) * 4)} ${f(19 - fill * 6)} Z" fill="${C.gold}" stroke="${C.goldDark}" stroke-width="1.2"/>`;
  return `<svg viewBox="0 0 40 32" width="${f(40 * s)}" height="${f(32 * s)}" aria-hidden="true">${g}
    <path d="M3 18 L 37 18 Q 35 30 20 30 Q 5 30 3 18 Z" fill="${C.brick}" ${stroke(2)}/>
    <path d="M8 23 Q 20 27 32 23" fill="none" stroke="${C.brickDark}" stroke-width="1.2"/></svg>`;
}

export function sack(size = 28){
  return `<svg viewBox="0 0 28 32" width="${size}" height="${f(size * 32 / 28)}" aria-hidden="true">
    <path d="M8 6 L 20 6 L 18 10 Q 26 15 25 24 Q 24 30 14 30 Q 4 30 3 24 Q 2 15 10 10 Z" fill="${C.linenShade}" ${stroke(1.8)}/>
    <path d="M9 6 Q 14 2 19 6" fill="none" ${stroke(1.6)}/><path d="M10 10 L 18 10" stroke="${C.goldDark}" stroke-width="2"/></svg>`;
}

export function jar(size = 28){
  return `<svg viewBox="0 0 28 36" width="${size}" height="${f(size * 36 / 28)}" aria-hidden="true">
    <path d="M9 4 L 19 4 L 18 9 Q 26 14 24 24 Q 22 33 14 34 Q 6 33 4 24 Q 2 14 10 9 Z" fill="${C.brick}" ${stroke(1.8)}/>
    <path d="M8 4 L 20 4" ${stroke(2.6)}/><path d="M6 18 Q 14 21 22 18" fill="none" stroke="${C.brickDark}" stroke-width="1.4"/></svg>`;
}

/* ---------- Berufe ---------- */

export function potter({ x = 0, y = 0, n = 2 } = {}){
  return `<path d="M${x - 14} ${y} L ${x - 14} ${y - 15} L ${x + 2} ${y - 15} L ${x + 2} ${y} " fill="none" stroke="${C.woodDark}" stroke-width="3"/>
    ${person({ x: x - 6, y: y - 0, pose: "sitzen", n })}
    <path d="M${x + 22} ${y} L ${x + 26} ${y - 16} L ${x + 34} ${y - 16} L ${x + 38} ${y} Z" fill="${C.wood}" ${stroke(1.6)}/>
    <ellipse cx="${x + 30}" cy="${y - 17}" rx="14" ry="3" fill="${C.woodDark}" ${stroke(1.4)}/>
    <path d="M${x + 24} ${y - 19} Q ${x + 21} ${y - 30} ${x + 26} ${y - 36} L ${x + 34} ${y - 36} Q ${x + 39} ${y - 30} ${x + 36} ${y - 19} Z" fill="${C.brick}" ${stroke(1.6)}/>
    ${[0, 1, 2].map(i => `<g transform="translate(${x + 48 + i * 15} ${y - 2})"><path d="M-5 -14 L 5 -14 Q 9 -6 6 0 L -6 0 Q -9 -6 -5 -14 Z" fill="${C.brick}" ${stroke(1.3)}/></g>`).join("")}`;
}

export function weaver({ x = 0, y = 0, n = 3 } = {}){
  // senkrechter Webrahmen mit Fäden
  let threads = "";
  for (let i = 0; i < 7; i++) threads += `<path d="M${x + 30 + i * 5} ${y - 58} L ${x + 30 + i * 5} ${y - 4}" stroke="${C.linenShade}" stroke-width="1"/>`;
  return `${person({ x: x + 6, y, pose: "spinnen", n })}
    <path d="M${x + 26} ${y} L ${x + 26} ${y - 62} M ${x + 66} ${y} L ${x + 66} ${y - 62}" stroke="${C.woodDark}" stroke-width="3.4"/>
    <path d="M${x + 22} ${y - 60} L ${x + 70} ${y - 60} M ${x + 24} ${y - 4} L ${x + 68} ${y - 4}" stroke="${C.wood}" stroke-width="3.4"/>
    ${threads}
    <path d="M${x + 28} ${y - 40} L ${x + 64} ${y - 40} L ${x + 64} ${y - 6} L ${x + 28} ${y - 6} Z" fill="${C.linen}" ${stroke(1.2)}/>
    <path d="M${x + 28} ${y - 30} L ${x + 64} ${y - 30} M ${x + 28} ${y - 20} L ${x + 64} ${y - 20}" stroke="${C.linenShade}" stroke-width="1"/>`;
}

export function surveyor({ x = 0, y = 0, n = 4 } = {}){
  return `${person({ x, y, pose: "seil", n })}
    <path d="M${x + 70} ${y + 2} L ${x + 72} ${y - 26}" stroke="${C.woodDark}" stroke-width="3.4" stroke-linecap="round"/>
    ${[0, 1, 2, 3].map(i => `<circle cx="${x + 24 + i * 12}" cy="${y - 25 + i * 1.4}" r="1.8" fill="${C.goldDark}"/>`).join("")}
    <path d="M${x + 86} ${y} L ${x + 90} ${y - 10} L ${x + 98} ${y - 10} L ${x + 102} ${y} Z" fill="${C.stone}" ${stroke(1.5)}/>`;
}

export function steward({ x = 0, y = 0, n = 5 } = {}){
  return `${person({ x, y, pose: "messen", n })}
    <g transform="translate(${x + 36} ${y})"><path d="M-8 -26 L 8 -26 L 6 -22 Q 14 -16 13 -8 Q 12 0 0 0 Q -12 0 -13 -8 Q -14 -16 -6 -22 Z" fill="${C.linenShade}" ${stroke(1.6)}/>
    <path d="M-7 -26 Q 0 -32 7 -26 Z" fill="${C.gold}" ${stroke(1.2)}/></g>
    <g transform="translate(${x + 60} ${y})"><path d="M-8 -26 L 8 -26 L 6 -22 Q 14 -16 13 -8 Q 12 0 0 0 Q -12 0 -13 -8 Q -14 -16 -6 -22 Z" fill="${C.linenShade}" ${stroke(1.6)}/></g>`;
}
