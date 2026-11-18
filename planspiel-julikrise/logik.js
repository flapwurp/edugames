/* Planspiel Julikrise 1914 – Spiellogik ohne DOM (testbar in Node).
   zustand = Entscheidungen der Klasse, z. B. { "1.d": "C", "1.oeu": "B", "2.oeu.wann": "nach dem Staatsbesuch" }.
   Daraus werden Welle für Welle die Merkmale berechnet (netz.js). */
import { RUNDEN } from "./content.js";
import { MERKMALE, SETZT, VARIANTEN, LAGE, GRENZEN, AUSGAENGE, ENDE, KIPPPUNKTE } from "./netz.js";
import { STIMMEN, ERINNERUNGEN, UHREN } from "./framing.js";

export const passt = (wenn = {}, m) => Object.entries(wenn).every(([k, werte]) => werte.includes(m[k]));
export const startMerkmale = () => Object.fromEntries(Object.entries(MERKMALE).map(([k, v]) => [k, v.start]));
const wellenIndex = (runde, staat) => RUNDEN[runde - 1].wellen.findIndex(w => w.includes(staat));

/* Karte aus Merkmalen (m = Merkmale, wie der Staat sie beim Entscheiden kennt). */
export function karteAus(runde, staat, m) {
  const basis = RUNDEN[runde - 1].staaten[staat];
  const optionen = {};
  for (const b of ["A", "B", "C"]) optionen[b] = { ...basis.optionen[b], setzt: SETZT[`${runde}.${staat}`]?.[b] || {} };
  const k = { optionen, kurswechsel: [], zusatz: basis.zusatz ? { ...basis.zusatz } : null, varianten: [] };
  VARIANTEN.forEach((v, i) => {
    if (v.runde !== runde || v.staat !== staat || !passt(v.wenn, m)) return;
    for (const [b, o] of Object.entries(v.optionen || {})) Object.assign(optionen[b], o);
    for (const b of v.kurswechsel || []) if (!k.kurswechsel.includes(b)) k.kurswechsel.push(b);
    if (v.zusatz && k.zusatz) Object.assign(k.zusatz, v.zusatz);
    k.varianten.push(i);
  });
  return k;
}

export function lageAus(runde, staat, m) {
  let saetze = [...RUNDEN[runde - 1].lage];
  for (const l of LAGE) {
    if (l.runde !== runde || !passt(l.wenn, m)) continue;
    if (l.fuer !== "alle" && !l.fuer.includes(staat)) continue;
    saetze = l.ersetzt ? [l.text] : [...saetze, l.text];
  }
  return saetze;
}

/* Schritte für Anzeigen mit „stufen“: "+1" / "-1". Unter „schwach“ kippt die Anzeige (Kipppunkt). */
const STUFEN = ["gekippt", "schwach", "mittel", "stark"];
export function setze(m, werte) {
  for (const [k, v] of Object.entries(werte || {})) {
    if (v !== "+1" && v !== "-1") { m[k] = v; continue; }
    const neu = STUFEN[Math.max(0, Math.min(3, STUFEN.indexOf(m[k]) + (v === "+1" ? 1 : -1)))];
    const kippt = neu === "gekippt" && m[k] !== "gekippt";
    m[k] = neu;
    if (kippt) setze(m, KIPPPUNKTE[k]?.setzt);
  }
}

/* Wirkung einer Entscheidung auf die Merkmale. */
function anwenden(m, runde, staat, wahl, zustand, kennt) {
  if (!wahl) return;
  setze(m, karteAus(runde, staat, kennt).optionen[wahl].setzt);
  const wann = zustand[`${runde}.${staat}.wann`];
  if (wann) setze(m, SETZT[`${runde}.${staat}.wann`]?.[wann]);
}

/* Merkmale vor einer Welle (runde, welle) bzw. nach einer ganzen Runde (welle = Infinity). */
export function merkmaleBis(zustand, runde, welle) {
  const m = startMerkmale();
  for (const r of RUNDEN) {
    for (let w = 0; w < r.wellen.length; w++) {
      if (r.nr > runde || (r.nr === runde && w >= welle)) return m;
      const kennt = { ...m };
      for (const s of r.wellen[w]) anwenden(m, r.nr, s, zustand[`${r.nr}.${s}`], zustand, kennt);
    }
  }
  return m;
}

export const vorher = (zustand, runde, staat) => merkmaleBis(zustand, runde, wellenIndex(runde, staat));
export const karte = (runde, staat, zustand) => karteAus(runde, staat, vorher(zustand, runde, staat));
export const lage = (runde, staat, zustand) => lageAus(runde, staat, vorher(zustand, runde, staat));

/* Grenze direkt nach der eigenen Entscheidung (oder null). */
export function grenze(runde, staat, zustand) {
  const kennt = vorher(zustand, runde, staat);
  const m = { ...kennt };
  anwenden(m, runde, staat, zustand[`${runde}.${staat}`], zustand, kennt);
  return GRENZEN.find(g => g.runde === runde && g.staat === staat && passt(g.wenn, m)) || null;
}

const saetze = (liste, m) => liste.filter(w => passt(w.wenn, m)).map(w => w.text);

export function ausgang(runde, zustand) {
  const m = merkmaleBis(zustand, runde, Infinity);
  const a = AUSGAENGE.find(x => x.nachRunde === runde && passt(x.wenn, m));
  return a ? { ...a, saetze: saetze(a.weil, m) } : null;
}

export const ende = (zustand) => {
  const m = merkmaleBis(zustand, 5, Infinity);
  return { ...ENDE, saetze: saetze(ENDE.weil, m) };
};

/* Stimmungsanzeigen, die ein Staat beim Entscheiden sieht. */
export const anzeigen = (runde, staat, zustand) => {
  const m = vorher(zustand, runde, staat);
  return Object.entries(MERKMALE).filter(([, v]) => v.anzeige?.fuer.includes(staat))
    .map(([k, v]) => ({ id: k, titel: v.anzeige.titel, stufe: m[k], text: v.anzeige.text[m[k]] }));
};

/* Stimmen (Zitate, sinngemäß, Berichte, Gerüchte) liegen auf Eis (Rob, 18.11.): Gefahr der Überfrachtung. */
export const STIMMEN_AKTIV = false;

/* Alle Framing Controls, die ein Staat beim Entscheiden sieht. */
export function framing(runde, staat, zustand) {
  const m = vorher(zustand, runde, staat);
  const fuer = x => x.fuer === "alle" || x.fuer.includes(staat);
  return {
    anzeigen: anzeigen(runde, staat, zustand),
    stimmen: STIMMEN_AKTIV ? STIMMEN.filter(x => x.runde === runde && x.staat === staat && passt(x.wenn, m)) : [],
    erinnerungen: ERINNERUNGEN.filter(x => fuer(x) && runde >= x.ab),
    uhren: UHREN.filter(x => x.runde === runde && fuer(x) && passt(x.wenn, m))
  };
}

/* Akte 1914: alle Entscheidungen bis einschließlich bisRunde so, wie sie 1914 fielen. */
export function akte1914(bisRunde) {
  const z = {};
  for (const r of RUNDEN.slice(0, bisRunde)) {
    for (const [s, k] of Object.entries(r.staaten)) z[`${r.nr}.${s}`] = k.historisch;
    if (r.staaten.oeu?.zusatz) z[`${r.nr}.oeu.wann`] = r.staaten.oeu.zusatz.historisch;
  }
  return z;
}
