import { test } from "node:test";
import assert from "node:assert/strict";
import { neuerCode, normalisiere, gueltig, farben, Messreihe, drossel, Zaehler, ZEICHEN } from "../labor/06-multiplayer/raum.js";
import { verbinde } from "../labor/06-multiplayer/verbindung.js";
import { starteTestserver } from "../labor/06-multiplayer/werkzeug/testserver.js";

test("Raumcodes: 4 Zeichen, ohne I und O, Eingabe wird aufgeräumt", () => {
  for (let i = 0; i < 500; i++) assert.ok(gueltig(neuerCode()));
  assert.ok(!ZEICHEN.includes("I") && !ZEICHEN.includes("O"));
  assert.equal(normalisiere(" ab-cd9e"), "ABCD");
  assert.ok(!gueltig("ABOI"));
  assert.ok(!gueltig("ABC"));
});

test("Farben sind auf allen Geräten gleich, egal in welcher Reihenfolge sie die anderen sehen", () => {
  const a = farben(["c3", "a1", "b2"]), b = farben(["b2", "c3", "a1"]);
  for (const id of ["a1", "b2", "c3"]) assert.equal(a.get(id).wert, b.get(id).wert);
  assert.notEqual(a.get("a1").wert, a.get("b2").wert);
});

test("Messreihe, Drossel und Zähler", () => {
  const m = new Messreihe(3);
  [50, 10, 30, 1000].forEach(v => m.neu(v));
  assert.deepEqual([m.median, m.min, m.max, m.anzahl, m.gesamt], [30, 10, 1000, 3, 4]);
  const d = drossel(100);
  assert.deepEqual([0, 50, 100, 150, 220].map(d), [true, false, true, false, true]);
  const z = new Zaehler(1000);
  [0, 100, 200, 1500].forEach(t => z.neu(t));
  assert.equal(z.proSekunde(1500), 1);
});

const warte = (bedingung, ms = 3000) => new Promise((ok, nein) => {
  const t0 = Date.now();
  const iv = setInterval(() => {
    if (bedingung()){ clearInterval(iv); ok(); }
    else if (Date.now() - t0 > ms){ clearInterval(iv); nein(new Error("Zeitüberschreitung")); }
  }, 20);
});

test("Zwei Geräte im selben Raum sehen sich und tauschen Nachrichten aus", async () => {
  const server = await starteTestserver();
  const geraet = id => {
    const g = { post: [], da: new Map() };
    g.v = verbinde({ url: server.url, key: "test", raum: "labor06-ABCD", id, meta: { seit: 1 },
      bei: { nachricht: (e, p) => g.post.push([e, p]), anwesenheit: m => { g.da = m; } } });
    return g;
  };
  const a = geraet("aaaa"), b = geraet("bbbb"), fremd = geraet("cccc");
  fremd.v.schliesse();
  const c = { post: [] };
  c.v = verbinde({ url: server.url, key: "test", raum: "labor06-ZZZZ", id: "zzzz", bei: { nachricht: (e, p) => c.post.push(e) } });
  try {
    await warte(() => a.da.size === 2 && b.da.size === 2 && c.v.beigetreten);
    assert.ok(a.v.sende("tipp", { x: .5, y: .25 }));
    await warte(() => b.post.length === 1);
    assert.deepEqual(b.post[0], ["tipp", { x: .5, y: .25 }]);
    assert.equal(a.post.length, 0, "eigene Nachricht kommt nicht zurück");
    assert.equal(c.post.length, 0, "anderer Raum hört nichts");

    // Abbruch (Standby, WLAN): beide verbinden sich selbst neu und sehen sich wieder
    server.trenneAlle();
    await warte(() => a.da.size === 0);
    await warte(() => a.da.size === 2 && b.da.size === 2, 6000);
    assert.equal(a.v.stand.verbindungen, 2);
    assert.ok(b.v.sende("tipp", { x: 1, y: 1 }));
    await warte(() => a.post.length === 1);

    // Ein Gerät verlässt den Raum
    b.v.schliesse();
    await warte(() => a.da.size === 1);
    assert.ok(a.da.has("aaaa"));
  } finally {
    a.v.schliesse(); b.v.schliesse(); c.v.schliesse();
    await server.stopp();
  }
});
