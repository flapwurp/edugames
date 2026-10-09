/* Im Rhythmus des Nils 0.3 – Bildschirme und Bedienung (Querformat) */
import { NUM, GAME, SEASONS, UI, MERKSAETZE, ROLLE_REIHENFOLGE, TEXT, BILANZ, QUELLE, QUELLTEXT, AUSSAGEN,
  URTEIL, QUELLE_BELEGE, ALLERDINGS, SPIELBELEGE, IMPULS, BEGRIFFE } from "./content.js";
import { nextPhase, monthOf, RISE, seasonsKnown, sowable, fieldYield, supply, hochwasserAllein, verloren } from "./sim.js";
import { scene, villageView, LEVEL, GROUND, big } from "./scene.js";
import * as A from "./assets.js";
import { createStore } from "../shared/session.js";
import { esc, openSheet, closeSheet, toast, clearToast } from "../shared/ui.js";

const $app = document.getElementById("app");
const freshFields = () => [0, 1, 2].map(() => ({ plowed: false, sown: false, done: false }));
const fresh = () => ({
  screen: "start", year: 1, phase: "sirius", month: 1,
  fields: freshFields(), buckets: 0, vorrat: NUM.startVorrat, harvested: 0,
  e1: null, schaduf: null, dorf: null, beruf: null, dorfStep: 0, vermessen: false, last: null,
  supplies: {}, hunger: {}, lost: false, flood3: null, ledger: [], versuch: 1, snap: null,
  rolle: [], neu: [], q: null, pick: {}
});
const store = createStore("nil-v03-archiv", fresh);
let S = store.load() || fresh();
const save = () => store.save(S);
const fill = (t, p = {}) => String(t).replace(/\{(\w+)\}/g, (_, k) => (k in p ? p[k] : `{${k}}`))
  .replace(/(^|\D)1 Säcken?(?!\p{L})/gu, (_, pre) => pre + "1 Sack");
const flags = () => ({ schaduf: S.schaduf, dorf: S.dorf, verloren: S.lost });

/* ---------- Hilfsfunktionen ---------- */

function learn(id){ if (!S.rolle.includes(id)){ S.rolle.push(id); S.neu.push(id); } }

/* Vorrat sichtbar verbuchen */
function book(key, delta){
  if (!delta) return;
  S.vorrat += delta;
  S.ledger.push({ y: S.year, key, delta, total: S.vorrat });
}

const FIELD_X = [272, 500, 702];
const alone3 = () => S.year === 3 && S.dorf === "allein";

function calendar(){
  const month = S.month;
  const known = seasonsKnown(S.year, S.phase, month);
  return `<div class="cal" aria-label="Kalender, Monat ${month}">${SEASONS.map((x, b) => {
    const cells = [1, 2, 3, 4].map(k => { const m = b * 4 + k; return `<span class="m ${m < month ? "past" : m === month ? "now" : ""}"></span>`; }).join("");
    const name = b < known ? `<b>${x.name}</b><small>${x.de}</small>` : `<b class="unknown">?</b><small>&nbsp;</small>`;
    return `<div class="season ${b * 4 < month && month <= b * 4 + 4 ? "on" : ""}"><div class="cells">${cells}</div>${name}</div>`;
  }).join("")}</div>`;
}

function topbar(){
  const n = S.rolle.length;
  return `<header class="top">
    <span class="yr">${S.screen === "spiel" ? fill(UI.jahr, { n: S.year }) : esc(GAME.title)}</span>
    ${S.screen === "spiel" ? calendar() : `<span class="spacer"></span>`}
    <div class="tools">
      <button class="chip" data-act="rolle">${esc(UI.rolle)}${n ? ` <span class="badge">${n}</span>` : ""}</button>
      <button class="chip" data-act="begriffe">${esc(UI.begriffe)}</button>
      <button class="chip" data-act="pause">${esc(UI.pause)}</button>
    </div>
  </header>`;
}

const newNotes = () => S.neu.map(id => `<div class="neu"><small>${esc(UI.neuAufRolle)}</small><p>${esc(MERKSAETZE[id])}</p></div>`).join("");
const sacks = (n, cls = "") => `<span class="sacks ${cls}" aria-label="${n} Säcke">${n > 0 ? A.sack(22).repeat(n) : "–"}</span>`;

/* Speicher mit Verbuchung des laufenden Jahres */
function vorratBox(){
  const rows = S.ledger.slice(-4).map(e =>
    `<li><b class="${e.delta > 0 ? "plus" : "minus"}">${e.delta > 0 ? "+" : "−"}${Math.abs(e.delta)}</b> ${esc(UI.buchung[e.key])}${e.y !== S.year ? ` <small>(Jahr ${e.y})</small>` : ""}</li>`).join("");
  return `<div class="vorrat"><small>${esc(UI.vorrat)}: ${fill(UI.saecke, { n: S.vorrat })}</small>${sacks(S.vorrat)}${rows ? `<ul class="ledger">${rows}</ul>` : ""}</div>`;
}

/* Die vier Familienmitglieder mit ihren Schalen */
function familyBowls(fillLevel){
  const people = [0, 1, 2, 3].map(i => `<g transform="translate(${30 + i * 62} 0)">${A.person({ x: 0, y: 64, pose: "stehen", n: i, kind: i === 3, scale: 0.72 })}
    <g transform="translate(-20 64)">${A.bowl(fillLevel).replace(/<svg[^>]*>|<\/svg>/g, "")}</g></g>`).join("");
  return `<figure class="family"><svg viewBox="0 0 252 98" aria-hidden="true">${people}</svg><figcaption>${esc(UI.familie)}</figcaption></figure>`;
}

/* Grundzustand der Szene für Jahr und Phase */
function baseScene(){
  const y = S.year;
  const st = { sky: "peret", water: { level: LEVEL.normal }, fields: [], people: [] };
  const villageNow = (y === 3 && S.dorf === "dorf") || (S.phase === "dorfbau" && S.dorfStep > 0);
  if (!villageNow){
    const ruined = alone3() && S.flood3 && S.flood3.house === "zerstoert";
    st.hof = { fill: ruined ? 0 : Math.min(1, (S.vorrat + S.harvested) / 12), wall: S.e1 === "wall", ruined };
  } else {
    const stage = y === 3 ? 1 : S.dorfStep / 3;
    st.village = { dike: true, stage, fill: y === 3 ? Math.max(0.15, (NUM.dorfspeicher - (S.supplies[3] ? S.supplies[3].help : 0)) / 12) : 0.4 };
  }
  if (y === 3) st.hutRuined = true; else st.hut = true;
  return st;
}

/* Feldzustände für Aussaat, Wachsen, Ernte */
function fieldViews(stage){
  return S.fields.map((f, i) => {
    const okToSow = sowable(S.year, i, S.buckets);
    let soil = S.year === 2 && !okToSow ? "trocken" : "schlamm";
    if (f.plowed) soil = "gepflueg";
    let plants = null;
    if (f.sown) plants = stage || "saat";
    if (f.done) plants = "stoppel";
    if (stage && !f.sown && S.year === 2 && i > 0) plants = "verdorrt";
    return { soil, plants, boundary: S.year !== 3 || S.dorf !== "dorf" || S.vermessen };
  });
}

/* ---------- Bildschirme ---------- */

function render(){ ({ start, spiel, bilanz, quelle, urteil, impuls }[S.screen] || start)(); }

function layout(sceneSVG, panelHTML){
  $app.innerHTML = `${topbar()}<div class="stage">${sceneSVG}</div><section class="panel">${panelHTML}</section>
    <p class="portrait-hint">${esc(GAME.hochkant)}</p>`;
}

function panel({ titel, text = "", extra = "", actions = "", side = "" }){
  const notes = newNotes();
  const right = side || actions || notes ? `<div class="side"><div class="actions">${actions}</div>${side}${notes}</div>` : "";
  return `<div class="say"><h2>${esc(titel)}</h2>${text ? `<p>${esc(text)}</p>` : ""}${extra}</div>${right}`;
}
const btn = (act, label, attrs = "", cls = "") => `<button class="btn ${cls}" data-act="${act}" ${attrs}>${esc(label)}</button>`;
const choices = (act, opts, p = {}) => `<div class="choices">${Object.entries(opts).map(([id, o]) =>
  `<button class="choice" data-act="${act}" data-id="${id}"><b>${esc(fill(o.name, p))}</b><span>${esc(fill(o.text, p))}</span></button>`).join("")}</div>`;

function start(){
  const intro = scene({ sky: "peret", water: { level: LEVEL.normal }, fields: [{ soil: "gepflueg", plants: "aehre" }, { soil: "gepflueg", plants: "aehre" }, { soil: "gepflueg", plants: "halm" }],
    hof: { fill: 0.5 }, hut: true, people: [{ x: 300, pose: "hacken", n: 0 }, { x: 900, pose: "tragen", n: 1 }, { x: 940, pose: "stehen", n: 2, kind: true }] });
  $app.innerHTML = `${topbar()}<main class="startpage">
    <div class="stage">${intro}</div>
    <div class="startbox">
      <h1>${esc(GAME.title)}</h1>
      <p class="sub">${esc(GAME.subtitle)}</p>
      <p class="leitfrage">${esc(GAME.leitfrage)}</p>
      ${GAME.intro.map(p => `<p>${esc(p)}</p>`).join("")}
      <button class="btn" data-act="startGame">${esc(UI.start)}</button>
    </div></main><p class="portrait-hint">${esc(GAME.hochkant)}</p>`;
}

function spiel(){
  ({ sirius: pSirius, achet: pAchet, schadufWahl: pSchadufWahl, schaduf: pSchaduf, aussaat: pAussaat, wachsen: pWachsen,
    ernte: pErnte, versorgung: pVersorgung, brache: pBrache, jahresende: pJahresende, dorfWahl: pDorfWahl, dorfbau: pDorfbau,
    vermessen: pVermessen, verloren: pVerloren, beruf: pBeruf }[S.phase])();
}

function pSirius(){
  const st = baseScene();
  st.sky = "dawn"; st.water = { level: LEVEL.tief };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache", plants: S.year === 1 ? "stoppel" : null }));
  st.people = [{ x: S.year === 3 && S.dorf === "dorf" ? 980 : 846, pose: "winken", n: 0, flip: true }];
  const T = alone3() ? TEXT.sirius.allein : TEXT.sirius[S.year];
  layout(scene(st), panel({ titel: T.titel, text: T.text, actions: btn("toAchet", T.knopf), side: S.year > 1 ? vorratBox() : "" }));
}

function pAchet(){
  const st = baseScene();
  st.sky = "achet";
  const peak = LEVEL[{ 1: "gut", 2: "niedrig", 3: "hoch" }[S.year]];
  const r = S.year < 3 ? RISE[S.month - 1] : 1;
  st.water = { level: Math.round(LEVEL.tief + (peak - LEVEL.tief) * r), kind: "flut" };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache" }));
  st.labels = ["nilmesser"];
  st.people = S.year === 3 && S.dorf === "dorf" ? [{ x: 1124, pose: "stehen", n: 1 }] : [{ x: 1040, pose: "stehen", n: 1 }];
  if (S.year < 3){
    const last = S.month === 4;
    st.nmLabels = last;
    if (last && S.year === 1){ st.labels.push("hof"); learn("steigt"); }
    if (S.year === 2) st.people.push({ x: 1066, pose: "stehen", n: 2, kind: true });
    const texts = S.year === 1 ? TEXT.achet.monate : TEXT.achet[2].monate;
    layout(scene(st), panel({ titel: `${S.year === 2 ? "Jahr 2, " : ""}Achet – ${S.month}. Monat`, text: texts[S.month - 1],
      actions: last ? btn("toNext", S.year === 1 ? TEXT.achet.knopf1 : TEXT.achet[2].knopf) : btn("nextMonth", UI.naechsterMonat) }));
    return;
  }
  st.nmLabels = true;
  learn("hoch"); learn("deich");
  if (S.dorf === "dorf"){
    st.ghost = LEVEL.hoch; st.labels.push("deich");
    const T = TEXT.achet[3];
    layout(scene(st), panel({ titel: T.titel, text: T.text, actions: btn("toNext", T.knopf), side: vorratBox() }));
  } else {
    st.people = [{ x: 1124, pose: "stehen", n: 1 }, { x: 1100, pose: "stehen", n: 3, kind: true }];
    const T = TEXT.achet.allein;
    layout(scene(st), panel({ titel: T.titel, text: (S.e1 === "wall" ? T.wall : T.ohne) + " " + T.dorf, actions: btn("toNext", T.knopf), side: vorratBox() }));
  }
}

function pSchadufWahl(){
  const st = baseScene();
  st.water = { level: LEVEL.tief }; st.ditchWater = true;
  st.fields = [{ soil: "schlamm" }, { soil: "trocken" }, { soil: "trocken" }];
  st.labels = ["graben"];
  const T = TEXT.schadufWahl, p = { n: NUM.schadufKosten };
  if (!S.schaduf){
    st.people = [{ x: 470, pose: "winken", n: 4 }, { x: 520, pose: "stehen", n: 0, flip: true }];
    layout(scene(st), panel({ titel: T.titel, text: fill(T.text, p), extra: choices("wahlSchaduf", T.optionen, p), side: vorratBox() }));
    return;
  }
  if (S.schaduf === "bauen"){ st.shaduf = { t: 0.5, n: 0 }; st.labels.push("schaduf"); }
  layout(scene(st), panel({ titel: T.titel, text: fill(S.schaduf === "bauen" ? T.gebaut : T.gelassen, p), side: vorratBox(), actions: btn("toNext", UI.weiter) }));
}

function pSchaduf(){
  const st = baseScene();
  st.water = { level: LEVEL.tief }; st.ditchWater = true;
  const wet = S.buckets >= NUM.schadufHalb;
  st.fields = [{ soil: "schlamm" }, { soil: wet ? "schlamm" : "trocken" }, { soil: "trocken" }];
  st.shaduf = { t: S.shadufT ?? 0.5, n: 0 };
  st.labels = ["schaduf", "graben"];
  if (S.buckets < NUM.schadufVoll) st.hot = [{ id: "schaduf", act: "schoepfen", label: "Schaduf: Wasser schöpfen" }];
  const T = TEXT.schaduf;
  const meter = `<div class="meter" aria-label="${fill(T.eimer, { n: S.buckets })}">${Array.from({ length: NUM.schadufVoll }, (_, i) =>
    `<span class="${i < S.buckets ? "on" : ""}"></span>`).join("")}<b>${fill(T.eimer, { n: S.buckets })}</b></div>`;
  let fb = "";
  if (S.buckets >= NUM.schadufVoll) fb = T.voll; else if (wet) fb = T.halb + " " + T.muede; else if (S.buckets > 0) fb = T.muede;
  layout(scene(st), panel({ titel: T.titel, text: T.text, extra: meter + (fb ? `<p class="fb">${esc(fb)}</p>` : ""), actions: btn("toNext", T.weiter) }));
}

function pAussaat(){
  const st = baseScene();
  st.water = { level: LEVEL.normal };
  if (S.year === 2){ st.water = { level: LEVEL.tief }; st.ditchWater = true; if (S.schaduf === "bauen") st.shaduf = { t: 0.5, n: 0 }; }
  st.fields = fieldViews(null);
  st.hot = S.fields.map((f, i) => ({ id: "f" + i, act: "feld", label: f.plowed ? TEXT.aussaat.saeen : TEXT.aussaat.pfluegen, done: f.sown }));
  if (S.last){
    const i = S.last.i, x = FIELD_X[i], F = [GROUND.f1, GROUND.f2, GROUND.f3][i];
    if (S.last.what === "plow") st.extra = big(A.plowTeam({ x: x + 60, y: F.y, n: 1 }), x + 60, F.y, 0.92);
    else st.people.push({ x: x - 10, pose: "saeen", n: 2 });
  }
  const T = TEXT.aussaat;
  const done = S.fields.every((f, i) => f.sown || !sowable(S.year, i, S.buckets));
  const status = `<ul class="checks">${S.fields.map((f, i) => {
    const can = sowable(S.year, i, S.buckets);
    const name = ["Feld am Ufer", "mittleres Feld", "oberes Feld"][i];
    const state = !can ? "zu trocken" : f.sown ? "gesät" : f.plowed ? "gepflügt" : "noch nicht bestellt";
    return `<li class="${f.sown ? "ok" : !can ? "no" : ""}">${name}: ${state}</li>`;
  }).join("")}</ul>`;
  layout(scene(st), panel({ titel: T[S.year].titel, text: T[S.year].text, extra: status, actions: btn("toNext", T.fertig, done ? "" : "disabled") }));
}

function pWachsen(){
  const st = baseScene();
  st.water = { level: S.year === 2 ? LEVEL.tief : LEVEL.normal };
  if (S.year === 2 && S.schaduf === "bauen") st.shaduf = { t: 0.5, n: 0 };
  let stage = "aehre", text, act = btn("toNext", "Zur Ernte");
  if (S.year === 1){
    stage = ["keim", "halm", "aehre"][S.month - 6];
    text = TEXT.wachsen.monate[S.month - 6] + (S.month === 8 ? " " + TEXT.wachsen.fertig : "");
    if (S.month < 8) act = btn("nextMonth", UI.naechsterMonat);
  } else text = TEXT.wachsen[S.year];
  st.fields = fieldViews(stage);
  st.people = [{ x: 680, pose: "hacken", n: 3 }];
  layout(scene(st), panel({ titel: `Peret – ${S.month}. Monat`, text, actions: act }));
}

function pErnte(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief };
  if (S.year === 2 && S.schaduf === "bauen") st.shaduf = { t: 0.5, n: 0 };
  st.fields = fieldViews("reif");
  st.hot = S.fields.map((f, i) => ({ id: "f" + i, act: "ernten", label: "ernten", done: f.done || !f.sown }));
  if (S.last && S.last.what === "reap") st.people.push({ x: FIELD_X[S.last.i] + 20, pose: "ernten", n: S.last.i });
  if (S.harvested > 0) st.people.push({ x: S.year === 3 && S.dorf === "dorf" ? 1010 : 960, pose: "tragen", n: 1 });
  st.labels = [st.village ? "dorfspeicher" : "speicher"];
  const done = S.fields.every(f => f.done || !f.sown);
  const T = TEXT.ernte;
  layout(scene(st), panel({ titel: T.titel, text: S.year === 3 ? T[3] : T.text,
    extra: `<p class="big">${fill("Geerntet: {n} Säcke", { n: S.harvested })}</p>${sacks(S.harvested, "row")}`,
    actions: btn("toVersorgung", T.fertig, done ? "" : "disabled"), side: vorratBox() }));
}

function pVersorgung(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief };
  st.fields = S.fields.map(f => ({ soil: "brache", plants: f.sown ? "stoppel" : null }));
  if (S.year === 2){ if (!S.fields[1].sown) st.fields[1] = { soil: "trocken", plants: "verdorrt" }; st.fields[2] = { soil: "trocken", plants: "verdorrt" }; }
  const sp = S.supplies[S.year];
  const T = TEXT.versorgung;
  const xs = st.village ? [960, 990, 1040, 1066] : [870, 900, 930, 956];
  st.people = [0, 1, 2, 3].map(i => ({ x: xs[i], pose: "stehen", n: i, kind: i === 3 }));
  let res = "", bowl = 1;
  if (sp.status === "satt") res = fill(T.satt, { n: sp.surplus });
  if (sp.status === "knapp"){ res = fill(T.knapp, { n: sp.fromVorrat }); bowl = 0.5; }
  if (sp.status === "hunger"){ res = fill(alone3() ? T.alleinHunger : T.hunger, { n: sp.hunger }) + (S.year === 2 ? " " + T.nachbarn : ""); bowl = 0; }
  if (sp.status === "geholfen") res = fill(T.geholfen, { n: sp.help });
  layout(scene(st), panel({ titel: T.titel, text: fill(T.ernte, { n: sp.harvest }) + " " + fill(T.bedarf, { n: sp.need }),
    extra: `${sacks(sp.harvest, "row")}<div class="result ${sp.status}">${familyBowls(bowl)}<p>${esc(res)}</p></div>`,
    side: vorratBox(), actions: btn("toNext", UI.weiter) }));
}

function pBrache(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache", plants: "stoppel" }));
  const T = TEXT.brache;
  if (!S.e1){
    st.people = [{ x: 850, pose: "stehen", n: 0 }, { x: 1040, pose: "stehen", n: 1 }];
    layout(scene(st), panel({ titel: T.titel, text: T.text, extra: choices("e1", T.optionen), side: vorratBox() }));
    return;
  }
  if (S.e1 === "kruege") st.extra = big(A.potter({ x: 1030, y: GROUND.site.y, n: 3 }), 1030, GROUND.site.y);
  else st.people = [{ x: 818, pose: "bauen", n: 0 }, { x: 1040, pose: "tragen", n: 2 }];
  layout(scene(st), panel({ titel: T.titel, text: fill(T.ergebnis[S.e1], { n: NUM.kruegeTausch }), side: vorratBox(), actions: btn("toNext", UI.weiter) }));
}

function pJahresende(){
  const st = baseScene();
  st.sky = "dawn"; st.water = { level: LEVEL.tief };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache", plants: "stoppel" }));
  st.people = [{ x: 846, pose: "winken", n: 0, flip: true }];
  const T = TEXT.jahresende;
  layout(scene(st), panel({ titel: T.titel, text: T.text, actions: btn("toNext", T.knopf), side: vorratBox() }));
}

function pDorfWahl(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief }; st.oldMark = true;
  st.fields = [{ soil: "brache", plants: "stoppel" }, { soil: "brache", plants: S.fields[1].sown ? "stoppel" : "verdorrt" }, { soil: "trocken", plants: "verdorrt" }];
  const T = TEXT.dorfWahl, p = { n: NUM.dorfBeitrag };
  if (!S.dorf){
    st.people = [0, 1, 2, 3, 4, 5].map(i => ({ x: 760 + i * 28, pose: "stehen", n: i, flip: i % 2 === 1 }));
    const versuch = S.versuch > 1 ? `<p class="fb">Zweiter Versuch: Du entscheidest noch einmal.</p>` : "";
    layout(scene(st), panel({ titel: T.titel, text: T.text, extra: versuch + choices("wahlDorf", T.optionen, p), side: vorratBox() }));
    return;
  }
  st.people = [{ x: 1040, pose: "stehen", n: 1 }];
  const text = S.dorf === "allein" ? T.allein : (S.ledger.some(e => e.y === 2 && e.key === "dorf") ? "" : T.nichtsDa);
  layout(scene(st), panel({ titel: T.titel, text, side: vorratBox(), actions: btn("toNext", UI.weiter) }));
}

function pDorfbau(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief }; st.oldMark = true;
  st.fields = [{ soil: "brache", plants: "stoppel" }, { soil: "brache", plants: S.fields[1].sown ? "stoppel" : "verdorrt" }, { soil: "trocken", plants: "verdorrt" }];
  const T = TEXT.dorfbau;
  const k = S.dorfStep;
  if (k > 0 && k < 3) st.people = [{ x: 770, pose: "bauen", n: 0 }, { x: 880, pose: "tragen", n: 4 }, { x: 1000, pose: "bauen", n: 5 }, { x: 1090, pose: "tragen", n: 2 }];
  else if (k === 0) st.people = [{ x: 820, pose: "bauen", n: 0 }, { x: 1060, pose: "tragen", n: 4 }];
  else st.people = [{ x: 1124, pose: "winken", n: 0 }];
  const steps = `<ol class="buildsteps">${T.schritte.map((x, i) => `<li class="${i < k ? "ok" : ""}">${esc(x.knopf)}${i < k ? " ✓" : ""}</li>`).join("")}</ol>`;
  const act = k < 3 ? btn("bauen", T.schritte[k].knopf) : btn("toNext", T.weiter);
  layout(scene(st), panel({ titel: T.titel, text: k === 0 ? T.text : k < 3 ? T.schritte[k - 1].text : T.fertig, extra: steps, actions: act }));
}

function pVermessen(){
  const st = baseScene();
  st.water = { level: LEVEL.normal };
  st.fields = [0, 1, 2].map(() => ({ soil: "schlamm", boundary: S.vermessen }));
  if (S.vermessen) st.extra = big(A.surveyor({ x: 420, y: GROUND.f2.y, n: 4 }), 420, GROUND.f2.y);
  const T = TEXT.vermessen;
  layout(scene(st), panel({ titel: T.titel, text: S.vermessen ? T.fertig : T.text, actions: S.vermessen ? btn("toNext", UI.weiter) : btn("vermessen", T.knopf) }));
}

function gruende(){
  const g = [];
  const s2 = S.supplies[2] || {}, s3 = S.supplies[3] || {};
  g.push(`Jahr 2: Die Flut war zu niedrig. Es fehlten ${s2.hunger} Säcke.`);
  if (S.e1 === "wall") g.push("In der Trockenzeit nach Jahr 1 habt ihr einen Erdwall gebaut statt Krüge zu tauschen. Dadurch hattet ihr weniger Vorrat.");
  if (S.schaduf === "lassen") g.push("Ihr habt keinen Schaduf gebaut. Das mittlere Feld blieb trocken.");
  else if (S.buckets < NUM.schadufVoll) g.push("Mit dem Schaduf habt ihr nur wenig Wasser geschöpft.");
  g.push(`Jahr 3: Ihr seid allein geblieben. Das Hochwasser ${S.flood3 && S.flood3.house === "zerstoert" ? "hat euren Hof zerstört" : "hat euren Speicher erreicht"}. Es fehlten ${s3.hunger} Säcke, und niemand hat geholfen.`);
  return g;
}

function pVerloren(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache", plants: "stoppel" }));
  st.people = [0, 1, 2, 3].map(i => ({ x: 1000 + i * 34, pose: "gehen", n: i, kind: i === 3 }));
  const T = TEXT.verloren;
  layout(scene(st), panel({ titel: T.titel, text: T.text,
    extra: `<p class="big">${esc(T.gruende)}</p><ul class="gruende">${gruende().map(x => `<li>${esc(x)}</li>`).join("")}</ul>`,
    actions: btn("nochmal", T.nochmal) + btn("toNext", T.weiter, "", "secondary") }));
}

function pBeruf(){
  const T = TEXT.beruf;
  if (S.dorf === "allein"){
    learn("berufe");
    layout(villageView({ fill: 0.3, alt: "Das Dorf der Nachbarn" }), panel({ titel: T.alleinTitel, text: T.allein, actions: btn("toNext", T.weiter) }));
    return;
  }
  if (!S.beruf){
    layout(villageView({ fill: 0.3, alt: "Das Dorf mit seinen Berufen" }), panel({ titel: T.titel, text: T.text, extra: `<div class="choices four">${Object.entries(T.optionen).map(([id, o]) =>
      `<button class="choice" data-act="beruf" data-id="${id}"><b>${esc(o.name)}</b><span>${esc(o.text)}</span></button>`).join("")}</div>` }));
    return;
  }
  layout(villageView({ fill: 0.3, mine: S.beruf, n: 0 }), panel({ titel: T.titel, text: fill(T.ergebnis, { name: T.optionen[S.beruf].name }), actions: btn("toNext", T.weiter) }));
}

/* ---------- Bilanz ---------- */

function bilanz(){
  const T = BILANZ;
  const s2 = S.supplies[2], s3 = S.supplies[3];
  const dorf = S.dorf === "dorf";
  const res = s => ({ satt: "satt", knapp: "gerade so satt, Vorrat leer", hunger: `Hunger (es fehlten ${s.hunger} Säcke)`, geholfen: "satt – mit Hilfe des Dorfspeichers" }[s.status]);
  const rows = [
    ["zu niedrig", "zu hoch"],
    [S.e1 === "wall" ? "Erdwall – nützte bei dieser Flut nichts" : "keiner", dorf ? "Deich und Dorf" : (S.e1 === "wall" ? "Erdwall – das Wasser lief darüber" : "keiner – der Hof wurde zerstört")],
    [`${s2.harvest} Säcke`, `${s3.harvest} Säcke (späte Aussaat)`],
    ["keine – die Nachbarn hatten selbst nichts", dorf ? `${s3.help} Säcke aus dem Dorfspeicher` : "keine"],
    [res(s2), res(s3) + (S.lost ? " – Hof verlassen" : "")]
  ];
  const table = `<table class="compare"><thead><tr><th></th><th>${esc(T.allein)}</th><th>${esc(dorf ? T.dorf : T.dorfAllein)}</th></tr></thead><tbody>${T.zeilen.map((z, i) =>
    `<tr><th>${esc(z)}</th><td>${esc(rows[i][0])}</td><td>${esc(rows[i][1])}</td></tr>`).join("")}</tbody></table>`;
  const ent = [
    `Trockenzeit Jahr 1: ${TEXT.brache.optionen[S.e1].name}`,
    `Jahr 2: ${TEXT.schadufWahl.optionen[S.schaduf].name}${S.schaduf === "bauen" ? ` (${S.buckets} Eimer geschöpft)` : ""}`,
    `Ende Jahr 2: ${TEXT.dorfWahl.optionen[S.dorf].name}`
  ];
  if (S.beruf) ent.push(`Jahr 3: Neuer Beruf – ${TEXT.beruf.optionen[S.beruf].name}`);
  S.neu = [];
  $app.innerHTML = `${topbar()}<main class="page">
    <h2>${esc(T.titel)}</h2>
    <div class="two">
      <section><h3>${esc(T.rolle)}</h3>${rolleHTML()}</section>
      <section><h3>${esc(T.vergleich)}</h3>${table}<h3>${esc(T.entscheidungen)}</h3><ul class="gruende">${ent.map(x => `<li>${esc(x)}</li>`).join("")}</ul></section>
    </div>
    <div class="actions">${btn("go", T.weiter, 'data-to="quelle"')}</div></main>`;
}

function rolleHTML(){
  const items = ROLLE_REIHENFOLGE.filter(id => S.rolle.includes(id)).map(id => `<li>${esc(MERKSAETZE[id])}</li>`).join("");
  return `<div class="scroll"><div class="rod"></div>${items ? `<ol>${items}</ol>` : `<p>${esc(UI.rolleLeer)}</p>`}<div class="rod"></div></div>`;
}

/* ---------- Quellenarbeit: Aussagen an die Stelle im Lied ziehen ---------- */

function shuffled(n){
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function quelle(){
  const T = QUELLTEXT;
  if (!S.q || S.q.order.length !== AUSSAGEN.length) S.q = { order: shuffled(AUSSAGEN.length), placed: {}, sel: null, msg: null };
  const q = S.q;
  const placedIn = zone => Object.entries(q.placed).filter(([, z]) => String(z) === String(zone)).map(([i]) =>
    `<div class="placed-card"><b>${esc(AUSSAGEN[i].text)}</b><small>${esc(AUSSAGEN[i].erklaerung)}</small></div>`).join("");
  const zones = QUELLE.bloecke.map((b, k) => `<div class="zone" data-zone="${k}" data-act="dropSel" role="button" tabindex="0">
      <p class="verse">${esc(b.text)}</p>${placedIn(k)}${q.sel != null ? `<span class="drop-hint">${esc(T.ablegen)}</span>` : ""}</div>`).join(`<p class="cut">[…]</p>`);
  const pile = q.order.filter(i => !(i in q.placed)).map(i =>
    `<button class="card ${q.sel === i ? "sel" : ""}" data-card="${i}" data-act="selCard">${esc(AUSSAGEN[i].text)}</button>`).join("");
  const done = Object.keys(q.placed).length === AUSSAGEN.length;
  const msg = q.msg ? `<p class="qmsg ${q.msg.ok ? "ok" : "no"}">${esc(q.msg.text)}</p>` : "";
  const summary = done ? `<div class="summary">
      <section><h3>${esc(T.sagt)}</h3><ul>${AUSSAGEN.filter(a => a.imLied).map(a => `<li>${esc(a.text)}</li>`).join("")}</ul></section>
      <section><h3>${esc(T.spiel)}</h3><ul>${AUSSAGEN.filter(a => !a.imLied).map(a => `<li>${esc(a.text)}</li>`).join("")}</ul></section>
      <div class="feedback"><p>${esc(T.schluss)}</p></div></div>
      <div class="actions">${btn("go", T.weiter, 'data-to="urteil"')}</div>` : "";
  $app.innerHTML = `${topbar()}<main class="page quelle-page"><h2>${esc(T.titel)}</h2><p>${esc(T.text)}</p>
    <div class="qgrid">
      <div>
        <figure class="source ${QUELLE.placeholder ? "placeholder" : ""}">
          ${QUELLE.placeholder ? `<p class="ph">Platzhalter – der Text der Quelle folgt.</p>` : ""}
          <figcaption><b>${esc(QUELLE.titel)}</b></figcaption>${zones}<p class="ref">${esc(QUELLE.angabe)}</p>
        </figure>
      </div>
      <aside class="pile-wrap"><h3>${esc(T.frage)}</h3><p class="small">${esc(T.anleitung)}</p>${msg}<div class="pile">${pile}</div>
        <div class="zone nicht" data-zone="nicht" data-act="dropSel" role="button" tabindex="0"><p class="verse"><b>${esc(T.nichtFeld)}</b></p>${placedIn("nicht")}${q.sel != null ? `<span class="drop-hint">${esc(T.ablegen)}</span>` : ""}</div></aside>
    </div>${summary}</main>`;
}

function placeCard(i, zone){
  const a = AUSSAGEN[i];
  const ok = a.imLied ? String(zone) === String(a.stelle) : zone === "nicht";
  if (ok){ S.q.placed[i] = zone; S.q.msg = { ok: true, text: QUELLTEXT.richtig + " " + a.erklaerung }; }
  else S.q.msg = { ok: false, text: QUELLTEXT.falsch + a.tipp };
  S.q.sel = null; save(); render();
}

/* Ziehen mit Finger oder Maus */
let drag = null, suppressClick = false;
document.addEventListener("pointerdown", e => {
  const card = e.target.closest(".card");
  if (!card || S.screen !== "quelle") return;
  drag = { i: +card.dataset.card, x: e.clientX, y: e.clientY, el: card, ghost: null };
});
document.addEventListener("pointermove", e => {
  if (!drag) return;
  if (!drag.ghost && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 8){
    drag.ghost = drag.el.cloneNode(true);
    drag.ghost.classList.add("ghost");
    drag.ghost.style.width = drag.el.offsetWidth + "px";
    document.body.appendChild(drag.ghost);
    drag.el.classList.add("dragging");
  }
  if (drag.ghost){
    e.preventDefault();
    drag.ghost.style.left = (e.clientX - drag.el.offsetWidth / 2) + "px";
    drag.ghost.style.top = (e.clientY - 20) + "px";
    document.querySelectorAll(".zone.over").forEach(z => z.classList.remove("over"));
    drag.ghost.style.display = "none";
    const z = document.elementFromPoint(e.clientX, e.clientY)?.closest(".zone");
    drag.ghost.style.display = "";
    if (z) z.classList.add("over");
  }
}, { passive: false });
document.addEventListener("pointerup", e => {
  if (!drag) return;
  const d = drag; drag = null;
  if (!d.ghost) return;
  d.ghost.remove();
  suppressClick = true; setTimeout(() => { suppressClick = false; }, 50);
  const z = document.elementFromPoint(e.clientX, e.clientY)?.closest(".zone");
  if (z) placeCard(d.i, z.dataset.zone); else render();
});
document.addEventListener("pointercancel", () => { if (drag && drag.ghost) drag.ghost.remove(); drag = null; render(); });

/* ---------- Urteil, Impuls ---------- */

function spielbelege(){
  const B = SPIELBELEGE, s2 = S.supplies[2] || {};
  const list = [B.schlamm, fill(B.ernte1, { n: (S.supplies[1] || {}).harvest || 12 }), B.niedrig];
  list.push(s2.status === "hunger" ? B.hunger : B.knapp);
  if (S.schaduf === "bauen") list.push(B.schaduf);
  list.push(B.hoch);
  if (S.dorf === "dorf") list.push(B.deich, B.speicher);
  else { if (S.flood3 && S.flood3.house === "zerstoert") list.push(B.alleinZerstoert); list.push(B.alleinHunger, B.dorfGeschuetzt); }
  return list;
}

function urteil(){
  const T = URTEIL;
  const spiel = spielbelege();
  const pickList = (key, list, title) => `<details class="pick" ${S.pick[key] === undefined ? "open" : ""}><summary><b>${esc(title)}</b>${S.pick[key] !== undefined ? `<span>${esc(list[S.pick[key]])}</span>` : ""}</summary>
    <div class="options">${list.map((t, i) => `<button class="opt ${S.pick[key] === i ? "sel" : ""}" data-act="pick" data-k="${key}" data-i="${i}">${esc(t)}</button>`).join("")}</div></details>`;
  const ready = ["spiel", "quelle", "allerdings"].every(k => S.pick[k] !== undefined);
  const hints = [null, spiel[S.pick.spiel], QUELLE_BELEGE[S.pick.quelle], ALLERDINGS[S.pick.allerdings]];
  const frame = T.gelaender.map((line, i) => `<li><span>${esc(line)}</span>${hints[i] ? `<small>${esc(T.stichpunkt + hints[i])}</small>` : i === 0 ? `<small>${esc(T.eigene)}</small>` : ""}</li>`).join("");
  $app.innerHTML = `${topbar()}<main class="page"><h2>${esc(T.titel)}</h2><p>${esc(T.text)}</p>
    <div class="two"><div>${pickList("spiel", spiel, T.wahlSpiel)}${pickList("quelle", QUELLE_BELEGE, T.wahlQuelle)}${pickList("allerdings", ALLERDINGS, T.wahlAllerdings)}</div>
    <div>${ready ? `<ol class="frame">${frame}</ol><div class="feedback"><p>${esc(T.heft)}</p></div>
    <div class="actions">${btn("go", T.impulsKnopf, 'data-to="impuls"', "secondary")}</div>` : ""}</div></div></main>`;
}

function impuls(){
  const T = IMPULS;
  const items = T.fragen.map(x => `<details class="impuls"><summary>${esc(x.frage)}</summary><p>${esc(x.hinweis)}</p></details>`).join("");
  $app.innerHTML = `${topbar()}<main class="page"><h2>${esc(T.titel)}</h2><p>${esc(T.text)}</p>${items}
    <div class="actions">${btn("go", T.zurueck, 'data-to="urteil"', "secondary")}</div></main>`;
}

/* ---------- Ablauf ---------- */

function goPhase(year, phase){
  clearToast();
  S.year = year; S.phase = phase; S.month = monthOf(year, phase); S.last = null; S.neu = [];
  if (phase === "sirius"){ S.fields = freshFields(); S.harvested = 0; }
  if (phase === "dorfWahl" && !S.dorf) S.snap = JSON.stringify({ ...S, snap: null });
  if (phase === "achet" && year === 3 && S.dorf === "allein" && !S.flood3){
    S.flood3 = hochwasserAllein(S.vorrat, S.e1 === "wall");
    book("flut", -S.flood3.lost);
  }
  save(); render(); window.scrollTo(0, 0);
}
function advance(){
  const n = nextPhase(S.year, S.phase, flags());
  if (!n){ S.screen = "bilanz"; S.neu = []; save(); render(); window.scrollTo(0, 0); return; }
  goPhase(n.year, n.phase);
}

const actions = {
  startGame(){ S = fresh(); S.screen = "spiel"; goPhase(1, "sirius"); },
  toAchet(){ goPhase(S.year, "achet"); },
  nextMonth(){ S.month++; S.neu = []; save(); render(); },
  toNext(){
    if (S.phase === "versorgung" && S.year === 1){ advance(); learn("brache"); save(); render(); return; }
    if (S.phase === "brache"){ advance(); learn("kalender"); save(); render(); return; }
    advance();
  },
  toVersorgung(){
    const h = S.harvested;
    const sp = supply(h, S.vorrat, S.year === 3 && S.dorf === "dorf" ? NUM.dorfspeicher : 0);
    S.supplies[S.year] = sp; S.harvested = 0;
    book("ueberschuss", sp.surplus);
    book("gegessen", -sp.fromVorrat);
    S.vorrat = sp.vorrat;
    S.hunger[S.year] = sp.hunger > 0;
    if (S.year === 3) S.lost = verloren(S.hunger);
    goPhase(S.year, "versorgung");
    learn({ 1: "schlamm", 2: "niedrig", 3: "vorrat" }[S.year]);
    save(); render();
  },
  feld(el){
    const i = +el.dataset.id.slice(1), f = S.fields[i];
    if (f.sown){ toast(TEXT.aussaat.schonGesaet); return; }
    if (!sowable(S.year, i, S.buckets)){ toast(S.year === 2 && i === 2 ? TEXT.aussaat.zuHoch : TEXT.aussaat.zuTrocken, "", 3200); return; }
    if (!f.plowed){ f.plowed = true; S.last = { i, what: "plow" }; }
    else { f.sown = true; S.last = { i, what: "sow" }; }
    S.neu = []; save(); render();
  },
  ernten(el){
    const i = +el.dataset.id.slice(1), f = S.fields[i];
    if (!f.sown || f.done){ toast(TEXT.ernte.nichts); return; }
    f.done = true; S.harvested += fieldYield(S.year, i, S.buckets); S.last = { i, what: "reap" };
    save(); render();
  },
  schoepfen(){
    if (S.busy || S.buckets >= NUM.schadufVoll) return;
    S.busy = true; S.shadufT = 0; render();
    setTimeout(() => { S.shadufT = 1; S.buckets++; render(); }, 280);
    setTimeout(() => { S.shadufT = 0.5; S.busy = false; save(); render(); }, 900);
  },
  e1(el){ S.e1 = el.dataset.id; if (S.e1 === "kruege") book("kruege", NUM.kruegeTausch); save(); render(); },
  wahlSchaduf(el){ S.schaduf = el.dataset.id; if (S.schaduf === "bauen") book("schaduf", -NUM.schadufKosten); save(); render(); },
  wahlDorf(el){
    S.dorf = el.dataset.id;
    if (S.dorf === "dorf") book("dorf", -Math.min(S.vorrat, NUM.dorfBeitrag));
    save(); render();
  },
  bauen(){ S.dorfStep++; S.neu = []; save(); render(); },
  vermessen(){ S.vermessen = true; save(); render(); },
  beruf(el){ S.beruf = el.dataset.id; learn("berufe"); save(); render(); },
  nochmal(){
    if (!S.snap) return;
    const v = S.versuch + 1;
    S = JSON.parse(S.snap); S.versuch = v; S.snap = null;
    goPhase(2, "dorfWahl");
  },
  go(el){ S.screen = el.dataset.to; save(); render(); window.scrollTo(0, 0); },
  selCard(el){ if (suppressClick) return; const i = +el.dataset.card; S.q.sel = S.q.sel === i ? null : i; S.q.msg = null; save(); render(); },
  dropSel(el){ if (S.q && S.q.sel != null) placeCard(S.q.sel, el.dataset.zone); },
  pick(el){ S.pick[el.dataset.k] = Number(el.dataset.i); save(); render(); },
  rolle(){ openSheet(`<h2>${esc(UI.rolle)}</h2>${rolleHTML()}${closeBtn()}`, false); },
  begriffe(){ openSheet(`<h2>${esc(UI.begriffe)}</h2><dl class="glossary">${BEGRIFFE.map(([b, e]) => `<dt>${esc(b)}</dt><dd>${esc(e)}</dd>`).join("")}</dl>${closeBtn()}`, false); },
  pause(){
    openSheet(`<h2>${esc(UI.pauseTitel)}</h2><p>${esc(UI.pauseText)}</p>
      <div class="btnrow"><button class="btn" data-act="closeSheet">${esc(UI.weiter)}</button></div>
      <p class="restart"><button class="linkbtn" data-act="restart">${esc(UI.neustart)}</button></p>`, false);
  },
  restart(){ closeSheet(); S = fresh(); save(); render(); },
  closeSheet(){ closeSheet(); }
};
const closeBtn = () => `<button class="btn secondary close" data-act="closeSheet">${esc(UI.schliessen)}</button>`;

document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.act];
  if (fn) fn(el);
});
document.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches?.('[role="button"][data-act]')){ e.preventDefault(); e.target.dispatchEvent(new MouseEvent("click", { bubbles: true })); }
});

render();
