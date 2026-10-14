import { test } from "node:test";
import assert from "node:assert/strict";
import { CONFIG, COLOURS } from "../spot-the-difference/content.js";
import { makeRound, hitTest, sentence, luminance, MIN_COLOUR_CONTRAST, MAX_PER_TYPE, SCENES } from "../spot-the-difference/spot.js";

const LEVELS = Object.keys(CONFIG.levels).map(Number);
function* allRounds(step = 1){
  for (const lv of LEVELS) for (let c = lv * 1000; c < lv * 1000 + 1000; c += step)
    for (let r = 1; r <= CONFIG.roundsPerGame; r++) yield [lv, c, r];
}

test("the same code always gives the same two pictures", () => {
  assert.deepEqual(makeRound(2345, 1), makeRound(2345, 1));
  assert.notDeepEqual(makeRound(2345, 1), makeRound(2345, 2));
});

test("every round has the right number of differences, one per thing", () => {
  for (const [lv, c, r] of allRounds()){
    const R = makeRound(c, r);
    assert.equal(R.diffs.length, CONFIG.levels[lv].differences, `code ${c}/${r}`);
    assert.equal(new Set(R.diffs.map(d => d.id)).size, R.diffs.length, `two differences on one thing in ${c}/${r}`);
    const types = R.diffs.map(d => d.type);
    for (const t of ["place", "number", "activity"]) assert.ok(types.includes(t), `no ${t} difference in ${c}/${r}`);
    for (const t of new Set(types)) assert.ok(types.filter(x => x === t).length <= MAX_PER_TYPE, `too many ${t} in ${c}/${r}`);
  }
});

test("the pictures differ exactly where the differences are", () => {
  for (const [, c, r] of allRounds(7)){
    const R = makeRound(c, r);
    const diffIds = new Set(R.diffs.map(d => d.id));
    for (const id of Object.keys(R.a)){
      const same = JSON.stringify(R.a[id]) === JSON.stringify(R.b[id]);
      assert.equal(!same, diffIds.has(id), `${id} in ${c}/${r}`);
    }
  }
});

test("only one thing per place, and only things that fit there", () => {
  for (const [, c, r] of allRounds(3)){
    const R = makeRound(c, r);
    const { art } = SCENES[R.scene];
    for (const p of [R.a, R.b]){
      const slots = Object.entries(p).filter(([, s]) => s && s.slot);
      assert.equal(new Set(slots.map(([, s]) => s.slot)).size, slots.length, `two things in one place in ${c}/${r}`);
      for (const [id, s] of slots) assert.ok(art.SLOTS[s.slot].allow.includes(id), `${id} ${s.slot}`);
    }
  }
});

test("colour differences are easy to see (also with colour vision deficiency)", () => {
  assert.ok(!("red" in COLOURS) && !("green" in COLOURS));
  for (const [, c, r] of allRounds(3)){
    const R = makeRound(c, r);
    for (const d of R.diffs.filter(d => d.type === "colour" || d.type === "hatColour")){
      const key = d.type === "colour" ? "colour" : "hat";
      const diff = Math.abs(luminance(R.a[d.id][key]) - luminance(R.b[d.id][key]));
      assert.ok(diff >= MIN_COLOUR_CONTRAST, `${d.id} in ${c}/${r}`);
    }
  }
});

test("every difference can be found by tapping it – on both pictures", () => {
  for (const [, c, r] of allRounds(2)){
    const R = makeRound(c, r);
    R.diffs.forEach((d, i) => {
      const ok = d.boxes.some(b => {
        for (let fx = 0.2; fx <= 0.8; fx += 0.3) for (let fy = 0.2; fy <= 0.8; fy += 0.3){
          if (hitTest(R, b.x + b.w * fx, b.y + b.h * fy, new Set()) === i) return true;
        }
        return false;
      });
      assert.ok(ok, `${d.type} on ${d.id} cannot be tapped in ${c}/${r}`);
    });
  }
});

test("a tap on the empty wall finds nothing", () => {
  const R = makeRound(1500, 1);
  assert.equal(hitTest(R, 700, 380, new Set()), null);
});

test("both pictures can be drawn and every difference has two sentences", () => {
  for (const [, c, r] of allRounds(37)){
    const R = makeRound(c, r);
    const { art } = SCENES[R.scene];
    for (const p of [R.a, R.b]){
      const svg = art.drawPicture(p);
      assert.ok(!/undefined|NaN/.test(svg), `drawing ${c}/${r}`);
    }
    for (const d of R.diffs){
      const s1 = sentence(R, d, 1), s2 = sentence(R, d, 2);
      assert.match(s1, /^In my picture .+\.$/);
      assert.ok(!/undefined|null/.test(s1 + s2), `${s1} / ${s2}`);
      assert.notEqual(s1, s2, `${d.type} ${d.id} in ${c}/${r}`);
    }
  }
});
