import { test } from "node:test";
import assert from "node:assert/strict";
import { welt, leer, auswerten, darfZiehen, zugEinarbeiten, standUebernehmen, kanalName, SCHAETZE, FELDER, PAARE } from "../labor/08-klasse/spiel.js";
import { realtime } from "../labor/08-klasse/realtime.js";
import { starteTestserver } from "../labor/06-multiplayer/werkzeug/testserver.js";

test("gleicher Code = gleiche Welt, andere Paare = andere Welt", () => {
  const a = welt("KMTR", 3, 1), b = welt("KMTR", 3, 1);
  assert.deepEqual([...a.schatz].sort(), [...b.schatz].sort());
  assert.equal(a.schatz.size, SCHAETZE);
  const verschieden = [1, 2, 4, 5, 6].some(p => [...welt("KMTR", p, 1).schatz].sort().join() !== [...a.schatz].sort().join());
  assert.ok(verschieden);
  assert.notDeepEqual([...welt("KMTR", 3, 2).schatz].sort(), [...a.schatz].sort());
});

test("jede Runde lösbar: alle Felder aufdecken findet alle Schätze", () => {
  for (let p = 1; p <= PAARE; p++){
    const w = welt("ABCD", p, 1);
    let s = leer();
    for (let f = 0; f < FELDER && !auswerten(w, s).fertig; f++) s = zugEinarbeiten(s, { von: s.zuege.length % 2 ? "b" : "a", feld: f }, s.zuege.length + 1, w);
    assert.ok(auswerten(w, s).fertig, "Paar " + p);
  }
});

test("abwechselnd ziehen; gleichzeitige Züge entscheiden beide Geräte gleich", () => {
  const w = welt("ABCD", 1, 1);
  const frei = [...Array(FELDER).keys()].filter(f => !w.schatz.has(f));
  let s = zugEinarbeiten(leer(), { von: "a", feld: frei[0] }, 1, w);
  assert.ok(!darfZiehen(s, "a", w) && darfZiehen(s, "b", w));
  assert.equal(zugEinarbeiten(s, { von: "a", feld: frei[1] }, 2, w).zuege.length, 1, "zweimal hintereinander nicht erlaubt");

  // Beide tippen gleichzeitig als Zug 1: a hat "aaa…" < "bbb…"
  const beiA = zugEinarbeiten(leer(), { von: "a", feld: frei[0] }, 1, w);
  const beiB = zugEinarbeiten(leer(), { von: "b", feld: frei[1] }, 1, w);
  const nachher = [zugEinarbeiten(beiA, { von: "b", feld: frei[1] }, 1, w), zugEinarbeiten(beiB, { von: "a", feld: frei[0] }, 1, w)];
  assert.deepEqual(nachher[0], nachher[1]);
  assert.equal(nachher[0].zuege[0].von, "a");
});

test("Stand übernehmen: neuere Runde oder mehr Züge gewinnt", () => {
  const s1 = { runde: 1, zuege: [{ von: "a", feld: 1 }] };
  assert.equal(standUebernehmen(leer(), s1), s1);
  assert.equal(standUebernehmen(s1, leer()).zuege.length, 1);
  assert.equal(standUebernehmen(s1, leer(2)).runde, 2);
});

const warte = (b, ms = 3000) => new Promise((ok, nein) => {
  const t0 = Date.now();
  const iv = setInterval(() => { if (b()){ clearInterval(iv); ok(); } else if (Date.now() - t0 > ms){ clearInterval(iv); nein(new Error("Zeitüberschreitung")); } }, 20);
});

test("Monitor hört mehrere Paar-Kanäle über eine Verbindung mit", async () => {
  const server = await starteTestserver();
  const mon = realtime({ url: server.url, key: "t" }), post = [], da = {};
  for (let p = 1; p <= 3; p++) mon.kanal(kanalName("ABCD", p), { sichtbar: false, bei: {
    nachricht: (e, x) => post.push([p, e, x.feld]), anwesenheit: m => { da[p] = m.size; } } });
  const clients = [];
  const geraet = (p, id) => { const r = realtime({ url: server.url, key: "t" }); clients.push(r); return r.kanal(kanalName("ABCD", p), { id, meta: { rolle: "paar" } }); };
  const a = geraet(1, "aaaa"), b = geraet(1, "bbbb"), c = geraet(3, "cccc");
  try {
    await warte(() => da[1] === 2 && da[3] === 1 && a.beigetreten && c.beigetreten);
    a.sende("zug", { feld: 7 }); c.sende("zug", { feld: 9 });
    await warte(() => post.length === 2);
    assert.deepEqual(post.sort(), [[1, "zug", 7], [3, "zug", 9]]);
    assert.equal(mon.stand.verbindungen, 1);
  } finally {
    mon.schliesse(); clients.forEach(r => r.schliesse());
    await server.stopp();
  }
});
