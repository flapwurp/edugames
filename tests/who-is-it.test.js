import { test } from "node:test";
import assert from "node:assert/strict";
import { CONFIG } from "../who-is-it/content.js";
import { makeRound, makeBoard, modeOf, codeFor, lookKey, avatarSVG, FEATURE_KEYS } from "../who-is-it/people.js";

const levels = Object.keys(CONFIG.levels).map(Number);
const teamCodes = function* (){ for (const lv of levels) for (let c = lv * 1000; c < lv * 1000 + 500; c++) yield [lv, c]; };
const versusCodes = function* (){ for (const lv of levels) for (let c = lv * 1000 + 500; c < lv * 1000 + 1000; c++) yield [lv, c]; };

test("team game: right number of people, all looking different", () => {
  for (const [lv, c] of teamCodes()) for (let r = 1; r <= CONFIG.roundsPerGame; r++){
    const { people, target } = makeRound(c, r);
    assert.equal(people.length, CONFIG.levels[lv].suspects);
    assert.ok(target >= 0 && target < people.length);
    assert.equal(new Set(people.map(lookKey)).size, people.length, `look-alikes in ${c}/${r}`);
  }
});

test("versus: right board size, all different, two different secret people", () => {
  for (const [lv, c] of versusCodes()) for (let r = 1; r <= CONFIG.roundsPerGame; r++){
    const { people, secrets } = makeBoard(c, r);
    assert.equal(people.length, CONFIG.levels[lv].board);
    assert.equal(new Set(people.map(lookKey)).size, people.length, `look-alikes in ${c}/${r}`);
    assert.notEqual(secrets[0], secrets[1]);
    for (const s of secrets) assert.ok(s >= 0 && s < people.length);
  }
});

test("the same code always gives the same round (both devices see the same)", () => {
  assert.deepEqual(makeRound(2345, 3), makeRound(2345, 3));
  assert.deepEqual(makeBoard(3712, 2), makeBoard(3712, 2));
});

test("the code tells the mode", () => {
  for (const lv of levels) for (const m of ["team", "versus"]) for (const rnd of [0, 0.5, 0.999]){
    const c = codeFor(lv, m, rnd);
    assert.equal(modeOf(c), m);
    assert.equal(Math.floor(c / 1000), lv);
  }
});

/* Pupils noticed: the searched person was always the "typical" one, never the odd one out.
   This checks that the searched person is not more typical than the others. */
test("fair: the searched person is not more typical than the others", () => {
  for (const lv of levels){
    let sum = 0, n = 0;
    for (let c = lv * 1000; c < lv * 1000 + 500; c++) for (let r = 1; r <= CONFIG.roundsPerGame; r++){
      const { people, target } = makeRound(c, r);
      const typ = people.map(p => FEATURE_KEYS.reduce((s, k) => s + people.filter(q => q !== p && q[k] === p[k]).length, 0));
      const t = typ[target];
      sum += (typ.filter(x => x < t).length + 0.5 * (typ.filter(x => x === t).length - 1)) / (people.length - 1);
      n++;
    }
    const mean = sum / n;
    assert.ok(mean > 0.44 && mean < 0.56, `level ${lv}: searched person typicality ${mean.toFixed(2)} (fair = 0.5)`);
  }
});

test("people can be drawn", () => {
  const { people } = makeBoard(4600, 1);
  for (const p of people) assert.match(avatarSVG(p), /^<svg/);
});

/* Every question should rule out a group: no look belongs to only one person,
   and every look of a differing feature is shared by at least a quarter of the people. */
test("no unique looks: every look is shared by at least a quarter of the people", () => {
  const visible = p => ({ ...p, hairColour: p.hairStyle === "bald" && p.facialHair === "none" ? "-" : p.hairColour });
  const check = (people, where) => {
    const min = Math.max(2, Math.ceil(people.length / 4));
    for (const k of FEATURE_KEYS){
      const counts = {};
      people.forEach(p => { const v = visible(p)[k]; counts[v] = (counts[v] || 0) + 1; });
      const looks = Object.entries(counts);
      if (looks.length < 2) continue;
      for (const [v, n] of looks) assert.ok(n >= min, `${where}: "${k} = ${v}" only ${n}× of ${people.length}`);
    }
  };
  for (const [, c] of teamCodes()) for (let r = 1; r <= CONFIG.roundsPerGame; r++) check(makeRound(c, r).people, `${c}/${r}`);
  for (const [, c] of versusCodes()) for (let r = 1; r <= CONFIG.roundsPerGame; r++) check(makeBoard(c, r).people, `${c}/${r}`);
});
