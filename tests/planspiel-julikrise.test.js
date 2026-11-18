import { test } from "node:test";
import assert from "node:assert/strict";
import { STAATEN, TEAMS, DOSSIERS, RUNDEN } from "../planspiel-julikrise/content.js";

const staatImTeam = (runde) => TEAMS.map(t => t.staat[runde]);

test("Inhalt: fünf Runden, jedes Team spielt in jeder Runde genau einen Staat", () => {
  assert.equal(RUNDEN.length, 5);
  for (const r of RUNDEN) {
    const imSpiel = staatImTeam(r.nr);
    assert.equal(new Set(imSpiel).size, 6, `Runde ${r.nr}`);
    assert.deepEqual(Object.keys(r.staaten).sort(), [...imSpiel].sort(), `Runde ${r.nr}: Karten`);
  }
});

test("Inhalt: jede Karte hat A, B, C mit Text, Pro und Contra und eine Option 1914", () => {
  for (const r of RUNDEN) for (const [s, k] of Object.entries(r.staaten)) {
    assert.deepEqual(Object.keys(k.optionen), ["A", "B", "C"], `${r.nr}/${s}`);
    for (const o of Object.values(k.optionen)) for (const f of ["text", "pro", "contra"]) assert.ok(o[f]?.length > 5, `${r.nr}/${s} ${f}`);
    assert.ok(["A", "B", "C"].includes(k.historisch), `${r.nr}/${s} historisch`);
  }
});

test("Inhalt: Wellen enthalten jeden Staat der Runde genau einmal", () => {
  for (const r of RUNDEN) {
    const alle = r.wellen.flat();
    assert.equal(alle.length, new Set(alle).size, `Runde ${r.nr}`);
    assert.deepEqual([...alle].sort(), Object.keys(r.staaten).sort(), `Runde ${r.nr}`);
  }
});

test("Inhalt: Noten gehen nur zwischen Staaten, die in der Runde mitspielen", () => {
  for (const r of RUNDEN) {
    const dabei = new Set(Object.keys(r.staaten));
    for (const n of [...r.fenster[1], ...r.fenster[2]]) {
      assert.ok(dabei.has(n.von), `${r.nr}: von ${n.von}`);
      for (const an of n.an) assert.ok(an === "alle" || dabei.has(an), `${r.nr}: an ${an}`);
      assert.equal(typeof n.pflicht, "boolean");
    }
  }
});

test("Inhalt: jeder Staat hat ein Dossier und einen Namen", () => {
  for (const s of Object.keys(STAATEN)) {
    assert.ok(DOSSIERS[s]?.werWirSind, s);
    assert.ok(DOSSIERS[s].wasWirWollen.length >= 2, s);
  }
});
