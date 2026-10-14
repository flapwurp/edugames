/* =====================================================================
   SCENE "BIRTHDAY PARTY" – what can be in the room, where it is and how it is drawn.
   No DOM access: everything returns SVG text, so it can be tested in Node.
   The words for this scene are in content.js (PARTY).
   ===================================================================== */
import { OL, ST, col, shade, r1, person, DRAW, SIZE, svgBox, thingIcon, activityIcon } from "./figures.js";

export const VIEW = { w: 1400, h: 800 };
export const HAT = "party";

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
   diffs: which kinds of difference are possible for this thing
   countWord: the word (in content.js) for what is counted, if it is not the thing itself */
const PEOPLE_COLOURS = ["blue", "yellow", "purple", "orange", "pink", "white"];
const HAT_COLOURS = ["blue", "yellow", "purple", "orange", "pink"];
export const ACTIVITIES = ["eating", "drinking", "reading", "guitar", "photo", "waving", "dancing"];

export const OBJECTS = [
  { id: "cake",     kind: "fixed",   colours: ["pink", "white", "yellow", "brown"], count: [2, 6], countWord: "candles", diffs: ["colour", "number"] },
  { id: "presents", kind: "fixed",   count: [1, 4], diffs: ["number"] },
  { id: "cups",     kind: "fixed",   count: [2, 5], diffs: ["number"] },
  { id: "balloons", kind: "fixed",   colours: ["blue", "yellow", "purple", "orange", "pink", "white"], count: [2, 5], diffs: ["colour", "number"] },
  { id: "sofa",     kind: "fixed",   colours: ["blue", "yellow", "purple", "orange", "grey", "brown"], diffs: ["colour"] },
  { id: "window",   kind: "weather", weathers: ["sun", "rain"], diffs: ["weather"] },
  { id: "girl",     kind: "person",  colours: PEOPLE_COLOURS, hats: HAT_COLOURS, diffs: ["activity", "colour", "hat", "hatColour"] },
  { id: "boy",      kind: "person",  colours: PEOPLE_COLOURS, hats: HAT_COLOURS, diffs: ["activity", "colour", "hat", "hatColour"] },
  { id: "clock",    kind: "fixed",   extra: true, colours: ["blue", "yellow", "black", "white", "orange"], diffs: ["missing", "colour"] },
  { id: "lamp",     kind: "fixed",   extra: true, colours: ["blue", "yellow", "purple", "orange", "white"], diffs: ["missing", "colour"] },
  { id: "bird",     kind: "fixed",   extra: true, colours: ["yellow", "black", "orange", "purple"], diffs: ["missing", "colour"] },
  { id: "rug",      kind: "fixed",   extra: true, colours: ["blue", "yellow", "purple", "orange", "pink"], diffs: ["missing", "colour"] },
  { id: "cat",      kind: "movable", extra: true, colours: ["black", "white", "orange", "grey"], diffs: ["missing", "place", "colour"] },
  { id: "dog",      kind: "movable", extra: true, colours: ["brown", "white", "black", "grey"], diffs: ["missing", "place", "colour"] },
  { id: "teddy",    kind: "movable", extra: true, colours: ["brown", "white", "yellow", "pink"], diffs: ["missing", "place", "colour"] },
  { id: "ball",     kind: "movable", extra: true, colours: ["blue", "yellow", "purple", "orange", "pink", "white"], diffs: ["missing", "place", "colour"] },
  { id: "car",      kind: "movable", extra: true, colours: ["blue", "yellow", "purple", "orange", "black", "white"], diffs: ["missing", "place", "colour"] }
];

/* Words with pictures in "More phrases" (keys in content.js) */
export const WORDLIST = ["cake", "candles", "presents", "cups", "balloons", "clock", "lamp", "bird", "rug", "sofa", "table",
  "window", "windowsill", "shelf", "plant", "cat", "dog", "teddy", "ball", "car", "girl", "boy", "hat"];

export const PEOPLE = { girl: { cx: 330, base: 772 }, boy: { cx: 915, base: 772 } };

const FIXED_BOX = {
  cake:     { x: 560,  y: 398, w: 150, h: 134 },
  presents: { x: 430,  y: 418, w: 146, h: 108 },
  cups:     { x: 700,  y: 478, w: 148, h: 48 },
  balloons: { x: 1165, y: 85,  w: 232, h: 305 },
  sofa:     { x: 972,  y: 418, w: 416, h: 290 },
  window:   { x: 48,   y: 78,  w: 284, h: 254 },
  clock:    { x: 412,  y: 112, w: 116, h: 116 },
  lamp:     { x: 560,  y: 96,  w: 140, h: 90 },
  bird:     { x: 226,  y: 142, w: 74,  h: 48 },
  rug:      { x: 440,  y: 752, w: 380, h: 42 }
};

/* Where a thing is in the picture (for tapping). null = not in the picture. */
export function boxOf(id, state){
  if (!state) return null;
  if (FIXED_BOX[id]) return { ...FIXED_BOX[id] };
  if (PEOPLE[id]) return { x: PEOPLE[id].cx - 66, y: PEOPLE[id].base - 365, w: 132, h: 365 };
  const s = SLOTS[state.slot], z = SIZE[id];
  return { x: s.x + z.dx, y: s.y - z.h, w: z.w, h: z.h };
}

/* ---------- room ---------- */
function room(){
  let s = `<rect width="1400" height="470" fill="#fdeedd"/>`;
  for (let x = 0; x < 1400; x += 70) s += `<rect x="${x}" width="35" height="470" fill="#f9e4cc"/>`;
  s += `<rect y="470" width="1400" height="330" fill="#d9b18a"/>
    <path d="M0 540H1400M0 620H1400M0 710H1400" stroke="#c39a72" stroke-width="3"/>
    <path d="M300 470V540M820 540V620M460 620V710M1100 710V800M120 710V800M1250 470V540" stroke="#c39a72" stroke-width="3"/>
    <rect y="462" width="1400" height="14" fill="#fff6e8" stroke="${OL}" stroke-width="2"/>`;
  s += `<path d="M350 20 Q870 76 1390 20" fill="none" stroke="${OL}" stroke-width="3"/>`;
  const flags = ["#2f6fd0", "#f5c518", "#7e4fc4", "#f08a24"];
  for (let i = 0; i < 15; i++){
    const t = (i + 0.5) / 15, u = 1 - t;
    const x = u * u * 350 + 2 * u * t * 870 + t * t * 1390, y = u * u * 20 + 2 * u * t * 76 + t * t * 20;
    s += `<path d="M${r1(x - 22)} ${r1(y)} L${r1(x + 22)} ${r1(y)} L${r1(x)} ${r1(y + 42)} Z" fill="${flags[i % 4]}" ${ST}/>`;
  }
  return s;
}

function windowSvg(state, birdState){
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
  if (birdState) s += bird(birdState);
  s += `<rect x="185" y="96" width="10" height="218" fill="#ffffff"/><rect x="66" y="200" width="248" height="10" fill="#ffffff"/>
    <rect x="66" y="96" width="248" height="218" fill="none" stroke="${OL}" stroke-width="2"/>
    <rect x="34" y="326" width="312" height="16" rx="3" fill="#ffffff" ${ST}/>`;
  return s;
}

/* a bird flying past outside the window */
function bird(state){
  const c = col(state.colour);
  return `<ellipse cx="270" cy="172" rx="24" ry="14" fill="${c}" ${ST}/>
    <circle cx="250" cy="160" r="11" fill="${c}" ${ST}/>
    <path d="M240 158 l-10 4 l10 3 z" fill="#f08a24" stroke="${OL}" stroke-width="1.5"/>
    <circle cx="248" cy="157" r="2.5" fill="${state.colour === "black" ? "#ffffff" : OL}"/>
    <path d="M266 168 Q282 146 296 156 Q286 170 270 176 Z" fill="${shade(state.colour, state.colour === "black" ? 0.3 : -0.2)}" stroke="${OL}" stroke-width="2"/>`;
}

function plant(){
  const leaves = [[-38, 600, -30], [38, 600, 30], [-20, 560, -12], [22, 556, 14], [0, 530, 0], [-46, 640, -55], [46, 640, 55]];
  const stems = leaves.map(([dx, y, rot]) => {
    const a = rot * Math.PI / 180, bx = 85 + dx - Math.sin(a) * 40, by = y + Math.cos(a) * 40;
    return `M85 656 Q${r1(85 + dx * 0.2)} ${r1((656 + by) / 2)} ${r1(bx)} ${r1(by)}`;
  }).join(" ");
  const shapes = leaves.map(([dx, y, rot]) => `<ellipse cx="${85 + dx}" cy="${y}" rx="18" ry="44" transform="rotate(${rot} ${85 + dx} ${y})"/>`).join("");
  return `<path d="${stems}" fill="none" stroke="#2f6b3a" stroke-width="10" stroke-linecap="round"/>
    <path d="${stems}" fill="none" stroke="#4f9d5b" stroke-width="5" stroke-linecap="round"/>
    <g fill="#4f9d5b" stroke="#2f6b3a" stroke-width="3">${shapes}</g>
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

function rug(state){
  const c = col(state.colour), d = shade(state.colour, -0.18);
  return `<ellipse cx="630" cy="773" rx="188" ry="20" fill="${c}" ${ST}/>
    <ellipse cx="630" cy="773" rx="140" ry="12" fill="none" stroke="${d}" stroke-width="5"/>`;
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

const MOVABLE = OBJECTS.filter(d => d.kind === "movable").map(d => d.id);
const movable = (id, st) => DRAW[id](SLOTS[st.slot].x, SLOTS[st.slot].y, st.colour);
const kid = (id, st) => person(id, st, PEOPLE[id].cx, PEOPLE[id].base, HAT);

/* ---------- whole picture ---------- */
export function drawPicture(p){
  const at = slots => MOVABLE.filter(id => p[id] && slots.includes(p[id].slot)).map(id => movable(id, p[id])).join("");
  return [
    room(),
    windowSvg(p.window, p.bird),
    plant(),
    p.clock ? clock(p.clock) : "",
    shelf(),
    at(["shelf", "windowsill"]),
    balloons(p.balloons),
    at(["behindSofa"]),
    sofa(p.sofa),
    at(["onSofa"]),
    p.lamp ? lamp(p.lamp) : "",
    p.rug ? rug(p.rug) : "",
    table(),
    cake(p.cake), presents(p.presents), cups(p.cups),
    at(["underTable", "plant"]),
    kid("girl", p.girl),
    kid("boy", p.boy),
    at(["frontSofa"])
  ].join("");
}

/* ---------- small pictures for the word list ---------- */
export function iconSVG(key){
  switch (key){
    case "cake": return svgBox(555, 395, 160, 140, cake({ colour: "pink", count: 3 }));
    case "candles": return svgBox(580, 395, 110, 64, cake({ colour: "pink", count: 3 }));
    case "presents": return svgBox(425, 410, 150, 115, presents({ count: 2 }));
    case "cups": return svgBox(700, 478, 70, 48, cups({ count: 2 }));
    case "balloons": return svgBox(1170, 90, 210, 390, balloons({ colour: "blue", count: 3 }));
    case "clock": return svgBox(410, 110, 120, 120, clock({ colour: "blue" }));
    case "lamp": return svgBox(555, 60, 150, 130, lamp({ colour: "yellow" }));
    case "bird": return svgBox(222, 136, 82, 56, bird({ colour: "yellow" }));
    case "rug": return svgBox(435, 745, 390, 56, rug({ colour: "orange" }));
    case "sofa": return svgBox(965, 410, 430, 300, sofa({ colour: "blue" }));
    case "table": return svgBox(400, 505, 460, 250, table());
    case "window": return svgBox(30, 75, 320, 270, windowSvg({ weather: "sun" }));
    case "windowsill": return svgBox(30, 290, 320, 56, windowSvg({ weather: "sun" }));
    case "shelf": return svgBox(730, 280, 350, 70, shelf());
    case "plant": return svgBox(25, 480, 130, 290, plant());
    case "hat": return svgBox(292, 402, 76, 90, person("girl", { colour: "pink", hat: "purple" }, 330, 772, HAT));
    case "girl": case "boy": return svgBox(225, 405, 210, 270, person(key, { colour: key === "girl" ? "pink" : "blue" }, 330, 772, HAT));
    default:
      if (DRAW[key]) return thingIcon(key);
      if (ACTIVITIES.includes(key)) return activityIcon(key, HAT);
      return "";
  }
}
