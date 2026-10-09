import { test } from "node:test";
import assert from "node:assert/strict";
import { NUM, TEXT, MERKSAETZE, ROLLE_REIHENFOLGE, AUSSAGEN, QUELLE, SPIELBELEGE } from "../im-rhythmus-des-nils/content.js";
import { PHASES, nextPhase, sowable, harvest, supply, simulate, seasonsKnown, verloren } from "../im-rhythmus-des-nils/sim.js";
import { scene, villageView, LEVEL, groundY, waterReach } from "../im-rhythmus-des-nils/scene.js";

function walk(flags){
  const seen = [];
  let cur = { year: 1, phase: "sirius" };
  while (cur){ seen.push(cur.year + ":" + cur.phase); cur = nextPhase(cur.year, cur.phase, flags); assert.ok(seen.length < 40); }
  return seen;
}

test("Ablauf: Phasen hängen von den Entscheidungen ab", () => {
  const dorf = walk({ schaduf: "bauen", dorf: "dorf" });
  assert.ok(dorf.includes("2:schaduf") && dorf.includes("2:dorfbau") && dorf.includes("3:vermessen") && dorf.includes("3:beruf"));
  const allein = walk({ schaduf: "lassen", dorf: "allein" });
  assert.ok(!allein.includes("2:schaduf") && !allein.includes("2:dorfbau") && !allein.includes("3:vermessen"));
  const lost = walk({ dorf: "allein", verloren: true });
  assert.ok(lost.includes("3:verloren") && !lost.includes("3:beruf"));
  assert.equal(dorf[dorf.length - 1], "3:beruf");
});

test("Jahr 1: 12 Säcke geerntet, 10 gegessen, 2 in den Vorrat", () => {
  const { years } = simulate();
  assert.equal(years[1].harvest, 12);
  assert.equal(years[1].vorrat, 2);
  assert.equal(NUM.startVorrat, 0);
});

test("Jahr 2: nur Krüge + Schaduf + volles Schöpfen reicht gerade so", () => {
  assert.equal(simulate({ e1: "kruege", schaduf: "bauen", buckets: 6 }).years[2].status, "knapp");
  for (const c of [{ e1: "kruege", schaduf: "lassen" }, { e1: "kruege", schaduf: "bauen", buckets: 3 }, { e1: "wall", schaduf: "bauen", buckets: 6 }, { e1: "wall", schaduf: "lassen" }])
    assert.equal(simulate(c).years[2].status, "hunger", JSON.stringify(c));
  // Entscheidungen machen einen Unterschied
  assert.ok(simulate({ e1: "wall", schaduf: "lassen" }).years[2].hunger > simulate({ e1: "kruege", schaduf: "lassen" }).years[2].hunger);
});

test("Jahr 3: im Dorf hungert niemand, allein schon – und nach zwei Hungerjahren ist das Spiel verloren", () => {
  for (const e1 of ["kruege", "wall"]) for (const schaduf of ["bauen", "lassen"]){
    const d = simulate({ e1, schaduf, dorf: "dorf" });
    assert.equal(d.years[3].hunger, 0);
    assert.equal(d.verloren, false);
    const a = simulate({ e1, schaduf, dorf: "allein" });
    assert.ok(a.years[3].hunger > 0);
    assert.equal(a.verloren, a.hunger[2]);
  }
  assert.equal(simulate({ e1: "kruege", schaduf: "bauen", buckets: 6, dorf: "allein" }).verloren, false);
  assert.equal(verloren({ 1: false, 2: true, 3: true }), true);
  assert.equal(verloren({ 1: false, 2: true, 3: false }), false);
});

test("Jahr 2: oberes Feld bleibt trocken, mittleres nur mit Schaduf", () => {
  assert.equal(sowable(2, 2, 99), false);
  assert.equal(sowable(2, 1, 0), false);
  assert.equal(sowable(2, 1, NUM.schadufHalb), true);
  assert.ok(harvest(2, [true, true, true], NUM.schadufVoll) > harvest(2, [true, true, true], NUM.schadufHalb));
  assert.equal(supply(0, 0, 0).hunger, NUM.bedarf);
});

test("Kalender: Jahreszeiten werden in Jahr 1 erst nach und nach benannt", () => {
  assert.equal(seasonsKnown(1, "sirius", 1), 0);
  assert.equal(seasonsKnown(1, "aussaat", 5), 1);
  assert.equal(seasonsKnown(1, "brache", 10), 2);
  assert.equal(seasonsKnown(1, "jahresende", 12), 3);
  assert.equal(seasonsKnown(2, "sirius", 1), 3);
});

test("Wasser: Jahr 1 bedeckt alle Felder, aber nicht den Hof; Deich hält das Hochwasser auf", () => {
  assert.ok(groundY(700) > LEVEL.gut && groundY(900) < LEVEL.gut);
  assert.ok(groundY(450) < LEVEL.niedrig && groundY(250) > LEVEL.niedrig);
  assert.ok(waterReach(LEVEL.hoch) > 1000);
  assert.ok(waterReach(LEVEL.hoch, { x0: 792, top: 226 }) < 820);
});

test("Szenen und Dorfansicht lassen sich zeichnen", () => {
  assert.match(scene({ sky: "dawn", fields: [{ soil: "schlamm" }, { soil: "gepflueg", plants: "reif" }, { soil: "trocken" }], hof: { fill: 0.5 }, hot: [{ id: "f0" }, { id: "schaduf" }] }), /^<svg/);
  assert.match(scene({ village: { dike: true }, water: { level: LEVEL.hoch, kind: "flut" }, ghost: LEVEL.hoch, shaduf: { t: 1 } }), /ohne Deich/);
  assert.match(villageView({ mine: "toepfer" }), /deine Familie/);
});

test("Texte: Merksätze vollständig; Quellencheck: jede Aussage im Lied hat eine Stelle", () => {
  assert.deepEqual([...ROLLE_REIHENFOLGE].sort(), Object.keys(MERKSAETZE).sort());
  assert.ok(AUSSAGEN.some(a => a.imLied) && AUSSAGEN.some(a => !a.imLied));
  for (const a of AUSSAGEN) if (a.imLied) assert.ok(a.stelle >= 0 && a.stelle < QUELLE.bloecke.length, a.text);
  if (QUELLE.placeholder) assert.ok(QUELLE.bloecke.every(b => b.text.startsWith("[Platzhalter")));
  assert.equal(TEXT.achet[2].monate.length, 4);
  assert.ok(SPIELBELEGE.alleinZerstoert && TEXT.verloren.nochmal);
});
