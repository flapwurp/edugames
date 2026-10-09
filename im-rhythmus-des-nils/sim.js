/* Im Rhythmus des Nils 0.2 – Spiellogik ohne Bildschirm (in Node testbar).
   Drei Jahre ohne Zufall: Jahr 1 normale Flut, Jahr 2 zu niedrig (allein), Jahr 3 zu hoch (im Dorf).
   Alle Zahlen stehen in content.js (NUM). */
import { NUM } from "./content.js";

export const FLOOD = { 1: "gut", 2: "niedrig", 3: "hoch" };

/* Ablauf je Jahr. Jede Phase hat den Monat, in dem sie spielt (1–12). */
export const PHASES = {
  1: [
    { id: "sirius", m: 1 }, { id: "achet", m: 1 }, { id: "aussaat", m: 5 }, { id: "wachsen", m: 6 },
    { id: "ernte", m: 9 }, { id: "versorgung", m: 9 }, { id: "brache", m: 10 }, { id: "jahresende", m: 12 }
  ],
  2: [
    { id: "sirius", m: 1 }, { id: "achet", m: 4 }, { id: "schaduf", m: 5 }, { id: "aussaat", m: 5 }, { id: "wachsen", m: 6 },
    { id: "ernte", m: 9 }, { id: "versorgung", m: 9 }, { id: "dorfbau", m: 10 }
  ],
  3: [
    { id: "sirius", m: 1 }, { id: "achet", m: 4 }, { id: "vermessen", m: 6 }, { id: "aussaat", m: 6 }, { id: "wachsen", m: 7 },
    { id: "ernte", m: 10 }, { id: "versorgung", m: 10 }, { id: "beruf", m: 11 }
  ]
};

/* nächste Phase oder null (dann folgt die Bilanz) */
export function nextPhase(year, phase){
  const list = PHASES[year];
  const i = list.findIndex(p => p.id === phase);
  if (i < list.length - 1) return { year, phase: list[i + 1].id };
  if (year < 3) return { year: year + 1, phase: "sirius" };
  return null;
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
   vorrat: eigener Vorrat vor der Ernte · village: Inhalt des Dorfspeichers (Jahr 3) */
export function supply(year, h, vorrat, village = 0){
  const need = NUM.bedarf;
  const total = h + vorrat;
  if (total >= need){
    const fromVorrat = Math.max(0, need - h);
    return { need, harvest: h, fromVorrat, help: 0, hunger: 0, vorrat: total - need, status: fromVorrat > 0 ? "knapp" : "satt" };
  }
  const deficit = need - total;
  const help = year === 3 ? Math.min(deficit, village) : 0;
  return { need, harvest: h, fromVorrat: vorrat, help, hunger: deficit - help, vorrat: 0, status: deficit - help > 0 ? "hunger" : "geholfen" };
}

/* Entscheidung 1 (Brache, Jahr 1): "kruege" bringt Tauschgetreide, "wall" schützt den Hof (in Jahr 2 ohne Nutzen) */
export const bracheBonus = choice => (choice === "kruege" ? NUM.kruegeTausch : 0);

/* Ganzes Spiel ohne Bildschirm durchrechnen (für Tests und die Bilanz) */
export function simulate({ e1 = "kruege", buckets = NUM.schadufVoll, sow = [[1, 1, 1], [1, 1, 1], [1, 1, 1]] } = {}){
  let vorrat = NUM.startVorrat;
  const years = {};
  for (const y of [1, 2, 3]){
    const sown = sow[y - 1].map((v, i) => !!v && sowable(y, i, buckets));
    const h = harvest(y, sown, buckets);
    const s = supply(y, h, vorrat, NUM.dorfspeicher);
    years[y] = s;
    vorrat = s.vorrat;
    if (y === 1) vorrat += bracheBonus(e1);
  }
  return years;
}
