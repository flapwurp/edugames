/* Im Rhythmus des Nils 0.2 – Bildschirme und Bedienung (Querformat) */
import { NUM, GAME, SEASONS, UI, MERKSAETZE, ROLLE_REIHENFOLGE, TEXT, BILANZ, QUELLE, QUELLTEXT, AUSSAGEN,
  URTEIL, QUELLE_BELEGE, ALLERDINGS, SPIELBELEGE, IMPULS, BEGRIFFE } from "./content.js";
import { PHASES, nextPhase, monthOf, RISE, seasonsKnown, sowable, fieldYield, supply, bracheBonus } from "./sim.js";
import { scene, villageView, LEVEL, GROUND, big } from "./scene.js";
import * as A from "./assets.js";
import { createStore } from "../shared/session.js";
import { esc, openSheet, closeSheet, toast, clearToast } from "../shared/ui.js";

const $app = document.getElementById("app");
const fresh = () => ({
  screen: "start", year: 1, phase: "sirius", month: 1,
  fields: freshFields(), buckets: 0, vorrat: NUM.startVorrat, harvested: 0,
  e1: null, beruf: null, dorfStep: 0, vermessen: false, last: null,
  supplies: {}, rolle: [], neu: [], answers: {}, pick: {}
});
const freshFields = () => [0, 1, 2].map(() => ({ plowed: false, sown: false, done: false }));
const store = createStore("nil-v02", fresh);
let S = store.load() || fresh();
const save = () => store.save(S);
const fill = (t, p = {}) => String(t).replace(/\{(\w+)\}/g, (_, k) => (k in p ? p[k] : `{${k}}`))
  .replace(/(^|\D)1 Säcken?(?!\p{L})/gu, (_, pre) => pre + "1 Sack");

/* ---------- Hilfsfunktionen ---------- */

function learn(id){
  if (!S.rolle.includes(id)){ S.rolle.push(id); S.neu.push(id); }
}
const FIELD_X = [272, 500, 702];
const HOF_X = 880;
const flood = () => ({ 1: "gut", 2: "niedrig", 3: "hoch" }[S.year]);

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

function newNotes(){
  if (!S.neu.length) return "";
  return S.neu.map(id => `<div class="neu"><small>${esc(UI.neuAufRolle)}</small><p>${esc(MERKSAETZE[id])}</p></div>`).join("");
}

const sacks = (n, cls = "") => `<span class="sacks ${cls}" aria-label="${n} Säcke">${n > 0 ? A.sack(22).repeat(n) : "–"}</span>`;

function vorratBox(extra = 0){
  const v = S.vorrat + extra;
  return `<div class="vorrat"><small>${esc(UI.vorrat)}</small>${sacks(v)}</div>`;
}

/* Grundzustand der Szene für Jahr und Phase */
function baseScene(){
  const y = S.year;
  const st = { sky: "peret", water: { level: LEVEL.normal }, fields: [], people: [] };
  if (y < 3 && !(S.phase === "dorfbau" && S.dorfStep > 0)) st.hof = { fill: Math.min(1, (S.vorrat + S.harvested) / 12), wall: S.e1 === "wall" };
  if (y === 3 || (S.phase === "dorfbau" && S.dorfStep > 0)){
    const stage = y === 3 ? 1 : S.dorfStep / 3;
    st.village = { dike: true, stage: stage >= 1 ? 1 : stage, fill: y === 3 ? Math.max(0.15, (NUM.dorfspeicher - (S.supplies[3] ? S.supplies[3].help : 0)) / 12) : 0.4 };
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
    if (stage && !f.sown && S.year === 2 && i === 2) plants = "verdorrt";
    return { soil, plants, boundary: S.year !== 3 || S.vermessen };
  });
}

/* ---------- Bildschirme ---------- */

function render(){
  const fn = { start, spiel, bilanz, quelle, urteil, impuls }[S.screen] || start;
  fn();
}

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
  const P = { sirius: pSirius, achet: pAchet, schaduf: pSchaduf, aussaat: pAussaat, wachsen: pWachsen, ernte: pErnte,
    versorgung: pVersorgung, brache: pBrache, jahresende: pJahresende, dorfbau: pDorfbau, vermessen: pVermessen, beruf: pBeruf }[S.phase];
  P();
}

function pSirius(){
  const st = baseScene();
  st.sky = "dawn"; st.water = { level: LEVEL.tief };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache", plants: S.year === 1 ? "stoppel" : null }));
  if (S.year === 2) st.fields[2] = { soil: "brache" };
  st.people = [{ x: S.year === 3 ? 980 : 846, pose: "winken", n: 0, flip: true }];
  const T = TEXT.sirius[S.year];
  layout(scene(st), panel({ titel: T.titel, text: T.text, actions: btn("toAchet", T.knopf) }));
}

function pAchet(){
  const st = baseScene();
  st.sky = "achet";
  const peak = LEVEL[flood()];
  const r = S.year === 1 ? RISE[S.month - 1] : 1;
  st.water = { level: Math.round(LEVEL.tief + (peak - LEVEL.tief) * r), kind: "flut" };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache" }));
  st.labels = ["nilmesser"];
  st.people = S.year === 3 ? [{ x: 1124, pose: "stehen", n: 1 }] : [{ x: 1040, pose: "stehen", n: 1 }];
  if (S.year === 1){
    st.nmLabels = S.month === 4;
    if (S.month === 4) st.labels.push("hof");
    const last = S.month === 4;
    if (last) learn("steigt");
    layout(scene(st), panel({ titel: `Achet – ${S.month}. Monat`, text: TEXT.achet.monate[S.month - 1],
      actions: last ? btn("toPeret", TEXT.achet.knopf1) : btn("nextMonth", UI.naechsterMonat) }));
    return;
  }
  st.nmLabels = true;
  if (S.year === 3){ st.ghost = LEVEL.hoch; st.labels.push("deich"); learn("hoch"); learn("deich"); }
  const T = TEXT.achet[S.year];
  layout(scene(st), panel({ titel: T.titel, text: T.text, actions: btn("toPeret", T.knopf) }));
}

function pSchaduf(){
  const st = baseScene();
  st.water = { level: LEVEL.tief }; st.ditchWater = true;
  const wet = S.buckets >= NUM.schadufHalb;
  st.fields = [{ soil: "schlamm" }, { soil: wet ? "schlamm" : "trocken" }, { soil: "trocken" }];
  st.shaduf = { t: S.shadufT ?? 0, n: 0 };
  st.labels = ["schaduf", "graben"];
  if (S.buckets < NUM.schadufVoll) st.hot = [{ id: "schaduf", act: "schoepfen", label: "Schaduf: Wasser schöpfen" }];
  const T = TEXT.schaduf;
  const meter = `<div class="meter" aria-label="${fill(T.eimer, { n: S.buckets })}">${Array.from({ length: NUM.schadufVoll }, (_, i) =>
    `<span class="${i < S.buckets ? "on" : ""}"></span>`).join("")}<b>${fill(T.eimer, { n: S.buckets })}</b></div>`;
  let fb = "";
  if (S.buckets >= NUM.schadufVoll) fb = T.voll; else if (wet) fb = T.halb + " " + T.muede; else if (S.buckets > 0) fb = T.muede;
  layout(scene(st), panel({ titel: T.titel, text: T.text, extra: meter + (fb ? `<p class="fb">${esc(fb)}</p>` : ""),
    actions: btn("toAussaat", T.weiter) }));
}

function pAussaat(){
  const st = baseScene();
  st.water = { level: LEVEL.normal };
  if (S.year === 2){ st.water = { level: LEVEL.tief }; st.ditchWater = true; st.shaduf = { t: 0, n: 0 }; }
  st.fields = fieldViews(null);
  st.hot = S.fields.map((f, i) => ({ id: "f" + i, act: "feld", label: f.plowed ? TEXT.aussaat.saeen : TEXT.aussaat.pfluegen, done: f.sown }));
  if (S.last){
    const i = S.last.i, x = FIELD_X[i], F = [GROUND.f1, GROUND.f2, GROUND.f3][i];
    if (S.last.what === "plow") st.extra = big(A.plowTeam({ x: x + 60, y: F.y, n: 1 }), x + 60, F.y, 0.92);
    else if (S.last.what === "sow") st.people.push({ x: x - 10, pose: "saeen", n: 2 });
  }
  const T = TEXT.aussaat;
  const done = S.fields.every((f, i) => f.sown || !sowable(S.year, i, S.buckets));
  const status = `<ul class="checks">${S.fields.map((f, i) => {
    const can = sowable(S.year, i, S.buckets);
    const name = ["Feld am Ufer", "mittleres Feld", "oberes Feld"][i];
    const state = !can ? "zu trocken" : f.sown ? "gesät" : f.plowed ? "gepflügt" : "noch nicht bestellt";
    return `<li class="${f.sown ? "ok" : !can ? "no" : ""}">${name}: ${state}</li>`;
  }).join("")}</ul>`;
  layout(scene(st), panel({ titel: T[S.year].titel, text: T[S.year].text, extra: status,
    actions: btn("toWachsen", T.fertig, done ? "" : "disabled") }));
}

function pWachsen(){
  const st = baseScene();
  st.water = { level: S.year === 2 ? LEVEL.tief : LEVEL.normal };
  if (S.year === 2){ st.ditchWater = false; }
  let stage, text, act;
  if (S.year === 1){
    stage = ["keim", "halm", "aehre"][S.month - 6];
    text = TEXT.wachsen.monate[S.month - 6];
    act = S.month < 8 ? btn("nextMonth", UI.naechsterMonat) : btn("toErnte", "Zur Ernte");
    if (S.month === 8) text += " " + TEXT.wachsen.fertig;
  } else {
    stage = "aehre";
    text = TEXT.wachsen[S.year];
    act = btn("toErnte", "Zur Ernte");
  }
  st.fields = fieldViews(stage);
  st.people = [{ x: 680, pose: "hacken", n: 3 }];
  layout(scene(st), panel({ titel: `Peret – ${S.month}. Monat`, text, actions: act }));
}

function pErnte(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief };
  st.fields = fieldViews("reif");
  st.hot = S.fields.map((f, i) => ({ id: "f" + i, act: "ernten", label: "ernten", done: f.done || !f.sown }));
  if (S.last && S.last.what === "reap") st.people.push({ x: FIELD_X[S.last.i] + 20, pose: "ernten", n: S.last.i });
  if (S.harvested > 0) st.people.push({ x: S.year === 3 ? 1010 : 960, pose: "tragen", n: 1 });
  st.labels = [S.year === 3 ? "dorfspeicher" : "speicher"];
  const done = S.fields.every(f => f.done || !f.sown);
  const T = TEXT.ernte;
  layout(scene(st), panel({ titel: T.titel, text: S.year === 3 ? T[3] : T.text,
    extra: `<p class="big">${fill("Geerntet: {n} Säcke", { n: S.harvested })}</p>${sacks(S.harvested, "row")}`,
    actions: btn("toVersorgung", T.fertig, done ? "" : "disabled") }));
}

function pVersorgung(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief };
  st.fields = S.fields.map(f => ({ soil: "brache", plants: f.sown ? "stoppel" : null }));
  if (S.year === 2 && !S.fields[2].sown) st.fields[2] = { soil: "trocken", plants: "verdorrt" };
  const sp = S.supplies[S.year];
  const T = TEXT.versorgung;
  const xs = S.year === 3 ? [1110, 1124, 1138, 1100] : [870, 900, 930, 956];
  st.people = [0, 1, 2, 3].map(i => ({ x: xs[i], pose: "stehen", n: i, kind: i === 3 }));
  const lines = [fill(T.ernte, { n: sp.harvest }), fill(T.bedarf, { n: sp.need })];
  let res = "", bowl = 1;
  if (sp.status === "satt") res = fill(T.satt, { n: sp.vorrat });
  if (sp.status === "knapp"){ res = fill(T.knapp, { n: sp.fromVorrat }); bowl = 0.5; }
  if (sp.status === "hunger"){ res = fill(T.hunger, { n: sp.hunger }) + " " + T.nachbarn; bowl = 0; }
  if (sp.status === "geholfen") res = fill(T.geholfen, { n: sp.help });
  const bowls = `<div class="bowls" aria-label="Versorgung">${[0, 1, 2, 3].map(() => A.bowl(bowl, 46)).join("")}</div>`;
  layout(scene(st), panel({ titel: T.titel, text: lines.join(" "),
    extra: `${sacks(sp.harvest, "row")}<div class="result ${sp.status}">${bowls}<p>${esc(res)}</p></div>`,
    side: vorratBox(), actions: btn("toNext", UI.weiter) }));
}

function pBrache(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache", plants: "stoppel" }));
  const T = TEXT.brache;
  if (!S.e1){
    st.people = [{ x: 850, pose: "stehen", n: 0 }, { x: 1040, pose: "stehen", n: 1 }];
    const opts = Object.entries(T.optionen).map(([id, o]) => `<button class="choice" data-act="e1" data-id="${id}"><b>${esc(o.name)}</b><span>${esc(o.text)}</span></button>`).join("");
    layout(scene(st), panel({ titel: T.titel, text: T.text, extra: `<div class="choices">${opts}</div>`, side: vorratBox() }));
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
  layout(scene(st), panel({ titel: T.titel, text: T.text, actions: btn("toNext", T.knopf) }));
}

function pDorfbau(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief }; st.oldMark = true;
  st.fields = [{ soil: "brache", plants: "stoppel" }, { soil: "brache", plants: S.fields[1].sown ? "stoppel" : null }, { soil: "trocken", plants: "verdorrt" }];
  const T = TEXT.dorfbau;
  const k = S.dorfStep;
  if (k > 0 && k < 3) st.people = [{ x: 770, pose: "bauen", n: 0 }, { x: 880, pose: "tragen", n: 4 }, { x: 1000, pose: "bauen", n: 5 }, { x: 1090, pose: "tragen", n: 2 }];
  else if (k === 0) st.people = [0, 1, 2, 3, 4, 5].map(i => ({ x: 760 + i * 28, pose: "stehen", n: i, flip: i % 2 === 1 }));
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
  layout(scene(st), panel({ titel: T.titel, text: S.vermessen ? T.fertig : T.text,
    actions: S.vermessen ? btn("toNext", UI.weiter) : btn("vermessen", T.knopf) }));
}

function pBeruf(){
  const T = TEXT.beruf;
  if (!S.beruf){
    const opts = Object.entries(T.optionen).map(([id, o]) => `<button class="choice" data-act="beruf" data-id="${id}"><b>${esc(o.name)}</b><span>${esc(o.text)}</span></button>`).join("");
    layout(villageView({ fill: 0.3, alt: "Das Dorf mit seinen Berufen" }), panel({ titel: T.titel, text: T.text, extra: `<div class="choices four">${opts}</div>` }));
    return;
  }
  layout(villageView({ fill: 0.3, mine: S.beruf, n: 0 }), panel({ titel: T.titel, text: fill(T.ergebnis, { name: T.optionen[S.beruf].name }), actions: btn("toNext", T.weiter) }));
}

/* ---------- Bilanz, Quelle, Urteil, Impuls ---------- */

function bilanz(){
  const T = BILANZ;
  const s2 = S.supplies[2], s3 = S.supplies[3];
  const res = s => ({ satt: "satt", knapp: "gerade so satt, Vorrat leer", hunger: `Hunger (es fehlten ${s.hunger} Säcke)`, geholfen: "satt – mit Hilfe des Dorfspeichers" }[s.status]);
  const rows = [
    ["zu niedrig", "zu hoch"],
    [S.e1 === "wall" ? "Erdwall – nützte nichts" : "keiner", "Deich und Dorf"],
    [`${s2.harvest} Säcke`, `${s3.harvest} Säcke (späte Aussaat)`],
    ["keine – die Nachbarn hatten selbst nichts", `${s3.help} Säcke aus dem Dorfspeicher`],
    [res(s2), res(s3)]
  ];
  const table = `<table class="compare"><thead><tr><th></th><th>${esc(T.allein)}</th><th>${esc(T.dorf)}</th></tr></thead><tbody>${T.zeilen.map((z, i) =>
    `<tr><th>${esc(z)}</th><td>${esc(rows[i][0])}</td><td>${esc(rows[i][1])}</td></tr>`).join("")}</tbody></table>`;
  S.neu = [];
  $app.innerHTML = `${topbar()}<main class="page">
    <h2>${esc(T.titel)}</h2>
    <div class="two">
      <section><h3>${esc(T.rolle)}</h3>${rolleHTML()}</section>
      <section><h3>${esc(T.vergleich)}</h3>${table}</section>
    </div>
    <div class="actions">${btn("go", T.weiter, 'data-to="quelle"')}</div></main>`;
}

function rolleHTML(){
  const items = ROLLE_REIHENFOLGE.filter(id => S.rolle.includes(id)).map(id => `<li>${esc(MERKSAETZE[id])}</li>`).join("");
  return `<div class="scroll"><div class="rod"></div>${items ? `<ol>${items}</ol>` : `<p>${esc(UI.rolleLeer)}</p>`}<div class="rod"></div></div>`;
}

function quelleBox(){
  const bl = QUELLE.bloecke.map(b => `<p>${esc(b.text)}</p>`).join(`<p class="cut">[…]</p>`);
  return `<figure class="source ${QUELLE.placeholder ? "placeholder" : ""}">
    ${QUELLE.placeholder ? `<p class="ph">Platzhalter – der Text der Quelle folgt.</p>` : ""}
    <figcaption><b>${esc(QUELLE.titel)}</b></figcaption>${bl}<p class="ref">${esc(QUELLE.angabe)}</p></figure>`;
}

function quelle(){
  const T = QUELLTEXT;
  const done = AUSSAGEN.every((_, i) => i in S.answers);
  const allRight = done && AUSSAGEN.every((a, i) => S.answers[i] === a.imLied);
  const items = AUSSAGEN.map((a, i) => {
    const ans = S.answers[i];
    const fb = ans === undefined ? "" : `<p class="fb ${ans === a.imLied ? "ok" : "no"}">${esc(ans === a.imLied ? T.richtig + " " + a.erklaerung : T.nochmal + " " + a.tipp)}</p>`;
    return `<li><p class="st">${esc(a.text)}</p>
      <div class="yn"><button class="opt ${ans === true ? "sel" : ""}" data-act="answer" data-i="${i}" data-v="1">${esc(T.ja)}</button>
      <button class="opt ${ans === false ? "sel" : ""}" data-act="answer" data-i="${i}" data-v="0">${esc(T.nein)}</button></div>${fb}</li>`;
  }).join("");
  const summary = allRight ? `<div class="summary">
      <section><h3>${esc(T.sagt)}</h3><ul>${AUSSAGEN.filter(a => a.imLied).map(a => `<li>${esc(a.text)}</li>`).join("")}</ul></section>
      <section><h3>${esc(T.spiel)}</h3><ul>${AUSSAGEN.filter(a => !a.imLied).map(a => `<li>${esc(a.text)}</li>`).join("")}</ul></section>
      <div class="feedback"><p>${esc(T.schluss)}</p></div></div>
      <div class="actions">${btn("go", T.weiter, 'data-to="urteil"')}</div>` : "";
  $app.innerHTML = `${topbar()}<main class="page"><h2>${esc(T.titel)}</h2><p>${esc(T.text)}</p>
    <div class="two src">${quelleBox()}<div><h3>${esc(T.frage)}</h3><ol class="statements">${items}</ol></div></div>${summary}</main>`;
}

function spielbelege(){
  const B = SPIELBELEGE, s2 = S.supplies[2] || {};
  const list = [B.schlamm, fill(B.ernte1, { n: (S.supplies[1] || {}).harvest || 12 }), B.niedrig];
  if (s2.status === "hunger") list.push(B.hunger); else list.push(B.knapp);
  if (S.buckets > 0) list.push(B.schaduf);
  list.push(B.hoch, B.deich, B.speicher);
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
  if (phase === "achet" && year === 1) S.month = 1;
  if (phase === "wachsen" && year > 1) S.month = 8;
  save(); render(); window.scrollTo(0, 0);
}
function advance(){
  const n = nextPhase(S.year, S.phase);
  if (!n){ S.screen = "bilanz"; S.neu = []; save(); render(); window.scrollTo(0, 0); return; }
  goPhase(n.year, n.phase);
}

const actions = {
  startGame(){ S = fresh(); S.screen = "spiel"; goPhase(1, "sirius"); },
  toAchet(){ goPhase(S.year, "achet"); },
  toPeret(){ advance(); },
  nextMonth(){ S.month++; S.neu = []; save(); render(); },
  toAussaat(){ advance(); },
  toWachsen(){ advance(); },
  toErnte(){ advance(); },
  toVersorgung(){
    const sp = supply(S.year, S.harvested, S.vorrat, NUM.dorfspeicher);
    S.supplies[S.year] = sp; S.vorrat = sp.vorrat; S.harvested = 0;
    goPhase(S.year, "versorgung");
    if (S.year === 1) learn("schlamm");
    if (S.year === 2) learn("niedrig");
    if (S.year === 3) learn("vorrat");
    save(); render();
  },
  toNext(){
    if (S.phase === "versorgung" && S.year === 1){ goPhase(1, "brache"); learn("brache"); save(); render(); return; }
    if (S.phase === "brache"){ goPhase(1, "jahresende"); learn("kalender"); save(); render(); return; }
    advance();
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
  e1(el){ S.e1 = el.dataset.id; S.vorrat += bracheBonus(S.e1); save(); render(); },
  bauen(){ S.dorfStep++; S.neu = []; save(); render(); },
  vermessen(){ S.vermessen = true; save(); render(); },
  beruf(el){ S.beruf = el.dataset.id; learn("berufe"); save(); render(); },
  go(el){ S.screen = el.dataset.to; save(); render(); window.scrollTo(0, 0); },
  answer(el){ S.answers[el.dataset.i] = el.dataset.v === "1"; save(); render(); },
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
