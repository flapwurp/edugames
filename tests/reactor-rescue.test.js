import { test } from "node:test";
import assert from "node:assert/strict";
import { CONFIG } from "../reactor-rescue/content.js";
import { makeReactor, sameArr } from "../reactor-rescue/rules.js";
import { manualHTML } from "../reactor-rescue/manual.js";

const levels = Object.keys(CONFIG.levels).map(Number);
const allReactors = function* (){
  for (const lv of levels) for (let c = lv * 1000; c < lv * 1000 + 1000; c++)
    for (let r = 1; r <= CONFIG.roundsPerGame; r++) yield [c, r];
};

test("the same code always builds the same reactor", () => {
  for (const [c, r] of allReactors())
    assert.deepEqual(makeReactor(c, r), makeReactor(c, r));
});

test("every reactor can be solved", () => {
  for (const [c, r] of allReactors()){
    const d = makeReactor(c, r);
    assert.ok(d.solution.wire >= 0 && d.solution.wire < d.wires.length, `wire ${c}/${r}`);
    assert.equal(d.solution.levers.length, d.levers.length, `levers ${c}/${r}`);
    assert.ok(!sameArr(d.levers, d.solution.levers), `levers already correct ${c}/${r}`);
    assert.match(d.solution.code, /^\d{4}$/, `code ${c}/${r}`);
  }
});

test("the manual can be built for every level", () => {
  for (const lv of levels) assert.ok(manualHTML(lv).length > 2000);
});
