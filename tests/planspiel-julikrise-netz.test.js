import { test } from "node:test";
import assert from "node:assert/strict";
import { RUNDEN } from "../planspiel-julikrise/content.js";
import { MERKMALE, SETZT, VARIANTEN, LAGE, GRENZEN, AUSGAENGE, ENDE } from "../planspiel-julikrise/netz.js";
import { karte, lage, grenze, ausgang, ende, akte1914, anzeigen, merkmaleBis } from "../planspiel-julikrise/logik.js";

const ABC = ["A", "B", "C"];
const welle = (r, s) => RUNDEN[r - 1].wellen.findIndex(w => w.includes(s));

test("Merkmale: alle Werte in SETZT, Varianten und Bedingungen sind bekannt", () => {
  const pruefeWerte = (obj, ort) => { for (const [k, v] of Object.entries(obj || {})) {
    assert.ok(MERKMALE[k], `${ort}: Merkmal ${k} unbekannt`);
    for (const w of [].concat(v)) assert.ok(w in MERKMALE[k].werte, `${ort}: ${k}=${w} unbekannt`);
  } };
  for (const [k, m] of Object.entries(MERKMALE)) assert.ok(m.start in m.werte, k);
  for (const [k, opts] of Object.entries(SETZT)) for (const [b, s] of Object.entries(opts)) pruefeWerte(s, `SETZT ${k} ${b}`);
  VARIANTEN.forEach((v, i) => { pruefeWerte(v.wenn, `Variante ${i}`); for (const o of Object.values(v.optionen || {})) pruefeWerte(o.setzt, `Variante ${i}`); });
  LAGE.forEach((l, i) => pruefeWerte(l.wenn, `Lage ${i}`));
  GRENZEN.forEach(g => pruefeWerte(g.wenn, g.titel));
  for (const a of [...AUSGAENGE, ENDE]) for (const w of [a, ...a.weil]) pruefeWerte(w.wenn, a.titel);
});

test("Merkmale: jede Entscheidung hat einen Eintrag in SETZT", () => {
  for (const r of RUNDEN) for (const s of Object.keys(r.staaten)) assert.ok(SETZT[`${r.nr}.${s}`], `${r.nr}.${s}`);
});

test("Weg 1914: alle Karten wie auf Papier, keine Grenze, kein früher Ausgang, Ende wie 1914", () => {
  const z = akte1914(5);
  for (const r of RUNDEN) {
    for (const [s, k] of Object.entries(r.staaten)) {
      const kk = karte(r.nr, s, z);
      if (!kk.varianten.some(i => VARIANTEN[i].auch1914)) for (const b of ABC) {
        const { setzt, ...ohne } = kk.optionen[b];
        assert.deepEqual(ohne, k.optionen[b], `${r.nr}.${s} ${b}`);
      }
      assert.equal(grenze(r.nr, s, z), null, `${r.nr}.${s}`);
    }
    assert.equal(ausgang(r.nr, z), null, `Runde ${r.nr}`);
  }
  assert.ok(ende(z).saetze[0].startsWith("Wie 1914"));
});

/* Zufällige Partien (fester Startwert): alle Wege durchs Netz stichprobenartig durchspielen. */
function zufall(seed) { let x = seed; return () => (x = (x * 1103515245 + 12345) % 2147483648) / 2147483648; }
const waehle = (rnd, liste) => liste[Math.floor(rnd() * liste.length)];

function partie(rnd, log) {
  let z = {};
  for (const r of RUNDEN) {
    for (const wel of r.wellen) for (const s of wel) {
      const k = karte(r.nr, s, z);
      k.varianten.forEach(i => log.varianten.add(i));
      for (const b of ABC) for (const f of ["text", "pro", "contra"]) assert.ok(k.optionen[b][f]?.length > 5, `${r.nr}.${s} ${b} ${f}`);
      assert.ok(lage(r.nr, s, z).length >= 1);
      for (const a of anzeigen(r.nr, s, z)) assert.ok(a.text, a.id);
      z[`${r.nr}.${s}`] = waehle(rnd, ABC);
      if (k.zusatz) z[`${r.nr}.${s}.wann`] = waehle(rnd, k.zusatz.wahl);
      const g = grenze(r.nr, s, z);
      if (g) { log.grenzen.add(g.titel); z[`${r.nr}.${s}`] = waehle(rnd, g.neu); }
    }
    const m = merkmaleBis(z, r.nr, Infinity);
    LAGE.forEach((l, i) => { if (l.runde === r.nr) log.lage.add(i); });
    const a = ausgang(r.nr, z);
    if (a) {
      assert.ok(a.saetze.length >= 1, `${a.id} ohne konkreten Grund: ${JSON.stringify(m)}`);
      log.ausgaenge.add(a.id);
      z = akte1914(r.nr);
    }
  }
  assert.ok(ende(z).saetze.length >= 1, "Ende ohne Satz");
}

test("Netz: 4000 zufällige Partien – immer drei Optionen, Ausgänge mit Grund, alles erreichbar", () => {
  const rnd = zufall(1914);
  const log = { varianten: new Set(), grenzen: new Set(), ausgaenge: new Set(), lage: new Set() };
  for (let i = 0; i < 4000; i++) partie(rnd, log);
  for (const a of AUSGAENGE) assert.ok(log.ausgaenge.has(a.id), `Ausgang ${a.id} nie erreicht`);
  for (const g of GRENZEN) assert.ok(log.grenzen.has(g.titel), `Grenze „${g.titel}“ nie erreicht`);
  VARIANTEN.forEach((v, i) => assert.ok(log.varianten.has(i), `Variante ${i} (Runde ${v.runde}, ${v.staat}) nie erreicht`));
});

test("Netz: Grenzen lassen nur gültige Optionen zur Neuentscheidung", () => {
  for (const g of GRENZEN) {
    assert.ok(g.neu.length >= 2 && g.neu.every(b => ABC.includes(b)), g.titel);
    assert.ok(g.text && g.beleg, g.titel);
    assert.ok(welle(g.runde, g.staat) >= 0);
  }
});
