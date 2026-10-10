/* Im Rhythmus des Nils 0.6 – Spiellogik ohne Bildschirm (in Node testbar).
   Vier Jahre ohne Zufall: Jahr 1 normale Flut, Jahr 2 zu niedrig, Jahr 3 zu hoch, Jahr 4 wieder normal.
   Jede Arbeit kostet Arbeitskraft; die Familie hat pro Jahr nur eine begrenzte Arbeitskraft (NUM.kraft).
   Die Werte sieht man im Spiel nicht als Zahlen, nur als Balken. Alle Zahlen stehen in content.js (NUM). */
import { NUM } from "./content.js";

export const FLOOD = { 1: "gut", 2: "niedrig", 3: "hoch", 4: "gut" };
const K = () => NUM.kosten;

/* Ablauf je Jahr. Jede Phase hat den Monat, in dem sie spielt (1–12).
   only: Phase gibt es nur, wenn die Bedingung erfüllt ist (f = Entscheidungen) */
export const PHASES = {
  1: [
    { id: "sirius", m: 1 }, { id: "achet", m: 1 }, { id: "aussaat", m: 5 }, { id: "wachsen", m: 6 },
    { id: "ernte", m: 9 }, { id: "versorgung", m: 9 }, { id: "trockenzeit", m: 10 }, { id: "jahresende", m: 12 }
  ],
  2: [
    { id: "sirius", m: 1 }, { id: "achet", m: 1 }, { id: "schadufWahl", m: 5 }, { id: "schaduf", m: 5, only: f => f.schaduf === "bauen" },
    { id: "aussaat", m: 5 }, { id: "wachsen", m: 6 }, { id: "ernte", m: 9 }, { id: "versorgung", m: 9 },
    { id: "verloren", m: 9, only: f => f.verloren },
    { id: "dorfRat", m: 10, only: f => !f.verloren }, { id: "dorfbau", m: 10, only: f => !f.verloren }
  ],
  3: [
    { id: "sirius", m: 1 }, { id: "achet", m: 1 }, { id: "aussaat", m: 6 }, { id: "wachsen", m: 7 },
    { id: "ernte", m: 10 }, { id: "versorgung", m: 10 }, { id: "trockenzeit", m: 11 }, { id: "jahresende", m: 12 }
  ],
  4: [
    { id: "sirius", m: 1 }, { id: "achet", m: 1 }, { id: "beruf", m: 4 }, { id: "aussaat", m: 5 }, { id: "wachsen", m: 6 },
    { id: "ernte", m: 9 }, { id: "versorgung", m: 9 }, { id: "trockenzeit", m: 10 }, { id: "jahresende", m: 12 }
  ]
};
export const LAST_YEAR = 4;

/* nächste Phase oder null (dann folgt die Bilanz; nach „verloren“ geht es nur mit „Noch einmal“ weiter) */
export function nextPhase(year, phase, flags = {}){
  let y = year, i = PHASES[y].findIndex(p => p.id === phase);
  if (phase === "verloren") return null;
  for (;;){
    i++;
    if (i >= PHASES[y].length){ if (y === LAST_YEAR || (y === 2 && flags.verloren)) return null; y++; i = 0; }
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

/* Grenze nach der Flut: Stein aufrichten, nach dem Hochwasser neu festlegen (Streit), mit Landvermesser gar nicht.
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

/* Arbeitskraft, die ein Feld vom jetzigen Stand bis zur fertigen Ernte noch braucht.
   f: { grenze, plowed, sown, done } */
export function fieldRest(year, i, f = {}, ctx = {}){
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

/* Hunger schwächt: Je mehr Säcke im Vorjahr fehlten, desto weniger Arbeitskraft hat die Familie.
   Fehlen zu viele, muss die Familie den Hof verlassen (verloren). */
export const kraftImJahr = (hungerVorjahr = 0) => Math.max(0, NUM.kraft - hungerVorjahr * NUM.hungerSchwaeche);
export const hofVerloren = hunger => hunger >= NUM.hofVerlassen;

/* Körbe tauschen geht nur, wenn die Nachbarn Getreide übrig haben: nicht nach der schlechten Flut in Jahr 2 */
export const tauschMoeglich = year => year !== 2;

/* Dorfbau in Jahr 2: drei Schritte mit so vielen Gesten; die übrige Arbeitskraft wird darauf verteilt */
export const DORFBAU = [{ id: "deich", n: 2 }, { id: "haeuser", n: 2 }, { id: "speicher", n: 1 }];
export const dorfbauGesten = () => DORFBAU.reduce((s, x) => s + x.n, 0);

/* ---------- Ganzes Spiel ohne Bildschirm durchrechnen (für Tests und das Flussdiagramm) ----------
   koerbe1: Körbe in der Trockenzeit von Jahr 1 (null = so viele wie möglich) · buckets: Eimer am Schaduf (0 = kein Schaduf)
   beruf: Beruf in Jahr 4. In den Trockenzeiten von Jahr 3 und 4 wird alle übrige Kraft zu Körben. */
export function simulate({ koerbe1 = null, buckets = NUM.schadufVoll, beruf = "toepfer" } = {}){
  const k = K();
  let vorrat = NUM.startVorrat;
  const years = {}, kraft = {};
  const ctx4 = { landvermesser: beruf === "landvermesser", kupfer: beruf === "weberin" };
  let hungerVorjahr = 0, lost = false;
  for (let year = 1; year <= LAST_YEAR; year++){
    let have = kraftImJahr(hungerVorjahr);
    const start = have;
    const use = { felder: 0, schaduf: 0, dorf: 0, koerbe: 0 };
    const ctx = year === 4 ? ctx4 : {};
    let sown = [false, false, false], b = 0;
    const work = (i) => { const c = fieldRest(year, i, {}, ctx); sown[i] = true; have -= c; use.felder += c; };
    if (year === 2){
      work(0);
      if (buckets > 0){
        b = buckets; const c = k.schadufBau + b * k.eimer; have -= c; use.schaduf += c;
        if (sowable(2, 1, b)) work(1);
      }
    } else for (let i = 0; i < 3; i++) if (fieldRest(year, i, {}, ctx) <= have) work(i);
    const sp = supply(harvest(year, sown, b), vorrat, year === 3 ? NUM.dorfspeicher : 0);
    vorrat = sp.vorrat;
    hungerVorjahr = sp.hunger;
    if (year === 2 && hofVerloren(sp.hunger)){ years[year] = { ...sp, sown, kraftStart: start }; lost = true; break; }
    let extra = 0, beitrag = 0;
    if (year === 2){ beitrag = Math.min(vorrat, NUM.dorfBeitrag); vorrat -= beitrag; use.dorf += have; have = 0; }
    if (year === 3){ const c = Math.min(have, k.deichAusbessern); have -= c; use.dorf += c; }
    if (year === 4 && beruf === "toepfer") extra += NUM.toepferTausch;
    if (year === 4 && beruf === "verwalter") extra += NUM.verwalterLohn;
    if (tauschMoeglich(year)){
      let n = Math.floor(have / k.korb + 1e-9);
      if (year === 1 && koerbe1 != null) n = Math.min(n, koerbe1);
      extra += n * NUM.korbTausch; have -= n * k.korb; use.koerbe += n * k.korb;
    }
    vorrat += extra;
    years[year] = { ...sp, sown, extra, beitrag, vorratEnde: vorrat, kraftStart: start };
    kraft[year] = { ...use, frei: Math.max(0, have) };
  }
  return { years, kraft, verloren: lost };
}
