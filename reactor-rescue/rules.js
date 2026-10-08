/* Reactor Rescue – the reactor and its rules. No screen code in here (so it can be tested).
   Every rule text that appears in the manual lives next to the code that checks it,
   so the manual and the game can never disagree. */
import { CONFIG } from "./content.js";
import { roundRng } from "../shared/random.js";
import { levelOf } from "../shared/session.js";

export const WIRE_COLOURS = { red: "#e5484d", blue: "#3e7bfa", yellow: "#f5c400", white: "#eef1f5", black: "#14171c" };
const WIRE_POOL = ["red", "red", "blue", "blue", "yellow", "white", "black"];
export const LAMP_COLOURS = { green: "#3ddc84", red: "#ff4d4d", blue: "#4da3ff", yellow: "#ffd23f" };
const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
export const ORD = ["first", "second", "third", "fourth", "fifth", "sixth"];
export const sameArr = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

/* ---------- wire unit (K-12, K-40) ---------- */
const LINE_TYPE = { red: "hot", yellow: "hot", blue: "cold", white: "cold", black: "neutral" };
export const typ = w => LINE_TYPE[w.c];
const lastWhere = (w, f) => { let i = -1; w.forEach((x, k) => { if (f(x)) i = k; }); return i; };

/* Instruction texts and logic live together, so the manual always matches the game */
export const INSTR = {
  A: { t: "Cut the first cold wire. If there is no cold wire, follow G.",
       f: (w, d) => { const i = w.findIndex(x => typ(x) === "cold"); return i >= 0 ? i : INSTR.G.f(w, d); } },
  B: { t: "Cut the last hot wire. If there is no hot wire, follow G.",
       f: (w, d) => { const i = lastWhere(w, x => typ(x) === "hot"); return i >= 0 ? i : INSTR.G.f(w, d); } },
  C: { t: "Cut the marked wire that is closest to the bottom. If there is no marked wire, follow E.",
       f: (w, d) => { const i = lastWhere(w, x => x.s); return i >= 0 ? i : INSTR.E.f(w, d); } },
  D: { t: "Cut the wire directly below the first neutral wire. If there is no neutral wire, or if it is the bottom wire, follow A.",
       f: (w, d) => { const i = w.findIndex(x => typ(x) === "neutral"); return (i < 0 || i === w.length - 1) ? INSTR.A.f(w, d) : i + 1; } },
  E: { t: "Cut the second wire from the bottom.",
       f: (w) => w.length - 2 },
  F: { t: "Run a diagnostic. If the light pulses, cut the top wire. If it is steady, follow B.",
       f: (w, d) => (d.test === "pulsing" ? 0 : INSTR.B.f(w, d)) },
  G: { t: "Cut the bottom wire.",
       f: (w) => w.length - 1 },
  H: { t: "Cut the first wire that is neither hot nor marked. If there is no such wire, follow G.",
       f: (w, d) => { const i = w.findIndex(x => typ(x) !== "hot" && !x.s); return i >= 0 ? i : INSTR.G.f(w, d); } }
};
export const WIRE_TABLES = {
  "K-12": { rowHead: "Top wire", colHead: "Number of marked wires", cols: ["none", "one", "two or more"],
            cells: { hot: ["B", "C", "F"], cold: ["D", "H", "C"], neutral: ["F", "A", "E"] },
            key: w => [typ(w[0]), Math.min(2, w.filter(x => x.s).length)] },
  "K-40": { rowHead: "Bottom wire", colHead: "Diagnostic: the light …", cols: ["pulses", "is steady"],
            cells: { hot: ["H", "D"], cold: ["B", "E"], neutral: ["C", "A"] },
            key: (w, d) => [typ(w[w.length - 1]), d.test === "pulsing" ? 0 : 1] }
};
export const reversedAssembly = d => d.bulletins && /(\d).*\1/.test(d.serial.replace(/[A-Z]/g, ""));
function solveWire(d){
  const rev = reversedAssembly(d);
  const w = rev ? d.wires.slice().reverse() : d.wires;
  const T = WIRE_TABLES[d.wUnit];
  const [r, c] = T.key(w, d);
  const i = INSTR[T.cells[r][c]].f(w, d);
  return rev ? w.length - 1 - i : i;
}

/* ---------- flow regulator bank (levers) ---------- */
export const REG_UNITS = {
  "R-20": { levers: 4, patterns: { green: "1010", red: "0110", blue: "1101", yellow: "0001" } },
  "R-31": { levers: 5, patterns: { green: "10110", red: "01101", blue: "11010", yellow: "00111" } }
};
function solveLevers(d){       // returns physical positions from left to right, true = up
  let p = REG_UNITS[d.rUnit].patterns[d.lamp].split("").map(Number);
  if (d.pulse) p = p.reverse();
  const n = p.length, phys = new Array(n);
  for (let k = 0; k < n; k++){
    const pos = d.gauge === "left" ? k : n - 1 - k;
    const open = p[k] === 1;
    phys[pos] = d.stripe === "top" ? open : !open;
  }
  return phys;
}

/* ---------- access lock (code) ---------- */
export const MODEL_TABLE = { Helios: 3, Orion: 8, Vega: 5, Atlas: 1 };
export const COLOUR_TABLE = { green: 2, red: 7, blue: 4, yellow: 9 };
const letterDigit = l => (l <= "F" ? 4 : l <= "M" ? 7 : l <= "T" ? 2 : 9);
const lastDigit = d => +d.serial[5];
export const CODE_RULES = {
  1: [
    { t: "Number of hot wires (no hot wires = 0)", v: d => d.wires.filter(x => typ(x) === "hot").length },
    { t: "Last digit of the serial number", v: lastDigit },
    { t: "Number of marked wires (no marked wires = 5)", v: d => d.wires.filter(x => x.s).length || 5 },
    { t: "Colour of the indicator light on the flow regulator → Table C", v: d => COLOUR_TABLE[d.lamp] }
  ],
  2: [
    { t: "Reactor model → Table A", v: d => MODEL_TABLE[d.model] },
    { t: "First letter of the serial number → Table B", v: d => letterDigit(d.serial[0]) },
    { t: "Run a diagnostic on the wire unit. If the light pulses: number of cold wires. If it is steady: number of neutral wires.", v: d => d.wires.filter(x => typ(x) === (d.test === "pulsing" ? "cold" : "neutral")).length },
    { t: "Add the last two digits of the serial number. Result bigger than 9? Use only its last digit.", v: d => (+d.serial[4] + +d.serial[5]) % 10 }
  ]
};
const solveCode = d => CODE_RULES[d.level].map(r => r.v(d)).join("");

/* ---------- reactor ---------- */
export function makeReactor(code, round){
  const lv = levelOf(code), L = CONFIG.levels[lv];
  const rng = roundRng(code, round);
  const pick = arr => arr[Math.floor(rng() * arr.length)];
  const model = pick(L.models);
  const ch = () => pick(LETTERS.split("")), dg = () => String(Math.floor(rng() * 10));
  const serial = ch() + ch() + dg() + ch() + dg() + dg();
  const wUnit = pick(L.wireUnits);
  const n = L.wires[0] + Math.floor(rng() * (L.wires[1] - L.wires[0] + 1));
  const wires = Array.from({ length: n }, () => ({ c: pick(WIRE_POOL), s: rng() < 0.3 }));
  const test = rng() < 0.5 ? "pulsing" : "steady";
  const rUnit = pick(L.regUnits);
  const gauge = rng() < 0.5 ? "left" : "right";
  const stripe = rng() < 0.5 ? "top" : "bottom";
  const lamp = pick(Object.keys(LAMP_COLOURS));
  const pulse = L.bulletins ? rng() < 0.5 : false;
  const d = { level: lv, bulletins: L.bulletins, model, serial, wUnit, wires, test, rUnit, gauge, stripe, lamp, pulse, levers: null };
  const target = solveLevers(d);
  for (let t = 0; t < 40; t++){ d.levers = target.map(() => rng() < 0.5); if (!sameArr(d.levers, target)) break; }
  d.solution = { wire: solveWire(d), levers: target, code: solveCode(d) };
  return d;
}
