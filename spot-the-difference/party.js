/* =====================================================================
   SCENE "BIRTHDAY PARTY" – what can be in the room, where it is and how it is drawn.
   No DOM access: everything returns SVG text, so it can be tested in Node.
   The words for this scene are in content.js (PARTY).
   ===================================================================== */
import { COLOURS } from "./content.js";

export const VIEW = { w: 1400, h: 800 };

const OL = "#3d2f2a";                       // outline colour
const ST = `stroke="${OL}" stroke-width="3" stroke-linejoin="round"`;
const col = id => (COLOURS[id] ? COLOURS[id].c : id);

/* Places where small things can be. x/y = bottom centre of the thing. */
export const SLOTS = {
  windowsill: { x: 190,  y: 326, allow: ["cat", "teddy", "ball", "car"] },
  shelf:      { x: 900,  y: 290, allow: ["cat", "teddy", "ball", "car"] },
  plant:      { x: 180,  y: 772, allow: ["cat", "dog", "teddy", "ball", "car"] },
  underTable: { x: 630,  y: 748, allow: ["cat", "dog", "teddy", "ball", "car"] },
  onSofa:     { x: 1180, y: 556, allow: ["cat", "dog", "teddy", "ball", "car"] },
  behindSofa: { x: 1240, y: 440, allow: ["cat", "dog", "teddy", "ball"] },
  frontSofa:  { x: 1180, y: 792, allow: ["cat", "dog", "teddy", "ball", "car"] }
};

/* Everything that can be different.
   kind: fixed (always at the same place) · movable (sits in a slot) · person · weather
   extra: true = only in the room on bigger levels (and can be missing in one picture)
   diffs: which kinds of difference are possible for this thing */
const PEOPLE_COLOURS = ["blue", "yellow", "purple", "orange", "pink", "white"];
const HAT_COLOURS = ["blue", "yellow", "purple", "orange", "pink"];
export const ACTIVITIES = ["eating", "drinking", "reading", "guitar", "photo", "waving", "dancing"];

export const OBJECTS = [
  { id: "cake",     kind: "fixed",   colours: ["pink", "white", "yellow", "brown"], count: [2, 6], diffs: ["colour", "number"] },
  { id: "presents", kind: "fixed",   count: [1, 4], diffs: ["number"] },
  { id: "cups",     kind: "fixed",   count: [2, 5], diffs: ["number"] },
  { id: "balloons", kind: "fixed",   colours: ["blue", "yellow", "purple", "orange", "pink", "white"], count: [2, 5], diffs: ["colour", "number"] },
  { id: "sofa",     kind: "fixed",   colours: ["blue", "yellow", "purple", "orange", "grey", "brown"], diffs: ["colour"] },
  { id: "window",   kind: "weather", diffs: ["weather"] },
  { id: "girl",     kind: "person",  colours: PEOPLE_COLOURS, hats: HAT_COLOURS, diffs: ["activity", "colour", "hat", "hatColour"] },
  { id: "boy",      kind: "person",  colours: PEOPLE_COLOURS, hats: HAT_COLOURS, diffs: ["activity", "colour", "hat", "hatColour"] },
  { id: "clock",    kind: "fixed",   extra: true, colours: ["blue", "yellow", "black", "white", "orange"], diffs: ["missing", "colour"] },
  { id: "lamp",     kind: "fixed",   extra: true, colours: ["blue", "yellow", "purple", "orange", "white"], diffs: ["missing", "colour"] },
  { id: "cat",      kind: "movable", extra: true, colours: ["black", "white", "orange", "grey"], diffs: ["missing", "place", "colour"] },
  { id: "dog",      kind: "movable", extra: true, colours: ["brown", "white", "black", "grey"], diffs: ["missing", "place", "colour"] },
  { id: "teddy",    kind: "movable", extra: true, colours: ["brown", "white", "yellow", "pink"], diffs: ["missing", "place", "colour"] },
  { id: "ball",     kind: "movable", extra: true, colours: ["blue", "yellow", "purple", "orange", "pink", "white"], diffs: ["missing", "place", "colour"] },
  { id: "car",      kind: "movable", extra: true, colours: ["blue", "yellow", "purple", "orange", "black", "white"], diffs: ["missing", "place", "colour"] }
];

/* Size of the movable things (dx = left edge relative to the slot's x) */
const SIZE = {
  cat:   { dx: -50, w: 118, h: 96 },
  dog:   { dx: -72, w: 142, h: 86 },
  teddy: { dx: -40, w: 80,  h: 110 },
  ball:  { dx: -35, w: 70,  h: 68 },
  car:   { dx: -54, w: 108, h: 60 }
};
const PERSON_X = { girl: 330, boy: 915 };
const PERSON_BASE = 772;

const FIXED_BOX = {
  cake:     { x: 560,  y: 398, w: 150, h: 134 },
  presents: { x: 430,  y: 418, w: 146, h: 108 },
  cups:     { x: 700,  y: 478, w: 148, h: 48 },
  balloons: { x: 1165, y: 85,  w: 232, h: 305 },
  sofa:     { x: 972,  y: 418, w: 416, h: 290 },
  window:   { x: 48,   y: 78,  w: 284, h: 254 },
  clock:    { x: 412,  y: 112, w: 116, h: 116 },
  lamp:     { x: 560,  y: 96,  w: 140, h: 90 }
};

/* Where a thing is in the picture (for tapping). null = not in the picture. */
export function boxOf(id, state){
  if (!state) return null;
  if (FIXED_BOX[id]) return { ...FIXED_BOX[id] };
  if (PERSON_X[id] !== undefined) return { x: PERSON_X[id] - 66, y: PERSON_BASE - 365, w: 132, h: 365 };
  const s = SLOTS[state.slot], z = SIZE[id];
  return { x: s.x + z.dx, y: s.y - z.h, w: z.w, h: z.h };
}

/* ---------- drawing helpers ---------- */
function shade(hex, amt){
  const h = col(hex).replace("#", "");
  const n = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  return "#" + n.map(v => Math.round(v + (t - v) * p).toString(16).padStart(2, "0")).join("");
}
const r1 = n => Math.round(n * 10) / 10;

/* ---------- room ---------- */
function room(){
  let s = `<rect width="1400" height="470" fill="#fdeedd"/>`;
  for (let x = 0; x < 1400; x += 70) s += `<rect x="${x}" width="35" height="470" fill="#f9e4cc"/>`;
  s += `<rect y="470" width="1400" height="330" fill="#d9b18a"/>
    <path d="M0 540H1400M0 620H1400M0 710H1400" stroke="#c39a72" stroke-width="3"/>
    <path d="M300 470V540M820 540V620M460 620V710M1100 710V800M120 710V800M1250 470V540" stroke="#c39a72" stroke-width="3"/>
    <rect y="462" width="1400" height="14" fill="#fff6e8" stroke="${OL}" stroke-width="2"/>`;
  // bunting
  s += `<path d="M350 20 Q870 76 1390 20" fill="none" stroke="${OL}" stroke-width="3"/>`;
  const flags = ["#2f6fd0", "#f5c518", "#7e4fc4", "#f08a24"];
  for (let i = 0; i < 15; i++){
    const t = (i + 0.5) / 15, u = 1 - t;
    const x = u * u * 350 + 2 * u * t * 870 + t * t * 1390, y = u * u * 20 + 2 * u * t * 76 + t * t * 20;
    s += `<path d="M${r1(x - 22)} ${r1(y)} L${r1(x + 22)} ${r1(y)} L${r1(x)} ${r1(y + 42)} Z" fill="${flags[i % 4]}" ${ST}/>`;
  }
  return s;
}

function windowSvg(state){
  const sun = state.weather === "sun";
  let s = `<rect x="50" y="80" width="280" height="250" rx="6" fill="#ffffff" ${ST}/>
    <rect x="66" y="96" width="248" height="218" fill="${sun ? "#bfe3ff" : "#a7b6c6"}"/>`;
  if (sun){
    let rays = "";
    for (let i = 0; i < 8; i++){
      const a = i * Math.PI / 4;
      rays += `M${r1(125 + Math.cos(a) * 36)} ${r1(150 + Math.sin(a) * 36)}L${r1(125 + Math.cos(a) * 50)} ${r1(150 + Math.sin(a) * 50)}`;
    }
    s += `<path d="${rays}" stroke="#f0a500" stroke-width="5" stroke-linecap="round"/>
      <circle cx="125" cy="150" r="28" fill="#ffd23f" stroke="#e09a00" stroke-width="3"/>
      <g fill="#ffffff"><ellipse cx="250" cy="262" rx="34" ry="16"/><ellipse cx="272" cy="250" rx="22" ry="16"/></g>`;
  } else {
    let drops = "";
    for (let row = 0; row < 4; row++) for (let i = 0; i < 7; i++){
      const x = 80 + i * 34 + (row % 2) * 16, y = 180 + row * 34;
      drops += `M${x} ${y}l-6 16`;
    }
    s += `<g fill="#e6eaee" stroke="#8d98a5" stroke-width="2"><ellipse cx="120" cy="138" rx="42" ry="24"/><ellipse cx="170" cy="124" rx="40" ry="28"/><ellipse cx="226" cy="140" rx="46" ry="24"/><ellipse cx="272" cy="130" rx="32" ry="20"/></g>
      <path d="${drops}" stroke="#3f6fa8" stroke-width="4" stroke-linecap="round"/>`;
  }
  s += `<rect x="185" y="96" width="10" height="218" fill="#ffffff"/><rect x="66" y="200" width="248" height="10" fill="#ffffff"/>
    <rect x="66" y="96" width="248" height="218" fill="none" stroke="${OL}" stroke-width="2"/>
    <rect x="34" y="326" width="312" height="16" rx="3" fill="#ffffff" ${ST}/>`;
  return s;
}

function plant(){
  const leaves = [[-38, 600, -30], [38, 600, 30], [-20, 560, -12], [22, 556, 14], [0, 530, 0], [-46, 640, -55], [46, 640, 55]]
    .map(([dx, y, rot]) => `<ellipse cx="${85 + dx}" cy="${y}" rx="18" ry="44" transform="rotate(${rot} ${85 + dx} ${y})"/>`).join("");
  return `<g fill="#4f9d5b" stroke="#2f6b3a" stroke-width="3">${leaves}</g>
    <path d="M42 662 L128 662 L118 762 L52 762 Z" fill="#c8703c" ${ST}/>
    <rect x="34" y="650" width="102" height="18" rx="4" fill="#d9844f" ${ST}/>`;
}

function clock(state){
  let ticks = "";
  for (let i = 0; i < 12; i++){
    const a = i * Math.PI / 6;
    ticks += `M${r1(470 + Math.cos(a) * 34)} ${r1(170 + Math.sin(a) * 34)}L${r1(470 + Math.cos(a) * 40)} ${r1(170 + Math.sin(a) * 40)}`;
  }
  return `<circle cx="470" cy="170" r="54" fill="${col(state.colour)}" ${ST}/>
    <circle cx="470" cy="170" r="42" fill="#fffdf6" stroke="${OL}" stroke-width="2"/>
    <path d="${ticks}" stroke="${OL}" stroke-width="3"/>
    <path d="M470 170V140M470 170L492 180" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="470" cy="170" r="5" fill="${OL}"/>`;
}

function shelf(){
  return `<path d="M780 304 L780 340 L812 304 Z M1030 304 L1030 340 L998 304 Z" fill="#a8744a" ${ST}/>
    <rect x="740" y="290" width="330" height="14" rx="3" fill="#b9824f" ${ST}/>`;
}

function lamp(state){
  return `<path d="M630 0V112" stroke="${OL}" stroke-width="3"/>
    <path d="M598 110 L662 110 L694 172 L566 172 Z" fill="${col(state.colour)}" ${ST}/>
    <ellipse cx="630" cy="177" rx="16" ry="9" fill="#fff3b0" stroke="${OL}" stroke-width="2"/>`;
}

const BALLOON_POS = [[1235, 175], [1315, 140], [1330, 248], [1215, 282], [1292, 340]];
function balloons(state){
  const c = col(state.colour);
  let strings = "", bodies = "";
  for (let i = 0; i < state.count; i++){
    const [x, y] = BALLOON_POS[i];
    strings += `<path d="M${x} ${y + 46} Q${x} 420 1348 478" fill="none" stroke="${OL}" stroke-width="2"/>`;
    bodies += `<ellipse cx="${x}" cy="${y}" rx="36" ry="44" fill="${c}" ${ST}/>
      <path d="M${x - 6} ${y + 50} L${x + 6} ${y + 50} L${x} ${y + 42} Z" fill="${c}" ${ST}/>
      <ellipse cx="${x - 12}" cy="${y - 16}" rx="7" ry="12" fill="#ffffff" opacity=".55"/>`;
  }
  return strings + bodies;
}

function sofa(state){
  const c = col(state.colour), dark = shade(state.colour, -0.18), light = shade(state.colour, 0.12);
  return `<rect x="1000" y="420" width="360" height="150" rx="28" fill="${c}" ${ST}/>
    <rect x="1016" y="436" width="160" height="112" rx="20" fill="${light}" ${ST}/>
    <rect x="1186" y="436" width="160" height="112" rx="20" fill="${light}" ${ST}/>
    <rect x="1010" y="682" width="18" height="24" fill="${OL}"/><rect x="1332" y="682" width="18" height="24" fill="${OL}"/>
    <rect x="990" y="598" width="380" height="86" rx="14" fill="${dark}" ${ST}/>
    <rect x="996" y="552" width="368" height="56" rx="16" fill="${c}" ${ST}/>
    <rect x="972" y="478" width="64" height="206" rx="28" fill="${c}" ${ST}/>
    <rect x="1324" y="478" width="64" height="206" rx="28" fill="${c}" ${ST}/>`;
}

function table(){
  let dots = "";
  for (let x = 432; x < 850; x += 40) dots += `<circle cx="${x}" cy="536" r="6"/>`;
  return `<rect x="442" y="560" width="18" height="190" fill="#a8744a" ${ST}/>
    <rect x="800" y="560" width="18" height="190" fill="#a8744a" ${ST}/>
    <path d="M410 516 H850 V560 ${"a20 15 0 0 1 -40 0 ".repeat(11)}Z" fill="#ffffff" ${ST}/>
    <g fill="#9cc3f5">${dots}</g>`;
}

function cake(state){
  const c = col(state.colour);
  let candles = "";
  const n = state.count, left = 590, right = 680;
  for (let i = 0; i < n; i++){
    const x = n === 1 ? (left + right) / 2 : left + (right - left) * i / (n - 1);
    candles += `<rect x="${r1(x - 4)}" y="420" width="8" height="32" rx="2" fill="#ffffff" stroke="${OL}" stroke-width="2"/>
      <path d="M${r1(x - 4)} 430 l8 -5 M${r1(x - 4)} 440 l8 -5" stroke="#2f6fd0" stroke-width="2"/>
      <ellipse cx="${r1(x)}" cy="410" rx="5" ry="9" fill="#ffb627" stroke="#e07b00" stroke-width="1.5"/>`;
  }
  return `<ellipse cx="635" cy="518" rx="76" ry="11" fill="#ffffff" ${ST}/>
    <rect x="575" y="458" width="120" height="58" rx="8" fill="#f3d9a4" ${ST}/>
    <path d="M573 470 Q573 450 593 450 H677 Q697 450 697 470 V476 Q687 488 677 476 Q667 488 657 476 Q647 488 637 476 Q627 488 617 476 Q607 488 597 476 Q587 488 573 476 Z" fill="${c}" ${ST}/>
    ${candles}`;
}

const PRESENT_POS = [
  { x: 438, y: 468, w: 62, h: 50, c: "#2f6fd0" }, { x: 504, y: 468, w: 62, h: 50, c: "#f5c518" },
  { x: 447, y: 428, w: 46, h: 40, c: "#7e4fc4" }, { x: 513, y: 428, w: 46, h: 40, c: "#f08a24" }
];
function presents(state){
  return PRESENT_POS.slice(0, state.count).map(p => {
    const cx = p.x + p.w / 2;
    return `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="3" fill="${p.c}" ${ST}/>
      <rect x="${cx - 4}" y="${p.y}" width="8" height="${p.h}" fill="#ffffff"/>
      <rect x="${p.x}" y="${p.y + p.h / 2 - 4}" width="${p.w}" height="8" fill="#ffffff"/>
      <ellipse cx="${cx - 8}" cy="${p.y - 4}" rx="9" ry="6" fill="#ffffff" stroke="${OL}" stroke-width="2"/>
      <ellipse cx="${cx + 8}" cy="${p.y - 4}" rx="9" ry="6" fill="#ffffff" stroke="${OL}" stroke-width="2"/>`;
  }).join("");
}

function cups(state){
  let s = "";
  for (let i = 0; i < state.count; i++){
    const x = 712 + i * 27;
    s += `<path d="M${x} 486 H${x + 22} L${x + 19} 518 H${x + 3} Z" fill="#ffffff" ${ST}/>
      <rect x="${x + 1}" y="494" width="20" height="7" fill="#7e4fc4"/>`;
  }
  return s;
}

/* ---------- people ---------- */
function arm(sx, sy, ex, ey, hx, hy, skin, sleeve){
  return `<path d="M${sx} ${sy} L${ex} ${ey} L${hx} ${hy}" fill="none" stroke="${OL}" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${sx} ${sy} L${ex} ${ey} L${hx} ${hy}" fill="none" stroke="${skin}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${sx} ${sy} L${r1(sx + (ex - sx) * 0.45)} ${r1(sy + (ey - sy) * 0.45)}" stroke="${sleeve}" stroke-width="18" stroke-linecap="round"/>
    <circle cx="${hx}" cy="${hy}" r="9" fill="${skin}" stroke="${OL}" stroke-width="2.5"/>`;
}

export function person(id, state, cx = PERSON_X[id], B = PERSON_BASE){
  const girl = id === "girl";
  const skin = girl ? "#f1c7a3" : "#c98f66", hair = girl ? "#6b3f1f" : "#2b2523";
  const c = col(state.colour);
  const X = d => cx + d, Y = d => B - d;
  let s = "";
  if (girl) s += `<path d="M${X(-44)} ${Y(258)} Q${X(-54)} ${Y(160)} ${X(-30)} ${Y(172)} L${X(30)} ${Y(172)} Q${X(54)} ${Y(160)} ${X(44)} ${Y(258)} Z" fill="${hair}" ${ST}/>`;
  s += `<ellipse cx="${X(-18)}" cy="${Y(6)}" rx="16" ry="8" fill="#3b3b3b"/><ellipse cx="${X(18)}" cy="${Y(6)}" rx="16" ry="8" fill="#3b3b3b"/>`;
  if (girl){
    s += `<rect x="${X(-20)}" y="${Y(100)}" width="12" height="94" fill="${skin}" stroke="${OL}" stroke-width="2"/>
      <rect x="${X(8)}" y="${Y(100)}" width="12" height="94" fill="${skin}" stroke="${OL}" stroke-width="2"/>
      <path d="M${X(-30)} ${Y(205)} L${X(30)} ${Y(205)} L${X(58)} ${Y(95)} L${X(-58)} ${Y(95)} Z" fill="${c}" ${ST}/>`;
  } else {
    s += `<rect x="${X(-30)}" y="${Y(112)}" width="26" height="106" fill="#3d5a80" ${ST}/>
      <rect x="${X(4)}" y="${Y(112)}" width="26" height="106" fill="#3d5a80" ${ST}/>
      <rect x="${X(-34)}" y="${Y(124)}" width="68" height="30" fill="#3d5a80" ${ST}/>
      <path d="M${X(-38)} ${Y(205)} H${X(38)} L${X(40)} ${Y(115)} H${X(-40)} Z" fill="${c}" ${ST}/>`;
  }
  s += `<rect x="${X(-8)}" y="${Y(222)}" width="16" height="20" fill="${skin}"/>
    <circle cx="${cx}" cy="${Y(252)}" r="40" fill="${skin}" ${ST}/>`;
  s += girl
    ? `<path d="M${X(-41)} ${Y(254)} A41 41 0 0 1 ${X(41)} ${Y(254)} Q${X(8)} ${Y(276)} ${X(-41)} ${Y(254)} Z" fill="${hair}" ${ST}/>`
    : `<path d="M${X(-41)} ${Y(258)} A41 41 0 0 1 ${X(41)} ${Y(258)} Q${cx} ${Y(282)} ${X(-41)} ${Y(258)} Z" fill="${hair}" ${ST}/>`;
  if (state.activity !== "photo"){
    s += `<circle cx="${X(-14)}" cy="${Y(250)}" r="4" fill="${OL}"/><circle cx="${X(14)}" cy="${Y(250)}" r="4" fill="${OL}"/>
      <circle cx="${X(-24)}" cy="${Y(236)}" r="7" fill="#f08a8a" opacity=".35"/><circle cx="${X(24)}" cy="${Y(236)}" r="7" fill="#f08a8a" opacity=".35"/>`;
  }
  if (state.activity !== "drinking") s += `<path d="M${X(-12)} ${Y(232)} Q${cx} ${Y(222)} ${X(12)} ${Y(232)}" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>`;
  if (state.hat){
    const h = col(state.hat);
    s += `<path d="M${X(-26)} ${Y(284)} L${X(26)} ${Y(284)} L${X(6)} ${Y(352)} Z" fill="${h}" ${ST}/>
      <path d="M${X(-17)} ${Y(306)} L${X(20)} ${Y(306)} M${X(-8)} ${Y(330)} L${X(13)} ${Y(330)}" stroke="#ffffff" stroke-width="5"/>
      <circle cx="${X(6)}" cy="${Y(355)}" r="8" fill="#ffffff" stroke="${OL}" stroke-width="2"/>`;
  }
  const L = [X(-34), Y(198)], R = [X(34), Y(198)];
  const A = (sh, e, h) => arm(sh[0], sh[1], e[0], e[1], h[0], h[1], skin, c);
  const downL = A(L, [X(-46), Y(160)], [X(-50), Y(116)]), downR = A(R, [X(46), Y(160)], [X(50), Y(116)]);
  switch (state.activity){
    case "eating":
      s += A(L, [X(-50), Y(160)], [X(-22), Y(150)]) + A(R, [X(52), Y(172)], [X(18), Y(222)]);
      s += `<ellipse cx="${X(-22)}" cy="${Y(146)}" rx="32" ry="7" fill="#ffffff" stroke="${OL}" stroke-width="2.5"/>
        <path d="M${X(-40)} ${Y(150)} L${X(-6)} ${Y(150)} L${X(-30)} ${Y(174)} Z" fill="#f3d9a4" stroke="${OL}" stroke-width="2"/>
        <path d="M${X(-40)} ${Y(150)} L${X(-30)} ${Y(174)}" stroke="#f49ac2" stroke-width="5"/>
        <path d="M${X(18)} ${Y(222)} L${X(8)} ${Y(242)}" stroke="#8a8f96" stroke-width="4" stroke-linecap="round"/>`;
      break;
    case "drinking":
      s += downL + A(R, [X(52), Y(172)], [X(16), Y(222)]);
      s += `<rect x="${X(4)}" y="${Y(252)}" width="22" height="34" rx="3" fill="#fff3a0" opacity=".95" stroke="${OL}" stroke-width="2.5"/>
        <path d="M${X(12)} ${Y(252)} L${X(6)} ${Y(266)}" stroke="#f49ac2" stroke-width="3"/>`;
      break;
    case "reading":
      s += A(L, [X(-52), Y(166)], [X(-34), Y(146)]) + A(R, [X(52), Y(166)], [X(34), Y(146)]);
      s += `<path d="M${cx} ${Y(184)} L${X(-50)} ${Y(176)} L${X(-50)} ${Y(124)} L${cx} ${Y(132)} L${X(50)} ${Y(124)} L${X(50)} ${Y(176)} Z" fill="#2f6fd0" ${ST}/>
        <path d="M${cx} ${Y(178)} L${X(-44)} ${Y(170)} L${X(-44)} ${Y(130)} L${cx} ${Y(136)} L${X(44)} ${Y(130)} L${X(44)} ${Y(170)} Z" fill="#ffffff" stroke="${OL}" stroke-width="2"/>
        <path d="M${cx} ${Y(178)} V${Y(136)} M${X(-36)} ${Y(162)} L${X(-8)} ${Y(165)} M${X(-36)} ${Y(150)} L${X(-8)} ${Y(153)} M${X(8)} ${Y(165)} L${X(36)} ${Y(162)} M${X(8)} ${Y(153)} L${X(36)} ${Y(150)}" stroke="#8a8f96" stroke-width="2"/>`;
      break;
    case "guitar":
      s += `<path d="M${X(-8)} ${Y(150)} L${X(-72)} ${Y(214)}" stroke="#7a4a25" stroke-width="11" stroke-linecap="round"/>
        <rect x="${X(-88)}" y="${Y(232)}" width="22" height="16" rx="3" fill="#7a4a25" transform="rotate(-45 ${X(-77)} ${Y(224)})"/>
        <circle cx="${X(-6)}" cy="${Y(152)}" r="22" fill="#c97b3a" ${ST}/>
        <circle cx="${X(12)}" cy="${Y(130)}" r="28" fill="#c97b3a" ${ST}/>
        <circle cx="${X(2)}" cy="${Y(142)}" r="8" fill="#5a3518"/>`;
      s += A(L, [X(-62), Y(172)], [X(-62), Y(206)]) + A(R, [X(52), Y(164)], [X(14), Y(138)]);
      break;
    case "photo":
      s += A(L, [X(-56), Y(186)], [X(-36), Y(244)]) + A(R, [X(56), Y(186)], [X(36), Y(244)]);
      s += `<rect x="${X(-36)}" y="${Y(274)}" width="72" height="44" rx="7" fill="#4a4f57" ${ST}/>
        <rect x="${X(18)}" y="${Y(282)}" width="14" height="8" rx="2" fill="#4a4f57" stroke="${OL}" stroke-width="2"/>
        <circle cx="${cx}" cy="${Y(252)}" r="14" fill="#8ab4e8" stroke="#ffffff" stroke-width="4"/>`;
      break;
    case "waving":
      s += downL + A(R, [X(72), Y(232)], [X(76), Y(300)]);
      s += `<path d="M${X(96)} ${Y(318)} q8 16 0 32 M${X(108)} ${Y(312)} q10 22 0 44" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>`;
      break;
    case "dancing":
      s += A(L, [X(-72), Y(236)], [X(-70), Y(302)]) + A(R, [X(72), Y(236)], [X(70), Y(302)]);
      break;
    default:
      s += downL + downR;
  }
  return s;
}

/* ---------- movable things (x/y = bottom centre) ---------- */
const DRAW = {
  cat(x, y, colour){
    const c = col(colour), eye = ["black", "grey"].includes(colour) ? "#f5c518" : OL;
    return `<path d="M${x + 34} ${y - 12} Q${x + 70} ${y - 20} ${x + 58} ${y - 62}" fill="none" stroke="${OL}" stroke-width="15" stroke-linecap="round"/>
      <path d="M${x + 34} ${y - 12} Q${x + 70} ${y - 20} ${x + 58} ${y - 62}" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="${x + 8}" cy="${y - 32}" rx="38" ry="30" fill="${c}" ${ST}/>
      <ellipse cx="${x - 10}" cy="${y - 5}" rx="11" ry="6" fill="${c}" ${ST}/><ellipse cx="${x + 14}" cy="${y - 5}" rx="11" ry="6" fill="${c}" ${ST}/>
      <path d="M${x - 40} ${y - 70} L${x - 38} ${y - 94} L${x - 22} ${y - 80} Z M${x - 14} ${y - 80} L${x + 2} ${y - 94} L${x + 2} ${y - 70} Z" fill="${c}" ${ST}/>
      <circle cx="${x - 18}" cy="${y - 62}" r="24" fill="${c}" ${ST}/>
      <circle cx="${x - 27}" cy="${y - 64}" r="3.5" fill="${eye}"/><circle cx="${x - 9}" cy="${y - 64}" r="3.5" fill="${eye}"/>
      <path d="M${x - 21} ${y - 55} h6 l-3 4 z" fill="#f49ac2"/>
      <path d="M${x - 30} ${y - 52} h-18 M${x - 30} ${y - 48} l-16 5 M${x - 6} ${y - 52} h18 M${x - 6} ${y - 48} l16 5" stroke="${eye === OL ? OL : "#dddddd"}" stroke-width="1.5"/>`;
  },
  dog(x, y, colour){
    const c = col(colour), ear = shade(colour, colour === "black" ? 0.25 : -0.3);
    return `<path d="M${x + 46} ${y - 50} Q${x + 70} ${y - 60} ${x + 62} ${y - 80}" fill="none" stroke="${OL}" stroke-width="12" stroke-linecap="round"/>
      <path d="M${x + 46} ${y - 50} Q${x + 70} ${y - 60} ${x + 62} ${y - 80}" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
      ${[-32, -14, 18, 34].map(d => `<rect x="${x + d}" y="${y - 30}" width="11" height="30" rx="4" fill="${c}" ${ST}/>`).join("")}
      <ellipse cx="${x + 6}" cy="${y - 42}" rx="48" ry="23" fill="${c}" ${ST}/>
      <circle cx="${x - 40}" cy="${y - 62}" r="22" fill="${c}" ${ST}/>
      <ellipse cx="${x - 58}" cy="${y - 54}" rx="13" ry="10" fill="${c}" ${ST}/>
      <circle cx="${x - 69}" cy="${y - 57}" r="5" fill="${OL}"/>
      <ellipse cx="${x - 28}" cy="${y - 64}" rx="9" ry="17" fill="${ear}" ${ST} transform="rotate(15 ${x - 28} ${y - 64})"/>
      <circle cx="${x - 46}" cy="${y - 68}" r="3.5" fill="${colour === "black" ? "#ffffff" : OL}"/>`;
  },
  teddy(x, y, colour){
    const c = col(colour), l = shade(colour, 0.35);
    return `<ellipse cx="${x - 18}" cy="${y - 12}" rx="14" ry="12" fill="${c}" ${ST}/><ellipse cx="${x + 18}" cy="${y - 12}" rx="14" ry="12" fill="${c}" ${ST}/>
      <ellipse cx="${x - 27}" cy="${y - 46}" rx="9" ry="15" fill="${c}" ${ST}/><ellipse cx="${x + 27}" cy="${y - 46}" rx="9" ry="15" fill="${c}" ${ST}/>
      <ellipse cx="${x}" cy="${y - 38}" rx="26" ry="30" fill="${c}" ${ST}/>
      <ellipse cx="${x}" cy="${y - 34}" rx="14" ry="16" fill="${l}"/>
      <circle cx="${x - 18}" cy="${y - 100}" r="9" fill="${c}" ${ST}/><circle cx="${x + 18}" cy="${y - 100}" r="9" fill="${c}" ${ST}/>
      <circle cx="${x}" cy="${y - 84}" r="22" fill="${c}" ${ST}/>
      <ellipse cx="${x}" cy="${y - 77}" rx="10" ry="7" fill="${l}"/>
      <circle cx="${x}" cy="${y - 80}" r="3.5" fill="${OL}"/>
      <circle cx="${x - 8}" cy="${y - 90}" r="3" fill="${OL}"/><circle cx="${x + 8}" cy="${y - 90}" r="3" fill="${OL}"/>`;
  },
  ball(x, y, colour){
    const stripe = colour === "white" ? "#2f6fd0" : "#ffffff";
    return `<circle cx="${x}" cy="${y - 33}" r="32" fill="${col(colour)}" ${ST}/>
      <path d="M${x - 31} ${y - 40} Q${x} ${y - 14} ${x + 31} ${y - 40} M${x - 6} ${y - 64} Q${x + 16} ${y - 33} ${x - 6} ${y - 2}" fill="none" stroke="${stripe}" stroke-width="6"/>
      <circle cx="${x}" cy="${y - 33}" r="32" fill="none" stroke="${OL}" stroke-width="3"/>`;
  },
  car(x, y, colour){
    const c = col(colour);
    return `<path d="M${x - 28} ${y - 38} L${x - 15} ${y - 58} L${x + 18} ${y - 58} L${x + 31} ${y - 38} Z" fill="${c}" ${ST}/>
      <path d="M${x - 18} ${y - 40} L${x - 10} ${y - 52} L${x + 14} ${y - 52} L${x + 22} ${y - 40} Z" fill="#cfe6ff" stroke="${OL}" stroke-width="2"/>
      <rect x="${x - 52}" y="${y - 42}" width="104" height="26" rx="9" fill="${c}" ${ST}/>
      <circle cx="${x - 44}" cy="${y - 31}" r="4" fill="#fff3b0" stroke="${OL}" stroke-width="1.5"/>
      <circle cx="${x - 28}" cy="${y - 14}" r="13" fill="#333333" ${ST}/><circle cx="${x - 28}" cy="${y - 14}" r="5" fill="#cccccc"/>
      <circle cx="${x + 28}" cy="${y - 14}" r="13" fill="#333333" ${ST}/><circle cx="${x + 28}" cy="${y - 14}" r="5" fill="#cccccc"/>`;
  }
};
const movable = (id, st) => DRAW[id](SLOTS[st.slot].x, SLOTS[st.slot].y, st.colour);

/* ---------- whole picture ---------- */
export function drawPicture(p){
  const at = slots => Object.keys(DRAW).filter(id => p[id] && slots.includes(p[id].slot)).map(id => movable(id, p[id])).join("");
  return [
    room(),
    windowSvg(p.window),
    plant(),
    p.clock ? clock(p.clock) : "",
    shelf(),
    at(["shelf", "windowsill"]),
    balloons(p.balloons),
    at(["behindSofa"]),
    sofa(p.sofa),
    at(["onSofa"]),
    p.lamp ? lamp(p.lamp) : "",
    table(),
    cake(p.cake), presents(p.presents), cups(p.cups),
    at(["underTable", "plant"]),
    person("girl", p.girl),
    person("boy", p.boy),
    at(["frontSofa"])
  ].join("");
}

/* ---------- small pictures for the word list ---------- */
const box = (x, y, w, h, inner) => `<svg viewBox="${x} ${y} ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
export function iconSVG(key){
  switch (key){
    case "cake": return box(555, 395, 160, 140, cake({ colour: "pink", count: 3 }));
    case "candles": return box(580, 395, 110, 64, cake({ colour: "pink", count: 3 }));
    case "presents": return box(425, 410, 150, 115, presents({ count: 2 }));
    case "cups": return box(700, 478, 70, 48, cups({ count: 2 }));
    case "balloons": return box(1170, 90, 210, 390, balloons({ colour: "blue", count: 3 }));
    case "clock": return box(410, 110, 120, 120, clock({ colour: "blue" }));
    case "lamp": return box(555, 60, 150, 130, lamp({ colour: "yellow" }));
    case "sofa": return box(965, 410, 430, 300, sofa({ colour: "blue" }));
    case "table": return box(400, 505, 460, 250, table());
    case "window": return box(30, 75, 320, 270, windowSvg({ weather: "sun" }));
    case "windowsill": return box(30, 290, 320, 56, windowSvg({ weather: "sun" }));
    case "shelf": return box(730, 280, 350, 70, shelf());
    case "plant": return box(25, 480, 130, 290, plant());
    case "hat": return box(292, 402, 76, 90, person("girl", { colour: "pink", hat: "purple" }, 330, 772));
    case "girl": case "boy": return box(225, 405, 210, 270, person(key, { colour: key === "girl" ? "pink" : "blue" }, 330, 772));
    default:
      if (DRAW[key]){
        const z = SIZE[key];
        return box(z.dx - 8, -z.h - 8, z.w + 16, z.h + 16, DRAW[key](0, 0, { cat: "orange", dog: "brown", teddy: "brown", ball: "blue", car: "yellow" }[key]));
      }
      if (ACTIVITIES.includes(key)) return box(220, 405, 220, 270, person("boy", { colour: "yellow", activity: key }, 330, 772));
      return "";
  }
}
