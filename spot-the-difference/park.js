/* =====================================================================
   SCENE "IN THE PARK" – what can be in the park, where it is and how it is drawn.
   No DOM access: everything returns SVG text, so it can be tested in Node.
   The words for this scene are in content.js (PARK).
   ===================================================================== */
import { OL, ST, col, shade, r1, person, DRAW, SIZE, svgBox, thingIcon, activityIcon } from "./figures.js";

export const VIEW = { w: 1400, h: 800 };
export const HAT = "cap";

/* Places where small things can be. x/y = bottom centre of the thing. */
export const SLOTS = {
  inTree:     { x: 300,  y: 286, allow: ["cat", "ball", "bag"] },
  underTree:  { x: 290,  y: 664, allow: ["cat", "dog", "ball", "skateboard", "bag"] },
  onBench:    { x: 695,  y: 510, allow: ["cat", "dog", "ball", "skateboard", "bag"] },
  underBench: { x: 695,  y: 602, allow: ["ball", "skateboard"] },
  nextBench:  { x: 880,  y: 606, allow: ["cat", "ball", "skateboard", "bag"] },
  onBlanket:  { x: 690,  y: 768, allow: ["cat", "dog", "ball", "bag"] },
  frontPond:  { x: 1200, y: 770, allow: ["cat", "dog", "ball", "skateboard", "bag"] }
};

const PEOPLE_COLOURS = ["blue", "yellow", "purple", "orange", "pink", "white"];
const HAT_COLOURS = ["blue", "yellow", "purple", "orange", "pink", "black"];
export const ACTIVITIES = ["icecream", "music", "reading", "photo", "waving", "drinking", "guitar"];

export const OBJECTS = [
  { id: "bench",      kind: "fixed",   colours: ["brown", "blue", "yellow", "orange", "white"], diffs: ["colour"] },
  { id: "blanket",    kind: "fixed",   colours: ["blue", "yellow", "purple", "orange", "pink"], diffs: ["colour"] },
  { id: "flowers",    kind: "fixed",   colours: ["blue", "yellow", "purple", "pink", "white"], count: [2, 6], diffs: ["colour", "number"] },
  { id: "birds",      kind: "fixed",   count: [1, 4], diffs: ["number"] },
  { id: "ducks",      kind: "fixed",   count: [1, 4], diffs: ["number"] },
  { id: "sky",        kind: "weather", weathers: ["sun", "cloudy"], diffs: ["weather"] },
  { id: "girl",       kind: "person",  colours: PEOPLE_COLOURS, hats: HAT_COLOURS, diffs: ["activity", "colour", "hat", "hatColour"] },
  { id: "boy",        kind: "person",  colours: PEOPLE_COLOURS, hats: HAT_COLOURS, diffs: ["activity", "colour", "hat", "hatColour"] },
  { id: "kite",       kind: "fixed",   extra: true, colours: ["blue", "yellow", "purple", "orange", "pink"], diffs: ["missing", "colour"] },
  { id: "basket",     kind: "fixed",   extra: true, diffs: ["missing"] },
  { id: "bin",        kind: "fixed",   extra: true, colours: ["blue", "yellow", "orange", "black", "grey"], diffs: ["missing", "colour"] },
  { id: "cat",        kind: "movable", extra: true, colours: ["black", "white", "orange", "grey"], diffs: ["missing", "place", "colour"] },
  { id: "dog",        kind: "movable", extra: true, colours: ["brown", "white", "black", "grey"], diffs: ["missing", "place", "colour"] },
  { id: "ball",       kind: "movable", extra: true, colours: ["blue", "yellow", "purple", "orange", "pink", "white"], diffs: ["missing", "place", "colour"] },
  { id: "skateboard", kind: "movable", extra: true, colours: ["blue", "yellow", "purple", "orange", "black"], diffs: ["missing", "place", "colour"] },
  { id: "bag",        kind: "movable", extra: true, colours: ["blue", "yellow", "purple", "orange", "black", "pink"], diffs: ["missing", "place", "colour"] }
];

export const WORDLIST = ["tree", "bench", "bin", "blanket", "basket", "pond", "ducks", "birds", "kite", "flowers", "sky",
  "cat", "dog", "ball", "skateboard", "bag", "girl", "boy", "hat"];

export const PEOPLE = { girl: { cx: 440, base: 690 }, boy: { cx: 1010, base: 720 } };

const FIXED_BOX = {
  bench:   { x: 555,  y: 430, w: 280, h: 176 },
  blanket: { x: 420,  y: 716, w: 386, h: 80 },
  flowers: { x: 12,   y: 660, w: 182, h: 108 },
  birds:   { x: 790,  y: 62,  w: 246, h: 86 },
  ducks:   { x: 1076, y: 556, w: 308, h: 110 },
  sky:     { x: 1150, y: 30,  w: 236, h: 170 },
  kite:    { x: 548,  y: 50,  w: 140, h: 190 },
  basket:  { x: 456,  y: 704, w: 92,  h: 70 },
  bin:     { x: 504,  y: 530, w: 54,  h: 78 }
};

export function boxOf(id, state){
  if (!state) return null;
  if (FIXED_BOX[id]) return { ...FIXED_BOX[id] };
  if (PEOPLE[id]) return { x: PEOPLE[id].cx - 66, y: PEOPLE[id].base - 335, w: 132, h: 335 };
  const s = SLOTS[state.slot], z = SIZE[id];
  return { x: s.x + z.dx, y: s.y - z.h, w: z.w, h: z.h };
}

/* ---------- landscape ---------- */
function land(sky){
  const sun = sky.weather === "sun";
  let s = `<rect width="1400" height="480" fill="${sun ? "#bfe3ff" : "#c8d2dc"}"/>
    <g fill="#ffffff" opacity=".9"><ellipse cx="380" cy="92" rx="48" ry="18"/><ellipse cx="410" cy="80" rx="30" ry="18"/></g>`;
  if (sun){
    let rays = "";
    for (let i = 0; i < 10; i++){
      const a = i * Math.PI / 5;
      rays += `M${r1(1260 + Math.cos(a) * 56)} ${r1(110 + Math.sin(a) * 56)}L${r1(1260 + Math.cos(a) * 76)} ${r1(110 + Math.sin(a) * 76)}`;
    }
    s += `<path d="${rays}" stroke="#f0a500" stroke-width="6" stroke-linecap="round"/>
      <circle cx="1260" cy="110" r="44" fill="#ffd23f" stroke="#e09a00" stroke-width="3"/>`;
  } else {
    s += `<g fill="#e6eaee" stroke="#8d98a5" stroke-width="3">
      <ellipse cx="1200" cy="120" rx="64" ry="36"/><ellipse cx="1290" cy="96" rx="74" ry="46"/><ellipse cx="1340" cy="140" rx="54" ry="34"/><ellipse cx="1240" cy="150" rx="70" ry="30"/></g>`;
  }
  s += `<path d="M0 440 Q330 360 720 430 Q1060 490 1400 410 V800 H0 Z" fill="#a8d98a"/>
    <path d="M0 490 Q500 450 1400 500 V800 H0 Z" fill="#8fcf6a"/>
    <path d="M860 800 Q880 640 780 520 Q770 500 800 494 L830 494 Q900 600 990 800 Z" fill="#ead6aa" stroke="#c9b07e" stroke-width="3"/>`;
  for (const [x, y] of [[620, 640], [1080, 720], [340, 760], [1330, 760], [560, 560], [940, 520]])
    s += `<path d="M${x} ${y} l6 -14 l6 14 M${x + 14} ${y} l5 -10 l5 10" fill="none" stroke="#5fa548" stroke-width="3" stroke-linecap="round"/>`;
  return s;
}

function tree(){
  const crown = [[110, 175, 92], [225, 120, 96], [305, 195, 80], [70, 265, 70], [190, 255, 92], [300, 270, 60]];
  return `<path d="M165 650 L175 300 L215 300 L222 650 Z" fill="#8b5a2b" ${ST}/>
    <g fill="#4f9d5b" stroke="#2f6b3a" stroke-width="3">${crown.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>
    <g fill="#5fae63">${crown.map(([x, y, r]) => `<circle cx="${x - r * 0.15}" cy="${y - r * 0.15}" r="${r * 0.75}"/>`).join("")}</g>
    <path d="M205 330 Q260 300 352 288" fill="none" stroke="${OL}" stroke-width="22" stroke-linecap="round"/>
    <path d="M205 330 Q260 300 352 288" fill="none" stroke="#8b5a2b" stroke-width="16" stroke-linecap="round"/>`;
}

const FLOWER_POS = [[52, 742], [86, 712], [120, 748], [152, 716], [30, 700], [176, 752]];
function flowers(state){
  const c = col(state.colour), mid = state.colour === "yellow" ? "#f08a24" : "#f5c518";
  return FLOWER_POS.slice(0, state.count).map(([x, y]) => {
    let petals = "";
    for (let i = 0; i < 5; i++){
      const a = i * Math.PI * 2 / 5 - Math.PI / 2;
      petals += `<circle cx="${r1(x + Math.cos(a) * 11)}" cy="${r1(y - 40 + Math.sin(a) * 11)}" r="9" fill="${c}" stroke="${OL}" stroke-width="2"/>`;
    }
    return `<path d="M${x} ${y} V${y - 36}" stroke="#2f6b3a" stroke-width="4"/>
      <ellipse cx="${x + 8}" cy="${y - 14}" rx="9" ry="4" fill="#4f9d5b" transform="rotate(-30 ${x + 8} ${y - 14})"/>
      ${petals}<circle cx="${x}" cy="${y - 40}" r="7" fill="${mid}" stroke="${OL}" stroke-width="2"/>`;
  }).join("");
}

const BIRD_POS = [[830, 110], [890, 80], [950, 128], [1006, 92]];
function birds(state){
  return BIRD_POS.slice(0, state.count).map(([x, y]) =>
    `<path d="M${x - 22} ${y - 6} Q${x - 10} ${y - 18} ${x} ${y} Q${x + 10} ${y - 18} ${x + 22} ${y - 6}" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
}

const DUCK_POS = [[1150, 612], [1232, 630], [1300, 600], [1206, 580]];
function pond(state){
  let s = `<ellipse cx="1230" cy="612" rx="156" ry="54" fill="#6fb3e0" ${ST}/>
    <path d="M1130 630 q16 -6 32 0 M1270 640 q16 -6 32 0 M1180 592 q14 -5 28 0" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
    <path d="M1372 600 l-6 -46 M1382 606 l4 -50 M1362 610 l-14 -38" stroke="#2f6b3a" stroke-width="4" stroke-linecap="round"/>
    <g fill="#7a4a25"><ellipse cx="1366" cy="552" rx="5" ry="12"/><ellipse cx="1386" cy="556" rx="5" ry="12"/></g>`;
  for (const [x, y] of DUCK_POS.slice(0, state.count)){
    s += `<ellipse cx="${x}" cy="${y}" rx="24" ry="13" fill="#f8f6f0" ${ST}/>
      <path d="M${x + 6} ${y - 4} q10 -8 16 2" fill="none" stroke="#c9c4b8" stroke-width="3"/>
      <circle cx="${x - 18}" cy="${y - 16}" r="11" fill="#f8f6f0" ${ST}/>
      <path d="M${x - 28} ${y - 16} l-12 3 l12 4 z" fill="#f08a24" stroke="${OL}" stroke-width="1.5"/>
      <circle cx="${x - 20}" cy="${y - 19}" r="2.5" fill="${OL}"/>`;
  }
  return s;
}

function bench(state){
  const c = col(state.colour), d = shade(state.colour, -0.2);
  return `<rect x="588" y="440" width="14" height="164" fill="${OL}"/><rect x="788" y="440" width="14" height="164" fill="${OL}"/>
    <rect x="566" y="442" width="258" height="22" rx="5" fill="${c}" ${ST}/>
    <rect x="566" y="472" width="258" height="22" rx="5" fill="${c}" ${ST}/>
    <rect x="556" y="508" width="278" height="20" rx="5" fill="${d}" ${ST}/>`;
}

function blanket(state){
  const c = col(state.colour), l = shade(state.colour, 0.45);
  return `<path d="M450 720 L800 720 L790 794 L424 794 Z" fill="${c}" ${ST}/>
    <path d="M548 720 L534 794 M646 720 L640 794 M744 720 L746 794 M440 757 L796 757" stroke="${l}" stroke-width="10"/>
    <path d="M450 720 L800 720 L790 794 L424 794 Z" fill="none" stroke="${OL}" stroke-width="3"/>`;
}

function kite(state){
  const c = col(state.colour), d = shade(state.colour, -0.25);
  return `<path d="M620 186 Q700 300 760 470" fill="none" stroke="${OL}" stroke-width="2"/>
    <path d="M620 186 Q600 210 610 230 Q626 246 608 268" fill="none" stroke="${OL}" stroke-width="2"/>
    <path d="M603 222 l10 6 l-10 6 z M606 254 l10 6 l-10 6 z" fill="#f49ac2" stroke="${OL}" stroke-width="1.5"/>
    <path d="M620 60 L672 120 L620 186 L568 120 Z" fill="${c}" ${ST}/>
    <path d="M620 60 L620 186 M568 120 L672 120" stroke="${d}" stroke-width="3"/>`;
}

function basket(){
  return `<path d="M470 724 Q500 690 530 724" fill="none" stroke="${OL}" stroke-width="9"/>
    <path d="M470 724 Q500 690 530 724" fill="none" stroke="#c98f4a" stroke-width="5"/>
    <path d="M462 722 H538 L530 768 H470 Z" fill="#c98f4a" ${ST}/>
    <path d="M466 738 H534 M468 752 H532" stroke="#9c6630" stroke-width="3"/>
    <circle cx="488" cy="718" r="9" fill="#e2504b" stroke="${OL}" stroke-width="2"/>`;
}

function bin(state){
  const c = col(state.colour);
  return `<path d="M510 546 H552 L548 606 H514 Z" fill="${c}" ${ST}/>
    <rect x="506" y="536" width="50" height="12" rx="3" fill="${shade(state.colour, state.colour === "black" ? 0.3 : -0.2)}" ${ST}/>
    <path d="M524 560 V594 M538 560 V594" stroke="${OL}" stroke-width="2" opacity=".5"/>`;
}

const MOVABLE = OBJECTS.filter(d => d.kind === "movable").map(d => d.id);
const movable = (id, st) => DRAW[id](SLOTS[st.slot].x, SLOTS[st.slot].y, st.colour);
const kid = (id, st) => person(id, st, PEOPLE[id].cx, PEOPLE[id].base, HAT);

export function drawPicture(p){
  const at = slots => MOVABLE.filter(id => p[id] && slots.includes(p[id].slot)).map(id => movable(id, p[id])).join("");
  return [
    land(p.sky),
    birds(p.birds),
    p.kite ? kite(p.kite) : "",
    pond(p.ducks),
    tree(),
    at(["inTree"]),
    bench(p.bench),
    p.bin ? bin(p.bin) : "",
    at(["onBench", "underBench", "nextBench", "underTree"]),
    kid("girl", p.girl),
    kid("boy", p.boy),
    flowers(p.flowers),
    blanket(p.blanket),
    p.basket ? basket() : "",
    at(["onBlanket", "frontPond"])
  ].join("");
}

export function iconSVG(key){
  switch (key){
    case "tree": return svgBox(-30, 20, 420, 650, tree());
    case "bench": return svgBox(545, 430, 300, 180, bench({ colour: "brown" }));
    case "bin": return svgBox(495, 528, 72, 84, bin({ colour: "blue" }));
    case "blanket": return svgBox(415, 712, 395, 88, blanket({ colour: "orange" }));
    case "basket": return svgBox(450, 690, 100, 84, basket());
    case "pond": return svgBox(1068, 548, 324, 124, pond({ count: 0 }));
    case "ducks": return svgBox(1104, 575, 80, 56, pond({ count: 1 }));
    case "birds": return svgBox(800, 60, 180, 90, birds({ count: 3 }));
    case "kite": return svgBox(560, 52, 120, 140, kite({ colour: "yellow" }));
    case "flowers": return svgBox(10, 650, 190, 110, flowers({ colour: "pink", count: 4 }));
    case "sky": return svgBox(1150, 20, 240, 190, land({ weather: "sun" }));
    case "hat": return svgBox(286, 470, 120, 70, person("boy", { colour: "blue", hat: "blue" }, 330, 772, HAT));
    case "girl": case "boy": return svgBox(225, 405, 210, 270, person(key, { colour: key === "girl" ? "pink" : "blue" }, 330, 772, HAT));
    default:
      if (DRAW[key]) return thingIcon(key);
      if (ACTIVITIES.includes(key)) return activityIcon(key, HAT);
      return "";
  }
}
