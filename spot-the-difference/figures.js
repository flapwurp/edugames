/* =====================================================================
   FIGURES shared by all scenes: people (with what they are doing) and
   small things that can sit in different places (cat, dog, ball, …).
   No DOM access: everything returns SVG text.
   ===================================================================== */
import { COLOURS } from "./content.js";

export const OL = "#3d2f2a";                       // outline colour
export const ST = `stroke="${OL}" stroke-width="3" stroke-linejoin="round"`;
export const col = id => (COLOURS[id] ? COLOURS[id].c : id);
export const r1 = n => Math.round(n * 10) / 10;

export function shade(hex, amt){
  const h = col(hex).replace("#", "");
  const n = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  return "#" + n.map(v => Math.round(v + (t - v) * p).toString(16).padStart(2, "0")).join("");
}

/* ---------- people ---------- */
/* An arm from the shoulder (s) over the elbow (e) to the hand (h). */
function armLine(s, e, h, skin, sleeve){
  const d = `M${s[0]} ${s[1]} L${e[0]} ${e[1]} L${h[0]} ${h[1]}`;
  return `<path d="${d}" fill="none" stroke="${OL}" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="${skin}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${s[0]} ${s[1]} L${r1(s[0] + (e[0] - s[0]) * 0.45)} ${r1(s[1] + (e[1] - s[1]) * 0.45)}" stroke="${sleeve}" stroke-width="18" stroke-linecap="round"/>`;
}
const hand = (h, skin) => `<circle cx="${h[0]}" cy="${h[1]}" r="9" fill="${skin}" stroke="${OL}" stroke-width="2.5"/>`;
const note = (x, y) => `<path d="M${x} ${y} v-26 l14 -5" fill="none" stroke="${OL}" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="${x - 6}" cy="${y}" rx="7" ry="5" fill="${OL}"/>`;

/* Things a person can be doing. Each returns { back, front }:
   back is drawn before the arms, front after them. */
function activity(kind, X, Y, cx){
  switch (kind){
    case "eating": return {
      arms: [[[-50, 160], [-22, 150]], [[52, 172], [18, 222]]],
      front: `<ellipse cx="${X(-22)}" cy="${Y(146)}" rx="32" ry="7" fill="#ffffff" stroke="${OL}" stroke-width="2.5"/>
        <path d="M${X(-40)} ${Y(150)} L${X(-6)} ${Y(150)} L${X(-30)} ${Y(174)} Z" fill="#f3d9a4" stroke="${OL}" stroke-width="2"/>
        <path d="M${X(-40)} ${Y(150)} L${X(-30)} ${Y(174)}" stroke="#f49ac2" stroke-width="5"/>
        <path d="M${X(18)} ${Y(222)} L${X(8)} ${Y(242)}" stroke="#8a8f96" stroke-width="4" stroke-linecap="round"/>` };
    case "drinking": return {
      arms: [null, [[52, 172], [16, 222]]],
      front: `<rect x="${X(4)}" y="${Y(252)}" width="22" height="34" rx="3" fill="#fff3a0" stroke="${OL}" stroke-width="2.5"/>
        <path d="M${X(12)} ${Y(252)} L${X(6)} ${Y(266)}" stroke="#f49ac2" stroke-width="3"/>` };
    case "reading": return {
      arms: [[[-52, 166], [-34, 146]], [[52, 166], [34, 146]]],
      front: `<path d="M${cx} ${Y(184)} L${X(-50)} ${Y(176)} L${X(-50)} ${Y(124)} L${cx} ${Y(132)} L${X(50)} ${Y(124)} L${X(50)} ${Y(176)} Z" fill="#2f6fd0" ${ST}/>
        <path d="M${cx} ${Y(178)} L${X(-44)} ${Y(170)} L${X(-44)} ${Y(130)} L${cx} ${Y(136)} L${X(44)} ${Y(130)} L${X(44)} ${Y(170)} Z" fill="#ffffff" stroke="${OL}" stroke-width="2"/>
        <path d="M${cx} ${Y(178)} V${Y(136)} M${X(-36)} ${Y(162)} L${X(-8)} ${Y(165)} M${X(-36)} ${Y(150)} L${X(-8)} ${Y(153)} M${X(8)} ${Y(165)} L${X(36)} ${Y(162)} M${X(8)} ${Y(153)} L${X(36)} ${Y(150)}" stroke="#8a8f96" stroke-width="2"/>` };
    case "guitar": {
      // the arms go behind the guitar, only the hands are drawn on top of it
      const neck = `M${X(-14)} ${Y(158)} L${X(-74)} ${Y(216)}`;
      return {
        arms: [[[-64, 160], [-58, 200]], [[54, 150], [14, 132]]],
        handsOnTop: true,
        front: `<path d="${neck}" stroke="${OL}" stroke-width="16" stroke-linecap="round"/>
          <path d="${neck}" stroke="#8a5a2b" stroke-width="10" stroke-linecap="round"/>
          <rect x="${X(-92)}" y="${Y(236)}" width="24" height="17" rx="4" fill="#6b4220" ${ST} transform="rotate(-45 ${X(-80)} ${Y(228)})"/>
          <circle cx="${X(-6)}" cy="${Y(154)}" r="22" fill="#c97b3a" ${ST}/>
          <circle cx="${X(12)}" cy="${Y(128)}" r="30" fill="#c97b3a" ${ST}/>
          <circle cx="${X(-6)}" cy="${Y(154)}" r="19" fill="#c97b3a"/>
          <circle cx="${X(2)}" cy="${Y(142)}" r="8" fill="#5a3518"/>
          <path d="M${X(-4)} ${Y(146)} L${X(-66)} ${Y(208)} M${X(6)} ${Y(138)} L${X(-62)} ${Y(212)}" stroke="#f3e2c0" stroke-width="1.5"/>` };
    }
    case "photo": return {
      arms: [[[-56, 186], [-36, 244]], [[56, 186], [36, 244]]],
      front: `<rect x="${X(-36)}" y="${Y(274)}" width="72" height="44" rx="7" fill="#4a4f57" ${ST}/>
        <rect x="${X(18)}" y="${Y(282)}" width="14" height="8" rx="2" fill="#4a4f57" stroke="${OL}" stroke-width="2"/>
        <circle cx="${cx}" cy="${Y(252)}" r="14" fill="#8ab4e8" stroke="#ffffff" stroke-width="4"/>` };
    case "waving": return {
      arms: [null, [[72, 232], [76, 300]]],
      front: `<path d="M${X(96)} ${Y(318)} q8 16 0 32 M${X(108)} ${Y(312)} q10 22 0 44" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>` };
    case "dancing": return {
      arms: [[[-72, 236], [-70, 302]], [[72, 236], [70, 302]]], front: "" };
    case "icecream": return {
      arms: [null, [[54, 160], [30, 184]]],
      handsOnTop: true,
      front: `<path d="M${X(17)} ${Y(206)} L${X(43)} ${Y(206)} L${X(30)} ${Y(168)} Z" fill="#e0a96d" ${ST}/>
        <path d="M${X(22)} ${Y(198)} L${X(38)} ${Y(186)} M${X(38)} ${Y(198)} L${X(24)} ${Y(186)}" stroke="#a8743c" stroke-width="2"/>
        <circle cx="${X(30)}" cy="${Y(214)}" r="15" fill="#f49ac2" ${ST}/>
        <circle cx="${X(26)}" cy="${Y(220)}" r="4" fill="#ffffff" opacity=".6"/>` };
    case "music": return {
      arms: [null, null],
      head: `<path d="M${X(-43)} ${Y(250)} A43 46 0 0 1 ${X(43)} ${Y(250)}" fill="none" stroke="#2c2c2c" stroke-width="7"/>
        <rect x="${X(-52)}" y="${Y(270)}" width="16" height="32" rx="6" fill="#4a4f57" ${ST}/>
        <rect x="${X(36)}" y="${Y(270)}" width="16" height="32" rx="6" fill="#4a4f57" ${ST}/>`,
      front: note(X(76), Y(270)) + note(X(98), Y(300)) };
    default: return { arms: [null, null], front: "" };
  }
}

/* A child. id "girl" or "boy". state: { activity, colour, hat }.
   hatType: "party" (party hat) or "cap" (baseball cap). */
export function person(id, state, cx, B, hatType = "party"){
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
    s += hatType === "cap"
      ? `<path d="M${X(-41)} ${Y(262)} A41 41 0 0 1 ${X(41)} ${Y(262)} Z" fill="${h}" ${ST}/>
        <path d="M${X(30)} ${Y(266)} L${X(74)} ${Y(266)} Q${X(80)} ${Y(260)} ${X(72)} ${Y(256)} L${X(30)} ${Y(258)} Z" fill="${shade(state.hat, -0.2)}" ${ST}/>
        <circle cx="${cx}" cy="${Y(302)}" r="5" fill="${shade(state.hat, -0.2)}" stroke="${OL}" stroke-width="2"/>`
      : `<path d="M${X(-26)} ${Y(284)} L${X(26)} ${Y(284)} L${X(6)} ${Y(352)} Z" fill="${h}" ${ST}/>
        <path d="M${X(-17)} ${Y(306)} L${X(20)} ${Y(306)} M${X(-8)} ${Y(330)} L${X(13)} ${Y(330)}" stroke="#ffffff" stroke-width="5"/>
        <circle cx="${X(6)}" cy="${Y(355)}" r="8" fill="#ffffff" stroke="${OL}" stroke-width="2"/>`;
  }
  const act = activity(state.activity, X, Y, cx);
  if (act.head) s += act.head;
  const shoulders = [[X(-34), Y(198)], [X(34), Y(198)]];
  const rest = [[[-46, 160], [-50, 116]], [[46, 160], [50, 116]]];
  const hands = [];
  act.arms.forEach((a, i) => {
    const [e, h] = a || rest[i];
    const E = [X(e[0]), Y(e[1])], H = [X(h[0]), Y(h[1])];
    s += armLine(shoulders[i], E, H, skin, c);
    if (act.handsOnTop) hands.push(H); else s += hand(H, skin);
  });
  s += act.front;
  s += hands.map(h => hand(h, skin)).join("");
  return s;
}

/* ---------- small things (x/y = bottom centre) ---------- */
export const SIZE = {
  cat:        { dx: -50, w: 118, h: 96 },
  dog:        { dx: -72, w: 142, h: 86 },
  teddy:      { dx: -40, w: 80,  h: 110 },
  ball:       { dx: -35, w: 70,  h: 68 },
  car:        { dx: -54, w: 108, h: 60 },
  skateboard: { dx: -60, w: 120, h: 34 },
  bag:        { dx: -36, w: 72,  h: 88 }
};

export const DRAW = {
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
  },
  skateboard(x, y, colour){
    return `<path d="M${x - 56} ${y - 28} Q${x - 58} ${y - 16} ${x - 44} ${y - 16} H${x + 44} Q${x + 58} ${y - 16} ${x + 56} ${y - 28} Z" fill="${col(colour)}" ${ST}/>
      <circle cx="${x - 34}" cy="${y - 8}" r="8" fill="#333333" ${ST}/><circle cx="${x + 34}" cy="${y - 8}" r="8" fill="#333333" ${ST}/>`;
  },
  bag(x, y, colour){
    const c = col(colour), d = shade(colour, colour === "black" ? 0.25 : -0.2);
    return `<path d="M${x - 14} ${y - 76} Q${x} ${y - 98} ${x + 14} ${y - 76}" fill="none" stroke="${OL}" stroke-width="7"/>
      <rect x="${x - 32}" y="${y - 80}" width="64" height="80" rx="18" fill="${c}" ${ST}/>
      <rect x="${x - 22}" y="${y - 40}" width="44" height="30" rx="8" fill="${d}" ${ST}/>
      <path d="M${x - 22} ${y - 30} H${x + 22}" stroke="${OL}" stroke-width="2"/>`;
  }
};

/* A small picture of a thing for the word list */
export const svgBox = (x, y, w, h, inner) => `<svg viewBox="${x} ${y} ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
const ICON_COLOUR = { cat: "orange", dog: "brown", teddy: "brown", ball: "blue", car: "yellow", skateboard: "purple", bag: "blue" };
export function thingIcon(key){
  const z = SIZE[key];
  return svgBox(z.dx - 8, -z.h - 14, z.w + 16, z.h + 22, DRAW[key](0, 0, ICON_COLOUR[key]));
}
export const activityIcon = (key, hatType) => svgBox(220, 405, 220, 270, person("boy", { colour: "yellow", activity: key }, 330, 772, hatType));
