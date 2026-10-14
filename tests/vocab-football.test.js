import { test } from "node:test";
import assert from "node:assert/strict";
import { LISTS, CONFIG } from "../tools/vocab-football/content.js";
import {
  parseList, makeDeck, newMatch, correct, skip, kick, shot, nextWord, undo, canUndo, currentCard,
  resolveShot, keeperY, PITCH, ballX, MAX_POS,
} from "../tools/vocab-football/match.js";

/* deterministischer Zufall für Tests */
function rngFrom(seed){ let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }

test("every list in content.js can be read completely", () => {
  for (const L of LISTS){
    const { items, skipped } = parseList(L.words, L.first || CONFIG.firstColumn);
    assert.ok(items.length >= 5, `${L.name}: too few words`);
    assert.deepEqual(skipped, [], `${L.name}: unreadable lines`);
  }
});

test("lists: tab, semicolon, = and dashes work; extra table columns are ignored", () => {
  const { items, skipped } = parseList(
    "cinema\tKino\tWe went to the cinema.\n\tbread\tBrot\nthe car ; das Auto\nhouse = Haus\nwell-known – bekannt\n" +
    "to look after - sich kümmern um\n# heading\n\njust one column", "en");
  assert.deepEqual(items, [
    { en: "cinema", de: "Kino" }, { en: "bread", de: "Brot" }, { en: "the car", de: "das Auto" },
    { en: "house", de: "Haus" }, { en: "well-known", de: "bekannt" }, { en: "to look after", de: "sich kümmern um" },
  ]);
  assert.deepEqual(skipped, ["just one column"]);
});

test("lists: German first is swapped; only the first semicolon separates", () => {
  const { items } = parseList("leihen ; to borrow; to lend", "de");
  assert.deepEqual(items, [{ en: "to borrow; to lend", de: "leihen" }]);
});

test("deck: every word once, right direction", () => {
  const { items } = parseList(LISTS[0].words);
  for (const dir of ["en-de", "de-en"]){
    const deck = makeDeck(items, dir, rngFrom(1));
    assert.equal(deck.length, items.length);
    for (const c of deck) assert.equal(c.dir, dir);
    const prompts = new Set(deck.map(c => c.prompt));
    assert.equal(prompts.size, items.length);
  }
  const mixed = makeDeck(items, "mixed", rngFrom(3));
  assert.ok(mixed.some(c => c.dir === "en-de") && mixed.some(c => c.dir === "de-en"));
});

test("ball moves one step per correct answer, third step is a shot", () => {
  const { items } = parseList(LISTS[0].words);
  let s = newMatch(items, "en-de", rngFrom(2));
  for (let i = 0; i < MAX_POS; i++){
    s = correct(s, 0); assert.equal(s.phase, "kick");
    s = kick(s, 0.2); assert.equal(s.pos, i + 1);
    s = nextWord(s, items, rngFrom(9));
  }
  s = correct(s, 0); assert.equal(s.phase, "shot");
  s = shot(s, "saved"); assert.equal(s.pos, MAX_POS); assert.deepEqual(s.score, [0, 0]);
  s = nextWord(s, items);
  s = correct(s, 1); assert.equal(s.phase, "kick");         // Gegner spielt zurück
  s = kick(s); assert.equal(s.pos, MAX_POS - 1);
  s = nextWord(s, items);
  s = correct(s, 0); s = kick(s); s = nextWord(s, items);   // wieder vor dem Tor
  s = correct(s, 0); assert.equal(s.phase, "shot");
  s = shot(s, "goal"); assert.deepEqual(s.score, [1, 0]); assert.equal(s.pos, 0);
});

test("team 1 attacks to the left", () => {
  const { items } = parseList(LISTS[0].words);
  let s = newMatch(items, "en-de");
  s = kick(correct(s, 1)); assert.equal(s.pos, -1);
  s = kick(correct(nextWord(s, items), 1)); assert.equal(s.pos, -2);
  s = correct(nextWord(s, items), 1); assert.equal(s.phase, "shot");
});

test("undo goes back step by step, wrong clicks in the wrong phase change nothing", () => {
  const { items } = parseList(LISTS[0].words);
  let s = newMatch(items, "en-de");
  assert.equal(canUndo(s), false);
  const first = currentCard(s);
  assert.equal(kick(s), s);                 // kein Pass ohne richtige Antwort
  s = correct(s, 0);
  assert.equal(correct(s, 1), s);           // zweites "richtig" wird ignoriert
  s = kick(s);
  s = nextWord(s, items);
  s = undo(s); assert.equal(s.phase, "result"); assert.equal(s.pos, 1);
  s = undo(s); assert.equal(s.phase, "kick"); assert.equal(s.pos, 0);
  s = undo(s); assert.equal(s.phase, "question"); assert.equal(s.team, null);
  assert.deepEqual(currentCard(s), first);
  assert.equal(canUndo(s), false);
});

test("after the last word the deck is shuffled again without repeating the last word first", () => {
  const items = parseList("a;A\nb;B\nc;C").items;
  for (let seed = 1; seed < 40; seed++){
    let s = newMatch(items, "en-de", rngFrom(seed));
    for (let i = 0; i < 3; i++){ s = skip(s); if (i < 2) s = nextWord(s, items, rngFrom(seed + 100)); }
    const last = currentCard(s);
    s = nextWord(s, items, rngFrom(seed + 7));
    assert.equal(s.idx, 0);
    assert.notDeepEqual(currentCard(s), last);
  }
});

test("shots: backwards is no shot, far off is wide, straight at a central keeper is saved", () => {
  const k = CONFIG.keeper.normal;
  const from = { x: ballX(MAX_POS), y: PITCH.cy };
  assert.equal(resolveShot(from, { x: -1, y: 0 }, true, 0, 0.45, k).outcome, "wrongway");
  assert.equal(resolveShot(from, { x: 1, y: 3 }, true, 0, 0.45, k).outcome, "wide");
  /* t = 0: Torwart steht in der Mitte */
  assert.equal(keeperY(0, k), PITCH.cy);
  assert.equal(resolveShot(from, { x: 1, y: 0 }, true, 0, 0.45, k).outcome, "saved");
  /* Torwart pendelt nach unten (t = period/4), Schuss oben in die Ecke */
  const t = k.period / 4;
  assert.ok(keeperY(t, k) > PITCH.cy);
  const aimY = PITCH.cy - PITCH.goalHalf * 0.75;
  const vec = { x: PITCH.lineR - from.x, y: aimY - from.y };
  const r = resolveShot(from, vec, true, t, 0.45, k);
  assert.equal(r.outcome, "goal");
  assert.ok(r.keeperEnd < keeperY(t, k), "keeper dives towards the ball");
  /* gespiegelt aufs linke Tor */
  const fromL = { x: ballX(-MAX_POS), y: PITCH.cy };
  assert.equal(resolveShot(fromL, { x: PITCH.lineL - fromL.x, y: aimY - fromL.y }, false, t, 0.45, k).outcome, "goal");
});

/* Grobe Simulation mit Streuung: Wer in die freie Ecke zielt, trifft meistens; wer in die Mitte schießt, selten.
   So entscheidet das Wischen mit, aber ein Fehlschuss kostet nur eine Runde. */
test("keeper levels: aiming pays off, but not too much", () => {
  const rng = rngFrom(42);
  const gauss = () => { let u = 0; for (let i = 0; i < 6; i++) u += rng(); return (u - 3) / Math.sqrt(0.5); };
  const rate = (k, mode) => {
    let goals = 0; const N = 6000;
    for (let i = 0; i < N; i++){
      const t = rng() * 10;
      const from = { x: ballX(MAX_POS), y: PITCH.cy };
      const ky = keeperY(t, k);
      const target = mode === "smart" ? PITCH.cy + (ky > PITCH.cy ? -1 : 1) * PITCH.goalHalf * 0.72 : PITCH.cy;
      const aim = target + gauss() * PITCH.goalHalf * 0.25;
      if (resolveShot(from, { x: PITCH.lineR - from.x, y: aim - from.y }, true, t, 0.45, k).outcome === "goal") goals++;
    }
    return goals / N;
  };
  const easy = rate(CONFIG.keeper.easy, "smart"), normal = rate(CONFIG.keeper.normal, "smart"), hard = rate(CONFIG.keeper.hard, "smart");
  const centre = rate(CONFIG.keeper.normal, "centre");
  assert.ok(easy > normal && normal > hard, `${easy} ${normal} ${hard}`);
  assert.ok(normal > 0.6 && normal < 0.9, `normal ${normal}`);
  assert.ok(centre < 0.4, `centre ${centre}`);
});
