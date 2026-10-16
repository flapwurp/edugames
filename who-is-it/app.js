/* Who is it? – screens and controls (team game and versus) */
import { CONFIG, FEATURES } from "./content.js";
import { FEATURE_KEYS, makeRound, makeBoard, modeOf, codeFor, randomPerson, avatarSVG } from "./people.js";
import { mulberry32 } from "../shared/random.js";
import { levelOf, validCode, firstRolePlayer, createStore } from "../shared/session.js";
import { esc, clockText, starText, keyStrip, openSheet, closeSheet, sheetOpen, confirmQuit, toast, clearToast } from "../shared/ui.js";

const $app = document.getElementById("app");
const LEVEL_COUNT = Object.keys(CONFIG.levels).length;
const store = createStore("whoisit-v2", () => ({ screen: "home", code: null, player: null, round: 1, results: [], penalties: 0, pendingMode: null }));

let S = store.load() || store.fresh();
if (S.screen === "play") S.screen = "intro";
let R = null;  // state of the running round

const mode = () => modeOf(S.code);
const myRole = () => (firstRolePlayer(S.round) === S.player ? "describer" : "guesser");
const level = () => CONFIG.levels[levelOf(S.code)];
const save = () => store.save(S);

function go(screen){ clearToast(); S.screen = screen; save(); render(); window.scrollTo(0, 0); }

function bar(){
  if (!S.code) return "";
  return `<header class="bar">
    <div class="meta"><span>Game <strong>${S.code}</strong></span><span>Player ${S.player}</span><span>${esc(CONFIG.modes[mode()].name)}</span><span>${esc(level().name)}</span></div>
    <div class="spacer"></div>
    <button data-act="howto">How to play</button>
    <button data-act="quit">Leave game</button>
  </header>`;
}

function render(){
  stopTimer();
  const fn = { home, choosemode, newgame, code: codeScreen, join, intro, play, result, final }[S.screen] || home;
  fn();
}

/* --- Home --- */
function home(){
  const rng = mulberry32(Date.now() >>> 0);
  const faces = [0, 1, 2, 3].map(() => `<div class="frame">${avatarSVG(randomPerson(rng))}</div>`).join("");
  $app.innerHTML = `<main class="wrap center">
    <div class="hero-lineup">${faces}</div>
    <h1 class="title">Who is it?</h1>
    <p class="lead">Find the right person. Describe, ask and guess – in English only!</p>
    <div class="stack">
      <button class="btn" data-act="new">Start a new game</button>
      <button class="btn secondary" data-act="join">Join a game</button>
      <button class="linkbtn" data-act="howto">How to play</button>
    </div>
  </main>`;
}

/* --- New game: choose mode, then level --- */
function choosemode(){
  const items = Object.entries(CONFIG.modes).map(([id, m]) =>
    `<button class="level mode-${id}" data-act="mode" data-mode="${id}"><span class="num">${id === "team" ? "🤝" : "⚔️"}</span><span><b>${esc(m.name)}</b><small>${esc(m.info)}</small></span></button>`).join("");
  $app.innerHTML = `<main class="wrap center">
    <h1 class="roundno">How do you want to play?</h1>
    <div class="levels">${items}</div>
    <div class="stack"><button class="linkbtn" data-act="home">Back</button></div>
  </main>`;
}
function newgame(){
  const vs = S.pendingMode === "versus";
  const items = Object.entries(CONFIG.levels).map(([n, L]) =>
    `<button class="level" data-act="level" data-level="${n}"><span class="num">${n}</span><span><b>${esc(L.name)}</b><small>${vs ? L.board : L.suspects} people – ${esc(L.info)}</small></span></button>`).join("");
  $app.innerHTML = `<main class="wrap center">
    <h1 class="roundno">Choose a level</h1>
    <p class="lead">${esc(CONFIG.modes[S.pendingMode].name)}</p>
    <div class="levels">${items}</div>
    <div class="stack"><button class="linkbtn" data-act="new">Back</button></div>
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

/* --- Join (Player 2) – the code tells level and mode --- */
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
  let card;
  if (mode() === "versus"){
    card = `<div class="rolecard versus"><span class="role versus">Player ${S.player}</span>
      <h2>Versus</h2>
      <p>You both have a <b>secret person</b>. Your partner has a different one.</p>
      <p><b>Take turns:</b> ask one yes/no question, then your partner asks one. Cross out people with ✕.</p>
      <p>Do you know your partner's person? Tap them and <b>That's my guess</b>. But careful: if you're wrong, you lose!</p>
      <p>${S.round % 2 === 1 ? "Player 1" : "Player 2"} asks the first question.</p></div>`;
  } else {
    const role = myRole();
    const text = role === "describer"
      ? `<h2>You describe</h2><p>You see <b>one person</b>. Describe this person to your partner and answer their questions.</p><p>Don't show your screen!</p>`
      : `<h2>You guess</h2><p>You see <b>${level().suspects} people</b>. Ask your partner questions. Tap the right person, then tap <b>That's my guess</b>.</p><p>Tap ✕ to cross out people.</p>`;
    card = `<div class="rolecard ${role}"><span class="role ${role}">Player ${S.player}</span>${text}</div>`;
  }
  $app.innerHTML = bar() + `<main class="wrap center">
    <p class="roundno">${mode() === "versus" ? "Game" : "Round"} ${S.round} of ${CONFIG.roundsPerGame}</p>
    ${card}
    <div class="stack"><button class="btn" data-act="start">Start</button>
    <p class="tip" style="margin:0">Start at the same time as your partner.</p></div>
  </main>`;
}

/* --- Play --- */
const suspectCards = people => people.map((p, i) =>
  `<div class="suspect" data-act="pick" data-idx="${i}" role="button" tabindex="0" aria-label="Person ${i + 1}">
    <div class="frame">${avatarSVG(p)}</div>
    <button class="x" data-act="cross" data-idx="${i}" aria-label="Cross out person ${i + 1}">✕</button>
  </div>`).join("");

function play(){ if (mode() === "versus") playVersus(); else playTeam(); }

function playTeam(){
  const data = makeRound(S.code, S.round);
  R = { data, wrong: 0, out: new Set(), selected: null, ended: false, deadline: Date.now() + level().seconds * 1000, timer: null };
  if (myRole() === "describer"){
    $app.innerHTML = bar() + `<main class="wrap">
      <div class="playhead"><span class="role describer">You describe</span><p class="task">Describe this person. Answer your partner's questions.</p><div class="timer" id="timer"></div></div>
      <div class="target"><div class="frame">${avatarSVG(data.people[data.target])}</div></div>
      <p class="tip">Talk about hair, face, jewellery, clothes, colours and patterns.</p>
      <div class="actionbar">
        ${keyStrip(CONFIG.keyPhrases.describer, "describer")}
        <button class="btn secondary small" data-act="phrases">More phrases</button>
        <button class="btn secondary small" data-act="oops">Oops, German! (−${CONFIG.germanPenalty} ★)</button>
        <button class="btn grow" data-act="partnerFound">My partner found the person</button>
      </div>
    </main>`;
  } else {
    $app.innerHTML = bar() + `<main class="wrap">
      <div class="playhead"><span class="role guesser">You guess</span><p class="task">Ask questions. Who is it?</p><div class="timer" id="timer"></div></div>
      <div class="lineup" id="lineup">${suspectCards(data.people)}</div>
      <div class="actionbar">
        ${keyStrip(CONFIG.keyPhrases.guesser, "guesser")}
        <button class="btn secondary small" data-act="phrases">More phrases</button>
        <button class="btn secondary small" data-act="oops">Oops, German! (−${CONFIG.germanPenalty} ★)</button>
        <button class="btn grow" id="guessBtn" data-act="guess" disabled>That's my guess</button>
      </div>
    </main>`;
  }
  tick();
  R.timer = setInterval(tick, 250);
}

function playVersus(){
  const data = makeBoard(S.code, S.round);
  const mine = data.secrets[S.player - 1], theirs = data.secrets[2 - S.player];
  R = { data, mine, theirs, out: new Set(), selected: null, ended: false, timer: null };
  $app.innerHTML = bar() + `<main class="wrap">
    <div class="vs-head">
      <div class="mine"><div class="frame">${avatarSVG(data.people[mine])}</div></div>
      <div class="vs-text"><span class="role versus">Your secret person</span>
        <p class="task">Your partner asks about this person. Answer honestly!</p>
        <p class="tip">Take turns: one question each. Cross out people with ✕.</p></div>
    </div>
    <div class="lineup board" id="lineup">${suspectCards(data.people)}</div>
    <div class="actionbar">
      ${keyStrip(CONFIG.keyPhrases.versus, "versus")}
      <button class="btn secondary small" data-act="phrases">More phrases</button>
      <button class="btn secondary small" data-act="oopsVs">Oops, German!</button>
      <button class="btn secondary small" data-act="partnerGuessed">My partner guessed</button>
      <button class="btn grow" id="guessBtn" data-act="guess" disabled>That's my guess</button>
    </div>
  </main>`;
}

function tick(){
  if (!R || !R.deadline) return;
  const left = Math.max(0, Math.ceil((R.deadline - Date.now()) / 1000));
  const el = document.getElementById("timer");
  if (el){ el.textContent = clockText(left); el.classList.toggle("low", left <= 20); }
  if (left <= 0) endRound({ timeUp: true });
}
function stopTimer(){ if (R && R.timer){ clearInterval(R.timer); R.timer = null; } }

function updateCards(){
  document.querySelectorAll(".suspect").forEach(el => {
    const i = +el.dataset.idx;
    el.classList.toggle("out", R.out.has(i));
    el.classList.toggle("selected", R.selected === i);
  });
  const g = document.getElementById("guessBtn");
  if (g) g.disabled = R.selected === null;
}
function pick(i){
  if (R.out.has(i)) return;
  R.selected = R.selected === i ? null : i;
  updateCards();
}
function cross(i){
  if (R.out.has(i)) R.out.delete(i); else { R.out.add(i); if (R.selected === i) R.selected = null; }
  updateCards();
}
function guess(){
  if (R.selected === null || R.ended) return;
  if (mode() === "versus"){
    openSheet(`<h2>Is it this person?</h2>
      <div class="sheet-person"><div class="frame">${avatarSVG(R.data.people[R.selected])}</div></div>
      <p>If you're wrong, you lose this game.</p>
      <div class="btnrow"><button class="btn secondary" data-act="closeSheet">No, go back</button>
      <button class="btn" data-act="confirmGuess">Yes, that's my guess</button></div>`, false);
    return;
  }
  const i = R.selected;
  if (i === R.data.target){ endRound({ correct: true }); return; }
  R.wrong++; R.out.add(i); R.selected = null;
  const el = document.querySelector(`.suspect[data-idx="${i}"]`);
  if (el){ el.classList.add("wrong", "shake"); setTimeout(() => el.classList.remove("shake"), 600); }
  updateCards();
  toast("Not this person. Keep asking!");
}

/* --- Ending a round --- */
function endRound(res){
  if (!R || R.ended) return;
  R.ended = true; stopTimer();
  if (myRole() === "guesser"){
    const stars = res.correct ? CONFIG.stars[Math.min(R.wrong, CONFIG.stars.length - 1)] : 0;
    S.results.push({ round: S.round, stars });
    S.last = { correct: !!res.correct, stars, target: R.data.people[R.data.target], role: "guesser" };
  } else {
    S.last = { timeUp: true, role: "describer" };
  }
  go("result");
}
function endRoundDescriber(){
  if (!R || R.ended) return;
  R.ended = true; stopTimer();
  nextRound();
}
/* outcome: "found" (my guess right), "wrong" (my guess wrong), "partnerFound", "partnerWrong" */
function endVersus(outcome){
  if (!R || R.ended) return;
  R.ended = true;
  const won = outcome === "found" || outcome === "partnerWrong";
  S.results.push({ round: S.round, won });
  S.last = { versus: true, outcome, won, theirs: R.data.people[R.theirs], guessed: R.selected !== null ? R.data.people[R.selected] : null };
  go("result");
}

/* --- Round result --- */
function result(){
  const L = S.last || {};
  const lastRound = S.round >= CONFIG.roundsPerGame;
  const next = `<div class="stack"><button class="btn" data-act="next">${lastRound ? "See results" : (L.versus ? "Next game" : "Next round")}</button></div>`;
  const person = (p, cls = "") => `<div class="result-person ${cls}"><div class="frame">${avatarSVG(p)}</div></div>`;
  let body;
  if (L.versus){
    const texts = {
      found: `<p class="big good">You win!</p><p class="lead">You found your partner's person.</p>${person(L.theirs)}<p class="lead">Tell your partner. They tap <b>My partner guessed</b>.</p>`,
      wrong: `<p class="big bad">Not this person!</p><p class="lead">You lose this game. Your partner's person was:</p>${person(L.theirs)}<p class="lead">Tell your partner. They tap <b>My partner guessed</b>.</p>`,
      partnerFound: `<p class="big bad">Your partner found your person.</p><p class="lead">You lose this game – maybe next time!</p>`,
      partnerWrong: `<p class="big good">You win!</p><p class="lead">Your partner guessed the wrong person.</p>`
    };
    body = texts[L.outcome];
  } else if (L.role === "guesser" && L.correct){
    body = `<p class="big good">Correct!</p><div class="stars">${starText(L.stars)}</div>
      ${person(L.target)}<p class="lead">Tell your partner you've got it. Then go on together.</p>`;
  } else if (L.role === "guesser"){
    body = `<p class="big bad">Time's up!</p><p class="lead">This was the person:</p>
      ${person(L.target)}<p class="lead">Show your partner. What was difficult to describe?</p>`;
  } else {
    body = `<p class="big bad">Time's up!</p><p class="lead">Your partner can see the right person now. Go on together.</p>`;
  }
  $app.innerHTML = bar() + `<main class="wrap center">${body}${next}</main>`;
}
function nextRound(){
  if (S.round >= CONFIG.roundsPerGame){ go("final"); return; }
  S.round++; S.last = null; go("intro");
}

/* --- Final --- */
function final(){
  if (mode() === "versus"){
    const won = S.results.filter(r => r.won).length;
    const rows = S.results.map(r => `<tr><td>Game ${r.round}</td><td>${r.won ? "You won" : "Your partner won"}</td></tr>`).join("");
    $app.innerHTML = bar() + `<main class="wrap center">
      <p class="big">That's it!</p>
      <p class="lead">You won</p>
      <p class="total">${won} of ${S.results.length}</p>
      <table class="scoretable">${rows}</table>
      <div class="stack"><button class="btn" data-act="restart">Play again</button></div>
    </main>`;
    return;
  }
  const sum = S.results.reduce((a, r) => a + r.stars, 0);
  const total = Math.max(0, sum - S.penalties * CONFIG.germanPenalty);
  const rows = S.results.map(r => `<tr><td>Round ${r.round}</td><td class="s">${"★".repeat(r.stars) || "–"}</td></tr>`).join("");
  const pen = S.penalties ? `<tr><td>Oops, German!</td><td>−${S.penalties * CONFIG.germanPenalty} ★</td></tr>` : "";
  $app.innerHTML = bar() + `<main class="wrap center">
    <p class="big">Game over</p>
    <p class="lead">Your stars from the rounds you guessed:</p>
    <p class="total">${total} ★</p>
    <table class="scoretable">${rows}${pen}</table>
    <p class="lead" style="margin-top:20px">Ask your partner for their stars and add them up. That's your team score!</p>
    <div class="stack"><button class="btn" data-act="restart">Play again</button></div>
  </main>`;
}

/* --- Sheets --- */
function phrases(){
  const role = S.code && S.screen === "play" ? (mode() === "versus" ? "versus" : myRole()) : "describer";
  const list = CONFIG.phrases[role].map(p => `<li>${esc(p)}</li>`).join("");
  const groups = {};
  for (const k of FEATURE_KEYS){
    const g = FEATURES[k].group;
    for (const v of FEATURES[k].values){ if (v.word){ (groups[g] = groups[g] || []).push(v.word); } }
  }
  const bank = Object.entries(groups).map(([g, words]) =>
    `<h3>${esc(g)}</h3><div class="chips">${[...new Set(words)].map(w => `<span class="chip">${esc(w)}</span>`).join("")}</div>`).join("");
  openSheet(`<h2>Useful phrases</h2><ul>${list}</ul>${bank}`);
}
function partnerGuessed(){
  openSheet(`<h2>Your partner guessed</h2><p>Did your partner find your secret person?</p>
    <div class="btnrow"><button class="btn secondary" data-act="closeSheet">Not yet – go back</button></div>
    <div class="btnrow"><button class="btn" data-act="partnerRight">Yes, they found my person</button>
    <button class="btn" data-act="partnerWrongBtn">No, they guessed wrong</button></div>`, false);
}
function howto(){
  openSheet(`<h2>How to play</h2>
    <h3>Team game</h3>
    <ol>
      <li>Player 1 starts a new game and tells Player 2 the code.</li>
      <li>Sit back to back. Don't show your screen!</li>
      <li>The describer describes the person. The guesser asks questions and taps the right person.</li>
      <li>Swap roles after every round.</li>
      <li>Speak English only. If you speak German, tap <b>Oops, German!</b> and lose a star.</li>
    </ol>
    <p>Stars: right on the first try ★★★ · second try ★★ · later ★</p>
    <h3>Versus</h3>
    <ol>
      <li>You both see the same people. You both have a different secret person.</li>
      <li>Take turns: ask one yes/no question, then your partner asks one.</li>
      <li>Cross out the people it can't be.</li>
      <li>Do you know your partner's person? Make a guess – but if you're wrong, you lose!</li>
      <li>Speak English only. If you speak German, you miss your next question.</li>
    </ol>`);
}

/* --- Events --- */
document.addEventListener("click", e => {
  const t = e.target.closest("[data-act]");
  if (!t) return;
  switch (t.dataset.act){
    case "home": S = store.fresh(); save(); go("home"); break;
    case "new": go("choosemode"); break;
    case "mode": S.pendingMode = t.dataset.mode; go("newgame"); break;
    case "join": go("join"); break;
    case "level": S = { ...store.fresh(), code: codeFor(parseInt(t.dataset.level, 10), S.pendingMode), player: 1 }; go("code"); break;
    case "toIntro": go("intro"); break;
    case "doJoin": doJoin(); break;
    case "start": go("play"); break;
    case "pick": pick(+t.dataset.idx); break;
    case "cross": e.stopPropagation(); cross(+t.dataset.idx); break;
    case "guess": guess(); break;
    case "confirmGuess": closeSheet(); endVersus(R.selected === R.theirs ? "found" : "wrong"); break;
    case "partnerGuessed": partnerGuessed(); break;
    case "partnerRight": closeSheet(); endVersus("partnerFound"); break;
    case "partnerWrongBtn": closeSheet(); endVersus("partnerWrong"); break;
    case "partnerFound": endRoundDescriber(); break;
    case "oops": S.penalties++; save(); toast(`−${CONFIG.germanPenalty} ★ – keep going in English!`); break;
    case "oopsVs": toast("Oops! You miss your next question."); break;
    case "next": nextRound(); break;
    case "restart": S = store.fresh(); save(); go("home"); break;
    case "phrases": phrases(); break;
    case "howto": howto(); break;
    case "closeSheet": closeSheet(); break;
    case "quit": confirmQuit(); break;
    case "doQuit": closeSheet(); S = store.fresh(); save(); go("home"); break;
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && sheetOpen()){ closeSheet(); return; }
  const card = e.target.closest && e.target.closest(".suspect");
  if (card && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); pick(+card.dataset.idx); }
});

render();
