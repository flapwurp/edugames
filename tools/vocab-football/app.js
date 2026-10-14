/* Vocab Football – Bildschirme, Spielfeld, Wischschuss, Klänge.
   Läuft auf dem Laptop an der digitalen Tafel (gespiegelt, Touch über USB). Spiellogik in match.js. */
import { LISTS, CONFIG } from "./content.js";
import * as M from "./match.js";
import { esc, openSheet, closeSheet, sheetOpen, toast } from "../../shared/ui.js";

const { PITCH } = M;
const app = document.getElementById("app");
const STORE = "vocab-football";
const TEAM_CLASS = ["red", "blue"];

/* ---------- Zustand ---------- */

let S = load() || {
  settings: { list: 0, pasteText: "", pasteFirst: CONFIG.firstColumn, direction: "en-de", keeper: "normal", teams: CONFIG.teams.slice(), sound: true },
  items: null,
  match: null,
};
let animating = false;

function load(){ try { return JSON.parse(sessionStorage.getItem(STORE)); } catch { return null; } }
function save(){ try { sessionStorage.setItem(STORE, JSON.stringify(S)); } catch { /* privater Modus: dann eben ohne Speichern */ } }

const keeperCfg = () => CONFIG.keeper[S.settings.keeper] || CONFIG.keeper.normal;
const teamName = i => S.settings.teams[i] || CONFIG.teams[i];

function readSelectedList(){
  const st = S.settings;
  if (st.list === "paste") return M.parseList(st.pasteText, st.pasteFirst);
  const L = LISTS[st.list] || LISTS[0];
  return M.parseList(L.words, L.first || CONFIG.firstColumn);
}

/* ---------- Klänge (selbst erzeugt, keine Dateien) ---------- */

let ac = null;
function audio(){
  if (!S.settings.sound) return null;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    return ac;
  } catch { return null; }
}
function tone(freq, dur, { type = "sine", vol = 0.2, to = null, delay = 0 } = {}){
  const a = audio(); if (!a) return;
  const t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
}
function noise(dur, { vol = 0.3, freq = 1000, q = 0.8, attack = 0.01, delay = 0 } = {}){
  const a = audio(); if (!a) return;
  const t = a.currentTime + delay, len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  src.buffer = buf; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(a.destination); src.start(t);
}
const SFX = {
  kick(){ tone(140, 0.18, { vol: 0.5, to: 50 }); noise(0.06, { vol: 0.25, freq: 2500 }); },
  whistle(){ for (const d of [0, 0.32]){ tone(2900, 0.24, { type: "triangle", vol: 0.12, delay: d }); tone(3150, 0.24, { type: "triangle", vol: 0.08, delay: d }); } },
  right(){ tone(660, 0.12, { vol: 0.15 }); tone(990, 0.22, { vol: 0.15, delay: 0.1 }); },
  wrong(){ tone(160, 0.28, { type: "square", vol: 0.06 }); },
  cheer(){ noise(2.2, { vol: 0.35, freq: 1400, q: 0.5, attack: 0.25 }); noise(1.8, { vol: 0.2, freq: 600, q: 0.6, attack: 0.3, delay: 0.1 }); tone(520, 0.5, { type: "sawtooth", vol: 0.03, to: 700, delay: 0.2 }); },
  ohh(){ noise(1.0, { vol: 0.25, freq: 500, q: 0.7, attack: 0.15 }); tone(300, 0.7, { type: "sawtooth", vol: 0.025, to: 180 }); },
  post(){ tone(1250, 0.6, { vol: 0.18 }); tone(1870, 0.45, { vol: 0.1 }); tone(140, 0.12, { vol: 0.3, to: 60 }); },
  save(){ tone(110, 0.15, { vol: 0.45, to: 50 }); noise(0.1, { vol: 0.3, freq: 900 }); },
};

/* ---------- Startbildschirm ---------- */

function renderSetup(){
  stopLoop();
  const st = S.settings;
  const { items, skipped } = readSelectedList();
  const opts = LISTS.map((L, i) => `<option value="${i}" ${st.list === i ? "selected" : ""}>${esc(L.name)}</option>`).join("")
    + `<option value="paste" ${st.list === "paste" ? "selected" : ""}>Paste a list …</option>`;
  const seg = (name, val, label) => `<button class="seg ${st[name] === val ? "on" : ""}" data-act="set" data-k="${name}" data-v="${val}">${label}</button>`;
  const status = items.length
    ? `<p class="ok">✓ ${items.length} words ready${skipped.length ? ` · <span class="warn">${skipped.length} line${skipped.length > 1 ? "s" : ""} not readable: ${esc(skipped.slice(0, 3).join(" | "))}${skipped.length > 3 ? " …" : ""}</span>` : ""}</p>`
    : `<p class="warn">No words yet. One word per line: <b>English ; German</b> or copied from a two-column table.</p>`;
  const canContinue = S.match && S.items;

  app.innerHTML = `
  <main class="setup">
    <header class="setup-head">
      <h1><span class="ball-icon" aria-hidden="true"></span>Vocab Football</h1>
      <p>Each team sends <b>1 shooter</b> and <b>2 passers</b> to the board. Only the shooter writes.</p>
    </header>
    <section class="panel-card">
      <h2>Word list</h2>
      <select id="listSel" aria-label="Word list">${opts}</select>
      ${st.list === "paste" ? `
        <textarea id="pasteBox" rows="7" placeholder="the cinema ; das Kino&#10;to borrow ; ausleihen&#10;… or paste two columns from Word / Excel">${esc(st.pasteText)}</textarea>
        <div class="segs small">${seg("pasteFirst", "en", "English first")}${seg("pasteFirst", "de", "German first")}</div>` : ""}
      <div id="listStatus">${status}</div>
    </section>
    <div class="row2">
      <section class="panel-card">
        <h2>Show the word in …</h2>
        <div class="segs">${seg("direction", "en-de", "English")}${seg("direction", "de-en", "German")}${seg("direction", "mixed", "Mixed")}</div>
      </section>
      <section class="panel-card">
        <h2>Goalkeeper</h2>
        <div class="segs">${seg("keeper", "easy", "Easy")}${seg("keeper", "normal", "Normal")}${seg("keeper", "hard", "Hard")}</div>
      </section>
    </div>
    <div class="row2">
      <section class="panel-card">
        <h2>Teams</h2>
        <div class="teams-in">
          <label class="red"><span>Left</span><input id="team0" maxlength="14" value="${esc(teamName(0))}"></label>
          <label class="blue"><span>Right</span><input id="team1" maxlength="14" value="${esc(teamName(1))}"></label>
        </div>
      </section>
      <section class="panel-card">
        <h2>Sound</h2>
        <div class="segs">${seg("sound", true, "On")}${seg("sound", false, "Off")}</div>
      </section>
    </div>
    <div class="start-row">
      ${canContinue ? `<button class="btn secondary big" data-act="continue">Continue match ${S.match.score[0]} : ${S.match.score[1]}</button>` : ""}
      <button class="btn big" data-act="start" ${items.length ? "" : "disabled"}>${canContinue ? "New match" : "Kick off!"}</button>
    </div>
    <details class="keys"><summary>Keyboard shortcuts for the teacher</summary>
      <p><kbd>←</kbd> left team correct · <kbd>→</kbd> right team correct · <kbd>↓</kbd> not yet · <kbd>S</kbd> skip ·
      <kbd>Enter</kbd> next word · <kbd>Z</kbd> undo · <kbd>F</kbd> full screen</p></details>
  </main>`;

  app.querySelector("#listSel").addEventListener("change", e => {
    st.list = e.target.value === "paste" ? "paste" : Number(e.target.value);
    save(); renderSetup();
  });
  const box = app.querySelector("#pasteBox");
  if (box) box.addEventListener("input", () => { st.pasteText = box.value; save(); updateListStatus(); });
  for (const i of [0, 1]) app.querySelector(`#team${i}`).addEventListener("input", e => { st.teams[i] = e.target.value.trim() || CONFIG.teams[i]; save(); });
}

function updateListStatus(){
  /* nur Statuszeile und Startknopf neu, damit das Textfeld den Fokus behält */
  const { items, skipped } = readSelectedList();
  const el = app.querySelector("#listStatus");
  el.innerHTML = items.length
    ? `<p class="ok">✓ ${items.length} words ready${skipped.length ? ` · <span class="warn">${skipped.length} line${skipped.length > 1 ? "s" : ""} not readable: ${esc(skipped.slice(0, 3).join(" | "))}${skipped.length > 3 ? " …" : ""}</span>` : ""}</p>`
    : `<p class="warn">No words yet. One word per line: <b>English ; German</b> or copied from a two-column table.</p>`;
  const start = app.querySelector('[data-act="start"]');
  if (start) start.disabled = !items.length;
}

function startMatch(){
  const { items } = readSelectedList();
  if (!items.length) return;
  S.items = items;
  S.match = M.newMatch(items, S.settings.direction);
  save();
  renderMatch();
  SFX.whistle();
}

/* ---------- Spielbildschirm ---------- */

function renderMatch(){
  app.innerHTML = `
  <main class="match">
    <header class="board">
      <div class="side red"><span class="tname">${esc(teamName(0))}</span><span class="score" id="sc0"></span></div>
      <div class="mid">
        <button class="icon" data-act="undo" id="undoBtn" title="Undo (Z)" aria-label="Undo">↶</button>
        <span class="vs">:</span>
        <button class="icon" data-act="menu" title="Menu" aria-label="Menu">☰</button>
      </div>
      <div class="side blue"><span class="score" id="sc1"></span><span class="tname">${esc(teamName(1))}</span></div>
    </header>
    <section class="card" id="card" aria-live="polite"></section>
    <section class="pitch-wrap">
      ${pitchSvg()}
      <div class="overlay" id="overlay"></div>
    </section>
    <footer class="controls" id="controls"></footer>
  </main>`;
  setupPitch();
  update();
  startLoop();
}

function update(){
  const m = S.match;
  app.querySelector("#sc0").textContent = m.score[0];
  app.querySelector("#sc1").textContent = m.score[1];
  app.querySelector("#undoBtn").disabled = !M.canUndo(m);
  renderCard();
  renderControls();
  renderOverlay();
  placeBall();
}

function renderCard(){
  const m = S.match, c = M.currentCard(m), el = app.querySelector("#card");
  const target = c.dir === "en-de" ? "German" : "English";
  let answer = `<div class="answer placeholder" aria-hidden="true">&nbsp;</div>`;   // hält die Höhe, damit das Feld nicht springt
  if (m.phase !== "question"){
    if (m.outcome === "skip") answer = `<div class="answer skip">${esc(c.answer)}</div>`;
    else answer = `<div class="answer ${TEAM_CLASS[m.team]}">✓ ${esc(c.answer)}</div>`;
  }
  el.className = "card" + (m.phase === "question" ? "" : " solved");
  el.innerHTML = `<div class="label">Write it in <b>${target}</b></div><div class="prompt" lang="${c.dir === "en-de" ? "en" : "de"}">${esc(c.prompt)}</div>${answer}`;
  fitText(el.querySelector(".prompt"));
}

/* Lange Wörter/Phrasen verkleinern, damit sie in eine Zeile passen */
function fitText(el){
  el.style.fontSize = "";
  const max = el.parentElement.clientWidth * 0.94;
  let size = parseFloat(getComputedStyle(el).fontSize);
  while (el.scrollWidth > max && size > 24){ size -= 4; el.style.fontSize = size + "px"; }
}

function renderControls(){
  const m = S.match, el = app.querySelector("#controls");
  if (m.phase === "question"){
    el.innerHTML = `
      <button class="btn team red" data-act="correct" data-team="0">✓ ${esc(teamName(0))}</button>
      <div class="midbtns">
        <button class="btn secondary" data-act="wrong">✗ Not yet</button>
        <button class="btn secondary" data-act="skip">Skip</button>
      </div>
      <button class="btn team blue" data-act="correct" data-team="1">✓ ${esc(teamName(1))}</button>`;
  } else if (m.phase === "kick" || m.phase === "shot"){
    const verb = m.phase === "shot"
      ? `<b>${esc(teamName(m.team))}</b>, shoot! Swipe the ball towards the goal.`
      : `<b>${esc(teamName(m.team))}</b>, swipe the ball to pass!`;
    el.innerHTML = `<p class="hint ${TEAM_CLASS[m.team]}">${verb}</p>`;
  } else {
    el.innerHTML = `<button class="btn big next" data-act="next">Next word ▸</button>`;
  }
}

function renderOverlay(){
  const m = S.match, el = app.querySelector("#overlay");
  if (m.phase !== "result"){ el.innerHTML = ""; el.className = "overlay"; return; }
  const msgs = {
    goal: [`GOAL!`, `${esc(teamName(m.team))} scores!`],
    saved: [`Saved!`, `The ball stays in front of the goal.`],
    post: [`Off the post!`, `The ball stays in front of the goal.`],
    wide: [`Wide!`, `The ball stays in front of the goal.`],
  };
  const big = msgs[m.outcome];
  el.className = "overlay show" + (m.outcome === "goal" ? " goal " + TEAM_CLASS[m.team] : "");
  el.innerHTML = `
    ${big ? `<div class="result"><div class="big">${big[0]}</div><div class="sub">${big[1]}</div></div>` : ""}
    <div class="switch">
      <div class="sw-title">⇄ Switch!</div>
      <ol><li><b>Shooter</b> → back to your team</li><li><b>Passer</b> → you are the new shooter</li><li><b>New passer</b> → come to the board</li></ol>
    </div>`;
}

/* ---------- Spielfeld (SVG) ---------- */

const NS = "http://www.w3.org/2000/svg";
function pitchSvg(){
  const { w, h, cy, lineL, lineR, goalHalf } = PITCH;
  const top = 40, bot = h - 40, boxW = 150, boxH = 165, smallW = 55, smallH = 82;
  let stripes = "";
  for (let i = 0; i < 12; i++) stripes += `<rect x="${i * (w / 12)}" y="0" width="${w / 12}" height="${h}" fill="${i % 2 ? "var(--grass2)" : "var(--grass1)"}"/>`;
  const net = side => {
    const x0 = side < 0 ? lineL - 38 : lineR, x1 = x0 + 38;
    let n = `<rect x="${x0}" y="${cy - goalHalf}" width="38" height="${goalHalf * 2}" class="goalbg"/>`;
    for (let x = x0 + 6; x < x1; x += 7) n += `<line x1="${x}" y1="${cy - goalHalf}" x2="${x}" y2="${cy + goalHalf}" class="net"/>`;
    for (let y = cy - goalHalf + 7; y < cy + goalHalf; y += 7) n += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" class="net"/>`;
    const px = side < 0 ? lineL : lineR;
    n += `<path d="M${px} ${cy - goalHalf} H${side < 0 ? x0 : x1} V${cy + goalHalf} H${px}" class="frame back"/>`;
    n += `<line x1="${px}" y1="${cy - goalHalf}" x2="${px}" y2="${cy + goalHalf}" class="frame"/>`;
    n += `<circle cx="${px}" cy="${cy - goalHalf}" r="5" class="post"/><circle cx="${px}" cy="${cy + goalHalf}" r="5" class="post"/>`;
    return `<g class="goal" id="net${side < 0 ? "L" : "R"}">${n}</g>`;
  };
  const marks = [-2, -1, 0, 1, 2].map(p => `<circle cx="${M.ballX(p)}" cy="${cy}" r="4" class="mark"/>`).join("");
  const keeper = side => `<g class="keeper ${side < 0 ? "red" : "blue"}" id="keeper${side < 0 ? "L" : "R"}"><rect class="kbody" rx="9"/><circle class="kglove" r="8"/><circle class="kglove" r="8"/></g>`;
  return `
  <svg id="pitch" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Football pitch">
    <g class="grass">${stripes}</g>
    <g class="lines">
      <rect x="${lineL}" y="${top}" width="${lineR - lineL}" height="${bot - top}"/>
      <line x1="${w / 2}" y1="${top}" x2="${w / 2}" y2="${bot}"/>
      <circle cx="${w / 2}" cy="${cy}" r="70"/>
      <rect x="${lineL}" y="${cy - boxH}" width="${boxW}" height="${boxH * 2}"/>
      <rect x="${lineR - boxW}" y="${cy - boxH}" width="${boxW}" height="${boxH * 2}"/>
      <rect x="${lineL}" y="${cy - smallH}" width="${smallW}" height="${smallH * 2}"/>
      <rect x="${lineR - smallW}" y="${cy - smallH}" width="${smallW}" height="${smallH * 2}"/>
      <path d="M${lineL + boxW} ${cy - 55} A 70 70 0 0 1 ${lineL + boxW} ${cy + 55}"/>
      <path d="M${lineR - boxW} ${cy - 55} A 70 70 0 0 0 ${lineR - boxW} ${cy + 55}"/>
    </g>
    ${marks}
    ${net(-1)}${net(1)}
    ${keeper(-1)}${keeper(1)}
    <g id="aim" class="aim"><line id="aimLine"/><circle id="aimHead" r="7"/></g>
    <g id="kicker" class="kicker"><circle r="22"/></g>
    <g id="ballG">
      <circle class="ring" r="${PITCH.ballR * 2.1}"/>
      <ellipse class="shadow" cx="4" cy="${PITCH.ballR - 3}" rx="${PITCH.ballR}" ry="6"/>
      <g id="ballSpin"><g transform="scale(${(PITCH.ballR / 13).toFixed(3)})">
        <circle class="ball" r="13"/>
        <path class="patch" d="M0 -5 L4.8 -1.5 L3 4 L-3 4 L-4.8 -1.5Z"/>
        <path class="seam" d="M0 -5 L0 -13 M4.8 -1.5 L12 -4 M3 4 L7 10 M-3 4 L-7 10 M-4.8 -1.5 L-12 -4"/>
      </g></g>
    </g>
  </svg>`;
}

let svg, ballG, ballSpin, kickerG, aimG, aimLine, aimHead, keepers;
const ball = { x: PITCH.w / 2, y: PITCH.cy, rot: 0 };
let tween = null;           // laufende Ballbewegung
let holdBall = false, pendingReturn = null;   // Ball nach einem Schuss kurz liegen lassen
let keeperShot = null;      // { side, y0, d, t0 } während eines Schusses
const clock = () => performance.now() / 1000;

function setupPitch(){
  svg = app.querySelector("#pitch");
  ballG = svg.querySelector("#ballG"); ballSpin = svg.querySelector("#ballSpin");
  kickerG = svg.querySelector("#kicker"); aimG = svg.querySelector("#aim");
  aimLine = svg.querySelector("#aimLine"); aimHead = svg.querySelector("#aimHead");
  keepers = { L: svg.querySelector("#keeperL"), R: svg.querySelector("#keeperR") };
  const k = keeperCfg(), half = M.keeperHalf(k);
  for (const side of ["L", "R"]){
    const g = keepers[side], body = g.querySelector(".kbody");
    body.setAttribute("width", 22); body.setAttribute("height", half * 2);
    body.setAttribute("x", -11); body.setAttribute("y", -half);
    const gl = g.querySelectorAll(".kglove");
    gl[0].setAttribute("cy", -half); gl[1].setAttribute("cy", half);
  }
  const m = S.match;
  ball.x = M.ballX(m.pos); ball.y = M.ballYpx(m.ballY);
  svg.addEventListener("pointerdown", onDown);
  svg.addEventListener("pointermove", onMove);
  svg.addEventListener("pointerup", onUp);
  svg.addEventListener("pointercancel", () => { drag = null; aimG.style.display = "none"; });
}

function placeBall(){
  if (tween || holdBall) return;
  const m = S.match;
  if (!animating){ ball.x = M.ballX(m.pos); ball.y = M.ballYpx(m.ballY); }
  drawBall();
  const active = (m.phase === "kick" || m.phase === "shot") && !animating;
  ballG.classList.toggle("active", active);
  ballG.classList.toggle(TEAM_CLASS[0], active && m.team === 0);
  ballG.classList.toggle(TEAM_CLASS[1], active && m.team === 1);
  if (active){
    const dir = M.attackDir(m.team);
    kickerG.style.display = "";
    kickerG.setAttribute("class", "kicker " + TEAM_CLASS[m.team]);
    kickerG.setAttribute("transform", `translate(${ball.x - dir * 46} ${ball.y + 8})`);
  } else kickerG.style.display = "none";
}
function drawBall(){
  ballG.setAttribute("transform", `translate(${ball.x.toFixed(1)} ${ball.y.toFixed(1)})`);
  ballSpin.setAttribute("transform", `rotate(${ball.rot.toFixed(0)})`);
}

/* Animationsschleife: Torhüter pendeln, Ball bewegt sich */
let raf = 0;
function startLoop(){ stopLoop(); raf = requestAnimationFrame(frame); }
function stopLoop(){ cancelAnimationFrame(raf); raf = 0; }
function frame(){
  const t = clock(), k = keeperCfg();
  for (const side of ["L", "R"]){
    let y = M.keeperY(t, k);
    if (keeperShot && keeperShot.side === side){
      const ks = keeperShot, tau = t - ks.t0;
      y = ks.y0 + Math.sign(ks.d) * Math.min(Math.abs(ks.d), k.dive * Math.max(0, tau - k.react));
    }
    const x = side === "L" ? PITCH.lineL + 14 : PITCH.lineR - 14;
    keepers[side].setAttribute("transform", `translate(${x} ${y.toFixed(1)})`);
  }
  if (tween){
    const p = Math.min(1, (t - tween.t0) / tween.dur), e = tween.ease(p);
    ball.x = tween.x0 + (tween.x1 - tween.x0) * e;
    ball.y = tween.y0 + (tween.y1 - tween.y0) * e + (tween.curve || 0) * Math.sin(Math.PI * e);
    ball.rot += tween.spin;
    drawBall();
    if (p >= 1){ const done = tween.done; tween = null; done && done(); }
  }
  raf = requestAnimationFrame(frame);
}
const easeOut = p => 1 - Math.pow(1 - p, 3);
const linear = p => p;
function moveBall(x1, y1, dur, { ease = easeOut, curve = 0, spin = 12 } = {}){
  return new Promise(res => { tween = { x0: ball.x, y0: ball.y, x1, y1, dur, ease, curve, spin, t0: clock(), done: res }; });
}
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Wischen ---------- */

let drag = null;
function toSvg(e){
  const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform(svg.getScreenCTM().inverse());
}
function onDown(e){
  const m = S.match;
  if (animating || !(m.phase === "kick" || m.phase === "shot") || sheetOpen()) return;
  svg.setPointerCapture(e.pointerId);
  const p = toSvg(e);
  drag = { start: p, last: p, samples: [{ x: e.clientX, y: e.clientY, t: performance.now() }] };
}
function onMove(e){
  if (!drag) return;
  const p = toSvg(e); drag.last = p;
  drag.samples.push({ x: e.clientX, y: e.clientY, t: performance.now() });
  if (drag.samples.length > 12) drag.samples.shift();
  const vx = p.x - drag.start.x, vy = p.y - drag.start.y, len = Math.hypot(vx, vy);
  if (len < 8){ aimG.style.display = "none"; return; }
  /* kurzer Richtungspfeil am Ball – zeigt die Richtung, aber nicht die genaue Flugbahn */
  const L = Math.min(len, 70), ux = vx / len, uy = vy / len;
  const x0 = ball.x + ux * 20, y0 = ball.y + uy * 20, x1 = ball.x + ux * (20 + L), y1 = ball.y + uy * (20 + L);
  aimLine.setAttribute("x1", x0); aimLine.setAttribute("y1", y0); aimLine.setAttribute("x2", x1); aimLine.setAttribute("y2", y1);
  aimHead.setAttribute("cx", x1); aimHead.setAttribute("cy", y1);
  aimG.setAttribute("class", "aim " + TEAM_CLASS[S.match.team]);
  aimG.style.display = "";
}
function onUp(e){
  if (!drag) return;
  const d = drag; drag = null; aimG.style.display = "none";
  const end = toSvg(e);
  const vec = { x: end.x - d.start.x, y: end.y - d.start.y };
  if (Math.hypot(vec.x, vec.y) < 25){ toast("Swipe a bit further!", "", 1400); return; }
  /* Geschwindigkeit der letzten ~120 ms in Bildschirm-Pixeln pro ms */
  const now = performance.now(), recent = d.samples.filter(s => now - s.t < 140);
  const s0 = recent[0] || d.samples[0];
  const speed = Math.hypot(e.clientX - s0.x, e.clientY - s0.y) / Math.max(16, now - s0.t);
  if (S.match.phase === "kick") doPass(vec, speed); else doShot(vec, speed);
}

async function doPass(vec, speed){
  const m = S.match, len = Math.hypot(vec.x, vec.y);
  const lateral = vec.y / len;
  const next = M.kick(m, lateral);
  animating = true; update();
  SFX.kick();
  const x1 = M.ballX(next.pos), y1 = M.ballYpx(next.ballY);
  const dur = Math.max(0.45, Math.min(0.9, 0.9 - speed * 0.15));
  await moveBall(x1, y1, dur, { curve: (Math.random() - 0.5) * 30, spin: 14 * M.attackDir(m.team) });
  S.match = next; animating = false; save(); update();
}

async function doShot(vec, speed){
  const m = S.match, k = keeperCfg(), dir = M.attackDir(m.team), attackRight = dir > 0;
  const tShot = clock(), flight = M.flightTime(speed);
  const r = M.resolveShot({ x: ball.x, y: ball.y }, vec, attackRight, tShot, flight, k);
  if (r.outcome === "wrongway"){ toast("Swipe towards the goal!", "", 1600); return; }
  animating = true; update();
  SFX.kick();
  const side = attackRight ? "R" : "L", lineX = attackRight ? PITCH.lineR : PITCH.lineL;
  const y0 = M.keeperY(tShot, k);
  keeperShot = { side, y0, d: r.yAtLine - y0, t0: tShot };
  await moveBall(lineX - dir * 4, r.yAtLine, flight, { ease: linear, spin: 25 * dir });
  if (r.outcome === "goal"){
    svg.querySelector(attackRight ? "#netR" : "#netL").classList.add("ripple");
    SFX.cheer();
    await moveBall(lineX + dir * 26, r.yAtLine + (r.yAtLine - ball.y) * 0.2, 0.25, { spin: 8 * dir });
  } else if (r.outcome === "saved"){
    SFX.save(); SFX.ohh();
    await moveBall(lineX - dir * 110, r.yAtLine + (r.yAtLine > PITCH.cy ? 60 : -60), 0.55, { spin: -10 * dir });
  } else if (r.outcome === "post"){
    SFX.post(); SFX.ohh();
    await moveBall(lineX - dir * 70, r.yAtLine + (r.yAtLine > PITCH.cy ? 90 : -90), 0.5, { spin: -14 * dir });
  } else {
    SFX.ohh();
    await moveBall(lineX + dir * 50, r.yAtLine + (r.yAtLine > PITCH.cy ? 40 : -40), 0.35, { ease: linear, spin: 20 * dir });
  }
  keeperShot = null;
  S.match = M.shot(m, r.outcome);
  save();
  holdBall = true;          // Ball bleibt kurz im Netz bzw. dort, wo er gelandet ist
  animating = false;
  update();
  pendingReturn = setTimeout(() => returnBall(true), r.outcome === "goal" ? 1700 : 1000);
}

/* Ball nach dem Schuss zurück an seinen Platz (nach einem Tor: Anstoß in der Mitte).
   animate = false: sofort, z. B. wenn die Lehrkraft schon auf „Next word“ tippt. */
function returnBall(animate){
  clearTimeout(pendingReturn); pendingReturn = null;
  if (!holdBall || !svg) return;
  holdBall = false;
  svg.querySelector("#netR").classList.remove("ripple"); svg.querySelector("#netL").classList.remove("ripple");
  const tx = M.ballX(S.match.pos), ty = M.ballYpx(S.match.ballY);
  if (animate && Math.hypot(ball.x - tx, ball.y - ty) > 1){
    const kickoff = S.match.pos === 0 && S.match.outcome === "goal";
    moveBall(tx, ty, 0.6, { spin: 6 }).then(() => { placeBall(); if (kickoff) SFX.whistle(); });
  } else { tween = null; placeBall(); }
}

/* ---------- Aktionen ---------- */

function dispatch(fn){
  if (animating || tween) return;
  if (holdBall) returnBall(false);
  const before = S.match;
  S.match = fn(S.match);
  if (S.match === before) return;
  save(); update();
}

const actions = {
  start: startMatch,
  continue(){ renderMatch(); },
  set(el){
    const k = el.dataset.k; let v = el.dataset.v;
    if (v === "true" || v === "false") v = v === "true";
    S.settings[k] = v; save();
    renderSetup();
  },
  correct(el){
    const team = Number(el.dataset.team);
    if (S.match.phase !== "question") return;
    SFX.right();
    dispatch(m => M.correct(m, team));
  },
  wrong(){
    if (S.match.phase !== "question") return;
    SFX.wrong();
    const card = app.querySelector("#card");
    card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
    toast("Not yet – keep writing!", "", 1400);
  },
  skip(){ dispatch(M.skip); },
  next(){ dispatch(m => M.nextWord(m, S.items)); },
  undo(){ dispatch(M.undo); },
  menu(){
    openSheet(`<h2>Menu</h2>
      <div class="menu-btns">
        <button class="btn secondary" data-act="fullscreen">Full screen</button>
        <button class="btn secondary" data-act="toggleSound">Sound: ${S.settings.sound ? "on" : "off"}</button>
        <button class="btn secondary" data-act="toSetup">Settings / word list</button>
        <button class="btn" data-act="restart">New match (0 : 0)</button>
      </div>`);
  },
  closeSheet,
  fullscreen(){ closeSheet(); toggleFullscreen(); },
  toggleSound(){ S.settings.sound = !S.settings.sound; save(); actions.menu(); },
  toSetup(){ closeSheet(); returnBall(false); renderSetup(); },
  restart(){ closeSheet(); returnBall(false); tween = null; S.match = M.newMatch(S.items, S.settings.direction); save(); renderMatch(); SFX.whistle(); },
};

function toggleFullscreen(){
  try {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  } catch { /* nicht unterstützt */ }
}

document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.act];
  if (fn){ e.preventDefault(); fn(el); }
});

document.addEventListener("keydown", e => {
  if (e.target.closest("input, textarea, select")) return;
  if (e.key === "f" || e.key === "F"){ toggleFullscreen(); return; }
  if (!S.match || !app.querySelector(".match")) return;
  if (sheetOpen()){ if (e.key === "Escape") closeSheet(); return; }
  const m = S.match;
  if (e.key === "ArrowLeft" && m.phase === "question") actions.correct({ dataset: { team: 0 } });
  else if (e.key === "ArrowRight" && m.phase === "question") actions.correct({ dataset: { team: 1 } });
  else if (e.key === "ArrowDown") actions.wrong();
  else if (e.key === "s" || e.key === "S") actions.skip();
  else if ((e.key === "Enter" || e.key === " ") && m.phase === "result") actions.next();
  else if (e.key === "z" || e.key === "Z" || e.key === "Backspace") actions.undo();
  else return;
  e.preventDefault();
});

window.addEventListener("resize", () => { const p = app.querySelector(".prompt"); if (p) fitText(p); });

/* ---------- Start ---------- */
renderSetup();
