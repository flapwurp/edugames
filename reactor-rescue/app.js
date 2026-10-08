/* Reactor Rescue – screens and controls */
import { CONFIG } from "./content.js";
import { WIRE_COLOURS, LAMP_COLOURS, ORD, sameArr, makeReactor } from "./rules.js";
import { manualHTML } from "./manual.js";
import { levelOf, validCode, newCode, firstRolePlayer, createStore } from "../shared/session.js";
import { encode, decode } from "../shared/sync.js";
import { esc, clockText, starText, keyStrip, openSheet, closeSheet, sheetOpen, confirmQuit, toast, clearToast } from "../shared/ui.js";


const $app = document.getElementById("app");
const LEVEL_COUNT = Object.keys(CONFIG.levels).length;
const store = createStore("reactor-rescue-v2", () => ({ screen: "home", code: null, player: null, round: 1, results: [], last: null }));
const fresh = () => store.fresh();
const save = () => store.save(S);

let S = store.load() || fresh();
if (S.screen === "play") S.screen = "intro";
let R = null;

const L = () => CONFIG.levels[levelOf(S.code)];
const myRole = () => (firstRolePlayer(S.round) === S.player ? "operator" : "expert");

function go(screen){ clearToast(); S.screen = screen; save(); render(); window.scrollTo(0, 0); }
function stopTimer(){ if (R && R.timer){ clearInterval(R.timer); R.timer = null; } }

function bar(showClock){
  if (!S.code) return "";
  return `<header class="bar">
    <div class="meta"><span>Game <strong>${S.code}</strong></span><span>Player ${S.player}</span><span>${esc(L().name)}</span><span>Reactor ${S.round}/${CONFIG.roundsPerGame}</span></div>
    <div class="spacer"></div>
    ${showClock ? `<div class="clock-mini" id="clockMini"></div>` : ""}
    <button data-act="howto">How to play</button>
    <button data-act="quit">Leave game</button>
  </header>`;
}
function render(){ stopTimer(); ({ home, newgame, code: codeScreen, join, intro, play, result, final }[S.screen] || home)(); }

function home(){
  $app.innerHTML = `<main class="wrap center">
    <div class="core" aria-hidden="true"></div>
    <h1 class="title">Reactor Rescue</h1>
    <p class="lead">The reactor is overheating! One of you sees the reactor, the other one has the manual. Talk to each other – in English – and keep it stable.</p>
    <div class="stack">
      <button class="btn" data-act="new">Start a new game</button>
      <button class="btn secondary" data-act="join">Join a game</button>
      <button class="linkbtn" data-act="howto">How to play</button>
    </div></main>`;
}
function newgame(){
  const items = Object.entries(CONFIG.levels).map(([n, lv]) =>
    `<button class="level" data-act="level" data-level="${n}"><span class="badge">${esc(lv.name.toUpperCase())}</span><span><b>${Math.round(lv.seconds / 60)} minutes per reactor</b><small>${esc(lv.info)}</small></span></button>`).join("");
  $app.innerHTML = `<main class="wrap center"><h1 class="roundno">Choose a level</h1><div class="levels">${items}</div>
    <div class="stack"><button class="linkbtn" data-act="home">Back</button></div></main>`;
}
function codeScreen(){
  $app.innerHTML = `<main class="wrap center"><p class="lead">Your game code</p><div class="bigcode">${S.code}</div>
    <p class="lead">Tell your partner this code. They tap <b>Join a game</b> and type it in.<br>You are <b>Player 1</b>.</p>
    <div class="stack"><button class="btn" data-act="toIntro">We're ready</button><button class="linkbtn" data-act="home">Back</button></div></main>`;
}
function join(){
  $app.innerHTML = `<main class="wrap center"><h1 class="roundno">Join a game</h1><p class="lead">Type in the code from your partner's screen.</p>
    <div style="margin-top:20px"><input id="codein" class="codeinput" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" aria-label="Game code"></div>
    <p class="error" id="err"></p>
    <div class="stack"><button class="btn" data-act="doJoin">Join game</button><button class="linkbtn" data-act="home">Back</button></div></main>`;
  const inp = document.getElementById("codein");
  inp.focus();
  inp.addEventListener("keydown", e => { if (e.key === "Enter") doJoin(); });
}
function doJoin(){
  const raw = document.getElementById("codein").value.trim();
  const code = /^\d{4}$/.test(raw) ? parseInt(raw, 10) : NaN;
  if (!validCode(code, LEVEL_COUNT)){ document.getElementById("err").textContent = "Check the code: it has 4 numbers and starts with 1 or 2."; return; }
  S = { ...fresh(), code, player: 2 };
  go("intro");
}
function intro(){
  const role = myRole();
  const text = role === "operator"
    ? `<h2>You are the operator</h2><p>You can see the reactor, but you don't have the manual.</p><p>Describe exactly what you see, answer your partner's questions and do what your partner says. Don't do anything on your own!</p><p>If anyone speaks German, tap <b>Oops, German!</b> – you lose ${CONFIG.germanPenaltySeconds} seconds.</p>`
    : `<h2>You are the expert</h2><p>You have the manual, but you can't see the reactor – and the manual doesn't show what the reactor looks like.</p><p>Ask your partner to describe the reactor, work out what to do and give clear instructions.</p><p>When the reactor is stable, your partner reads you a code. Type it in at the bottom of your screen.</p>`;
  $app.innerHTML = bar(false) + `<main class="wrap center"><p class="roundno">Reactor ${S.round} of ${CONFIG.roundsPerGame}</p>
    <div class="rolecard ${role}"><span class="role ${role}">Player ${S.player}</span>${text}</div>
    <div class="stack"><button class="btn" data-act="start">Start</button><p class="lead" style="margin:0">Start at the same time as your partner. Don't show your screen!</p></div></main>`;
}

/* --- play --- */
function play(){
  const d = makeReactor(S.code, S.round);
  R = { d, role: myRole(), cut: new Set(), sel: null, tested: false, lv: d.levers.slice(),
        solved: { wires: false, levers: false, code: false }, entry: "", strikes: 0, lastMistake: null,
        deadline: Date.now() + L().seconds * 1000, timer: null, ended: false };
  if (R.role === "operator") renderOperator(); else renderExpert();
  tick();
  R.timer = setInterval(tick, 250);
}
function wireSVG(){
  const d = R.d, n = d.wires.length, H = 26 + n * 46, W = 320;
  const strokes = (path, w) => {
    const col = WIRE_COLOURS[w.c], edge = w.c === "black" ? "#2a2f38" : "#0b0f16";
    const band = w.c === "white" || w.c === "yellow" ? "#1b1f27" : "#f4f6f9";
    let s = `<path d="${path}" stroke="${edge}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="${path}" stroke="${col}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    if (w.s) s += `<path d="${path}" stroke="${band}" stroke-width="9" fill="none" stroke-dasharray="4 8"/>`;
    return s;
  };
  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${n} wires">`;
  d.wires.forEach((w, i) => {
    const y = 36 + i * 46;
    s += `<rect x="8" y="${y - 10}" width="18" height="20" rx="3" fill="#8b97a8"/><rect x="${W - 26}" y="${y - 10}" width="18" height="20" rx="3" fill="#8b97a8"/>`;
    const full = `M26 ${y} C 110 ${y - 16}, 210 ${y + 16}, ${W - 26} ${y}`;
    if (R.cut.has(i)){
      s += strokes(`M26 ${y} C 70 ${y - 10}, 120 ${y - 8}, 148 ${y + 4}`, w) + strokes(`M172 ${y - 4} C 205 ${y + 8}, 250 ${y + 10}, ${W - 26} ${y}`, w);
      s += `<circle cx="150" cy="${y + 4}" r="3" fill="#d9a066"/><circle cx="170" cy="${y - 4}" r="3" fill="#d9a066"/>`;
    } else {
      s += `<g data-act="wire" data-idx="${i}">`;
      if (R.sel === i) s += `<path d="${full}" stroke="#ffe066" stroke-opacity=".75" stroke-width="22" fill="none" stroke-linecap="round"/>`;
      s += strokes(full, w) + `<path d="${full}" stroke="transparent" stroke-width="40" fill="none"/></g>`;
    }
  });
  return s + `</svg>`;
}
function renderOperator(){
  const d = R.d, max = L().maxStrikes;
  const leds = Array.from({ length: max }, (_, i) => `<span class="led ${i < R.strikes ? "on" : ""}"></span>`).join("");
  const st = k => `<span class="st"><i></i>${R.solved[k] ? "STABLE" : "UNSTABLE"}</span>`;
  const levers = R.lv.map((u, i) => `<button class="lever ${u ? "up" : "down"}" data-act="lever" data-idx="${i}" aria-label="Lever ${u ? "up" : "down"}"></button>`).join("");
  const shown = (R.entry + "____").slice(0, 4);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "0", "ENT"].map(k =>
    `<button class="cbtn ${k === "ENT" ? "warn" : ""}" data-act="key" data-key="${k}">${k}</button>`).join("");
  $app.innerHTML = bar(false) + `<main class="wrap"><div class="console" id="console">
    <div class="hazard"></div>
    <div class="toprow">
      <div class="plate"><div class="lbl">MODEL</div><div class="model">${d.model.toUpperCase()}</div><div class="lbl" style="margin-top:4px">SERIAL NUMBER</div><div class="serial">${d.serial}</div></div>
      <div class="strikes"><span class="lbl">ERRORS</span><span class="leds">${leds}</span></div>
      <div class="clockbox"><span class="lbl">TIME LEFT</span><div class="clock" id="clock"></div></div>
    </div>
    <div class="modules">
      <section class="module ${R.solved.wires ? "stable" : ""}"><h3>UNIT <span class="unitcode">${d.wUnit}</span>${st("wires")}</h3>
        <div class="controls">
          <div class="wirebox">${wireSVG()}</div>
          <div class="row">
            <button class="cbtn keep" data-act="test">TEST</button><span class="testled keep ${R.tested ? d.test : ""}" aria-label="Test light"></span>
            <span class="grow"></span>
            <button class="cbtn warn" data-act="cutwire" ${R.sel === null ? "disabled" : ""}>✂ CUT</button>
          </div>
        </div>
      </section>
      <section class="module ${R.solved.levers ? "stable" : ""}"><h3>UNIT <span class="unitcode">${d.rUnit}</span>${st("levers")}</h3>
        <div class="controls">
          <div class="lamp ${d.pulse ? "pulse" : ""}" style="color:${LAMP_COLOURS[d.lamp]}" aria-label="Indicator"></div>
          <div class="bank ${d.stripe}">
            <div class="hazardbar"></div>
            <div class="bankrow ${d.gauge}"><div class="gauge" aria-label="Pressure gauge"><i></i></div><div class="levers">${levers}</div></div>
          </div>
          <div class="row"><span class="grow"></span><button class="cbtn warn" data-act="engage">ENGAGE</button></div>
        </div>
      </section>
      <section class="module ${R.solved.code ? "stable" : ""}"><h3>UNIT <span class="unitcode">C-9</span>${st("code")}</h3>
        <div class="controls"><div class="display">${shown}</div><div class="keypad">${keys}</div></div>
      </section>
    </div></div>
    <div class="actionbar">${keyStrip(CONFIG.keyPhrases.operator, "operator")}
      <button class="btn secondary small" data-act="oops">Oops, German! (−${CONFIG.germanPenaltySeconds} s)</button>
    </div></main>`;
  tick();
}
function renderExpert(){
  $app.innerHTML = bar(true) + `<main class="wrap">${manualHTML(levelOf(S.code))}
    <div class="actionbar">${keyStrip(CONFIG.keyPhrases.expert, "expert")}
      <div class="codeentry">
        <label for="ccode">Stabilisation code:</label>
        <input id="ccode" inputmode="numeric" pattern="[0-9]*" maxlength="3" autocomplete="off">
        <button class="btn small" data-act="checkcode">Check</button>
        <button class="btn secondary small" data-act="exploded">The reactor exploded</button>
      </div>
    </div></main>`;
  document.getElementById("ccode").addEventListener("keydown", e => { if (e.key === "Enter") checkCode(); });
}
function tick(){
  if (!R) return;
  const left = Math.max(0, Math.ceil((R.deadline - Date.now()) / 1000));
  const txt = clockText(left);
  for (const id of ["clock", "clockMini"]){
    const el = document.getElementById(id);
    if (el){ el.textContent = txt; el.classList.toggle("low", left <= 30); }
  }
  if (left <= 0 && R.role === "operator") explode("time");
}

function strike(mistake){
  R.strikes++; R.lastMistake = mistake;
  if (R.strikes >= L().maxStrikes){ explode("mistakes"); return; }
  renderOperator();
  const c = document.getElementById("console");
  if (c){ c.classList.remove("alarm"); void c.offsetWidth; c.classList.add("alarm"); }
  toast(`Wrong! Error ${R.strikes} of ${L().maxStrikes}. The reactor is getting hotter!`, "bad");
}
function checkAllSolved(){
  if (R.solved.wires && R.solved.levers && R.solved.code){
    R.ended = true; stopTimer();
    const stars = CONFIG.stars[Math.min(R.strikes, CONFIG.stars.length - 1)];
    S.results.push({ round: S.round, stars });
    S.last = { ok: true, stars, confirm: encode(S.code, S.round, R.strikes), role: "operator" };
    go("result");
  } else renderOperator();
}
function explode(reason){
  if (!R || R.ended) return;
  R.ended = true; stopTimer();
  S.results.push({ round: S.round, stars: 0 });
  const sentence = reason === "time" || !R.lastMistake
    ? "If you had worked a little faster, the reactor wouldn't have exploded."
    : `If you had ${R.lastMistake}, the reactor would have survived.`;
  S.last = { ok: false, sentence, role: "operator" };
  go("result");
}
function onWire(i){ if (R.solved.wires || R.cut.has(i)) return; R.sel = R.sel === i ? null : i; renderOperator(); }
function cutWire(){
  if (R.sel === null || R.solved.wires) return;
  const i = R.sel; R.cut.add(i); R.sel = null;
  if (i === R.d.solution.wire){ R.solved.wires = true; toast(`Unit ${R.d.wUnit} stable!`, "good"); checkAllSolved(); }
  else strike(`cut the ${ORD[R.d.solution.wire]} wire from the top`);
}
function engage(){
  if (R.solved.levers) return;
  if (sameArr(R.lv, R.d.solution.levers)){ R.solved.levers = true; toast(`Unit ${R.d.rUnit} stable!`, "good"); checkAllSolved(); }
  else strike(`set the levers like this (from left to right: ${R.d.solution.levers.map(u => (u ? "up" : "down")).join(", ")})`);
}
function key(k){
  if (R.solved.code) return;
  if (k === "CLR"){ R.entry = ""; renderOperator(); return; }
  if (k === "ENT"){
    if (R.entry.length < 4){ toast("The code has four digits."); return; }
    if (R.entry === R.d.solution.code){ R.solved.code = true; toast("Unit C-9 stable!", "good"); checkAllSolved(); }
    else { R.entry = ""; strike(`entered the code ${R.d.solution.code.split("").join(" ")}`); }
    return;
  }
  if (R.entry.length < 4){ R.entry += k; renderOperator(); }
}
function checkCode(){
  const inp = document.getElementById("ccode");
  const v = parseInt(inp.value, 10);
  const s = decode(S.code, S.round, v, L().maxStrikes - 1);
  if (s !== null){
    R.ended = true; stopTimer();
    const stars = CONFIG.stars[Math.min(s, CONFIG.stars.length - 1)];
    S.results.push({ round: S.round, stars });
    S.last = { ok: true, stars, role: "expert" };
    go("result"); return;
  }
  inp.value = "";
  toast("This code is not correct. Ask your partner to read it again.", "bad");
}
function expertExploded(){
  R.ended = true; stopTimer();
  S.results.push({ round: S.round, stars: 0 });
  S.last = { ok: false, role: "expert", sentence: "Ask your partner what went wrong. What would have happened if you had asked more questions?" };
  go("result");
}

function result(){
  const x = S.last || {};
  const lastRound = S.round >= CONFIG.roundsPerGame;
  const next = `<div class="stack"><button class="btn" data-act="next">${lastRound ? "See results" : "Next reactor"}</button></div>`;
  let body;
  if (x.ok && x.role === "operator"){
    body = `<p class="big good">Reactor stable!</p><div class="stars">${starText(x.stars)}</div>
      <p class="lead">Your stabilisation code:</p><div class="bigcode">${x.confirm}</div>
      <p class="lead">Read the code to your partner in English. Your partner types it in. Then go on together.</p>`;
  } else if (x.ok){
    body = `<p class="big good">Reactor stable!</p><div class="stars">${starText(x.stars)}</div><p class="lead">Well done, team. Now swap roles!</p>`;
  } else {
    body = `<div class="boom">KA-BOOM!</div><p class="lead">The reactor overloaded.</p><p class="type3">${esc(x.sentence)}</p>
      <p class="lead">${x.role === "operator" ? "Read this sentence to your partner. What went wrong?" : ""}</p>`;
  }
  $app.innerHTML = bar(false) + `<main class="wrap center">${body}${next}</main>`;
}
function nextRound(){ if (S.round >= CONFIG.roundsPerGame){ go("final"); return; } S.round++; S.last = null; go("intro"); }
function final(){
  const total = S.results.reduce((a, r) => a + r.stars, 0);
  const rows = S.results.map(r => `<tr><td>Reactor ${r.round}</td><td class="s">${"★".repeat(r.stars) || "exploded"}</td></tr>`).join("");
  $app.innerHTML = bar(false) + `<main class="wrap center"><p class="big">Mission over</p><p class="lead">Your team score:</p>
    <p class="total">${total} ★</p><table class="scoretable">${rows}</table>
    <div class="stack"><button class="btn" data-act="restart">Play again</button></div></main>`;
}

function howto(){
  openSheet(`<h2>How to play</h2><ol>
    <li>Player 1 starts a new game and tells Player 2 the code.</li>
    <li>Sit back to back. Never show your screen!</li>
    <li>The <b>operator</b> sees the reactor. The <b>expert</b> has the manual, but the manual doesn't show what the reactor looks like. Describe, ask, explain – and stabilise all three units.</li>
    <li>Wrong actions are errors. After ${CONFIG.levels[1].maxStrikes} errors – or when the time is up – the reactor explodes.</li>
    <li>When the reactor is stable, the operator reads the code to the expert. The expert types it in.</li>
    <li>Swap roles after every reactor. Speak English only!</li></ol>
    <p><b>Stars:</b> no errors ★★★ · one error ★★ · two errors ★</p>`);
}
document.addEventListener("click", e => {
  const t = e.target.closest("[data-act]");
  if (!t) return;
  switch (t.dataset.act){
    case "home": S = fresh(); save(); go("home"); break;
    case "new": go("newgame"); break;
    case "join": go("join"); break;
    case "level": { const lv = parseInt(t.dataset.level, 10); S = { ...fresh(), code: newCode(lv), player: 1 }; go("code"); break; }
    case "toIntro": go("intro"); break;
    case "doJoin": doJoin(); break;
    case "start": go("play"); break;
    case "wire": onWire(+t.dataset.idx); break;
    case "cutwire": cutWire(); break;
    case "test": R.tested = true; renderOperator(); break;
    case "lever": if (!R.solved.levers){ const i = +t.dataset.idx; R.lv[i] = !R.lv[i]; renderOperator(); } break;
    case "engage": engage(); break;
    case "key": key(t.dataset.key); break;
    case "oops": R.deadline -= CONFIG.germanPenaltySeconds * 1000; tick(); toast(`−${CONFIG.germanPenaltySeconds} seconds – keep going in English!`, "bad"); break;
    case "checkcode": checkCode(); break;
    case "exploded":
      openSheet(`<h2>Did the reactor explode?</h2><p>Only tap “Yes” if your partner's screen says KA-BOOM.</p>
        <div class="btnrow"><button class="btn secondary" data-act="closeSheet">No, go back</button><button class="btn" data-act="confirmExploded">Yes, it exploded</button></div>`, false);
      break;
    case "confirmExploded": closeSheet(); expertExploded(); break;
    case "next": nextRound(); break;
    case "restart": S = fresh(); save(); go("home"); break;
    case "howto": howto(); break;
    case "closeSheet": closeSheet(); break;
    case "quit": confirmQuit(); break;
    case "doQuit": closeSheet(); S = fresh(); save(); go("home"); break;
  }
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && sheetOpen()) closeSheet(); });

render();
