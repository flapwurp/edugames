import { test } from "node:test";
import assert from "node:assert/strict";
import { GAME, REASONS, NOTES, EVENTS, AUSSAGEN, QUELLE } from "../im-rhythmus-des-nils/content.js";
import { floodOf, evaluateYear, bestHarvest, supplyYear1, supplyYear2, dorfResult } from "../im-rhythmus-des-nils/sim.js";

test("Jahr 1 ist immer gut, Jahr 2 immer niedrig oder hoch, beide kommen vor", () => {
  const seen = new Set();
  for (let c = 1000; c < 2000; c++){
    assert.equal(floodOf(c, 1), "gut");
    const f = floodOf(c, 2);
    assert.ok(["niedrig", "hoch"].includes(f));
    seen.add(f);
  }
  assert.deepEqual([...seen].sort(), ["hoch", "niedrig"]);
});

test("gleicher Code = gleiche Flut", () => {
  assert.equal(floodOf(1234, 2), floodOf(1234, 2));
});

test("jedes Jahr ist mit guter Planung ohne Hunger zu schaffen – auch ohne Hilfe des Dorfes", () => {
  for (const flood of ["gut", "niedrig", "hoch"])
    assert.ok(bestHarvest(flood) >= GAME.need, `${flood}: ${bestHarvest(flood)}`);
});

test("Gemeinschaftsarbeit lohnt sich im passenden Jahr", () => {
  assert.ok(bestHarvest("niedrig", { kanal: true }) > bestHarvest("niedrig"));
});

test("wer in Jahr 2 einfach wie in Jahr 1 sät, bekommt Probleme", () => {
  const wieJahr1 = ["u1", "u2", "m1", "m2"];
  assert.ok(evaluateYear({ flood: "gut", targets: wieJahr1 }).total >= GAME.need);
  assert.ok(evaluateYear({ flood: "niedrig", targets: wieJahr1 }).total < GAME.need);
  assert.ok(evaluateYear({ flood: "hoch", targets: wieJahr1 }).total < GAME.need);
  assert.ok(evaluateYear({ flood: "hoch", targets: wieJahr1, dorf: { deich: true } }).total >= GAME.need);
});

test("Felder am Wüstenrand brauchen den Graben", () => {
  const ohne = evaluateYear({ flood: "gut", targets: ["r1", "r2"] });
  assert.equal(ohne.total, 0);
  assert.ok(ohne.fields.every(f => !f.sown || f.reason === "trocken"));
  const mit = evaluateYear({ flood: "gut", targets: ["r1", "r2", "graben"] });
  assert.ok(mit.total > 0);
});

test("Rückmeldungen und Belegkarten haben alle einen Text", () => {
  for (const flood of ["gut", "niedrig", "hoch"]){
    for (const dorf of [{}, { deich: true, kanal: true }]){
      const r = evaluateYear({ flood, targets: ["u1", "m1", "r1", "graben", "schaduf"], dorf });
      for (const f of r.fields) if (f.sown) assert.ok(REASONS[f.reason], f.reason);
      for (const n of r.notes) assert.ok(NOTES[n], n);
    }
  }
  for (const [area, text] of Object.values(EVENTS)){
    assert.ok(["natur", "arbeit", "gesellschaft"].includes(area));
    assert.ok(text.length > 0);
  }
});

test("Versorgung: Vorrat und Dorfspeicher fangen ein schlechtes Jahr auf", () => {
  assert.deepEqual(supplyYear1(16), { surplus: 8, help: 0, hunger: 0 });
  const s = supplyYear2({ harvest: 4, own: 4, village: 9, hofNass: false });
  assert.equal(s.fromOwn, 4);
  assert.equal(s.help, 0);
  assert.equal(s.status, "vorrat");
  const h = supplyYear2({ harvest: 4, own: 4, village: 9, hofNass: true });
  assert.equal(h.lost, 2);
  assert.ok(h.help > 0);
  const leer = supplyYear2({ harvest: 0, own: 0, village: 3, hofNass: false });
  assert.equal(leer.status, "hunger");
});

test("Dorf-Entscheidung wird übernommen", () => {
  assert.deepEqual(dorfResult(["deich", "hof"]), { deich: true, kanal: false, extraGrain: 1 });
  assert.deepEqual(dorfResult(["hof", "hof"]), { deich: false, kanal: false, extraGrain: 2 });
});

test("Quellencheck: Aussagen beider Arten, Platzhalter ist als solcher markiert", () => {
  assert.ok(AUSSAGEN.some(a => a.imLied) && AUSSAGEN.some(a => !a.imLied));
  if (QUELLE.placeholder) assert.ok(QUELLE.bloecke.every(b => b.text.startsWith("[Platzhalter")));
});
