import { test } from "node:test";
import assert from "node:assert/strict";
import { NUM, TEXT, MERKSAETZE, ROLLE_REIHENFOLGE, AUSSAGEN, QUELLE, SPIELBELEGE, BILANZ } from "../im-rhythmus-des-nils/content.js";
import { PHASES, nextPhase, sowable, harvest, supply, simulate, seasonsKnown, verloren, fieldRest, fieldSteps, growMonths, RISE_HOCH } from "../im-rhythmus-des-nils/sim.js";
import { scene, villageView, LEVEL, groundY, waterReach, WALL } from "../im-rhythmus-des-nils/scene.js";

const BERUFE = ["toepfer", "weberin", "landvermesser", "verwalter"];

function walk(flags){
  const seen = [];
  let cur = { year: 1, phase: "sirius" };
  while (cur){ seen.push(cur.year + ":" + cur.phase); cur = nextPhase(cur.year, cur.phase, flags); assert.ok(seen.length < 60); }
  return seen;
}

test("Ablauf: vier Jahre, Phasen hängen von den Entscheidungen ab", () => {
  const dorf = walk({ schaduf: "bauen", dorf: "dorf" });
  for (const p of ["2:schaduf", "2:dorfbau", "3:trockenzeit", "3:beruf", "4:trockenzeit"]) assert.ok(dorf.includes(p), p);
  assert.ok(!dorf.includes("2:trockenzeit") && !dorf.includes("3:hausbau"));
  assert.equal(dorf[dorf.length - 1], "4:jahresende");
  const allein = walk({ schaduf: "lassen", dorf: "allein", hausWeg: true });
  for (const p of ["2:trockenzeit", "3:hausbau", "3:beruf", "4:aussaat"]) assert.ok(allein.includes(p), p);
  assert.ok(!allein.includes("2:schaduf") && !allein.includes("2:dorfbau") && !allein.includes("3:trockenzeit"));
  const lost = walk({ dorf: "allein", verloren: true });
  assert.ok(lost.includes("3:verloren") && !lost.includes("3:beruf"));
  assert.equal(lost[lost.length - 1], "3:verloren");      // wer verliert und weiterspielt, kommt zur Bilanz
});

test("Arbeitskraft: Jahr 1 reicht für alle drei Felder, danach bleibt Kraft für die Trockenzeit", () => {
  const felder = [0, 1, 2].reduce((s, i) => s + fieldRest(1, i, {}), 0);
  assert.ok(felder < NUM.kraft);
  assert.equal(fieldSteps(1, 0).map(s => s.id).join(), "grenzstein,pfluegen,saeen");
  assert.equal(fieldSteps(2, 1).map(s => s.id).join(), "pfluegen,saeen");          // nicht überschwemmt: Grenzstein steht
  assert.equal(fieldSteps(3, 0)[0].id, "grenzeNeu");
  assert.equal(fieldSteps(4, 0, { landvermesser: true }).map(s => s.id).join(), "pfluegen,saeen");
  assert.ok(fieldRest(4, 0, {}, { kupfer: true }) < fieldRest(4, 0, {}));
  const { years, kraft } = simulate({ y1Wall: 0 });
  assert.equal(years[1].harvest, 12);
  assert.equal(kraft[1].koerbe, NUM.kraft - felder);
});

test("Jahr 2: ohne Schaduf Hunger, mit vollem Schaduf und Körben reicht es", () => {
  for (const y1Wall of [0, 2, 4]) assert.equal(simulate({ y1Wall, buckets: 0 }).years[2].status, "hunger");
  assert.notEqual(simulate({ y1Wall: 0, buckets: NUM.schadufVoll }).years[2].status, "hunger");
  assert.equal(sowable(2, 2, 99), false);
  assert.equal(sowable(2, 1, NUM.schadufHalb), true);
  assert.ok(harvest(2, [true, true, true], NUM.schadufVoll) > harvest(2, [true, true, true], NUM.schadufHalb));
  assert.equal(supply(0, 0, 0).hunger, NUM.bedarf);
});

test("Eimer gegen Kraft: Volles Schöpfen lässt zu wenig Kraft für Deich oder Erdwall", () => {
  const voll = simulate({ buckets: 6, dorf: "dorf" }), halb = simulate({ buckets: 3, dorf: "dorf" });
  assert.ok(voll.kraft[2].schutz < NUM.kosten.deich, "Deich muss nachgeholt werden");
  assert.equal(halb.kraft[2].schutz, NUM.kosten.deich);
  // allein ohne Erdwall aus Jahr 1: volles Schöpfen und Erdwall gehen nicht zusammen
  assert.equal(simulate({ y1Wall: 0, buckets: 6, dorf: "allein" }).wallFertig, false);
  assert.equal(simulate({ y1Wall: 0, buckets: 3, dorf: "allein" }).wallFertig, true);
});

test("Dorf: niemand hungert in Jahr 3; allein nur mit Erdwall und Vorrat – sonst droht das Ende", () => {
  for (const y1Wall of [0, 2, 4]) for (const buckets of [0, 3, 6]){
    const d = simulate({ y1Wall, buckets, dorf: "dorf" });
    assert.equal(d.years[3].hunger, 0);
    assert.equal(d.verloren, false);
  }
  // allein überleben ist möglich, aber nur mit Vorsorge
  assert.equal(simulate({ y1Wall: 0, buckets: 3, dorf: "allein" }).years[3].hunger, 0);
  assert.equal(simulate({ y1Wall: 2, buckets: 6, dorf: "allein" }).years[3].hunger, 0);
  const ohne = simulate({ y1Wall: 0, buckets: 6, dorf: "allein" });
  assert.ok(ohne.years[3].hunger > 0);
  assert.equal(ohne.years[2].flood.house, "zerstoert");
  assert.equal(simulate({ y1Wall: 4, buckets: 0, dorf: "allein" }).verloren, true);
  assert.equal(verloren({ 1: false, 2: true, 3: true }), true);
  assert.equal(verloren({ 1: false, 2: true, 3: false, 4: false }), false);
});

test("Jahr 4: Jeder Beruf bringt etwa gleich viel, und das Dorf mit Beruf hat mehr als allein", () => {
  for (const y1Wall of [0, 2]) for (const buckets of [3, 6]){
    const ende = BERUFE.map(beruf => simulate({ y1Wall, buckets, dorf: "dorf", beruf }).years[4].vorratEnde);
    assert.equal(Math.max(...ende) - Math.min(...ende), 0, ende.join("/"));
    const a = simulate({ y1Wall, buckets, dorf: "allein" });
    if (!a.verloren) assert.ok(ende[0] > a.years[4].vorratEnde);
  }
  // Jahr 1 und Jahr 4 haben dieselbe Flut
  const s = simulate({ dorf: "dorf", beruf: "toepfer" });
  assert.equal(s.years[1].harvest, s.years[4].harvest);
});

test("Kalender und Wachstum", () => {
  assert.equal(seasonsKnown(1, "sirius", 1), 0);
  assert.equal(seasonsKnown(1, "aussaat", 5), 1);
  assert.equal(seasonsKnown(1, "trockenzeit", 10), 2);
  assert.equal(seasonsKnown(1, "jahresende", 12), 3);
  assert.equal(seasonsKnown(2, "sirius", 1), 3);
  for (const y of [1, 2, 3, 4]) assert.equal(growMonths(y).length, 3);
  // Jahr 3: im dritten Monat steht das Wasser schon über der Marke „gut“
  assert.ok(LEVEL.tief + (LEVEL.hoch - LEVEL.tief) * RISE_HOCH[2] < LEVEL.gut);
});

test("Wasser: Deich und fertiger Erdwall halten das Hochwasser auf", () => {
  assert.ok(groundY(700) > LEVEL.gut && groundY(900) < LEVEL.gut);
  assert.ok(waterReach(LEVEL.hoch) > 1000);
  assert.ok(waterReach(LEVEL.hoch, { x0: 792, top: 226 }) < 820);
  assert.ok(waterReach(LEVEL.hoch, { x0: WALL.x - 8, top: WALL.top }) < 840);
  assert.match(scene({ hof: { wall: 1 }, water: { level: LEVEL.hoch, kind: "flut" } }), /^<svg/);
});

test("Szenen, Gesten-Tippflächen und Dorfansicht lassen sich zeichnen", () => {
  const svg = scene({ sky: "dawn", fields: [{ soil: "schlamm", boundary: "liegt" }, { soil: "gepflueg", plants: "reif" }, { soil: "trocken", boundary: false }],
    hof: { fill: 0.5, wall: 0.5 }, hot: [{ id: "f0", g: "pflug" }, { id: "schaduf", g: "zug" }, { id: "x", g: "korb", rect: { x: 1, y: 2, w: 3, h: 4 }, data: { tx: 5, ty: 6 } }] });
  assert.match(svg, /data-g="pflug"[^>]*data-x0=/);
  assert.match(svg, /data-g="korb"[^>]*data-tx="5"/);
  assert.match(svg, /class="plants-f1"/);
  assert.match(scene({ village: { dike: true }, water: { level: LEVEL.hoch, kind: "flut" }, ghost: LEVEL.hoch, shaduf: { t: 1 } }), /ohne Deich/);
  assert.match(villageView({ mine: "landvermesser" }), /deine Familie/);
});

test("Texte: Merksätze vollständig, Berufe beschrieben, Quellencheck stimmig", () => {
  assert.deepEqual([...ROLLE_REIHENFOLGE].sort(), Object.keys(MERKSAETZE).sort());
  for (const b of BERUFE){ assert.ok(TEXT.beruf.optionen[b]); assert.ok(TEXT.trockenzeit[b]); assert.ok(BILANZ.gruende[b]); }
  assert.ok(AUSSAGEN.some(a => a.imLied) && AUSSAGEN.some(a => !a.imLied));
  for (const a of AUSSAGEN) if (a.imLied) assert.ok(a.stelle >= 0 && a.stelle < QUELLE.bloecke.length, a.text);
  if (QUELLE.placeholder) assert.ok(QUELLE.bloecke.every(b => b.text.startsWith("[Platzhalter")));
  for (const y of [1, 2, 4]) assert.equal(TEXT.achet[y].monate.length, 4);
  assert.equal(TEXT.achet[3].monate.length, 3);
  assert.ok(SPIELBELEGE.alleinZerstoert && SPIELBELEGE.beruf && TEXT.verloren.nochmal);
});
