/* Im Rhythmus des Nils 0.3 – Spiellogik ohne Bildschirm (in Node testbar).
   Drei Jahre ohne Zufall: Jahr 1 normale Flut, Jahr 2 zu niedrig (allein), Jahr 3 zu hoch.
   Vier Entscheidungen: Brache (Krüge/Erdwall), Schaduf bauen, Dorf oder allein, Beruf.
   Alle Zahlen stehen in content.js (NUM). */
import { NUM } from "./content.js";

export const FLOOD = { 1: "gut", 2: "niedrig", 3: "hoch" };

/* Ablauf je Jahr. Jede Phase hat den Monat, in dem sie spielt (1–12).
   only: Phase gibt es nur, wenn die Bedingung erfüllt ist (flags = Entscheidungen) */
export const PHASES = {
  1: [
    { id: "sirius", m: 1 }, { id: "achet", m: 1 }, { id: "aussaat", m: 5 }, { id: "wachsen", m: 6 },
    { id: "ernte", m: 9 }, { id: "versorgung", m: 9 }, { id: "brache", m: 10 }, { id: "jahresende", m: 12 }
  ],
  2: [
    { id: "sirius", m: 1 }, { id: "achet", m: 1 }, { id: "schadufWahl", m: 5 }, { id: "schaduf", m: 5, only: f => f.schaduf === "bauen" },
    { id: "aussaat", m: 5 }, { id: "wachsen", m: 8 }, { id: "ernte", m: 9 }, { id: "versorgung", m: 9 },
    { id: "dorfWahl", m: 10 }, { id: "dorfbau", m: 10, only: f => f.dorf === "dorf" }
  ],
  3: [
    { id: "sirius", m: 1 }, { id: "achet", m: 4 }, { id: "vermessen", m: 6, only: f => f.dorf === "dorf" },
    { id: "aussaat", m: 6 }, { id: "wachsen", m: 8 }, { id: "ernte", m: 10 }, { id: "versorgung", m: 10 },
    { id: "verloren", m: 10, only: f => f.verloren }, { id: "beruf", m: 11, only: f => !f.verloren }
  ]
};

/* nächste Phase oder null (dann folgt die Bilanz) */
export function nextPhase(year, phase, flags = {}){
  let y = year, i = PHASES[y].findIndex(p => p.id === phase);
  for (;;){
    i++;
    if (i >= PHASES[y].length){ if (y === 3) return null; y++; i = 0; }
    const p = PHASES[y][i];
    if (!p.only || p.only(flags)) return { year: y, phase: p.id };
  }
}
export const monthOf = (year, phase) => (PHASES[year].find(p => p.id === phase) || { m: 1 }).m;

/* Wasserstand im Monat (Achet) als Anteil 0..1 des Höchststands */
export const RISE = [0.25, 0.55, 0.8, 1];

/* Wie viele Jahreszeiten sind im Kalender schon benannt? */
export function seasonsKnown(year, phase, month){
  if (year > 1) return 3;
  if (phase === "jahresende") return 3;
  if (["ernte", "versorgung", "brache"].includes(phase)) return 2;
  if (phase === "wachsen" && month >= 8) return 2;
  if (phase === "achet" && month < 4) return 0;
  if (phase === "sirius") return 0;
  return 1;
}

/* Kann dieses Feld in diesem Jahr bestellt werden? buckets = Eimer am Schaduf (Jahr 2) */
export function sowable(year, i, buckets = 0){
  if (year === 2){
    if (i === 0) return true;
    if (i === 1) return buckets >= NUM.schadufHalb;
    return false;
  }
  return true;
}

/* Ertrag eines bestellten Feldes in Säcken */
export function fieldYield(year, i, buckets = 0){
  if (year === 1) return NUM.ertragGut;
  if (year === 2){
    if (i === 0) return NUM.ertragNiedrig;
    if (i === 1) return buckets >= NUM.schadufVoll ? NUM.ertragBewaessert : buckets >= NUM.schadufHalb ? NUM.ertragBewaessert - 1 : 0;
    return 0;
  }
  return NUM.ertragSpaet;
}

/* Gesamternte. sown: [true/false ×3] */
export function harvest(year, sown, buckets = 0){
  return sown.reduce((s, on, i) => s + (on && sowable(year, i, buckets) ? fieldYield(year, i, buckets) : 0), 0);
}

/* Versorgung am Ende eines Jahres.
   vorrat: eigener Vorrat vor der Ernte · village: Hilfe, die der Dorfspeicher geben kann (0 = keine) */
export function supply(h, vorrat, village = 0){
  const need = NUM.bedarf;
  const total = h + vorrat;
  if (total >= need){
    const fromVorrat = Math.max(0, need - h);
    return { need, harvest: h, surplus: Math.max(0, h - need), fromVorrat, help: 0, hunger: 0, vorrat: total - need, status: fromVorrat > 0 ? "knapp" : "satt" };
  }
  const deficit = need - total;
  const help = Math.min(deficit, village);
  return { need, harvest: h, surplus: 0, fromVorrat: vorrat, help, hunger: deficit - help, vorrat: 0, status: deficit - help > 0 ? "hunger" : "geholfen" };
}

/* Jahr 3 allein: Was macht das Hochwasser mit Hof und Vorrat? */
export function hochwasserAllein(vorrat, wall){
  const lost = wall ? Math.ceil(vorrat / 2) : vorrat;
  return { lost, house: wall ? "steht" : "zerstoert" };
}

/* Verloren: zwei Hungerjahre hintereinander */
export const verloren = hungerByYear => [1, 2].some(y => hungerByYear[y] && hungerByYear[y + 1]);

/* Ganzes Spiel ohne Bildschirm durchrechnen (für Tests). Gibt die Verbuchung je Jahr zurück. */
export function simulate({ e1 = "kruege", schaduf = "bauen", buckets = NUM.schadufVoll, dorf = "dorf" } = {}){
  let vorrat = NUM.startVorrat;
  const years = {}, hunger = {};
  // Jahr 1
  years[1] = supply(harvest(1, [true, true, true]), vorrat);
  vorrat = years[1].vorrat + (e1 === "kruege" ? NUM.kruegeTausch : 0);
  // Jahr 2
  if (schaduf === "bauen") vorrat -= NUM.schadufKosten; else buckets = 0;
  years[2] = supply(harvest(2, [true, true, true], buckets), vorrat);
  vorrat = years[2].vorrat;
  // Dorf oder allein
  let flood = null;
  if (dorf === "dorf") vorrat -= Math.min(vorrat, NUM.dorfBeitrag);
  else { flood = hochwasserAllein(vorrat, e1 === "wall"); vorrat -= flood.lost; }
  years[3] = supply(harvest(3, [true, true, true]), vorrat, dorf === "dorf" ? NUM.dorfspeicher : 0);
  years[3].flood = flood;
  for (const y of [1, 2, 3]) hunger[y] = years[y].hunger > 0;
  return { years, hunger, verloren: verloren(hunger) };
}
