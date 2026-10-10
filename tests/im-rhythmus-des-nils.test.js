import { test } from "node:test";
import assert from "node:assert/strict";
import { NUM, TEXT, MERKSAETZE, ROLLE_REIHENFOLGE, AUSSAGEN, QUELLE, SPIELBELEGE, BILANZ } from "../im-rhythmus-des-nils/content.js";
import { nextPhase, sowable, harvest, supply, simulate, seasonsKnown, fieldRest, fieldSteps, growMonths, RISE_HOCH, tauschMoeglich, dorfbauGesten, kraftImJahr, hofVerloren } from "../im-rhythmus-des-nils/sim.js";
import { scene, villageView, LEVEL, groundY, waterReach } from "../im-rhythmus-des-nils/scene.js";

const BERUFE = ["toepfer", "weberin", "landvermesser", "verwalter"];

function walk(flags){
  const seen = [];
  let cur = { year: 1, phase: "sirius" };
  while (cur){ seen.push(cur.year + ":" + cur.phase); cur = nextPhase(cur.year, cur.phase, flags); assert.ok(seen.length < 60); }
  return seen;
}

test("Ablauf: vier Jahre, das Dorf entsteht automatisch, Berufe am Anfang von Jahr 4", () => {
  const a = walk({ schaduf: "bauen" });
  for (const p of ["2:schaduf", "2:dorfRat", "2:dorfbau", "3:trockenzeit", "3:jahresende", "4:beruf", "4:trockenzeit"]) assert.ok(a.includes(p), p);
  assert.ok(a.indexOf("4:beruf") < a.indexOf("4:aussaat"));
  assert.equal(a[a.length - 1], "4:jahresende");
  assert.ok(!walk({ schaduf: "lassen" }).includes("2:schaduf"));
});

test("Arbeitskraft: Jahr 1 reicht für alle Felder, danach bleibt Kraft für Körbe", () => {
  const felder = [0, 1, 2].reduce((s, i) => s + fieldRest(1, i), 0);
  assert.ok(felder < NUM.kraft);
  assert.equal(fieldSteps(1, 0).map(s => s.id).join(), "grenzstein,pfluegen,saeen");
  assert.equal(fieldSteps(2, 1).map(s => s.id).join(), "pfluegen,saeen");          // nicht überschwemmt: Grenzstein steht
  assert.equal(fieldSteps(3, 0)[0].id, "grenzeNeu");
  assert.equal(fieldSteps(4, 0, { landvermesser: true }).map(s => s.id).join(), "pfluegen,saeen");
  const s = simulate();
  assert.equal(s.years[1].harvest, 12);
  assert.ok(s.years[1].extra > 0, "Körbe in Jahr 1");
});

test("Jahr 2: ohne Schaduf Hunger, mit Schaduf reicht es; nach dem vollen Schöpfen bleibt Kraft für den Dorfbau", () => {
  assert.equal(simulate({ buckets: 0 }).years[2].status, "hunger");
  assert.notEqual(simulate({ buckets: NUM.schadufHalb }).years[2].status, "hunger");
  assert.notEqual(simulate({ buckets: NUM.schadufVoll }).years[2].status, "hunger");
  const voll = simulate({ buckets: NUM.schadufVoll });
  assert.ok(voll.kraft[2].dorf > 0, "Dorfbau braucht Arbeitskraft");
  assert.ok(voll.kraft[2].dorf < simulate({ buckets: 0 }).kraft[2].dorf, "wer viel geschöpft hat, trägt weniger bei");
  assert.equal(voll.kraft[2].frei, 0);
  assert.ok(dorfbauGesten() >= 3);
  assert.equal(sowable(2, 2, 99), false);
  assert.equal(sowable(2, 1, NUM.schadufHalb), true);
  assert.ok(harvest(2, [true, true, true], NUM.schadufVoll) > harvest(2, [true, true, true], NUM.schadufHalb));
  assert.equal(supply(0, 0, 0).hunger, NUM.bedarf);
});

test("Hunger schwächt, schwerer Hunger kostet den Hof (Option C)", () => {
  // verlieren nur ohne Schaduf und mit kaum Körben in Jahr 1
  for (const koerbe1 of [0, 1, 2, 3]) for (const buckets of [0, 3, 6]){
    const r = simulate({ koerbe1, buckets });
    assert.equal(r.verloren, buckets === 0 && koerbe1 <= 1, `Körbe ${koerbe1}, Eimer ${buckets}`);
    if (!r.verloren) assert.equal(r.years[3].kraftStart, kraftImJahr(r.years[2].hunger));
  }
  assert.ok(kraftImJahr(2) < kraftImJahr(0));
  assert.equal(hofVerloren(NUM.hofVerlassen), true);
  // auch geschwächt reicht die Kraft in Jahr 3 für alle Felder; das Dorf fängt den Hunger auf
  const g = simulate({ koerbe1: 2, buckets: 0 });
  assert.equal(g.years[3].sown.filter(Boolean).length, 3);
  assert.equal(g.years[3].hunger, 0);
  const walkLost = []; let cur = { year: 1, phase: "sirius" };
  while (cur){ walkLost.push(cur.year + ":" + cur.phase); cur = nextPhase(cur.year, cur.phase, { verloren: true }); }
  assert.equal(walkLost[walkLost.length - 1], "2:verloren");
});

test("Beitrag zum Dorfspeicher nur, wenn etwas übrig ist", () => {
  assert.equal(simulate({ buckets: 0 }).years[2].beitrag, 0);
  assert.equal(simulate({ buckets: NUM.schadufVoll }).years[2].beitrag, NUM.dorfBeitrag);
});

test("Jahr 3: im Dorf hungert niemand, und für Körbe bleibt nach dem Ausbessern noch Kraft", () => {
  for (const buckets of [0, 3, 6]){
    const r = simulate({ buckets });
    assert.equal(r.years[3].hunger, 0);
    assert.ok(r.kraft[3].dorf > 0);
    if (r.years[2].hunger === 0) assert.ok(r.kraft[3].koerbe > 0, "ohne Hunger bleibt Kraft für Körbe");
  }
  assert.equal(tauschMoeglich(2), false);
  assert.equal(tauschMoeglich(3), true);
});

test("Jahr 4: Jeder Beruf bringt gleich viel, alle haben mehr als in Jahr 1", () => {
  for (const buckets of [0, 3, 6]){
    const ende = BERUFE.map(beruf => simulate({ buckets, beruf }).years[4].extra);
    assert.equal(Math.max(...ende) - Math.min(...ende), 0, ende.join("/"));
    assert.ok(ende[0] > simulate({ buckets }).years[1].extra);
  }
  const s = simulate();
  assert.equal(s.years[1].harvest, s.years[4].harvest);
  assert.ok(simulate({ beruf: "weberin" }).kraft[4].felder < s.kraft[1].felder);
  assert.ok(simulate({ beruf: "landvermesser" }).kraft[4].felder < s.kraft[1].felder);
});

test("Kalender und Wachstum", () => {
  assert.equal(seasonsKnown(1, "sirius", 1), 0);
  assert.equal(seasonsKnown(1, "aussaat", 5), 1);
  assert.equal(seasonsKnown(1, "trockenzeit", 10), 2);
  assert.equal(seasonsKnown(1, "jahresende", 12), 3);
  assert.equal(seasonsKnown(2, "sirius", 1), 3);
  for (const y of [1, 2, 3, 4]) assert.equal(growMonths(y).length, 3);
  assert.ok(LEVEL.tief + (LEVEL.hoch - LEVEL.tief) * RISE_HOCH[2] < LEVEL.gut);
});

test("Wasser: Der Deich hält das Hochwasser auf", () => {
  assert.ok(groundY(700) > LEVEL.gut && groundY(900) < LEVEL.gut);
  assert.ok(waterReach(LEVEL.hoch) > 1000);
  assert.ok(waterReach(LEVEL.hoch, { x0: 792, top: 226 }) < 820);
});

test("Szenen, Gesten-Tippflächen und Dorfansicht lassen sich zeichnen", () => {
  const svg = scene({ sky: "dawn", fields: [{ soil: "schlamm", boundary: "liegt" }, { soil: "gepflueg", plants: "reif" }, { soil: "trocken", boundary: false }],
    hof: { fill: 0.5 }, hot: [{ id: "f0", g: "pflug" }, { id: "schaduf", g: "zug" }, { id: "x", g: "korb", rect: { x: 1, y: 2, w: 3, h: 4 }, data: { tx: 5, ty: 6 } }] });
  assert.match(svg, /data-g="pflug"[^>]*data-x0=/);
  assert.match(svg, /data-g="korb"[^>]*data-tx="5"/);
  assert.match(svg, /class="plants-f1"/);
  assert.match(scene({ village: { dike: true, dikeK: 0.5, stage: 0.3 } }), /^<svg/);
  assert.match(villageView({ sky: "achet", mine: "landvermesser" }), /deine Familie/);
});

test("Texte: keine Kraft-Zahlen, Merksätze vollständig, Berufe beschrieben", () => {
  assert.deepEqual([...ROLLE_REIHENFOLGE].sort(), Object.keys(MERKSAETZE).sort());
  for (const b of BERUFE){ assert.ok(TEXT.beruf.optionen[b]); assert.ok(TEXT.trockenzeit[b]); assert.ok(BILANZ.gruende[b]); }
  const alles = JSON.stringify({ TEXT, MERKSAETZE });
  assert.ok(!/\d+ Kraft/.test(alles), "keine Zahlen vor „Kraft“");
  assert.ok(!/Erdwall|allein auf dem Hof/i.test(alles));
  assert.ok(AUSSAGEN.some(a => a.imLied) && AUSSAGEN.some(a => !a.imLied));
  for (const a of AUSSAGEN) if (a.imLied) assert.ok(a.stelle >= 0 && a.stelle < QUELLE.bloecke.length, a.text);
  if (QUELLE.placeholder) assert.ok(QUELLE.bloecke.every(b => b.text.startsWith("[Platzhalter")));
  for (const y of [1, 2, 3, 4]) assert.equal(TEXT.achet[y].monate.length, 4);
  assert.ok(SPIELBELEGE.beruf && SPIELBELEGE.deich);
});
