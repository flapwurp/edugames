/* Im Rhythmus des Nils 0.4 – Bildschirme und Bedienung (Querformat) */
import { NUM, GAME, SEASONS, UI, MERKSAETZE, ROLLE_REIHENFOLGE, TEXT, BILANZ, QUELLE, QUELLTEXT, AUSSAGEN,
  URTEIL, QUELLE_BELEGE, ALLERDINGS, SPIELBELEGE, IMPULS, BEGRIFFE } from "./content.js";
import { nextPhase, monthOf, growMonths, RISE, RISE_HOCH, seasonsKnown, sowable, fieldYield, supply, hochwasserAllein,
  verloren, fieldSteps, fieldRest, ernteKosten, tauschMoeglich, FLOOD, LAST_YEAR } from "./sim.js";
import { scene, villageView, LEVEL, GROUND, big, fieldRange, stonePos, DIKE, WALL, groundY } from "./scene.js";
import * as A from "./assets.js";
import { initGestures, resetProgress } from "./gesture.js";
import { createStore } from "../shared/session.js";
import { esc, openSheet, closeSheet, toast, clearToast } from "../shared/ui.js";

const $app = document.getElementById("app");
const KO = NUM.kosten;
const freshFields = () => [0, 1, 2].map(() => ({ grenze: false, plowed: false, sown: false, done: false }));
const fresh = () => ({
  screen: "start", year: 1, phase: "sirius", month: 1,
  fields: freshFields(), buckets: 0, vorrat: NUM.startVorrat, harvested: 0,
  kraft: NUM.kraft, use: {}, frei: {}, vorratEnde: {}, schuld: 0, wall: 0, y1: { wall: 0, koerbe: 0 }, tz: {},
  schaduf: null, dorf: null, beruf: null, dorfStep: 0, deichPaid: 0, hausWeg: false, hausProg: 0, flood3: null,
  last: null, supplies: {}, hunger: {}, lost: false, ledger: [], versuch: 1, snap: null,
  rolle: [], neu: [], q: null, pick: {}
});
const store = createStore("nil-v04-archiv", fresh);
let S = store.load() || fresh();
const save = () => store.save(S);
const fill = (t, p = {}) => String(t).replace(/\{(\w+)\}/g, (_, k) => (k in p ? p[k] : `{${k}}`))
  .replace(/(^|\D)1 Säcken?(?!\p{L})/gu, (_, pre) => pre + "1 Sack");
const flags = () => ({ schaduf: S.schaduf, dorf: S.dorf, verloren: S.lost, hausWeg: S.hausWeg });
const inDorf = () => S.dorf === "dorf" && S.year >= 3;
const alone = () => S.dorf === "allein" && S.year >= 3;
const ctx = () => (S.year === 4 && S.dorf === "dorf" ? { landvermesser: S.beruf === "landvermesser", kupfer: S.beruf === "weberin" } : {});
const FIELD_X = [272, 500, 702];
const PILE = { x: 548, y: GROUND.f2.y };          // Erdhaufen am mittleren Feld
const WEAVE = { x: 772, y: GROUND.f3.y };         // im Schatten der Feldhütte flechten

/* ---------- Hilfsfunktionen ---------- */

function learn(id){ if (!S.rolle.includes(id)){ S.rolle.push(id); S.neu.push(id); } }

/* Vorrat sichtbar verbuchen */
function book(key, delta){
  if (!delta) return;
  S.vorrat += delta;
  const last = S.ledger[S.ledger.length - 1];
  if (last && last.y === S.year && last.key === key && Math.sign(last.delta) === Math.sign(delta)){ last.delta += delta; last.total = S.vorrat; return; }
  S.ledger.push({ y: S.year, key, delta, total: S.vorrat });
}

/* Arbeitskraft verbrauchen */
function useYear(){ return (S.use[S.year] ||= { felder: 0, schaduf: 0, schutz: 0, koerbe: 0, nachholen: 0 }); }
function spend(n, cat){ S.kraft -= n; useYear()[cat] += n; }

const started = f => f.grenze || f.plowed || f.sown;
/* Kraft, die die schon begonnenen Felder noch brauchen (ohne Feld „except“) */
function reserve(except = -1){
  return S.fields.reduce((sum, f, i) => sum + (i !== except && started(f) && !f.done ? fieldRest(S.year, i, f, ctx()) : 0), 0);
}
/* im Schaduf-Schritt: das Uferfeld und – sobald nass genug – das mittlere Feld müssen noch bestellt werden */
const schadufReserve = b => fieldRest(2, 0, S.fields[0]) + (b >= NUM.schadufHalb ? fieldRest(2, 1, S.fields[1]) : 0);

function nextStep(i){
  const f = S.fields[i];
  for (const st of fieldSteps(S.year, i, ctx())){
    const done = st.id === "pfluegen" ? f.plowed : st.id === "saeen" ? f.sown : f.grenze;
    if (!done) return st;
  }
  return null;
}
const affordable = i => started(S.fields[i]) || fieldRest(S.year, i, S.fields[i], ctx()) + reserve(i) <= S.kraft;
const GESTE = { grenzstein: "stein", grenzeNeu: "seil", pfluegen: "pflug", saeen: "saat" };

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

/* Speicher mit Verbuchung */
function vorratBox(){
  const rows = S.ledger.slice(-3).map(e =>
    `<li><b class="${e.delta > 0 ? "plus" : "minus"}">${e.delta > 0 ? "+" : "−"}${Math.abs(e.delta)}</b> ${esc(UI.buchung[e.key])}${e.y !== S.year ? ` <small>(Jahr ${e.y})</small>` : ""}</li>`).join("");
  return `<div class="vorrat"><small>${esc(UI.vorrat)}: ${fill(UI.saecke, { n: S.vorrat })}</small>${sacks(S.vorrat)}${rows ? `<ul class="ledger">${rows}</ul>` : ""}</div>`;
}

/* Arbeitskraft: verbraucht – noch gebraucht – frei */
function kraftBox(res = null){
  const total = NUM.kraft, left = Math.max(0, S.kraft), r = Math.min(left, res ?? reserve());
  const pips = Array.from({ length: total }, (_, i) => {
    const cls = i < total - left ? "used" : i < total - left + r ? "res" : "free";
    return `<span class="${cls}"></span>`;
  }).join("");
  const u = useYear();
  const parts = Object.entries(u).filter(([, v]) => v > 0).map(([k, v]) => `${UI.verbrauch[k]} ${v}`).join(" · ");
  return `<div class="kraft"><small>${esc(UI.kraft)}: ${fill(UI.kraftRest, { n: left, k: total })}</small>
    <div class="pips" aria-hidden="true">${pips}</div>
    ${parts ? `<p class="kraft-use">${esc(parts)}</p>` : ""}
    ${r > 0 ? `<p class="kraft-use">${esc(fill(UI.kraftReserve, { n: r }))}</p>` : ""}</div>`;
}
const sideBoxes = (res) => kraftBox(res) + vorratBox();

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
  const villageNow = inDorf() || S.phase === "dorfbau";
  if (!villageNow){
    const ruined = S.hausWeg && S.hausProg < KO.haus;
    st.hof = { fill: ruined ? 0 : Math.min(1, (S.vorrat + S.harvested) / 12), wall: S.wall / KO.erdwall, ruined };
  } else {
    const stage = y >= 3 ? 1 : S.dorfStep / 3;
    const dikeK = y >= 3 || S.dorfStep > 0 ? 1 : Math.max(0.08, S.deichPaid / KO.deich);
    st.village = { dike: true, stage, dikeK, fill: y >= 3 ? 0.55 : 0.4 };
  }
  if (y >= 3) st.hutRuined = true; else st.hut = true;
  return st;
}

/* Feldzustände für Aussaat, Wachsen, Ernte */
function fieldViews(stage){
  return S.fields.map((f, i) => {
    const okToSow = sowable(S.year, i, S.buckets);
    let soil = !okToSow ? "trocken" : "schlamm";
    if (f.plowed) soil = "gepflueg";
    let plants = null;
    if (f.sown) plants = stage || "saat";
    if (f.done) plants = "stoppel";
    if (stage && okToSow && !f.sown) soil = "brache";          // nicht bestellt: kahl
    let boundary = true;
    const steps = fieldSteps(S.year, i, ctx()).map(s => s.id);
    if (steps.includes("grenzstein") && !f.grenze) boundary = "liegt";
    if (steps.includes("grenzeNeu") && !f.grenze) boundary = false;
    return { soil, plants, boundary };
  });
}
/* x einer Figur auf einem bestellten Feld (oder null) */
function onSownField(dx = 40){
  const i = S.fields.findIndex(f => f.sown);
  return i < 0 ? null : FIELD_X[i] + dx;
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
const hint = t => `<p class="geste"><b>${esc(UI.geste)}</b> ${esc(t)}</p>`;

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
    ernte: pErnte, versorgung: pVersorgung, trockenzeit: pTrockenzeit, jahresende: pJahresende, dorfWahl: pDorfWahl,
    dorfbau: pDorfbau, hausbau: pHausbau, verloren: pVerloren, beruf: pBeruf }[S.phase])();
}

function pSirius(){
  const st = baseScene();
  st.sky = "dawn"; st.water = { level: LEVEL.tief };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache", plants: S.year === 1 ? "stoppel" : null }));
  st.people = [{ x: inDorf() ? 980 : 846, pose: "winken", n: 0, flip: true }];
  const key = S.year >= 3 && S.dorf === "allein" ? S.year + "allein" : S.year;
  const T = TEXT.sirius[key];
  const beruf = S.beruf ? TEXT.beruf.optionen[S.beruf].name : "";
  const extra = `<p class="fb">${esc(fill(UI.kraftNeu, { k: NUM.kraft }))}${S.schuld > 0 ? " " + esc(fill(UI.kraftSchuld, { n: S.schuld })) : ""}</p>`;
  layout(scene(st), panel({ titel: T.titel, text: fill(T.text, { beruf }), extra, actions: btn("toAchet", T.knopf), side: S.year > 1 ? sideBoxes() : kraftBox() }));
}

function pAchet(){
  const st = baseScene();
  st.sky = "achet";
  const y = S.year;
  const peak = LEVEL[FLOOD[y]];
  const r = (y === 3 ? RISE_HOCH : RISE)[S.month - 1];
  st.water = { level: Math.round(LEVEL.tief + (peak - LEVEL.tief) * r), kind: "flut" };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache" }));
  st.labels = ["nilmesser"];
  st.people = inDorf() ? [{ x: 1124, pose: "stehen", n: 1 }] : [{ x: 1040, pose: "stehen", n: 1 }];
  if (y === 2) st.people.push({ x: 1066, pose: "stehen", n: 2, kind: true });
  const last = S.month === 4;
  st.nmLabels = last || (y === 3 && S.month >= 2);
  const T = TEXT.achet[y];
  let text = T.monate[S.month - 1];
  if (last && y === 1){ st.labels.push("hof"); learn("steigt"); }
  if (y === 3 && last){
    learn("hoch"); learn("deich");
    if (S.dorf === "dorf"){ st.ghost = LEVEL.hoch; st.labels.push("deich"); text = T.dorf; }
    else {
      st.people = [{ x: 1124, pose: "stehen", n: 1 }, { x: 1100, pose: "stehen", n: 3, kind: true }];
      text = S.wall >= KO.erdwall ? T.wall : (S.wall > 0 ? T.halbWall + " " : "") + T.ohne;
    }
  }
  const titel = `${T.titel} – ${S.month}. Monat`;
  layout(scene(st), panel({ titel, text, side: y > 1 ? vorratBox() : "",
    actions: last ? btn("toNext", T.knopf) : btn("nextMonth", UI.naechsterMonat) }));
}

function pSchadufWahl(){
  const st = baseScene();
  st.water = { level: LEVEL.tief }; st.ditchWater = true;
  st.fields = [{ soil: "schlamm", boundary: "liegt" }, { soil: "trocken" }, { soil: "trocken" }];
  st.labels = ["graben"];
  const T = TEXT.schadufWahl, p = { n: KO.schadufBau };
  if (!S.schaduf){
    st.people = [{ x: 470, pose: "winken", n: 4 }, { x: 520, pose: "stehen", n: 0, flip: true }];
    layout(scene(st), panel({ titel: T.titel, text: fill(T.text, p), extra: choices("wahlSchaduf", T.optionen, p), side: sideBoxes() }));
    return;
  }
  if (S.schaduf === "bauen"){ st.shaduf = { t: 0.5, n: 0 }; st.labels.push("schaduf"); }
  layout(scene(st), panel({ titel: T.titel, text: fill(S.schaduf === "bauen" ? T.gebaut : T.gelassen, p), side: sideBoxes(), actions: btn("toNext", UI.weiter) }));
}

function pSchaduf(){
  const st = baseScene();
  st.water = { level: LEVEL.tief }; st.ditchWater = true;
  const wet = S.buckets >= NUM.schadufHalb;
  st.fields = [{ soil: "schlamm", boundary: "liegt" }, { soil: wet ? "schlamm" : "trocken" }, { soil: "trocken" }];
  st.shaduf = { t: S.shadufT ?? 0.5, n: 0 };
  st.labels = ["schaduf", "graben"];
  const T = TEXT.schaduf;
  if (S.buckets < NUM.schadufVoll) st.hot = [{ id: "schaduf", g: "zug", label: "Schaduf: am Seil ziehen" }];
  const meter = `<div class="meter" aria-label="${fill(T.eimer, { n: S.buckets })}">${Array.from({ length: NUM.schadufVoll }, (_, i) =>
    `<span class="${i < S.buckets ? "on" : ""} ${i === NUM.schadufHalb - 1 ? "mark" : ""}"></span>`).join("")}<b>${fill(T.eimer, { n: S.buckets })}</b></div>`;
  let fb = "";
  if (S.buckets >= NUM.schadufVoll) fb = T.voll; else if (wet) fb = T.halb + " " + T.muede; else if (S.buckets > 0) fb = T.muede;
  layout(scene(st), panel({ titel: T.titel, text: fill(T.text, { h: NUM.schadufHalb, v: NUM.schadufVoll }),
    extra: meter + (fb ? `<p class="fb">${esc(fb)}</p>` : "") + `<p class="plan">${esc(T.plan)}</p>` + (S.buckets < NUM.schadufVoll ? hint(T.hint) : ""),
    actions: btn("toNext", T.weiter), side: kraftBox(schadufReserve(S.buckets)) }));
}

function pAussaat(){
  const st = baseScene();
  st.water = { level: LEVEL.normal };
  if (S.year === 2){ st.water = { level: LEVEL.tief }; st.ditchWater = true; if (S.schaduf === "bauen") st.shaduf = { t: 0.5, n: 0 }; }
  st.fields = fieldViews(null);
  const T = TEXT.aussaat, c = ctx();
  st.hot = [];
  let nextHint = "";
  S.fields.forEach((f, i) => {
    const id = "f" + i;
    if (!sowable(S.year, i, S.buckets)) { st.hot.push({ id, act: "feldInfo", label: T.zuTrocken, done: true }); return; }
    if (f.sown){ st.hot.push({ id, act: "feldInfo", label: T.schonGesaet, done: true }); return; }
    if (!affordable(i)){ st.hot.push({ id, act: "feldInfo", label: T.keineKraft, done: true }); return; }
    const step = nextStep(i);
    const label = `${T.namen[i]}: ${T.schritte[step.id].name}`;
    if (step.id === "grenzstein"){
      const p = stonePos(i);
      st.hot.push({ id, g: "stein", label, rect: { x: p.x - 26, y: p.y - 66, w: 62, h: 80 }, data: { sx: p.x, sy: p.y } });
    } else st.hot.push({ id, g: GESTE[step.id], label });
    if (!nextHint) nextHint = `${T.namen[i]} – ${T.schritte[step.id].name}: ${T.schritte[step.id].hint}`;
  });
  if (S.year === 3){
    const i = S.fields.findIndex(f => !f.grenze);
    if (i >= 0 && affordable(i)) st.people.push({ x: fieldRange(i).x1 - 30, pose: "winken", n: 4, flip: true });
  }
  if (c.landvermesser) st.extra = big(A.surveyor({ x: 420, y: GROUND.f2.y, n: 0 }), 420, GROUND.f2.y, 1.2);
  if (S.last){
    const i = S.last.i, F = fieldRange(i);
    if (S.last.what === "pfluegen") st.extra = (st.extra || "") + big(A.plowTeam({ x: F.x1 - 40, y: F.y, n: 1 }), F.x1 - 40, F.y, 0.92);
    if (S.last.what === "saeen") st.people.push({ x: F.x1 - 30, pose: "saeen", n: 2 });
    if (S.last.what === "grenzeNeu") st.people.push({ x: F.x1 - 20, pose: "stehen", n: 0, flip: true });
  }
  const done = S.fields.every((f, i) => f.sown || !sowable(S.year, i, S.buckets) || !affordable(i));
  const status = `<ul class="checks">${S.fields.map((f, i) => {
    const can = sowable(S.year, i, S.buckets);
    let state;
    if (!can) state = T.zuTrockenKurz;
    else if (f.sown) state = T.bestellt;
    else if (!affordable(i)) state = T.nichtBestellt;
    else state = fieldSteps(S.year, i, c).map(s => {
      const ok = s.id === "pfluegen" ? f.plowed : s.id === "saeen" ? f.sown : f.grenze;
      return `${ok ? "✓ " : ""}${T.schritte[s.id].name} (${s.cost})`;
    }).join(" · ") + ` · später ernten (${ernteKosten(c)})`;
    return `<li class="${f.sown ? "ok" : !can || !affordable(i) ? "no" : ""}"><b>${T.namen[i]}:</b> ${esc(state)}</li>`;
  }).join("")}</ul>`;
  const lv = c.landvermesser ? `<p class="fb">${esc(T.landvermesser)}</p>` : "";
  layout(scene(st), panel({ titel: T[S.year].titel, text: T[S.year].text, extra: lv + status + (done ? "" : hint(nextHint)),
    actions: btn("toNext", T.fertig, done ? "" : "disabled"), side: kraftBox() }));
}

function pWachsen(){
  const st = baseScene();
  st.water = { level: S.year === 2 ? LEVEL.tief : LEVEL.normal };
  if (S.year === 2 && S.schaduf === "bauen") st.shaduf = { t: 0.5, n: 0 };
  const months = growMonths(S.year);
  const k = Math.max(0, months.indexOf(S.month));
  const stage = (S.year === 3 ? ["keim", "jung", "halm"] : ["keim", "halm", "aehre"])[k];
  const last = k === months.length - 1;
  let text = TEXT.wachsen.monate[k] + (S.year === 2 || S.year === 3 ? " " + TEXT.wachsen[S.year] : "") + (last ? " " + TEXT.wachsen.fertig : "");
  st.fields = fieldViews(stage);
  const x = onSownField(-30);
  if (x) st.people = [{ x, pose: "hacken", n: 3 }];
  layout(scene(st), panel({ titel: `Peret – ${S.month}. Monat`, text, actions: last ? btn("toNext", TEXT.wachsen.zur) : btn("nextMonth", UI.naechsterMonat) }));
}

function pErnte(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief };
  if (S.year === 2 && S.schaduf === "bauen") st.shaduf = { t: 0.5, n: 0 };
  const stage = S.year === 3 ? "halm" : "reif";
  st.fields = fieldViews(stage);
  const c = ctx();
  st.hot = S.fields.map((f, i) => f.sown && !f.done
    ? { id: "f" + i, g: "ernte", label: "ernten", data: { stage, ...(c.kupfer ? { kupfer: 1 } : {}) } }
    : { id: "f" + i, act: "feldInfo", label: TEXT.ernte.nichts, done: true });
  if (S.last && S.last.what === "reap") st.people.push({ x: fieldRange(S.last.i).x1 - 24, pose: c.kupfer ? "ernten2" : "ernten", n: S.last.i });
  if (S.harvested > 0) st.people.push({ x: inDorf() ? 1010 : 960, pose: "tragen", n: 1 });
  st.labels = [st.village ? "dorfspeicher" : "speicher"];
  const done = S.fields.every(f => f.done || !f.sown);
  const T = TEXT.ernte;
  const kupfer = c.kupfer ? `<p class="fb">${esc(fill(T.kupfer, { n: KO.ernteKupfer }))}</p>` : "";
  layout(scene(st), panel({ titel: T.titel, text: S.year === 3 ? T[3] : T.text,
    extra: kupfer + `<p class="big">${fill(T.geerntet, { n: S.harvested })}</p>${sacks(S.harvested, "row")}` + (done ? "" : hint(T.hint)),
    actions: btn("toVersorgung", T.fertig, done ? "" : "disabled"), side: sideBoxes() }));
}

function pVersorgung(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief };
  st.fields = S.fields.map((f, i) => ({ soil: sowable(S.year, i, S.buckets) ? "brache" : "trocken", plants: f.sown ? "stoppel" : null }));
  const sp = S.supplies[S.year];
  const T = TEXT.versorgung;
  const xs = st.village ? [960, 990, 1040, 1066] : [870, 900, 930, 956];
  st.people = [0, 1, 2, 3].map(i => ({ x: xs[i], pose: "stehen", n: i, kind: i === 3 }));
  let res = "", bowl = 1;
  if (sp.status === "satt") res = fill(T.satt, { n: sp.surplus });
  if (sp.status === "knapp"){ res = fill(T.knapp, { n: sp.fromVorrat }); bowl = 0.5; }
  if (sp.status === "hunger"){ res = fill(alone() ? T.alleinHunger : T.hunger, { n: sp.hunger }) + (S.year === 2 ? " " + T.nachbarn : ""); bowl = 0; }
  if (sp.status === "geholfen") res = fill(T.geholfen, { n: sp.help });
  else if (S.year === 3 && S.dorf === "dorf") res += " " + T.dorfAndere;
  layout(scene(st), panel({ titel: T.titel, text: fill(T.ernte, { n: sp.harvest }) + " " + fill(T.bedarf, { n: sp.need }),
    extra: `${sacks(sp.harvest, "row")}<div class="result ${sp.status}">${familyBowls(bowl)}<p>${esc(res)}</p></div>`,
    side: sideBoxes(), actions: btn("toNext", UI.weiter) }));
}

/* ---------- Trockenzeit: übrige Kraft einsetzen ---------- */

function tz(){ return (S.tz[S.year] ||= { koerbe: 0, wall: 0, nach: 0, ausb: 0, beruf: false }); }
function pflichten(){
  const list = [];
  if (S.dorf === "dorf" && S.schuld > 0) list.push({ key: "nachholen", rest: S.schuld });
  if (S.year === 3 && S.dorf === "dorf" && tz().ausb < KO.deichAusbessern) list.push({ key: "ausbessern", rest: KO.deichAusbessern - tz().ausb });
  return list;
}
const wallMoeglich = () => S.dorf !== "dorf" && S.year < LAST_YEAR && S.wall < KO.erdwall;

function pTrockenzeit(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief };
  st.fields = S.fields.map((f, i) => ({ soil: sowable(S.year, i, S.buckets) ? "brache" : "trocken", plants: f.sown ? "stoppel" : null }));
  const T = TEXT.trockenzeit, W = T.arbeiten, t = tz();
  const pf = pflichten();
  const kraftDa = S.kraft > 0;
  st.hot = [];
  const pileHot = (id, kind, tx, ty, label) => st.hot.push({ id, g: "korb", label, rect: { x: PILE.x - 40, y: PILE.y - 60, w: 110, h: 74 }, data: { tx, ty, load: kind } });
  let cards = "";
  const card = (key, title, text, state, cls = "") => `<li class="work ${cls}"><b>${esc(title)}</b><span>${esc(text)}</span>${state ? `<em>${esc(state)}</em>` : ""}</li>`;
  // Pflichten im Dorf
  for (const p of pf){
    cards += card(p.key, W[p.key].name, fill(W[p.key].text, { n: p.rest }), kraftDa ? W[p.key].hint : fill(T.nochSchuld, { n: p.rest }), "pflicht");
  }
  if (pf.length && kraftDa) pileHot(pf[0].key, "erde", DIKE.x0 + 22, DIKE.top + 6, W[pf[0].key].name);
  // Wahlarbeiten
  const free = pf.length === 0 && kraftDa;
  if (S.year !== 3 || S.dorf !== "dorf"){
    if (tauschMoeglich(S.year)){
      cards += card("koerbe", W.koerbe.name, fill(W.koerbe.text, { n: NUM.korbTausch }), t.koerbe ? `${t.koerbe} Körbe getauscht` : "", free ? "" : "off");
      if (free) st.hot.push({ id: "koerbe", g: "flecht", label: W.koerbe.name, rect: { x: WEAVE.x - 34, y: WEAVE.y - 74, w: 100, h: 84 }, data: { sx: WEAVE.x, sy: WEAVE.y } });
    } else if (S.year > 1) cards += card("koerbe", W.koerbe.name, W.koerbe.nein, "", "off");
  }
  if (wallMoeglich()){
    cards += card("erdwall", W.erdwall.name, fill(W.erdwall.text, { w: S.wall, n: KO.erdwall }), "", free ? "" : "off");
    if (free) pileHot("erdwall", "erde", WALL.x + 14, GROUND.site.y - 16, W.erdwall.name);
  } else if (S.dorf !== "dorf" && S.wall >= KO.erdwall && S.year < LAST_YEAR) cards += card("erdwall", W.erdwall.name, W.erdwall.fertig, "", "ok");
  // Bilder
  st.extra = "";
  if (st.hot.some(h => h.g === "korb")) st.extra += big(A.loadPile({ x: PILE.x, y: PILE.y, kind: "erde" }), PILE.x, PILE.y, 1.1);
  if (tauschMoeglich(S.year)){
    st.extra += big(A.weaveBasket({ x: WEAVE.x, y: WEAVE.y, p: 0 }), WEAVE.x, WEAVE.y, 1.5);
    st.people.push({ x: WEAVE.x - 34, pose: "flechten", n: 3, kind: true });
    if (t.koerbe) st.extra += big(A.basketRow({ x: 630, y: WEAVE.y, n: t.koerbe }), 630, WEAVE.y, 1.2);
  }
  // Jahr 4: was die Berufe bringen
  let beruf = "";
  if (S.year === 4 && S.dorf === "dorf" && S.beruf){
    const n = { toepfer: NUM.toepferTausch, verwalter: NUM.verwalterLohn, weberin: 3 * (KO.ernten - KO.ernteKupfer), landvermesser: 3 * KO.grenzstein }[S.beruf];
    beruf = `<div class="beruf-effekt"><p>${esc(fill(T[S.beruf], { n }))}</p></div>`;
    if (S.beruf === "toepfer") st.extra += big(A.potter({ x: 900, y: GROUND.site.y, n: 0 }), 900, GROUND.site.y, 1.1);
    if (S.beruf === "verwalter") st.extra += big(A.steward({ x: 900, y: GROUND.site.y, n: 0 }), 900, GROUND.site.y, 1.1);
    if (S.beruf === "weberin") st.extra += big(A.linenBolt({ x: 880, y: GROUND.site.y }) + A.copperSickles({ x: 910, y: GROUND.site.y }), 900, GROUND.site.y, 1.3);
  }
  if (S.year === 4 && S.dorf === "allein") beruf = `<div class="beruf-effekt"><p>${esc(BILANZ.vergleichAllein)}</p></div>`;
  const gemacht = [];
  if (t.koerbe) gemacht.push(`${t.koerbe} Körbe getauscht`);
  if (t.wall) gemacht.push(`${t.wall} Kraft am Erdwall`);
  if (t.nach + t.ausb) gemacht.push(`${t.nach + t.ausb} Kraft am Deich`);
  const info = (pf.length && kraftDa ? `<p class="fb">${esc(T.pflichtZuerst)}</p>` : "") + (!kraftDa ? `<p class="fb">${esc(T.keineKraft)}</p>` : "")
    + (gemacht.length ? `<p class="small">${esc(fill(T.gemacht, { liste: gemacht.join(", ") }))}</p>` : "");
  const hotHint = st.hot.length ? hint(st.hot.map(h => (h.id === "koerbe" ? W.koerbe.hint : W[h.id] ? W[h.id].hint : W.erdwall.hint)).filter((x, i, a) => a.indexOf(x) === i).join(" ")) : "";
  layout(scene(st), panel({ titel: T.titel[S.year], text: S.year === 3 ? "" : T.text,
    extra: beruf + `<ul class="works">${cards}</ul>` + info + hotHint,
    actions: btn("tzEnde", T.ende), side: sideBoxes() }));
}

function pJahresende(){
  const st = baseScene();
  st.sky = "dawn"; st.water = { level: LEVEL.tief };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache", plants: "stoppel" }));
  st.people = [{ x: inDorf() ? 1000 : 846, pose: "winken", n: 0, flip: true }];
  const T = TEXT.jahresende[S.year];
  layout(scene(st), panel({ titel: T.titel, text: T.text, actions: btn("toNext", T.knopf), side: sideBoxes() }));
}

function pDorfWahl(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief }; st.oldMark = true;
  st.fields = [{ soil: "brache", plants: "stoppel" }, { soil: S.fields[1].sown ? "brache" : "trocken", plants: S.fields[1].sown ? "stoppel" : null }, { soil: "trocken" }];
  const T = TEXT.dorfWahl, p = { n: NUM.dorfBeitrag, d: KO.deich, w: S.wall, e: KO.erdwall };
  if (!S.dorf){
    st.people = [0, 1, 2, 3, 4, 5].map(i => ({ x: 760 + i * 28, pose: "stehen", n: i, flip: i % 2 === 1 }));
    const versuch = S.versuch > 1 ? `<p class="fb">Zweiter Versuch: Du entscheidest noch einmal.</p>` : "";
    layout(scene(st), panel({ titel: T.titel, text: T.text, extra: versuch + `<p class="fb">${esc(fill(T.kraftInfo, { k: S.kraft }))}</p>` + choices("wahlDorf", T.optionen, p), side: sideBoxes() }));
    return;
  }
  st.people = [{ x: 1040, pose: "stehen", n: 1 }];
  layout(scene(st), panel({ titel: T.titel, text: T.allein, side: sideBoxes(), actions: btn("toNext", UI.weiter) }));
}

function pDorfbau(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief }; st.oldMark = true;
  st.fields = [{ soil: "brache", plants: "stoppel" }, { soil: S.fields[1].sown ? "brache" : "trocken", plants: S.fields[1].sown ? "stoppel" : null }, { soil: "trocken" }];
  const T = TEXT.dorfbau;
  const k = S.dorfStep;
  const rest = KO.deich - S.deichPaid;
  let text, act = "", extra = "";
  if (k === 0){
    const step = T.schritte[0];
    st.people = [{ x: 820, pose: "bauen", n: 4 }, { x: 1060, pose: "tragen", n: 5 }];
    if (rest > 0 && S.kraft > 0){
      st.hot = [{ id: "deich", g: "korb", label: step.name, rect: { x: PILE.x - 40, y: PILE.y - 60, w: 110, h: 74 }, data: { tx: DIKE.x0 + 22, ty: GROUND.f3.y - 30, load: "erde" } }];
      st.extra = big(A.loadPile({ x: PILE.x, y: PILE.y }), PILE.x, PILE.y, 1.1);
      text = fill(step.text, { n: KO.deich });
      extra = `<p class="big">${S.deichPaid} von ${KO.deich} Kraft</p>` + hint(step.hint);
    } else {
      text = rest > 0 ? fill(T.fehlt, { n: rest }) : step.fertig;
      act = btn("bauen", T.weiterBauen);
    }
  } else if (k < 3){
    st.people = [{ x: 770, pose: "bauen", n: 0 }, { x: 880, pose: "tragen", n: 4 }, { x: 1000, pose: "bauen", n: 5 }, { x: 1090, pose: "tragen", n: 2 }];
    text = T.schritte[k].text; act = btn("bauen", T.schritte[k].knopf);
  } else { st.people = [{ x: 1124, pose: "winken", n: 0 }]; text = T.fertig; act = btn("toNext", T.weiter); }
  const steps = `<ol class="buildsteps">${T.schritte.map((x, i) => `<li class="${i < k ? "ok" : ""}">${esc(x.name)}${i < k ? " ✓" : ""}</li>`).join("")}</ol>`;
  layout(scene(st), panel({ titel: T.titel, text, extra: steps + extra, actions: act, side: sideBoxes() }));
}

function pHausbau(){
  const st = baseScene();
  st.water = { level: LEVEL.normal };
  st.fields = [0, 1, 2].map(() => ({ soil: "schlamm", boundary: false }));
  const T = TEXT.hausbau;
  const done = S.hausProg >= KO.haus;
  let extra = `<p class="big">${S.hausProg} von ${KO.haus} Kraft</p>`;
  if (!done){
    st.hot = [{ id: "haus", g: "korb", label: T.titel, rect: { x: PILE.x - 40, y: PILE.y - 60, w: 110, h: 74 }, data: { tx: 896, ty: GROUND.site.y - 30, load: "ziegel" } }];
    st.extra = big(A.loadPile({ x: PILE.x, y: PILE.y, kind: "ziegel" }), PILE.x, PILE.y, 1.1);
    st.people = [{ x: 960, pose: "bauen", n: 0 }];
    extra += hint(T.hint);
  } else st.people = [{ x: 960, pose: "winken", n: 0 }];
  layout(scene(st), panel({ titel: T.titel, text: done ? T.fertig : fill(T.text, { n: KO.haus }), extra,
    actions: btn("toNext", UI.weiter, done ? "" : "disabled"), side: sideBoxes() }));
}

function gruende(){
  const g = [];
  const s2 = S.supplies[2] || {}, s3 = S.supplies[3] || {};
  g.push(`Jahr 2: Die Flut war zu niedrig. Es fehlten ${s2.hunger} Säcke.`);
  if (S.y1.wall > 0) g.push(`Nach Jahr 1 habt ihr ${S.y1.wall} Kraft in den Erdwall gesteckt. Dafür hattet ihr ${S.y1.wall * NUM.korbTausch} Säcke weniger Vorrat.`);
  if (S.schaduf === "lassen") g.push("Ihr habt keinen Schaduf gebaut. Das mittlere Feld blieb trocken.");
  else if (S.buckets < NUM.schadufVoll) g.push(`Mit dem Schaduf habt ihr nur ${S.buckets} Eimer geschöpft.`);
  const flood = S.flood3 && S.flood3.house === "zerstoert" ? "hat euren Hof zerstört und den Vorrat verdorben" : "hat euren Hof nicht zerstört – der Erdwall hielt";
  g.push(`Jahr 3: Ihr seid allein geblieben. Das Hochwasser ${flood}. Es fehlten ${s3.hunger} Säcke, und niemand hat geholfen.`);
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
    layout(villageView({ fill: 0.3, alt: "Das Dorf der Nachbarn" }), panel({ titel: T.alleinTitel, text: T.allein, actions: btn("toNext", T.weiter), side: sideBoxes() }));
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

function berufPlus(){
  if (S.dorf !== "dorf" || !S.beruf) return 0;
  if (S.beruf === "toepfer") return NUM.toepferTausch;
  if (S.beruf === "verwalter") return NUM.verwalterLohn;
  if (S.beruf === "weberin") return 3 * (KO.ernten - KO.ernteKupfer) * NUM.korbTausch;
  return 3 * KO.grenzstein * NUM.korbTausch;
}

function bilanz(){
  const T = BILANZ, Z = T.zeilen;
  const years = [1, 2, 3, 4].filter(y => S.supplies[y]);
  const res = s => ({ satt: "satt", knapp: "gerade so satt", hunger: `Hunger (es fehlten ${s.hunger} Säcke)`, geholfen: "satt – mit Hilfe des Dorfspeichers" }[s.status]);
  const u = y => S.use[y] || {};
  const rows = [
    [Z.flut, y => T.flut[FLOOD[y]]],
    [Z.ernte, y => fill(UI.saecke, { n: S.supplies[y].harvest })],
    [Z.felder, y => u(y).felder || 0],
    [Z.schaduf, y => u(y).schaduf || "–"],
    [Z.schutz, y => (u(y).schutz || 0) + (u(y).nachholen || 0) || "–"],
    [Z.koerbe, y => u(y).koerbe || "–"],
    [Z.frei, y => S.frei[y] ?? S.kraft],
    [Z.hilfe, y => (S.supplies[y].help ? fill(UI.saecke, { n: S.supplies[y].help }) + " aus dem Dorfspeicher" : "keine")],
    [Z.ergebnis, y => res(S.supplies[y]) + (y === 3 && S.lost ? " – Hof verlassen" : "")],
    [Z.vorrat, y => fill(UI.saecke, { n: S.vorratEnde[y] ?? S.vorrat })]
  ];
  const table = `<table class="compare four"><thead><tr><th></th>${years.map(y => `<th>Jahr ${y}</th>`).join("")}</tr></thead><tbody>${rows.map(([z, fn]) =>
    `<tr><th>${esc(z)}</th>${years.map(y => `<td>${esc(String(fn(y)))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  let vergleich = "";
  if (S.supplies[4]){
    vergleich = S.dorf === "dorf" && S.beruf
      ? fill(T.vergleichDorf, { n: berufPlus(), grund: T.gruende[S.beruf] })
      : T.vergleichAllein;
    vergleich = `<h3>${esc(T.vergleich)}</h3><p>${esc(vergleich)}</p>`;
  }
  const ent = [
    `Trockenzeit Jahr 1: ${S.y1.koerbe} Körbe getauscht, ${S.y1.wall} Kraft am Erdwall`,
    `Jahr 2: ${TEXT.schadufWahl.optionen[S.schaduf].name}${S.schaduf === "bauen" ? ` (${S.buckets} Eimer geschöpft)` : ""}`,
    `Ende Jahr 2: ${TEXT.dorfWahl.optionen[S.dorf].name}`
  ];
  if (S.beruf) ent.push(`Jahr 3: Neuer Beruf – ${TEXT.beruf.optionen[S.beruf].name}`);
  S.neu = [];
  $app.innerHTML = `${topbar()}<main class="page">
    <h2>${esc(T.titel)}</h2>
    <section><h3>${esc(T.tabelle)}</h3>${table}${vergleich}</section>
    <div class="two">
      <section><h3>${esc(T.entscheidungen)}</h3><ul class="gruende">${ent.map(x => `<li>${esc(x)}</li>`).join("")}</ul></section>
      <section><h3>${esc(T.rolle)}</h3>${rolleHTML()}</section>
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
  const B = SPIELBELEGE, s2 = S.supplies[2] || {}, s3 = S.supplies[3] || {};
  const list = [B.schlamm, fill(B.ernte1, { n: (S.supplies[1] || {}).harvest || 12 }), B.kraft, B.niedrig];
  list.push(s2.status === "hunger" ? B.hunger : B.knapp);
  if (S.schaduf === "bauen") list.push(B.schaduf);
  list.push(B.hoch);
  if (S.dorf === "dorf"){ list.push(B.deich, B.speicher); if (S.supplies[4] && S.beruf) list.push(B.beruf); }
  else {
    list.push(S.flood3 && S.flood3.house === "zerstoert" ? B.alleinZerstoert : B.alleinWall);
    if (s3.hunger > 0) list.push(B.alleinHunger);
    list.push(B.dorfGeschuetzt);
  }
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

function closeYear(y){ S.frei[y] = S.kraft; S.vorratEnde[y] = S.vorrat; }

function goPhase(year, phase){
  clearToast(); resetProgress();
  if (phase === "sirius" && year > 1 && S.year !== year) closeYear(S.year);
  S.year = year; S.phase = phase; S.month = monthOf(year, phase); S.last = null; S.neu = [];
  if (phase === "sirius"){ S.fields = freshFields(); S.harvested = 0; S.kraft = NUM.kraft; useYear(); }
  if (phase === "dorfWahl" && !S.dorf) S.snap = JSON.stringify({ ...S, snap: null });
  if (phase === "trockenzeit"){
    if (year === 1) learn("brache");
    if (year === 4){
      learn("teilung");
      if (S.dorf === "dorf" && !tz().beruf){
        tz().beruf = true;
        if (S.beruf === "toepfer") book("toepfer", NUM.toepferTausch);
        if (S.beruf === "verwalter") book("verwalter", NUM.verwalterLohn);
      }
    }
  }
  save(); render(); window.scrollTo(0, 0);
}
function advance(){
  const n = nextPhase(S.year, S.phase, flags());
  if (!n){ closeYear(S.year); S.screen = "bilanz"; S.neu = []; save(); render(); window.scrollTo(0, 0); return; }
  goPhase(n.year, n.phase);
}

/* Hochwasser in Jahr 3, Monat 4: Was passiert mit dem Hof, wenn man allein lebt? */
function hochwasser(){
  if (S.year !== 3 || S.dorf !== "allein" || S.flood3) return;
  S.flood3 = hochwasserAllein(S.vorrat, S.wall >= KO.erdwall);
  S.hausWeg = S.flood3.house === "zerstoert";
  book("flut", -S.flood3.lost);
}

/* ---------- Gesten ---------- */

function doStep(i){
  const f = S.fields[i], step = nextStep(i);
  if (!step) return;
  spend(step.cost, "felder");
  if (step.id === "pfluegen") f.plowed = true; else if (step.id === "saeen") f.sown = true; else f.grenze = true;
  S.last = { i, what: step.id };
}
function reap(i){
  const f = S.fields[i];
  if (!f.sown || f.done) return;
  spend(ernteKosten(ctx()), "felder");
  f.done = true; S.harvested += fieldYield(S.year, i, S.buckets); S.last = { i, what: "reap" };
}
function bucket(){
  if (S.busy) return;
  spend(KO.eimer, "schaduf");
  S.busy = true; S.shadufT = 1; S.buckets++; render();
  setTimeout(() => { S.shadufT = 0.5; S.busy = false; save(); render(); }, 650);
}

const HINTS = () => ({
  stein: TEXT.aussaat.schritte.grenzstein.hint, seil: TEXT.aussaat.schritte.grenzeNeu.hint,
  pflug: TEXT.aussaat.schritte.pfluegen.hint, saat: TEXT.aussaat.schritte.saeen.hint,
  ernte: TEXT.ernte.hint, zug: TEXT.schaduf.hint, korb: TEXT.trockenzeit.arbeiten.erdwall.hint, flecht: TEXT.trockenzeit.arbeiten.koerbe.hint
});

initGestures({
  canStart(type, id){
    if (S.screen !== "spiel" || S.busy) return "";
    if (["stein", "seil", "pflug", "saat"].includes(type)){
      const i = +id[1];
      if (!affordable(i)) return TEXT.aussaat.keineKraft;
      return true;
    }
    if (type === "ernte") return true;
    if (type === "zug"){
      if (S.buckets >= NUM.schadufVoll) return TEXT.schaduf.voll;
      if (S.kraft - KO.eimer < schadufReserve(S.buckets + 1)) return TEXT.aussaat.keineKraft;
      return true;
    }
    if (type === "korb") return S.kraft >= (id === "haus" ? NUM.hausLadung : 1) ? true : TEXT.trockenzeit.keineKraft;
    if (type === "flecht") return S.kraft >= KO.korb ? true : TEXT.trockenzeit.keineKraft;
    return true;
  },
  onTap(type, id, el, msg){
    toast(msg || TEXT.aussaat.tippen + (HINTS()[type] || ""), "", 3600);
  },
  onDone(type, id){
    if (["stein", "seil", "pflug", "saat"].includes(type)) doStep(+id[1]);
    else if (type === "ernte") reap(+id[1]);
    else if (type === "zug") return bucket();
    else if (type === "korb"){
      if (id === "haus"){ spend(NUM.hausLadung, "schutz"); S.hausProg += NUM.hausLadung; }
      else if (id === "deich"){ spend(1, "schutz"); S.deichPaid++; }
      else if (id === "erdwall"){ spend(1, "schutz"); S.wall++; tz().wall++; if (S.year === 1) S.y1.wall++; }
      else if (id === "nachholen"){ spend(1, "nachholen"); S.schuld--; tz().nach++; }
      else if (id === "ausbessern"){ spend(1, "schutz"); tz().ausb++; }
    } else if (type === "flecht"){
      spend(KO.korb, "koerbe"); book("koerbe", NUM.korbTausch); tz().koerbe++;
      if (S.year === 1) S.y1.koerbe++;
    }
    S.neu = []; save(); render();
  }
});

const actions = {
  startGame(){ S = fresh(); S.screen = "spiel"; goPhase(1, "sirius"); },
  toAchet(){ goPhase(S.year, "achet"); },
  nextMonth(){ S.month++; S.neu = []; if (S.phase === "achet" && S.month === 4) hochwasser(); save(); render(); },
  toNext(){ advance(); },
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
    ({ 1: ["schlamm", "kraft"], 2: ["niedrig"], 3: ["vorrat"], 4: [] })[S.year].forEach(learn);
    save(); render();
  },
  feldInfo(el){
    const i = +el.dataset.id.slice(1), f = S.fields[i], T = TEXT.aussaat;
    if (S.phase === "ernte"){ toast(TEXT.ernte.nichts); return; }
    if (f.sown){ toast(T.schonGesaet); return; }
    if (!sowable(S.year, i, S.buckets)){ toast(S.year === 2 && i === 2 ? T.zuHoch : T.zuTrocken, "", 3200); return; }
    toast(T.keineKraft, "", 3600);
  },
  tzEnde(){
    const t = tz();
    if (S.year === 3 && S.dorf === "dorf" && t.ausb < KO.deichAusbessern){ S.schuld += KO.deichAusbessern - t.ausb; t.ausb = KO.deichAusbessern; }
    if (S.year === 1) learn("kalender");
    advance();
  },
  wahlSchaduf(el){ S.schaduf = el.dataset.id; if (S.schaduf === "bauen") spend(KO.schadufBau, "schaduf"); save(); render(); },
  wahlDorf(el){
    S.dorf = el.dataset.id;
    if (S.dorf === "dorf"){ book("dorf", -Math.min(S.vorrat, NUM.dorfBeitrag)); advance(); return; }
    save(); render();
  },
  bauen(){
    if (S.dorfStep === 0 && S.deichPaid < KO.deich) S.schuld += KO.deich - S.deichPaid;
    S.dorfStep++; S.neu = []; save(); render();
  },
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
