import { test } from "node:test";
import assert from "node:assert/strict";
import { NUM, TEXT, MERKSAETZE, ROLLE_REIHENFOLGE, AUSSAGEN, QUELLE, SPIELBELEGE } from "../im-rhythmus-des-nils/content.js";
import { PHASES, nextPhase, sowable, harvest, supply, simulate, seasonsKnown } from "../im-rhythmus-des-nils/sim.js";
import { scene, villageView, LEVEL, groundY, waterReach } from "../im-rhythmus-des-nils/scene.js";

test("Ablauf: drei Jahre, jede Phase hat einen Nachfolger, am Ende die Bilanz", () => {
  let cur = { year: 1, phase: "sirius" }, n = 0;
  while (cur){ n++; cur = nextPhase(cur.year, cur.phase); assert.ok(n < 40); }
  assert.equal(n, PHASES[1].length + PHASES[2].length + PHASES[3].length);
});

test("Jahr 1: normale Flut reicht für die Familie und es bleibt etwas übrig", () => {
  const y = simulate();
  assert.equal(y[1].status, "satt");
  assert.ok(y[1].vorrat > 0);
});

test("Jahr 2: nur mit Krügen und vollem Schaduf reicht es gerade so – sonst Hunger", () => {
  assert.equal(simulate({ e1: "kruege", buckets: NUM.schadufVoll })[2].status, "knapp");
  assert.equal(simulate({ e1: "kruege", buckets: NUM.schadufVoll })[2].vorrat, 0);
  assert.equal(simulate({ e1: "wall", buckets: NUM.schadufVoll })[2].status, "hunger");
  assert.equal(simulate({ e1: "kruege", buckets: NUM.schadufHalb })[2].status, "hunger");
  assert.equal(simulate({ e1: "kruege", buckets: 0 })[2].status, "hunger");
});

test("Jahr 2: oberes Feld bleibt trocken, mittleres nur mit Schaduf", () => {
  assert.equal(sowable(2, 2, 99), false);
  assert.equal(sowable(2, 1, 0), false);
  assert.equal(sowable(2, 1, NUM.schadufHalb), true);
  assert.ok(harvest(2, [true, true, true], NUM.schadufVoll) > harvest(2, [true, true, true], NUM.schadufHalb));
});

test("Jahr 3: Der Dorfspeicher versorgt die Familie in jedem Fall", () => {
  for (const e1 of ["kruege", "wall"]) for (const buckets of [0, 3, 6]){
    const y = simulate({ e1, buckets });
    assert.equal(y[3].hunger, 0, `${e1}/${buckets}`);
    assert.ok(y[3].help > 0);
  }
  assert.equal(supply(3, 0, 0, NUM.dorfspeicher).hunger, NUM.bedarf - NUM.dorfspeicher);
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

test("Texte: Merksätze vollständig, Quellencheck hat beide Arten, Platzhalter markiert", () => {
  assert.deepEqual([...ROLLE_REIHENFOLGE].sort(), Object.keys(MERKSAETZE).sort());
  assert.ok(AUSSAGEN.some(a => a.imLied) && AUSSAGEN.some(a => !a.imLied));
  if (QUELLE.placeholder) assert.ok(QUELLE.bloecke.every(b => b.text.startsWith("[Platzhalter")));
  assert.ok(TEXT.achet.monate.length === 4 && Object.keys(SPIELBELEGE).length > 5);
});
