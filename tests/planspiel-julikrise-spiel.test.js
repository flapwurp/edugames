import { test } from "node:test";
import assert from "node:assert/strict";
import { RUNDEN, TEAMS } from "../planspiel-julikrise/content.js";
import { neuesSpiel, anwenden, nachspielen, sicht, lehrerSicht, auswertung, ablauf, staatVon, LIMIT } from "../planspiel-julikrise/spiel.js";
import { akte1914 } from "../planspiel-julikrise/logik.js";

const L = { lehrer: true };
const ok = (spiel, a, log) => { const r = anwenden(spiel, a); assert.equal(r.fehler, undefined, `${a.typ}: ${r.fehler}`); log?.push(a); return r.spiel; };
const geraete = (team, n = 4) => Array.from({ length: n }, (_, i) => `${team}-${i}`);

function beitreten(spiel, log) {
  for (const t of TEAMS) for (const g of geraete(t.id)) spiel = ok(spiel, { typ: "beitreten", geraet: g, team: t.id }, log);
  return spiel;
}

/* Eine Delegation entscheidet einstimmig; Grenzen werden mit der ersten erlaubten Option beantwortet. */
function beschliessen(spiel, team, wahl, log) {
  const gs = geraete(team);
  spiel = ok(spiel, { typ: "begruendung", geraet: gs[0], feld: "verkuendung", text: "Wir wählen das, weil es unseren Interessen dient." }, log);
  const v = sicht(spiel, team, gs[0]);
  if (v.karte.zusatz) spiel = ok(spiel, { typ: "wann", geraet: gs[0], wahl: v.karte.zusatz.wahl.at(-1) }, log);
  for (const g of gs) spiel = ok(spiel, { typ: "stimme", geraet: g, wahl }, log);
  spiel = ok(spiel, { typ: "beschliessen", geraet: gs[1] }, log);
  const g2 = sicht(spiel, team, gs[0]).grenze;
  if (g2) {
    for (const g of gs) spiel = ok(spiel, { typ: "stimme", geraet: g, wahl: g2.neu[0] }, log);
    spiel = ok(spiel, { typ: "beschliessen", geraet: gs[0] }, log);
  }
  return spiel;
}

/* Spielt bis zum Ende. waehle(runde, team) liefert den Buchstaben. */
function partie(waehle, log = []) {
  let s = beitreten(neuesSpiel(), log);
  for (let i = 0; i < 200 && s.phase.typ !== "ende"; i++) {
    if (s.phase.typ === "welle") for (const t of TEAMS) if (sicht(s, t.id, geraete(t.id)[0]).entscheidetJetzt) s = beschliessen(s, t.id, waehle(s.runde, t.id), log);
    s = ok(s, { typ: "weiter", ...L }, log);
  }
  return { s, log };
}
const historisch = (runde, team) => RUNDEN[runde - 1].staaten[staatVon(team, runde)].historisch;

test("Spiel: Ablauf jeder Runde – Lage, Fenster und Wellen, Auflösung", () => {
  for (const r of RUNDEN) {
    const a = ablauf(r.nr);
    assert.equal(a[0].typ, "lage");
    assert.equal(a.at(-1).typ, "aufloesung");
    assert.equal(a.filter(p => p.typ === "welle").length, r.wellen.length);
  }
});

test("Spiel: Weg von 1914 läuft bis zum Ende, 30 Entscheidungen, kein Ausgang, alle wie 1914", () => {
  const { s } = partie(historisch);
  assert.equal(s.phase.typ, "ende");
  assert.equal(s.verlauf.length, 30);
  assert.equal(s.ausgaenge.length, 0);
  assert.ok(auswertung(s).every(e => e.wie1914));
});

test("Spiel: gleiche Aktionen ergeben denselben Stand (für den Mehrgeräte-Betrieb)", () => {
  const { s, log } = partie(() => "A");
  assert.deepEqual(nachspielen(log), s);
});

test("Spiel: Kabinettsbeschluss nur einstimmig, mit allen Geräten und mit Verkündung", () => {
  let s = beitreten(neuesSpiel());
  s = ok(s, { typ: "weiter", ...L }); s = ok(s, { typ: "weiter", ...L });  // Lage → Fenster → Welle 1
  const gs = geraete("d");
  assert.match(anwenden(s, { typ: "beschliessen", geraet: gs[0] }).fehler, /nicht alle/);
  for (const g of gs) s = ok(s, { typ: "stimme", geraet: g, wahl: g === gs[3] ? "A" : "C" });
  assert.match(anwenden(s, { typ: "beschliessen", geraet: gs[0] }).fehler, /nicht einig/);
  s = ok(s, { typ: "stimme", geraet: gs[3], wahl: "C" });
  assert.match(anwenden(s, { typ: "beschliessen", geraet: gs[0] }).fehler, /Verkündung/);
  s = ok(s, { typ: "begruendung", geraet: gs[2], feld: "verkuendung", text: "Wir wählen C, weil Wien unser Verbündeter ist." });
  s = ok(s, { typ: "beschliessen", geraet: gs[0] });
  assert.equal(sicht(s, "d", gs[0]).kabinett.beschlossen, "C");
  assert.ok(anwenden(s, { typ: "stimme", geraet: "oeu-0", wahl: "B" }).fehler, "Ö-U entscheidet erst in Welle 2");
  assert.match(anwenden(s, { typ: "weiter", ...L }).fehler, /Noch nicht entschieden/);
});

test("Spiel: Geheimhaltung – den Blankoscheck kennt nur Wien, alle anderen erst in den Geheimakten", () => {
  const { s } = partie(historisch);
  const kennt = (team) => sicht(s, team, geraete(team)[0]).verkuendet.some(e => e.runde === 1 && e.staat === "d");
  assert.ok(kennt("oeu")); assert.ok(kennt("d"));
  for (const t of ["r", "f", "gb", "srb"]) assert.ok(!kennt(t), t);
  const offen = ok(s, { typ: "aktenOeffnen", ...L });
  for (const t of ["r", "f", "gb", "srb"]) assert.ok(sicht(offen, t, geraete(t)[0]).verkuendet.some(e => e.runde === 1 && e.staat === "d"), t);
});

test("Spiel: Geheimhaltung – kein Gerät sieht die Karte, Stimmen oder Begründung einer anderen Delegation", () => {
  const { s } = partie(historisch);
  for (const t of TEAMS) {
    const v = JSON.stringify(sicht(s, t.id, geraete(t.id)[0]));
    for (const u of TEAMS) if (u.id !== t.id) assert.ok(!v.includes(`"${u.id}-0"`), `${t.id} sieht Geräte von ${u.id}`);
    assert.ok(!v.includes("zustand"));
  }
});

test("Spiel: Noten – Länge begrenzt, eine freie Note pro Runde, private Noten nur für Absender und Empfänger", () => {
  let s = beitreten(neuesSpiel());
  s = ok(s, { typ: "weiter", ...L }); // Fenster 1
  assert.match(anwenden(s, { typ: "note", geraet: "f-0", an: ["gb"], text: "x".repeat(LIMIT.note + 1) }).fehler, /höchstens/);
  s = ok(s, { typ: "note", geraet: "f-0", an: ["gb"], text: "Wie seht ihr die Lage?" });
  assert.match(anwenden(s, { typ: "note", geraet: "f-1", an: ["r"], text: "Und ihr?" }).fehler, /freie Note/);
  s = ok(s, { typ: "note", geraet: "oeu-0", vorlage: 0, text: "Steht ihr zu uns?" });             // Pflichtnote an D
  assert.equal(lehrerSicht(s).pflichtOffen.length, 0);
  assert.equal(sicht(s, "r", "r-0").noten.length, 0, "Russland sieht keine fremden privaten Noten");
  assert.equal(sicht(s, "d", "d-0").noten.length, 1);
  s = ok(s, { typ: "antwort", geraet: "d-0", note: 2, text: "Ja, wie auch immer ihr vorgeht." });
  assert.equal(sicht(s, "oeu", "oeu-0").noten[0].antworten.length, 1);
  assert.ok(anwenden(s, { typ: "antwort", geraet: "r-0", note: 2, text: "Wir auch!" }).fehler);
});

test("Spiel: Grenze – Ö-U will ohne Vorwarnung angreifen und muss neu entscheiden", () => {
  let s = beitreten(neuesSpiel());
  const zuRunde = (ziel) => { while (!(s.runde === ziel && s.phase.typ === "welle")) {
    if (s.phase.typ === "welle") for (const t of TEAMS) if (sicht(s, t.id, "x").entscheidetJetzt) s = beschliessen(s, t.id, historisch(s.runde, t.id));
    s = ok(s, { typ: "weiter", ...L }); } };
  zuRunde(2);
  for (const t of TEAMS) if (sicht(s, t.id, "x").entscheidetJetzt) s = beschliessen(s, t.id, historisch(2, t.id));
  s = ok(s, { typ: "weiter", ...L }); s = ok(s, { typ: "weiter", ...L });   // Welle 1 → Fenster 2 → Welle 2
  const gs = geraete("oeu");
  s = ok(s, { typ: "begruendung", geraet: gs[0], feld: "verkuendung", text: "Wir greifen an, bevor sich andere einmischen." });
  s = ok(s, { typ: "wann", geraet: gs[0], wahl: "sofort" });
  for (const g of gs) s = ok(s, { typ: "stimme", geraet: g, wahl: "B" });
  s = ok(s, { typ: "beschliessen", geraet: gs[0] });
  const v = sicht(s, "oeu", gs[0]);
  assert.equal(v.grenze.titel, "Die Armee ist nicht bereit");
  assert.ok(anwenden(s, { typ: "stimme", geraet: gs[0], wahl: "B" }).fehler);
  for (const g of gs) s = ok(s, { typ: "stimme", geraet: g, wahl: "A" });
  s = ok(s, { typ: "beschliessen", geraet: gs[0] });
  assert.equal(s.zustand["2.oeu"], "A");
  assert.ok(s.verlauf.at(-1).grenze);
});

test("Spiel: Ausgang – Wien nimmt Serbiens Antwort an, danach geht es mit der Akte 1914 weiter", () => {
  const { s } = partie((r, t) => (r === 3 && t === "oeu") ? "C" : historisch(r, t));
  assert.equal(s.ausgaenge.length, 1);
  assert.equal(s.ausgaenge[0].runde, 3);
  assert.ok(s.ausgaenge[0].saetze.some(x => x.includes("Serbiens Antwort angenommen")));
  assert.equal(s.verlauf.find(e => e.runde === 3 && e.staat === "oeu").wahl, "C", "Die Entscheidung der Klasse bleibt erhalten");
  for (const [k, v] of Object.entries(akte1914(3))) assert.equal(s.zustand[k], v, k);
  assert.equal(s.phase.typ, "ende");
});

test("Spiel: Notfall – die Lehrkraft kann für eine Delegation entscheiden", () => {
  let s = beitreten(neuesSpiel());
  s = ok(s, { typ: "weiter", ...L }); s = ok(s, { typ: "weiter", ...L });
  for (const t of ["d", "srb", "r", "f", "gb"]) s = ok(s, { typ: "lehrerWahl", team: t, wahl: historisch(1, t), ...L });
  s = ok(s, { typ: "weiter", ...L });
  assert.equal(s.verlauf.length, 5);
  assert.ok(anwenden(s, { typ: "lehrerWahl", team: "oeu", wahl: "B" }).fehler, "ohne lehrer: true");
});

test("Spiel: Prognosen werden in der Auswertung mit der tatsächlichen Richtung verglichen", () => {
  let s = beitreten(neuesSpiel());
  s = ok(s, { typ: "weiter", ...L }); s = ok(s, { typ: "weiter", ...L });
  s = ok(s, { typ: "prognose", geraet: "d-0", staat: "oeu", richtung: "hart" });
  s = ok(s, { typ: "prognose", geraet: "d-0", staat: "r", richtung: "ein" });
  assert.match(anwenden(s, { typ: "prognose", geraet: "d-0", staat: "gb", richtung: "ab" }).fehler, /Höchstens/);
  for (const t of ["d", "srb", "r", "f", "gb"]) s = beschliessen(s, t, historisch(1, t));
  s = ok(s, { typ: "weiter", ...L });
  s = beschliessen(s, "oeu", "B");
  const p = auswertung(s).find(e => e.staat === "d").prognosen;
  assert.deepEqual(p.map(x => [x.staat, x.getroffen]), [["oeu", true], ["r", false]]);
});

test("Spiel: 300 zufällige Partien laufen ohne Fehler bis zum Ende, jeder Ausgang mit Grund", () => {
  let x = 7;
  const rnd = () => (x = (x * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let i = 0; i < 300; i++) {
    const { s } = partie(() => "ABC"[Math.floor(rnd() * 3)]);
    assert.equal(s.phase.typ, "ende");
    assert.equal(s.verlauf.length, 30);
    assert.ok(s.ausgaenge.length <= 3);
    for (const aus of s.ausgaenge) assert.ok(aus.saetze.length >= 1, aus.id);
  }
});
