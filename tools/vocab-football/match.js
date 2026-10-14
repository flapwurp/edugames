/* Vocab Football – Spiellogik ohne DOM (testbar in Node).

   Spielfeld: Der Ball steht auf einer Position von -2 bis +2 (0 = Mitte).
   Team 0 (links) spielt nach rechts (+), Team 1 (rechts) spielt nach links (-).
   Jede richtige Antwort bringt den Ball eine Position Richtung gegnerisches Tor.
   Steht der Ball schon auf ±2 vor dem gegnerischen Tor, gibt es statt eines Passes einen Torschuss.
   Daneben/gehalten: Ball bleibt liegen. Tor: Punkt, Anstoß in der Mitte. */

export const MAX_POS = 2;
export const attackDir = team => (team === 0 ? 1 : -1);

/* ---------- Vokabellisten lesen ---------- */

/* Trennzeichen in dieser Reihenfolge: Tabulator (Word/Excel-Tabelle), Semikolon, " = ", " – ", " - " */
const SEPARATORS = [/\s*;\s*/, /\s+=\s+/, /\s+[–—]\s+/, /\s+-\s+/];

function splitLine(line){
  if (line.includes("\t")){
    /* Tabelle: die ersten beiden gefüllten Spalten (weitere Spalten, z. B. Beispielsätze, werden ignoriert) */
    const cols = line.split("\t").map(s => s.trim()).filter(Boolean);
    return cols.length >= 2 ? [cols[0], cols[1]] : null;
  }
  for (const sep of SEPARATORS){
    const m = sep.exec(line);
    if (m && m.index > 0){
      const a = line.slice(0, m.index).trim(), b = line.slice(m.index + m[0].length).trim();
      if (a && b) return [a, b];
    }
  }
  return null;
}

/* text: eine Vokabel pro Zeile. first: "en" oder "de" (was vorne steht).
   Gibt { items: [{ en, de }], skipped: [Zeilen, die nicht lesbar waren] } zurück. */
export function parseList(text, first = "en"){
  const items = [], skipped = [];
  for (const raw of String(text || "").split(/\r?\n/)){
    const line = raw.replace(/ /g, " ").trim();
    if (!line || line.startsWith("#")) continue;
    const parts = splitLine(line);
    if (!parts){ skipped.push(line); continue; }
    const [a, b] = parts;
    items.push(first === "de" ? { en: b, de: a } : { en: a, de: b });
  }
  return { items, skipped };
}

/* ---------- Stapel ---------- */

function shuffle(arr, rng){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* direction: "en-de" (englisches Wort zeigen, deutsch schreiben), "de-en" oder "mixed".
   avoidFirst: Karte, die nicht direkt wieder vorne liegen soll (beim Neumischen). */
export function makeDeck(items, direction, rng = Math.random, avoidFirst = null){
  let cards = shuffle(items, rng).map(it => {
    const d = direction === "mixed" ? (rng() < 0.5 ? "en-de" : "de-en") : direction;
    return d === "en-de"
      ? { prompt: it.en, answer: it.de, dir: "en-de" }
      : { prompt: it.de, answer: it.en, dir: "de-en" };
  });
  if (avoidFirst && cards.length > 1 && cards[0].prompt === avoidFirst.prompt && cards[0].answer === avoidFirst.answer){
    [cards[0], cards[1]] = [cards[1], cards[0]];
  }
  return cards;
}

/* ---------- Spielstand ---------- */

/* phase: "question" – Wort steht, Teams schreiben
          "kick"     – richtige Antwort, Schütze wischt den Ball (Pass)
          "shot"     – richtige Antwort, Schütze schießt aufs Tor
          "result"   – Wort erledigt, Wechsel ansagen, dann nächstes Wort */
export function newMatch(items, direction, rng = Math.random){
  if (!items.length) throw new Error("empty list");
  return {
    pos: 0, ballY: 0, score: [0, 0], phase: "question", team: null,
    outcome: null, deck: makeDeck(items, direction, rng), idx: 0, words: 0,
    direction, history: [],
  };
}

export const currentCard = s => s.deck[s.idx];

const HISTORY_MAX = 40;
function snap(s){
  const { history, ...rest } = s;
  const h = history.concat([JSON.stringify(rest)]);
  return h.length > HISTORY_MAX ? h.slice(h.length - HISTORY_MAX) : h;
}

/* Lehrkraft: richtige Antwort von team (0/1). */
export function correct(s, team){
  if (s.phase !== "question") return s;
  const shot = s.pos === MAX_POS * attackDir(team);
  return { ...s, history: snap(s), phase: shot ? "shot" : "kick", team, outcome: null };
}

/* Lehrkraft: niemand wusste es – Lösung zeigen, weiter. */
export function skip(s){
  if (s.phase !== "question") return s;
  return { ...s, history: snap(s), phase: "result", team: null, outcome: "skip" };
}

/* Schütze hat den Pass gewischt. lateral: -1…1, verschiebt den Ball ein wenig nach oben/unten (nur Optik). */
export function kick(s, lateral = 0){
  if (s.phase !== "kick") return s;
  const ballY = clamp(s.ballY * 0.4 + lateral * 0.6, -1, 1);
  return { ...s, history: snap(s), phase: "result", pos: s.pos + attackDir(s.team), ballY, outcome: "pass" };
}

/* Schütze hat aufs Tor geschossen. outcome: "goal" | "saved" | "wide" | "post" */
export function shot(s, outcome){
  if (s.phase !== "shot") return s;
  const next = { ...s, history: snap(s), phase: "result", outcome };
  if (outcome === "goal"){
    next.score = s.score.slice();
    next.score[s.team] += 1;
    next.pos = 0;
    next.ballY = 0;
  }
  return next;
}

/* Nächstes Wort. Ist der Stapel durch, wird neu gemischt. */
export function nextWord(s, items, rng = Math.random){
  if (s.phase !== "result") return s;
  const base = { ...s, history: snap(s), phase: "question", team: null, outcome: null, words: s.words + 1 };
  if (s.idx + 1 < s.deck.length) return { ...base, idx: s.idx + 1 };
  return { ...base, idx: 0, deck: makeDeck(items, s.direction, rng, currentCard(s)) };
}

export const canUndo = s => s.history.length > 0;
export function undo(s){
  if (!s.history.length) return s;
  const prev = JSON.parse(s.history[s.history.length - 1]);
  return { ...prev, history: s.history.slice(0, -1) };
}

/* ---------- Torschuss ---------- */

/* Geometrie des Spielfelds (SVG-Einheiten). Wird auch von app.js zum Zeichnen benutzt. */
export const PITCH = {
  w: 1000, h: 560, cy: 280,
  lineL: 60, lineR: 940,          // Torlinien
  goalHalf: 105,                  // halbe Torhöhe
  ballR: 17,
  step: 150,                      // Abstand der Ballpositionen
  wander: 55,                     // wie weit der Ball nach oben/unten wandern darf
};
export const ballX = pos => PITCH.w / 2 + pos * PITCH.step;
export const ballYpx = y => PITCH.cy + y * PITCH.wander;

/* Torwart: Er pendelt im Tor hin und her (keeperY). Wird geschossen, hechtet er nach kurzer
   Reaktionszeit (react) mit begrenzter Geschwindigkeit (dive) in Richtung Ball.
   Schüsse in die Mitte hält er fast immer, Schüsse in die Ecke, in der er gerade nicht steht, kaum.
   Zu genau auf den Pfosten zielen ist riskant (Pfosten/daneben). */
export function keeperY(t, k){
  return PITCH.cy + PITCH.goalHalf * k.swing * Math.sin((2 * Math.PI * t) / k.period);
}
export const keeperHalf = k => PITCH.goalHalf * k.size;

/* Wo der Torwart steht, wenn der Ball ankommt (Schuss zur Zeit tShot, Flugzeit flight, Ziel yAtLine) */
export function keeperAt(yAtLine, tShot, flight, k){
  const y0 = keeperY(tShot, k), d = yAtLine - y0;
  const move = Math.min(Math.abs(d), k.dive * Math.max(0, flight - k.react));
  return y0 + Math.sign(d) * move;
}

/* Schuss auswerten.
   from: {x, y} Ballposition, vec: {x, y} Wischrichtung, attackRight: true, wenn aufs rechte Tor geschossen wird,
   tShot: Zeitpunkt des Schusses (s, gleiche Uhr wie keeperY), flight: Flugzeit (s), k: Torwart-Einstellung.
   Ergebnis: { outcome: "goal"|"saved"|"wide"|"post"|"wrongway", yAtLine, keeperEnd } */
export function resolveShot(from, vec, attackRight, tShot, flight, k){
  const lineX = attackRight ? PITCH.lineR : PITCH.lineL;
  const towards = attackRight ? vec.x : -vec.x;
  /* Ball muss klar Richtung Tor gehen (nicht nach hinten oder fast senkrecht) */
  if (towards <= 0 || Math.abs(vec.y) > towards * 4) return { outcome: "wrongway", yAtLine: null, keeperEnd: null };
  const yAtLine = from.y + ((lineX - from.x) * vec.y) / vec.x;
  const keeperEnd = keeperAt(yAtLine, tShot, flight, k);
  const off = Math.abs(yAtLine - PITCH.cy);
  if (off > PITCH.goalHalf + PITCH.ballR) return { outcome: "wide", yAtLine, keeperEnd };
  if (off > PITCH.goalHalf - PITCH.ballR * 0.6) return { outcome: "post", yAtLine, keeperEnd };
  if (Math.abs(yAtLine - keeperEnd) < keeperHalf(k) + PITCH.ballR * 0.5) return { outcome: "saved", yAtLine, keeperEnd };
  return { outcome: "goal", yAtLine, keeperEnd };
}

/* Flugzeit des Balls aus der Wischgeschwindigkeit (px/ms auf dem Bildschirm): schneller wischen = schnellerer Ball. */
export const flightTime = speed => clamp(0.75 - speed * 0.18, 0.32, 0.75);

function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
