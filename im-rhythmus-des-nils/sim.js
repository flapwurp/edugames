/* Im Rhythmus des Nils 0.4 – Spiellogik ohne Bildschirm (in Node testbar).
   Vier Jahre ohne Zufall: Jahr 1 normale Flut, Jahr 2 zu niedrig, Jahr 3 zu hoch, Jahr 4 wieder normal.
   Jede Arbeit kostet Arbeitskraft. Die Familie hat pro Jahr nur eine begrenzte Kraft (NUM.kraft).
   Alle Zahlen stehen in content.js (NUM). */
import { NUM } from "./content.js";

export const FLOOD = { 1: "gut", 2: "niedrig", 3: "hoch", 4: "gut" };
const K = () => NUM.kosten;

/* Ablauf je Jahr. Jede Phase hat den Monat, in dem sie spielt (1–12).
   only: Phase gibt es nur, wenn die Bedingung erfüllt ist (f = Entscheidungen und Ereignisse) */
export const PHASES = {
  1: [
    { id: "sirius", m: 1 }, { id: "achet", m: 1 }, { id: "aussaat", m: 5 }, { id: "wachsen", m: 6 },
    { id: "ernte", m: 9 }, { id: "versorgung", m: 9 }, { id: "trockenzeit", m: 10 }, { id: "jahresende", m: 12 }
  ],
  2: [
    { id: "sirius", m: 1 }, { id: "achet", m: 1 }, { id: "schadufWahl", m: 5 }, { id: "schaduf", m: 5, only: f => f.schaduf === "bauen" },
    { id: "aussaat", m: 5 }, { id: "wachsen", m: 6 }, { id: "ernte", m: 9 }, { id: "versorgung", m: 9 },
    { id: "dorfWahl", m: 10 }, { id: "dorfbau", m: 10, only: f => f.dorf === "dorf" }, { id: "trockenzeit", m: 10, only: f => f.dorf === "allein" }
  ],
  3: [
    { id: "sirius", m: 1 }, { id: "achet", m: 1 }, { id: "hausbau", m: 5, only: f => f.hausWeg },
    { id: "aussaat", m: 6 }, { id: "wachsen", m: 7 }, { id: "ernte", m: 10 }, { id: "versorgung", m: 10 },
    { id: "verloren", m: 10, only: f => f.verloren }, { id: "trockenzeit", m: 11, only: f => f.dorf === "dorf" && !f.verloren },
    { id: "beruf", m: 11, only: f => !f.verloren }
  ],
  4: [
    { id: "sirius", m: 1 }, { id: "achet", m: 1 }, { id: "aussaat", m: 5 }, { id: "wachsen", m: 6 },
    { id: "ernte", m: 9 }, { id: "versorgung", m: 9 }, { id: "trockenzeit", m: 10 }, { id: "jahresende", m: 12 }
  ]
};
export const LAST_YEAR = 4;

/* nächste Phase oder null (dann folgt die Bilanz). Wer verloren hat und weiterspielt, springt zur Bilanz. */
export function nextPhase(year, phase, flags = {}){
  let y = year, i = PHASES[y].findIndex(p => p.id === phase);
  for (;;){
    i++;
    if (i >= PHASES[y].length){
      if (y === LAST_YEAR || (y === 3 && flags.verloren)) return null;
      y++; i = 0;
    }
    const p = PHASES[y][i];
    if (!p.only || p.only(flags)) return { year: y, phase: p.id };
  }
}
export const monthOf = (year, phase) => (PHASES[year].find(p => p.id === phase) || { m: 1 }).m;

/* Wachstum: so viele Monate klickt man durch */
export const growMonths = year => (year === 3 ? [7, 8, 9] : [6, 7, 8]);

/* Wasserstand im Monat (Achet) als Anteil 0..1 des Höchststands */
export const RISE = [0.25, 0.55, 0.8, 1];
export const RISE_HOCH = [0.3, 0.62, 0.87, 1];   // im 3. Monat schon über der Marke „gut“

/* Wie viele Jahreszeiten sind im Kalender schon benannt? */
export function seasonsKnown(year, phase, month){
  if (year > 1) return 3;
  if (phase === "jahresende") return 3;
  if (["ernte", "versorgung", "trockenzeit"].includes(phase)) return 2;
  if (phase === "wachsen" && month >= 8) return 2;
  if (phase === "achet" && month < 4) return 0;
  if (phase === "sirius") return 0;
  return 1;
}

/* Wurde das Feld überschwemmt? (Dann liegt Schlamm darauf – und die Grenzsteine sind umgeworfen.) */
export const flooded = (year, i) => (year === 2 ? i === 0 : true);

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
  if (year === 1 || year === 4) return NUM.ertragGut;
  if (year === 2){
    if (i === 0) return NUM.ertragNiedrig;
    if (i === 1) return buckets >= NUM.schadufVoll ? NUM.ertragSchadufVoll : buckets >= NUM.schadufHalb ? NUM.ertragSchadufHalb : 0;
    return 0;
  }
  return NUM.ertragSpaet;
}

/* Gesamternte. sown: [true/false ×3] */
export function harvest(year, sown, buckets = 0){
  return sown.reduce((s, on, i) => s + (on && sowable(year, i, buckets) ? fieldYield(year, i, buckets) : 0), 0);
}

/* ---------- Arbeitskraft ---------- */

/* Grenze nach der Flut: aufrichten (1), nach dem Hochwasser neu festlegen mit Streit (2), Landvermesser (0).
   ctx: { landvermesser, kupfer } – Vorteile durch Berufe in Jahr 4 */
export function grenzeKosten(year, i, ctx = {}){
  if (!flooded(year, i)) return 0;
  if (year === 3) return K().grenzeStreit;
  if (year === 4 && ctx.landvermesser) return 0;
  return K().grenzstein;
}
export const ernteKosten = (ctx = {}) => (ctx.kupfer ? K().ernteKupfer : K().ernten);

/* Arbeitsschritte eines Feldes in Reihenfolge, jeweils mit Kosten */
export function fieldSteps(year, i, ctx = {}){
  const steps = [];
  const g = grenzeKosten(year, i, ctx);
  if (g > 0) steps.push({ id: year === 3 ? "grenzeNeu" : "grenzstein", cost: g });
  steps.push({ id: "pfluegen", cost: K().pfluegen }, { id: "saeen", cost: K().saeen });
  return steps;
}

/* Kraft, die ein Feld vom jetzigen Stand bis zur fertigen Ernte noch braucht.
   f: { grenze, plowed, sown, done } */
export function fieldRest(year, i, f, ctx = {}){
  if (f.done) return 0;
  let n = 0;
  for (const s of fieldSteps(year, i, ctx)){
    const isDone = s.id === "pfluegen" ? f.plowed : s.id === "saeen" ? f.sown : f.grenze;
    if (!isDone) n += s.cost;
  }
  return n + ernteKosten(ctx);
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

/* Jahr 3 allein: Was macht das Hochwasser mit Hof und Vorrat? Nur ein fertiger Erdwall schützt. */
export function hochwasserAllein(vorrat, wallFertig){
  return wallFertig ? { lost: 0, house: "steht" } : { lost: vorrat, house: "zerstoert" };
}

/* Tauschen geht nur in Jahren, in denen die Nachbarn selbst genug haben */
export const tauschMoeglich = year => year === 1 || year === 4;

/* Verloren: zwei Hungerjahre hintereinander */
export const verloren = hungerByYear => [1, 2, 3].some(y => hungerByYear[y] && hungerByYear[y + 1]);

/* ---------- Ganzes Spiel ohne Bildschirm durchrechnen (für Tests und das Flussdiagramm) ----------
   Strategie:
   y1Wall: Kraft, die nach der Ernte in Jahr 1 in den Erdwall geht (der Rest wird zu Körben)
   buckets: Eimer am Schaduf in Jahr 2 (0 = kein Schaduf)
   dorf: "dorf" | "allein" · wall2: allein in Jahr 2 am Erdwall weiterbauen · beruf: Beruf in Jahr 4
   Jede übrige Kraft in Tauschjahren wird zu Körben. */
export function simulate({ y1Wall = 0, buckets = NUM.schadufVoll, dorf = "dorf", wall2 = true, beruf = "toepfer" } = {}){
  const k = K();
  let vorrat = NUM.startVorrat, wall = 0, schuld = 0, hausWeg = false;
  const years = {}, hunger = {}, kraft = {};
  const ctx4 = dorf === "dorf" ? { landvermesser: beruf === "landvermesser", kupfer: beruf === "weberin" } : {};
  const pay = (have, n) => { const p = Math.min(Math.max(have, 0), n); return [have - p, n - p]; };
  const fieldsCost = (year, n, ctx = {}) => {
    let c = 0;
    for (let i = 0; i < n; i++) c += fieldRest(year, i, {}, ctx);
    return c;
  };

  for (let year = 1; year <= LAST_YEAR; year++){
    let have = NUM.kraft;
    const use = { felder: 0, schaduf: 0, schutz: 0, koerbe: 0, nachholen: 0 };
    let sown = [false, false, false], b = 0;
    if (year === 3 && hausWeg){ have -= k.haus; use.schutz += k.haus; }
    if (year === 2){
      sown[0] = true; have -= fieldRest(2, 0, {}); use.felder += fieldRest(2, 0, {});
      if (buckets > 0){
        b = buckets;
        have -= k.schadufBau + b * k.eimer; use.schaduf += k.schadufBau + b * k.eimer;
        if (sowable(2, 1, b)){ sown[1] = true; have -= fieldRest(2, 1, {}); use.felder += fieldRest(2, 1, {}); }
      }
    } else {
      const ctx = year === 4 ? ctx4 : {};
      for (let i = 0; i < 3; i++){
        const c = fieldRest(year, i, {}, ctx);
        if (c <= have){ sown[i] = true; have -= c; use.felder += c; }
      }
    }
    const h = harvest(year, sown, b);
    const village = year === 3 && dorf === "dorf" ? NUM.dorfspeicher : 0;
    const sp = supply(h, vorrat, village);
    vorrat = sp.vorrat;
    // Trockenzeit
    let wallYear = 0;
    if (year > 2 && schuld > 0){ const before = schuld; [have, schuld] = pay(have, schuld); use.nachholen += before - schuld; }
    if (year === 1){ wallYear = Math.min(have, y1Wall, k.erdwall); }
    if (year === 2 && dorf === "dorf"){
      vorrat -= Math.min(vorrat, NUM.dorfBeitrag);
      let rest; [have, rest] = pay(have, k.deich); use.schutz += k.deich - rest; schuld += rest;
    }
    if (year === 2 && dorf === "allein" && wall2) wallYear = Math.min(have, k.erdwall - wall);
    if (year === 3 && dorf === "dorf"){ let rest; [have, rest] = pay(have, k.deichAusbessern); use.schutz += k.deichAusbessern - rest; schuld += rest; }
    wall += wallYear; have -= wallYear; use.schutz += wallYear;
    let extra = 0;
    if (year === 4 && dorf === "dorf" && beruf === "toepfer") extra += NUM.toepferTausch;
    if (year === 4 && dorf === "dorf" && beruf === "verwalter") extra += NUM.verwalterLohn;
    if (tauschMoeglich(year)){ const n = Math.floor(have / k.korb); extra += n * NUM.korbTausch; have -= n * k.korb; use.koerbe += n * k.korb; }
    vorrat += extra;
    // Hochwasser am Anfang von Jahr 3 (allein)
    let flood = null;
    if (year === 2 && dorf === "allein"){ flood = hochwasserAllein(vorrat, wall >= k.erdwall); hausWeg = flood.house === "zerstoert"; vorrat -= flood.lost; }
    years[year] = { ...sp, sown, extra, vorratEnde: vorrat, flood, wall };
    kraft[year] = { ...use, frei: have };
    hunger[year] = sp.hunger > 0;
  }
  return { years, hunger, kraft, verloren: verloren(hunger), wallFertig: wall >= k.erdwall, schuld };
}
