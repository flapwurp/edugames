/* Planspiel Julikrise 1914 – Spiellogik ohne DOM (testbar in Node).
   Zustand = Objekt aus Entscheidungen, z. B. { "1.d": "C", "1.oeu": "B", "2.oeu.wann": "nach dem Staatsbesuch" }. */
import { RUNDEN } from "./content.js";
import { VARIANTEN, LAGE, GRENZEN, AUSGAENGE, ENDE } from "./netz.js";

export const passt = (wenn = {}, zustand) =>
  Object.entries(wenn).every(([k, werte]) => werte.includes(zustand[k]));

/* Karte eines Staates in einer Runde, mit allen passenden Varianten (in Reihenfolge der Liste). */
export function karte(runde, staat, zustand) {
  const basis = RUNDEN[runde - 1].staaten[staat];
  const optionen = {};
  for (const b of ["A", "B", "C"]) optionen[b] = { ...basis.optionen[b] };
  const k = { optionen, kurswechsel: [], zusatz: basis.zusatz ? { ...basis.zusatz } : null, varianten: [] };
  VARIANTEN.forEach((v, i) => {
    if (v.runde !== runde || v.staat !== staat || !passt(v.wenn, zustand)) return;
    for (const [b, o] of Object.entries(v.optionen || {})) Object.assign(optionen[b], o);
    for (const b of v.kurswechsel || []) if (!k.kurswechsel.includes(b)) k.kurswechsel.push(b);
    if (v.zusatz && k.zusatz) Object.assign(k.zusatz, v.zusatz);
    k.varianten.push(i);
  });
  return k;
}

/* Lagetext, wie ihn ein Staat sieht. */
export function lage(runde, staat, zustand) {
  let saetze = [...RUNDEN[runde - 1].lage];
  for (const l of LAGE) {
    if (l.runde !== runde || !passt(l.wenn, zustand)) continue;
    if (l.fuer !== "alle" && !l.fuer.includes(staat)) continue;
    saetze = l.ersetzt ? [l.text] : [...saetze, l.text];
  }
  return saetze;
}

/* Grenze nach einer Entscheidung (oder null). */
export const grenze = (runde, staat, zustand) =>
  GRENZEN.find(g => g.runde === runde && g.staat === staat && passt(g.wenn, zustand)) || null;

/* Früher Ausgang nach einer Runde (oder null), mit den passenden Begründungen. */
export function ausgang(runde, zustand) {
  const a = AUSGAENGE.find(x => x.nachRunde === runde && passt(x.wenn, zustand));
  return a ? { ...a, saetze: a.weil.filter(w => passt(w.wenn, zustand)).map(w => w.text) } : null;
}

export const ende = (zustand) => ({ ...ENDE, saetze: ENDE.weil.filter(w => passt(w.wenn, zustand)).map(w => w.text) });

/* Akte 1914: alle Entscheidungen bis einschließlich abRunde so, wie sie 1914 fielen. */
export function akte1914(bisRunde) {
  const z = {};
  for (const r of RUNDEN.slice(0, bisRunde)) {
    for (const [s, k] of Object.entries(r.staaten)) z[`${r.nr}.${s}`] = k.historisch;
    if (r.staaten.oeu?.zusatz) z[`${r.nr}.oeu.wann`] = r.staaten.oeu.zusatz.historisch;
  }
  return z;
}

/* Alle Entscheidungen, von denen eine Bedingung abhängt (für das Netz und für Tests). */
export const schluessel = (wenn = {}) => Object.keys(wenn);
