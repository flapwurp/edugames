/* Im Rhythmus des Nils – Bildschirme und Bedienung */
import { GAME, SEASONS, FLOODS, ZONES, DORF, TEXT, REASONS, NOTES, EVENTS,
  QUELLE, AUSSAGEN, QUELLE_BELEGE, ALLERDINGS, IMPULSE, BEGRIFFE } from "./content.js";
import { FIELDS, zoneOf, floodOf, floodedZones, baseWater, evaluateYear,
  supplyYear1, supplyYear2, dorfResult, DORF_MAX } from "./sim.js";
import { newCode, createStore } from "../shared/session.js";
import { esc, openSheet, closeSheet } from "../shared/ui.js";

const $app = document.getElementById("app");
const store = createStore("nil-v01", () => ({
  screen: "start", code: null,
  probe: 0, probeSown: [],
  year: 1, step: "sirius", assign: Array(GAME.familySize).fill(null),
  results: {}, supply1: null, supply2: null,
  dist: { own: 0, village: 0 }, own: 0, village: DORF.nachbarnGeben,
  dorfChoices: [], dorf: null, dorfDone: false,
  events: [], answers: {}, pick: {}
}));
let S = store.load() || store.fresh();
const save = () => store.save(S);
const fill = (t, p = {}) => String(t)
  .replace(/\{(\w+)\}/g, (_, k) => (k in p ? p[k] : `{${k}}`))
  .replace(/(^|\D)1 Säcken?(?!\p{L})/gu, (_, pre) => pre + "1 Sack");

function go(screen){ S.screen = screen; save(); render(); window.scrollTo(0, 0); }
function addEvent(key, params = {}){
  const id = key + JSON.stringify(params);
  if (!S.events.some(e => e.id === id)) S.events.push({ id, key, params });
}
const eventText = e => fill(EVENTS[e.key][1], e.params);
const flood = () => floodOf(S.code, S.year);
const dorfState = () => (S.year === 2 && S.dorf ? S.dorf : {});

/* ---------- Bildbausteine ---------- */

const PERSON_COLORS = ["#c4553a", "#2f78a8", "#6f9a2e", "#9a62b3"];
const SKIN = ["#a8703f", "#8a5530", "#b98250", "#7a4a2a"];
function personSVG(i, size = 40, muted = false){
  return `<svg class="person${muted ? " muted" : ""}" viewBox="0 0 40 52" width="${size}" height="${size * 1.3}" aria-hidden="true">
    <circle cx="20" cy="12" r="9" fill="${SKIN[i % 4]}"/>
    <path d="M11 9 Q20 0 29 9 L29 12 Q20 8 11 12Z" fill="#2a1d14"/>
    <path d="M8 50 L11 26 Q20 20 29 26 L32 50Z" fill="#f2ead8" stroke="#bfae8a" stroke-width="1.5"/>
    <rect x="10" y="33" width="20" height="5" rx="2" fill="${PERSON_COLORS[i % 4]}"/>
  </svg>`;
}

function personOnMap(i, x, y){
  return `<g transform="translate(${x - 14},${y - 18})" pointer-events="none">
    <circle cx="14" cy="18" r="19" fill="#fff" opacity=".85"/>
    <g transform="scale(.7)"><circle cx="20" cy="12" r="9" fill="${SKIN[i % 4]}"/>
    <path d="M11 9 Q20 0 29 9 L29 12 Q20 8 11 12Z" fill="#2a1d14"/>
    <path d="M8 50 L11 26 Q20 20 29 26 L32 50Z" fill="#f2ead8" stroke="#bfae8a" stroke-width="1.5"/>
    <rect x="10" y="33" width="20" height="5" rx="2" fill="${PERSON_COLORS[i % 4]}"/></g>
  </g>`;
}

const SACK = `<svg class="sack" viewBox="0 0 24 28" aria-hidden="true"><path d="M7 5 L17 5 L15 9 Q22 13 21 22 Q20 27 12 27 Q4 27 3 22 Q2 13 9 9Z" fill="#d9b26b" stroke="#8a6a2e" stroke-width="1.5"/><path d="M8 5 Q12 2 16 5" fill="none" stroke="#8a6a2e" stroke-width="1.5"/></svg>`;
const sacks = (n, cls = "") => `<span class="sacks ${cls}" aria-label="${n} Säcke">${n ? SACK.repeat(n) : "–"}</span>`;

const PATTERNS = `<defs>
  <pattern id="pWater" width="40" height="16" patternUnits="userSpaceOnUse"><rect width="40" height="16" fill="#3f8fc4"/><path d="M0 8 Q10 3 20 8 T40 8" fill="none" stroke="#8cc4e6" stroke-width="2"/></pattern>
  <pattern id="pMud" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#4e3a26"/><circle cx="4" cy="4" r="1.3" fill="#6b5034"/><circle cx="11" cy="10" r="1.1" fill="#3d2c1b"/></pattern>
  <pattern id="pDry" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#dcc08a"/><path d="M4 10 L14 14 L12 24 M14 14 L26 10 L32 18 M22 30 L30 26 L36 34" fill="none" stroke="#b89a62" stroke-width="1.4"/></pattern>
  <pattern id="pSand" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="#ead39c"/><circle cx="8" cy="9" r="1" fill="#d4b876"/><circle cx="22" cy="20" r="1" fill="#d4b876"/></pattern>
  <pattern id="pGrain4" width="12" height="14" patternUnits="userSpaceOnUse"><rect width="12" height="14" fill="#4e3a26"/><path d="M6 14 L6 1 M6 5 L2 2 M6 5 L10 2 M6 9 L2 6 M6 9 L10 6" stroke="#d6b23c" stroke-width="2"/></pattern>
  <pattern id="pGrain3" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#5a442c"/><path d="M8 16 L8 4 M8 7 L4 4 M8 7 L12 4" stroke="#cfae45" stroke-width="2"/></pattern>
  <pattern id="pGrain2" width="22" height="20" patternUnits="userSpaceOnUse"><rect width="22" height="20" fill="#cbb07a"/><path d="M11 20 L11 8 M11 11 L7 8 M11 11 L15 8" stroke="#a88e2e" stroke-width="2"/></pattern>
  <pattern id="pDead" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#d8bd86"/><path d="M6 18 L8 12 M14 19 L12 13" stroke="#8b7444" stroke-width="2"/></pattern>
  <pattern id="pRot" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#5d6a4c"/><path d="M5 17 Q8 12 11 17 M12 9 Q15 5 18 9" fill="none" stroke="#3b4430" stroke-width="2"/></pattern>
</defs>`;

/* Lage der Dinge auf der Karte (viewBox 800 × 600) */
const FIELD_BOX = {
  u1: [112, 18, 186, 170], u2: [112, 246, 186, 170],
  m1: [312, 18, 186, 170], m2: [312, 246, 186, 170],
  r1: [512, 18, 186, 170], r2: [512, 246, 186, 170]
};
const SPOT = { graben: [640, 217], schaduf: [405, 217] };

/* view: { mode: "achet" | "plan" | "grow", flood, dorf, assign, result } */
function mapSVG(v){
  const zones = floodedZones(v.flood);
  const deich = !!v.dorf.deich, kanal = !!v.dorf.kanal;
  const assigned = place => v.assign.indexOf(place);
  const grabenWorks = v.assign.includes("graben");
  const grabenWet = grabenWorks && (v.flood !== "niedrig" || kanal);
  const hofWet = v.flood === "hoch" && !deich;
  let s = `<svg class="map" viewBox="0 0 800 600" role="img" aria-label="Karte: Nil, Felder, Graben, Hof und Dorf">${PATTERNS}`;
  // Land und Wüste
  s += `<rect x="0" y="0" width="800" height="600" fill="url(#pSand)"/>`;
  s += `<rect x="102" y="0" width="604" height="430" fill="#cdb684"/>`;
  // Nil
  s += `<rect x="0" y="0" width="92" height="600" fill="url(#pWater)"/><text class="lbl river" x="46" y="300" transform="rotate(-90 46 300)">Nil</text>`;
  // Deich
  s += deich
    ? `<rect x="92" y="0" width="12" height="600" fill="#7b5a35"/><rect x="92" y="0" width="12" height="600" fill="none" stroke="#5a3f22" stroke-width="2"/>`
    : `<rect x="92" y="0" width="12" height="600" fill="#9c7a52"/><path d="M92 120 L104 135 M92 380 L104 400 M92 520 L104 505" stroke="#3f8fc4" stroke-width="5"/>`;
  // Graben bzw. Hauptkanal
  const grabenW = kanal ? 26 : 16;
  s += `<rect x="104" y="${217 - grabenW / 2}" width="600" height="${grabenW}" rx="4" fill="${grabenWet || (kanal && v.flood !== "gut") ? "#3f8fc4" : "#a88a5c"}" stroke="#6b5232" stroke-width="2" ${grabenWorks || kanal ? "" : 'stroke-dasharray="8 6"'}/>`;
  if (kanal) s += `<text class="lbl small" x="560" y="${206 - grabenW / 2}">Hauptkanal</text>`;
  // Felder
  for (const f of FIELDS){
    const [x, y, w, h] = FIELD_BOX[f.id];
    const water = baseWater(v.flood, f.zone, v.dorf);
    let fillId = "pDry";
    if (v.mode === "achet") fillId = zones.includes(f.zone) ? "pWater" : "pDry";
    else if (v.mode === "plan") fillId = water === "schlamm" ? "pMud" : water === "nass" ? "pWater" : "pDry";
    else if (v.mode === "grow"){
      const r = v.result.fields.find(x => x.id === f.id);
      if (!r.sown) fillId = water === "schlamm" ? "pMud" : water === "nass" ? "pWater" : "pDry";
      else fillId = r.reason === "nass" ? "pRot" : r.yield >= 4 ? "pGrain4" : r.yield === 3 ? "pGrain3" : r.yield > 0 ? "pGrain2" : "pDead";
    }
    const who = assigned(f.id);
    const tappable = v.mode === "plan";
    s += `<g class="field${tappable ? " tap" : ""}${who >= 0 ? " on" : ""}" ${tappable ? `data-act="place" data-place="${f.id}" role="button" tabindex="0" aria-label="${ZONES[f.zone]}${who >= 0 ? ", bestellt" : ""}"` : ""}>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="url(#${fillId})" stroke="${who >= 0 ? "#ffd34d" : "#6b5232"}" stroke-width="${who >= 0 ? 6 : 2}"/>`;
    if (v.mode === "grow"){
      const r = v.result.fields.find(x => x.id === f.id);
      if (r.sown) s += `<g pointer-events="none"><rect x="${x + w - 58}" y="${y + 8}" width="50" height="30" rx="15" fill="#fff" opacity=".92"/><text class="lbl yield" x="${x + w - 33}" y="${y + 29}">${r.yield}</text></g>`;
    }
    if (who >= 0) s += personOnMap(who, x + 40, y + h - 40);
    s += `</g>`;
  }
  // Arbeitsorte: Graben und Schaduf
  if (v.mode === "plan" || v.mode === "grow"){
    for (const place of ["graben", "schaduf"]){
      const [cx, cy] = SPOT[place];
      const who = assigned(place);
      const tappable = v.mode === "plan";
      s += `<g class="spot${tappable ? " tap" : ""}" ${tappable ? `data-act="place" data-place="${place}" role="button" tabindex="0" aria-label="${place === "graben" ? "Graben" : "Schaduf"}"` : ""}>
        <rect x="${cx - 62}" y="${cy - 22}" width="124" height="44" rx="22" fill="${who >= 0 ? "#ffd34d" : "#fffaf0"}" stroke="#6b5232" stroke-width="2"/>
        <text class="lbl spotlbl" x="${cx + (who >= 0 ? 14 : 0)}" y="${cy + 7}">${place === "graben" ? "Graben" : "Schaduf"}</text>
        ${who >= 0 ? personOnMap(who, cx - 38, cy) : ""}</g>`;
    }
  }
  // Hof und Dorf
  s += `<g class="hof"><rect x="112" y="450" width="250" height="130" rx="10" fill="${hofWet ? "url(#pWater)" : "#e2cb93"}" stroke="#6b5232" stroke-width="2"/>
    <path d="M140 540 L140 500 L200 500 L200 540Z M132 502 L170 478 L208 502Z" fill="#c9a26a" stroke="#6b5232" stroke-width="2"/>
    <ellipse cx="250" cy="530" rx="18" ry="22" fill="#b5713d" stroke="#6b3f1e" stroke-width="2"/><ellipse cx="290" cy="532" rx="16" ry="20" fill="#b5713d" stroke="#6b3f1e" stroke-width="2"/>
    <text class="lbl small" x="237" y="472">Hof und Vorrat</text></g>`;
  s += `<g class="dorf"><rect x="520" y="440" width="270" height="150" rx="10" fill="#efdcab" stroke="#6b5232" stroke-width="2"/>
    <path d="M540 560 L540 520 L590 520 L590 560Z M600 560 L600 530 L640 530 L640 560Z" fill="#d7b57a" stroke="#6b5232" stroke-width="2"/>
    <path d="M680 565 L680 505 Q715 480 750 505 L750 565Z" fill="#c99556" stroke="#6b5232" stroke-width="2"/>
    <text class="lbl small" x="655" y="462">Dorf und Dorfspeicher</text></g>`;
  s += `</svg>`;
  return s;
}

function seasonBar(active){
  const items = SEASONS.map(x => `<li class="${x.id === active ? "on" : ""}"><b>${esc(x.name)}</b><small>${esc(x.de)}</small></li>`).join("");
  return `<ol class="seasons" aria-label="Ägyptischer Kalender">${items}</ol>`;
}

function header(season){
  return `<header class="bar">
    <div class="bar-top"><span class="yr">${S.screen === "jahr" || S.screen === "dorf" ? `Jahr ${S.year}` : esc(GAME.title)}</span>
      <span class="spacer"></span>
      <button class="chip" data-act="begriffe">${esc(TEXT.begriffe)}</button>
      <button class="chip" data-act="pause">${esc(TEXT.pause)}</button></div>
    ${season ? seasonBar(season) : ""}
  </header>`;
}

function familyTray(){
  const free = S.assign.filter(a => a === null).length;
  const items = S.assign.map((a, i) => `<li class="${a ? "busy" : ""}">${personSVG(i, 34, !!a)}<span>${a ? esc(placeName(a)) : "frei"}</span></li>`).join("");
  return `<div class="tray"><p class="free">${esc(fill(TEXT.planFrei, { n: free }))}</p><ul class="family">${items}</ul></div>`;
}
const placeName = p => p === "graben" ? "Graben" : p === "schaduf" ? "Schaduf" : ZONES[zoneOf(p)];

/* ---------- Bildschirme ---------- */

function render(){
  ({ start, probe, jahr, dorf, bilanz, quelle, urteil, impuls }[S.screen] || start)();
}

function start(){
  $app.innerHTML = `<main class="wrap center start">
    <svg class="hero" viewBox="0 0 300 120" aria-hidden="true">
      <rect width="300" height="120" fill="#ead39c"/><rect x="0" y="0" width="300" height="34" fill="#3f8fc4"/>
      <path d="M0 18 Q25 10 50 18 T100 18 T150 18 T200 18 T250 18 T300 18" fill="none" stroke="#8cc4e6" stroke-width="3"/>
      <rect x="0" y="34" width="300" height="38" fill="#4e3a26"/>
      <path d="M20 72 L20 50 M40 72 L40 48 M60 72 L60 52 M80 72 L80 47 M100 72 L100 50 M120 72 L120 49 M140 72 L140 51" stroke="#d6b23c" stroke-width="4"/>
      <path d="M200 100 L245 60 L290 100Z" fill="#d7b57a" stroke="#8a6a2e" stroke-width="2"/>
    </svg>
    <h1 class="title">${esc(GAME.title)}</h1>
    <p class="sub">${esc(GAME.subtitle)}</p>
    <p class="leitfrage">${esc(GAME.leitfrage)}</p>
    ${GAME.intro.map(p => `<p class="lead">${esc(p)}</p>`).join("")}
    <div class="stack"><button class="btn" data-act="startGame">${esc(TEXT.start)}</button></div>
  </main>`;
}

/* Phase 1: Versuch mit zwei Feldern */
function probe(){
  const st = S.probe; // 0 trocken, 1 Flut, 2 Wasser gesunken (säen), 3 gewachsen
  const sown = id => S.probeSown.includes(id);
  const fA = st === 1 ? "pWater" : st === 2 ? "pMud" : st === 3 ? (sown("a") ? "pGrain4" : "pMud") : "pDry";
  const fB = st === 3 && sown("b") ? "pDead" : "pDry";
  const water = st === 1 ? 150 : 92;
  const tap = st === 2;
  const svg = `<svg class="map probe" viewBox="0 0 600 260" role="img" aria-label="Zwei Versuchsfelder am Nil">${PATTERNS}
    <rect width="600" height="260" fill="url(#pSand)"/>
    <rect x="0" y="0" width="${water}" height="260" fill="url(#pWater)"/>
    <text class="lbl river" x="46" y="130" transform="rotate(-90 46 130)">Nil</text>
    <g class="field${tap ? " tap" : ""}" ${tap ? 'data-act="probeSow" data-f="a" role="button" tabindex="0" aria-label="Feld am Fluss"' : ""}>
      <rect x="110" y="40" width="170" height="170" rx="10" fill="url(#${fA})" stroke="${sown("a") ? "#ffd34d" : "#6b5232"}" stroke-width="${sown("a") ? 6 : 2}"/>
      <text class="lbl small" x="195" y="235">am Fluss</text></g>
    <g class="field${tap ? " tap" : ""}" ${tap ? 'data-act="probeSow" data-f="b" role="button" tabindex="0" aria-label="Feld weit weg vom Fluss"' : ""}>
      <rect x="400" y="40" width="170" height="170" rx="10" fill="url(#${fB})" stroke="${sown("b") ? "#ffd34d" : "#6b5232"}" stroke-width="${sown("b") ? 6 : 2}"/>
      <text class="lbl small" x="485" y="235">weit weg</text></g>
  </svg>`;
  let action = "";
  if (st === 0) action = `<button class="btn" data-act="probeNext">Die Flut kommt</button>`;
  else if (st === 1) action = `<button class="btn" data-act="probeNext">${esc(TEXT.achetKnopf)}</button>`;
  else if (st === 2) action = `<p class="hint">${esc(TEXT.probeSaeen)}</p><button class="btn" data-act="probeNext" ${S.probeSown.length < 2 ? "disabled" : ""}>${esc(TEXT.probeWachsen)}</button>`;
  else action = `<div class="feedback"><p>${esc(TEXT.probeDeutung)}</p></div><button class="btn" data-act="toYear">Los geht's: Jahr 1</button>`;
  $app.innerHTML = `${header(st === 0 || st === 1 ? "achet" : "peret")}
    <main class="wrap"><h2>${esc(TEXT.probeTitel)}</h2><p>${esc(TEXT.probeText)}</p>${svg}<div class="actions">${action}</div></main>`;
}

/* Phase 2, 3, 5: ein Jahr */
function jahr(){
  const fl = flood();
  const d = dorfState();
  const season = { sirius: "achet", achet: "achet", plan: "peret", grow: "peret", harvest: "schemu" }[S.step];
  let body = "";
  if (S.step === "sirius"){
    body = `<div class="sky"><svg viewBox="0 0 600 220" role="img" aria-label="Sternenhimmel kurz vor Sonnenaufgang mit dem Sirius">
      <defs><linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1a3a"/><stop offset=".75" stop-color="#3b3f6e"/><stop offset="1" stop-color="#e9a25f"/></linearGradient></defs>
      <rect width="600" height="220" fill="url(#dawn)"/>
      <g fill="#fff" opacity=".7"><circle cx="60" cy="40" r="1.5"/><circle cx="140" cy="80" r="1.2"/><circle cx="260" cy="30" r="1.4"/><circle cx="420" cy="60" r="1.2"/><circle cx="520" cy="35" r="1.5"/><circle cx="330" cy="100" r="1"/></g>
      <g class="sirius"><circle cx="380" cy="140" r="7" fill="#fff"/><path d="M380 118 L380 162 M358 140 L402 140" stroke="#fff" stroke-width="2" opacity=".8"/></g>
      <text x="398" y="132" fill="#fff" font-size="18" font-weight="700">Sirius</text>
      <rect x="0" y="200" width="600" height="20" fill="#2a2030"/>
    </svg></div>
    <h2>${esc(TEXT.siriusTitel)}${S.year === 2 ? " – ein neues Jahr" : ""}</h2><p>${esc(TEXT.siriusText)}</p>
    <div class="actions"><button class="btn" data-act="step" data-to="achet">${esc(TEXT.siriusKnopf)}</button></div>`;
  } else if (S.step === "achet"){
    body = `<h2>${esc(FLOODS[fl].name[0].toUpperCase() + FLOODS[fl].name.slice(1))}</h2><p>${esc(FLOODS[fl].text)} ${esc(TEXT.achetText)}</p>
      ${mapSVG({ mode: "achet", flood: fl, dorf: d, assign: [] })}
      <div class="actions"><button class="btn" data-act="step" data-to="plan">${esc(TEXT.achetKnopf)}</button></div>`;
  } else if (S.step === "plan"){
    const lv = S.year === 2 ? `<div class="note">${esc(TEXT.landvermesser)}</div>` : "";
    body = `<h2>${esc(TEXT.planTitel)}</h2>${lv}<p>${esc(TEXT.planText)}</p>
      ${legend()}
      ${mapSVG({ mode: "plan", flood: fl, dorf: d, assign: S.assign })}
      ${familyTray()}
      <div class="actions"><button class="btn" data-act="sow" ${S.assign.every(a => !a) ? "disabled" : ""}>${esc(TEXT.planFertig)}</button></div>`;
  } else if (S.step === "grow"){
    const r = S.results[S.year];
    body = `<h2>${esc(TEXT.wachsenTitel)}</h2>
      ${mapSVG({ mode: "grow", flood: fl, dorf: d, assign: S.assign, result: r })}
      ${growFeedback(r)}
      <div class="actions"><button class="btn" data-act="step" data-to="harvest">${esc(TEXT.ernteKnopf)}</button></div>`;
  } else if (S.step === "harvest"){
    body = S.year === 1 ? harvest1() : harvest2();
  }
  $app.innerHTML = `${header(season)}<main class="wrap">${body}</main>`;
}

function legend(){
  return `<ul class="legend">
    <li><i style="background:#4e3a26"></i>Schlamm von der Flut</li>
    <li><i style="background:#dcc08a"></i>trocken</li>
    <li><i style="background:#3f8fc4"></i>unter Wasser</li></ul>`;
}

function growFeedback(r){
  const groups = [];
  for (const f of r.fields.filter(x => x.sown)){
    const g = groups.find(x => x.zone === f.zone && x.reason === f.reason);
    if (g) g.yields.push(f.yield); else groups.push({ zone: f.zone, reason: f.reason, yields: [f.yield] });
  }
  const lines = groups.map(g => {
    const label = ZONES[g.zone] + (g.yields.length > 1 ? ` (${g.yields.length}×)` : "");
    return `<li class="${g.yields[0] ? "good" : "bad"}"><b>${esc(label)}:</b> ${esc(REASONS[g.reason])} ${g.yields[0] ? g.yields.map(y => sacks(y)).join(" ") : ""}</li>`;
  }).join("");
  const notes = r.notes.map(n => `<li class="note-li">${esc(NOTES[n])}</li>`).join("");
  return `<div class="feedback"><ul class="reasons">${lines}${notes}</ul></div>`;
}

function harvest1(){
  const r = S.results[1];
  const sp = S.supply1;
  let html = `<h2>${esc(TEXT.ernteTitel)}</h2>
    <p class="big">${esc(fill(TEXT.ernteGesamt, { n: r.total }))}</p>${sacks(r.total, "row")}
    <p>${esc(fill(TEXT.ernteBedarf, { n: GAME.need }))}</p>`;
  if (sp.surplus === 0){
    html += `<div class="feedback warn"><p>${esc(fill(TEXT.knapp1, { n: sp.help }))}</p></div>
      <div class="actions"><button class="btn" data-act="toDorf">${esc(TEXT.weiter)}</button></div>`;
    return html;
  }
  const left = sp.surplus - S.dist.own - S.dist.village;
  html += `<p>${esc(fill(TEXT.verteilenText, { n: sp.surplus }))}</p>
    <div class="bins">
      <div class="bin"><h3>${esc(TEXT.vorratName)}</h3><small>${esc(TEXT.vorratInfo)}</small>${sacks(S.dist.own)}
        <button class="btn small" data-act="dist" data-to="own" ${left ? "" : "disabled"}>${esc(TEXT.inVorrat)}</button></div>
      <div class="bin"><h3>${esc(TEXT.dorfName)}</h3><small>${esc(TEXT.dorfInfo)}</small>${sacks(S.dist.village)}
        <button class="btn small" data-act="dist" data-to="village" ${left ? "" : "disabled"}>${esc(TEXT.inDorf)}</button></div>
    </div>
    <p class="center">Noch zu verteilen: ${sacks(left)}</p>
    <div class="actions"><button class="btn secondary small" data-act="undoDist" ${left === sp.surplus ? "disabled" : ""}>${esc(TEXT.zurueck)}</button>
    <button class="btn" data-act="toDorf" ${left ? "disabled" : ""}>${esc(TEXT.weiter)}</button></div>`;
  return html;
}

function harvest2(){
  const r = S.results[2];
  const sp = S.supply2;
  const lines = [];
  if (sp.lost) lines.push(fill(`${NOTES.hofNass} ({n} Säcke)`, { n: sp.lost }));
  if (sp.fromOwn) lines.push(fill("Aus dem eigenen Vorrat nehmt ihr {n} Säcke.", { n: sp.fromOwn }));
  if (sp.help) lines.push(fill("Der Dorfspeicher hilft mit {n} Säcken.", { n: sp.help }) + ` Er versorgt auch Weberin, Töpfer und Landvermesser – und andere Familien in Not.`);
  if (sp.hunger) lines.push(fill("Es fehlen trotzdem {n} Säcke.", { n: sp.hunger }) + ` Deine Familie muss hungern, bis wieder geerntet wird.`);
  else lines.push("Deine Familie wird satt. " + (sp.leftover ? TEXT.jahr2Rest : ""));
  return `<h2>${esc(TEXT.versorgungTitel)}</h2>
    <p class="big">${esc(fill(TEXT.ernteGesamt, { n: r.total }))}</p>${sacks(r.total, "row")}
    <p>${esc(fill(TEXT.ernteBedarf, { n: GAME.need }))}</p>
    <div class="feedback ${sp.hunger ? "warn" : ""}">${lines.map(l => `<p>${esc(l)}</p>`).join("")}</div>
    <div class="actions"><button class="btn" data-act="toBilanz">${esc(TEXT.weiter)}</button></div>`;
}

/* Phase 4 */
function dorf(){
  const berufe = DORF.berufe.map(b => `<li><b>${esc(b.name)}</b> ${esc(b.text)}</li>`).join("");
  if (S.dorfDone){
    const d = S.dorf;
    const res = [
      d.deich ? EVENTS.deich[1] : EVENTS.deichFehlt[1],
      d.kanal ? EVENTS.kanal[1] : EVENTS.kanalFehlt[1]
    ];
    if (d.extraGrain) res.push(fill(TEXT.hofErgebnis, { n: d.extraGrain }));
    $app.innerHTML = `${header("schemu")}<main class="wrap"><h2>${esc(TEXT.dorfTitel)}</h2>
      <div class="feedback">${res.map(t => `<p>${esc(t)}</p>`).join("")}</div>
      <div class="actions"><button class="btn" data-act="toYear2">Weiter zu Jahr 2</button></div></main>`;
    return;
  }
  const opts = Object.entries(DORF.aufgaben).map(([id, a]) => {
    const n = S.dorfChoices.filter(c => c === id).length;
    const who = S.dorfChoices.map((c, i) => (c === id ? personSVG(i, 30) : "")).join("");
    const full = n >= DORF_MAX[id] || S.dorfChoices.length >= GAME.dorfHelpers;
    return `<div class="task ${id === "hof" ? "own" : "common"}"><div><b>${esc(a.name)}</b><small class="wer">${esc(a.wer)}</small><p>${esc(a.text)}</p></div>
      <div class="who">${who}</div>
      <button class="btn small" data-act="dorfAdd" data-task="${id}" ${full ? "disabled" : ""}>Hierhin schicken</button></div>`;
  }).join("");
  $app.innerHTML = `${header("schemu")}<main class="wrap"><h2>${esc(TEXT.dorfTitel)}</h2>
    <div class="berufe"><p>${esc(TEXT.dorfBerufe)}</p><ul>${berufe}</ul></div>
    <p>${esc(TEXT.dorfText)}</p>
    <div class="tasks">${opts}</div>
    <div class="actions"><button class="btn secondary small" data-act="dorfReset" ${S.dorfChoices.length ? "" : "disabled"}>${esc(TEXT.zurueck)}</button>
      <button class="btn" data-act="dorfGo" ${S.dorfChoices.length < GAME.dorfHelpers ? "disabled" : ""}>${esc(TEXT.dorfFertig)}</button></div></main>`;
}

/* Phase 6 */
function bilanz(){
  const cols = Object.entries(TEXT.spalten).map(([area, name]) => {
    const cards = S.events.filter(e => EVENTS[e.key][0] === area).map(e => `<li>${esc(eventText(e))}</li>`).join("");
    return `<section class="col ${area}"><h3>${esc(name)}</h3><ul class="cards">${cards || "<li>–</li>"}</ul></section>`;
  }).join("");
  $app.innerHTML = `${header(null)}<main class="wrap"><h2>${esc(TEXT.bilanzTitel)}</h2><p>${esc(TEXT.bilanzText)}</p>
    <div class="cols">${cols}</div><p class="code">${esc(TEXT.code)} ${S.code}</p>
    <div class="actions"><button class="btn" data-act="go" data-to="quelle">${esc(TEXT.weiter)}</button></div></main>`;
}

/* Phase 7 */
function quelleBox(){
  const bl = QUELLE.bloecke.map(b => `<p>${esc(b.text)}</p>`).join(`<p class="cut">[…]</p>`);
  return `<figure class="source ${QUELLE.placeholder ? "placeholder" : ""}">
    ${QUELLE.placeholder ? `<p class="ph">Platzhalter – der Text der Quelle folgt.</p>` : ""}
    <figcaption><b>${esc(QUELLE.titel)}</b></figcaption>${bl}<p class="ref">${esc(QUELLE.angabe)}</p></figure>`;
}
function quelle(){
  const done = AUSSAGEN.every((_, i) => i in S.answers);
  const items = AUSSAGEN.map((a, i) => {
    const ans = S.answers[i];
    const fb = ans === undefined ? "" : `<p class="fb ${ans === a.imLied ? "ok" : "no"}">${esc(ans === a.imLied ? TEXT.richtig + " " + a.erklaerung : TEXT.nochmal + " " + a.tipp)}</p>`;
    return `<li><p class="st">${esc(a.text)}</p>
      <div class="yn"><button class="opt ${ans === true ? "sel" : ""}" data-act="answer" data-i="${i}" data-v="1">${esc(TEXT.ja)}</button>
      <button class="opt ${ans === false ? "sel" : ""}" data-act="answer" data-i="${i}" data-v="0">${esc(TEXT.nein)}</button></div>${fb}</li>`;
  }).join("");
  const allRight = done && AUSSAGEN.every((a, i) => S.answers[i] === a.imLied);
  const summary = allRight ? `<div class="summary">
      <section><h3>${esc(TEXT.drei.sagt)}</h3><ul>${AUSSAGEN.filter(a => a.imLied).map(a => `<li>${esc(a.text)}</li>`).join("")}</ul></section>
      <section><h3>${esc(TEXT.drei.spiel)}</h3><ul>${AUSSAGEN.filter(a => !a.imLied).map(a => `<li>${esc(a.text)}</li>`).join("")}</ul></section>
      <div class="feedback"><p>${esc(TEXT.quelleSchluss)}</p></div></div>
      <div class="actions"><button class="btn" data-act="go" data-to="urteil">${esc(TEXT.weiter)}</button></div>` : "";
  $app.innerHTML = `${header(null)}<main class="wrap"><h2>${esc(TEXT.quelleTitel)}</h2><p>${esc(TEXT.quelleText)}</p>
    ${quelleBox()}<h3>${esc(TEXT.frage)}</h3><ol class="statements">${items}</ol>${summary}</main>`;
}

/* Phase 8 */
function urteil(){
  const spiel = S.events.map(eventText);
  const allerdings = [...ALLERDINGS, ...S.events.filter(e => ["hunger", "trocken", "nass", "hofNass", "umsonst"].includes(e.key)).map(eventText)];
  const pickList = (key, list, title) => `<details class="pick" ${S.pick[key] === undefined ? "open" : ""}><summary><b>${esc(title)}</b>${S.pick[key] !== undefined ? `<span>${esc(list[S.pick[key]])}</span>` : ""}</summary>
    <div class="options">${list.map((t, i) => `<button class="opt ${S.pick[key] === i ? "sel" : ""}" data-act="pick" data-k="${key}" data-i="${i}">${esc(t)}</button>`).join("")}</div></details>`;
  const ready = ["spiel", "quelle", "allerdings"].every(k => S.pick[k] !== undefined);
  const hints = [null, spiel[S.pick.spiel], QUELLE_BELEGE[S.pick.quelle], allerdings[S.pick.allerdings]];
  const frame = TEXT.gelaender.map((line, i) => `<li><span>${esc(line)}</span>${hints[i] ? `<small>Stichpunkt: ${esc(hints[i])}</small>` : i === 0 ? "<small>deine eigene Begründung</small>" : ""}</li>`).join("");
  $app.innerHTML = `${header(null)}<main class="wrap"><h2>${esc(TEXT.urteilTitel)}</h2><p>${esc(TEXT.urteilText)}</p>
    ${pickList("spiel", spiel, TEXT.wahlSpiel)}${pickList("quelle", QUELLE_BELEGE, TEXT.wahlQuelle)}${pickList("allerdings", allerdings, TEXT.wahlAllerdings)}
    ${ready ? `<ol class="frame">${frame}</ol><div class="feedback"><p>${esc(TEXT.heft)}</p></div>
    <div class="actions"><button class="btn secondary" data-act="go" data-to="impuls">${esc(TEXT.impulsKnopf)}</button></div>` : ""}</main>`;
}

/* Phase 9 */
function impuls(){
  const items = IMPULSE.map(x => `<details class="impuls"><summary>${esc(x.frage)}</summary><p>${esc(x.hinweis)}</p></details>`).join("");
  $app.innerHTML = `${header(null)}<main class="wrap"><h2>${esc(TEXT.impulsTitel)}</h2><p>${esc(TEXT.impulsText)}</p>${items}
    <div class="actions"><button class="btn secondary" data-act="go" data-to="urteil">Zurück zum Urteil</button></div></main>`;
}

/* ---------- Ablauf ---------- */

function finishYear(){
  const fl = flood();
  const d = dorfState();
  const targets = S.assign.filter(Boolean);
  const r = evaluateYear({ flood: fl, targets, dorf: d });
  S.results[S.year] = r;
  const y = S.year;
  addEvent(y === 1 ? "flut1" : fl === "niedrig" ? "flut2niedrig" : "flut2hoch");
  for (const f of r.fields){
    if (!f.sown) continue;
    if (f.reason === "trocken") addEvent("trocken", { jahr: y });
    if (f.reason === "nass") addEvent("nass", { jahr: y });
    if (f.reason === "graben") addEvent("graben", { jahr: y });
    if (f.reason === "schaduf") addEvent("schaduf", { jahr: y });
    if (f.reason === "flut") addEvent("schlamm");
  }
  if (r.notes.some(n => ["grabenUmsonst", "schadufUmsonst", "grabenLeer"].includes(n))) addEvent("umsonst", { jahr: y });
  addEvent("ernte", { jahr: y, n: r.sownCount, s: r.total });
  if (y === 2){
    if (fl === "hoch" && d.deich) addEvent("deichHalf");
    if (fl === "niedrig" && r.fields.some(f => f.reason === "kanal")) addEvent("kanalHalf");
  }
  if (y === 1){
    S.supply1 = supplyYear1(r.total);
    S.village = DORF.nachbarnGeben - S.supply1.help;
    S.dist = { own: 0, village: 0 };
    addEvent(S.supply1.hunger ? "hunger" : "satt", { jahr: 1 });
    if (S.supply1.help) addEvent("geholfen", { n: S.supply1.help });
  } else {
    S.supply2 = supplyYear2({ harvest: r.total, own: S.own, village: S.village, hofNass: fl === "hoch" && !d.deich });
    const sp = S.supply2;
    if (sp.lost) addEvent("hofNass");
    if (sp.fromOwn) addEvent("vorratHalf");
    if (sp.help) addEvent("geholfen", { n: sp.help });
    addEvent(sp.hunger ? "hunger" : "satt", { jahr: 2 });
  }
}

const actions = {
  startGame(){ S = store.fresh(); S.code = newCode(1); S.screen = "probe"; save(); render(); },
  probeNext(){ S.probe = Math.min(3, S.probe + 1); save(); render(); },
  probeSow(el){ const f = el.dataset.f; if (!S.probeSown.includes(f)) S.probeSown.push(f); else S.probeSown = S.probeSown.filter(x => x !== f); save(); render(); },
  toYear(){ S.year = 1; S.step = "sirius"; go("jahr"); },
  step(el){
    S.step = el.dataset.to;
    if (S.step === "plan" && S.year === 2) addEvent("landvermesser");
    save(); render(); window.scrollTo(0, 0);
  },
  place(el){
    const p = el.dataset.place;
    const i = S.assign.indexOf(p);
    if (i >= 0) S.assign[i] = null;
    else { const free = S.assign.indexOf(null); if (free < 0) return; S.assign[free] = p; }
    save(); render();
  },
  sow(){
    const free = S.assign.filter(a => a === null).length;
    if (free && !document.querySelector(".sheet")){
      openSheet(`<h2>Noch ${free} frei</h2><p>${free === 1 ? "Ein Mitglied" : free + " Mitglieder"} deiner Familie ${free === 1 ? "hat" : "haben"} noch keine Arbeit. Trotzdem weiter?</p>
        <div class="btnrow"><button class="btn secondary" data-act="closeSheet">Zurück</button><button class="btn" data-act="sowNow">Weiter</button></div>`, false);
      return;
    }
    actions.sowNow();
  },
  sowNow(){ closeSheet(); finishYear(); S.step = "grow"; save(); render(); window.scrollTo(0, 0); },
  dist(el){ S.dist[el.dataset.to]++; save(); render(); },
  undoDist(){ if (S.dist.village) S.dist.village--; else if (S.dist.own) S.dist.own--; save(); render(); },
  toDorf(){
    S.own = S.dist.own; S.village += S.dist.village;
    if (S.dist.village) addEvent("speicher", { n: S.dist.village });
    addEvent("berufe");
    go("dorf");
  },
  dorfAdd(el){ if (S.dorfChoices.length < GAME.dorfHelpers) S.dorfChoices.push(el.dataset.task); save(); render(); },
  dorfReset(){ S.dorfChoices = []; save(); render(); },
  dorfGo(){
    S.dorf = dorfResult(S.dorfChoices);
    S.own += S.dorf.extraGrain;
    addEvent(S.dorf.deich ? "deich" : "deichFehlt");
    addEvent(S.dorf.kanal ? "kanal" : "kanalFehlt");
    if (S.dorf.extraGrain) addEvent("hof", { n: S.dorf.extraGrain });
    S.dorfDone = true; save(); render();
  },
  toYear2(){ S.year = 2; S.step = "sirius"; S.assign = Array(GAME.familySize).fill(null); go("jahr"); },
  toBilanz(){ go("bilanz"); },
  go(el){ go(el.dataset.to); },
  answer(el){ S.answers[el.dataset.i] = el.dataset.v === "1"; save(); render(); },
  pick(el){ S.pick[el.dataset.k] = Number(el.dataset.i); save(); render(); },
  begriffe(){
    openSheet(`<h2>${esc(TEXT.begriffe)}</h2><dl class="glossary">${BEGRIFFE.map(([b, e]) => `<dt>${esc(b)}</dt><dd>${esc(e)}</dd>`).join("")}</dl>`, false);
    document.querySelector(".panel").insertAdjacentHTML("beforeend", `<button class="btn secondary close" data-act="closeSheet">Schließen</button>`);
  },
  pause(){
    openSheet(`<h2>${esc(TEXT.pauseTitel)}</h2><p>${esc(TEXT.pauseText)}</p>
      <div class="btnrow"><button class="btn" data-act="closeSheet">${esc(TEXT.weiter)}</button></div>
      <p class="restart"><button class="linkbtn" data-act="restart">Spiel neu beginnen</button></p>`, false);
  },
  restart(){ closeSheet(); S = store.fresh(); save(); render(); },
  closeSheet(){ closeSheet(); }
};

document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.act];
  if (fn) fn(el);
});
document.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches?.('[role="button"][data-act]')){ e.preventDefault(); e.target.click(); }
});

render();
