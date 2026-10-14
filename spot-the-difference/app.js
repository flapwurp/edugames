/* Spot the Difference – screens and controls */
import { CONFIG, COLOURS } from "./content.js";
import { makeRound, pictureFor, hitTest, sentence, SCENES, sceneFor } from "./spot.js";
import { levelOf, validCode, newCode, createStore } from "../shared/session.js";
import { esc, clockText, keyStrip, openSheet, closeSheet, sheetOpen, confirmQuit, toast, clearToast } from "../shared/ui.js";

const $app = document.getElementById("app");
const LEVEL_COUNT = Object.keys(CONFIG.levels).length;
const store = createStore("spotdiff-v1", () => ({ screen: "home", code: null, player: null, round: 1, results: [], last: null }));
const SVGNS = "http://www.w3.org/2000/svg";

let S = store.load() || store.fresh();
if (S.screen === "play") S.screen = "intro";
let R = null;  // the running round

const level = () => CONFIG.levels[levelOf(S.code)];
const save = () => store.save(S);
const words = round => SCENES[sceneFor(round)].words;
const art = round => SCENES[sceneFor(round)].art;

function go(screen){ clearToast(); S.screen = screen; save(); render(); window.scrollTo(0, 0); }

function bar(extra = ""){
  if (!S.code) return "";
  return `<header class="bar">
    <div class="meta"><span>Game <strong>${S.code}</strong></span><span>Player ${S.player}</span><span>${esc(level().name)}</span></div>
    <div class="spacer"></div>${extra}
    <button data-act="howto">How to play</button>
    <button data-act="quit">Leave game</button>
  </header>`;
}

function render(){
  stopTimer();
  const fn = { home, newgame, code: codeScreen, join, intro, play, result, final }[S.screen] || home;
  fn();
}

/* A picture as SVG; marks = [{ box, n, kind }] drawn on top */
function pictureSVG(round, picture, marks = [], id = ""){
  const a = art(round);
  const m = marks.map(({ box: b, n, kind }) => {
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2, rx = b.w / 2 - 6, ry = b.h / 2 - 6;
    const badge = n ? `<circle cx="${b.x + 20}" cy="${b.y + 20}" r="22" class="badge ${kind}"/><text x="${b.x + 20}" y="${b.y + 29}" class="badgetext">${n}</text>` : "";
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="mark ${kind}"/>${badge}`;
  }).join("");
  return `<svg ${id ? `id="${id}"` : ""} class="pic" viewBox="0 0 ${a.VIEW.w} ${a.VIEW.h}" xmlns="${SVGNS}" role="img" aria-label="Your picture">
    ${a.drawPicture(picture)}<g${id ? ` id="${id}-marks"` : ""}>${m}</g></svg>`;
}

/* --- Home --- */
function home(){
  const demo = makeRound(1004, 1);
  const crop = p => pictureSVG(1, p).replace(/viewBox="[^"]*"/, 'viewBox="380 360 640 420"');
  $app.innerHTML = `<main class="wrap center">
    <div class="hero"><div class="mini">${crop(demo.a)}</div><div class="mini">${crop(demo.b)}</div></div>
    <h1 class="title">Spot the Difference</h1>
    <p class="lead">Your pictures are almost the same. Talk to your partner and find the differences together. Speak English only!</p>
    <div class="stack">
      <button class="btn" data-act="new">Start a new game</button>
      <button class="btn secondary" data-act="join">Join a game</button>
      <button class="linkbtn" data-act="howto">How to play</button>
    </div>
  </main>`;
}

/* --- New game: choose level --- */
function newgame(){
  const items = Object.entries(CONFIG.levels).map(([n, L]) =>
    `<button class="level" data-act="level" data-level="${n}"><span class="num">${n}</span><span><b>${esc(L.name)}</b><small>${esc(L.info)}</small></span></button>`).join("");
  $app.innerHTML = `<main class="wrap center">
    <h1 class="roundno">Choose a level</h1>
    <div class="levels">${items}</div>
    <div class="stack"><button class="linkbtn" data-act="home">Back</button></div>
  </main>`;
}

/* --- Show code (Player 1) --- */
function codeScreen(){
  $app.innerHTML = `<main class="wrap center">
    <p class="lead">Your game code</p>
    <div class="code">${S.code}</div>
    <p class="lead">Tell your partner this code. They tap <b>Join a game</b> and type it in.<br>You are <b>Player 1</b>.</p>
    <div class="stack"><button class="btn" data-act="toIntro">We're ready</button>
    <button class="linkbtn" data-act="home">Back</button></div>
  </main>`;
}

/* --- Join (Player 2) --- */
function join(){
  $app.innerHTML = `<main class="wrap center">
    <h1 class="roundno">Join a game</h1>
    <p class="lead">Type in the code from your partner's screen.</p>
    <div style="margin-top:20px"><input id="codein" class="codeinput" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" aria-label="Game code"></div>
    <p class="error" id="err"></p>
    <div class="stack"><button class="btn" data-act="doJoin">Join game</button>
    <button class="linkbtn" data-act="home">Back</button></div>
  </main>`;
  const inp = document.getElementById("codein");
  inp.focus();
  inp.addEventListener("keydown", e => { if (e.key === "Enter") doJoin(); });
}
function doJoin(){
  const raw = document.getElementById("codein").value.trim();
  const code = /^\d{4}$/.test(raw) ? parseInt(raw, 10) : NaN;
  if (!validCode(code, LEVEL_COUNT)){
    document.getElementById("err").textContent = `Check the code: it has 4 numbers and starts with ${Object.keys(CONFIG.levels).join(", ").replace(/, (\d)$/, " or $1")}.`;
    return;
  }
  S = { ...store.fresh(), code, player: 2 };
  go("intro");
}

/* --- Round intro --- */
function intro(){
  const L = level();
  $app.innerHTML = bar() + `<main class="wrap center">
    <p class="roundno">Round ${S.round} of ${CONFIG.roundsPerGame}</p>
    <p class="scenename">${esc(words(S.round).title)}</p>
    <div class="rolecard">
      <p>You and your partner see <b>almost the same picture</b>. There are <b>${L.differences} differences</b>.</p>
      <p>Describe your picture and ask questions. When you find a difference, <b>both of you tap it</b>.</p>
      <p>A tap where there is no difference costs <b>${CONFIG.wrongTapSeconds} seconds</b>. So talk first, then tap!</p>
      <p>You have <b>${clockText(L.seconds)}</b> minutes. Don't show your screen!</p>
    </div>
    <div class="stack"><button class="btn" data-act="start">Start round</button>
    <p class="tip" style="margin:0">Start at the same time as your partner.</p></div>
  </main>`;
}

/* --- Play --- */
function play(){
  const data = makeRound(S.code, S.round);
  R = { data, found: new Set(), wrong: 0, ended: false, deadline: Date.now() + level().seconds * 1000, timer: null };
  const stats = `<div class="stats"><span class="found" id="found"></span><span class="timer" id="timer"></span></div>`;
  $app.innerHTML = bar(stats) + `<main class="playwrap">
    <div class="scene">${pictureSVG(S.round, pictureFor(data, S.player), [], "pic")}</div>
    <div class="actionbar">
      ${keyStrip(CONFIG.keyPhrases, "both")}
      <div class="buttons">
        <button class="btn secondary small" data-act="phrases">More phrases</button>
        <button class="btn secondary small" data-act="oops">Oops, German! (−${CONFIG.germanSeconds} s)</button>
      </div>
    </div>
  </main>`;
  document.getElementById("pic").addEventListener("click", tap);
  updateFound();
  tick();
  R.timer = setInterval(tick, 250);
}
function tick(){
  if (!R || R.ended) return;
  const left = Math.max(0, Math.ceil((R.deadline - Date.now()) / 1000));
  const el = document.getElementById("timer");
  if (el){ el.textContent = clockText(left); el.classList.toggle("low", left <= 30); }
  if (left <= 0) endRound();
}
function stopTimer(){ if (R && R.timer){ clearInterval(R.timer); R.timer = null; } }
function updateFound(){
  const el = document.getElementById("found");
  if (el) el.textContent = `Found ${R.found.size} / ${R.data.diffs.length}`;
}
function penalty(seconds){
  R.deadline -= seconds * 1000;
  const el = document.getElementById("timer");
  if (el){ el.classList.remove("hit"); void el.offsetWidth; el.classList.add("hit"); }
  tick();
}

function svgPoint(svg, e){
  const pt = svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}
function addMark(html){
  const g = document.getElementById("pic-marks");
  g.insertAdjacentHTML("beforeend", html);
  return g.lastElementChild;
}
function tap(e){
  if (!R || R.ended) return;
  const p = svgPoint(e.currentTarget, e);
  const hit = hitTest(R.data, p.x, p.y, R.found);
  if (hit === "found"){ toast("You've found that one already."); return; }
  if (hit === null){
    R.wrong++;
    const x = addMark(`<path d="M${p.x - 22} ${p.y - 22}l44 44m0 -44l-44 44" class="miss"/>`);
    setTimeout(() => x.remove(), 900);
    toast(`No difference here: −${CONFIG.wrongTapSeconds} s. Talk first, then tap!`, "bad");
    penalty(CONFIG.wrongTapSeconds);
    return;
  }
  R.found.add(hit);
  for (const b of R.data.diffs[hit].boxes){
    addMark(`<ellipse cx="${b.x + b.w / 2}" cy="${b.y + b.h / 2}" rx="${b.w / 2 - 6}" ry="${b.h / 2 - 6}" class="mark found pop"/>`);
  }
  updateFound();
  if (R.found.size === R.data.diffs.length){
    R.ended = true; stopTimer();
    toast("All found! Well done.", "good");
    setTimeout(() => { R.ended = false; endRound(); }, 1200);
  } else {
    toast("Found one! Is your partner tapping it too?", "good");
  }
}

function endRound(){
  if (!R || R.ended) return;
  R.ended = true; stopTimer();
  S.results.push({ round: S.round, found: R.found.size, total: R.data.diffs.length });
  S.last = { found: [...R.found], wrong: R.wrong };
  go("result");
}

/* --- Round result --- */
function result(){
  const data = makeRound(S.code, S.round);
  const found = new Set((S.last && S.last.found) || []);
  const other = S.player === 1 ? 2 : 1;
  const marks = [];
  data.diffs.forEach((d, i) => d.boxes.forEach(box => marks.push({ box, n: i + 1, kind: found.has(i) ? "found" : "missed" })));
  const all = found.size === data.diffs.length;
  const rows = data.diffs.map((d, i) => `<li class="${found.has(i) ? "found" : "missed"}">
      <span class="badge-li">${i + 1}</span>
      <div><p><b>You:</b> ${esc(sentence(data, d, S.player))}</p><p><b>Your partner:</b> ${esc(sentence(data, d, other))}</p></div>
      <span class="state">${found.has(i) ? "✓ found" : "missed"}</span>
    </li>`).join("");
  const lastRound = S.round >= CONFIG.roundsPerGame;
  $app.innerHTML = bar() + `<main class="wrap center">
    <p class="big ${all ? "good" : "bad"}">${all ? "All found!" : "Time's up!"}</p>
    <p class="lead">You found <b>${found.size} of ${data.diffs.length}</b> differences.</p>
    <div class="compare">
      <figure><figcaption>Your picture</figcaption>${pictureSVG(S.round, pictureFor(data, S.player), marks)}</figure>
      <figure><figcaption>Your partner's picture</figcaption>${pictureSVG(S.round, pictureFor(data, other), marks)}</figure>
    </div>
    <h2 class="h2">What's different? Read it out together.</h2>
    <ol class="difflist">${rows}</ol>
    <div class="stack"><button class="btn" data-act="next">${lastRound ? "See results" : "Next round"}</button></div>
  </main>`;
}
function nextRound(){
  if (S.round >= CONFIG.roundsPerGame){ go("final"); return; }
  S.round++; S.last = null; go("intro");
}

/* --- Final --- */
function final(){
  const found = S.results.reduce((a, r) => a + r.found, 0), total = S.results.reduce((a, r) => a + r.total, 0);
  const rows = S.results.map(r => `<tr><td>Round ${r.round}</td><td>${r.found} of ${r.total}</td></tr>`).join("");
  $app.innerHTML = bar() + `<main class="wrap center">
    <p class="big">Game over</p>
    <p class="lead">You found</p>
    <p class="total">${found} / ${total}</p>
    <table class="scoretable">${rows}</table>
    <p class="lead" style="margin-top:20px">Ask your partner: Did you find the same differences?</p>
    <div class="stack"><button class="btn" data-act="restart">Play again</button></div>
  </main>`;
}

/* --- Sheets --- */
function phrases(){
  const W = words(S.round || 1), a = art(S.round || 1);
  const list = CONFIG.phrases.map(p => `<li>${esc(p)}</li>`).join("");
  const label = k => {
    const t = W.things[k];
    if (t) return t.a ? t.a.replace(/^an? /, "") : t.many;
    return W.furniture[k] || k;
  };
  const things = a.WORDLIST;
  const tile = (k, text) => `<figure class="word"><div class="wpic">${a.iconSVG(k)}</div><figcaption>${esc(text)}</figcaption></figure>`;
  const bank = things.map(k => tile(k, label(k))).join("");
  const acts = Object.entries(W.activities).map(([k, t]) => tile(k, t.replace(/^is /, ""))).join("");
  const cols = Object.values(COLOURS).map(c => `<span class="chip"><i style="background:${c.c}"></i>${esc(c.word)}</span>`).join("");
  const preps = CONFIG.prepositions.map(p => `<span class="chip">${esc(p)}</span>`).join("");
  openSheet(`<h2>Useful phrases</h2><ul>${list}</ul>
    <h3>Where?</h3><div class="chips">${preps}</div>
    <h3>Colours</h3><div class="chips">${cols}</div>
    <h3>Things</h3><div class="wordgrid">${bank}</div>
    <h3>What are they doing?</h3><div class="wordgrid">${acts}</div>`);
}
function howto(){
  openSheet(`<h2>How to play</h2>
    <ol>
      <li>Player 1 starts a new game and tells Player 2 the code.</li>
      <li>Sit back to back. Don't show your screen!</li>
      <li>Your pictures are almost the same, but there are some differences. Describe your picture and ask questions.</li>
      <li>Found a difference? <b>Both of you tap it</b> in your picture.</li>
      <li>A tap where there is no difference costs ${CONFIG.wrongTapSeconds} seconds. So talk first, then tap!</li>
      <li>Speak English only. If you speak German, tap <b>Oops, German!</b> – that costs ${CONFIG.germanSeconds} seconds.</li>
    </ol>`);
}

/* --- Events --- */
document.addEventListener("click", e => {
  const t = e.target.closest("[data-act]");
  if (!t) return;
  switch (t.dataset.act){
    case "home": S = store.fresh(); save(); go("home"); break;
    case "new": go("newgame"); break;
    case "join": go("join"); break;
    case "level": S = { ...store.fresh(), code: newCode(parseInt(t.dataset.level, 10)), player: 1 }; go("code"); break;
    case "toIntro": go("intro"); break;
    case "doJoin": doJoin(); break;
    case "start": go("play"); break;
    case "oops":
      if (R && !R.ended){ penalty(CONFIG.germanSeconds); toast(`−${CONFIG.germanSeconds} s – keep going in English!`); }
      break;
    case "next": nextRound(); break;
    case "restart": S = store.fresh(); save(); go("home"); break;
    case "phrases": phrases(); break;
    case "howto": howto(); break;
    case "closeSheet": closeSheet(); break;
    case "quit": confirmQuit(); break;
    case "doQuit": closeSheet(); stopTimer(); R = null; S = store.fresh(); save(); go("home"); break;
  }
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && sheetOpen()) closeSheet(); });

render();
