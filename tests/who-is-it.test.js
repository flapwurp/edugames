import { test } from "node:test";
import assert from "node:assert/strict";
import { CONFIG } from "../who-is-it/content.js";
import { makeRound, lookKey, avatarSVG } from "../who-is-it/people.js";

test("every round has the right number of people, all looking different", () => {
  for (const lv of Object.keys(CONFIG.levels).map(Number)){
    for (let c = lv * 1000; c < lv * 1000 + 1000; c++){
      for (let r = 1; r <= CONFIG.roundsPerGame; r++){
        const { people, target } = makeRound(c, r);
        assert.equal(people.length, CONFIG.levels[lv].suspects);
        assert.ok(target >= 0 && target < people.length);
        assert.equal(new Set(people.map(lookKey)).size, people.length, `look-alikes in ${c}/${r}`);
      }
    }
  }
});

test("the same code always gives the same round", () => {
  assert.deepEqual(makeRound(2345, 3), makeRound(2345, 3));
});

test("people can be drawn", () => {
  const { people } = makeRound(1234, 1);
  for (const p of people) assert.match(avatarSVG(p), /^<svg/);
});
