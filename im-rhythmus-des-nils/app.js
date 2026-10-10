/* Im Rhythmus des Nils 0.6 – Bildschirme und Bedienung (Querformat) */
import { NUM, GAME, SEASONS, UI, MERKSAETZE, ROLLE_REIHENFOLGE, TEXT, BILANZ, QUELLE, QUELLTEXT, AUSSAGEN,
  URTEIL, QUELLE_BELEGE, ALLERDINGS, SPIELBELEGE, IMPULS, BEGRIFFE } from "./content.js";
import { nextPhase, monthOf, growMonths, RISE, RISE_HOCH, seasonsKnown, sowable, fieldYield, supply,
  fieldSteps, fieldRest, ernteKosten, tauschMoeglich, FLOOD, DORFBAU, dorfbauGesten, kraftImJahr, hofVerloren } from "./sim.js";
import { scene, villageView, LEVEL, GROUND, big, fieldRange, stonePos, DIKE } from "./scene.js";
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
  kraft: NUM.kraft, use: {}, frei: {}, vorratEnde: {}, koerbe: {}, tz: {},
  schaduf: null, beruf: null, dorfRate: 0, dorfProg: { deich: 0, haeuser: 0, speicher: 0 }, beitrag: null,
  last: null, supplies: {}, hunger: {}, ledger: [], rolle: [], neu: [], q: null, pick: {},
  lost: false, snap: null, versuch: 1
});
const store = createStore("nil-v06", fresh);
let S = store.load() || fresh();
const save = () => store.save(S);
const fill = (t, p = {}) => String(t).replace(/\{(\w+)\}/g, (_, k) => (k in p ? p[k] : `{${k}}`))
  .replace(/(^|\D)1 Säcken?(?!\p{L})/gu, (_, pre) => pre + "1 Sack");
const flags = () => ({ schaduf: S.schaduf, verloren: S.lost });
const inDorf = () => S.year >= 3;
const ctx = () => (S.year === 4 ? { landvermesser: S.beruf === "landvermesser", kupfer: S.beruf === "weberin" } : {});
const FIELD_X = [272, 500, 702];
const PILE = { x: 548, y: GROUND.f2.y };          // Erdhaufen am mittleren Feld
const WEAVE = { x: 772, y: GROUND.f3.y };         // im Schatten der Feldhütte flechten
const HARVESTER = 2;                               // dieses Familienmitglied erntet immer

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
function useYear(){ return (S.use[S.year] ||= { felder: 0, schaduf: 0, dorf: 0, koerbe: 0 }); }
function spend(n, cat){ S.kraft = Math.max(0, S.kraft - n); useYear()[cat] += n; }

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

/* Arbeitskraft als Balken ohne Zahlen: frei – für die Ernte nötig – verbraucht */
const SICHEL = `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 17 L 7 13" stroke="#5c3a1e" stroke-width="3" stroke-linecap="round"/><path d="M7 13 Q 18 8 9 2" fill="none" stroke="#3b2718" stroke-width="3.4" stroke-linecap="round"/><path d="M7 13 Q 18 8 9 2" fill="none" stroke="#e8e2cf" stroke-width="1.6" stroke-linecap="round"/></svg>`;
/* Felder, die in diesem Jahr noch geerntet werden (begonnen oder noch bestellbar) */
const BEFORE_HARVEST = ["sirius", "achet", "schadufWahl", "schaduf", "aussaat", "wachsen", "ernte", "beruf"];
function harvestReserve(){
  if (!BEFORE_HARVEST.includes(S.phase)) return 0;
  return S.fields.reduce((sum, f, i) => {
    if (f.done) return sum;
    const planned = started(f) || (S.phase !== "ernte" && sowable(S.year, i, S.buckets) && affordable(i));
    return sum + (planned ? ernteKosten(ctx()) : 0);
  }, 0);
}
/* Der Balken zeigt linear die verbleibende Arbeitskraft (ohne Zahlen).
   Der schraffierte Teil am Ende ist die Kraft, die noch für die Ernte gebraucht wird. */
function kraftBar(left, r, total = NUM.kraft){
  const pct = v => Math.max(0, Math.min(100, (v / total) * 100)).toFixed(2) + "%";
  const inner = left > 0 ? Math.min(100, (r / left) * 100).toFixed(2) + "%" : "0%";
  return `<div class="bar" role="img" aria-label="${esc(UI.kraft)}"><span class="fill" style="width:${pct(left)}">${r > 0 ? `<span class="res" style="width:${inner}">${r / total > 0.06 ? SICHEL : ""}</span>` : ""}</span></div>`;
}
function kraftBox(){
  const left = Math.max(0, S.kraft), r = Math.min(left, harvestReserve());
  let note = "";
  if (left <= 0.01) note = UI.kraftLeer;
  else if (r > 0) note = UI.kraftErnte;
  else if (left / NUM.kraft < 0.12) note = UI.kraftWenig;
  return `<div class="kraft"><small>${esc(UI.kraft)}</small>${kraftBar(left, r)}${note ? `<p class="kraft-use">${esc(note)}</p>` : ""}</div>`;
}
const sideBoxes = () => kraftBox() + vorratBox();

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
  if (y >= 3) st.village = { dike: true, stage: 1, fill: 0.55 };
  else if (S.phase === "dorfbau"){
    const p = S.dorfProg, n = id => DORFBAU.find(x => x.id === id).n;
    st.village = { dike: true, dikeK: Math.max(0.08, p.deich / n("deich")), stage: Math.min(1, 0.05 + 0.75 * p.haeuser / n("haeuser") + 0.2 * p.speicher / n("speicher")), fill: 0.4 };
  } else st.hof = { fill: Math.min(1, (S.vorrat + S.harvested) / 12) };
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
    ernte: pErnte, versorgung: pVersorgung, trockenzeit: pTrockenzeit, jahresende: pJahresende,
    dorfRat: pDorfRat, dorfbau: pDorfbau, verloren: pVerloren, beruf: pBeruf }[S.phase])();
}

function pSirius(){
  const st = baseScene();
  st.sky = "dawn"; st.water = { level: LEVEL.tief };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache", plants: S.year === 1 ? "stoppel" : null }));
  st.people = [{ x: inDorf() ? 980 : 846, pose: "winken", n: 0, flip: true }];
  const T = TEXT.sirius[S.year];
  const schwach = S.year > 1 && S.kraft < NUM.kraft;
  const extra = S.year > 1 ? `<p class="fb">${esc(schwach ? UI.kraftSchwach : UI.kraftNeu)}</p>` : "";
  layout(scene(st), panel({ titel: T.titel, text: T.text, extra, actions: btn("toAchet", T.knopf), side: S.year > 1 ? sideBoxes() : kraftBox() }));
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
  if (last && y === 1){ st.labels.push("hof"); learn("steigt"); }
  if (last && y === 3){ learn("hoch"); learn("deich"); st.ghost = LEVEL.hoch; st.labels.push("deich"); }
  layout(scene(st), panel({ titel: `${T.titel} – ${S.month}. Monat`, text: T.monate[S.month - 1], side: y > 1 ? vorratBox() : "",
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
    actions: btn("toNext", T.weiter), side: kraftBox() }));
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
      return `${ok ? "✓ " : ""}${T.schritte[s.id].name}`;
    }).join(" · ") + ` · ${T.spaeter}`;
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
  const stage = "reif";
  st.fields = fieldViews(stage);
  const c = ctx();
  st.hot = S.fields.map((f, i) => f.sown && !f.done
    ? { id: "f" + i, g: "ernte", label: "ernten", data: { stage, ...(c.kupfer ? { kupfer: 1 } : {}) } }
    : { id: "f" + i, act: "feldInfo", label: TEXT.ernte.nichts, done: true });
  if (S.last && S.last.what === "reap") st.people.push({ x: fieldRange(S.last.i).x1 - 14, pose: c.kupfer ? "ernten2" : "ernten", n: HARVESTER });
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
  if (sp.status === "hunger"){ res = fill(T.hunger, { n: sp.hunger }) + (S.year === 2 ? " " + T.nachbarn : ""); bowl = 0; }
  if (sp.status === "geholfen") res = fill(T.geholfen, { n: sp.help });
  else if (S.year === 3) res += " " + T.dorfAndere;
  layout(scene(st), panel({ titel: T.titel, text: fill(T.ernte, { n: sp.harvest }) + " " + fill(T.bedarf, { n: sp.need }),
    extra: `${sacks(sp.harvest, "row")}<div class="result ${sp.status}">${familyBowls(bowl)}<p>${esc(res)}</p></div>`,
    side: sideBoxes(), actions: btn("toNext", UI.weiter) }));
}

/* ---------- Trockenzeit: übrige Arbeitskraft einsetzen ---------- */

function tz(){ return (S.tz[S.year] ||= { koerbe: 0, ausb: false, beruf: false }); }
const pflicht = () => S.year === 3 && !tz().ausb && S.kraft > 0.01;

function pTrockenzeit(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief };
  st.fields = S.fields.map((f, i) => ({ soil: sowable(S.year, i, S.buckets) ? "brache" : "trocken", plants: f.sown ? "stoppel" : null }));
  const T = TEXT.trockenzeit, W = T.arbeiten, t = tz();
  st.hot = []; st.extra = "";
  const card = (title, text, state, cls = "") => `<li class="work ${cls}"><b>${esc(title)}</b><span>${esc(text)}</span>${state ? `<em>${esc(state)}</em>` : ""}</li>`;
  let cards = "", hints = [];
  if (S.year === 3){
    const ohneKraft = !t.ausb && S.kraft <= 0.01;
    cards += card(W.ausbessern.name, W.ausbessern.text, t.ausb ? W.ausbessern.fertig : ohneKraft ? W.ausbessern.nachbarn : "", t.ausb || ohneKraft ? "ok" : "pflicht");
    if (pflicht()){
      st.hot.push({ id: "ausbessern", g: "korb", label: W.ausbessern.name, rect: { x: PILE.x - 40, y: PILE.y - 60, w: 110, h: 74 }, data: { tx: DIKE.x0 + 22, ty: DIKE.top + 10, load: "erde" } });
      st.extra += big(A.loadPile({ x: PILE.x, y: PILE.y, kind: "erde" }), PILE.x, PILE.y, 1.1);
      hints.push(W.ausbessern.hint);
    }
  }
  const korbOk = !pflicht() && S.kraft >= KO.korb - 1e-9;
  cards += card(W.koerbe.name, fill(W.koerbe.text, { n: NUM.korbTausch }), t.koerbe ? `${t.koerbe} ${t.koerbe === 1 ? "Korb" : "Körbe"} getauscht` : "", korbOk || t.koerbe ? "" : "off");
  if (korbOk){ st.hot.push({ id: "koerbe", g: "flecht", label: W.koerbe.name, rect: { x: WEAVE.x - 34, y: WEAVE.y - 74, w: 100, h: 84 }, data: { sx: WEAVE.x, sy: WEAVE.y } }); hints.push(W.koerbe.hint); }
  st.extra += big(A.weaveBasket({ x: WEAVE.x, y: WEAVE.y, p: 0 }), WEAVE.x, WEAVE.y, 1.5);
  st.people.push({ x: WEAVE.x - 34, pose: "flechten", n: 3, kind: true });
  if (t.koerbe) st.extra += big(A.basketRow({ x: 630, y: WEAVE.y, n: t.koerbe }), 630, WEAVE.y, 1.2);
  // Jahr 4: was der Beruf bringt
  let beruf = "";
  if (S.year === 4 && S.beruf){
    beruf = `<div class="beruf-effekt"><p>${esc(fill(T[S.beruf], { n: S.beruf === "toepfer" ? NUM.toepferTausch : NUM.verwalterLohn }))}</p></div>`;
    if (S.beruf === "toepfer") st.extra += big(A.potter({ x: 900, y: GROUND.site.y, n: 0 }), 900, GROUND.site.y, 1.1);
    if (S.beruf === "verwalter") st.extra += big(A.steward({ x: 900, y: GROUND.site.y, n: 0 }), 900, GROUND.site.y, 1.1);
    if (S.beruf === "weberin") st.extra += big(A.linenBolt({ x: 880, y: GROUND.site.y }) + A.copperSickles({ x: 910, y: GROUND.site.y }), 900, GROUND.site.y, 1.3);
    if (S.beruf === "landvermesser") st.extra += big(A.surveyor({ x: 420, y: GROUND.f2.y, n: 0 }), 420, GROUND.f2.y, 1.2);
  }
  const info = (pflicht() ? `<p class="fb">${esc(T.pflichtZuerst)}</p>` : "") + (!pflicht() && !korbOk ? `<p class="fb">${esc(T.keineKraft)}</p>` : "");
  layout(scene(st), panel({ titel: T.titel[S.year], text: S.year === 3 ? "" : T.text,
    extra: beruf + `<ul class="works">${cards}</ul>` + info + (hints.length ? hint(hints[0]) : ""),
    actions: btn("tzEnde", T.ende, pflicht() ? "disabled" : ""), side: sideBoxes() }));
}

function pJahresende(){
  const st = baseScene();
  st.sky = "dawn"; st.water = { level: LEVEL.tief };
  st.fields = [0, 1, 2].map(() => ({ soil: "brache", plants: "stoppel" }));
  st.people = [{ x: inDorf() ? 1000 : 846, pose: "winken", n: 0, flip: true }];
  if (S.year === 3) st.people.push({ x: 1040, pose: "stehen", n: 1 }, { x: 1066, pose: "stehen", n: 3, kind: true });
  const T = TEXT.jahresende[S.year];
  layout(scene(st), panel({ titel: T.titel, text: T.text, actions: btn("toNext", T.knopf), side: sideBoxes() }));
}

function pDorfRat(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief }; st.oldMark = true;
  st.fields = [{ soil: "brache", plants: "stoppel" }, { soil: S.fields[1].sown ? "brache" : "trocken", plants: S.fields[1].sown ? "stoppel" : null }, { soil: "trocken" }];
  st.people = [0, 1, 2, 3, 4, 5].map(i => ({ x: 760 + i * 28, pose: "stehen", n: i, flip: i % 2 === 1 }));
  const T = TEXT.dorfRat;
  layout(scene(st), panel({ titel: T.titel, text: T.text, actions: btn("dorfStart", T.knopf), side: sideBoxes() }));
}

function pDorfbau(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief }; st.oldMark = true;
  st.fields = [{ soil: "brache", plants: "stoppel" }, { soil: S.fields[1].sown ? "brache" : "trocken", plants: S.fields[1].sown ? "stoppel" : null }, { soil: "trocken" }];
  const T = TEXT.dorfbau;
  const cur = DORFBAU.find(x => S.dorfProg[x.id] < x.n);
  const steps = `<ol class="buildsteps">${DORFBAU.map(x => { const done = S.dorfProg[x.id] >= x.n; return `<li class="${done ? "ok" : ""}">${esc(T.schritte[x.id].name)}${done ? " ✓" : ""}</li>`; }).join("")}</ol>`;
  let text = T.text, extra = steps, act = "";
  if (cur){
    const kind = { deich: "erde", haeuser: "ziegel", speicher: "korn" }[cur.id];
    const target = { deich: [DIKE.x0 + 22, GROUND.f3.y - 30], haeuser: [900, GROUND.site.y - 30], speicher: [1030, GROUND.site.y - 30] }[cur.id];
    st.hot = [{ id: cur.id, g: "korb", label: T.schritte[cur.id].name, rect: { x: PILE.x - 40, y: PILE.y - 60, w: 110, h: 74 }, data: { tx: target[0], ty: target[1], load: kind } }];
    st.extra = big(A.loadPile({ x: PILE.x, y: PILE.y, kind: kind === "ziegel" ? "ziegel" : "erde" }), PILE.x, PILE.y, 1.1);
    st.people = [{ x: 820, pose: "bauen", n: 4 }, { x: 960, pose: "tragen", n: 5 }, { x: 1090, pose: "bauen", n: 1 }];
    extra += hint(T.schritte[cur.id].hint);
  } else {
    st.people = [{ x: 1124, pose: "winken", n: 0 }];
    text = T.fertig;
    extra += `<p class="fb">${esc(S.beitrag > 0 ? fill(T.beitrag, { n: S.beitrag }) : T.keinBeitrag)}</p>`;
    act = btn("toNext", T.weiter);
  }
  const last = [...DORFBAU].reverse().find(x => S.dorfProg[x.id] > 0);
  if (cur && last && S.dorfProg[last.id] >= last.n) extra = `<p class="fb">${esc(T.schritte[last.id].fertig)}</p>` + extra;
  layout(scene(st), panel({ titel: T.titel, text, extra, actions: act, side: sideBoxes() }));
}

function pVerloren(){
  const st = baseScene();
  st.sky = "schemu"; st.water = { level: LEVEL.tief };
  st.fields = S.fields.map((f, i) => ({ soil: sowable(2, i, S.buckets) ? "brache" : "trocken", plants: f.sown ? "stoppel" : null }));
  st.people = [0, 1, 2, 3].map(i => ({ x: 1000 + i * 34, pose: "gehen", n: i, kind: i === 3 }));
  const T = TEXT.verloren, k = S.koerbe[1] || 0;
  const g = [fill(T.flut, { n: S.supplies[2].hunger }), k ? fill(T.koerbe, { n: k }) : T.keineKoerbe];
  g.push(S.schaduf === "bauen" ? T.eimer : T.schaduf);
  layout(scene(st), panel({ titel: T.titel, text: T.text,
    extra: `<p class="big">${esc(T.gruende)}</p><ul class="gruende">${g.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`,
    actions: btn("nochmal", T.nochmal), side: vorratBox() }));
}

function pBeruf(){
  const T = TEXT.beruf;
  const vv = o => villageView({ sky: "achet", fill: 0.45, ...o });
  if (!S.beruf){
    layout(vv({ alt: "Das Dorf berät" }), panel({ titel: T.titel, text: T.text, extra: `<div class="choices four">${Object.entries(T.optionen).map(([id, o]) =>
      `<button class="choice" data-act="beruf" data-id="${id}"><b>${esc(o.name)}</b><span>${esc(o.text)}</span></button>`).join("")}</div>` }));
    return;
  }
  layout(vv({ mine: S.beruf, n: 0 }), panel({ titel: T.titel, text: fill(T.ergebnis, { name: T.optionen[S.beruf].name }), actions: btn("toNext", T.weiter), side: sideBoxes() }));
}

/* ---------- Bilanz ---------- */

function berufPlus(){
  if (!S.beruf) return 0;
  if (S.beruf === "toepfer") return NUM.toepferTausch;
  if (S.beruf === "verwalter") return NUM.verwalterLohn;
  const gespart = S.beruf === "weberin" ? 3 * (KO.ernten - KO.ernteKupfer) : 3 * KO.grenzstein;
  return Math.floor(gespart / KO.korb + 1e-9) * NUM.korbTausch;
}

/* gestapelter Balken: wofür die Arbeitskraft eines Jahres gebraucht wurde (ohne Zahlen) */
function useBar(y){
  const u = S.use[y] || {}, total = NUM.kraft;
  const parts = [["felder", u.felder], ["schaduf", u.schaduf], ["dorf", u.dorf], ["koerbe", u.koerbe], ["frei", S.frei[y] ?? 0]];
  return `<div class="usebar">${parts.filter(([, v]) => v > 0.01).map(([k, v]) =>
    `<span class="u-${k}" style="width:${((v / total) * 100).toFixed(2)}%" title="${esc(BILANZ.kraftTeile[k])}"></span>`).join("")}</div>`;
}

function bilanz(){
  const T = BILANZ, Z = T.zeilen;
  const years = [1, 2, 3, 4].filter(y => S.supplies[y]);
  const res = s => ({ satt: "satt", knapp: "gerade so satt", hunger: `Hunger (es fehlten ${s.hunger === 1 ? "1 Sack" : s.hunger + " Säcke"})`, geholfen: "satt – mit Hilfe des Dorfspeichers" }[s.status]);
  const rows = [
    [Z.flut, y => esc(T.flut[FLOOD[y]])],
    [Z.ernte, y => esc(fill(UI.saecke, { n: S.supplies[y].harvest }))],
    [Z.kraft, y => useBar(y)],
    [Z.hilfe, y => esc(S.supplies[y].help ? fill(UI.saecke, { n: S.supplies[y].help }) + " aus dem Dorfspeicher" : "keine")],
    [Z.ergebnis, y => esc(res(S.supplies[y]))],
    [Z.vorrat, y => esc(fill(UI.saecke, { n: S.vorratEnde[y] ?? S.vorrat }))]
  ];
  const legend = `<p class="uselegend">${Object.entries(T.kraftTeile).map(([k, v]) => `<span class="u-${k}">${esc(v)}</span>`).join("")}</p>`;
  const table = `<table class="compare four"><thead><tr><th></th>${years.map(y => `<th>Jahr ${y}</th>`).join("")}</tr></thead><tbody>${rows.map(([z, fn]) =>
    `<tr><th>${esc(z)}</th>${years.map(y => `<td>${fn(y)}</td>`).join("")}</tr>`).join("")}</tbody></table>${legend}`;
  const vergleich = S.supplies[4] && S.beruf ? `<h3>${esc(T.vergleich)}</h3><p>${esc(fill(T.vergleichText, { n: berufPlus(), grund: T.gruende[S.beruf] }))}</p>` : "";
  const ent = [
    `Trockenzeit Jahr 1: ${S.koerbe[1] || 0} Körbe geflochten und getauscht`,
    `Jahr 2: ${TEXT.schadufWahl.optionen[S.schaduf].name}${S.schaduf === "bauen" ? ` (${S.buckets} Eimer geschöpft)` : ""}`
  ];
  if (S.beruf) ent.push(`Jahr 4: Neuer Beruf – ${TEXT.beruf.optionen[S.beruf].name}`);
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
  const B = SPIELBELEGE, s2 = S.supplies[2] || {};
  const list = [B.schlamm, fill(B.ernte1, { n: (S.supplies[1] || {}).harvest || 12 }), B.kraft, B.niedrig];
  list.push(s2.status === "hunger" ? B.hunger : B.knapp);
  if (S.schaduf === "bauen") list.push(B.schaduf);
  list.push(B.hoch, B.deich, B.speicher);
  if (S.supplies[4] && S.beruf) list.push(B.beruf);
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
  if (phase === "sirius"){
    S.fields = freshFields(); S.harvested = 0; useYear();
    S.kraft = kraftImJahr(S.supplies[year - 1] ? S.supplies[year - 1].hunger : 0);
  }
  if (phase === "trockenzeit"){
    if (year === 1){ learn("brache"); if (!S.snap) S.snap = JSON.stringify({ ...S, snap: null }); }
    if (year === 4){
      learn("teilung");
      if (!tz().beruf){
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
/* ein Korb beim Dorfbau: die übrige Arbeitskraft wird gleichmäßig auf alle Schritte verteilt */
function dorfStep(id){
  const x = DORFBAU.find(d => d.id === id);
  if (!x || S.dorfProg[id] >= x.n) return;
  S.dorfProg[id]++;
  const allDone = DORFBAU.every(d => S.dorfProg[d.id] >= d.n);
  spend(allDone ? S.kraft : S.dorfRate, "dorf");
  if (id === "speicher" && S.dorfProg.speicher >= x.n){
    S.beitrag = Math.min(S.vorrat, NUM.dorfBeitrag);
    book("dorf", -S.beitrag);
  }
}

const HINTS = () => ({
  stein: TEXT.aussaat.schritte.grenzstein.hint, seil: TEXT.aussaat.schritte.grenzeNeu.hint,
  pflug: TEXT.aussaat.schritte.pfluegen.hint, saat: TEXT.aussaat.schritte.saeen.hint,
  ernte: TEXT.ernte.hint, zug: TEXT.schaduf.hint, korb: TEXT.dorfbau.schritte.deich.hint, flecht: TEXT.trockenzeit.arbeiten.koerbe.hint
});

initGestures({
  canStart(type, id){
    if (S.screen !== "spiel" || S.busy) return "";
    if (["stein", "seil", "pflug", "saat"].includes(type)) return affordable(+id[1]) ? true : TEXT.aussaat.keineKraft;
    if (type === "zug"){
      if (S.buckets >= NUM.schadufVoll) return TEXT.schaduf.voll;
      if (S.kraft - KO.eimer < schadufReserve(S.buckets + 1) - 1e-9) return TEXT.aussaat.keineKraft;
      return true;
    }
    if (type === "flecht") return S.kraft >= KO.korb - 1e-9 ? true : TEXT.trockenzeit.keineKraft;
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
      if (id === "ausbessern"){ spend(Math.min(S.kraft, KO.deichAusbessern), "dorf"); tz().ausb = true; }
      else dorfStep(id);
    } else if (type === "flecht"){
      spend(KO.korb, "koerbe"); book("koerbe", NUM.korbTausch); tz().koerbe++;
      S.koerbe[S.year] = (S.koerbe[S.year] || 0) + 1;
    }
    S.neu = []; save(); render();
  }
});

const actions = {
  startGame(){ S = fresh(); S.screen = "spiel"; goPhase(1, "sirius"); },
  toAchet(){ goPhase(S.year, "achet"); },
  nextMonth(){ S.month++; S.neu = []; save(); render(); },
  toNext(){ advance(); },
  toVersorgung(){
    const h = S.harvested;
    const sp = supply(h, S.vorrat, S.year === 3 ? NUM.dorfspeicher : 0);
    S.supplies[S.year] = sp; S.harvested = 0;
    book("ueberschuss", sp.surplus);
    book("gegessen", -sp.fromVorrat);
    S.vorrat = sp.vorrat;
    S.hunger[S.year] = sp.hunger > 0;
    if (S.year === 2) S.lost = hofVerloren(sp.hunger);
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
  tzEnde(){ if (pflicht()) return; if (S.year === 1) learn("kalender"); advance(); },
  wahlSchaduf(el){ S.schaduf = el.dataset.id; if (S.schaduf === "bauen") spend(KO.schadufBau, "schaduf"); save(); render(); },
  dorfStart(){ S.dorfRate = S.kraft / dorfbauGesten(); goPhase(2, "dorfbau"); },
  beruf(el){ S.beruf = el.dataset.id; learn("berufe"); save(); render(); },
  nochmal(){
    if (!S.snap) return;
    const v = S.versuch + 1, snap = S.snap;
    S = JSON.parse(snap); S.snap = snap; S.versuch = v;
    resetProgress(); clearToast(); save(); render(); window.scrollTo(0, 0);
    toast(TEXT.verloren.versuch, "", 3600);
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
