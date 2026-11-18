import { test } from "node:test";
import assert from "node:assert/strict";
import { RUNDEN } from "../planspiel-julikrise/content.js";
import { VARIANTEN, LAGE, GRENZEN, AUSGAENGE, ENDE } from "../planspiel-julikrise/netz.js";
import { karte, lage, grenze, ausgang, akte1914, passt } from "../planspiel-julikrise/logik.js";

const welle = (r, s) => RUNDEN[r - 1].wellen.findIndex(w => w.includes(s));
const ABC = ["A", "B", "C"];

function pruefeSchluessel(wenn, runde, staaten, ort, eigeneErlaubt = false) {
  for (const [k, werte] of Object.entries(wenn)) {
    const [r, s, extra] = k.split(".");
    const rn = Number(r);
    assert.ok(RUNDEN[rn - 1]?.staaten[s], `${ort}: ${k} gibt es nicht`);
    if (extra) { assert.equal(extra, "wann", ort); continue; }
    for (const w of werte) assert.ok(ABC.includes(w), `${ort}: Wert ${w}`);
    assert.ok(rn <= runde, `${ort}: ${k} liegt in der Zukunft`);
    if (rn === runde && staaten) for (const st of staaten) {
      const ok = welle(rn, s) < welle(rn, st) || (eigeneErlaubt && s === st);
      assert.ok(ok, `${ort}: ${k} ist für ${st} noch nicht entschieden`);
    }
  }
}

test("Netz: Bedingungen verweisen nur auf Entscheidungen, die schon gefallen sind", () => {
  VARIANTEN.forEach((v, i) => pruefeSchluessel(v.wenn, v.runde, [v.staat], `Variante ${i}`));
  LAGE.forEach((l, i) => pruefeSchluessel(l.wenn, l.runde, l.fuer === "alle" ? Object.keys(RUNDEN[l.runde - 1].staaten) : l.fuer, `Lage ${i}`));
  GRENZEN.forEach((g, i) => pruefeSchluessel(g.wenn, g.runde, [g.staat], `Grenze ${i}`, true));
  for (const a of AUSGAENGE) for (const w of [a, ...a.weil]) pruefeSchluessel(w.wenn, a.nachRunde, null, a.id);
  for (const w of ENDE.weil) pruefeSchluessel(w.wenn, 5, null, "Ende");
});

test("Netz: auf dem Weg von 1914 bleiben alle Karten wie auf Papier, kein Ausgang, keine Grenze", () => {
  const z = akte1914(5);
  for (const r of RUNDEN) {
    for (const [s, k] of Object.entries(r.staaten)) {
      const kk = karte(r.nr, s, z);
      if (!kk.varianten.some(i => VARIANTEN[i].auch1914)) assert.deepEqual(kk.optionen, k.optionen, `${r.nr}.${s}`);
      assert.equal(grenze(r.nr, s, z), null, `${r.nr}.${s}`);
    }
    assert.equal(ausgang(r.nr, z), null, `Runde ${r.nr}`);
  }
});

/* alle Kombinationen der genannten Schlüssel */
function* kombis(keys) {
  if (!keys.length) { yield {}; return; }
  const [k, ...rest] = keys;
  const werte = k.endsWith(".wann") ? ["sofort", "während des Staatsbesuchs", "nach dem Staatsbesuch", "später"] : ABC;
  for (const v of werte) for (const r of kombis(rest)) yield { [k]: v, ...r };
}

test("Netz: jede Karte hat in jeder Lage drei vollständige Optionen", () => {
  for (const r of RUNDEN) for (const s of Object.keys(r.staaten)) {
    const keys = [...new Set(VARIANTEN.filter(v => v.runde === r.nr && v.staat === s).flatMap(v => Object.keys(v.wenn)))];
    for (const z of kombis(keys)) {
      const k = karte(r.nr, s, z);
      for (const b of ABC) for (const f of ["text", "pro", "contra"]) assert.ok(k.optionen[b][f]?.length > 5, `${r.nr}.${s} ${b} ${f} bei ${JSON.stringify(z)}`);
      assert.ok(lage(r.nr, s, z).length >= 1);
    }
  }
});

test("Netz: jeder Ausgang ist erreichbar und nennt immer mindestens einen konkreten Grund", () => {
  for (const a of AUSGAENGE) {
    const keys = [...new Set([a, ...a.weil].flatMap(w => Object.keys(w.wenn)))];
    let erreicht = 0;
    for (const z of kombis(keys)) {
      if (!passt(a.wenn, z)) continue;
      erreicht++;
      assert.ok(ausgang(a.nachRunde, z)?.saetze.length >= 1, `${a.id} ohne Grund bei ${JSON.stringify(z)}`);
    }
    assert.ok(erreicht > 0, a.id);
  }
});

test("Netz: Grenzen lassen nur gültige Optionen zur Neuentscheidung", () => {
  for (const g of GRENZEN) {
    assert.ok(g.neu.length >= 2 && g.neu.every(b => ABC.includes(b)), g.titel);
    assert.ok(g.text && g.beleg, g.titel);
  }
});
