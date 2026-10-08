/* Im Rhythmus des Nils – die Simulation (ohne Bildschirm, in Node testbar).
   Alle Zahlen kommen aus content.js. */
import { GAME, YIELDS, YEAR2_FLOODS, DORF } from "./content.js";
import { roundRng, pickWeighted } from "../shared/random.js";

export const FIELDS = [
  { id: "u1", zone: "ufer" }, { id: "u2", zone: "ufer" },
  { id: "m1", zone: "mitte" }, { id: "m2", zone: "mitte" },
  { id: "r1", zone: "rand" }, { id: "r2", zone: "rand" }
];
export const WORK = ["graben", "schaduf"];
export const zoneOf = id => (FIELDS.find(f => f.id === id) || {}).zone;

/* Flut je Jahr: Jahr 1 immer gut, Jahr 2 aus dem Spielcode */
export function floodOf(code, year){
  if (year === 1) return "gut";
  return pickWeighted(roundRng(code, 2), YEAR2_FLOODS);
}

/* Zustand eines Feldes, nachdem das Wasser gesunken ist (bevor jemand arbeitet).
   schlamm = überschwemmt, fruchtbar · trocken = kein Wasser · nass = steht noch unter Wasser */
export function baseWater(flood, zone, dorf = {}){
  if (flood === "gut") return zone === "rand" ? "trocken" : "schlamm";
  if (flood === "niedrig") return zone === "ufer" ? "schlamm" : "trocken";
  if (flood === "hoch") return zone === "ufer" && !dorf.deich ? "nass" : "schlamm";
  throw new Error("unbekannte Flut: " + flood);
}

/* Wie weit stieg das Wasser (für die Anzeige während Achet)? */
export function floodedZones(flood){
  return { gut: ["ufer", "mitte"], niedrig: ["ufer"], hoch: ["ufer", "mitte", "rand"] }[flood];
}

/* Ein Jahr auswerten.
   targets: Liste der Arbeitsorte (Feld-IDs, "graben", "schaduf"), höchstens eine Person je Ort.
   dorf: { deich, kanal } */
export function evaluateYear({ flood, targets, dorf = {} }){
  const set = new Set(targets);
  const grabenWorks = set.has("graben");
  const grabenWater = grabenWorks && (flood !== "niedrig" || !!dorf.kanal);
  let schaduf = set.has("schaduf") ? 1 : 0;
  const fields = FIELDS.map(f => {
    const water = baseWater(flood, f.zone, dorf);
    const sown = set.has(f.id);
    let reason = "brach", yld = 0;
    if (sown){
      if (water === "schlamm"){
        yld = YIELDS[flood].flut;
        reason = flood === "hoch" ? "spaet" : flood === "niedrig" ? "flutNiedrig" : "flut";
      } else if (water === "nass"){
        reason = "nass";
      } else if (f.zone === "mitte" && flood === "niedrig" && dorf.kanal){
        yld = YIELDS.bewaessert; reason = "kanal";
      } else if (f.zone === "mitte" && schaduf > 0){
        schaduf--; yld = YIELDS.bewaessert; reason = "schaduf";
      } else if (f.zone === "rand" && grabenWater){
        yld = YIELDS.bewaessert; reason = "graben";
      } else {
        reason = "trocken";
      }
    }
    return { id: f.id, zone: f.zone, water, sown, reason, yield: yld };
  });
  const notes = [];
  const randSown = fields.some(f => f.zone === "rand" && f.sown);
  if (set.has("graben") && !randSown) notes.push("grabenUmsonst");
  else if (grabenWorks && randSown && !grabenWater) notes.push("grabenLeer");
  if (set.has("schaduf") && schaduf > 0) notes.push("schadufUmsonst");
  if (flood === "hoch") notes.push(dorf.deich ? "hofSicher" : "hofNass");
  const total = fields.reduce((s, f) => s + f.yield, 0);
  return { flood, fields, notes, total, sownCount: fields.filter(f => f.sown).length };
}

/* Beste mögliche Ernte eines Jahres (für Tests) */
export function bestHarvest(flood, dorf = {}){
  const places = [...FIELDS.map(f => f.id), ...WORK];
  let best = 0;
  const n = places.length;
  for (let mask = 0; mask < (1 << n); mask++){
    const t = places.filter((_, i) => mask & (1 << i));
    if (t.length > GAME.familySize) continue;
    best = Math.max(best, evaluateYear({ flood, targets: t, dorf }).total);
  }
  return best;
}

/* Versorgung am Ende von Jahr 2 (Jahr 1: siehe supplyYear1).
   own: eigener Vorrat aus Jahr 1, village: Dorfspeicher, hofNass: Hochwasser im Hof */
export function supplyYear2({ harvest, own, village, hofNass }){
  const lost = hofNass ? Math.ceil(own / 2) : 0;
  const ownLeft = own - lost;
  const need = GAME.need;
  let fromOwn = 0, help = 0, deficit = Math.max(0, need - harvest);
  fromOwn = Math.min(ownLeft, deficit); deficit -= fromOwn;
  const forFamilies = Math.max(0, village - DORF.handwerkBraucht);
  const helpMax = Math.ceil(forFamilies / 2);   // auch andere Familien brauchen Hilfe
  help = Math.min(deficit, helpMax); deficit -= help;
  const leftover = Math.max(0, harvest - need) + (ownLeft - fromOwn);
  return { lost, fromOwn, help, hunger: deficit, leftover,
    status: deficit > 0 ? "hunger" : help > 0 ? "geholfen" : fromOwn > 0 ? "vorrat" : "satt" };
}

/* Versorgung am Ende von Jahr 1: Überschuss zum Verteilen oder Hilfe der Nachbarn */
export function supplyYear1(harvest){
  const need = GAME.need;
  if (harvest >= need) return { surplus: harvest - need, help: 0, hunger: 0 };
  const deficit = need - harvest;
  const help = Math.min(deficit, Math.floor((DORF.nachbarnGeben - DORF.handwerkBraucht) / 2));
  return { surplus: 0, help, hunger: deficit - help };
}

/* Gemeinschaftsarbeit: Liste der Aufgaben der Helfer (z. B. ["deich", "hof"]) → Ergebnis.
   Deich und Kanal werden nur fertig, wenn jemand aus der Familie hilft; „hof“ bringt je 1 Sack. */
export const DORF_MAX = { deich: 1, kanal: 1, hof: 2 };
export function dorfResult(choices){
  return { deich: choices.includes("deich"), kanal: choices.includes("kanal"),
    extraGrain: choices.filter(c => c === "hof").length };
}
